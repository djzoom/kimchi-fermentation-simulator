/**
 * Smoker BBQ — 1D radial heat diffusion.
 * Explicit FDM, Robin BC at surface, symmetry at center. PHYSICS.md §2.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.heatDiffusion = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  /**
   * Build initial temperature profile (uniform).
   * @param {number} nNodes half-thickness nodes
   * @param {number} tInitC initial internal temperature (°C)
   * @returns {Float64Array} size nNodes+1, index 0 = surface, nNodes = center
   */
  function initProfile(nNodes, tInitC) {
    var T = new Float64Array(nNodes + 1);
    for (var i = 0; i <= nNodes; i++) T[i] = tInitC;
    return T;
  }

  /**
   * Compute Fourier and Biot numbers; auto-reduce dt if unstable.
   * Returns { dt, fo, bi } with stable dt.
   */
  function stableStep(alpha, h, k, dx, dtRequestedSec) {
    var bi = (h * dx) / k;
    var dt = dtRequestedSec;
    var fo = (alpha * dt) / (dx * dx);
    // enforce fo * (1 + bi) <= 0.5
    var limit = 0.5 / (1 + bi);
    if (fo > limit) {
      dt = limit * dx * dx / alpha;
      fo = (alpha * dt) / (dx * dx);
    }
    return { dt: dt, fo: fo, bi: bi };
  }

  /**
   * Advance one explicit step. Mutates T in-place.
   * @param {Float64Array} T current profile
   * @param {number} tPitC pit temperature (°C)
   * @param {number} fo Fourier number
   * @param {number} bi Biot number
   * @param {number} evapCoolC surface temperature decrement from evaporation (°C this step)
   * @param {number} tBoilC elevation-adjusted boiling cap (°C)
   */
  function stepExplicit(T, tPitC, fo, bi, evapCoolC, tBoilC) {
    var n = T.length - 1;
    var next = new Float64Array(n + 1);

    // Surface node 0 — Robin BC
    next[0] = T[0]
      + fo * (T[1] - T[0])
      + fo * bi * (tPitC - T[0])
      - evapCoolC;

    // Interior
    for (var i = 1; i < n; i++) {
      next[i] = T[i] + fo * (T[i - 1] - 2 * T[i] + T[i + 1]);
    }

    // Center node — symmetry
    next[n] = T[n] + fo * (T[n - 1] - T[n]);

    // Boiling cap on surface (can't exceed local T_boil while water phase-changes)
    if (next[0] > tBoilC) next[0] = tBoilC;

    for (var j = 0; j <= n; j++) T[j] = next[j];
  }

  /**
   * Elevation-adjusted boiling point (°C). PHYSICS.md §2.
   */
  function boilingPointC(elevationFt) {
    return 100 - 3.3e-3 * elevationFt;
  }

  /**
   * Water evaporation mass flux at the surface, kg/(m²·s).
   * Phenomenological, calibrated so an unwrapped brisket stalls near 72 °C
   * and loses ~15–25 % water over a 10–12 h cook.
   *   - Active only above STALL_TEMP_LOW_C (below that, surface is too cold).
   *   - Suppressed by wrap, damp air, depleted w.
   */
  function evapFluxKgPerM2S(tSurfC, tAmbC, w, wrapReduction, humidityFactor) {
    if (tSurfC < C.STALL_TEMP_LOW_C) return 0;
    if (w <= 0) return 0;
    // Calibrated 2026-04 against the user's real "wrap saves 1–2 h" feedback.
    // 6e-4 deepens the stall plateau enough that wrap interventions shave
    // ~60–90 min vs ~15 min at the previous 4e-4.
    var maxFlux = 5.0e-4;                           // peak rate at reference conditions
    var driving = Math.max(0, tSurfC - tAmbC) / 60; // 1.0 at 60 °C delta
    return maxFlux * (1 - wrapReduction) * w * driving * humidityFactor;
  }

  /**
   * Surface-node temperature decrement from evaporation (°C) for this dt.
   */
  function evapCoolingC(tSurfC, tAmbC, w, wrapReduction, humidityFactor, dx, dtSec) {
    var flux = evapFluxKgPerM2S(tSurfC, tAmbC, w, wrapReduction, humidityFactor);
    if (flux === 0) return 0;
    var fluxW = flux * C.L_V_WATER;                 // W/m²
    return (fluxW * dtSec) / (C.RHO_MEAT * C.CP_MEAT * dx);
  }

  return {
    initProfile: initProfile,
    stableStep: stableStep,
    stepExplicit: stepExplicit,
    boilingPointC: boilingPointC,
    evapCoolingC: evapCoolingC,
    evapFluxKgPerM2S: evapFluxKgPerM2S
  };
})();
