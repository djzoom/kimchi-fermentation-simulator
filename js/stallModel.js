/**
 * Smoker BBQ — Stall as probability. PHYSICS.md §6.
 * Logistic hazard function over internal temperature.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.stallModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  /**
   * P(stall) in [0, 1]. Zero outside 140–185°F band.
   * @param {number} tCoreF current internal temperature (°F)
   * @param {number} humidityPct 0–100
   * @param {number} windMph
   * @param {number} thicknessIn
   * @param {number} slopeFPerMin dT_core/dt (°F/min)
   */
  function stallProbability(tCoreF, humidityPct, windMph, thicknessIn, slopeFPerMin) {
    var L = C.STALL_LOGISTIC;
    if (tCoreF < L.lo_f || tCoreF > L.hi_f) return 0;
    var distance = -Math.abs(tCoreF - L.peak_temp_f);
    var z = L.intercept
      + L.k_humidity  * humidityPct
      + L.k_wind      * windMph
      + L.k_thickness * thicknessIn
      + L.k_slope     * slopeFPerMin
      + L.k_distance  * distance;
    return 1 / (1 + Math.exp(-z));
  }

  return { stallProbability: stallProbability };
})();
