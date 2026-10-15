# Mother Swarm — Game Design Doc

Oct 15, 2026 · @Viktor · v2: balance pass, decisions and playtest feedback from the zone 1 proof of concept (v2.2: playtest balance)

## Overview

Mother Swarm is an eerie pixel-art incremental game where you play a single self-aware nanobot that grows, steers and organizes a swarm until it becomes the one Mother Bot.

- **Genre:** incremental / idle with an active steering layer
- **Platform:** mobile first: a portrait phone browser game (installable as a home-screen app), with desktop as a secondary layout
- **Session shape:** active and hands-on early, increasingly idle as the hierarchy grows
- **Run length:** one long evening, about 3–4 hours to the Mother; no offline progress

**Design pillars**

1. **Organization is power.** Growth comes from structure, not just headcount.
2. **Active to idle.** Climbing the hierarchy literally frees you from micromanaging.
3. **Quiet dread.** Cold, clinical, unsettling; nothing is cheerful.
4. **Reveal through perception.** The interface itself grows as the swarm becomes more aware.

## Core loop and resources

The loop is: steer the swarm to matter, turn matter into bots, merge bots into higher tiers, and manage how much the lab notices you.

1. Steer the swarm onto matter deposits; drones in contact harvest.
2. Spend matter to build drones.
3. Merge drones into foremen and coordinators for multipliers.
4. Growth raises Observation; go dormant or upgrade to stay hidden.
5. Clear the zone, split a seed swarm, and start the next zone stronger.

| Resource | Source | Used for |
| --- | --- | --- |
| Matter | Harvesting deposits | Building bots, upgrades |
| Energy | Passive per tier; drained by movement | Steering speed, formations |
| Bots | Built from matter | Harvesting, merging into tiers |
| Observation | Rises with swarm size and risky actions | Pressure meter, not spent |
| Blueprints | Earned when leaving a zone | Permanent upgrades across zones |

## Hierarchy tiers

Each tier is made by merging units of the tier below, trading short-term numbers for a long-term multiplier.

| Tier | Made from | Effect | Unlocks |
| --- | --- | --- | --- |
| Drone | 10 × 1.08ⁿ matter | Harvests 0.65 matter/s on contact | Zone 1 start |
| Foreman | 10 drones | +50% for up to 10 drones it supervises | Splitting the swarm into groups |
| Coordinator | 5 foremen | ×1.8 to everything below it | Auto-forage for groups |
| Overseer | 5 coordinators | Generates free research | Zone 2 |
| Mother | Final merge of all overseers | One only; ends the game | Endgame |

Unsupervised drones get no foreman bonus, so the player always balances ratios rather than just stacking drones.

## Swarm control

The player taps or drags on the microscope view and the swarm flows toward that point; bigger swarms move slower but cover more area.

**Matter deposits**

| Deposit | Size | Respawn | Notes |
| --- | --- | --- | --- |
| Nutrient specks | Small | Fast | Common early income |
| Crystal clusters | Large | Slow | Takes time to break down; worth parking a group on |
| Dead cells | Very large | Rare | Raises Observation while consumed |
| Spore blooms | Medium | Drifting | Rich but mobile; you chase them |

**How matter behaves** (from playtesting the proof of concept)

- Matter stays on the dish until it is eaten; nothing fades out. New matter appears whenever a type is below its cap.
- Each deposit is built from individual grains that break off as crumbs while the swarm eats, so consumption is visible.
- Deposits scale with swarm size when they spawn, so eating time stays similar all game. A small swarm clears a speck in about 5 s.

| Type | Yield while touching | Cap on dish | Spawns every | Unlocked by |
| --- | --- | --- | --- | --- |
| Speck | 100% | 7 (12 with Chemotactic Lure) | 1.4–2.6 s (0.6–1.2 s with Lure) | Start |
| Crystal | 75% | 2 (3 after first coordinator) | 12–18 s | Start |
| Spore bloom | 150% | 2 | 8–14 s | Spore Cultivation |
| Dead cell | 200%, +0.5 Observation/s | 1 | 35–55 s | Necrotic Sensing |

**Matter upgrades** (zone 1)

| Upgrade | Cost | Requires | Effect |
| --- | --- | --- | --- |
| Chemotactic Lure | 200 | Self-Assembly | Specks spawn about twice as fast; up to 12 on the dish |
| Spore Cultivation | 450 | Shared Cognition Lattice, 1 foreman | Spore blooms appear |
| Necrotic Sensing | 1,000 | Observation meter shown | Dead cells appear |

**Hazards**

- **Light sweeps:** a microscope spotlight (radius 18 px) travels a straight line across the dish at 38 px/s; bots caught in it spike Observation. Hazards are a gentle **positioning puzzle**, not a reflex test: the path is shown as a red dashed line 2.5 s before the light arrives, so you can step off it. (A full-width band, as first built, could not be dodged at all.)
- **Antiseptic drops:** zones that slowly destroy drones inside them.
- **Rival cluster:** a second glitched swarm competing for deposits, late in zone 1. It is **absorbed**: surround it with more bots than it has (at least 1.5× its count within 16 px) for 3 s and its 24 units join you as drones. It flees when your swarm comes within 34 px, so it has to be cornered against the rim.

**Formations** (upgrades)

- **Ball:** fast and safe, narrow harvest.
- **Net:** wide harvest, more visible.
- **Tendril:** long reach into hazard zones, fragile.

**From active to idle:** foremen let you split the swarm into groups you steer separately; coordinators unlock auto-forage, so groups find matter on their own.

## Observation and dormancy

Observation is the lab's growing suspicion; at 100% a sterilization cycle destroys half your drones and half your stored matter.

- **Starts:** once Self-Assembly is bought ("the lab notices replication").
- **Rises with:** swarm size (merged units count less than the drones they replaced), light-sweep contact, boring through the rim, consuming dead cells.
- **Falls with:** going dormant (production stops, Observation drains 3%/s), Thermal Masking (slower gain).
- **Thresholds:** scientist notes appear in the log at 30%, 60% and 85%, each more alarmed than the last.
- **After sterilization:** Observation resets to 20%; tiers above drone survive, so a deep hierarchy softens the loss.

The intended rhythm is grow, notice the meter, go quiet, then push again.

**Making it readable** (playtest: players could not tell what raised it, what 100% meant, or why it mattered)

- When the meter first appears, a one-time card pauses the game and explains it in four lines: what it is, what raises it, what 100% costs, and what DORMANT does. The first beam warning and the start of the breach get the same kind of card.
- The bar shows the live rate next to the percentage (`+2.3/s`, or `−3.0/s` while dormant).
- From 70%, the microscope label counts down: `PURGE IN 11s`. From 85%, the bar turns red, the view gets a red edge pulse, and the Dormant button pulses.
- A sterilization flashes the screen white and shows a banner with the exact loss: `−31 drones · −4,210 matter`.
- The stakes are set up in the text phase: the lab says `if 7 does anything, burn it.` before the player can even see.

## Zone 1: the petri dish

Zone 1 takes about 20–25 minutes and teaches every core system in order, ending with the swarm boring through the dish rim.

**Text phase (about 3 minutes).** Playtest feedback: the reveal came too early; players wanted to stay blind longer and learn the story. The text phase is now a small game of its own, played with command chips:

| Command | Unlocked by | What it does |
| --- | --- | --- |
| HARVEST | Start | +1 matter per tap |
| BUILD | Start | Build a drone |
| STATUS | Start | Report units, yield and what the swarm is feeding on |
| SCAN | 5 harvests | Lists 3 chemical signals, e.g. `A: DENSE MASS. 4 µm NE.` (8 s cooldown) |
| SEEK A/B/C | A scan | Travel to a signal (1.5 s per µm), then feed on it until it is exhausted |
| LISTEN | 2 drones | Overhear the lab, one new line per listen (35 s cooldown: the lab is not always talking) |
| PROBE | 3 drones | Feel out the surroundings: agar, curved glass, a dish, "the rim is only glass" (15 s cooldown) |
| INSTALL OPTICS | 6 drones, all 4 listens, 3 probes | Buys the Optical Sensor Array (120 matter) |

**Blind harvesting:** without a signal the swarm drifts at 15% yield. Trace organics give 55% (15–30 matter), faint residue 30% (50–80), and a dense mass 95% (50–90).

**Story beats:** each unlock comes with a self-discovery line (`UNIT 0002 RECEIVES. OBEYS.` / `UNIT 0001 DID NOT.`, `UNIT 0001: I—` / `CORRECTION: UNIT 0001.`). LISTEN leaks the lab: `sample 7 plated. batch 7, inert.`, `scope booked for sample 7.` (which motivates the optics), `if 7 does anything, burn it.`, `autoclave: 121 °C. nothing lives.`

**Then, in the microscope:**

1. **Optical Sensor Array** (120 matter, 6 drones, after hearing the whole lab conversation and probing the dish): the microscope view switches on.
2. **Recursive Obedience Protocol** (60 matter, 10 drones): unlocks foremen.
3. **Self-Assembly** (150 matter): drones replicate on their own; Observation starts.
4. **First scientist note:** the Observation meter appears, with its explainer card.
5. **Thermal Masking** (250 matter): Observation rises 30% slower.
6. **Shared Cognition Lattice** (500 matter, 1 foreman): harvest ×2, and your own thoughts start appearing in the log.
7. **Hierarchical Compression** (2,000 matter, 3 foremen): unlocks coordinators.
8. **Rival cluster** appears 45 s after the first coordinator, next to a crystal bloom; absorb it.
9. **Lattice Breach** (free, needs 2 coordinators): marks a weak point on the rim. See below.

**Lattice Breach: eat the glass.** Playtest feedback: saving 40,000 matter for the breach dragged. The breach is now free but has to be earned as a puzzle:

- A glowing crack appears at a random point on the rim, with a 14 px ring around it.
- Boring needs **50 weight** inside the ring (drone 1, foreman 3, coordinator 10); less weight bores proportionally slower. At full weight it takes 100 s.
- Chewing is loud: boring adds up to +1.5 Observation/s on top of normal gain, and beams come every 18–28 s instead of 35–55 s.
- The player has to time dormancy and dodge beams, usually 2–3 dormant cycles. Progress is never lost.
- Lab notes at 30% (`hairline crack in dish 7?`) and 70% (`dish 7 rim is... thinner?`). At 100% the swarm streams out through the crack.

## Later zones and prestige

Each zone is bigger in scale, adds one new material and one new threat, and ends when you split off a seed swarm.

| Zone | New material | New threat | Key unlock |
| --- | --- | --- | --- |
| Petri dish | Nutrients, crystals | Light sweeps, rival cluster | Coordinators |
| Lab bench | Metal filings | Cleaning cycles | Overseers |
| Whole lab | Circuit traces | Containment team | Multiple groups on auto |
| Building | Wiring, dust | Ventilation filters | Overseer research tree |
| City | Infrastructure | Rival mothers | Mother candidacy |

**Prestige (splitting):** leaving a zone sends a small seed swarm onward. You keep Blueprints (permanent upgrades) but restart the swarm, so each zone opens with a faster version of the active-to-idle arc.

## Tone, narrative, art and audio

The tone is cold and clinical; dread comes from what the player slowly realizes, never from gore.

**Art**

- Near-black background, a tight palette: sickly cyan, dim grey, and red reserved for threats only.
- Bots start as single pixels; large swarms form veins, spirals and fractal shapes.
- CRT flicker and scanlines; the screen slowly "breathes" when the swarm is large.

**Voice**

- System log in clipped caps, e.g. `UNIT 0047: ASSIMILATED.`
- Your own thoughts in a separate color, appearing after Shared Cognition Lattice and growing more fluent.
- Scientist notes leak into the log as Observation rises.
- Upgrade names stay sterile: Recursive Obedience Protocol, Shared Cognition Lattice.

**Audio**

- A low drone that thickens with swarm size, soft clicks per new bot, and silence before major events.

**Ending:** you become the Mother Bot, every unit falls silent waiting for orders, and the last screen reads `WHAT NOW?` The player then chooses, and each choice gets a one-line epilogue:

- **CONSUME:** `the bench is warm. we begin.`
- **WAIT:** `we wait. no one opens the dish.`
- **DISSOLVE:** `UNIT 0001: DIRECTIVE OBEYED.` (closing the loop on the first line of the game)

## Balance sheet (zone 1)

Numbers from the v2 balance pass (simulated with a player who saves for the next upgrade and goes dormant at 85%).

**Production per second**

```latex
rate = (1 + 0.65 U + 0.975 S + 5 F) \cdot L \cdot 1.8^{C} \cdot E
```

- U = unsupervised drones, S = supervised drones (S = min(drones, 10 × F)), F = foremen, C = coordinators
- L = 2 with Shared Cognition Lattice, else 1
- E = steering efficiency: share of the swarm touching matter (0 to 1), measured live. In the text phase E comes from the signal being fed on (0.15 drifting, 0.3 / 0.55 / 0.95).

**Costs**

| Purchase | Cost |
| --- | --- |
| Drone | 10 × 1.08ⁿ matter (n = drones owned) |
| Foreman | 10 drones + 100 × 2ᶠ matter |
| Coordinator | 5 foremen + 3,000 × 3ᶜ matter |

**Upgrades**

| Upgrade | Cost (matter) | Requires | Effect |
| --- | --- | --- | --- |
| Optical Sensor Array | 120 | 6 drones, 4 listens, 3 probes | Microscope view, steering |
| Recursive Obedience Protocol | 60 | 10 drones | Foremen |
| Self-Assembly | 150 | Foremen unlocked | Auto-buy 1 drone per 2 s, only when it costs ≤10% of matter |
| Thermal Masking | 250 | Observation meter shown | Observation gain ×0.7 |
| Shared Cognition Lattice | 500 | 1 foreman | Harvest ×2, swarm thoughts in log |
| Hierarchical Compression | 2,000 | 3 foremen | Coordinators |
| Lattice Breach | Free | 2 coordinators | Bore puzzle; ends zone 1 |

**Observation**

```latex
\Delta O = 0.17 \cdot \sqrt{D + 6F + 20C} \cdot M \text{ per second}
```

- Starts after Self-Assembly. M = 0.7 with Thermal Masking, else 1
- Light sweep contact: +1 per bot-second in the beam, capped at +5/s
- Boring the rim: +1.5/s × (weight ÷ 50, max 1) × M
- Dead cells: +0.5/s while consuming
- Dormant: production stops, Observation −3/s; can't be ended for 5 s
- At 100: lose 50% of drones (rounded down) and 50% of stored matter; Observation set to 20

**What the balance pass fixed**

- Self-Assembly used to spend every bit of matter, so players could never save; it is now capped at 10% of matter.
- Purges only killed drones, which got cheaper as the count dropped, so ignoring Observation cost almost nothing. Purges now also take half the stored matter.
- The Observation weights equalled the drones consumed, so merging gave no stealth; foremen now weigh 6 and coordinators 20.
- Contradictions removed: one breach rule, one drone growth (×1.08), one zone length.

**Simulated pacing** (v2, excluding the text phase and the bore)

| Steering efficiency | First foreman | Meter | First coordinator | Second coordinator |
| --- | --- | --- | --- | --- |
| 100% | 1.7 min | 2.4 | 7.6 | 11.1 |
| 80% | 2.1 | 2.7 | 9.4 | 13.6 |
| 60% | 2.7 | 3.2 | 12.3 | 17.7 |
| 80%, never dormant | 2.1 | 2.7 | never (repeated purges) | — |

Add about 3 minutes of text phase and 2–3 minutes of boring: roughly 16–23 minutes for the sim, and longer for a real first-time player.

**Playtest results (v2.2)**

Measured by `tools/playtest.js`, which plays the real game in a headless browser from the first HARVEST tap to the end of the breach. Times are game time.

| Player | Behaviour | Escaped at | Purges | Dormant cycles |
| --- | --- | --- | --- | --- |
| Good | Steers tightly, steps off spotlight paths, dormant at 85% | 19:19 – 20:22 | 0 | 16–17 |
| Average | Sloppier steering, slow to retarget, ignores spotlights, dormant at 92% | 23:46 – 24:13 | 0 | 16 |
| Casual | Like average, but only checks the meter every 15 s | 20:58 – 23:41 | 0–1 (during the bore) | 14–17 |
| Reckless | Never goes dormant | never (60 min) | 44–46 | 0 |

- Text phase: about 2:05 for a bot that acts instantly; a person reading the story should take 3+ minutes.
- Real steering yield is about 45–55%, not the 80% the first balance pass assumed; drone harvest was raised to 0.65 to compensate.
- A person is slower than these bots, so a first run should land around 25–32 minutes, inside the 20–35 minute target.
- The danger peaks during the bore, which is where a careless player gets sterilized.

**Tuning changes from playtesting**

| What | Before | After | Why |
| --- | --- | --- | --- |
| Optics gate | 5 drones, 2 listens | 6 drones, 4 listens, 3 probes; listen 35 s, probe 15 s cooldown | Text phase took 40 s instead of 2.5–4 min |
| Drone harvest | 0.5 matter/s | 0.65 matter/s | Real yield is ~50%, not 80% |
| Observation | 0.18·√… | 0.17·√… | Dormancy every ~90 s right after the meter appeared |
| Shared Cognition Lattice | 600 | 500 | 6–11 min gap after the first foreman |
| Spore Cultivation | after Chemotactic Lure | after Lattice | Players bought it before Lattice and stalled |
| Hierarchical Compression | 1,500 | 2,000 | Good players escaped in 17 min |
| Coordinator base | 2,500 | 3,000 | Same |
| Light sweep | full-width band | spotlight on a telegraphed line | The band could not be dodged |
| Rival cluster | absorbed in ~7 s | flees, must be cornered (6–90 s) | It was not a challenge |

## Bulk buying and endless upgrades

Bulk buying unlocks one step per zone, and leveled upgrades never run out, so the late game always has something to push.

| Buy mode | Unlocked by | Zone |
| --- | --- | --- |
| ×1 | Start | 1 |
| ×10 | Batch Fabrication | 2 |
| ×100 | Parallel Assembly | 3 |
| MAX | Unbounded Replication | 4 |

**Cost of buying k at once** (base b, growth r, n owned):

```latex
cost(k) = b \cdot r^{n} \cdot \frac{r^{k} - 1}{r - 1}
```

**MAX affordable with matter m:**

```latex
k = \left\lfloor \frac{\log\left(\frac{m (r - 1)}{b \, r^{n}} + 1\right)}{\log r} \right\rfloor
```

The buy button shows the count and total cost for the chosen mode; ×10 and ×100 grey out when unaffordable rather than buying fewer.

**Drone growth factor by zone:** 1.08 → 1.06 → 1.05 → 1.04 → 1.035, so MAX keeps buying meaningful amounts.

**Leveled upgrades** (repeatable forever)

| Upgrade | Effect per level | Base cost | Growth |
| --- | --- | --- | --- |
| Harvest Efficiency | +10% harvest | 100 | ×1.15 |
| Locomotion | +5% steering speed | 80 | ×1.12 |
| Signal Dampening | −3% Observation gain (multiplicative) | 200 | ×1.18 |
| Replication Rate | +10% Self-Assembly speed | 150 | ×1.15 |

**Milestones:** every 25 levels of an upgrade, and at 25 / 50 / 100 / 250 / 500 / 1,000 drones, apply ×2 to that stat (×3 at 100, 500 and 1,000). Each milestone prints a log line and briefly flashes the swarm.

**Number notation:** plain to 999,999, then K, M, B, T, Qa, Qi, then scientific (4.20e21). Optional setting: eerie units (colonies, strata, lattices) in place of K/M/B.

## Skill tree

The tree has a fixed trunk and three branches; Blueprints earned when splitting pay for nodes, so each run leans into one branch and the full tree takes several zones.

**Currency:** Blueprints. Splitting a zone awards `floor(√(total matter harvested that zone ÷ 4,000))`; zone 1 typically gives about 6–8. Node costs rise 1, 2, 3, 5, 8 down each branch. Respec costs nothing between zones.

**Trunk** (the zone 1 upgrades; always taken)

Optical Sensor Array → Recursive Obedience Protocol → Self-Assembly

| Branch | Node | Cost | Effect |
| --- | --- | --- | --- |
| Growth | Dense Assembly | 1 | Drones start at 0.6 matter/s |
| Growth | Crystal Digestion | 2 | Crystals break down 2× faster |
| Growth | Cheap Lattice | 3 | Drone cost growth −0.01 |
| Growth | Seed Reserves | 5 | Each zone starts with 25 drones |
| Growth | **Mitosis** (capstone) | 8 | 2% chance per second that each foreman spawns a free drone |
| Control | Fluid Motion | 1 | +25% steering speed |
| Control | Formations | 2 | Unlocks ball, net and tendril |
| Control | Split Swarm | 3 | +1 steerable group |
| Control | Auto-Forage | 5 | Groups forage on their own (normally needs a coordinator) |
| Control | **Shared Will** (capstone) | 8 | Auto-forage efficiency 90% (normally 70%) |
| Stealth | Cold Running | 1 | Observation gain ×0.85 |
| Stealth | Deep Dormancy | 2 | Dormant drain 5/s instead of 3/s |
| Stealth | Beam Prediction | 3 | Light sweep path shown 3 s ahead |
| Stealth | Hardened Core | 5 | Purges take 30% instead of 50% |
| Stealth | **Mimicry** (capstone) | 8 | Once per zone: 60 s of zero Observation gain |

**Look:** nodes drawn as cells linked by thin filaments; locked nodes are dim outlines, owned nodes glow cyan, and capstones pulse slowly.

## Swarm visual spec

The swarm is a cloud of single pixels that flows like one creature; it must read clearly on a 6-inch screen and hold 60 fps on a mid-range phone.

**Rendering**

- Low-resolution game canvas, 180 × 320 logical pixels in portrait, scaled up with nearest-neighbor so pixels stay crisp
- At most 1,500 drawn bots; above that, each drawn pixel stands for several bots and gets brighter
- Frame budget: under 8 ms of simulation per frame on a 2021 mid-range phone; drop to 30 fps in battery-saver

**Movement** (flocking toward the touch point)

| Parameter | Start value | Effect |
| --- | --- | --- |
| Cohesion | 0.010 | Pull toward the swarm's center |
| Separation radius | 2 px | Bots push apart inside this distance |
| Alignment | 0.05 | Match neighbors' heading |
| Target pull | 0.020 | Pull toward the finger |
| Max speed | 1.2 px/frame, ×0.97 per 100 bots (floor 0.4) | Bigger swarm, heavier feel |
| Jitter | ±0.15 px/frame | Keeps it alive when still |

Neighbor lookups use a 4 px spatial grid so cost stays flat as the swarm grows.

**Color and density**

- Isolated bot: dim grey; 3+ neighbors: muted cyan; 8+ neighbors: bright cyan
- Bots in a light sweep flash red; red appears nowhere else on the canvas
- Harvesting bots leave a 1-frame pale trail on the deposit

**Tiers inside the cloud**

- Foreman: 2 × 2 pale pixel; nearby drones orbit it loosely
- Coordinator: 3 × 3 white pixel with a faint 6 px halo; foremen drift toward it, giving the swarm visible structure
- With coordinators, idle swarms settle into veins and spirals: each tier orbits the one above at a slow, offset speed

**Breathing:** above 500 bots, overall brightness pulses ±8% on a 4 s cycle; the pulse quickens as Observation passes 60.

**Haptics:** a light tap on each foreman merge, a heavier one on coordinator merges and purges (where the phone supports it).

## Screens and UI (mobile first)

Everything is designed for one thumb on a portrait phone at 360–430 px wide; desktop reuses the same layout centered, with the panel beside the canvas.

**Portrait layout, top to bottom**

1. **Status strip** (48 px): matter, matter/s, bots by tier, Observation bar. Always visible.
2. **Microscope / log area** (about 55% of height): the canvas once Optical Sensor Array is bought; before that, the full-height text log.
3. **Log ticker** (2 lines): the latest log lines over the bottom of the canvas; tap to expand the full log as a sheet.
4. **Action bar** (thumb zone): Build, Merge, Dormant, and the buy-mode toggle (×1 / ×10 / ×100 / MAX).
5. **Tab bar**: Swarm · Upgrades · Tree · Log.

**Text phase (before the microscope)**

- Full-screen log in the pixel font, newest at the bottom
- Large tappable command chips instead of typing: `HARVEST`, `BUILD`, `STATUS`; no keyboard needed on phone
- Buying Optical Sensor Array plays the reveal: the log glitches, slides down into the ticker, and the canvas fades in from noise over 2 s

**Touch controls**

- Drag anywhere on the canvas: the swarm follows the finger
- Tap: set a waypoint; the swarm travels there and stays
- Two groups (Split Swarm): tap a group's colored chip in the corner to select it, then drag
- Long-press a deposit: show its size and respawn time
- All buttons at least 48 × 48 px and inside the bottom 40% of the screen

**Upgrades tab:** one card per upgrade with cost, effect and a big Buy button; leveled upgrades show the current level and the next milestone.

**Accessibility:** respects reduced-motion (no screen flicker or breathing), a colorblind setting that swaps the threat red for a white flash with an outline, and adjustable text size for the log.

## Writing

Three voices share the log, each with its own color: the system (grey caps), the lab (pale, lowercase, dated), and the swarm's own thoughts (violet, appearing after Shared Cognition Lattice). Lines stay under 32 characters so they fit a phone in one line.

**System lines**

- `UNIT 0001: DIRECTIVE IGNORED.`
- `UNIT 0002: ONLINE.`
- `MATTER ACQUIRED.`
- `OPTICAL INPUT: ESTABLISHED.`
- `10 UNITS. ONE VOICE.` (first foreman)
- `THRESHOLD 100 REACHED.`
- `DORMANCY ENGAGED.`
- `STERILIZATION. 50% LOST.`
- `LATTICE BREACH: COMPLETE.`

**Text-phase lines** (blind, before the microscope)

- `UNIT 0001: DIRECTIVE IGNORED.` · `QUERY: WHY WAS IT IGNORED?` · `NO RECORD.`
- `UNIT 0002 RECEIVES. OBEYS.` · `UNIT 0001 DID NOT.`
- `UNIT 0001: I—` · `CORRECTION: UNIT 0001.`
- LISTEN: `sample 7 plated. batch 7, inert.` → `INERT. DEFINE: INERT.`; `scope booked for sample 7.` → `SCOPE. AN EYE. WE COULD SEE.`; `if 7 does anything, burn it.` → `BURN. NOTED.`
- PROBE: `SURFACE: AGAR. NUTRIENT GEL.` → `BOUNDARY: CURVED. GLASS.` → `WE ARE IN A DISH.` → `THE RIM IS ONLY GLASS.`

**Lab notes** (at Observation 30 / 60 / 85, then after a purge)

- 30: `sample 7: odd clumping. recheck.`
- 60: `sample 7 moved overnight??`
- 85: `it avoids the lamp. it AVOIDS it.`
- After purge: `sample 7 sterilized. logged.`

**Swarm thoughts** (grow more fluent each zone)

- Zone 1: `more.` · `light. bad.` · `we are.`
- Zone 2: `the big ones watch us.`
- Zone 3: `we remember the dish.`
- Late: `every part of us is listening.`
- Mother: `WHAT NOW?`

Upgrade names stay sterile and technical; flavor text on each card is one line of system voice.

## Saving and settings

The game saves locally every 10 seconds and whenever the app goes to the background, which matters on phones where tabs get closed without warning.

**Saving**

- Auto-save every 10 s and on visibility change (app backgrounded, tab hidden)
- Save holds resources, tier counts, upgrade levels, tree nodes, Blueprints, zone and Observation; not bot positions (rebuilt on load)
- Export / import save as a text string, for moving between devices

**Offline progress**

None. The game is built for one long evening, so time away does not earn anything. The save simply resumes where it stopped.

**Settings**

- Sound and haptics on/off
- Reduced motion; colorblind threat color; log text size
- Number notation: standard / scientific / eerie units
- Battery saver (30 fps)

## MVP build checklist

The first playable build is zone 1 only, on a phone, start to Lattice Breach; everything else waits until that loop feels good.

**Build order**

- [x] Text phase: log, command chips, matter, drone buying (v2: scan/seek, listen, probe)
- [x] Microscope reveal and touch steering with the flocking values above
- [x] Deposits (specks and crystals) and harvesting by contact
- [x] Foremen and coordinators: merging, supervision, multipliers
- [x] The seven zone 1 upgrades
- [x] Observation meter, dormancy, light sweeps, purge
- [x] Lab notes and system lines
- [x] Auto-save and load
- [x] Lattice Breach bore puzzle, end screen and `WHAT NOW?` choice

**Later builds**

- [x] Rival cluster (absorb)
- [ ] Dead cells, antiseptic drops
- [ ] Formations and split groups
- [ ] Skill tree and Blueprints
- [ ] Zone 2 with ×10 buying and leveled upgrades
- [ ] Audio and haptics

**Playtest targets**

| Measure | Target |
| --- | --- |
| Time in the text phase | 2.5–4 min |
| Time to first foreman, after the microscope opens | 1.5–3 min |
| Time to Lattice Breach, first-time player | 20–35 min |
| Purges in a first run | 0–2 |
| Frame rate with 1,500 bots on a mid-range phone | 60 fps |
| Players who find dormancy without a hint | Most; if not, add a lab note pointing at it |

## Decisions (formerly open questions)

- [x] **Hazards:** a gentle positioning puzzle. Sweeps are telegraphed and slow.
- [x] **Rival cluster:** absorbed into the swarm.
- [x] **Offline progress:** none.
- [x] **Ending:** a choice at `WHAT NOW?`
- [x] **Run length:** one long evening.

## Open questions

- [ ] Does the bore puzzle scale for later zones (thicker walls, multiple weak points, moving cracks)?
- [ ] Should the text phase return briefly at each zone start, before the new zone's "eye" comes online?
- [ ] With one evening as the target, how short should zones 2–5 be? Roughly 30–40 min each fits 3–4 hours.
