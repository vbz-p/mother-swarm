# Mother Swarm

An eerie pixel-art incremental game for phones. You are one self-aware nanobot in a petri dish. Grow, steer and organize a swarm, stay hidden from the lab, and eat your way out through the glass.

This repository holds two playable prototypes and the design documents behind them:

- **Runs** (`/run/`): the new direction. Short, physical runs: eat, cascade, merge, get sterilized, upgrade, go again.
- **Zone 1** (root): the original management/idle proof of concept, kept for comparison.

## Play

Open `index.html` in a browser. It is a single self-contained file, so it also works on GitHub Pages: enable Pages for this repository, serving from the `main` branch root.

- **Text phase:** HARVEST, SCAN and SEEK to feed blind; LISTEN and PROBE to learn where you are. Install optics when the lab mentions the scope.
- **Microscope:** drag or tap to steer the swarm onto matter. Merge drones into foremen and coordinators.
- **Observation:** the lab's suspicion. Dodge light beams and go DORMANT before it reaches 100%.
- **Breach:** with 2 coordinators, bore through the weak point in the dish rim.

Settings has a ×5 playtest clock and a restart button. Progress saves in the browser.

## Repository

| Path | What it is |
| --- | --- |
| `run/index.html` | **New direction prototype**: 3–4 minute runs, eat, cascade, merge, get sterilized, upgrade (built, do not edit) |
| `src/run.html` | Run prototype source; all tuning numbers are in its `CONFIG` object |
| `docs/new-direction.md` | The new design direction the run prototype follows |
| `tools/runtest.js` | Multi-run playtest for the run prototype: plays runs back to back, buys upgrades, prints % consumed per run |
| `index.html` | The game as served by GitHub Pages (built, do not edit) |
| `src/mother-swarm.html` | Game source, in Claude artifact format |
| `lab/index.html` | Swarm Lab: three test dishes with tuning sliders (built, do not edit) |
| `src/swarm-lab.html` | Swarm Lab source |
| `tools/build_pages.py` | Wraps the sources into standalone `index.html` and `lab/index.html` |
| `docs/design-doc.md` | Game design document, v2 |
| `docs/balance-review.md` | Zone 1 economy review and the changes it led to |
| `tools/playtest.js` | Automated playtest: plays the real game headless and prints a milestone timeline |
| `tools/sim2.py` | Early pacing simulator (superseded by the playtest bot) |

After editing anything in `src/`, rebuild with `python3 tools/build_pages.py` and commit the source and the built files.

The Swarm Lab lives at `/lab/` on the Pages site. Tune the swarm there, press **Copy settings**, and paste the result to Claude to carry it into the game.

Run a playtest with `NODE_PATH=$(npm root -g) node tools/playtest.js index.html good` (policies: `good`, `average`, `casual`, `reckless`; needs Playwright).

Run the simulator with `python3 tools/sim2.py '<json overrides>'`, for example `python3 tools/sim2.py '{"obs_k": 0.18}'`.
