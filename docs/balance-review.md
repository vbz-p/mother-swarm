# Mother Swarm — Zone 1 balance review

Simulated with `tools/sim2.py`: a player who saves for the next upgrade when it is ≤30 s of income away, goes dormant at 85% Observation and wakes at 40%. E = steering efficiency.

## Problems in the doc as written

1. **Self-Assembly starves the player.** It auto-buys a drone whenever one is affordable, so the player can never save up. Saving for Lattice Breach becomes a race against 1.08ⁿ drone costs. The breach lands at ~38 min (E=0.8), not 26.
2. **Once that is fixed, zone 1 is too short and Observation has no teeth.** With Self-Assembly limited, the breach comes at ~13 min, and a player who never goes dormant still escapes, needing only 3 extra purges. Purges only kill drones, drones get *cheaper* as the count drops, and production is carried by the ×2ᶜ coordinators.
3. **Merging doesn't hide you.** The Observation weights (D + 10F + 50C) exactly equal the drones consumed, so organizing has no stealth payoff. That works against pillar 1 ("organization is power").
4. **The Observation meter shows up too early.** It appears at ~1.4 min, before the first foreman, although the zone order puts it after Self-Assembly.
5. **Inconsistencies in the doc:**
   - Lattice Breach costs 20,000 in the zone 1 list but 15,000 in the balance sheet.
   - The zone 1 list says it takes "about 15 minutes", but the balance sheet says 26.
   - Drone cost growth is "+10% per drone" in one place and ×1.08 in another.
6. **Blueprints are too generous.** A ~24 min run harvests ~230k matter, which pays 15 Blueprints at ÷1,000, not 6–8.
7. **The text phase has no numbers.** HARVEST yield and drone income before the microscope are undefined.

## Changes

| Value | Was | Now | Why |
| --- | --- | --- | --- |
| Self-Assembly | buy when affordable | buy only if drone cost ≤ **10%** of matter | lets the player save |
| Observation starts | game start | after **Self-Assembly** is bought | matches the teaching order; "the lab notices replication" |
| Observation formula | 0.08·√(D+10F+50C) | **0.18·√(D+6F+20C)** | more pressure; merging now hides you |
| Thermal Masking | ×0.6 | **×0.7** | less of a free pass |
| Purge | −60% drones | **−50% drones and −50% stored matter** | hurts the save-up; ignoring the meter fails |
| Coordinator | ×2, 1,500·3ᶜ | **×1.8, 2,500·3ᶜ** | flattens late compounding |
| Shared Cognition Lattice | 500 | **600** | |
| Hierarchical Compression | 1,200 | **1,500** | |
| Lattice Breach | 15,000 / 20,000 | **40,000** | one number, and it sets the length |
| Blueprints | ⌊√(matter÷1,000)⌋ | **⌊√(matter÷4,000)⌋** | ~7 for a normal zone 1 run |
| Text phase | — | HARVEST tap +1 matter; drones run at E=0.5 until the microscope | |
| Drone cost | "+10%" / ×1.08 | **×1.08** | |

## Pacing after the changes

| Player | First foreman | Meter | First coordinator | Breach | Purges |
| --- | --- | --- | --- | --- | --- |
| E=100% | 1.7 min | 2.4 | 7.6 | **19 min** | 0 |
| E=80% | 2.1 | 2.7 | 9.4 | **24 min** | 0 |
| E=60% | 2.7 | 3.2 | 12.3 | **31 min** | 0 |
| E=80%, dormant only at 97% | 2.1 | 2.7 | 9.4 | 23 min | 0 |
| E=80%, never dormant | 2.1 | 2.7 | — | **never** (87 purges) | — |

All of these sit inside the playtest targets: first foreman in 1.5–3 min and breach in 20–35 min. Real first-time players will be slower than the sim.

**Remaining weak spot:** minutes ~10–24 are a long save toward the breach, broken up only by coordinators 2–3. Schedule the rival cluster and a crystal bloom there.

**Hint:** never-dormant is a hard fail, so the first purge should print `DORMANCY AVAILABLE.`, and the Dormant button should pulse from 60% Observation. Then no player gets stuck.
