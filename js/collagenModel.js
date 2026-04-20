/**
 * Smoker BBQ — Collagen→gelatin conversion. PHYSICS.md §4.
 * Arrhenius-style first-order integrator.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.collagenModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  /**
   * Rate constant k(T) [1/s].
   */
  function rate(tCoreC) {
    var tK = tCoreC + 273.15;
    return C.COLLAGEN_PREFACTOR * Math.exp(-C.COLLAGEN_E_A / (C.GAS_CONSTANT * tK));
  }

  /**
   * Integrate C by one timestep. Monotonic non-decreasing.
   * @param {number} cCurrent current collagen conversion (0–1)
   * @param {number} tCoreC internal temperature (°C)
   * @param {number} dtSec
   * @returns {number} updated C
   */
  function step(cCurrent, tCoreC, dtSec) {
    if (tCoreC < 55) return cCurrent;    // negligible below 55°C
    var k = rate(tCoreC);
    var next = cCurrent + (1 - cCurrent) * k * dtSec;
    if (next > 1) next = 1;
    if (next < cCurrent) next = cCurrent;
    return next;
  }

  function isDone(cValue) {
    return cValue >= C.COLLAGEN_DONE;
  }

  return { rate: rate, step: step, isDone: isDone };
})();
