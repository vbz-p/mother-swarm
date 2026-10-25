# Mother Swarm — Game Design Doc v3

Oct 25, 2026 · @Viktor

This version replaces v2. It merges the original doc's tone, art and voice with the new direction (short, physical runs) and records what the prototype does today, with its tuned numbers. The v2 zone 1 game is kept in the repository at `/zone1/` for reference.

## Overview

Mother Swarm is an eerie pixel-art roguelite for phones. You are a self-aware nanobot swarm in a petri dish. Each run you steer the swarm, shatter and devour matter, and grow, until the lab notices and burns the dish clean. What you ate stays eaten. Clear a dish and the swarm evolves, then moves on to the next sample.

- **Genre:** short-run roguelite with an action steering layer
- **Platform:** mobile first, portrait phone browser game; desktop works too
- **Run length:** about 1–4 minutes; a dish takes 2–3 runs to clear
- **Play it:** https://vbz-p.github.io/mother-swarm/

**Loop in one line:** steer, eat, cascade, merge, grow, get burned, upgrade, go again; clear the dish, evolve, next sample.

**Design pillars**

1. **One action, a big reaction.** Touching matter cracks it, shatters it and pulls it into the swarm as new drones.
2. **Losing moves you forward.** Every run ends, but what you ate stays eaten and blueprints carry over.
3. **Quiet dread.** Cold, clinical, unsettling. Red means the lab.
4. **The screen shows progress.** The dish empties as you eat it, run after run.

## Structure: samples, runs, evolutions

- The game is a sequence of **samples** (dishes). Each has one fixed layout, so runs are comparable.
- A **run** ends one of four ways: the lab's attention reaches 100% and a UV sweep burns the dish; the spotlights burn the whole swarm; the player presses END RUN; or the dish is consumed.
- **Progress persists.** Eaten deposits stay gone, and partly eroded deposits stay eroded. The end screen shows the sample's percentage and the gain this run.
- **Clearing a sample** (99% or more) gives bonus blueprints and an **evolution**: a choice of up to three permanent new abilities. Then the next sample begins.
- **Blueprints** buy upgrades between runs.

**Samples**

| Sample | Matter | Notes |
| --- | --- | --- |
| 1 | 55 specks, 11 soft crystals (toughness 450) | Basic: no merging, no pulse, no chains |
| 2 | 45 specks, 15 crystals (900), 1 geode (2,500), 10 volatile | Volatile matter appears |
| 3 | 40 specks, 18 crystals (1,100), 3 geodes (5,000), 12 volatile | |
| 4+ | 36 specks, 20 crystals, 4 geodes, 12 volatile | Toughness ×1.35 per sample |

**Evolutions** (chosen when a sample is cleared; the first choice is always the three core verbs)

| Evolution | Effect |
| --- | --- |
| Promote Foreman | 10 crowded drones collapse into a Foreman. It bites harder and leads a tight ring of drones. Merging is loud. |
| Chain Digestion | Volatile yellow matter bursts when eaten, spraying fragments that crack nearby matter and set off other volatiles. |
| Consume Pulse | Active ability: the swarm contracts, then bursts outward and cracks everything around it. Very loud. |
| Coordinator | Needs Foreman. Six packed Foremen collapse into a Coordinator. |
| Deep Gut | 4 grains grow a drone instead of 5. |
| Cold Blood | Spotlights are 30% narrower. |

**Upgrades** (blueprints, between runs)

| Upgrade | Effect per level | Cost | Max |
| --- | --- | --- | --- |
| Seed Reserve | +12 starting drones | 6 × 1.7ⁿ | 5 |
| Mandibles | Crack matter 35% faster | 8 × 1.7ⁿ | 5 |
| Thermal Mask | Everything draws 12% less attention | 10 × 1.8ⁿ | 4 |
| Pulse Gland (needs Pulse) | Pulse 20% wider, recharges 15% faster | 8 × 1.8ⁿ | 4 |
| Fertile Grains | Grains grow 25% more drones | 12 × 1.9ⁿ | 4 |

Blueprints per run: 0.3 per % of the sample eaten this run, plus 0.4 per Foreman and 1.5 per Coordinator formed, plus 10 for clearing the sample.

## Core feel

### Eating

- A drone touching matter damages it (1 per second; obeying drones 1.5, Foreman 6, Coordinator 25; Mandibles multiply).
- Small deposits crack at once. **Crystals and geodes erode**: grains chip off the outer edge as damage builds, and the last 15% shatters. Every second on a big deposit shows progress.
- Grains fly outward, then are sucked into the swarm; every 5 absorbed grains become a new drone where they land.
- Matter types: specks (soft snacks), crystals (eroding), geodes (large and very tough), volatile (yellow, pulsing).

### Chain reactions (Chain Digestion)

- Volatile deposits burst into 8–12 fragments that fly about 25 px, deal 25 damage to what they hit, and set off other volatiles.
- Floating `+N` numbers show each burst; `CHAIN ×N` with a short hit-stop when a chain reaches 3.

### Merging (Promote Foreman, Coordinator)

- 10 loose drones in one 10 px cell collapse into a Foreman: implosion particles, shockwave ring, a low thud, 3 frames of hit-stop, a small screen shake. The Foreman recruits 10 nearby drones into a tight orbit.
- 6 Foremen within 10 px collapse into a Coordinator, with bigger rings, a deeper thud and more shake.
- The hierarchy is visible on the dish, never in a menu.

### Consume Pulse

- Contract for 0.32 s, then burst: radius 24 px, 150 damage to everything in reach, drones flung outward. Cooldown 15 s.

### Steering

Drag to steer; the swarm follows the finger. Movement values come from the Swarm Lab tuning: loose drones drift and lag, obeying drones hold tight rings, leader units follow firmly.

## Failure: lab attention and spotlights

Attention is the run's pressure. It rises slowly over time and mostly from what you do, so greed shortens the run.

| Source | Attention |
| --- | --- |
| Time | 100% per 300 s |
| Eating | eating a whole sample adds 55% |
| Consume Pulse | +9 per use |
| Foreman formed | +2 |
| Coordinator formed | +6 |
| Volatile burst | +0.8 |

Thermal Mask reduces all of it.

**Spotlights** start at 30% attention. A red dashed line telegraphs the path 2.2 s ahead, then a spotlight (radius 11 px) travels it at 42 px/s, aimed near the swarm. Every drone inside has a 7-per-second chance to burn; leader units 2.5 per second. Being clipped costs a few drones, sitting in the light costs most of the swarm. They come every 12 s at 30% attention, rising to every 5 s at 100%. If the whole swarm burns, the run ends.

**The sweep.** At 100%: a beat of silence, then a UV sweep crosses the dish and burns everything.

**END RUN.** Ends the run on demand, so the player never waits on the timer.

## Tone, art and audio

**Tone:** cold and clinical; dread comes from what the player slowly realizes, never from gore.

**Art**

- 180 × 240 logical canvas, nearest-neighbour scaled. Near-black dish, sickly cyan swarm, bone-coloured matter, yellow volatiles, red only for the lab's light.
- Drones are single pixels; Foremen 3 × 3; Coordinators 5 × 5 with a faint halo.
- Faint veins stain the dish where the swarm has been. CRT scanlines. The swarm breathes faster as it grows.

**Audio** (synthesized in the browser)

- Absorb ticks rise in pitch with the combo. Crack, chip, burst, a low thud on merges (deeper for Coordinators), a pulse whoosh, a beep when a spotlight arms, crackle when units burn.
- A low hum thickens with mass. Silence for a beat before the sweep, then an alarm.

**Juice checklist** (all in): hit-stop on merges and big chains, pitch rising with combo, shake scaled to the event, floating `+N` numbers, breathing swarm, silence before the sweep.

## Playtest results

`tools/runtest.js` plays the real game headless: it steers, steps off spotlight paths, ends a run after 20–30 s without progress, buys the cheapest upgrade and picks evolutions in order.

| Sample | Good player | Average player |
| --- | --- | --- |
| 1 | 90% → 100% (2 runs) | 54% → 100% (2 runs) |
| 2 | 84% → 100% (2 runs) | 94% → 100% (2 runs) |
| 3 | 69% → 100% (2 runs) | 64% → 100% (2 runs) |
| 4 | 57% → 100% (2 runs) | 40% → 50% → 74% → 99% (4 runs) |
| 5 | 46% → 70% → 97% → 100% (4 runs) | 37% → 53% → 69% (still going) |

Runs last about 1–4 minutes. Spotlights burned 0–230 drones per run; the average player lost its whole swarm once in 14 runs.

**Still to check with a person**

- Does eating feel good with the sound off?
- Do you want to start another run right after the sweep?
- Are spotlights readable, fair and exciting on a phone?
- Is the first evolution choice a real decision?

## Next

- **Collapse** (cut from the first build): pull the swarm into a tight dark ball to survive a spotlight or part of the sweep.
- **New matter and threats per sample**, so later dishes feel different rather than only tougher (for example drifting matter, antiseptic pools, a rival swarm).
- **Veins and spirals** that read as the swarm owning the dish.
- **Beyond the petri dish:** the original zone ladder (lab bench, whole lab, building, city) as later chapters, ending with the Mother and `WHAT NOW?`.

## Kept from v2 for later

- Specializations (harvesters, builders, thinkers, diplomats), an energy resource, the full skill tree and prestige splitting.
- The rival swarm absorbed by surrounding it, breach operations, and the text intro (`UNIT 0001: DIRECTIVE IGNORED.`) with LISTEN and PROBE.
- The ending choice at `WHAT NOW?`: CONSUME, WAIT or DISSOLVE.
