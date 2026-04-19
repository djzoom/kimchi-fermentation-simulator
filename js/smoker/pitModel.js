/**
 * Smoker BBQ — Pit chamber energy balance. PHYSICS.md §7.
 * T_pit is a state variable driven by Q_fire minus losses and heat to meat.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.pitModel = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  // Default pit thermal mass and loss — tuned for offset-style smoker behaviour.
  // UA chosen so 12 briquettes @ 80 W peak with damper=80 converge near 250°F.
  var C_PIT_DEFAULT  = 8000;     // J/K  (steel shell + air)
  var UA_PIT_DEFAULT = 4.5;      // W/K  (heat loss coefficient)

  /**
   * Advance T_pit one step.
   * @param {number} tPitC current pit temperature
   * @param {number} qFireW current fire power
   * @param {number} qToMeatW current transfer to meat
   * @param {number} tAmbC ambient
   * @param {number} dtSec
   * @param {Object} [opts] { cPit, uaPit, lidOpen, noiseC }
   */
  function step(tPitC, qFireW, qToMeatW, tAmbC, dtSec, opts) {
    opts = opts || {};
    var cPit  = opts.cPit  || C_PIT_DEFAULT;
    var uaPit = opts.uaPit || UA_PIT_DEFAULT;

    // Lid-open event: extra heat leak proportional to the gap
    var leak = opts.lidOpen ? uaPit * 8 : 0;

    var dT = (qFireW - (uaPit + leak) * (tPitC - tAmbC) - qToMeatW) / cPit * dtSec;
    var next = tPitC + dT;

    // Gaussian jitter from equipment profile (σ already in °F, convert to °C)
    if (opts.noiseC != null && opts.noiseC > 0) {
      // Box-Muller
      var u1 = Math.random(), u2 = Math.random();
      var z  = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-9))) * Math.cos(2 * Math.PI * u2);
      next += z * opts.noiseC;
    }
    return next;
  }

  /**
   * Heat flux to meat surface.
   */
  function qToMeat(tPitC, tSurfC, hEff, areaM2) {
    return hEff * areaM2 * (tPitC - tSurfC);
  }

  return {
    step: step,
    qToMeat: qToMeat,
    C_PIT_DEFAULT: C_PIT_DEFAULT,
    UA_PIT_DEFAULT: UA_PIT_DEFAULT
  };
})();
