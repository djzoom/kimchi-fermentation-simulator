/**
 * Smoker BBQ — Monte Carlo P10/P50/P90 forecaster. PHYSICS.md §9.
 * Hybrid anchor + batch strategy; noise on α, T_pit, weather.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.monteCarlo = (function () {
  'use strict';

  var C  = window.SmokerSim.constants;
  var CM = window.SmokerSim.collagenModel;
  var Sim = window.SmokerSim.simulator;

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function perturbInputs(inputs, seedRandom) {
    var r = seedRandom || Math.random;
    var p = clone(inputs);
    // α ±10%
    var alphaMult = 1 + (r() * 2 - 1) * C.BIOLOGICAL_NOISE;
    p._alphaMult = alphaMult;
    // Humidity ±15%
    p.humidityPct = Math.max(0, Math.min(100, (inputs.humidityPct || 50) * (1 + (r() * 2 - 1) * 0.15)));
    // Wind ±15%
    p.windMph = Math.max(0, (inputs.windMph || 2) * (1 + (r() * 2 - 1) * 0.15));
    return p;
  }

  /**
   * Run a single simulation to 'done by collagen' or max minutes.
   * Returns finish time (minutes) or null if not done.
   *
   * Default policy mimics a moderately attentive pitmaster:
   *   - igniteN coals at t=0
   *   - refuelN coals every refuelEveryMin
   *   - one wood chunk at t=0
   *   - auto-wrap at wrapAtF (once, if enabled)
   */
  function runToDone(inputs, policy) {
    var state = Sim.create(inputs);
    if (inputs._alphaMult) state.alpha *= inputs._alphaMult;

    policy = policy || {};
    var igniteN         = policy.igniteN         || 10;
    var refuelN         = policy.refuelN         || 4;
    var refuelEveryMin  = policy.refuelEveryMin  || 45;
    var damperPct       = policy.damperPct       || 70;
    var wrapAtF         = policy.wrapAtF         || 160;
    var autoWrap        = policy.autoWrap !== false;    // default on
    var wrapType        = policy.wrapType        || 'butcher_paper';

    Sim.ignite(state, igniteN);
    Sim.damper(state, damperPct);
    Sim.addWood(state, 0.2, 'hickory');

    var dtSec = C.DT_MIN_DEFAULT;
    var maxSec = C.MAX_MINUTES * 60;
    var nextRefuelMin = refuelEveryMin;
    for (var t = 0; t < maxSec; t += dtSec) {
      if (state.tSimMin >= nextRefuelMin) {
        Sim.refuel(state, refuelN);
        nextRefuelMin += refuelEveryMin;
      }
      if (autoWrap && state.wrapState === 'none' &&
          C.cToF(state.T[state.T.length - 1]) >= wrapAtF) {
        Sim.wrap(state, wrapType);
      }
      Sim.step(state, dtSec);
      if (CM.isDone(state.C)) return state.tSimMin;
    }
    return null;
  }

  /**
   * Monte Carlo batch — simple version (no vectorised optimisation yet).
   * Returns { P10, P50, P90, confidence, validFraction, samples }.
   */
  function forecast(inputs, policy, nIter) {
    nIter = nIter || 200;   // start small; user can scale up
    var samples = [];
    for (var i = 0; i < nIter; i++) {
      var p = perturbInputs(inputs);
      var finish = runToDone(p, policy);
      if (finish != null) samples.push(finish);
    }
    samples.sort(function (a, b) { return a - b; });
    var valid = samples.length / nIter;
    function pct(p) {
      if (samples.length === 0) return null;
      var idx = Math.floor(p * (samples.length - 1));
      return samples[idx];
    }
    var p10 = pct(0.10), p50 = pct(0.50), p90 = pct(0.90);
    var spread = (p90 != null && p10 != null) ? (p90 - p10) : Infinity;
    var confidence = classifyConfidence(spread, valid);
    return {
      P10: p10, P50: p50, P90: p90,
      spread: spread,
      validFraction: valid,
      confidence: confidence,
      samples: samples
    };
  }

  function classifyConfidence(spreadMin, validFraction) {
    if (validFraction < 0.30) return 'LOW';
    if (spreadMin < 90)       return 'HIGH';
    if (spreadMin <= 150)     return 'MEDIUM';
    return 'LOW';
  }

  /**
   * A/B policy comparison — run two forecasts differing in exactly one variable.
   */
  function compare(inputs, policyA, policyB, nIter) {
    var a = forecast(inputs, policyA, nIter);
    var b = forecast(inputs, policyB, nIter);
    return {
      A: a, B: b,
      deltaP50: (b.P50 || 0) - (a.P50 || 0)
    };
  }

  return {
    perturbInputs: perturbInputs,
    runToDone: runToDone,
    forecast: forecast,
    compare: compare,
    classifyConfidence: classifyConfidence
  };
})();
