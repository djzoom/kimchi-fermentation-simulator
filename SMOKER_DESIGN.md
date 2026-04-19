# Smoker Dynamics — Design Document

> Scientific simulator of low-and-slow BBQ framed as a **digital pitmaster**: converts continuous physical state into discrete, actionable decisions.

Companion to:
- `PHYSICS.md` — equations, calibrated constants, numerical scheme
- `OPERATIONS.md` — red/yellow/green constraint tiers, failure-mode library

This document is the **design canvas**: it names every variable the domain demands (per the 8-category taxonomy below) and marks each as implemented, proxied, or deferred. Use it when adding new physics or planning UI.

---

## 1. Philosophy

1. **Decisions, not dials.** The simulator's output is not a chart — it's a ranked list of *verdicts* ("wrap now", "refuel soon", "probe check"). Everything else is evidence for those verdicts.
2. **Status over numbers.** Phase badges (🟡 Stall) and trends (↑ +0.3°F/min) sit above raw values. Numbers are for drill-down.
3. **Bilingual everywhere.** Primary English + 中文 副标题. BBQ vocabulary ("brisket", "bark", "stall") stays English; reasoning and explanation are bilingual.
4. **Uncertainty made visible.** ETA is `"Ready by 14:30 ± 45 min"` with MC confidence, never a single-point claim.
5. **Progressive disclosure.** The Mission Control home screen hides telemetry, manual override, and timeline behind `<details>`. Default is a 3-card stack: phase / readout / decision.
6. **Red lines are terminal.** Once a red line (R1–R6 in OPERATIONS.md) is crossed, the damage annotation stays in the timeline — the user learns, they don't un-violate.

---

## 2. Variable taxonomy — 8 categories

For each variable: **implementation status** and **key symbol in code**.
Status legend:
- ✅ in model (primary or derived state)
- 🟡 proxied (simplified into one scalar/aggregate)
- ⬜ deferred (not yet modelled)
- ❌ out of scope (model boundary)

### 2.1 Heat source & fuel
| Variable | Status | Code ref |
|---|:---:|---|
| Fuel type (briquette / lump / pellet / gas) | 🟡 | Single generic "coal" ≈ 28 g @ 477 kJ; pellet/gas future |
| Wood species (post oak / hickory / cherry …) | 🟡 | String tag only; `combustionEfficiency` proxy |
| Wood moisture content | ⬜ | Candidate: multiply `η_combustion` |
| Fuel mass / feed rate (kg, kg/h) | ✅ | `coals[]`, `COAL_P_PEAK`, `COAL_TAU_BURN_MIN` |
| Combustion efficiency η | 🟡 | `simulator.combustionEfficiency()`, damper+active count proxy |
| Intake damper 0–100 % | ✅ | `state.damperPct`, `fireModel.damperAlpha()` |
| Exhaust damper / chimney | ❌ | Folded into effective `UA_PIT` |

### 2.2 Pit environment
| Variable | Status | Code ref |
|---|:---:|---|
| Pit temperature `T_pit(t)` | ✅ | State; driven by `Q_fire − U·A·(T_pit−T_amb) − Q_to_meat` |
| Zone gradient (direct / indirect) | ⬜ | Currently single lumped pit |
| Chamber humidity RH | 🟡 | Static input; water pan dynamics deferred |
| Airflow velocity | 🟡 | Via `h_eff = h_base·(1 + 0.05·wind)` |
| Pit geometry (volume, insulation) | 🟡 | Baked into `C_PIT`, `UA_PIT`, `EQUIPMENT_PROFILES` |
| Ambient T, wind speed | ✅ | Inputs |
| Wind direction | ⬜ | Would modulate exhaust reversal (firebox wind) |
| Precipitation | ⬜ | Would scale `UA_PIT` up |

### 2.3 Smoke chemistry
| Variable | Status | Code ref |
|---|:---:|---|
| Total smoke density | 🟡 | `densityFromWood()` function of wood pyrolysis pulses |
| Guaiacol / syringol / vanillin | 🟡 | Lumped into `S_good` (clean combustion) |
| NO / NO₂ (smoke ring) | 🟡 | Implicit in `S_good` + `SMOKE_RING_CUTOFF_C` |
| CO / CO₂ | ⬜ | Relevant for indoor/poorly-ventilated only |
| Smoke pH / acidity | ⬜ | Would modulate bark formation rate |
| PAH / HCA (safety) | ⬜ | Candidate output; links to `S_bad` |

### 2.4 Meat inputs
| Variable | Status | Code ref |
|---|:---:|---|
| Cut type (brisket, ribs, shoulder, whole bird) | 🟡 | Preset-level only; simulation treats all as slab |
| Mass, thickness, surface area | ✅ | `weightLb`, `thicknessIn`, derived area |
| Initial core temp `T_meat,0` | ✅ | `tInitF` |
| Water / fat / protein / collagen fractions | 🟡 | Grade → single α; fat fraction not tracked |
| Myoglobin concentration | 🟡 | Implicit in ring-depth formula |
| pH | ⬜ | Would shift stall onset and bark color |
| Dry rub (salt %, sugar %, spices) | ⬜ | Would lower surface wet-bulb, deepen stall |
| Wet brine | ⬜ | Would raise initial `w`, lower stall temp |
| Injection | ⬜ | Would raise core `w` uniformly |
| Pellicle (surface dryness) | 🟡 | `wSurface` state |

### 2.5 Heat & mass transfer (dynamics)
| Variable | Status | Code ref |
|---|:---:|---|
| Convective coefficient `h_conv` | ✅ | `H_BASE`, wind multiplier |
| Radiative heat `Q_rad` | ⬜ | Small for smoker; candidate for kamado/grill modes |
| Conductive heat via grate | ❌ | Point contact negligible at low-and-slow temps |
| Evaporative cooling `ṁ·L_v` | ✅ | `heatDiffusion.evapFluxKgPerM2S` |
| Water diffusion `D_w` | 🟡 | Currently lumped; N_NODES supports future gradient |
| Smoke deposition rate | 🟡 | `smokeModel.step()` integrates proxy |
| Wrap effect on h & evap | ✅ | `WRAP_EVAP_REDUCTION` table |

### 2.6 Time process
| Variable | Status | Code ref |
|---|:---:|---|
| Total cook duration | ✅ | `state.tSimMin` |
| Smoke-uptake window (first ~90 min) | ✅ | `SMOKE_RING_CUTOFF_C` gate |
| Stall onset/end | ✅ | `stallModel.stallProbability`, `decisions` |
| Rest time & juice redistribution | ✅ | `restModel.wRetained`, `TAU_REST_MIN` |

### 2.7 Outputs / quality
| Variable | Status | Code ref |
|---|:---:|---|
| Core / surface temperature curves | ✅ | `T[N]`, `T[0]` |
| Yield / moisture loss | ✅ | `state.w`, `wRetained` |
| Collagen → gelatin conversion | ✅ | `collagenModel.step` Arrhenius |
| Maillard / bark score | 🟡 | Proxy via `wSurface`; candidate for proper integrator |
| Smoke ring depth | ✅ | `smokeModel.ringDepthMm` |
| Flavor intensity (phenol deposition) | ✅ | `S_good` |
| Creosote / PAH safety | 🟡 | `S_bad` proxy |
| Pathogen-kill D-value | ⬜ | See §6 extension plan — now implemented |

### 2.8 User controls (events)
| Event | Status | Code ref |
|---|:---:|---|
| Target pit & pull temperature | ✅ | Via preset |
| Damper adjust | ✅ | `Sim.damper()` |
| Refuel | ✅ | `Sim.refuel()` |
| Wood addition | ✅ | `Sim.addWood()` |
| Spritz (frequency + liquid) | ✅ | `Sim.spritz()` — surface rewet + brief evap burst |
| Flip / reposition | ⬜ | Requires geometry model |
| Wrap / unwrap | ✅ | `Sim.wrap()` |
| Lid open duration | ✅ | `Sim.openLid()` |

---

## 3. Architecture — data flow

```
┌────────────────────────────────────────────────────────────┐
│                      INPUTS (preset)                       │
│  cut · mass · thickness · grade · equipment · ambient ·    │
│  humidity · wind · elevation · target-style                │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  OPERATOR EVENTS (timeline)                │
│  ignite · refuel · addWood · damper · spritz · wrap ·      │
│  openLid · pull · slice                                    │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│           PHYSICS LAYER (per sub-dt ≈ 3 s)                 │
│                                                            │
│    FIRE  →  Q_fire(t) = Σ P_i(τ) · α(damper)               │
│      │                                                     │
│      ▼                                                     │
│    PIT   →  dT_pit/dt = (Q_fire − UA·ΔT − Q_to_meat)/C     │
│      │                                                     │
│      ▼                                                     │
│    MEAT  →  1D FDM heat diffusion with Robin BC            │
│             + surface evap: ṁ·L_v                          │
│             + lumped water `w`                             │
│             + Arrhenius `C` (collagen)                     │
│             + deposition `S_good`, `S_bad`                 │
│             + D-value safety integral                      │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│                      DERIVED STATE                         │
│  slope · stall probability · ring depth · bark score ·     │
│  juicy score · ETA (Monte Carlo P10/P50/P90)               │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│          DECISION ENGINE (decisions.js)                    │
│  rules → { verdict, why, impact, actions } × priority      │
│  ranks top 3 cards; dedupes by verdict; throttles alerts   │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│          UI (Mission Control, smoker.html)                 │
│  phase pill · ETA · 2 readouts · card stack ·              │
│  progressive disclosure (telemetry / override / timeline)  │
│  notifications (Web Audio + desktop) on new verdicts       │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Core equations (summary)

See `PHYSICS.md` for full derivations and calibrated constants.

1. **Meat energy balance** (slab, radial):
```
∂T/∂t = α · ∂²T/∂r²
surface BC:  T₀' = T₀ + Fo(T₁−T₀) + Fo·Bi·(T_pit−T₀) − Δ_evap
```

2. **Stall = evaporative equilibrium**:
```
Q_evap  = ṁ_w · L_v      ≈  Q_conv  = h·A·(T_pit − T_surf)
ṁ_w     = max_flux · (1 − wrap) · w · (T_surf − T_amb)/60 · RH_factor
```

3. **Collagen (tenderness)**:
```
dC/dt  = (1 − C) · A · exp(−Eₐ / R T)
```

4. **Food safety (D-value, pathogen kill)** — see §6.1:
```
dK/dt  = log₁₀(e) / D(T)      where D(T) = D_ref · 10^((T_ref − T)/z)
safe when K ≥ K_target (6.5D for USDA 160 °F / 7-log reduction)
```

5. **Smoke ring** (reaction-diffusion surrogate):
```
S_ring ≈ f(S_good accumulated while T_surf < 60 °C)
```

---

## 5. UI / visual design

Inherits the kimchi DESIGN.md palette and type system verbatim (see root `DESIGN.md`). Smoker-specific additions:

### Colour semantics
| Role | Token | Usage |
|---|---|---|
| Pit temperature | `--red` | Line + readout |
| Meat core | `--amber` | Line + readout |
| Meat surface | `--orange` | Line (thin) |
| Water fraction | `--blue` (dashed) | Line |
| Collagen fraction | `--purple` (dashed) | Line |
| Stall phase badge | `--amber` | Dot + label |

### Type ramp
| Role | Size | Weight | Feature |
|---|---:|---:|---|
| Hero ETA | 22 px | 700 | mono, tabular-nums |
| Primary readout | 48 px | 700 | mono, tabular-nums |
| Card verdict | 17 px | 600 | Inter |
| Card why | 13 px | 400 | Inter, line-height 1.55 |
| 中文 subtitle | 0.78× parent | 400 | muted, block below |

### Bilingual pattern
```html
<span>Wrap now<span class="zh">现在包裹</span></span>
```
`.zh` renders as `display: block; font-size: 0.78em; color: var(--text-muted)`.
Buttons use `<em>` instead of `<span class="zh">` to stay inline-compact.

### Mobile breakpoints
- `≤ 640 px`: single-column compare pickers, 44 px touch targets, collapsed sim clock
- `≤ 380 px`: shrink primary readouts to 34 px, compact flow strip

---

## 6. Extension plan — staged

### 6.1 Implemented this iteration
- **D-value food-safety integrator** (`js/smoker/safety.js`). Tracks log-reductions of *Salmonella* at the surface node using Bigelow model with z-value = 5.56 °C and D₁₆₀°F = 1 min; safe when cumulative ≥ 6.5 log (USDA whole-muscle cook). Exposed as a new score axis and a red-line constraint (R2 replacement).
- **Spritz physics** (`Sim.spritz()`): re-wets surface `wSurface` by `+0.15`, reduces local evaporative cooling for 120 s (mop liquid has to boil off first). Now actually slows surface temperature rise, matching pitmaster experience that spritz "resets the crust".

### 6.2 Short-term (next iteration candidates)
- Wood moisture `η_combustion` coupling: wet wood cuts efficiency from 0.9 to 0.4 → bad smoke.
- Water pan as a first-class state variable: drips water into pit, raises RH dynamically, buffers temperature swings.
- Dry-rub salt effect: lowers surface wet-bulb temperature, deepens stall by ~5 °F.
- Radiative heat for kamado / direct-grill modes.

### 6.3 Medium-term
- Zone-gradient pit (direct + indirect): two-lumped-node pit, meat can move between.
- Full water gradient: replace lumped `w` with N-node water field co-diffusing with T.
- Flip / reposition: non-uniform fat cap orientation changes per-side h.
- Wind direction: firebox-side wind → overventilation → pit overshoot + early fuel exhaustion.

### 6.4 Long-term (research territory)
- Actual Flory-Rehner poroelastic model (Shehadeh 2020) for fully coupled shrinkage.
- Smoke chemistry PDE: guaiacol diffusion + adsorption kinetics.
- PAH/HCA generation model linked to peak surface temperature and fat drip pyrolysis.
- User-specific Bayesian calibration: save past cook outcomes, fit personal (α, h, UA) triplet.

---

## 7. File map

```
smoker.html                    ← entry; three screens (pregame / cook / score) + compare
css/smoker.css                 ← all smoker-specific styles
js/smoker/
  constants.js                 ← §8 of PHYSICS.md — all numeric truth
  heatDiffusion.js             ← 1D FDM + evap flux
  stallModel.js                ← logistic stall probability
  collagenModel.js             ← Arrhenius collagen integrator
  smokeModel.js                ← S_good, S_bad, ring gate
  fireModel.js                 ← per-coal bell curve + damper
  pitModel.js                  ← pit chamber energy balance
  restModel.js                 ← Newton cooling + juice rebound
  safety.js                    ← NEW: D-value food-safety integrator
  constraints.js               ← red/yellow predicate library
  simulator.js                 ← top-level orchestrator + event API
  monteCarlo.js                ← P10/P50/P90 forecaster
  decisions.js                 ← rule engine → ranked cards
  presets.js                   ← Texas / Competition / Backyard / Custom
  notify.js                    ← Web Audio + desktop alerts
  app.js                       ← view-model for Mission Control
```

---

## 8. Testing discipline

- **Every physics module carries its calibration anchor in a comment**. When the smoke test's headline value drifts more than 10 %, the anchor must be revisited.
- **The five-experiment regression** (stall · 250 F config · stall prevention · fastest · slowest) is the smoke test for any change to `constants.js` / `heatDiffusion.js` / `pitModel.js`.
- **Node stub DOM harness** (in commit history) verifies boot, decision-card ordering, Monte Carlo valid fraction, and localStorage round-trip.
