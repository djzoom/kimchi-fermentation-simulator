/**
 * Smoker Dynamics — Cook presets.
 * Each preset maps a user intent ("Texas brisket", "Competition") to
 * both the physical inputs and the default ideal policy (auto-events).
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.presets = (function () {
  'use strict';

  var PRESETS = {
    texas: {
      id: 'texas',
      icon: '🥩',
      name: 'Texas brisket',
      tagline: 'Low & slow, paper wrap, salt-and-pepper rub',
      inputs: {
        protein: 'beef', grade: 'prime',
        weightLb: 12, thicknessIn: 4.0,
        equipment: 'offset', elevationFt: 0,
        tAmbF: 70, humidityPct: 55, windMph: 3,
        wrapType: 'none', tInitF: 40
      },
      policy: {
        damperPct: 70,
        igniteN: 12,
        wrapAt: 'auto',       // decision engine will advise
        wrapType: 'butcher_paper',
        woodChunks: [{ tMin: 5, species: 'post_oak' }, { tMin: 60, species: 'hickory' }],
        restMethod: 'cooler',
        targetRestMin: 60
      }
    },
    competition: {
      id: 'competition',
      icon: '🏆',
      name: 'Competition',
      tagline: 'Injection, foil boat, long hold — KCBS scoring',
      inputs: {
        protein: 'beef', grade: 'wagyu',
        weightLb: 14, thicknessIn: 4.2,
        equipment: 'pellet', elevationFt: 0,
        tAmbF: 70, humidityPct: 60, windMph: 2,
        wrapType: 'none', tInitF: 40
      },
      policy: {
        damperPct: 80,
        igniteN: 10,
        wrapAt: 'auto',
        wrapType: 'foil_boat',
        woodChunks: [{ tMin: 10, species: 'cherry' }, { tMin: 45, species: 'hickory' }],
        restMethod: 'cooler',
        targetRestMin: 240    // "long hold" is the competition trick
      }
    },
    backyard: {
      id: 'backyard',
      icon: '🏡',
      name: 'Backyard quick',
      tagline: 'Hot & fast, foil wrap, done by dinner',
      inputs: {
        protein: 'beef', grade: 'choice',
        weightLb: 8, thicknessIn: 3.0,
        equipment: 'wsm', elevationFt: 0,
        tAmbF: 70, humidityPct: 50, windMph: 5,
        wrapType: 'none', tInitF: 40
      },
      policy: {
        damperPct: 90,
        igniteN: 14,
        wrapAt: 'auto',
        wrapType: 'aluminum_foil',
        woodChunks: [{ tMin: 5, species: 'hickory' }],
        restMethod: 'open_air',
        targetRestMin: 45
      }
    },
    custom: {
      id: 'custom',
      icon: '⚙',
      name: 'Custom',
      tagline: 'Tune every knob',
      inputs: {
        protein: 'beef', grade: 'choice',
        weightLb: 10, thicknessIn: 3.5,
        equipment: 'offset', elevationFt: 0,
        tAmbF: 70, humidityPct: 60, windMph: 3,
        wrapType: 'none', tInitF: 40
      },
      policy: {
        damperPct: 70, igniteN: 10,
        wrapAt: 'manual', wrapType: 'butcher_paper',
        woodChunks: [], restMethod: 'cooler', targetRestMin: 45
      }
    }
  };

  function list() {
    return ['texas', 'competition', 'backyard', 'custom'].map(function (k) { return PRESETS[k]; });
  }

  function get(id) { return PRESETS[id] || PRESETS.custom; }

  return { list: list, get: get };
})();
