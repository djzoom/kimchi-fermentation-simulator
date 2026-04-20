/**
 * Smoker BBQ — Red/Yellow/Green constraints. OPERATIONS.md §1–4.
 * Pure predicates over simulator state. Returns alert objects the UI can render.
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.constraints = (function () {
  'use strict';

  var C = window.SmokerSim.constants;

  // OPERATIONS.md §2 — Red-line predicates
  var RED = [
    {
      id: 'R1',
      label: 'Pit dropped below 225°F during stall',
      fix:  'Keep T_pit ≥ 107°C (225°F) through the stall phase.',
      test: function (s) {
        return s.phase === 'push' && s.tPitC < 107 && s.dTcoreDtCPerMin < 0.03;
      }
    },
    {
      id: 'R2',
      label: 'Danger zone exceeded 4 hours',
      fix:  'Reduce time with surface in 4–60°C band.',
      test: function (s) { return s.dangerZoneMin > 240; }
    },
    {
      id: 'R3',
      label: 'Pulled before collagen reached done threshold',
      fix:  'Probe-soft check before pull; C must reach 0.85.',
      test: function (s) { return s.justPulled && s.C < C.COLLAGEN_DONE; }
    },
    {
      id: 'R4',
      label: 'Creosote overload on cold surface',
      fix:  'Establish thin-blue-smoke fire before meat goes on.',
      test: function (s) {
        return s.S_bad > 0.35 && s.tSurfC < 60;
      }
    },
    {
      id: 'R5',
      label: 'Wrapped before bark set',
      fix:  'Wait for surface to dry (mahogany) before wrapping.',
      test: function (s) { return s.justWrapped && s.wSurface > 0.6; }
    },
    {
      id: 'R6',
      label: 'Fire effectively out',
      fix:  'Add fuel before Q_fire decays below 5 W.',
      test: function (s) { return s.qFireW < 5 && s.tPitC < 90; }
    }
  ];

  // OPERATIONS.md §3 — Yellow-line predicates
  var YELLOW = [
    { id: 'Y1', label: 'Refuel overdue',
      test: function (s) { return s.maxCoalProgress > 0.85 && s.qFireW < 0.5 * s.qFirePeakNominal; } },
    { id: 'Y2', label: 'Wrap outside ideal window',
      test: function (s) { return s.justWrapped && (s.tCoreF < 140 || s.tCoreF > 165); } },
    { id: 'Y3', label: 'Spritzing too frequently',
      test: function (s) { return s.spritzPerHour > 2; } },
    { id: 'Y5', label: 'Pull temperature outside 190–205°F',
      test: function (s) { return s.justPulled && (s.tCoreF < 190 || s.tCoreF > 205); } },
    { id: 'Y6', label: 'Lid open too long',
      test: function (s) { return s.lidOpenSec > 20; } }
  ];

  /**
   * Evaluate all constraints against state snapshot.
   * @returns {Array} of { tier, id, label, fix? }
   */
  function evaluate(state) {
    var alerts = [];
    for (var i = 0; i < RED.length; i++) {
      if (RED[i].test(state)) {
        alerts.push({ tier: 'red', id: RED[i].id, label: RED[i].label, fix: RED[i].fix });
      }
    }
    for (var j = 0; j < YELLOW.length; j++) {
      if (YELLOW[j].test(state)) {
        alerts.push({ tier: 'yellow', id: YELLOW[j].id, label: YELLOW[j].label });
      }
    }
    return alerts;
  }

  return {
    evaluate: evaluate,
    RED: RED,
    YELLOW: YELLOW
  };
})();
