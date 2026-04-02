/**
 * Kimchi Fermentation Scientific Models
 * Calibrated against Korean food science research data:
 *   - Baranyi & Roberts framework: μmax(T) = a₀ + a₁T + a₂T²
 *   - Arrhenius Ea = 57.9 kJ/mol
 *   - pH data: 4°C→10d, 10°C→5d, 15°C→2.4d, 20°C→2d, 25°C→1d to optimal
 *   - Sources: PMC7465714, PMC9728259, LWT 2024
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.models = (function () {
  'use strict';

  // --- Calibrated Parameters ---
  var PARAMS = {
    // LAB growth (Baranyi & Roberts polynomial coefficients)
    // μmax(T) = a0 + a1*T + a2*T²  (per day)
    a0: 0.0709,
    a1: 0.0152,
    a2: 0.00233,

    // LAB population
    N0: 5.0,             // Initial LAB (log CFU/g) — ~100,000 CFU/g
    N_max: 9.5,          // Max LAB (log CFU/g) — ~3 billion CFU/g
    A_max: 4.5,          // Max increase = N_max - N0

    // pH model — calibrated to match experimental data
    pH_initial: 5.8,     // Initial pH (before fermentation)
    pH_min: 3.8,         // Minimum achievable pH
    delta_pH_max: 2.0,   // Max pH drop
    // k_pH calibrated: at 10°C, pH 5.8→4.2 in ~5 days
    // 1.6 = 2.0*(1-exp(-5*k)) → k ≈ 0.32
    k_pH_base: 0.32,     // pH decay rate at 10°C
    mu_ref_for_pH: 0.456, // μmax at 10°C (for scaling k_pH)

    // Optimal fermentation time: t*(T) ≈ 15.5 * exp(-0.11*T)
    // Verified: t*(4)=10d, t*(10)=5d, t*(15)=3d, t*(20)=1.7d, t*(25)=1d
    t_star_A: 15.5,
    t_star_k: 0.11,

    // Lactic acid
    acid_max: 1.2,        // Max lactic acid (%)

    // Salt
    salt_optimal: 2.5,    // Optimal NaCl (%)
    salt_k: 0.35,         // Salt inhibition coefficient

    // Lag phase
    lambda_base: 1.0,     // Lag at 10°C (days)

    // Starter culture
    starter_lambda_factor: 0.6,  // Max lag reduction 60%
    starter_N0_boost: 1.8,       // Max N0 boost (log CFU/g)
    starter_pH_drop: 0.25,       // Max initial pH drop
    starter_speed_factor: 0.5,   // Fermentation speed boost (up to 50% faster)

    // Microbial succession
    sigmoid_k: 6.0,

    // Flavor scoring
    flavor_pH_center: 4.35,
    flavor_pH_sigma: 0.3,
    flavor_acid_center: 0.6,
    flavor_acid_sigma: 0.2,
  };

  function safeExp(x) {
    return Math.exp(Math.max(-500, Math.min(500, x)));
  }

  function gaussian(x, center, sigma) {
    return safeExp(-0.5 * Math.pow((x - center) / sigma, 2));
  }

  /**
   * Temperature-dependent max growth rate
   * Baranyi & Roberts: μmax(T) = a₀ + a₁T + a₂T²
   */
  function muMax(T) {
    var mu = PARAMS.a0 + PARAMS.a1 * T + PARAMS.a2 * T * T;
    return Math.max(0.01, mu);
  }

  /**
   * Salt inhibition factor — Gaussian penalty
   */
  function saltFactor(salt) {
    return Math.max(0.05, safeExp(-PARAMS.salt_k * Math.pow(salt - PARAMS.salt_optimal, 2)));
  }

  /**
   * Effective growth rate (temperature + salt)
   */
  function growthRate(T, salt) {
    return muMax(T) * saltFactor(salt);
  }

  /**
   * Lag phase (days)
   */
  function lagPhase(T, starter) {
    // Lag decreases with temperature
    var lambda = PARAMS.lambda_base * (PARAMS.mu_ref_for_pH / muMax(T));
    // Starter reduces lag
    if (starter > 0) {
      var sf = Math.min(starter, 15) / 15;
      lambda *= (1 - PARAMS.starter_lambda_factor * sf);
    }
    return Math.max(0.02, lambda);
  }

  /**
   * Effective initial LAB count — boosted by starter
   */
  function effectiveN0(starter) {
    var sf = Math.min(Math.max(starter, 0), 15) / 15;
    return PARAMS.N0 + PARAMS.starter_N0_boost * sf;
  }

  /**
   * Effective initial pH — lowered by starter
   */
  function effectiveInitialPH(starter) {
    var sf = Math.min(Math.max(starter, 0), 15) / 15;
    return PARAMS.pH_initial - PARAMS.starter_pH_drop * sf;
  }

  /**
   * pH decay rate at given temperature
   * Scales proportionally with growth rate
   */
  function kPH(T) {
    return PARAMS.k_pH_base * (muMax(T) / PARAMS.mu_ref_for_pH);
  }

  /**
   * pH model: pH(t) = pH_init - ΔpH * (1 - exp(-k*t))
   */
  function pH(t, T, pH_init_eff) {
    var k = kPH(T);
    var result = pH_init_eff - PARAMS.delta_pH_max * (1 - safeExp(-k * t));
    return Math.max(PARAMS.pH_min, result);
  }

  /**
   * Lactic acid (%)
   */
  function lacticAcid(currentPH, pH_init_eff) {
    var drop = pH_init_eff - currentPH;
    return Math.max(0, PARAMS.acid_max * (drop / PARAMS.delta_pH_max));
  }

  /**
   * Modified Gompertz for LAB growth
   */
  function labGrowth(t, mu, lambda, N0_eff) {
    var A = PARAMS.A_max;
    var inner = (mu * Math.E / A) * (lambda - t) + 1;
    return N0_eff + A * safeExp(-safeExp(inner));
  }

  /**
   * Microbial composition based on pH
   */
  function microbialComposition(currentPH, starter) {
    var k = PARAMS.sigmoid_k;

    var sakei = 1 / (1 + safeExp(-k * (currentPH - 5.0)));
    var plantarum = 1 / (1 + safeExp(k * (currentPH - 4.2)));
    var meso = gaussian(currentPH, 4.6, 0.5);

    // Starter boosts mesenteroides
    if (starter > 0) {
      var sf = Math.min(starter, 15) / 15;
      meso *= (1 + 0.5 * sf);
      sakei *= (1 - 0.4 * sf);
    }

    var total = sakei + meso + plantarum;
    if (total < 0.001) total = 1;

    return {
      sakei: sakei / total,
      mesenteroides: meso / total,
      plantarum: plantarum / total
    };
  }

  /**
   * Flavor score (0-100)
   */
  function flavorScore(currentPH, acid, mesoFraction) {
    var phFactor = gaussian(currentPH, PARAMS.flavor_pH_center, PARAMS.flavor_pH_sigma);
    var acidFactor = gaussian(acid, PARAMS.flavor_acid_center, PARAMS.flavor_acid_sigma);
    return Math.min(100, Math.max(0, 100 * (0.5 * phFactor + 0.3 * acidFactor + 0.2 * mesoFraction)));
  }

  /**
   * Optimal time estimate (days)
   * t*(T) ≈ 15.5 * exp(-0.11*T)
   * Verified against Korean research data
   */
  function optimalTime(T, salt, starter) {
    var t = PARAMS.t_star_A * safeExp(-PARAMS.t_star_k * T);
    // Salt effect
    t *= 1 + 0.3 * Math.max(0, salt - PARAMS.salt_optimal);
    t *= 1 - 0.12 * Math.max(0, PARAMS.salt_optimal - salt);
    // Starter effect: up to 50% faster
    if (starter > 0) {
      var sf = Math.min(starter, 15) / 15;
      t *= (1 - PARAMS.starter_speed_factor * sf);
    }
    return Math.max(0.2, t);
  }

  return {
    PARAMS: PARAMS,
    safeExp: safeExp,
    gaussian: gaussian,
    muMax: muMax,
    saltFactor: saltFactor,
    growthRate: growthRate,
    lagPhase: lagPhase,
    effectiveN0: effectiveN0,
    effectiveInitialPH: effectiveInitialPH,
    kPH: kPH,
    pH: pH,
    lacticAcid: lacticAcid,
    labGrowth: labGrowth,
    microbialComposition: microbialComposition,
    flavorScore: flavorScore,
    optimalTime: optimalTime
  };
})();
