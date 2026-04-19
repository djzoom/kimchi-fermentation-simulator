/**
 * Smoker BBQ — Top-level integrator.
 * Composes heatDiffusion, collagen, smoke, fire, pit, rest into a single step.
 * Event-driven control inputs (refuel, wrap, spritz, lid, pull, slice).
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.simulator = (function () {
  'use strict';

  var C  = window.SmokerSim.constants;
  var HD = window.SmokerSim.heatDiffusion;
  var CM = window.SmokerSim.collagenModel;
  var SM = window.SmokerSim.smokeModel;
  var FM = window.SmokerSim.fireModel;
  var PM = window.SmokerSim.pitModel;
  var RM = window.SmokerSim.restModel;

  /**
   * Construct a fresh simulation state from inputs.
   * @param {Object} inputs
   *   - protein, grade
   *   - thicknessIn, weightLb
   *   - equipment ('offset'|'pellet'|...)
   *   - elevationFt
   *   - tAmbF, humidityPct, windMph
   *   - wrapType ('none'|'foil_boat'|'butcher_paper'|'aluminum_foil')
   *   - tInitF initial meat temperature
   */
  function create(inputs) {
    var alpha = C.THERMAL_DIFFUSIVITY[inputs.protein][inputs.grade];
    var halfThickM = C.inchToM(inputs.thicknessIn) / 2;
    var n = C.N_NODES;
    var dx = halfThickM / n;
    var tInitC = C.fToC(inputs.tInitF != null ? inputs.tInitF : 40);
    return {
      // Inputs locked in
      alpha:         alpha,
      halfThickM:    halfThickM,
      dx:            dx,
      weightLb:      inputs.weightLb || 10,
      areaM2:        0.07,                     // placeholder: 10 lb brisket ≈ 700 cm²
      tAmbC:         C.fToC(inputs.tAmbF != null ? inputs.tAmbF : 70),
      humidityPct:   inputs.humidityPct || 50,
      windMph:       inputs.windMph || 2,
      equipment:     inputs.equipment || 'offset',
      elevationFt:   inputs.elevationFt || 0,

      // Mutable state
      tSimMin:       0,
      T:             HD.initProfile(n, tInitC),
      w:             0.75,                     // raw brisket surface-available water fraction
      wSurface:      1.0,
      C:             0.0,
      smoke:         { good: 0, bad: 0, ringFrozen: false },
      smokeRingGoodAtCutoff: 0,

      // Pit
      tPitC:         C.fToC(230),              // idle pre-meat; user raises via damper/fuel
      coals:         [],
      damperPct:     60,
      woodAdds:      [],

      // Wrap / phase
      wrapState:     inputs.wrapType || 'none',
      phase:         'bark_build',

      // Outputs / flags
      lidOpenSec:    0,
      dangerZoneMin: 0,
      eventLog:      []
    };
  }

  /**
   * Advance the simulation by dtSec seconds. Internally runs multiple
   * FDM micro-steps so the heat equation stays stable regardless of caller dt.
   */
  function step(state, dtSec) {
    var n = state.T.length - 1;

    // Resolve stable sub-dt once, subdivide the request.
    var stab = HD.stableStep(state.alpha, C.H_BASE, C.K_MEAT, state.dx, dtSec);
    var fo = stab.fo, bi = stab.bi;
    var subDt = stab.dt;
    var nSub = Math.max(1, Math.ceil(dtSec / subDt));
    subDt = dtSec / nSub;
    // Recompute fo for the chosen subDt
    fo = (state.alpha * subDt) / (state.dx * state.dx);

    var wrapRed = C.WRAP_EVAP_REDUCTION[state.wrapState] || 0;
    var humidityFactor = 1 - 0.5 * (state.humidityPct / 100);
    var tBoilC = HD.boilingPointC(state.elevationFt);

    for (var s = 0; s < nSub; s++) {
      // Pit update
      var qFire = FM.qFire(state.coals, state.tSimMin, state.damperPct);
      var hEff  = C.H_BASE * (1 + 0.05 * state.windMph);
      if (state.lidOpenSec > 0) hEff *= C.H_LID_OPEN_MULT;
      var qToMeat = PM.qToMeat(state.tPitC, state.T[0], hEff, state.areaM2);
      state.tPitC = PM.step(state.tPitC, qFire, qToMeat, state.tAmbC, subDt, {
        lidOpen: state.lidOpenSec > 0
      });

      // Meat surface evap cooling + water-loss flux (kg/m²/s)
      var flux = HD.evapFluxKgPerM2S(state.T[0], state.tAmbC, state.w, wrapRed, humidityFactor);
      var evapC = 0;
      if (flux > 0) {
        var fluxW = flux * C.L_V_WATER;
        evapC = (fluxW * subDt) / (C.RHO_MEAT * C.CP_MEAT * state.dx);
      }

      // Meat heat diffusion step
      HD.stepExplicit(state.T, state.tPitC, fo, bi, evapC, tBoilC);

      // Water budget: d(w)/dt = -flux · (A/m_meat). Normalised so an unwrapped
      // brisket loses ~15–25 % over a full cook at ref conditions.
      if (flux > 0) {
        var meatMassKg = (state.weightLb || 10) * 0.4535924;
        var areaPerMass = state.areaM2 / meatMassKg;
        state.w = Math.max(0, state.w - flux * areaPerMass * subDt);
        state.wSurface = Math.max(0, state.wSurface - flux * areaPerMass * subDt * 5);
      }

      // Collagen (core temperature)
      state.C = CM.step(state.C, state.T[n], subDt);

      // Smoke
      var smokeDensity = densityFromWood(state.woodAdds, state.tSimMin);
      var eta = combustionEfficiency(state);
      state.smoke = SM.step(state.smoke, state.T[0], smokeDensity, eta, subDt);
      if (!state.smoke.ringFrozen) state.smokeRingGoodAtCutoff = state.smoke.good;

      // Danger zone
      if (state.T[0] >= 4 && state.T[0] < 60) {
        state.dangerZoneMin += subDt / 60;
      }

      // Lid recovery
      if (state.lidOpenSec > 0) state.lidOpenSec = Math.max(0, state.lidOpenSec - subDt);

      state.tSimMin += subDt / 60;
    }
    return state;
  }

  /**
   * Wood chunks contribute a short pyrolysis pulse; sum active ones for smoke density 0–1.
   */
  function densityFromWood(woodAdds, tSimMin) {
    var density = 0;
    var TAU_PYRO = 15; // minutes
    for (var i = 0; i < woodAdds.length; i++) {
      var x = (tSimMin - woodAdds[i].tAddMin) / TAU_PYRO;
      if (x < 0 || x > 2) continue;
      density += Math.exp(-Math.pow(x - 0.5, 2) / 0.5) * (woodAdds[i].mass || 1);
    }
    return Math.min(density, 1);
  }

  /**
   * Proxy for thin-blue vs white smoke. High when Q_fire per unit fuel is strong.
   */
  function combustionEfficiency(state) {
    var active = 0;
    for (var i = 0; i < state.coals.length; i++) {
      var x = (state.tSimMin - state.coals[i].tIgniteMin) / state.coals[i].tauBurnMin;
      if (x > 0 && x < 1.3) active += 1;
    }
    if (active === 0) return 0.5;
    // Efficiency peaks with a moderately open damper and a healthy coal set.
    var open = state.damperPct / 100;
    return 0.4 + 0.5 * Math.min(open * active / 4, 1);
  }

  // --- Event API ---
  function ignite(state, n) {
    FM.refuel(state.coals, n, state.tSimMin, C.COAL_P_PEAK, C.COAL_TAU_BURN_MIN);
    state.eventLog.push({ t: state.tSimMin, kind: 'ignite', n: n });
  }
  function refuel(state, n) {
    FM.refuel(state.coals, n, state.tSimMin, C.COAL_P_PEAK, C.COAL_TAU_BURN_MIN);
    state.eventLog.push({ t: state.tSimMin, kind: 'refuel', n: n });
  }
  function addWood(state, massKg, species) {
    state.woodAdds.push({ tAddMin: state.tSimMin, mass: massKg, species: species || 'oak' });
    state.eventLog.push({ t: state.tSimMin, kind: 'wood', mass: massKg, species: species });
  }
  function damper(state, pct) {
    state.damperPct = Math.max(0, Math.min(100, pct));
    state.eventLog.push({ t: state.tSimMin, kind: 'damper', pct: pct });
  }
  function wrap(state, type) {
    state.wrapState = type;
    state.phase = 'push';
    state.eventLog.push({ t: state.tSimMin, kind: 'wrap', type: type });
  }
  function openLid(state, seconds) {
    state.lidOpenSec = (state.lidOpenSec || 0) + seconds;
    state.tPitC -= C.T_PIT_LID_DROP_C * Math.min(seconds / 60, 1);
    state.eventLog.push({ t: state.tSimMin, kind: 'lid', seconds: seconds });
  }
  function pull(state) {
    state.phase = 'rest';
    state.tPullC = state.T[state.T.length - 1];
    state.wAtPull = state.w;
    state.tPullMin = state.tSimMin;
    state.eventLog.push({ t: state.tSimMin, kind: 'pull' });
  }
  function slice(state, restMethod) {
    var tRest = (state.tPullMin != null) ? Math.max(0, state.tSimMin - state.tPullMin) : (state.tRestMin || 0);
    state.tRestMin = tRest;
    state.phase = 'slice';
    state.wRetained = RM.wRetained(state.wAtPull != null ? state.wAtPull : state.w, tRest);
    state.tCoreAtSlice = RM.restTemperatureC(state.tPullC || state.T[state.T.length - 1],
                                             state.tAmbC, tRest, restMethod || 'cooler');
    state.eventLog.push({ t: state.tSimMin, kind: 'slice', restMin: tRest });
  }

  return {
    create: create,
    step: step,
    ignite: ignite,
    refuel: refuel,
    addWood: addWood,
    damper: damper,
    wrap: wrap,
    openLid: openLid,
    pull: pull,
    slice: slice
  };
})();
