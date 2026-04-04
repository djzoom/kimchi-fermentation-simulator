/**
 * Fermentation Scientific Models
 * Supports: Korean Kimchi, Sichuan Paocai, German Sauerkraut
 * Calibrated against food science research data:
 *   - Baranyi & Roberts framework: μmax(T) = a₀ + a₁T + a₂T²
 *   - Arrhenius Ea = 57.9 kJ/mol
 *   - Sources: PMC7465714, PMC9728259, LWT 2024
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.models = (function () {
  'use strict';

  // ─── Ferment Type Profiles ───

  var FERMENT_PROFILES = {
    kimchi: {
      id: 'kimchi',
      // LAB growth (Baranyi & Roberts)
      a0: 0.0709, a1: 0.0152, a2: 0.00233,
      N0: 5.0, N_max: 9.5, A_max: 4.5,
      // pH
      pH_initial: 5.8, pH_min: 3.8, delta_pH_max: 2.0,
      k_pH_base: 0.32, mu_ref_for_pH: 0.456,
      // Optimal time: t*(T) ≈ A * exp(-k*T)
      t_star_A: 15.5, t_star_k: 0.11,
      // Acid & salt
      acid_max: 1.2, salt_optimal: 2.5, salt_k: 0.35,
      // Lag phase
      lambda_base: 1.0,
      // Starter
      starter_lambda_factor: 0.6, starter_N0_boost: 1.8,
      starter_pH_drop: 0.25, starter_speed_factor: 0.5,
      // Microbial succession
      sigmoid_k: 6.0,
      // Species: 3 species, pH-driven sigmoid switchover
      species: [
        { key: 'sakei',        phCenter: 5.0, direction: 'high' },  // dominates at high pH
        { key: 'mesenteroides', phCenter: 4.6, sigma: 0.5 },        // Gaussian peak
        { key: 'plantarum',    phCenter: 4.2, direction: 'low' }    // dominates at low pH
      ],
      starterBoost: { mesenteroides: 0.5, sakei: -0.4 },
      // Flavor scoring
      flavor_pH_center: 4.35, flavor_pH_sigma: 0.3,
      flavor_acid_center: 0.6, flavor_acid_sigma: 0.2,
      // Flavor weights: [pH, acid, keySpeciesFraction]
      flavor_weights: [0.5, 0.3, 0.2],
      flavor_key_species: 'mesenteroides',
      // Nitrite kinetics
      water_fraction: 0.88,
      nitrate_base: 34, nitrate_adi_flux: 1.8,
      sodium_ref_molar: 0.48,
      nitrite_form_base: 0.16, nitrite_yield: 0.78, nitrite_clear_base: 1.40,
      nitrite_safe: 3, nitrite_caution: 8,
      // Nitrite species weighting
      nitrite_reducer_weights: { sakei: 0.30, mesenteroides: 0.15 },
      nitrite_scavenger_key: 'plantarum', nitrite_scavenger_weight: 0.90,
      // Recipe
      recipe_base_weight: 2.5,
      recipe_items: {
        coarseSalt: 200, chili: 80, fish: 45, shrimp: 30,
        garlic: 36, ginger: 8, ricePaste: 40, scallion: 50
      }
    },

    sichuan: {
      id: 'sichuan',
      // LAB growth — Sichuan paocai typically ferments in brine with higher salt
      a0: 0.0580, a1: 0.0140, a2: 0.00210,
      N0: 4.8, N_max: 9.2, A_max: 4.4,
      // pH — starts slightly lower (brine-based), goes deep sour
      pH_initial: 5.5, pH_min: 3.5, delta_pH_max: 2.0,
      k_pH_base: 0.28, mu_ref_for_pH: 0.420,
      // Optimal time
      t_star_A: 12.0, t_star_k: 0.10,
      // Acid & salt — higher salt tolerance
      acid_max: 1.4, salt_optimal: 4.0, salt_k: 0.25,
      // Lag
      lambda_base: 1.2,
      // Starter (老盐水)
      starter_lambda_factor: 0.7, starter_N0_boost: 2.0,
      starter_pH_drop: 0.30, starter_speed_factor: 0.6,
      // Microbial succession
      sigmoid_k: 5.5,
      species: [
        { key: 'leuconostoc', phCenter: 5.0, direction: 'high' },
        { key: 'plantarum',   phCenter: 4.3, sigma: 0.45 },
        { key: 'pentosus',    phCenter: 3.9, direction: 'low' }
      ],
      starterBoost: { plantarum: 0.5, leuconostoc: -0.3 },
      // Flavor — optimal at deeper acidity, plantarum-driven crunch
      flavor_pH_center: 4.0, flavor_pH_sigma: 0.35,
      flavor_acid_center: 0.7, flavor_acid_sigma: 0.25,
      flavor_weights: [0.45, 0.35, 0.20],
      flavor_key_species: 'plantarum',
      // Nitrite — mixed vegetables, higher nitrate base
      water_fraction: 0.86,
      nitrate_base: 48, nitrate_adi_flux: 2.2,
      sodium_ref_molar: 0.72,
      nitrite_form_base: 0.18, nitrite_yield: 0.75, nitrite_clear_base: 1.30,
      nitrite_safe: 3, nitrite_caution: 8,
      nitrite_reducer_weights: { leuconostoc: 0.25, plantarum: 0.20 },
      nitrite_scavenger_key: 'pentosus', nitrite_scavenger_weight: 0.85,
      // Recipe (per 1kg vegetables)
      recipe_base_weight: 1.0,
      recipe_items: {
        coarseSalt: 50, sichPepper: 10, baijiu: 15, ginger: 10,
        sugar: 8, driedChili: 5, starAnise: 3, bayLeaf: 2
      }
    },

    sauerkraut: {
      id: 'sauerkraut',
      // LAB growth — cabbage-only, simpler microbiome
      a0: 0.0650, a1: 0.0160, a2: 0.00220,
      N0: 5.2, N_max: 9.8, A_max: 4.6,
      // pH — higher starting (raw cabbage), deep final acidity
      pH_initial: 6.2, pH_min: 3.5, delta_pH_max: 2.7,
      k_pH_base: 0.35, mu_ref_for_pH: 0.480,
      // Optimal time
      t_star_A: 18.0, t_star_k: 0.09,
      // Acid & salt — lower salt
      acid_max: 1.5, salt_optimal: 2.0, salt_k: 0.40,
      // Lag
      lambda_base: 0.8,
      // Starter (rarely used but supported)
      starter_lambda_factor: 0.5, starter_N0_boost: 1.5,
      starter_pH_drop: 0.20, starter_speed_factor: 0.4,
      // Microbial succession
      sigmoid_k: 5.0,
      species: [
        { key: 'mesenteroides', phCenter: 5.5, direction: 'high' },
        { key: 'plantarum',     phCenter: 4.5, sigma: 0.5 },
        { key: 'brevis',        phCenter: 4.0, direction: 'low' }
      ],
      starterBoost: { plantarum: 0.4, mesenteroides: -0.3 },
      // Flavor — classic sauerkraut tang
      flavor_pH_center: 4.1, flavor_pH_sigma: 0.35,
      flavor_acid_center: 0.8, flavor_acid_sigma: 0.25,
      flavor_weights: [0.45, 0.35, 0.20],
      flavor_key_species: 'plantarum',
      // Nitrite — cabbage has moderate nitrate
      water_fraction: 0.92,
      nitrate_base: 28, nitrate_adi_flux: 1.5,
      sodium_ref_molar: 0.38,
      nitrite_form_base: 0.14, nitrite_yield: 0.80, nitrite_clear_base: 1.50,
      nitrite_safe: 3, nitrite_caution: 8,
      nitrite_reducer_weights: { mesenteroides: 0.28, plantarum: 0.22 },
      nitrite_scavenger_key: 'brevis', nitrite_scavenger_weight: 0.80,
      // Recipe (per 1kg cabbage)
      recipe_base_weight: 1.0,
      recipe_items: {
        coarseSalt: 20, caraway: 3, juniper: 2, bayLeaf: 2
      }
    }
  };

  // Active profile — defaults to kimchi
  var activeProfile = 'kimchi';
  var PARAMS = Object.assign({}, FERMENT_PROFILES.kimchi);

  function setFermentType(type) {
    if (!FERMENT_PROFILES[type]) return;
    activeProfile = type;
    var profile = FERMENT_PROFILES[type];
    for (var key in profile) {
      if (profile.hasOwnProperty(key)) PARAMS[key] = profile[key];
    }
  }

  function getFermentType() {
    return activeProfile;
  }

  function getProfile(type) {
    return FERMENT_PROFILES[type || activeProfile];
  }

  function getAllTypes() {
    return Object.keys(FERMENT_PROFILES);
  }

  // ─── Core Math Utilities ───

  function safeExp(x) {
    return Math.exp(Math.max(-500, Math.min(500, x)));
  }

  function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function clamp01(x) {
    return clamp(x, 0, 1);
  }

  function gaussian(x, center, sigma) {
    return safeExp(-0.5 * Math.pow((x - center) / sigma, 2));
  }

  /**
   * Freezing point depression: T_freeze ≈ -0.6 * salt%
   */
  function freezingPoint(salt) {
    return -0.6 * (salt || PARAMS.salt_optimal);
  }

  /**
   * Temperature-dependent max growth rate
   * Baranyi & Roberts: μmax(T) = a₀ + a₁T + a₂T²
   */
  function muMax(T, salt) {
    var Tf = freezingPoint(salt);
    if (T < Tf) return 0.001;
    var mu = PARAMS.a0 + PARAMS.a1 * T + PARAMS.a2 * T * T;
    return Math.max(0.01, mu);
  }

  /**
   * Salt inhibition factor — Gaussian penalty
   */
  function saltFactor(salt) {
    return Math.max(0.05, safeExp(-PARAMS.salt_k * Math.pow(salt - PARAMS.salt_optimal, 2)));
  }

  function growthRate(T, salt) {
    return muMax(T, salt) * saltFactor(salt);
  }

  function lagPhase(T, starter) {
    var lambda = PARAMS.lambda_base * (PARAMS.mu_ref_for_pH / muMax(T));
    if (starter > 0) {
      var sf = Math.min(starter, 15) / 15;
      lambda *= (1 - PARAMS.starter_lambda_factor * sf);
    }
    return Math.max(0.02, lambda);
  }

  function effectiveN0(starter) {
    var sf = Math.min(Math.max(starter, 0), 15) / 15;
    return PARAMS.N0 + PARAMS.starter_N0_boost * sf;
  }

  function effectiveInitialPH(starter) {
    var sf = Math.min(Math.max(starter, 0), 15) / 15;
    return PARAMS.pH_initial - PARAMS.starter_pH_drop * sf;
  }

  function kPH(T, salt) {
    var sf = (salt !== undefined) ? saltFactor(salt) : 1;
    return PARAMS.k_pH_base * (muMax(T, salt) / PARAMS.mu_ref_for_pH) * sf;
  }

  function pH(t, T, pH_init_eff) {
    var k = kPH(T);
    var result = pH_init_eff - PARAMS.delta_pH_max * (1 - safeExp(-k * t));
    return Math.max(PARAMS.pH_min, result);
  }

  function lacticAcid(currentPH, pH_init_eff) {
    var drop = pH_init_eff - currentPH;
    return Math.max(0, PARAMS.acid_max * (drop / PARAMS.delta_pH_max));
  }

  function labGrowth(t, mu, lambda, N0_eff) {
    var A = PARAMS.A_max;
    var inner = (mu * Math.E / A) * (lambda - t) + 1;
    return N0_eff + A * safeExp(-safeExp(inner));
  }

  /**
   * Microbial composition — generic for all ferment types
   * Uses species config from active profile
   */
  function microbialComposition(currentPH, starter) {
    var k = PARAMS.sigmoid_k;
    var species = PARAMS.species;
    var result = {};
    var total = 0;

    for (var i = 0; i < species.length; i++) {
      var sp = species[i];
      var val;
      if (sp.direction === 'high') {
        // Dominant at high pH (early fermenter)
        val = 1 / (1 + safeExp(-k * (currentPH - sp.phCenter)));
      } else if (sp.direction === 'low') {
        // Dominant at low pH (late fermenter)
        val = 1 / (1 + safeExp(k * (currentPH - sp.phCenter)));
      } else {
        // Gaussian peak species
        val = gaussian(currentPH, sp.phCenter, sp.sigma || 0.5);
      }
      result[sp.key] = val;
      total += val;
    }

    // Starter boosts
    if (starter > 0 && PARAMS.starterBoost) {
      var sf = Math.min(starter, 15) / 15;
      for (var key in PARAMS.starterBoost) {
        if (result[key] !== undefined) {
          result[key] *= (1 + PARAMS.starterBoost[key] * sf);
          if (result[key] < 0) result[key] = 0;
        }
      }
      // Recalculate total
      total = 0;
      for (var key in result) total += result[key];
    }

    if (total < 0.001) total = 1;
    for (var key in result) result[key] /= total;

    return result;
  }

  /**
   * Flavor score (0-100) — uses profile-specific weights and key species
   */
  function flavorScore(currentPH, acid, composition) {
    var phFactor = gaussian(currentPH, PARAMS.flavor_pH_center, PARAMS.flavor_pH_sigma);
    var acidFactor = gaussian(acid, PARAMS.flavor_acid_center, PARAMS.flavor_acid_sigma);
    var w = PARAMS.flavor_weights;
    var keyFraction = composition[PARAMS.flavor_key_species] || 0;
    return Math.min(100, Math.max(0, 100 * (w[0] * phFactor + w[1] * acidFactor + w[2] * keyFraction)));
  }

  // ─── Nitrite Model ───

  function sodiumMgKg(salt) {
    var saltPct = Math.max(0, salt || 0);
    return saltPct * 10000 * (22.99 / 58.44);
  }

  function sodiumMolarity(salt) {
    var gramsNa = sodiumMgKg(salt) / 1000;
    return (gramsNa / 22.99) / PARAMS.water_fraction;
  }

  function initialNitriteState(salt, starter) {
    var starterRatio = Math.min(Math.max(starter || 0, 0), 15) / 15;
    var sodiumM = sodiumMolarity(salt);
    var ionicAvailability = 0.88 + 0.24 * (sodiumM / PARAMS.sodium_ref_molar);
    var nitrate = PARAMS.nitrate_base * ionicAvailability * (1 - 0.18 * starterRatio);

    return {
      nitrate: Math.max(12, nitrate),
      nitrite: 0.4,
      sodiumMgKg: sodiumMgKg(salt),
      sodiumMolar: sodiumM
    };
  }

  function nitriteStep(state, context, dt) {
    var T = context.temperature;
    var currentPH = context.pH;
    var currentN = context.labCount;
    var starter = context.starter || 0;
    var comp = context.composition || {};

    var formTempFactor = Math.max(0.18, Math.pow(muMax(T) / muMax(10), 1.15));
    var clearTempFactor = Math.max(0.65, Math.pow(muMax(T) / muMax(10), 0.35));
    var pHOpen = clamp01((currentPH - 4.35) / 1.05);
    var acidSuppression = clamp01((5.0 - currentPH) / 0.75);
    var labShield = clamp01((currentN - 5.8) / 1.8);
    var starterShield = 1 - 0.35 * Math.min(Math.max(starter, 0), 15) / 15;

    var ionicRelease = 0.82 + 0.28 * (state.sodiumMolar / PARAMS.sodium_ref_molar);
    var ionicBrake = 1 / (1 + Math.pow(Math.max(0, state.sodiumMolar - PARAMS.sodium_ref_molar) / 0.20, 2));

    // Generic reducer pressure from species weights
    var reducerPressure = 0.45;
    var rw = PARAMS.nitrite_reducer_weights || {};
    for (var sk in rw) {
      reducerPressure += rw[sk] * (comp[sk] || 0);
    }
    reducerPressure += 0.10 * pHOpen;

    var kForm = PARAMS.nitrite_form_base * formTempFactor * pHOpen * ionicRelease * ionicBrake * reducerPressure;
    kForm *= starterShield * (1 - 0.80 * labShield) * (1 - 0.85 * acidSuppression);
    kForm = Math.max(0, kForm);

    // Early species for adi flux — use first species (early dominant)
    var earlySpeciesKey = PARAMS.species[0].key;
    var earlyFraction = comp[earlySpeciesKey] || 0.33;
    var adiFlux = PARAMS.nitrate_adi_flux * formTempFactor * pHOpen * (0.35 + 0.65 * earlyFraction);
    adiFlux *= starterShield * (1 - 0.95 * acidSuppression);

    var nitrateToNitrite = Math.min(state.nitrate, state.nitrate * kForm * dt);
    state.nitrate = Math.max(0, state.nitrate + adiFlux * dt - nitrateToNitrite);

    // Scavenger species
    var scavengerFraction = comp[PARAMS.nitrite_scavenger_key] || 0.33;
    var plantarumScavenge = 0.45 + PARAMS.nitrite_scavenger_weight * scavengerFraction;
    var acidClear = 0.35 + 1.60 * acidSuppression;
    var labClear = 0.45 + 1.30 * labShield;
    var kClear = PARAMS.nitrite_clear_base * clearTempFactor * acidClear * labClear * plantarumScavenge;

    var nitriteProduced = nitrateToNitrite * PARAMS.nitrite_yield;
    var nitriteCleared = state.nitrite * kClear * dt;
    state.nitrite = Math.max(0, state.nitrite + nitriteProduced - nitriteCleared);

    return {
      nitrite: state.nitrite,
      nitrate: state.nitrate,
      sodiumMgKg: state.sodiumMgKg,
      sodiumMolar: state.sodiumMolar,
      formationRate: dt > 0 ? nitriteProduced / dt : 0,
      clearanceRate: dt > 0 ? nitriteCleared / dt : 0,
      pHOpen: pHOpen,
      acidSuppression: acidSuppression,
      labShield: labShield
    };
  }

  function optimalTime(T, salt, starter) {
    var t = PARAMS.t_star_A * safeExp(-PARAMS.t_star_k * T);
    t *= 1 + 0.3 * Math.max(0, salt - PARAMS.salt_optimal);
    t *= 1 - 0.12 * Math.max(0, PARAMS.salt_optimal - salt);
    if (starter > 0) {
      var sf = Math.min(starter, 15) / 15;
      t *= (1 - PARAMS.starter_speed_factor * sf);
    }
    return Math.max(0.2, t);
  }

  return {
    PARAMS: PARAMS,
    FERMENT_PROFILES: FERMENT_PROFILES,
    setFermentType: setFermentType,
    getFermentType: getFermentType,
    getProfile: getProfile,
    getAllTypes: getAllTypes,
    safeExp: safeExp,
    clamp: clamp,
    clamp01: clamp01,
    gaussian: gaussian,
    freezingPoint: freezingPoint,
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
    sodiumMgKg: sodiumMgKg,
    sodiumMolarity: sodiumMolarity,
    initialNitriteState: initialNitriteState,
    nitriteStep: nitriteStep,
    optimalTime: optimalTime
  };
})();
