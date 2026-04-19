/**
 * Smoker Dynamics — Decision-card engine.
 * Transforms simulator state into ranked, user-readable cards
 * following the "next best action" pattern from OPERATIONS.md.
 *
 * Each card has: { priority, tier, verdict, why, impact?, actions? }
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.decisions = (function () {
  'use strict';

  var C   = window.SmokerSim.constants;
  var Con = window.SmokerSim.constraints;

  // Rolling slope buffer — caller maintains { samples: [{t, coreF}] }
  function slopeFperMin(history, windowMin) {
    windowMin = windowMin || 10;
    var s = history.samples;
    if (s.length < 2) return 0;
    var last = s[s.length - 1];
    var cutoff = last.t - windowMin;
    var first = s[s.length - 1];
    for (var i = s.length - 1; i >= 0; i--) {
      if (s[i].t <= cutoff) { first = s[i]; break; }
      first = s[i];
    }
    var dt = last.t - first.t;
    if (dt <= 0.5) return 0;
    return (last.coreF - first.coreF) / dt;
  }

  /**
   * Build cards for current state. Returns up to 3 highest-priority cards.
   */
  function build(state, history) {
    var out = [];
    var n = state.T.length - 1;
    var coreF = C.cToF(state.T[n]);
    var surfF = C.cToF(state.T[0]);
    var pitF  = C.cToF(state.tPitC);
    var slope = slopeFperMin(history, 10);

    // ─── Red-line alerts (highest priority) ──────────────────────────
    var alerts = Con.evaluate({
      phase: state.phase,
      tPitC: state.tPitC,
      dTcoreDtCPerMin: slope / 1.8,
      dangerZoneMin: state.dangerZoneMin || 0,
      justPulled: false, C: state.C,
      S_bad: state.smoke ? state.smoke.bad : 0,
      tSurfC: state.T[0], justWrapped: false,
      wSurface: state.wSurface || 1,
      qFireW: 100, maxCoalProgress: 0.3, qFirePeakNominal: 400,
      tCoreF: coreF, spritzPerHour: 0, lidOpenSec: state.lidOpenSec || 0
    });
    alerts.forEach(function (a) {
      if (a.tier === 'red') {
        out.push({
          priority: 100, tier: 'red',
          verdict: a.label, why: a.fix || '', actions: []
        });
      } else if (a.tier === 'yellow') {
        out.push({
          priority: 60, tier: 'yellow',
          verdict: a.label, why: 'Recoverable — adjust now to avoid cost.', actions: []
        });
      }
    });

    // ─── Pregame: no coals lit ───────────────────────────────────────
    if (state.coals.length === 0 && state.phase !== 'rest' && state.phase !== 'slice') {
      out.push({
        priority: 95, tier: 'action',
        verdict: 'Light your fire',
        why: 'Get the pit to 225–250°F before the meat goes on. Wait for thin-blue smoke before adding anything.',
        actions: [
          { label: 'Ignite 12 coals', event: 'ignite-12', hint: 'Full chimney for offset' },
          { label: 'Ignite 8 coals',  event: 'ignite-8',  hint: 'Lighter start for kamado/WSM' }
        ]
      });
    }

    // ─── Warmup: coals lit, pit not at target ────────────────────────
    if (state.coals.length > 0 && pitF < 210 && coreF < 50 && state.phase !== 'rest') {
      out.push({
        priority: 70, tier: 'info',
        verdict: 'Warming up',
        why: 'Pit climbing toward 225–250°F. This takes 20–40 minutes with fresh coals.',
        actions: []
      });
    }

    // ─── Early smoke window (surface still cold, smoke ring forming) ─
    if (coreF > 50 && surfF < 140 && !state.smoke.ringFrozen && state.phase === 'bark_build') {
      if (state.woodAdds.length === 0) {
        out.push({
          priority: 80, tier: 'action',
          verdict: 'Add wood for smoke',
          why: 'Surface is still cold — this is the 90-minute window for smoke ring and flavor deposition.',
          actions: [{ label: 'Add hickory chunk', event: 'wood', hint: '1 chunk, thin-blue smoke' }]
        });
      }
    }

    // ─── Stall approaching ───────────────────────────────────────────
    if (coreF >= 135 && coreF < 155 && slope > 0 && slope < 0.8 && state.wrapState === 'none') {
      out.push({
        priority: 72, tier: 'headsup',
        verdict: 'Stall approaching',
        why: 'Temperature rise is slowing — evaporative cooling will soon balance the heat. Plateau can last 1–3h.',
        actions: []
      });
    }

    // ─── In stall: recommend wrap ────────────────────────────────────
    var inStall = coreF >= 145 && coreF <= 175 && slope < 0.4;
    if (inStall && state.wrapState === 'none') {
      var stalledFor = stallDurationMin(history);
      if (stalledFor > 20) {
        out.push({
          priority: 88, tier: 'recommend',
          verdict: 'Wrap now to beat the stall',
          why: 'Stopping evaporation lets the meat resume climbing. Butcher paper keeps bark; foil is faster but softer.',
          impact: { time: '−1h 20min', bark: '−5%', juicy: '+8%' },
          actions: [
            { label: 'Butcher paper', event: 'wrap-butcher_paper', hint: 'Balanced' },
            { label: 'Aluminum foil', event: 'wrap-aluminum_foil', hint: 'Faster' },
            { label: 'Wait',          event: 'dismiss',           hint: 'Keep chasing bark' }
          ]
        });
      } else {
        out.push({
          priority: 60, tier: 'info',
          verdict: 'In the stall',
          why: 'Internal temp has flattened — this is normal and expected. Keep pit at 225–250°F; do not crank heat.',
          actions: []
        });
      }
    }

    // ─── Post-wrap push ──────────────────────────────────────────────
    if (state.wrapState !== 'none' && coreF > 165 && state.C < 0.70) {
      out.push({
        priority: 55, tier: 'info',
        verdict: 'Back on track',
        why: 'Wrapped and climbing again. Start probe-checking when core hits 195°F.',
        actions: []
      });
    }

    // ─── Nearly done ─────────────────────────────────────────────────
    if (state.C >= 0.70 && state.C < C.COLLAGEN_DONE && state.phase !== 'rest') {
      out.push({
        priority: 80, tier: 'headsup',
        verdict: 'Nearly done — start probing',
        why: 'Collagen is close to fully rendered. Probe should slide in "like butter". Pull on feel, not temperature.',
        actions: [
          { label: 'Pull now', event: 'pull', hint: 'Only if probe-soft' }
        ]
      });
    }

    // ─── Done ────────────────────────────────────────────────────────
    if (state.C >= C.COLLAGEN_DONE && state.phase !== 'rest' && state.phase !== 'slice') {
      out.push({
        priority: 97, tier: 'action',
        verdict: 'Pull now',
        why: 'Collagen is fully rendered. More time on heat will only dry it out.',
        impact: { time: '0', juicy: 'protect' },
        actions: [{ label: 'Pull', event: 'pull' }]
      });
    }

    // ─── Resting ─────────────────────────────────────────────────────
    if (state.phase === 'rest') {
      var tRest = restElapsedMin(state);
      var target = 45;
      if (tRest < target) {
        var left = Math.ceil(target - tRest);
        out.push({
          priority: 70, tier: 'info',
          verdict: 'Resting — ' + left + ' min to go',
          why: 'Juices are redistributing. Slicing now costs ~' + Math.round(100 * (1 - tRest / target)) + '% of potential moisture retention.',
          actions: [{ label: 'Slice anyway', event: 'slice', hint: 'Not recommended' }]
        });
      } else {
        out.push({
          priority: 92, tier: 'action',
          verdict: 'Ready to slice',
          why: 'Juice redistribution is complete. Cut against the grain in pencil-thick slices.',
          actions: [{ label: 'Slice', event: 'slice' }]
        });
      }
    }

    // ─── Refuel reminder (yellow) ────────────────────────────────────
    var activeCoals = state.coals.filter(function (c) {
      var x = (state.tSimMin - c.tIgniteMin) / c.tauBurnMin;
      return x > 0 && x < 1.0;
    });
    var peaked = state.coals.filter(function (c) {
      var x = (state.tSimMin - c.tIgniteMin) / c.tauBurnMin;
      return x > 0.75;
    });
    if (activeCoals.length > 0 && peaked.length / activeCoals.length > 0.5 && state.phase !== 'rest') {
      out.push({
        priority: 58, tier: 'headsup',
        verdict: 'Refuel soon',
        why: 'Most of your coals are past peak. Pit temp will sag in the next 15–30 minutes.',
        actions: [
          { label: '+3 coals', event: 'refuel-3' },
          { label: '+6 coals', event: 'refuel-6' }
        ]
      });
    }

    // Sort by priority (desc), dedupe by verdict, cap at 3
    out.sort(function (a, b) { return b.priority - a.priority; });
    var seen = {};
    var top = [];
    for (var i = 0; i < out.length && top.length < 3; i++) {
      if (seen[out[i].verdict]) continue;
      seen[out[i].verdict] = true;
      top.push(out[i]);
    }
    return top;
  }

  // ---------- helpers ----------
  function stallDurationMin(history) {
    var s = history.samples;
    if (s.length < 2) return 0;
    for (var i = s.length - 1; i > 0; i--) {
      var slopeHere = (s[i].coreF - s[i - 1].coreF) / Math.max(0.1, s[i].t - s[i - 1].t);
      if (slopeHere > 0.5 || s[i].coreF < 140 || s[i].coreF > 180) {
        return s[s.length - 1].t - s[i].t;
      }
    }
    return s[s.length - 1].t - s[0].t;
  }

  function restElapsedMin(state) {
    return (state.tSimMin || 0) - (state.tPullMin || 0);
  }

  return {
    build: build,
    slopeFperMin: slopeFperMin,
    stallDurationMin: stallDurationMin,
    restElapsedMin: restElapsedMin
  };
})();
