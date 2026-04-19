/**
 * Smoker BBQ — Smoke uptake and ring. PHYSICS.md §5.
 * Splits accumulation into good (clean combustion) and bad (creosote).
 * Gated by surface temperature < 60°C.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.smokeModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  var K_UPTAKE = 1.0e-3;    // arbitrary units/s, tuned by product UX

  /**
   * Advance smoke accumulation.
   * @param {Object} s { good, bad, ringFrozen }
   * @param {number} tSurfC
   * @param {number} smokeDensity 0–1 normalised
   * @param {number} combustionEfficiency 0–1 (thin-blue=0.9, white=0.3)
   * @param {number} dtSec
   * @returns {Object} next state
   */
  function step(s, tSurfC, smokeDensity, combustionEfficiency, dtSec) {
    var next = { good: s.good, bad: s.bad, ringFrozen: s.ringFrozen };
    if (tSurfC >= C.SMOKE_RING_CUTOFF_C) {
      // Surface has crossed the window — ring locks, but bad smoke still accrues on bark
      if (!next.ringFrozen) next.ringFrozen = true;
      next.bad  += (1 - combustionEfficiency) * smokeDensity * K_UPTAKE * dtSec * 0.5;
      return next;
    }
    next.good += combustionEfficiency      * smokeDensity * K_UPTAKE * dtSec;
    next.bad  += (1 - combustionEfficiency) * smokeDensity * K_UPTAKE * dtSec;
    return next;
  }

  /**
   * Approximate smoke-ring depth (mm) from accumulated good-smoke before cutoff.
   * Capped at ~13 mm (1/2 inch).
   */
  function ringDepthMm(sGoodAtCutoff) {
    var depth = 3 + 50 * sGoodAtCutoff;
    return Math.min(depth, 13);
  }

  return { step: step, ringDepthMm: ringDepthMm };
})();
