# Mother Swarm — New Direction

2026-10-25

## Summary

Mother Swarm moves from a management-heavy idle game to short, physical runs where one action makes the screen react hugely. The original design doc still holds for tone, art, hierarchy tiers and the skill tree; this doc overrides it where they conflict.

The problem: most systems in the original design are management (hierarchy menus, steering, a meter to keep low), so the moment-to-moment play is a number going up. The reference games, Unharvest and Sir, We Have an Orc Problem, feel good because a single verb produces a big visible reaction, runs are short, and losing still moves you forward.

**New loop in one line:** steer, eat, cascade, merge, grow, get sterilized, upgrade, go again, eating more of the dish each run.

## Design changes

Six changes, in priority order. The first one is the game; polish it before building anything else.

### 1. Eating is the core feeling

When the swarm touches a matter deposit, the deposit cracks, shatters into particles, and the particles are sucked into the swarm. Each absorbed particle becomes a new drone on the spot, so the swarm visibly grows from what it just ate. Harvesting is no longer a counter ticking up.

### 2. Chain reactions

Some deposits are unstable. Eating one makes it burst and spray fragments into nearby deposits, which burst in turn. One well-aimed move can cascade across the dish. This rewards aim and positioning instead of waiting.

### 3. Observation becomes the run timer

Observation is no longer a penalty meter to keep low. Each run is a 3–4 minute breach that always ends: the lab notices, and a sterilization sweep (UV light) wipes the dish. The player keeps blueprints, spends them on upgrades, and starts a new run stronger. Losing is the rhythm, not a failure state. Growth still speeds up Observation, so greed shortens the run.

### 4. Merging is a physical event

No promote button. When enough drones crowd together, they collapse inward into a Foreman: a pulse, a shockwave ring, a low thud, a small screen shake. A Foreman is a larger pixel with drones orbiting it. Higher tiers (Coordinator, Overseer) work the same way, with bigger effects. The hierarchy is visible on the dish, not in a menu.

### 5. One or two big active abilities

- **Consume pulse:** the swarm contracts, then bursts outward and devours everything in a radius. Cooldown-based.
- **Collapse:** pull the whole swarm into a tight dark ball to survive a UV sweep. Dodging the beam is a skill moment.

### 6. The screen shows progress

Show a percent-consumed counter for the dish. As the swarm grows it covers the dish in veins and spirals, so the player sees a screen that started empty and is now theirs. Between runs, show how far this run got compared with the best run.

## Prototype scope

The first build is one complete run plus a minimal upgrade screen, enough to judge whether the loop is fun.

**Build**

- [ ] Petri dish play area, portrait phone layout, touch input
- [ ] Swarm follows the finger (drag to steer)
- [ ] Matter deposits that shatter and get absorbed, spawning drones
- [ ] Unstable deposits that trigger chain reactions
- [ ] Drone → Foreman merge with pulse, shockwave, sound and screen shake
- [ ] Consume pulse ability with cooldown
- [ ] Observation timer ending in a UV sterilization sweep
- [ ] Percent-consumed counter
- [ ] End-of-run screen: blueprints earned, best run, 3–5 simple upgrades, restart

**Cut for now** (keep in the design doc for later)

- Specializations (harvesters, builders, thinkers, diplomats)
- Energy resource; matter and drones only
- Full skill tree, zones beyond the petri dish, prestige splitting
- Rival swarms, breach operations, MS-DOS text intro
- Collapse ability (add once the sweep exists and feels fair)

## Notes for Claude Code

Build for feel first: a rough game with great eating and merging beats a complete game that feels flat.

**Implementation hints**

- Single HTML5 canvas, plain JavaScript; no engine needed for the prototype.
- Render drones as particles in typed arrays so thousands stay smooth on a phone (target 60 fps at 2,000+ drones).
- Simple flocking toward the touch point (cohesion, separation, seek); keep the original doc's eerie look: near-black, sickly cyan, one warning red for the sweep.
- Pixel-art scale: render to a small canvas and scale up with nearest-neighbour.
- Keep all tuning numbers (run length, merge threshold, pulse radius, cooldowns, upgrade costs) in one config object.

**Juice checklist**

- Hit-stop of a few frames on merges and big cascades
- Absorb sound pitch rises with combo size
- Screen shake scaled to event size, never constant
- Floating +N numbers on cascades
- The swarm slowly pulses, faster as it grows
- Silence for a beat before the sweep starts

**Playtest checks**

- Does eating one deposit feel good with sound off?
- Does a player want to restart immediately after the sweep?
- Does run 3 reach clearly further than run 1?
- Is a full run 3–4 minutes?
