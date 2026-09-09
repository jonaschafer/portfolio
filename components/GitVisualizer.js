'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

/*
 * A small git model that the scenarios below drive.
 *
 * Every panel on screen maps to something real: the graph is the object
 * database, each worktree owns its own working directory and index, and the
 * stash is a repo-wide stack shared by all worktrees. The copy on the page
 * stays out of git's vocabulary, so the model underneath has to be right for
 * any of it to teach.
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
    const c = addCommit(s, `Undo "${src.msg}"`, [headCommit(s)], s.lanes[w.branch] ?? 0, src.files)
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
      'A branch is a bookmark. It is a tiny file with one save point written in it, which is why making one is instant and why you can have a hundred of them lying around.',
    base: seedMain,
    open: 'Three save points, oldest at the top. The black tag shows where you are standing right now.',
    steps: [
      {
        cmd: 'git switch -c feature/cart',
        note: 'You made a second bookmark and stepped onto it. It is sitting on the same save point as main, and nothing on your computer changed, because both bookmarks describe the same version of the project.',
        run: s => { op.branch('feature/cart')(s); op.switchTo('feature/cart')(s) },
      },
      {
        cmd: 'git commit -m "Add cart drawer"',
        note: 'You save your work. The new save point remembers the one that came before it, and your bookmark slides down onto it. main has not moved.',
        run: s => { op.stage('cart/Drawer.tsx')(s); op.commit('Add cart drawer')(s) },
      },
      {
        cmd: 'git commit -m "Add cart badge"',
        note: 'Another save. Every point is chained to the one above it, and following that chain upwards is how git reads your history.',
        run: s => { op.stage('cart/badge.css')(s); op.commit('Add cart badge')(s) },
      },
      {
        cmd: 'git switch main',
        note: 'You step back onto main and git rewrites the files in your folder to match it. The cart files vanish off your computer. They are still saved, they are just not in front of you.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git commit -m "Fix footer link"',
        note: 'The two bookmarks have now gone their own way. They agree on the first three save points, and each one has work the other has never seen.',
        run: s => { op.stage('app/footer.tsx')(s); op.commit('Fix footer link')(s) },
      },
    ],
  },

  {
    id: 'merge',
    label: 'merge',
    title: 'Merging',
    blurb:
      'Merging takes two branches that wandered off in different directions and stitches them back together with one new save point.',
    base: () => apply(seedDiverged(), op.switchTo('feature/cart')),
    open: 'main and the cart branch have drifted apart. The last thing they agreed on was "Add footer".',
    steps: [
      {
        cmd: 'git switch main',
        note: 'A merge lands on whichever branch you are standing on, so step onto the one that should receive the work.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git merge feature/cart',
        note: 'Git finds the last point both sides agreed on, works out what each of them changed since then, and saves one new point that remembers both. Nothing already saved gets touched, so the whole story stays readable afterwards.',
        run: op.merge('feature/cart'),
      },
      {
        cmd: 'git branch -d feature/cart',
        note: 'Deleting the branch just throws away the bookmark. All of that work is still there, hanging off the merge.',
        run: s => { delete s.branches['feature/cart'] },
      },
    ],
  },

  {
    id: 'rebase',
    label: 'rebase',
    title: 'Rebasing',
    blurb:
      'Rebase picks your work up and redoes it on top of the latest version, so your history comes out as one straight line instead of a fork.',
    base: () => apply(seedDiverged(), op.switchTo('feature/cart')),
    open: 'The same drifted-apart history, except this time you are standing on the cart branch.',
    steps: [
      {
        cmd: 'git rebase main',
        note: 'Git takes your two save points, redoes them one at a time on top of main, and writes fresh copies. The IDs change because what came before them changed. The greyed out ones are your originals, and nothing points at them anymore.',
        run: op.rebase('main'),
      },
      {
        cmd: 'git switch main',
        note: 'main is now sitting directly behind your branch instead of off to the side.',
        run: op.switchTo('main'),
      },
      {
        cmd: 'git merge feature/cart',
        note: 'There is nothing left to reconcile, so git just slides the main bookmark forward. That is called a fast-forward, and it leaves you one clean line with no merge point in it.',
        run: op.merge('feature/cart'),
      },
    ],
  },

  {
    id: 'stash',
    label: 'stash',
    title: 'Stashing',
    blurb:
      'Stash is the hold this for a second button. It takes whatever you have half-finished, puts it in a drawer, and hands you back a clean folder.',
    base: seedDiverged,
    open: 'Standing on main, with the cart branch waiting.',
    steps: [
      {
        cmd: 'git switch feature/cart',
        note: 'Back onto the cart branch to keep going.',
        run: op.switchTo('feature/cart'),
      },
      {
        cmd: 'edit cart/Drawer.tsx, cart/total.ts',
        note: 'Two files change. You have lined one of them up to be saved and left the other one alone, which is a pretty normal half-finished state to be in.',
        run: s => {
          op.edit('cart/Drawer.tsx', 'cart/total.ts')(s)
          op.stage('cart/Drawer.tsx')(s)
        },
      },
      {
        cmd: 'git stash push -m "cart totals wip"',
        note: 'Git quietly saves both versions into a drawer and puts your folder back to how it looked at the last save point. Your folder is clean again and nothing got lost.',
        run: op.stashPush('cart totals wip'),
      },
      {
        cmd: 'git switch -c hotfix/logo main',
        note: 'With nothing half-done lying around, hopping onto a fresh branch is safe. The drawer belongs to the whole project, so you can still see it from over here.',
        run: s => { op.switchTo('main')(s); op.branch('hotfix/logo')(s); op.switchTo('hotfix/logo')(s) },
      },
      {
        cmd: 'git commit -m "Swap the logo"',
        note: 'The urgent fix goes out from a clean branch.',
        run: s => { op.stage('app/logo.svg')(s); op.commit('Swap the logo')(s) },
      },
      {
        cmd: 'git switch feature/cart && git stash pop',
        note: 'Pop takes the top thing out of the drawer, puts it back in your folder, and throws the drawer entry away. Both files come back as unsaved changes. If you wanted git to remember which one was lined up to save, that is git stash pop --index.',
        run: s => { op.switchTo('feature/cart')(s); op.stashPop()(s) },
      },
    ],
  },

  {
    id: 'worktree',
    label: 'worktree',
    title: 'Worktrees',
    blurb:
      'A worktree is a second folder on your computer holding a second copy of the same project. Two folders, one shared history.',
    base: seedDiverged,
    open: 'One project, one folder, standing on main.',
    steps: [
      {
        cmd: 'git switch feature/cart',
        note: 'You are partway through something on the cart branch, with a file open and half-edited.',
        run: s => { op.switchTo('feature/cart')(s); op.edit('cart/total.ts')(s) },
      },
      {
        cmd: 'git worktree add ../site-hotfix main',
        note: 'Git makes you a second folder, already set to main. It gets its own files and its own staging box, and it reads the history out of the original project.',
        run: op.worktreeAdd('site-hotfix', 'main'),
      },
      {
        cmd: 'cd ../site-hotfix',
        note: 'Your cart edits are still sitting on disk in the first folder. You did not stash anything and you did not save anything, because nobody went near that folder.',
        run: op.worktreeEnter('site-hotfix'),
      },
      {
        cmd: 'git commit -m "Swap the logo"',
        note: 'A save made over here goes into the shared history, so the first folder can see it straight away.',
        run: s => { op.stage('app/logo.svg')(s); op.commit('Swap the logo')(s) },
      },
      {
        cmd: 'cd ../site && git merge main',
        note: 'Back in the first folder, your cart edits are exactly where you left them, and the logo fix merges in like any other work. One thing worth knowing: two folders cannot sit on the same branch at the same time.',
        run: s => {
          op.worktreeEnter('site')(s)
          op.merge('main')(s)
        },
      },
      {
        cmd: 'git worktree remove ../site-hotfix',
        note: 'Removing a worktree deletes that folder off your computer. Everything it saved stays in the project.',
        run: op.worktreeRemove('site-hotfix'),
      },
    ],
  },

  {
    id: 'cherry-pick',
    label: 'cherry-pick',
    title: 'Cherry-picking',
    blurb:
      'Cherry-pick reaches over to another branch, grabs one save point, and redoes just that change over here.',
    base: seedDiverged,
    open: 'The cart branch has two save points on it. Only the badge fix is wanted on main right now.',
    steps: [
      {
        cmd: 'git log feature/cart --oneline',
        note: 'Find the ID of the one you actually want.',
        run: op.noop(),
      },
      {
        cmd: 'git cherry-pick <badge>',
        note: 'Git works out what that save point changed, applies it to your folder, and saves it. It comes out with a different ID and a different point behind it, so the same change now lives in two places in your history.',
        run: s => {
          const src = s.commits.find(c => c.msg === 'Add cart badge')
          op.cherryPick(src.id)(s)
        },
      },
      {
        cmd: 'git switch feature/cart && git rebase main',
        note: 'When the branch gets rebased later on, git notices the duplicate and quietly drops it, so the badge change does not land twice.',
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
      'Reset drags your bookmark backwards. How much of your actual work comes along with it depends on which version you use.',
    base: () => {
      let s = seedMain()
      s = apply(s, op.stage('app/about.tsx'))
      s = apply(s, op.commit('Add about page'))
      return s
    },
    open: 'The about page got saved a bit early and needs unpicking.',
    steps: [
      {
        cmd: 'git reset --soft HEAD~1',
        note: 'The bookmark moves back one and that is all that happens. The save point is orphaned now, and everything that was inside it has landed in the staging box, waiting to be saved again.',
        run: op.reset('soft', 1),
      },
      {
        cmd: 'git reset',
        note: 'Plain reset pushes those files one box further out. They are still on your computer, they are just no longer lined up to be saved.',
        run: op.reset('mixed', 0),
      },
      {
        cmd: 'git reset --hard',
        note: 'Hard mode overwrites the files in your folder. Anything you had not saved is gone for good, with nothing to get it back from. This is the one to be careful with.',
        run: op.reset('hard', 0),
      },
      {
        cmd: 'git reflog',
        note: 'That orphaned save point is still in git storage for a couple of weeks, and git reflog will hand you its ID, so a soft reset is almost always undoable.',
        run: op.noop(),
      },
    ],
  },

  {
    id: 'revert',
    label: 'revert',
    title: 'Revert',
    blurb:
      'Revert undoes something by doing the exact opposite of it and saving that. Your history only ever grows, which matters a lot once other people have your code.',
    base: () => {
      let s = seedMain()
      s = apply(s, op.stage('app/footer.tsx'))
      s = apply(s, op.commit('Add newsletter form'))
      s = apply(s, op.stage('app/analytics.ts'))
      s = apply(s, op.commit('Add analytics'))
      return s
    },
    open: 'The newsletter form is broken in production, and the branch is already pushed.',
    steps: [
      {
        cmd: 'git revert <newsletter>',
        note: 'Git applies the reverse of that save point and records it as a new one on top. Nothing anybody else already has has changed, so nobody ends up with a broken copy.',
        run: s => {
          const src = s.commits.find(c => c.msg === 'Add newsletter form')
          op.revert(src.id)(s)
        },
      },
      {
        cmd: 'git push',
        note: 'A completely normal push. Had you used reset here you would have needed to force it, and everyone else would have had to go untangle their copy.',
        run: op.noop(),
      },
      {
        cmd: 'git revert <the undo>',
        note: 'Undoing the undo puts the change back, which is how you bring a feature back once somebody has fixed it.',
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

/*
 * Motion here is driven entirely by React keys. An element whose key changes
 * remounts, and mounting is what runs the CSS animation, so a new save point
 * pops in, a bookmark that moved slides onto its new home, and a commit that
 * just lost its last reference fades to grey.
 */
function CommitGraph({ state, prevState, step }) {
  const rows = state.commits
  const maxLane = rows.reduce((m, c) => Math.max(m, c.lane), 0)
  const width = GRAPH_PAD + maxLane * LANE_W + GRAPH_PAD
  const height = rows.length * ROW_H

  const rowOf = id => rows.findIndex(c => c.id === id)
  const yOf = id => rowOf(id) * ROW_H + ROW_H / 2

  const wasThere = id => Boolean(prevState && prevState.commits.some(c => c.id === id))
  const wasDropped = id =>
    Boolean(prevState && prevState.commits.some(c => c.id === id && c.dropped))

  // On the opening frame the whole graph builds itself in, one row at a time.
  const buildDelay = i => (step === 0 ? Math.min(i * 70, 500) : 0)

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
        key: `${pid}-${c.id}-${i}-${c.dropped ? 'x' : 'o'}`,
        d,
        color: LANE_COLORS[(i === 0 ? c.lane : p.lane) % LANE_COLORS.length],
        faded: c.dropped || p.dropped,
        fresh: !wasThere(c.id),
        delay: buildDelay(rowOf(c.id)),
      })
    })
  })

  return (
    <div className="relative" style={{ minHeight: height }}>
      <svg width={width} height={height} className="absolute left-0 top-0" aria-hidden="true">
        {edges.map(e => (
          <path
            key={e.key}
            d={e.d}
            fill="none"
            stroke={e.color}
            strokeWidth="1.5"
            strokeDasharray={e.faded ? '3 3' : undefined}
            opacity={e.faded ? 0.3 : 1}
            className={e.fresh && !e.faded ? 'git-draw' : undefined}
            style={e.fresh && !e.faded ? { animationDelay: `${e.delay}ms` } : undefined}
          />
        ))}
        {rows.map(c => {
          const color = LANE_COLORS[c.lane % LANE_COLORS.length]
          const fresh = !wasThere(c.id)
          const justDropped = c.dropped && !wasDropped(c.id)
          return (
            <circle
              key={`${c.id}-${c.dropped ? 'x' : 'o'}`}
              cx={laneX(c.lane)}
              cy={yOf(c.id)}
              r={c.parents.length > 1 ? 6.5 : 5.5}
              fill={c.dropped || c.parents.length > 1 ? '#ffffff' : color}
              stroke={color}
              strokeWidth={c.dropped ? 1 : 2}
              strokeDasharray={c.dropped ? '2 2' : undefined}
              opacity={c.dropped ? 0.35 : 1}
              className={fresh ? 'git-pop' : justDropped ? 'git-grey' : undefined}
              style={{
                transformOrigin: `${laneX(c.lane)}px ${yOf(c.id)}px`,
                animationDelay: fresh ? `${buildDelay(rowOf(c.id))}ms` : undefined,
              }}
            />
          )
        })}
      </svg>

      <div style={{ paddingLeft: width + 12 }}>
        {rows.map(c => {
          const tips = Object.keys(state.branches).filter(b => state.branches[b] === c.id)
          const head = activeTree(state)
          const fresh = !wasThere(c.id)
          const justDropped = c.dropped && !wasDropped(c.id)
          return (
            <div
              key={`${c.id}-${c.dropped ? 'x' : 'o'}`}
              className={`flex items-center gap-[10px] ${
                fresh ? 'git-row' : justDropped ? 'git-grey' : ''
              }`}
              style={{
                height: ROW_H,
                opacity: c.dropped ? 0.35 : 1,
                animationDelay: fresh ? `${buildDelay(rowOf(c.id))}ms` : undefined,
              }}
            >
              <span
                className={`font-mono text-[12px] tracking-[0.02em] ${
                  c.dropped ? 'text-black/40 line-through' : 'text-black/45'
                }`}
              >
                {c.id}
              </span>
              <span className="font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[16.44px] tracking-[0.17px] text-black whitespace-nowrap">
                {c.msg}
              </span>
              {tips.map(b => {
                const color = LANE_COLORS[(state.lanes[b] ?? 0) % LANE_COLORS.length]
                const isHead = !head.detached && head.branch === b
                const otherTree = state.worktrees.find(w => !w.active && w.branch === b)

                // If this bookmark used to sit somewhere else, start it up there
                // and let it slide down onto its new save point.
                const prevTip = prevState ? prevState.branches[b] : undefined
                const prevRow = prevTip ? rowOf(prevTip) : -1
                const travel = prevRow >= 0 ? (prevRow - rowOf(c.id)) * ROW_H : 0

                return (
                  <span
                    key={`${b}-${isHead ? 'head' : 'plain'}`}
                    className="flex items-center gap-[4px]"
                  >
                    <span
                      className="px-[7px] py-[2px] rounded-[4px] text-[11px] font-mono whitespace-nowrap git-tag"
                      style={{
                        border: `1px solid ${color}`,
                        color: isHead ? '#ffffff' : color,
                        background: isHead ? color : '#ffffff',
                        '--git-from-y': `${travel}px`,
                      }}
                    >
                      {isHead ? `you are here → ${b}` : b}
                    </span>
                    {otherTree && (
                      <span className="px-[6px] py-[2px] rounded-[4px] text-[11px] font-mono text-black/45 border border-dashed border-black/25 whitespace-nowrap git-pop">
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

function Panel({ title, term, hint, children, empty }) {
  return (
    <div className="border border-black/12 rounded-[6px] p-[14px]">
      <div className="flex items-baseline justify-between gap-3 mb-[8px]">
        <span className="flex flex-col">
          <h3 className="font-['Haas_Grot_Disp',_sans-serif] text-[13px] text-black">{title}</h3>
          {term && <span className="font-mono text-[10.5px] text-black/30">{term}</span>}
        </span>
        {hint && <span className="font-mono text-[11px] text-black/30 text-right">{hint}</span>}
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
        <li key={f} className="flex items-center gap-[8px] git-file">
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
      <Panel title="You are here" term="HEAD" hint={headCommit(state) || 'nothing saved yet'}>
        <p className="font-mono text-[13px] text-black">
          {w.detached ? `floating at ${w.branch}` : w.branch}
        </p>
      </Panel>

      <Panel
        title="Your folder"
        term="working directory"
        hint={w.workdir.length ? `${w.workdir.length} changed` : null}
        empty="nothing changed"
      >
        {w.workdir.length ? <FileList files={w.workdir} tone="#8c4a2f" /> : null}
      </Panel>

      <Panel
        title="Lined up to save"
        term="staging area"
        hint={w.index.length ? `${w.index.length} waiting` : null}
        empty="nothing lined up"
      >
        {w.index.length ? <FileList files={w.index} tone="#435938" /> : null}
      </Panel>

      <Panel title="The drawer" term="stash" empty="empty">
        {state.stash.length ? (
          <ul className="flex flex-col gap-[8px]">
            {state.stash.map((e, i) => (
              <li key={`${e.msg}-${i}`} className="flex flex-col gap-[2px] git-file">
                <span className="font-mono text-[12px] text-black">{e.msg}</span>
                <span className="font-mono text-[11px] text-black/45 break-all">
                  from {e.from}: {[...e.index, ...e.workdir].join(', ')}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <Panel
        title="Folders on your computer"
        term="worktrees"
        hint={state.worktrees.length > 1 ? 'one history' : null}
      >
        <ul className="flex flex-col gap-[6px]">
          {state.worktrees.map(t => {
            const dirty = t.workdir.length + t.index.length
            return (
              <li key={t.path} className="flex flex-col git-file">
                <span className="flex items-center gap-[8px]">
                  <span
                    className={`font-mono text-[12px] ${t.active ? 'text-black' : 'text-black/55'}`}
                  >
                    {t.active ? '› ' : '  '}../{t.path}
                  </span>
                  <span className="font-mono text-[11px] text-black/45">[{t.branch}]</span>
                </span>
                <span className="font-mono text-[11px] text-black/35 pl-[14px]">
                  {dirty ? `${dirty} unsaved` : 'nothing unsaved'}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}

/* The comparison people actually ask about. */

const FOLDER_CONTENTS = {
  'feature/cart': ['cart/Drawer.tsx', 'cart/badge.css', 'app/nav.tsx'],
  main: ['app/logo.svg', 'app/footer.tsx', 'app/nav.tsx'],
}

function Folder({ label, branch, files, animKey, muted }) {
  return (
    <div className="border border-black/15 rounded-[6px] overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-2 px-[12px] py-[8px] border-b border-black/10 bg-black/[0.02]">
        <span className="font-mono text-[12px] text-black">{label}</span>
        <span
          key={`${animKey}-tag`}
          className={`font-mono text-[11px] px-[6px] py-[2px] rounded-[3px] border git-swap ${
            muted ? 'text-black/45 border-black/20' : 'text-white border-transparent'
          }`}
          style={muted ? undefined : { background: LANE_COLORS[1] }}
        >
          {branch}
        </span>
      </div>
      <ul className="px-[12px] py-[10px] flex flex-col gap-[5px] min-h-[86px]">
        {files.map((f, i) => (
          <li
            key={`${animKey}-${f}`}
            className="font-mono text-[11.5px] text-black/65 git-swap"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function BranchVsWorktree() {
  const [branch, setBranch] = useState('feature/cart')
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    }
    const t = setInterval(() => {
      setBranch(b => (b === 'main' ? 'feature/cart' : 'main'))
    }, 2600)
    return () => clearInterval(t)
  }, [auto])

  const flip = () => {
    setAuto(false)
    setBranch(b => (b === 'main' ? 'feature/cart' : 'main'))
  }

  return (
    <section className="mt-[72px] max-w-[1000px]">
      <h2 className="font-['Mondwest',_sans-serif] text-[24px] md:text-[28px] leading-[1.2] tracking-[0.31px]">
        So what is the difference between a branch and a worktree?
      </h2>
      <p className="mt-[10px] max-w-[720px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[20px] tracking-[0.17px] text-black/70">
        This is the one that took me the longest to get straight, so here it is side by side. Both
        of these are the same project with the same history sitting behind them.
      </p>

      <div className="mt-[28px] grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <div className="border border-black/12 rounded-[6px] p-[18px] flex flex-col">
          <h3 className="font-['Mondwest',_sans-serif] text-[19px] leading-[1.2] tracking-[0.31px]">
            A branch
          </h3>
          <p className="mt-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[18px] tracking-[0.17px] text-black/70">
            You have one folder on your computer. When you switch branches, git swaps out what is
            inside it. Watch the file names change.
          </p>

          <div className="mt-[16px]">
            <Folder
              label="~/site"
              branch={branch}
              files={FOLDER_CONTENTS[branch]}
              animKey={branch}
            />
          </div>

          <div className="mt-[12px] flex items-center gap-[10px]">
            <button
              type="button"
              onClick={flip}
              className="px-[10px] py-[5px] rounded-[4px] border border-black/25 text-[12px] font-mono hover:border-black/60"
            >
              switch branch
            </button>
            <span className="font-mono text-[11px] text-black/35">
              {auto ? 'switching on its own' : 'your turn'}
            </span>
          </div>

          <p className="mt-auto pt-[18px] border-t border-black/10 font-['Haas_Grot_Disp',_sans-serif] text-[13px] leading-[18px] text-black/60">
            When to reach for one: basically always. This is the normal way to work on something off
            to the side.
          </p>
        </div>

        <div className="border border-black/12 rounded-[6px] p-[18px] flex flex-col">
          <h3 className="font-['Mondwest',_sans-serif] text-[19px] leading-[1.2] tracking-[0.31px]">
            A worktree
          </h3>
          <p className="mt-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[18px] tracking-[0.17px] text-black/70">
            You have two folders, each with its own copy of the files, both reading from that same
            history. Nothing gets swapped when you walk between them.
          </p>

          <div className="mt-[16px] flex flex-col gap-[10px]">
            <Folder
              label="~/site"
              branch="feature/cart"
              files={FOLDER_CONTENTS['feature/cart']}
              animKey="wt-cart"
              muted
            />
            <Folder
              label="~/site-hotfix"
              branch="main"
              files={FOLDER_CONTENTS.main}
              animKey="wt-main"
              muted
            />
          </div>

          <p className="mt-auto pt-[18px] border-t border-black/10 font-['Haas_Grot_Disp',_sans-serif] text-[13px] leading-[18px] text-black/60">
            When to reach for one: when you are mid-thought and do not want to put it down. An
            urgent fix, or running two versions at once so you can compare them.
          </p>
        </div>
      </div>

      <p className="mt-[24px] max-w-[720px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[20px] tracking-[0.17px] text-black/70">
        It is the same project either way. A branch changes what is inside your folder, and a
        worktree hands you another folder to work in.
      </p>
    </section>
  )
}

export default function GitVisualizer() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const scenario = useMemo(() => SCENARIOS.find(s => s.id === scenarioId), [scenarioId])
  const frames = useMemo(() => buildFrames(scenario), [scenario])
  const frame = frames[step]
  const prevFrame = step > 0 ? frames[step - 1] : null
  const atEnd = step >= frames.length - 1

  const go = useCallback(
    delta => {
      setPlaying(false)
      setStep(prev => Math.min(frames.length - 1, Math.max(0, prev + delta)))
    },
    [frames.length]
  )

  useEffect(() => {
    if (!playing) return
    if (step >= frames.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep(s => s + 1), 3000)
    return () => clearTimeout(t)
  }, [playing, step, frames.length])

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
    setPlaying(true)
  }

  return (
    <div className="font-mono bg-white text-black min-h-screen text-[13px] leading-[1.6]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-[60px] pb-[80px]">
        <header className="max-w-[900px]">
          <h1 className="font-['Mondwest',_sans-serif] text-[28px] md:text-[38px] leading-[1.15] tracking-[0.31px]">
            Git, drawn out
          </h1>
          <p className="mt-[14px] font-['Haas_Grot_Disp',_sans-serif] text-[14px] leading-[20px] tracking-[0.17px] text-black/70">
            I have used git for years and still could not have told you what rebase actually does to
            my work. So I drew it. Pick a command below and watch it play, or step through it
            yourself. The dots are the save points in your project, and the boxes on the right are
            the stuff git is quietly shuffling around while you type. No git knowledge needed.
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
              <CommitGraph
                key={scenarioId}
                state={frame.state}
                prevState={prevFrame ? prevFrame.state : null}
                step={step}
              />
            </div>
          </div>

          <aside className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div key={scenarioId}>
              <StatePanels state={frame.state} />
            </div>
            <p className="mt-[14px] font-['Haas_Grot_Disp',_sans-serif] text-[12px] leading-[17px] text-black/40">
              The greyed out, dashed save points are orphans. Nothing is pointing at them anymore,
              but they sit in git storage for a couple of weeks, which is why you can usually get
              them back.
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
                  onClick={() => {
                    if (atEnd) setStep(0)
                    setPlaying(atEnd ? true : !playing)
                  }}
                  className="px-[10px] py-[4px] rounded-[4px] border border-black/25 text-[12px] hover:border-black/60 min-w-[62px]"
                >
                  {playing ? 'pause' : atEnd ? 'replay' : 'play'}
                </button>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="px-[10px] py-[4px] rounded-[4px] border border-black/25 text-[12px] disabled:opacity-30 hover:border-black/60"
                >
                  &larr;
                </button>
                <span className="font-mono text-[11px] text-black/45 tabular-nums">
                  {step} / {frames.length - 1}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={atEnd}
                  className="px-[10px] py-[4px] rounded-[4px] border border-black/25 text-[12px] disabled:opacity-30 hover:border-black/60"
                >
                  &rarr;
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
                      onClick={() => { setPlaying(false); setStep(i) }}
                      className={`w-full text-left px-[12px] py-[10px] rounded-[4px] border transition-colors ${
                        on
                          ? 'border-black/70 bg-black/[0.03]'
                          : 'border-transparent hover:bg-black/[0.02]'
                      }`}
                    >
                      <span
                        className={`font-mono text-[12.5px] ${on ? 'text-black' : 'text-black/50'}`}
                      >
                        {f.cmd ? `$ ${f.cmd}` : 'where we start'}
                      </span>
                      {on && (
                        <span
                          key={`${scenarioId}-${i}`}
                          className="block mt-[6px] font-['Haas_Grot_Disp',_sans-serif] text-[13.4px] leading-[18px] tracking-[0.17px] text-black/70 git-row"
                        >
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

        <BranchVsWorktree />
      </div>
    </div>
  )
}
