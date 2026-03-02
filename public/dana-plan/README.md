# Dana plan viewer (static)

Served at **`/dana-plan/`** on the portfolio site. Open `https://<your-vercel-url>/dana-plan/` (or `/dana-plan/view-dashboard.html` for at-a-glance) on your phone or computer.

**Versions (all kept in repo):**
- **plan-data-v3.json** — Current. Viewer loads this. Plan re-anchored to “where you’re at”: starts Mar 2–8 (28 mi / 5k ft), includes BPA test week (Mar 23–29, 3 BPA repeats, aim 21:30–23:00/min), then continues through race Aug 15. MWF maintenance circuits throughout (Mon: hip flexors + adductors, Wed: reactive + knee, Fri: abductors + posterior chain). **Build:** `node build-v3-full.js` (reads v2, never modifies it).
- **plan-data-v2.json** — Original Dana plan (Feb 3–Aug 15, 27 weeks, volume-corrected). Unchanged when building v3.
- **plan-data.json** — Original from Dana plan repo; not loaded by viewer.

**To refresh v3 after changing the base plan:** Update `plan-data-v2.json` (e.g. copy from Dana plan repo after regenerating there), then run `node build-v3-full.js` to regenerate `plan-data-v3.json`, then redeploy.
