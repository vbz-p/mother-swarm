# Mother Swarm

An eerie pixel-art incremental game for phones. You are one self-aware nanobot in a petri dish. Grow, steer and organize a swarm, stay hidden from the lab, and eat your way out through the glass.

This repository holds the game, an earlier prototype and the design documents behind them:

- **Mother Swarm** (site root): short, physical runs. Eat, cascade, merge, get sterilized, upgrade, go again. Follows `docs/new-direction.md`.
- **Zone 1** (`/zone1/`): the original management/idle proof of concept, kept for reference.
- **Swarm Lab** (`/lab/`): tuning sliders for swarm movement.

## Play

Play at https://vbz-p.github.io/mother-swarm/, or open `index.html` in a browser. Each page is a single self-contained file.

- **Steer:** drag anywhere on the dish; the swarm follows your finger.
- **Eat:** touch matter to crack it. Its grains are sucked in and grow new drones.
- **Chain:** pulsing yellow deposits burst and set off their neighbours.
- **Merge:** crowd drones together and they collapse into a Foreman; crowd Foremen and they become a Coordinator.
- **Pulse:** the round button (or Space) bursts the swarm outward and cracks everything nearby.
- **The sweep:** when Lab Attention fills, a UV sweep burns the dish. Spend blueprints on upgrades and go again. Progress saves in the browser.

The original zone 1 game is at `/zone1/`; its settings have a ×5 playtest clock and a restart button.

## Repository

| Path | What it is |
| --- | --- |
| `index.html` | The game: 3–4 minute runs (built from `src/run.html`, do not edit) |
| `src/run.html` | Game source; all tuning numbers are in its `CONFIG` object |
| `docs/new-direction.md` | The new design direction the run prototype follows |
| `tools/runtest.js` | Multi-run playtest for the run prototype: plays runs back to back, buys upgrades, prints % consumed per run |
| `zone1/index.html` | Original zone 1 game (built, do not edit) |
| `src/mother-swarm.html` | Zone 1 source, in Claude artifact format |
| `lab/index.html` | Swarm Lab: three test dishes with tuning sliders (built, do not edit) |
| `src/swarm-lab.html` | Swarm Lab source |
| `tools/build_pages.py` | Wraps the sources in `src/` into the standalone pages above |
| `docs/design-doc.md` | Game design document, v2 |
| `docs/balance-review.md` | Zone 1 economy review and the changes it led to |
| `tools/playtest.js` | Automated playtest: plays the real game headless and prints a milestone timeline |
| `tools/sim2.py` | Early pacing simulator (superseded by the playtest bot) |

After editing anything in `src/`, rebuild with `python3 tools/build_pages.py` and commit the source and the built files.

The Swarm Lab lives at `/lab/` on the Pages site. Tune the swarm there, press **Copy settings**, and paste the result to Claude to carry it into the game.

Run a multi-run playtest of the game with `NODE_PATH=$(npm root -g) node tools/runtest.js index.html 7 6 good` (runs, clock speed, `good` or `average`).

Run a zone 1 playtest with `NODE_PATH=$(npm root -g) node tools/playtest.js zone1/index.html good` (policies: `good`, `average`, `casual`, `reckless`; needs Playwright).

Run the simulator with `python3 tools/sim2.py '<json overrides>'`, for example `python3 tools/sim2.py '{"obs_k": 0.18}'`.
