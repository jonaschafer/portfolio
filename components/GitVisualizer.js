'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

/*
 * A small git model that the scenarios below drive.
 *
 * The point is that every panel on screen maps to something real: the commit
 * graph is the object database, each worktree owns its own working directory
 * and index, and the stash is a repo-wide stack shared by all worktrees.
 */

const HASHES = [
  'a1c9f2', 'b7d3e1', 'c4f8a0', 'd2e6b5', 'e9a4c7', 'f3b1d8',
  '0c7e5a', '1d8f3b', '2a5c9e', '3b6d0f', '4e2a7c', '5f9b1d',
  '6c0e8a', '7a3f2b', '8b4d6e', '9e1c5f', 'ab72d4', 'bc93e6',
  'cd04f7', 'de15a8', 'ef26b9', 'f037ca',
]

const LANE_COLORS = ['#1a1a1a', '#435938', '#8c4a2f', '#3a5a80']

const ROW_H = 58
const LANE_W = 26
const GRAPH_PAD = 18

function clone(state) {
  return JSON.parse(JSON.stringify(state))
}

function byId(s, id) {
  return s.commits.find(c => c.id === id)
}

function activeTree(s) {
  return s.worktrees.find(w => w.active)
}

function headCommit(s) {
  const w = activeTree(s)
  return w.detached ? w.branch : s.branches[w.branch]
}

function newHash(s) {
  const h = HASHES[s.hashIdx % HASHES.length]
  s.hashIdx += 1
  return h
}

function addCommit(s, msg, parents, lane, files) {
  const c = { id: newHash(s), msg, parents: parents.filter(Boolean), lane, files: files || [] }
  s.commits.push(c)
  return c
}

function ancestors(s, id) {
  const seen = new Set()
  const stack = [id]
  while (stack.length) {
    const x = stack.pop()
    if (!x || seen.has(x)) continue
    seen.add(x)
    const c = byId(s, x)
    if (c) stack.push(...c.parents)
  }
  return seen
}

function isAncestor(s, a, b) {
  return ancestors(s, b).has(a)
}

function commitsBetween(s, from, to) {
  const skip = ancestors(s, from)
  const reach = ancestors(s, to)
  return s.commits.filter(c => reach.has(c.id) && !skip.has(c.id))
}

function nthParent(s, id, n) {
  let cur = id
  for (let i = 0; i < n; i += 1) {
    const c = byId(s, cur)
    if (!c || !c.parents.length) break
    cur = c.parents[0]
  }
  return cur
}

/* Operations. Each returns a function that mutates a cloned state. */

const op = {
  edit: (...files) => s => {
    const w = activeTree(s)
    files.forEach(f => {
      if (!w.workdir.includes(f) && !w.index.includes(f)) w.workdir.push(f)
    })
  },

  stage: (...files) => s => {
    const w = activeTree(s)
    files.forEach(f => {
      w.workdir = w.workdir.filter(x => x !== f)
      if (!w.index.includes(f)) w.index.push(f)
    })
  },

  commit: msg => s => {
    const w = activeTree(s)
    const lane = s.lanes[w.branch] ?? 0
    const c = addCommit(s, msg, [headCommit(s)], lane, w.index)
    if (w.detached) w.branch = c.id
    else s.branches[w.branch] = c.id
    w.index = []
  },

  branch: name => s => {
    s.branches[name] = headCommit(s)
    s.lanes[name] = s.nextLane
    s.nextLane += 1
  },

  switchTo: name => s => {
    const w = activeTree(s)
    w.branch = name
    w.detached = false
  },

  merge: name => s => {
    const w = activeTree(s)
    const target = s.branches[name]
    const cur = headCommit(s)
    if (isAncestor(s, cur, target)) {
      s.branches[w.branch] = target
      return
    }
    const lane = s.lanes[w.branch] ?? 0
    const c = addCommit(s, `Merge branch '${name}'`, [cur, target], lane, [])
    s.branches[w.branch] = c.id
  },

  rebase: onto => s => {
    const w = activeTree(s)
    const upstream = s.branches[onto]
    const list = commitsBetween(s, upstream, headCommit(s))
    let base = upstream
    list.forEach(c => {
      const nc = addCommit(s, c.msg, [base], s.lanes[w.branch] ?? 0, c.files)
      nc.replayOf = c.id
      base = nc.id
      c.dropped = true
    })
    s.branches[w.branch] = base
  },

  cherryPick: id => s => {
    const w = activeTree(s)
    const src = byId(s, id)
    const c = addCommit(s, src.msg, [headCommit(s)], s.lanes[w.branch] ?? 0, src.files)
    c.copyOf = id
    s.branches[w.branch] = c.id
  },

  revert: id => s => {
    const w = activeTree(s)
    const src = byId(s, id)
    const c = addCommit(s, `Revert "${src.msg}"`, [headCommit(s)], s.lanes[w.branch] ?? 0, src.files)
    c.revertOf = id
    s.branches[w.branch] = c.id
  },

  reset: (mode, back) => s => {
    const w = activeTree(s)
    const cur = headCommit(s)
    const target = nthParent(s, cur, back)
    const removed = back > 0 ? commitsBetween(s, target, cur) : []
    const files = []
    removed.forEach(c => {
      c.dropped = true
      c.files.forEach(f => { if (!files.includes(f)) files.push(f) })
    })
    s.branches[w.branch] = target

    if (mode === 'soft') {
      files.forEach(f => { if (!w.index.includes(f)) w.index.push(f) })
    } else if (mode === 'mixed') {
      const carried = [...files, ...w.index]
      w.index = []
      carried.forEach(f => { if (!w.workdir.includes(f)) w.workdir.push(f) })
    } else {
      w.index = []
      w.workdir = []
    }
  },

  stashPush: msg => s => {
    const w = activeTree(s)
    s.stash.unshift({ msg, workdir: [...w.workdir], index: [...w.index], from: w.branch })
    w.workdir = []
    w.index = []
  },

  stashPop: () => s => {
    const w = activeTree(s)
    const entry = s.stash.shift()
    if (!entry) return
    const restored = [...entry.index, ...entry.workdir]
    restored.forEach(f => { if (!w.workdir.includes(f)) w.workdir.push(f) })
  },

  worktreeAdd: (path, branch) => s => {
    s.worktrees.push({ path, branch, detached: false, workdir: [], index: [], active: false })
  },

  worktreeEnter: path => s => {
    s.worktrees.forEach(w => { w.active = w.path === path })
  },

  worktreeRemove: path => s => {
    s.worktrees = s.worktrees.filter(w => w.path !== path)
    if (!s.worktrees.some(w => w.active)) s.worktrees[0].active = true
  },

  noop: () => () => {},
}

function apply(state, run) {
  const next = clone(state)
  run(next)
  return next
}

/* Base states the scenarios start from. */

function emptyState() {
  return {
    commits: [],
    branches: {},
    lanes: { main: 0 },
    nextLane: 1,
    hashIdx: 0,
    stash: [],
    worktrees: [
      { path: 'site', branch: 'main', detached: false, workdir: [], index: [], active: true },
    ],
  }
}

function seedMain() {
  let s = emptyState()
  s.branches.main = null
  const build = [
    op.stage('package.json', 'app/layout.tsx'),
    op.commit('Set up the project'),
    op.stage('app/nav.tsx'),
    op.commit('Add site nav'),
    op.stage('app/footer.tsx'),
    op.commit('Add footer'),
  ]
  build.forEach(run => { s = apply(s, run) })
  return s
}

function seedDiverged() {
  let s = seedMain()
  const build = [
    op.branch('feature/cart'),
    op.switchTo('feature/cart'),
    op.stage('cart/Drawer.tsx'),
    op.commit('Add cart drawer'),
    op.stage('cart/badge.css'),
    op.commit('Add cart badge'),
    op.switchTo('main'),
    op.stage('app/footer.tsx'),
    op.commit('Fix footer link'),
  ]
  build.forEach(run => { s = apply(s, run) })
  return s
}

/* Scenarios. */

const SCENARIOS = [
  {
    id: 'branch',
    label: 'branch',
    title: 'Branching',
    blurb:
      'A branch is a file containing one commit hash. Creating one writes 41 bytes, so it costs nothing and copies nothing.',
    base: seedMain,
    open: 'Three commits on main. HEAD points at the branch, and the branch points at the newest commit.',
    steps: [
      {
        cmd: 'git switch -c feature/cart',
        note: 'A second pointer now sits on the same commit as main. The working directory is untouched because both branches describe the same snapshot.',
        run: s => { op.branch('feature/cart')(s); op.switchTo('feature/cart')(s) },
      },
      {
        cmd: 'git commit -m "Add cart drawer"',
        note: 'The new commit records its parent, then feature/cart advances to it. main stays where it was.',
        run: s => { op.stage('cart/Drawer.tsx')(s); op.commit('Add cart drawer')(s) },
      },
      {
        cmd: 'git commit -m "Add cart badge"',
        note: 'Each commit points backwards at its parent, which is how the history reads as a chain.',
        run: s => { op.stage('cart/badge.css')(s); op.commit('Add cart badge')(s) },
      },
      {
        cmd: 'git switch main',
        note: 'HEAD moves back to main and git rewrites the working directory to match that commit. The cart files disappear from disk while staying safe in the object database.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git commit -m "Fix footer link"',
        note: 'Now the two branches have diverged. They share three commits of history and each has commits the other lacks.',
        run: s => { op.stage('app/footer.tsx')(s); op.commit('Fix footer link')(s) },
      },
    ],
  },

  {
    id: 'merge',
    label: 'merge',
    title: 'Merging',
    blurb:
      'Merge joins two histories with a commit that has two parents, so both lines of work stay readable afterwards.',
    base: () => apply(seedDiverged(), op.switchTo('feature/cart')),
    open: 'main and feature/cart have diverged. Their common ancestor is the "Add footer" commit.',
    steps: [
      {
        cmd: 'git switch main',
        note: 'Merges land on the branch you are standing on, so start by checking out the branch that should receive the work.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git merge feature/cart',
        note: 'Git finds the common ancestor, combines the two sets of changes, and writes a commit with two parents. Both branches now point into the same graph and nothing was rewritten.',
        run: op.merge('feature/cart'),
      },
      {
        cmd: 'git branch -d feature/cart',
        note: 'Deleting the branch only removes the pointer. The commits stay reachable through the merge commit.',
        run: s => { delete s.branches['feature/cart'] },
      },
    ],
  },

  {
    id: 'rebase',
    label: 'rebase',
    title: 'Rebasing',
    blurb:
      'Rebase replays your commits onto a new base. The originals stay in the object database until garbage collection, but they lose their name.',
    base: () => {
      let s = seedDiverged()
      s = apply(s, op.switchTo('feature/cart'))
      return s
    },
    open: 'Same diverged history, this time standing on feature/cart.',
    steps: [
      {
        cmd: 'git rebase main',
        note: 'Git takes the two commits unique to feature/cart, applies them one at a time on top of main, and writes new commits. The hashes change because the parent changed. The faded commits are the originals, now unreachable.',
        run: op.rebase('main'),
      },
      {
        cmd: 'git switch main',
        note: 'main is now an ancestor of feature/cart, which sets up the simplest possible merge.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git merge feature/cart',
        note: 'With nothing to reconcile, git just slides main forward. This is a fast-forward, and it leaves a linear history with no merge commit.',
        run: op.merge('feature/cart'),
      },
    ],
  },

  {
    id: 'stash',
    label: 'stash',
    title: 'Stashing',
    blurb:
      'Stash parks unfinished work as real commits on a hidden stack, so you can switch branches with a clean tree.',
    base: seedDiverged,
    open: 'On main, with the cart branch waiting.',
    steps: [
      {
        cmd: 'git switch feature/cart',
        note: 'Back on the cart branch to keep working.',
        run: op.switchTo('feature/cart'),
      },
      {
        cmd: 'edit cart/Drawer.tsx, cart/total.ts',
        note: 'Two files change. One gets staged, one stays in the working directory, which is a normal half-finished state.',
        run: s => {
          op.edit('cart/Drawer.tsx', 'cart/total.ts')(s)
          op.stage('cart/Drawer.tsx')(s)
        },
      },
      {
        cmd: 'git stash push -m "cart totals wip"',
        note: 'Git writes commits for the index and the working tree, pushes them onto the stash stack, then resets both back to the last commit. The tree is clean again.',
        run: op.stashPush('cart totals wip'),
      },
      {
        cmd: 'git switch -c hotfix/logo main',
        note: 'With nothing dirty, switching branches is safe. The stash is repo-wide, so it stays visible from here.',
        run: s => { op.switchTo('main')(s); op.branch('hotfix/logo')(s); op.switchTo('hotfix/logo')(s) },
      },
      {
        cmd: 'git commit -m "Swap the logo"',
        note: 'The urgent fix ships from a clean branch.',
        run: s => { op.stage('app/logo.svg')(s); op.commit('Swap the logo')(s) },
      },
      {
        cmd: 'git switch feature/cart && git stash pop',
        note: 'Pop applies the top entry and drops it from the stack. Both files come back as unstaged changes, since restoring the staged/unstaged split takes git stash pop --index.',
        run: s => { op.switchTo('feature/cart')(s); op.stashPop()(s) },
      },
    ],
  },

  {
    id: 'worktree',
    label: 'worktree',
    title: 'Worktrees',
    blurb:
      'A worktree is a second checkout of the same repository. Separate directory and index, one shared object database.',
    base: seedDiverged,
    open: 'One repository, one checkout, sitting on main.',
    steps: [
      {
        cmd: 'git switch feature/cart',
        note: 'Work in progress on the cart branch, with a file open and half-edited.',
        run: s => { op.switchTo('feature/cart')(s); op.edit('cart/total.ts')(s) },
      },
      {
        cmd: 'git worktree add ../site-hotfix main',
        note: 'Git creates a second directory checked out to main. It gets its own working directory and its own index, and it reads commits from the original .git directory.',
        run: op.worktreeAdd('site-hotfix', 'main'),
      },
      {
        cmd: 'cd ../site-hotfix',
        note: 'The cart edits are still on disk in the first worktree. Nothing was stashed and nothing was committed, because that directory was never touched.',
        run: op.worktreeEnter('site-hotfix'),
      },
      {
        cmd: 'git commit -m "Swap the logo"',
        note: 'A commit made here lands in the shared object database, so the first worktree can see it immediately.',
        run: s => { op.stage('app/logo.svg')(s); op.commit('Swap the logo')(s) },
      },
      {
        cmd: 'cd ../site && git merge main',
        note: 'Back in the first worktree, the cart edits are exactly where they were, and the hotfix merges in like any other commit. Note that two worktrees cannot check out the same branch at once.',
        run: s => {
          op.worktreeEnter('site')(s)
          op.merge('main')(s)
        },
      },
      {
        cmd: 'git worktree remove ../site-hotfix',
        note: 'Removing a worktree deletes its directory and its administrative files. The commits it made stay in the repository.',
        run: op.worktreeRemove('site-hotfix'),
      },
    ],
  },

  {
    id: 'cherry-pick',
    label: 'cherry-pick',
    title: 'Cherry-picking',
    blurb:
      'Cherry-pick copies the change a commit introduced onto your current branch as a brand new commit.',
    base: seedDiverged,
    open: 'The cart branch has two commits. Only the badge fix is wanted on main right now.',
    steps: [
      {
        cmd: 'git log feature/cart --oneline',
        note: 'Find the hash of the one commit worth taking.',
        run: op.noop(),
      },
      {
        cmd: 'git cherry-pick <badge>',
        note: 'Git computes the diff that commit introduced and applies it to your working directory, then commits it. The new commit has a different hash and a different parent, so the same change now exists twice in the graph.',
        run: s => {
          const src = s.commits.find(c => c.msg === 'Add cart badge')
          op.cherryPick(src.id)(s)
        },
      },
      {
        cmd: 'git switch feature/cart && git rebase main',
        note: 'When the branch is later rebased, git notices the duplicate change and drops it, so the badge commit does not land twice.',
        run: s => {
          op.switchTo('feature/cart')(s)
          const upstream = s.branches.main
          const list = commitsBetween(s, upstream, s.branches['feature/cart'])
          let base = upstream
          list.forEach(c => {
            c.dropped = true
            if (c.msg === 'Add cart badge') return
            const nc = addCommit(s, c.msg, [base], s.lanes['feature/cart'], c.files)
            nc.replayOf = c.id
            base = nc.id
          })
          s.branches['feature/cart'] = base
        },
      },
    ],
  },

  {
    id: 'reset',
    label: 'reset',
    title: 'Reset',
    blurb:
      'Reset moves the branch pointer. The mode decides how much of the working directory and index move with it.',
    base: () => {
      let s = seedMain()
      s = apply(s, op.stage('app/about.tsx'))
      s = apply(s, op.commit('Add about page'))
      return s
    },
    open: 'The about page was committed too early and needs unpicking.',
    steps: [
      {
        cmd: 'git reset --soft HEAD~1',
        note: 'Only the branch pointer moves. The commit is now unreachable, and everything it contained is sitting in the index, ready to be committed again.',
        run: op.reset('soft', 1),
      },
      {
        cmd: 'git reset',
        note: 'A plain reset is the mixed mode. It moves the files out of the index and leaves them in the working directory, still on disk and now unstaged.',
        run: op.reset('mixed', 0),
      },
      {
        cmd: 'git reset --hard',
        note: 'Hard mode overwrites the working directory to match the commit. Uncommitted edits are gone with no way back, which is the one genuinely destructive part of reset.',
        run: op.reset('hard', 0),
      },
      {
        cmd: 'git reflog',
        note: 'The dropped commit is still in the object database and the reflog still has its hash for a couple of weeks, so a soft reset is recoverable even after this.',
        run: op.noop(),
      },
    ],
  },

  {
    id: 'revert',
    label: 'revert',
    title: 'Revert',
    blurb:
      'Revert undoes a commit by adding another commit that applies the inverse change, which keeps shared history stable.',
    base: () => {
      let s = seedMain()
      s = apply(s, op.stage('app/footer.tsx'))
      s = apply(s, op.commit('Add newsletter form'))
      s = apply(s, op.stage('app/analytics.ts'))
      s = apply(s, op.commit('Add analytics'))
      return s
    },
    open: 'The newsletter form is broken in production and the branch is already pushed.',
    steps: [
      {
        cmd: 'git revert <newsletter>',
        note: 'Git applies the reverse of that commit and records the result as a new commit on top. History only grows, so anyone who already pulled this branch is unaffected.',
        run: s => {
          const src = s.commits.find(c => c.msg === 'Add newsletter form')
          op.revert(src.id)(s)
        },
      },
      {
        cmd: 'git push',
        note: 'A normal push, because nothing that was published has changed. Reset would have needed a force push here and would have broken every clone.',
        run: op.noop(),
      },
      {
        cmd: 'git revert <the revert>',
        note: 'Reverting the revert reapplies the original change, which is how you bring a feature back once it is fixed.',
        run: s => {
          const src = s.commits.filter(c => c.revertOf).slice(-1)[0]
          op.revert(src.id)(s)
        },
      },
    ],
  },
]

function buildFrames(scenario) {
  const frames = [{ cmd: null, note: scenario.open, state: scenario.base() }]
  scenario.steps.forEach(step => {
    frames.push({
      cmd: step.cmd,
      note: step.note,
      state: apply(frames[frames.length - 1].state, step.run),
    })
  })
  return frames
}

/* Rendering. */

function laneX(lane) {
  return GRAPH_PAD + lane * LANE_W
}

function CommitGraph({ state }) {
  const rows = state.commits
  const maxLane = rows.reduce((m, c) => Math.max(m, c.lane), 0)
  const width = GRAPH_PAD + maxLane * LANE_W + GRAPH_PAD
  const height = rows.length * ROW_H

  const yOf = id => {
    const i = rows.findIndex(c => c.id === id)
    return i * ROW_H + ROW_H / 2
  }

  const edges = []
  rows.forEach(c => {
    c.parents.forEach((pid, i) => {
      const p = byId(state, pid)
      if (!p) return
      const px = laneX(p.lane)
      const py = yOf(pid)
      const cx = laneX(c.lane)
      const cy = yOf(c.id)
      const d =
        px === cx
          ? `M ${px} ${py} L ${cx} ${cy}`
          : `M ${px} ${py} C ${px} ${py + (cy - py) * 0.55}, ${cx} ${cy - (cy - py) * 0.55}, ${cx} ${cy}`
      edges.push({
        key: `${pid}-${c.id}-${i}`,
        d,
        color: LANE_COLORS[(i === 0 ? c.lane : p.lane) % LANE_COLORS.length],
        faded: c.dropped || p.dropped,
      })
    })
  })

  return (
    <div className="relative" style={{ minHeight: height }}>
      <svg
        width={width}
        height={height}
        className="absolute left-0 top-0"
        aria-hidden="true"
      >
        {edges.map(e => (
          <path
            key={e.key}
            d={e.d}
            fill="none"
            stroke={e.color}
            strokeWidth="1.5"
            strokeDasharray={e.faded ? '3 3' : undefined}
            opacity={e.faded ? 0.3 : 1}
          />
        ))}
        {rows.map(c => {
          const color = LANE_COLORS[c.lane % LANE_COLORS.length]
          return (
            <circle
              key={c.id}
              cx={laneX(c.lane)}
              cy={yOf(c.id)}
              r={c.parents.length > 1 ? 6.5 : 5.5}
              fill={c.dropped ? '#ffffff' : c.parents.length > 1 ? '#ffffff' : color}
              stroke={color}
              strokeWidth={c.dropped ? 1 : 2}
              strokeDasharray={c.dropped ? '2 2' : undefined}
              opacity={c.dropped ? 0.35 : 1}
            />
          )
        })}
      </svg>

      <div style={{ paddingLeft: width + 12 }}>
        {rows.map(c => {
          const tips = Object.keys(state.branches).filter(b => state.branches[b] === c.id)
          const head = activeTree(state)
          return (
            <div
              key={c.id}
              className="flex items-center gap-[10px]"
              style={{ height: ROW_H, opacity: c.dropped ? 0.35 : 1 }}
            >
              <span
                className={`font-mono text-[12px] tracking-[0.02em] ${
                  c.dropped ? 'text-black/40 line-through' : 'text-black/45'
                }`}
              >
                {c.id}
              </span>
              <span className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] tracking-[0.17px] text-black">
                {c.msg}
              </span>
              {tips.map(b => {
                const color = LANE_COLORS[(state.lanes[b] ?? 0) % LANE_COLORS.length]
                const isHead = !head.detached && head.branch === b
                const otherTree = state.worktrees.find(w => !w.active && w.branch === b)
                return (
                  <span key={b} className="flex items-center gap-[4px]">
                    <span
                      className="px-[7px] py-[2px] rounded-[4px] text-[11px] font-mono whitespace-nowrap"
                      style={{
                        border: `1px solid ${color}`,
                        color: isHead ? '#ffffff' : color,
                        background: isHead ? color : '#ffffff',
                      }}
                    >
                      {isHead ? `HEAD → ${b}` : b}
                    </span>
                    {otherTree && (
                      <span className="px-[6px] py-[2px] rounded-[4px] text-[11px] font-mono text-black/45 border border-dashed border-black/25 whitespace-nowrap">
                        ../{otherTree.path}
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Panel({ title, hint, children, empty }) {
  return (
    <div className="border border-black/12 rounded-[6px] p-[14px]">
      <div className="flex items-baseline justify-between gap-3 mb-[8px]">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">{title}</h3>
        {hint && (
          <span className="font-mono text-[11px] text-black/30 text-right">{hint}</span>
        )}
      </div>
      {children || (
        <p className="font-['Haas_Grot_Disp',_sans-serif] text-[12.5px] text-black/35">{empty}</p>
      )}
    </div>
  )
}

function FileList({ files, tone }) {
  return (
    <ul className="flex flex-col gap-[4px]">
      {files.map(f => (
        <li key={f} className="flex items-center gap-[8px]">
          <span
            className="inline-block w-[6px] h-[6px] rounded-full shrink-0"
            style={{ background: tone }}
          />
          <span className="font-mono text-[12px] text-black/75 break-all">{f}</span>
        </li>
      ))}
    </ul>
  )
}

function StatePanels({ state }) {
  const w = activeTree(state)
  return (
    <div className="flex flex-col gap-[12px]">
      <Panel title="HEAD" hint={headCommit(state) || 'unborn'}>
        <p className="font-mono text-[13px] text-black">
          {w.detached ? `detached at ${w.branch}` : w.branch}
        </p>
      </Panel>

      <Panel
        title="Working directory"
        hint={w.workdir.length ? `${w.workdir.length} changed` : null}
        empty="clean"
      >
        {w.workdir.length ? <FileList files={w.workdir} tone="#8c4a2f" /> : null}
      </Panel>

      <Panel
        title="Index"
        hint={w.index.length ? `${w.index.length} staged` : null}
        empty="nothing staged"
      >
        {w.index.length ? <FileList files={w.index} tone="#435938" /> : null}
      </Panel>

      <Panel title="Stash" empty="empty stack">
        {state.stash.length ? (
          <ul className="flex flex-col gap-[8px]">
            {state.stash.map((e, i) => (
              <li key={i} className="flex flex-col gap-[2px]">
                <span className="font-mono text-[12px] text-black">
                  stash@{'{'}{i}{'}'} {e.msg}
                </span>
                <span className="font-mono text-[11px] text-black/45 break-all">
                  on {e.from}: {[...e.index, ...e.workdir].join(', ')}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <Panel title="Worktrees" hint={state.worktrees.length > 1 ? 'shared objects' : null}>
        <ul className="flex flex-col gap-[6px]">
          {state.worktrees.map(t => {
            const dirty = t.workdir.length + t.index.length
            return (
              <li key={t.path} className="flex flex-col">
                <span className="flex items-center gap-[8px]">
                  <span
                    className={`font-mono text-[12px] ${t.active ? 'text-black' : 'text-black/55'}`}
                  >
                    {t.active ? '› ' : '  '}../{t.path}
                  </span>
                  <span className="font-mono text-[11px] text-black/45">[{t.branch}]</span>
                </span>
                <span className="font-mono text-[11px] text-black/35 pl-[14px]">
                  {dirty ? `${dirty} uncommitted` : 'clean'}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}

export default function GitVisualizer() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [step, setStep] = useState(0)

  const scenario = useMemo(
    () => SCENARIOS.find(s => s.id === scenarioId),
    [scenarioId]
  )
  const frames = useMemo(() => buildFrames(scenario), [scenario])
  const frame = frames[step]

  const go = useCallback(
    delta => setStep(prev => Math.min(frames.length - 1, Math.max(0, prev + delta))),
    [frames.length]
  )

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const pick = id => {
    setScenarioId(id)
    setStep(0)
  }

  return (
    <div className="font-mono bg-white text-black min-h-screen text-[13px] leading-[1.6]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-[60px] pb-[80px]">
        <header className="max-w-[900px]">
          <h1 className="font-['Mondwest',_sans-serif] text-[28px] md:text-[38px] leading-[1.15] tracking-[0.31px]">
            Git, drawn out
          </h1>
          <p className="mt-[14px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[20px] tracking-[0.17px] text-black/70">
            I kept re-learning what rebase actually does to my commits, so I drew it. Pick a command
            and step through it. The graph is the object database, the panels on the right are the
            things git rearranges underneath, and every frame is generated by a small model of git
            rather than a stored picture.
          </p>
        </header>

        <nav className="flex flex-wrap gap-[6px] mt-[32px]" aria-label="Git commands">
          {SCENARIOS.map(s => {
            const on = s.id === scenarioId
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s.id)}
                className={`px-[12px] py-[6px] rounded-[4px] border text-[13px] font-mono transition-colors ${
                  on
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black/70 border-black/25 hover:border-black/60 hover:text-black'
                }`}
              >
                git {s.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-[28px] max-w-[720px]">
          <h2 className="font-['Mondwest',_sans-serif] text-[22px] leading-[1.2] tracking-[0.31px]">
            {scenario.title}
          </h2>
          <p className="mt-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[18px] tracking-[0.17px] text-black/70">
            {scenario.blurb}
          </p>
        </div>

        <div className="mt-[32px] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-[32px] items-start">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="border border-black/12 rounded-[6px] p-[18px] overflow-x-auto">
              <CommitGraph state={frame.state} />
            </div>
          </div>

          <aside className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <StatePanels state={frame.state} />
            <p className="mt-[14px] font-['Haas_Grot_Disp',_sans-serif] text-[12px] leading-[17px] text-black/40">
              Dashed and faded commits are unreachable. They stay in the object database until
              garbage collection runs, which is why the reflog can usually get them back.
            </p>
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div className="flex items-center justify-between gap-3 mb-[10px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                Steps
              </span>
              <span className="flex items-center gap-[6px]">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="px-[10px] py-[4px] rounded-[4px] border border-black/25 text-[12px] disabled:opacity-30 hover:border-black/60"
                >
                  ←
                </button>
                <span className="font-mono text-[11px] text-black/45 tabular-nums">
                  {step} / {frames.length - 1}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={step === frames.length - 1}
                  className="px-[10px] py-[4px] rounded-[4px] border border-black/25 text-[12px] disabled:opacity-30 hover:border-black/60"
                >
                  →
                </button>
              </span>
            </div>

            <ol className="flex flex-col gap-[2px]">
              {frames.map((f, i) => {
                const on = i === step
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      className={`w-full text-left px-[12px] py-[10px] rounded-[4px] border transition-colors ${
                        on
                          ? 'border-black/70 bg-black/[0.03]'
                          : 'border-transparent hover:bg-black/[0.02]'
                      }`}
                    >
                      <span
                        className={`font-mono text-[12.5px] ${
                          on ? 'text-black' : 'text-black/50'
                        }`}
                      >
                        {f.cmd ? `$ ${f.cmd}` : 'starting point'}
                      </span>
                      {on && (
                        <span className="block mt-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[18px] tracking-[0.17px] text-black/70">
                          {f.note}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
