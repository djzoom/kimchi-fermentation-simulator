/**
 * Smoker BBQ — Rest phase. PHYSICS.md §3 (water rebound) + §8.6 (cooling).
 * Two mechanisms: Newton cooling of T_core, exponential w-rebound as juices redistribute.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.restModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  /**
   * T_core during rest — Newton's law of cooling.
   * @param {number} tPullC temperature at pull (°C)
   * @param {number} tAmbC ambient / holder temperature (°C)
   * @param {number} tMin minutes into rest
   * @param {string} method 'open_air' | 'oven' | 'cooler'
   */
  function restTemperatureC(tPullC, tAmbC, tMin, method) {
    var k = C.REST_COOLING_RATE[method] != null ? C.REST_COOLING_RATE[method] : C.REST_COOLING_RATE.open_air;
    return tAmbC + (tPullC - tAmbC) * Math.exp(-k * tMin);
  }

  /**
   * Safety check — USDA hold floor (63°C / 145°F).
   */
  function isSafeAt(tCoreC) {
    return tCoreC >= C.REST_SAFETY_FLOOR_C;
  }

  /**
   * Juice-rebound factor. Exponential approach to bound fraction.
   * @param {number} wPull water fraction at pull
   * @param {number} tMin minutes into rest
   * @returns {number} retained water fraction 0–1
   */
  function wRetained(wPull, tMin) {
    return wPull + (C.W_BOUND - wPull) * (1 - Math.exp(-tMin / C.TAU_REST_MIN));
  }

  /**
   * Recommended rest time for 95% rebound completion.
   */
  function recommendedMin() {
    return Math.round(3 * C.TAU_REST_MIN);    // 3τ ≈ 95%
  }

  return {
    restTemperatureC: restTemperatureC,
    isSafeAt: isSafeAt,
    wRetained: wRetained,
    recommendedMin: recommendedMin
  };
})();
