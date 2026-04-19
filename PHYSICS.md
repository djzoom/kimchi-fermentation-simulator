# Smoker BBQ — Physics Model

Single source of truth for the smoker-grill brisket simulator. All equations, parameters, and units live here. Code in `js/smoker/` must cite this document by section.

---

## 1. State vector

Minimum viable state for a single cut of meat in a single pit:

```
meat  = { T(r), w, C, S_good, S_bad, wrap_state }
pit   = { T_pit }
fuel  = [{ t_ignite, m, type, phase }]
time  = t
```

- `T(r)` — radial temperature profile (°C), discretised to `N_NODES` half-thickness nodes. Lumped mode collapses to a single `T_core`.
- `w` — surface-available water fraction (0–1), drives evaporation.
- `C` — collagen→gelatin conversion fraction (0–1), Arrhenius integral.
- `S_good`, `S_bad` — accumulated smoke deposition, split by combustion quality.
- `wrap_state ∈ {none, butcher_paper, foil_boat, aluminum_foil}`.
- `T_pit` — chamber temperature (°C), driven by `Q_fire − losses − Q_to_meat`.
- `fuel[]` — event-driven list of active coals / wood chunks with per-item power curves.

---

## 2. Heat transfer — 1D radial FDM

Governing equation (heat diffusion, slab approximation):

```
∂T/∂t = α · ∂²T/∂r²
```

Explicit finite-difference update on `N_NODES + 1` nodes across the half-thickness:

```
Interior i:   T_i'  = T_i + Fo · (T_{i-1} − 2 T_i + T_{i+1})
Surface  0:   T_0'  = T_0 + Fo · (T_1 − T_0) + Fo · Bi · (T_pit − T_0)
Center  N:    T_N'  = T_N + Fo · (T_{N-1} − T_N)       [symmetry]
```

where

```
Fo = α · dt / dx²         (Fourier number)
Bi = h · dx / k           (Biot number)
dx = half_thickness / N_NODES
```

**Stability**: enforce `Fo · (1 + Bi) ≤ 0.5`; if violated, halve `dt` until satisfied.

**Surface evaporative sink** (coupled into surface-node update during stall zone `STALL_TEMP_LOW < T_0 < T_boil(elevation)`):

```
q_evap = ṁ_evap · L_v            (W/m²)
        = k_evap · (1 − wrap_reduction) · w · (T_0 − T_amb) · humidity_factor
T_0' -= (q_evap · dt) / (ρ · c_p · dx)
```

`ṁ_evap` is a phenomenological rate calibrated so that stall plateau lies in 65–77 °C for unwrapped brisket at 50 % RH, matching Blonder's sponge experiment and Baldwin's parameter envelope.

**Elevation-adjusted boiling point** (caps `T_0`):

```
T_boil(h_ft) = 100 − 3.3 × 10⁻³ · h_ft      (°C, simplified)
```

---

## 3. Water budget

Lumped water fraction (0 = bone dry, 1 = raw):

```
dw/dt = − (A_surface / m_dry) · ṁ_evap
```

When wrapped: `ṁ_evap *= (1 − WRAP_EVAP_REDUCTION[wrap_state])`.

**Rest-phase rebound** (juice redistribution, exponential approach to bound fraction):

```
w_retained(t_rest) = w_final + (w_bound − w_final) · (1 − e^{−t_rest / τ_rest})
τ_rest = 45 min   (typical, 1/3-approach at 15 min — matches the user's
                  rest-too-short failure mode)
```

This is the "juicy score" output, not a state variable driving heat transfer.

---

## 4. Collagen kinetics (tenderness)

Arrhenius-type first-order conversion, integrated only while heating:

```
dC/dt = (1 − C) · A_coll · exp(−E_a / (R · T_core_K))

A_coll = 2.6 × 10⁸  s⁻¹         (calibrated so t_half ≈ 2 h at 71 °C)
E_a    = 8.5 × 10⁴  J/mol
R      = 8.314       J/(mol·K)
```

Literature anchors:
- Onset ~60 °C / 140 °F
- Rapid range 71–82 °C (160–180 °F)
- "Done" when `C ≥ C* ≈ 0.85` (probe-soft equivalent)

`C` is monotonic non-decreasing; it does **not** reverse during rest.

---

## 5. Smoke uptake

Split into "good" (clean combustion) and "bad" (creosote) accumulations. Uptake is gated by **surface temperature window** — myoglobin binding and phenol condensation both need cold wet surface:

```
window(T_surf) = 1 if T_surf < 60 °C else 0

dS_good/dt = window · ρ_smoke · η_combustion · k_uptake
dS_bad/dt  = window · ρ_smoke · (1 − η_combustion) · k_uptake
```

`η_combustion` is a proxy for "thin blue smoke" quality — ≈ 0.9 for well-tended fire, dropping to 0.3 for starved/wet fuel. Drives the red-line "don't bury in white smoke early" rule (see OPERATIONS §3).

**Smoke ring** depth scales with `S_good` in the first 90 minutes only; after `T_surf` crosses 60 °C, the nitrosomyoglobin reaction is locked out (`dS_good/dt → 0`). Model this as a cap: `S_ring = min(S_good_at_60C, S_ring_max)`.

---

## 6. Stall — probabilistic

Following `tskunz/Predictive-Pitmaster`, stall is not a binary plateau but a **probability** that the instantaneous evaporation balance dominates. Inputs influence the logistic:

```
z = −3.0
    + 0.020 · humidity_pct
    + 0.100 · wind_mph
    + 0.500 · thickness_in
    − 4.000 · temp_slope_F_per_min
    + 0.150 · (−|T_core_F − 160|)

P(stall) = 1 / (1 + exp(−z))       for T_core_F ∈ [140, 185]
         = 0                       otherwise
```

Use `P(stall)` to modulate the effective `ṁ_evap` envelope in Monte Carlo runs, and as a user-facing diagnostic ("75 % likely to stall in the next 30 min").

---

## 7. Pit chamber — energy balance

```
C_pit · dT_pit/dt = Q_fire(t) − U·A_pit · (T_pit − T_amb) − Q_to_meat
```

- `C_pit` — effective thermal mass of steel + air; tuned per `EQUIPMENT_PROFILE`.
- `U·A_pit` — pit heat loss coefficient (empirical, per equipment).
- `Q_to_meat = h · A_meat · (T_pit − T_surface)`.

### 7.1 Fuel power curve

Each active fuel unit `i` contributes a bell curve:

```
P_i(τ) = P_peak_i · f(τ / τ_burn_i) · α(damper)

f(x) = x² / (x² + 0.25)  ·  exp(−(x − 0.5)² / 0.25)     (rising + plateau + decay)
τ    = t − t_ignite_i
```

Damper multiplier: `α(d) = 0.3 + 0.7 · (d / 100)` for intake opening `d ∈ [0, 100]`.

Typical per-unit values (charcoal briquette):
```
P_peak   = 25 W
τ_burn   = 60 min
```

`Q_fire(t) = Σ_i P_i(t) + Σ_wood Q_wood(t)`.

### 7.2 Wood chunks

Short pyrolysis pulse — mostly smoke, small heat pulse (~10–20 min):

```
Q_wood(t) = m_wood · ΔH_wood · h_pyrolysis((t − t_add) / τ_pyro)
ρ_smoke(t) ∝ m_wood · g(T_wood_surface)       (peaks at 200–400 °C)
```

---

## 8. Calibrated constants

All values adapted from Baldwin (CRC Handbook), Blonder (genuineideas.com), and `tskunz/Predictive-Pitmaster/simulation/constants.py`. Units explicit.

### 8.1 Thermal diffusivity α [m²/s]

Higher fat → lower α (fat has lower `k` and lower `ρ·c_p` than water):

| grade   | beef      | pork      | poultry   | lamb      |
|---------|-----------|-----------|-----------|-----------|
| select  | 1.33e-7   | 1.38e-7   | 1.47e-7   | 1.30e-7   |
| choice  | 1.28e-7   | 1.30e-7   | 1.40e-7   | 1.25e-7   |
| prime   | 1.23e-7   | 1.22e-7   | 1.35e-7   | 1.20e-7   |
| wagyu   | 1.18e-7   | —         | —         | —         |

Biological noise: ±10 % uniform per Monte Carlo draw.

### 8.2 Bulk material

```
k       = 0.45   W/(m·K)          (mid of Baldwin 0.4–0.6)
ρ       = 1060   kg/m³
c_p     = 3400   J/(kg·K)         (Baldwin 30–80 °C average)
L_v     = 2260   kJ/kg            (water vaporisation)
```

### 8.3 Convective h for smoker air

```
h_base    = 20   W/(m²·K)         (low forced convection, lid closed)
wind_mult = 1 + 0.05 · wind_mph   (capped at 2.0)
```

Open lid: `h *= 0.6`, `T_pit` drops 14 °C linearly over `τ_lidopen = 1 min` and recovers with `τ_recover = 15 min`.

### 8.4 Equipment profiles — pit-temp std deviation [°F]

```
electric = 5
pellet   = 8
kamado   = 10
wsm      = 15
kettle   = 20
offset   = 25
```

Noise is applied as Gaussian jitter on the `T_pit` setpoint within Monte Carlo.

### 8.5 Wrap evaporation reduction (fraction)

```
none           = 0.00
foil_boat      = 0.45
butcher_paper  = 0.60
aluminum_foil  = 0.95
```

### 8.6 Rest-phase cooling rate k [1/min]

Newton's law `dT/dt = −k · (T − T_amb)`:

```
open_air = 0.025
oven     = 0.005
cooler   = 0.003         (Cambro / insulated hold)
```

### 8.7 Safety & phase thresholds

```
REST_SAFETY_FLOOR = 145 °F / 63 °C       (USDA hold minimum)
STALL_TEMP_LOW    = 140 °F / 60 °C
STALL_TEMP_HIGH   = 185 °F / 85 °C
SMOKE_RING_CUTOFF =  60 °C                (surface, first ~90 min)
COLLAGEN_DONE     = 0.85                  (dimensionless)
BIOT_DEFAULT      = 0.3
N_NODES           = 50
BIOLOGICAL_NOISE  = 0.10                  (±10 % on α)
```

---

## 9. Monte Carlo forecasting

Replace single-point ETA with P10/P50/P90.

### 9.1 Noise sources

1. Thermal diffusivity — uniform ±10 % of `α[grade]`
2. Pit temperature — Gaussian with σ from `EQUIPMENT_PROFILES[equipment]`
3. Weather — wind and humidity independently perturbed ±15 %

### 9.2 Hybrid strategy

```
anchor = solve_heat(N_NODES=50, nominal_noise=0)    # high-fidelity median
batch  = solve_heat_batch(N_NODES=8, n_iter=5000)   # cheap spread sampling
P50    = anchor
spread = P90_batch − P10_batch
P10    = anchor − spread/2
P90    = anchor + spread/2
```

### 9.3 Confidence classification

```
spread  = P90 − P10              (minutes)
HIGH    if spread <  90
MEDIUM  if 90 ≤ spread ≤ 150
LOW     if spread > 150  or  valid_samples < 0.30 · n_iter
```

### 9.4 A/B policy comparison

Core product feature: run two Monte Carlo batches that differ in exactly one variable (e.g. rest time 15 min vs 60 min), report Δ in both ETA and juicy-score distributions. Directly addresses the user's "don't change too many variables at once" discipline.

---

## 10. Units policy

- Internal SI everywhere: seconds, metres, kilograms, kelvin, watts.
- UI layer converts to °F / inch / pound / minutes at the boundary.
- Time integration step: `dt = 1 min` default; auto-reduced for FDM stability.
- Simulation cap: `max_minutes = 1800` (30 h, covers low-and-slow brisket + long hold).

---

## 11. Primary sources

- Baldwin, *Heat Transfer in Meat* (CRC Handbook)
- Blonder, *Newton's Cooling Law Applied to a Two-Layer Sphere* (genuineideas.com)
- Shehadeh et al., *A Mathematical Model for Meat Cooking*, arXiv:1908.10787
- van der Sman (2013), Flory-Rehner chicken-meat cooking, Meat Science
- `tskunz/Predictive-Pitmaster` (GitHub) — module structure and calibrated constants
- AmazingRibs / Meathead + Blonder collaboration — stall physics and Texas Crutch
- Robbishfood — humidity × stall temperature dependence
