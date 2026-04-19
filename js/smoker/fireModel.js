/**
 * Smoker BBQ — Fuel events and Q_fire(t). PHYSICS.md §7.1.
 * Each coal is a bell-curve power source. Sum defines pit heat input.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.fireModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  // Peak of the raw kernel, precomputed so coalCurve returns values normalised to [0, 1].
  var COAL_PEAK_NORM = (function () {
    var m = 0;
    for (var x = 0.01; x < 1.3; x += 0.01) {
      var v = (x * x) / (x * x + 0.25) * Math.exp(-((x - 0.5) * (x - 0.5)) / 0.25);
      if (v > m) m = v;
    }
    return m || 1;
  })();

  /**
   * Per-coal bell curve, peak normalised to 1. Input x = elapsed / τ_burn.
   */
  function coalCurve(x) {
    if (x < 0) return 0;
    if (x > 1.3) return 0;
    var rising = (x * x) / (x * x + 0.25);
    var decay  = Math.exp(-((x - 0.5) * (x - 0.5)) / 0.25);
    return (rising * decay) / COAL_PEAK_NORM;
  }

  /**
   * Damper multiplier. d ∈ [0, 100] (intake opening %).
   */
  function damperAlpha(d) {
    return 0.3 + 0.7 * (Math.max(0, Math.min(100, d)) / 100);
  }

  /**
   * Total Q_fire at time tMin given coal list.
   * @param {Array} coals [{ tIgniteMin, pPeak, tauBurnMin }, ...]
   * @param {number} tMin current sim time (min)
   * @param {number} damperPct
   * @returns {number} W
   */
  function qFire(coals, tMin, damperPct) {
    var alpha = damperAlpha(damperPct);
    var total = 0;
    for (var i = 0; i < coals.length; i++) {
      var c = coals[i];
      var x = (tMin - c.tIgniteMin) / c.tauBurnMin;
      total += c.pPeak * coalCurve(x);
    }
    return total * alpha;
  }

  /**
   * Fraction of a coal's burn elapsed (0 = just lit, 1 = fully burned).
   * Used by refuel-timing yellow-line (Y1).
   */
  function coalProgress(coal, tMin) {
    return (tMin - coal.tIgniteMin) / coal.tauBurnMin;
  }

  /**
   * Add n fresh coals as a single event.
   */
  function refuel(coals, n, tMin, pPeak, tauBurnMin) {
    var p = (pPeak == null) ? C.COAL_P_PEAK : pPeak;
    var tau = (tauBurnMin == null) ? C.COAL_TAU_BURN_MIN : tauBurnMin;
    for (var i = 0; i < n; i++) {
      coals.push({ tIgniteMin: tMin, pPeak: p, tauBurnMin: tau });
    }
    return coals;
  }

  return {
    coalCurve: coalCurve,
    damperAlpha: damperAlpha,
    qFire: qFire,
    coalProgress: coalProgress,
    refuel: refuel
  };
})();
