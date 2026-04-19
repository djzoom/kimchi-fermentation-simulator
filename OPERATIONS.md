# Smoker BBQ — Operations, Red Lines & Failure Modes

Complement to `PHYSICS.md`. This document codifies **when a simulation should alert the user** and which deviations are recoverable. UI messages should be lifted verbatim from here so the language stays consistent with the BBQ community vocabulary.

---

## 1. Constraint tiers

Three severities, mapped onto simulator state:

| Tier | Semantics | UI colour | Recoverable? |
|------|-----------|-----------|--------------|
| 🟥 Red | Irreversible quality loss or safety risk | `#EF4444` | No — damage is locked in |
| 🟧 Yellow | Measurable penalty, recoverable with active correction | `#F59E0B` | Yes, if operator acts |
| 🟩 Green | Free to delay, negligible cost | `#16A34A` | N/A |

Every constraint is a predicate over `(meat, pit, fuel, time)` state plus the scheduled phase. Violations should trigger a timeline annotation and, for red lines, quantify the locked-in loss.

---

## 2. 🟥 Red lines

| # | Predicate | Locked-in cost | State-vector trigger |
|---|-----------|----------------|----------------------|
| R1 | `T_pit < 107 °C (225 °F)` during `phase == stall` | `Δw` lost = ∫ ṁ_evap dt over the dip, with no compensating rise in `T_core` | `T_pit && phase_stall && dT_core/dt < 0.05 °C/min` |
| R2 | Surface in 4–60 °C danger zone > 4 h | Food-safety risk — pathogen growth integral above threshold | `integral(danger_zone_time) > 240 min` |
| R3 | Pull before `C ≥ 0.85` | Flat will remain tough; `C` does not increase post-pull | `pull_event && C < COLLAGEN_DONE` |
| R4 | Smoke overload while surface cold | Creosote / bitter bark — permanent flavour penalty | `S_bad > S_bad_threshold && T_surf < 60 °C` |
| R5 | Wrap before bark is set (`w_surface > 0.6`) | Bark re-softens, never recovers | `wrap_event && surface_moisture > 0.6` |
| R6 | Fire fully out (`Q_fire → 0`) | Forces open-lid re-ignition → large heat + contamination event | `Q_fire < 5 W && T_pit dropping` |

### Red-line UX rule

On violation, freeze the locked-in loss into the meat state and annotate the timeline with a red marker and a one-sentence explanation drawn from this table. Do not let the user "un-violate" it — the point is learning.

---

## 3. 🟧 Yellow lines

| # | Predicate | Penalty | Recovery |
|---|-----------|---------|----------|
| Y1 | Refuel too late (`Q_fire < 0.5 · Q_fire_peak_nominal`) | `T_pit` wobble 15–25 °F | Add 1–2 coals, wait ~10 min |
| Y2 | Wrap outside 140–165 °F window | Early = thin bark; late = over-dry | Compensate with spritz or holder adjustment |
| Y3 | Spritz frequency > 2/h | Over-wetting washes rub, softens bark | Stop spritzing for 30 min |
| Y4 | Wood chunk added after 3 h | Reduced flavour layering | One extra small chunk late, for top-note |
| Y5 | Pull at `T_core > 205 °F` or `< 190 °F` | Risk over-dry / flat still tight | ±5–10 min at target temp |
| Y6 | Lid open > 20 s | `T_pit` drops 25–50 °F, recovery 10–30 min | Close, wait for recovery |
| Y7 | Ambient wind > 15 mph without shield | `h` up, evaporation up, juice loss | Shield smoker or raise `T_pit` 15 °F |

---

## 4. 🟩 Green (free to delay)

| # | Item | Rationale |
|---|------|-----------|
| G1 | Total cook time ±1 h | Low-and-slow is intrinsically tolerant |
| G2 | Bark-build phase duration | 2–4 h all acceptable; longer = more bark |
| G3 | Rest time 45 min – 4 h | With insulated hold, longer helps marginally |
| G4 | Exact starting pit temp 225–275 °F | Wide plateau on the response surface |
| G5 | Slicing time after rest is complete | No cost once rest ≥ 45 min |

---

## 5. Failure-mode library

Ten typical BBQ failure signatures, each mapped to its upstream state-vector cause and the SOP deviation that produced it. Used by the simulator's post-cook diagnostic screen.

### F1 — "Dry and tight"
- **Signature**: `w_final < 0.55` AND `C ≥ 0.85` AND `t_rest < 20 min`
- **Cause**: Stall-period `T_pit` dip (R1) or insufficient rest
- **Fix next time**: Keep `T_pit ≥ 250 °F` through stall; rest ≥ 45 min

### F2 — "Tough but moist"
- **Signature**: `w_final > 0.7` AND `C < 0.75`
- **Cause**: Pulled too early (R3) or wrapped too hard too soon
- **Fix**: Probe-soft check before pulling; ignore the thermometer number

### F3 — "Bitter / acrid"
- **Signature**: `S_bad / S_good > 0.4`
- **Cause**: White smoke in first 2 h (R4); wet wood or starved airflow
- **Fix**: Establish thin-blue-smoke fire before meat goes on

### F4 — "No bark"
- **Signature**: `surface_integral(dry_time < 140 °F) < threshold`
- **Cause**: Wrapped too early (R5) or over-spritzed (Y3)
- **Fix**: Wait for visibly dry "mahogany" before wrapping

### F5 — "Stall forever" (the user's cook)
- **Signature**: `stall_duration > 4 h` AND `T_pit avg < 240 °F during stall`
- **Cause**: Refuel missed (Y1) → `Q_fire` sagged into decay phase
- **Fix**: Add coals when any single coal passes 60 % of its `τ_burn`

### F6 — "Bark soft / soggy"
- **Signature**: Wrapped in foil AND `t_wrap > 2 h`
- **Cause**: Foil traps steam, rehydrates bark
- **Fix**: Switch to butcher paper, or remove foil last 30 min

### F7 — "Overcooked after wrap"
- **Signature**: `T_core_at_pull > 205 °F` OR `T_core_after_rest > 210 °F`
- **Cause**: Wrap + high `T_pit` + late pull; carryover pushed past target
- **Fix**: Pull 5–10 °F earlier when wrapped

### F8 — "Uneven (flat dry, point OK)"
- **Signature**: `T_core_flat − T_core_point > 5 °C` at pull
- **Cause**: Non-uniform geometry; flat cooks faster and loses more water
- **Fix**: Fat cap down to shield flat; move flat to cooler zone

### F9 — "Probe liar"
- **Signature**: Single probe plateaus while adjacent probe advances
- **Cause**: Probe tip in fat pocket — reads higher or stuck
- **Fix**: Take multiple readings, use the lowest

### F10 — "No smoke ring"
- **Signature**: `S_ring < S_ring_min` despite ample wood
- **Cause**: Surface crossed 60 °C before NO₂ had time to bind (high `T_pit` early, or dry surface)
- **Fix**: Start cold; wet surface; keep early `T_pit` modest; wood in first 90 min

---

## 6. Phase machine

Explicit phase transitions — drives UI stage indicators and phase-specific constraint checks.

```
ignition     →  steady     →  bark_build  →  wrap  →  push  →  rest  →  slice
```

| Phase | Entry condition | Exit condition | Active red lines |
|-------|-----------------|----------------|------------------|
| ignition | t = 0 | `T_pit` stable ±10 °F for 10 min | R6 |
| steady | ignition complete, meat not yet on | meat added | — |
| bark_build | meat on, `T_surf < 60 °C` crossed | `T_core ≥ 140 °F` | R4 |
| wrap | user wrap event OR `T_core ≥ 165 °F` unwrapped | `T_core ≥ 185 °F` | R5 |
| push | post-wrap to probe-soft | `C ≥ 0.85` AND probe-soft | R1, R3 |
| rest | pulled from pit | `t_rest ≥ τ_rest` OR user slice | R2 |
| slice | user slice event | terminal | — |

---

## 7. Operator events (what the user can do)

Every event mutates state via documented side effects so Monte Carlo can replay them:

| Event | Argument | Side effect |
|-------|----------|-------------|
| `ignite(n)` | n coals | Push n entries into `fuel[]` with `t_ignite = now` |
| `refuel(n)` | n coals | Same, with fresh `t_ignite` |
| `add_wood(m, type)` | mass, species | Push wood chunk; pulse `Q_wood` + `ρ_smoke` |
| `damper(d)` | d ∈ [0, 100] | Set intake opening → scales `Q_fire` |
| `wrap(type)` | paper / foil_boat / foil | `wrap_state = type`; apply `WRAP_EVAP_REDUCTION` |
| `unwrap()` | — | `wrap_state = none` |
| `spritz(volume)` | ml | Surface-node `w` += small, brief `T_surf` dip |
| `open_lid(duration)` | s | Drop `T_pit` 14 °C, `τ_recover = 15 min`, `h *= 0.6` during |
| `probe_move(position)` | index | Switch UI probe; no physics change |
| `pull()` | — | Move to `rest` phase; freeze `C`, `w` |
| `slice()` | — | Terminal; emit final scores |

---

## 8. Output scores

The simulator's final product screen, mapped from state to user-readable metrics:

```
doneness     = clamp(C / COLLAGEN_DONE, 0, 1)          # tenderness
juicy_score  = clamp(w_retained / 0.75, 0, 1)          # moisture
bark_score   = f(surface_dry_time_integral)            # crust
smoke_score  = S_good / (S_good + S_bad + ε)           # flavour cleanliness
ring_depth   = mm(S_ring) ≈ 0–13 mm                    # display only
overall      = geometric_mean(doneness, juicy, bark, smoke)
```

The user's post-mortem (the reference brisket cook) should score roughly:
`doneness ≈ 0.82, juicy ≈ 0.55, bark ≈ 0.80, smoke ≈ 0.85 → overall ≈ 0.74` — matching "flat略干略硬 but tasty".

---

## 9. Canonical SOP (collapsed from the user's post-mortem)

The three-rule version the simulator should reinforce:

1. **Never let `T_pit` drop below 225 °F during stall** (R1)
2. **Judge done by probe feel, not temperature** (F2, R3)
3. **Rest at least 45 minutes** (G3 converts potential Y → green)

Everything else is optimisation.
