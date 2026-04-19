/**
 * Smoker BBQ — Constants.
 * Single source of numeric truth. All values referenced from PHYSICS.md §8.
 * SI units internally (s, m, kg, K, W). UI layer converts at the boundary.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.constants = (function () {
  'use strict';

  // §8.1 — Thermal diffusivity α [m²/s], fat-grade dependent.
  var THERMAL_DIFFUSIVITY = {
    beef:    { select: 1.33e-7, choice: 1.28e-7, prime: 1.23e-7, wagyu: 1.18e-7 },
    pork:    { select: 1.38e-7, choice: 1.30e-7, prime: 1.22e-7 },
    poultry: { select: 1.47e-7, choice: 1.40e-7, prime: 1.35e-7 },
    lamb:    { select: 1.30e-7, choice: 1.25e-7, prime: 1.20e-7 }
  };

  // §8.2 — Bulk material
  var K_MEAT    = 0.45;      // W/(m·K)
  var RHO_MEAT  = 1060;      // kg/m³
  var CP_MEAT   = 3400;      // J/(kg·K)
  var L_V_WATER = 2.26e6;    // J/kg latent heat of vaporisation

  // §8.3 — Pit-side convective heat transfer
  var H_BASE = 20;           // W/(m²·K), low forced convection, lid closed
  var H_LID_OPEN_MULT = 0.6;
  var T_PIT_LID_DROP_C = 14;
  var TAU_LID_RECOVER_MIN = 15;

  // §8.4 — Equipment profiles: T_pit standard deviation (°F)
  var EQUIPMENT_PROFILES = {
    electric: 5, pellet: 8, kamado: 10,
    wsm:     15, kettle: 20, offset: 25
  };

  // §8.5 — Wrap evaporation reduction (fraction)
  var WRAP_EVAP_REDUCTION = {
    none:         0.00,
    foil_boat:    0.45,
    butcher_paper:0.60,
    aluminum_foil:0.95
  };

  // §8.6 — Rest-phase cooling rates (1/min)
  var REST_COOLING_RATE = {
    open_air: 0.025,
    oven:     0.005,
    cooler:   0.003
  };

  // §8.7 — Thresholds
  var REST_SAFETY_FLOOR_C = 63;          // USDA 145°F
  var STALL_TEMP_LOW_C    = 60;          // 140°F
  var STALL_TEMP_HIGH_C   = 85;          // 185°F
  var SMOKE_RING_CUTOFF_C = 60;          // surface temp
  var COLLAGEN_DONE       = 0.85;
  var BIOT_DEFAULT        = 0.3;
  var N_NODES             = 50;
  var BIOLOGICAL_NOISE    = 0.10;

  // §4 — Collagen kinetics
  var COLLAGEN_PREFACTOR = 2.6e8;        // 1/s
  var COLLAGEN_E_A       = 8.5e4;        // J/mol
  var GAS_CONSTANT       = 8.314;        // J/(mol·K)

  // §7.1 — Default fuel power per coal.
  // A standard briquette (~20 g at 29 kJ/g) releases ~580 kJ over ~90 min, mean 107 W.
  // The normalised bell curve in fireModel.js peaks at ~1.5× the mean, so P_PEAK ~160 W.
  var COAL_P_PEAK   = 150;               // W per briquette at curve peak
  var COAL_TAU_BURN_MIN = 90;            // min

  // §3 — Rest-phase juice rebound
  var TAU_REST_MIN  = 45;                // min; 1/3-approach at 15 min
  var W_BOUND       = 0.90;              // asymptotic re-bound water fraction

  // §6 — Stall logistic coefficients
  var STALL_LOGISTIC = {
    intercept:      -3.0,
    k_humidity:      0.020,
    k_wind:          0.100,
    k_thickness:     0.500,
    k_slope:        -4.000,
    k_distance:      0.150,
    peak_temp_f:   160.0,
    lo_f:          140.0,
    hi_f:          185.0
  };

  // §10 — Time integration
  var DT_MIN_DEFAULT = 60;               // s
  var MAX_MINUTES    = 1800;

  return {
    THERMAL_DIFFUSIVITY: THERMAL_DIFFUSIVITY,
    K_MEAT: K_MEAT,
    RHO_MEAT: RHO_MEAT,
    CP_MEAT: CP_MEAT,
    L_V_WATER: L_V_WATER,
    H_BASE: H_BASE,
    H_LID_OPEN_MULT: H_LID_OPEN_MULT,
    T_PIT_LID_DROP_C: T_PIT_LID_DROP_C,
    TAU_LID_RECOVER_MIN: TAU_LID_RECOVER_MIN,
    EQUIPMENT_PROFILES: EQUIPMENT_PROFILES,
    WRAP_EVAP_REDUCTION: WRAP_EVAP_REDUCTION,
    REST_COOLING_RATE: REST_COOLING_RATE,
    REST_SAFETY_FLOOR_C: REST_SAFETY_FLOOR_C,
    STALL_TEMP_LOW_C: STALL_TEMP_LOW_C,
    STALL_TEMP_HIGH_C: STALL_TEMP_HIGH_C,
    SMOKE_RING_CUTOFF_C: SMOKE_RING_CUTOFF_C,
    COLLAGEN_DONE: COLLAGEN_DONE,
    BIOT_DEFAULT: BIOT_DEFAULT,
    N_NODES: N_NODES,
    BIOLOGICAL_NOISE: BIOLOGICAL_NOISE,
    COLLAGEN_PREFACTOR: COLLAGEN_PREFACTOR,
    COLLAGEN_E_A: COLLAGEN_E_A,
    GAS_CONSTANT: GAS_CONSTANT,
    COAL_P_PEAK: COAL_P_PEAK,
    COAL_TAU_BURN_MIN: COAL_TAU_BURN_MIN,
    TAU_REST_MIN: TAU_REST_MIN,
    W_BOUND: W_BOUND,
    STALL_LOGISTIC: STALL_LOGISTIC,
    DT_MIN_DEFAULT: DT_MIN_DEFAULT,
    MAX_MINUTES: MAX_MINUTES,
    // Unit helpers at boundary
    fToC: function (f) { return (f - 32) * 5 / 9; },
    cToF: function (c) { return c * 9 / 5 + 32; },
    inchToM: function (inch) { return inch * 0.0254; },
    lbToKg: function (lb)   { return lb * 0.4535924; }
  };
})();
