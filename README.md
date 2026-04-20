# Smoker Dynamics · 烟熏动力学

**Your digital pitmaster.** Interactive BBQ simulator that predicts the stall, recommends when to wrap, and tells you when to pull — grounded in real heat-transfer physics, not guesswork.

<p align="center">
  <em>Decisions, not dials. 决策胜过仪表。</em>
</p>

---

## What it does

1. **Picks a style** — Texas, Competition, Backyard, or Custom.
2. **Simulates the whole cook in real or accelerated time** (1× to 600×).
3. **Surfaces the next-best action** as ranked cards: light the fire, add smoke wood, wrap now, pull now, start probing, rest more — every decision explained with quantified impact.
4. **Forecasts finish time with uncertainty** (Monte Carlo P10/P50/P90, wall-clock ETA).
5. **Compares two styles side-by-side** with a quantified winner per axis.
6. **Alerts** via Web Audio tones and desktop notifications on new verdicts.

## Physics under the hood

- 1D radial heat diffusion (explicit FDM, Robin BC, surface evaporative sink)
- Arrhenius collagen→gelatin kinetics for tenderness
- Logistic stall probability as a function of humidity, wind, thickness, slope
- Per-coal bell-curve fuel + damper + pit energy balance
- Bigelow D-value integrator for pathogen kill (Salmonella)
- Newton cooling + juice-rebound during rest

Calibrated against a five-experiment regression so stall plateau parks at 148–175°F, 8 coals + 4/45 min refuel lands pit at 250°F, and wrap saves ~12 h vs unwrapped extreme.

See [`PHYSICS.md`](./PHYSICS.md) for equations, constants, and sources.

## UX principles

- **Status over numbers** — phase pill ("🟡 Stall") sits above the big readouts
- **Bilingual** 中英对照 throughout — English primary, Chinese subtitle
- **Progressive disclosure** — default home hides the chart, event grid, and history behind `<details>`
- **Mobile-first** — 44 px touch targets, safe-area insets, sticky sim bar at the bottom
- **Red lines are terminal** — violations annotated in timeline, not un-violatable
- **Uncertainty visible** — ETA always ± range with LOW/MEDIUM/HIGH confidence

See [`DESIGN.md`](./DESIGN.md) for the full design canvas, [`OPERATIONS.md`](./OPERATIONS.md) for red/yellow/green constraints and the ten-mode failure library.

## Run locally

No build step. Zero dependencies at build time; Chart.js loaded from CDN.

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Layout

```
index.html                      ← entry point (three screens)
css/styles.css                  ← theme + all smoker styles (merged)
js/
  constants.js                  ← numeric truth (α, h, UA, stall coeffs, …)
  heatDiffusion.js              ← 1D FDM solver + evap flux
  stallModel.js                 ← logistic stall probability
  collagenModel.js              ← Arrhenius integrator
  smokeModel.js                 ← good vs bad smoke accumulation
  fireModel.js                  ← per-coal bell curve + damper
  pitModel.js                   ← pit chamber energy balance
  restModel.js                  ← Newton cooling + juice rebound
  safety.js                     ← D-value pathogen-kill integrator
  constraints.js                ← red/yellow predicate library
  simulator.js                  ← orchestrator + event API
  monteCarlo.js                 ← P10/P50/P90 forecaster
  decisions.js                  ← ranked decision-card engine
  presets.js                    ← four cook styles
  notify.js                     ← Web Audio + desktop alerts
  app.js                        ← view-model + bootstrap
PHYSICS.md                      ← physics design doc
OPERATIONS.md                   ← operations & failure-mode library
DESIGN.md                       ← overall design canvas
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause |
| `R` | Reset |
| `W` | Wrap in butcher paper |
| `F` | Wrap in foil |
| `+` | Add 3 coals |
| `S` | Spritz |
| `D` | Toggle dark mode |
| `Esc` | Close dialog |
| `?` | Show help |

## License

MIT — see [`LICENSE`](./LICENSE).

---

*Originally incubated inside `djzoom/kimchi-fermentation-simulator`. Extracted to its own repo so physics-driven food simulators can be added without cross-contamination.*
