# Mother Swarm

An eerie pixel-art incremental game for phones. You are one self-aware nanobot in a petri dish. Grow, steer and organize a swarm, stay hidden from the lab, and eat your way out through the glass.

This repository holds a playable proof of concept of **zone 1 (the petri dish)** and the design documents behind it.

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
| `index.html` | The game as served by GitHub Pages (built, do not edit) |
| `src/mother-swarm.html` | Game source, in Claude artifact format |
| `tools/build_pages.py` | Wraps the source into a standalone `index.html` |
| `docs/design-doc.md` | Game design document, v2 |
| `docs/balance-review.md` | Zone 1 economy review and the changes it led to |
| `tools/sim2.py` | Pacing simulator for the zone 1 economy |

After editing `src/mother-swarm.html`, rebuild with `python3 tools/build_pages.py` and commit both files.

Run the simulator with `python3 tools/sim2.py '<json overrides>'`, for example `python3 tools/sim2.py '{"obs_k": 0.18}'`.
