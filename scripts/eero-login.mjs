#!/usr/bin/env node
// One-time local bootstrap for the /typing → eero WiFi integration.
//
// Run this yourself, on your own machine — do NOT run it in CI or a sandbox,
// it needs a live OTP code sent to your phone/email:
//
//   node scripts/eero-login.mjs
//
// It walks eero's unofficial login flow (the same one Home Assistant's eero
// integration and other open-source eero clients use) and prints the values
// you need to copy into Vercel's project environment variables. It never
// writes anything to disk and never logs these values anywhere but this
// terminal — copy them from here directly into Vercel.

import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const API_BASE = 'https://api-user.e2ro.com/2.2'

const rl = createInterface({ input: stdin, output: stdout })
const ask = (q) => rl.question(q)

async function call(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 's-token': token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`)
  }
  return json
}

function printJSON(label, value) {
  console.log(`\n--- ${label} ---`)
  console.log(JSON.stringify(value, null, 2))
}

async function main() {
  console.log('eero login bootstrap — values print to this terminal only, nothing is saved.\n')

  const login = await ask('Eero account phone or email: ')
  const loginRes = await call('/login', { method: 'POST', body: { login } })
  const userToken = loginRes?.data?.user_token ?? loginRes?.data?.token
  if (!userToken) {
    printJSON('Unexpected /login response', loginRes)
    throw new Error('Could not find a token in the /login response — see raw JSON above.')
  }
  console.log('\neero just sent a one-time code to your phone/email.')

  const code = await ask('Enter that code: ')
  const verifyRes = await call('/login/verify', {
    method: 'POST',
    token: userToken,
    body: { code },
  })
  printJSON('/login/verify response', verifyRes)

  // eero's API is unofficial and undocumented, so the verify response shape
  // isn't guaranteed — the token issued at /login is the one known to keep
  // working as the session token post-verification; fall back to it if
  // verify doesn't hand back something more specific.
  const sessionToken = verifyRes?.data?.session_token ?? verifyRes?.data?.token ?? userToken

  console.log(`\nSESSION TOKEN — copy to Vercel env var EERO_SESSION_TOKEN:\n${sessionToken}`)

  const account = await call('/account', { token: sessionToken })
  printJSON('/account response (your network(s) are below)', account)

  const networks = account?.data?.networks?.data ?? []
  if (networks.length === 0) {
    console.log('\nNo networks found in the /account response — inspect the raw JSON above.')
  }

  for (const net of networks) {
    const networkId = net?.url?.split('/').filter(Boolean).pop() ?? net?.id
    console.log(`\nNetwork "${net?.name ?? '(unnamed)'}" — id/url: ${net?.url ?? networkId}`)
    console.log(`  -> copy to Vercel env var EERO_NETWORK_ID: ${networkId}`)
    if (!networkId) continue

    try {
      const profiles = await call(`/networks/${networkId}/profiles`, { token: sessionToken })
      printJSON(
        `Profiles for network ${networkId} — copy each id to EERO_PROFILE_ID_<KID>`,
        profiles
      )
    } catch (err) {
      console.error(`Could not fetch profiles for network ${networkId}:`, err.message)
    }
  }

  console.log('\nDone. Copy the values above into the Vercel project\'s environment variables:')
  console.log('  EERO_SESSION_TOKEN, EERO_NETWORK_ID, EERO_PROFILE_ID_KID1, EERO_PROFILE_ID_KID2')
  console.log('  (match the KID1/KID2 suffix to the profile ids in lib/typingConfig.js)')
  console.log('\nNothing was written to disk or logged anywhere but this terminal.')
}

main()
  .catch((err) => {
    console.error('\nFailed:', err.message)
    process.exitCode = 1
  })
  .finally(() => rl.close())
