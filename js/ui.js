/**
 * Kimchi Fermentation Simulator — UI Controls
 * Slider handling, multi-stage editor, phase indicator, stats
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.ui = (function () {
  'use strict';

  var debounceTimer = null;
  var onChangeCallback = null;
  var STORAGE_KEY = 'kimchi-sim-state';
  var PRESETS = {
    classic: [
      { temperature: 22, duration: 10 },
      { temperature: 4, duration: 216 }
    ],
    weekend: [
      { temperature: 25, duration: 8 },
      { temperature: 8, duration: 72 }
    ],
    slow: [
      { temperature: 6, duration: 336 }
    ]
  };

  // Load saved state or use defaults
  var savedState = loadState();
  var stages = savedState.stages || [
    { temperature: 25, duration: 6 },
    { temperature: 4, duration: 504 }
  ];
  var useMultiStage = true;

  function loadState() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
  }

  function saveState() {
    try {
      var state = {
        salt: parseFloat(document.getElementById('slider-salt').value),
        starter: parseFloat(document.getElementById('slider-starter').value),
        stages: stages,
        calcWeight: parseFloat(document.getElementById('calc-weight')?.value || 2.5)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function restoreSavedInputs() {
    var s = loadState();
    if (s.salt != null) {
      document.getElementById('slider-salt').value = s.salt;
      updateSliderDisplay('salt');
    }
    if (s.starter != null) {
      document.getElementById('slider-starter').value = s.starter;
      updateSliderDisplay('starter');
    }
    if (s.calcWeight != null) {
      var w = document.getElementById('calc-weight');
      if (w) w.value = s.calcWeight;
    }
  }

  function readNumberValue(el, fallback) {
    if (!el) return fallback;
    var v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  }

  function getParams() {
    return {
      temperature: readNumberValue(document.getElementById('slider-temp'), 10),
      salt: readNumberValue(document.getElementById('slider-salt'), 2.5),
      starter: readNumberValue(document.getElementById('slider-starter'), 0)
    };
  }

  function getStages() {
    if (!useMultiStage) return null;
    // Read from DOM
    var rows = document.querySelectorAll('.stage-row');
    var result = [];
    rows.forEach(function(row) {
      var tempInput = row.querySelector('.stage-temp');
      var durInput = row.querySelector('.stage-dur');
      if (tempInput && durInput) {
        result.push({
          temperature: readNumberValue(tempInput, 10),
          duration: readNumberValue(durInput, 24)
        });
      }
    });
    return result.length > 0 ? result : null;
  }

  function formatDuration(hours) {
    if (hours < 24) return hours.toFixed(0) + 'h';
    var days = hours / 24;
    return days.toFixed(1) + 'd';
  }

  function renderStages() {
    var container = document.getElementById('stages-list');
    if (!container) return;
    var t = window.KimchiSim.i18n.t;

    var freezePoint = window.KimchiSim.models ? window.KimchiSim.models.freezingPoint(2.5) : -1.5;
    var html = '';
    for (var i = 0; i < stages.length; i++) {
      var frozen = stages[i].temperature < freezePoint;
      html += '<div class="stage-row' + (frozen ? ' stage-frozen' : '') + '">' +
        '<div class="stage-num">' + (i + 1) + '</div>' +
        '<input type="number" class="stage-input stage-temp" value="' + stages[i].temperature + '" min="-5" max="40" step="0.5">' +
        '<span class="stage-unit">°C</span>' +
        (frozen ? '<span class="stage-freeze-warn" title="' + t('warn.frozen') + '">\u2744\uFE0F</span>' : '') +
        '<input type="number" class="stage-input stage-dur" value="' + stages[i].duration + '" min="1" max="2400" step="1">' +
        '<span class="stage-unit" data-i18n="unit.h">' + t('unit.h') + '</span>' +
        (stages.length > 1 ?
          '<button class="btn-remove-stage" data-idx="' + i + '" title="' + t('controls.removeStage') + '">&times;</button>' :
          '<div style="width:28px"></div>') +
        '</div>';
    }
    container.innerHTML = html;

    // Wire events
    container.querySelectorAll('.stage-input').forEach(function(input) {
      input.addEventListener('input', function() {
        readStagesFromDOM();
        debouncedChange();
      });
    });
    container.querySelectorAll('.btn-remove-stage').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-idx'));
        stages.splice(idx, 1);
        renderStages();
        debouncedChange();
      });
    });

    syncPresetButtons();
  }

  function readStagesFromDOM() {
    stages = [];
    var rows = document.querySelectorAll('.stage-row');
    rows.forEach(function(row) {
      var tempInput = row.querySelector('.stage-temp');
      var durInput = row.querySelector('.stage-dur');
      if (tempInput && durInput) {
        stages.push({
          temperature: readNumberValue(tempInput, 10),
          duration: readNumberValue(durInput, 24)
        });
      }
    });
  }

  function cloneStages(list) {
    return list.map(function(stage) {
      return { temperature: stage.temperature, duration: stage.duration };
    });
  }

  function sameStages(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (Math.abs(a[i].temperature - b[i].temperature) > 0.01) return false;
      if (Math.abs(a[i].duration - b[i].duration) > 0.01) return false;
    }
    return true;
  }

  function syncPresetButtons() {
    var buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(function(btn) {
      var preset = btn.getAttribute('data-preset');
      var match = PRESETS[preset] && sameStages(stages, PRESETS[preset]);
      btn.classList.toggle('active', !!match);
    });
  }

  function initPresets() {
    var buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = btn.getAttribute('data-preset');
        if (!PRESETS[preset]) return;
        stages = cloneStages(PRESETS[preset]);
        useMultiStage = true;
        renderStages();
        debouncedChange();
      });
    });
  }

  function initSliders(onChange) {
    onChangeCallback = onChange;

    ['temp', 'salt', 'starter'].forEach(function(id) {
      var slider = document.getElementById('slider-' + id);
      if (!slider) return;
      slider.addEventListener('input', function() {
        updateSliderDisplay(id);
        // When single-stage, sync temp slider to stage 1
        if (id === 'temp' && !useMultiStage) {
          stages = [{ temperature: parseFloat(slider.value), duration: 720 }];
        }
        debouncedChange();
      });
    });

    // Multi-stage toggle
    var toggleBtn = document.getElementById('toggle-multistage');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        useMultiStage = !useMultiStage;
        var stagesSection = document.getElementById('stages-container');
        var singleSlider = document.getElementById('temp-single-wrap');
        if (stagesSection) stagesSection.style.display = useMultiStage ? 'block' : 'none';
        if (singleSlider) singleSlider.style.display = useMultiStage ? 'none' : 'block';
        toggleBtn.textContent = useMultiStage ?
          window.KimchiSim.i18n.t('controls.singleStage') || 'Single Stage' :
          window.KimchiSim.i18n.t('controls.multiStage') || 'Multi-Stage';
        debouncedChange();
      });
    }

    // Add stage button
    var addBtn = document.getElementById('btn-add-stage');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        stages.push({ temperature: 4, duration: 168 });
        renderStages();
        debouncedChange();
      });
    }

    initPresets();
    renderStages();
  }

  function updateSliderDisplay(id) {
    var slider = document.getElementById('slider-' + id);
    var display = document.getElementById('val-' + id);
    if (!slider || !display) return;
    var val = slider.value;
    if (id === 'temp') display.textContent = val + '°C';
    else display.textContent = val + '%';
  }

  function debouncedChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      if (onChangeCallback) {
        var params = getParams();
        var stg = useMultiStage ? stages : null;
        onChangeCallback(params, stg);
      }
      saveState();
    }, 30);
  }

  function updatePhaseIndicator(data) {
    var marker = document.getElementById('phase-marker');
    if (!marker) return;
    var pct = Math.min(100, Math.max(0, (data.optimalTime / data.tMax) * 100));
    marker.style.left = 'calc(' + pct + '% - 2px)';

    ['phase-seg-1', 'phase-seg-2', 'phase-seg-3'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.opacity = '0.55';
    });

    var optPH = data.atOptimal.pH;
    if (optPH >= 5.0) document.getElementById('phase-seg-1').style.opacity = '1';
    else if (optPH >= 4.0) document.getElementById('phase-seg-2').style.opacity = '1';
    else document.getElementById('phase-seg-3').style.opacity = '1';
  }

  function trendArrow(rate, threshold) {
    threshold = threshold || 0.5;
    if (rate > threshold) return ' \u2197'; // ↗
    if (rate < -threshold) return ' \u2198'; // ↘
    return ' \u2192'; // →
  }

  function updateStats(data) {
    var t = window.KimchiSim.i18n.t;
    var tr = data.atOptimal.trends || {};
    var dominantKey = data.atOptimal.dominantKey || 'mesenteroides';
    var dominantLabel = t('microbe.' + dominantKey + '.name');
    var nitriteMeta = data.nitriteMeta || {};
    var nitriteThreshold = nitriteMeta.safeThreshold || 3;
    var cautionThreshold = nitriteMeta.cautionThreshold || 8;

    setVal('stat-optimal-time', formatTimeDisplay(data.optimalTime));
    setVal('stat-ph', data.atOptimal.pH.toFixed(2) + trendArrow(tr.pH, 0.05));
    setVal('stat-acid', data.atOptimal.acid.toFixed(2) + '%' + trendArrow(tr.acid, 0.02));
    setVal('stat-bacteria', dominantLabel);
    setVal('stat-flavor', Math.round(data.atOptimal.flavor) + trendArrow(tr.flavor, 0.5));

    // Realtime info in sidebar
    setVal('info-opt-time', formatTimeDisplay(data.optimalTime));
    setVal('info-ph', data.atOptimal.pH.toFixed(2) + trendArrow(tr.pH, 0.05));
    setVal('info-acid', data.atOptimal.acid.toFixed(2) + '%' + trendArrow(tr.acid, 0.02));
    setVal('info-flavor', Math.round(data.atOptimal.flavor) + '/100' + trendArrow(tr.flavor, 0.5));

    // Nitrite warning
    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteBar = document.getElementById('nitrite-bar');
    if (nitriteBar) {
      setVal('nitrite-level', nitrite.toFixed(1) + ' mg/kg' + trendArrow(tr.nitrite, 0.3));
      nitriteBar.classList.remove('safe', 'warning', 'danger');
      var statusEl = document.getElementById('nitrite-status');
      if (nitrite < nitriteThreshold) {
        nitriteBar.classList.add('safe');
        if (statusEl) statusEl.textContent = t('nitrite.safe');
      } else if (nitrite < cautionThreshold) {
        nitriteBar.classList.add('warning');
        if (statusEl) statusEl.textContent = t('nitrite.caution');
      } else {
        nitriteBar.classList.add('danger');
        if (statusEl) statusEl.textContent = t('nitrite.danger');
      }
    }

    updateNitriteModel(data);
  }

  function formatCompactTime(days) {
    if (days < 1) return Math.round(days * 24) + 'h';
    return days < 10 ? days.toFixed(1) + 'd' : Math.round(days) + 'd';
  }

  function formatNitriteWindow(meta) {
    var t = window.KimchiSim.i18n.t;
    if (!meta || !meta.riskWindow || meta.riskWindow.start == null || meta.riskWindow.end == null) {
      return t('nitrite.window.none');
    }
    return formatCompactTime(meta.riskWindow.start) + ' - ' + formatCompactTime(meta.riskWindow.end);
  }

  function updateNitriteModel(data) {
    var t = window.KimchiSim.i18n.t;
    var meta = data.nitriteMeta || {};
    var peak = meta.peak || {};
    var sodium = meta.sodium || {};
    var atOptimal = meta.atOptimal || {};

    if (meta.initialNitrate != null) {
      setVal('nitrite-nitrate', meta.initialNitrate.toFixed(1) + ' -> ' + (atOptimal.nitrate || 0).toFixed(1) + ' mg/kg');
    }
    if (sodium.mgKg != null && sodium.molar != null) {
      setVal('nitrite-sodium', (sodium.mgKg / 1000).toFixed(1) + ' g/kg · ' + Math.round(sodium.molar * 1000) + ' mmol/L');
    }
    if (peak.value != null && peak.time != null) {
      setVal('nitrite-peak', peak.value.toFixed(1) + ' mg/kg @ ' + formatCompactTime(peak.time));
    }
    setVal('nitrite-window', formatNitriteWindow(meta));
    if (atOptimal.formationRate != null && atOptimal.clearanceRate != null) {
      setVal(
        'nitrite-flux',
        t('nitrite.form') + ' ' + atOptimal.formationRate.toFixed(2) + ' mg/kg/d · ' +
        t('nitrite.clear') + ' ' + atOptimal.clearanceRate.toFixed(2) + ' mg/kg/d'
      );
    }
  }

  function updateDominanceStrip(data) {
    var p1 = Math.max(0, Math.min(data.phases.phase1End, data.tMax));
    var p2 = Math.max(p1, Math.min(data.phases.phase2End, data.tMax));
    var values = [p1, p2 - p1, data.tMax - p2];
    ['dominance-seg-1', 'dominance-seg-2', 'dominance-seg-3'].forEach(function(id, idx) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.flex = Math.max(values[idx], 0.15) + ' 1 0%';
    });
    setVal('dominance-time-1', '0 - ' + formatCompactTime(p1));
    setVal('dominance-time-2', formatCompactTime(p1) + ' - ' + formatCompactTime(p2));
    setVal('dominance-time-3', formatCompactTime(p2) + ' - ' + formatCompactTime(data.tMax));
  }

  function updateMicrobeCards(data) {
    var comp = data.atOptimal.composition || {};
    var keys = ['sakei', 'mesenteroides', 'plantarum'];
    keys.forEach(function(key) {
      var val = comp[key];
      var card = document.getElementById('microbe-card-' + key);
      if (card) card.classList.toggle('active', key === data.atOptimal.dominantKey);
      setVal('microbe-val-' + key, val == null ? '--%' : Math.round(val * 100) + '%');
    });
  }

  function updateEducation(data) {
    updateDominanceStrip(data);
    updateMicrobeCards(data);
  }

  function formatTimeDisplay(days) {
    if (days < 1) return (days * 24).toFixed(0) + 'h';
    if (days < 2) return (days * 24).toFixed(0) + 'h (' + days.toFixed(1) + 'd)';
    return days.toFixed(1) + 'd';
  }

  function setVal(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function initControlsToggle() {
    var toggle = document.getElementById('controls-toggle');
    var body = document.getElementById('controls-body');
    if (!toggle || !body) return;
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      body.classList.toggle('collapsed', expanded);
      var arrow = toggle.querySelector('.toggle-arrow');
      if (arrow) arrow.style.transform = expanded ? 'rotate(-90deg)' : '';
    });
  }

  return {
    getParams: getParams,
    getStages: getStages,
    initSliders: initSliders,
    updatePhaseIndicator: updatePhaseIndicator,
    updateStats: updateStats,
    updateEducation: updateEducation,
    initControlsToggle: initControlsToggle,
    renderStages: renderStages,
    restoreSavedInputs: restoreSavedInputs,
    saveState: saveState,
    stages: stages
  };
})();
