# Dana plan viewer (static)

Served at **`/dana-plan/`** on the portfolio site. Open `https://<your-vercel-url>/dana-plan/` (or `/dana-plan/view-dashboard.html` for at-a-glance) on your phone or computer.

**Versions (all kept in repo):**
- **plan-data-v10.json** — Current. Viewer loads this. Adds Thursday rotation (BPA default, Stairways/Tabor fallback), Sunday alternation (vert / stamina / recon), Saturday B-day on build weeks, recon dates (May 17, May 31, Jun 14, Jul 12), sauna stack window (Wks 19-22), and race-week cut-off targets + carb-load fueling. Built by `outputs/build_v10.py` (reads v9).
- **plan-data-v9.json** — Previous. Re-anchored to "where you're at" mid-March 2026; starts Mar 16. Built from v2 via `node build-v3-full.js`.
- **plan-data-v2.json** — Original Dana plan (Feb 3–Aug 15, 27 weeks, volume-corrected).
- **plan-data.json** — Original from Dana plan repo; not loaded by viewer.

**To refresh after changing the base plan:** Update `plan-data-v2.json` (e.g. copy from Dana plan repo after regenerating there), then run `node build-v3-full.js` to regenerate `plan-data-v9.json`, then redeploy.
