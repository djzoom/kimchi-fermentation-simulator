/**
 * Smoker Dynamics — Pathogen-kill D-value integrator. PHYSICS.md §5.
 *
 * Implements the Bigelow model for thermal destruction of foodborne
 * pathogens, integrated at the SURFACE of the meat (the coldest-pathogen
 * zone in whole-muscle BBQ).
 *
 *   D(T) = D_ref · 10^((T_ref − T) / z)       [minutes to 1-log reduction]
 *   dK/dt = (1 min) / D(T)                    [log reductions per minute]
 *
 * Constants calibrated for Salmonella in beef whole muscle:
 *   D_ref  = 1.0 min at T_ref = 160 °F (71.1 °C)
 *   z      = 5.56 °C  (FDA standard)
 *
 * USDA target for whole muscle beef cooked to safety: 7-log reduction (K ≥ 7).
 * "Low-and-slow" BBQ typically over-kills — useful as a *constraint* not a goal.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.safety = (function () {
  'use strict';

  var D_REF_MIN   = 1.0;      // min
  var T_REF_C     = 71.1;     // 160 °F
  var Z_C         = 5.56;     // Bigelow z-value
  var K_SAFE      = 7.0;      // log reductions target

  /**
   * Instantaneous D-value for a given temperature.
   * Returns minutes required for one log-reduction at that T.
   * Below 50 °C, treat pathogens as effectively non-decaying (D → ∞).
   */
  function dValueMin(tC) {
    if (tC < 50) return Infinity;
    return D_REF_MIN * Math.pow(10, (T_REF_C - tC) / Z_C);
  }

  /**
   * Advance the cumulative log-reduction K by one time step.
   * @param {number} kCurrent  current log-reductions accrued
   * @param {number} tSurfC    surface temperature (°C) — conservative (cold zone)
   * @param {number} dtSec     time step seconds
   */
  // Cap to keep UI/display sane: pathogens can't become "more dead" than dead.
  var K_MAX_DISPLAY = 20;

  function step(kCurrent, tSurfC, dtSec) {
    var D = dValueMin(tSurfC);
    if (!isFinite(D)) return kCurrent;
    var dtMin = dtSec / 60;
    var next = kCurrent + (dtMin / D);
    return next > K_MAX_DISPLAY ? K_MAX_DISPLAY : next;
  }

  /**
   * Danger-zone timer: minutes during which surface is between 4–60 °C.
   * Industry rule: total danger-zone exposure must stay < 4 h (240 min).
   */
  function inDangerZone(tSurfC) {
    return tSurfC >= 4 && tSurfC < 60;
  }

  function isSafe(kValue) { return kValue >= K_SAFE; }

  /**
   * Summary for UI: human-readable status plus percentage to safety.
   */
  function summarise(kValue) {
    var pct = Math.min(100, (kValue / K_SAFE) * 100);
    var label;
    if (kValue < 1)         label = 'raw';
    else if (kValue < 4)    label = 'partial';
    else if (kValue < K_SAFE) label = 'nearly safe';
    else                    label = 'safe';
    return { pct: pct, label: label, kValue: kValue };
  }

  return {
    dValueMin: dValueMin,
    step: step,
    inDangerZone: inDangerZone,
    isSafe: isSafe,
    summarise: summarise,
    K_SAFE: K_SAFE
  };
})();
