/**
 * Kimchi Fermentation Navigator — UI
 * Dashboard gauge, judgment sentences, stage editor, layer management
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
        calcWeight: parseFloat((document.getElementById('calc-weight') || {}).value || 2.5)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function restoreSavedInputs() {
    var s = loadState();
    if (s.salt != null) document.getElementById('slider-salt').value = s.salt;
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
        '<span class="stage-unit">\u00B0C</span>' +
        (frozen ? '<span class="stage-freeze-warn" title="' + t('warn.frozen') + '">\u2744\uFE0F</span>' : '') +
        '<input type="number" class="stage-input stage-dur" value="' + stages[i].duration + '" min="1" max="2400" step="1">' +
        '<span class="stage-unit" data-i18n="unit.h">' + t('unit.h') + '</span>' +
        (stages.length > 1 ?
          '<button class="btn-remove-stage" data-idx="' + i + '" title="' + t('controls.removeStage') + '">&times;</button>' :
          '<div style="width:28px"></div>') +
        '</div>';
    }
    container.innerHTML = html;

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
    document.querySelectorAll('.stage-row').forEach(function(row) {
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
    return list.map(function(s) {
      return { temperature: s.temperature, duration: s.duration };
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
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
      var preset = btn.getAttribute('data-preset');
      btn.classList.toggle('active', !!(PRESETS[preset] && sameStages(stages, PRESETS[preset])));
    });
  }

  function initPresets() {
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
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
        if (id === 'temp' && !useMultiStage) {
          stages = [{ temperature: parseFloat(slider.value), duration: 720 }];
        }
        debouncedChange();
      });
    });

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
    if (id === 'temp') display.textContent = val + '\u00B0C';
    else display.textContent = val + '%';
  }

  function debouncedChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      if (onChangeCallback) {
        onChangeCallback(getParams(), useMultiStage ? stages : null);
      }
      saveState();
    }, 30);
  }

  // ─── Dashboard Gauge ───

  function updateDashGauge(data) {
    var t = window.KimchiSim.i18n.t;
    var optDays = data.optimalTime;
    var flavor = data.atOptimal.flavor;
    var pH = data.atOptimal.pH;
    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;

    // Day display
    var dayEl = document.getElementById('dash-day');
    if (dayEl) dayEl.textContent = formatDayDisplay(optDays);

    // Best time
    setVal('dash-best', formatTimeDisplay(optDays));

    // Flavor score
    setVal('dash-flavor', Math.round(flavor) + '/100');

    // pH value with judgment
    setVal('dash-ph', pH.toFixed(2));

    // Safety
    var safetyEl = document.getElementById('dash-safety');
    if (safetyEl) {
      if (nitrite < nitriteThreshold) {
        safetyEl.textContent = t('judge.safe');
        safetyEl.style.color = 'var(--accent)';
      } else if (nitrite < 8) {
        safetyEl.textContent = t('judge.caution');
        safetyEl.style.color = 'var(--orange)';
      } else {
        safetyEl.textContent = t('judge.danger');
        safetyEl.style.color = 'var(--red)';
      }
    }

    // Status word
    var statusEl = document.getElementById('dash-status');
    if (statusEl) {
      statusEl.className = 'dash-status';
      if (flavor >= 80) {
        statusEl.textContent = t('judge.excellent');
        statusEl.classList.add('status-peak');
      } else if (flavor >= 60) {
        statusEl.textContent = t('judge.good');
        statusEl.classList.add('status-improving');
      } else if (pH > 5.0) {
        statusEl.textContent = t('judge.developing');
        statusEl.classList.add('status-improving');
      } else if (pH < 3.9) {
        statusEl.textContent = t('judge.overSour');
        statusEl.classList.add('status-over');
      } else {
        statusEl.textContent = t('judge.improving');
        statusEl.classList.add('status-improving');
      }
    }

    // Arc progress (flavor score / 100)
    var arc = document.getElementById('dash-arc');
    if (arc) {
      var circumference = 326.73; // 2π×52
      var progress = Math.min(1, Math.max(0, flavor / 100));
      arc.style.strokeDashoffset = circumference * (1 - progress);
      // Color by score
      if (flavor >= 70) arc.style.stroke = 'var(--accent)';
      else if (flavor >= 40) arc.style.stroke = 'var(--amber)';
      else arc.style.stroke = 'var(--blue)';
    }
  }

  function formatDayDisplay(days) {
    if (days < 1) return (days * 24).toFixed(0) + 'h';
    return days < 10 ? days.toFixed(1) : Math.round(days) + '';
  }

  // ─── Status Sentences (Judgment) ───

  function updateStatusSentences(data) {
    var t = window.KimchiSim.i18n.t;
    var tr = data.atOptimal.trends || {};
    var flavor = data.atOptimal.flavor;
    var pH = data.atOptimal.pH;
    var nitrite = data.atOptimal.nitrite || 0;
    var dominantKey = data.atOptimal.dominantKey || 'mesenteroides';
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;

    // Flavor sentence
    var flavorLine = document.querySelector('#status-flavor .status-text');
    var flavorDot = document.querySelector('#status-flavor .status-dot');
    if (flavorLine) {
      if (flavor >= 80) {
        flavorLine.textContent = t('judge.flavor.excellent');
        setDotClass(flavorDot, 'dot-green');
      } else if (flavor >= 60) {
        flavorLine.textContent = t('judge.flavor.good');
        setDotClass(flavorDot, 'dot-green');
      } else if (tr.flavor > 0.5) {
        flavorLine.textContent = t('judge.flavor.rising');
        setDotClass(flavorDot, 'dot-blue');
      } else {
        flavorLine.textContent = t('judge.flavor.developing');
        setDotClass(flavorDot, 'dot-blue');
      }
    }

    // Acidity sentence
    var acidLine = document.querySelector('#status-acidity .status-text');
    var acidDot = document.querySelector('#status-acidity .status-dot');
    if (acidLine) {
      if (pH >= 5.0) {
        acidLine.textContent = t('judge.acid.mild');
        setDotClass(acidDot, 'dot-blue');
      } else if (pH >= 4.2) {
        acidLine.textContent = t('judge.acid.balanced');
        setDotClass(acidDot, 'dot-green');
      } else if (pH >= 3.9) {
        acidLine.textContent = t('judge.acid.sour');
        setDotClass(acidDot, 'dot-amber');
      } else {
        acidLine.textContent = t('judge.acid.verySour');
        setDotClass(acidDot, 'dot-red');
      }
    }

    // Safety sentence
    var safetyLine = document.querySelector('#status-safety .status-text');
    var safetyDot = document.querySelector('#status-safety .status-dot');
    if (safetyLine) {
      if (nitrite < nitriteThreshold) {
        safetyLine.textContent = t('judge.safety.clear');
        setDotClass(safetyDot, 'dot-green');
      } else if (nitrite < 8) {
        safetyLine.textContent = t('judge.safety.caution');
        setDotClass(safetyDot, 'dot-amber');
      } else {
        safetyLine.textContent = t('judge.safety.risk');
        setDotClass(safetyDot, 'dot-red');
      }
    }
  }

  function setDotClass(el, cls) {
    if (!el) return;
    el.className = 'status-dot ' + cls;
  }

  // ─── Explain Panel (L2) ───

  function updateExplainPanel(data) {
    var t = window.KimchiSim.i18n.t;
    var dominantKey = data.atOptimal.dominantKey || 'mesenteroides';
    var pH = data.atOptimal.pH;
    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;

    // Microbe cause → effect
    setVal('explain-microbe', t('microbe.' + dominantKey + '.name') + ' ' + t('explain.dominant'));
    setVal('explain-microbe-effect', t('microbe.' + dominantKey + '.role'));

    // Acidity cause → effect
    if (pH >= 5.0) {
      setVal('explain-acid-cause', t('explain.acid.high'));
      setVal('explain-acid-effect', t('explain.acid.high.effect'));
    } else if (pH >= 4.2) {
      setVal('explain-acid-cause', t('explain.acid.balanced'));
      setVal('explain-acid-effect', t('explain.acid.balanced.effect'));
    } else {
      setVal('explain-acid-cause', t('explain.acid.low'));
      setVal('explain-acid-effect', t('explain.acid.low.effect'));
    }

    // Safety cause → effect
    if (nitrite < nitriteThreshold) {
      setVal('explain-safety-cause', t('explain.safety.clear'));
      setVal('explain-safety-effect', t('explain.safety.clear.effect'));
    } else {
      setVal('explain-safety-cause', t('explain.safety.risk'));
      setVal('explain-safety-effect', t('explain.safety.risk.effect'));
    }
  }

  // ─── Scoring Breakdown ───

  function gaussian(x, center, sigma) {
    var d = (x - center) / sigma;
    return Math.exp(-0.5 * d * d);
  }

  function updateScoringBreakdown(data) {
    var pH = data.atOptimal.pH;
    var acid = data.atOptimal.acid;
    var comp = data.atOptimal.composition || {};
    var meso = comp.mesenteroides || 0;

    var phFactor = gaussian(pH, 4.35, 0.3);
    var acidFactor = gaussian(acid, 0.6, 0.2);

    // Weighted contributions (out of 100)
    var phScore = Math.round(phFactor * 50);
    var acidScore = Math.round(acidFactor * 30);
    var microbeScore = Math.round(meso * 20);

    // Update bars
    var barPh = document.getElementById('score-bar-ph');
    var barAcid = document.getElementById('score-bar-acid');
    var barMicrobe = document.getElementById('score-bar-microbe');
    if (barPh) barPh.style.width = (phFactor * 100) + '%';
    if (barAcid) barAcid.style.width = (acidFactor * 100) + '%';
    if (barMicrobe) barMicrobe.style.width = (meso * 100) + '%';

    setVal('score-val-ph', phScore + 'pt');
    setVal('score-val-acid', acidScore + 'pt');
    setVal('score-val-microbe', microbeScore + 'pt');
  }

  // ─── Extend Flavor Advice ───

  function updateExtendAdvice(data) {
    var t = window.KimchiSim.i18n.t;
    var container = document.getElementById('extend-advice');
    if (!container) return;

    var params = getParams();
    var tips = [];

    // Always show the core tip
    tips.push({ icon: '❄️', text: t('extend.chill'), primary: true });

    // Context-sensitive tips
    var hasWarmStage = false;
    var hasColdStage = false;
    var allCold = true;

    for (var i = 0; i < stages.length; i++) {
      if (stages[i].temperature > 15) hasWarmStage = true;
      if (stages[i].temperature <= 6) hasColdStage = true;
      if (stages[i].temperature > 10) allCold = false;
    }

    if (allCold) {
      tips.push({ icon: '✓', text: t('extend.already.cold') });
    } else {
      tips.push({ icon: '🌡', text: t('extend.stage') });
    }

    if (params.starter > 5) {
      var suggested = Math.max(0, Math.round(params.starter * 0.5));
      tips.push({ icon: '🧪', text: t('extend.reduce.starter').replace('{n}', suggested) });
    } else if (params.starter > 0) {
      tips.push({ icon: '🧂', text: t('extend.salt') });
    } else {
      tips.push({ icon: '🧂', text: t('extend.salt') });
    }

    if (hasWarmStage && !hasColdStage) {
      tips.push({ icon: '📋', text: t('extend.add.cold.stage') });
    }

    var html = '';
    for (var j = 0; j < tips.length; j++) {
      html += '<div class="extend-tip' + (tips[j].primary ? ' extend-tip-primary' : '') + '">' +
        '<span class="extend-tip-icon">' + tips[j].icon + '</span>' +
        '<span>' + tips[j].text + '</span>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // ─── Phase Indicator ───

  function updatePhaseIndicator(data) {
    var marker = document.getElementById('phase-marker');
    if (!marker) return;
    var pct = Math.min(100, Math.max(0, (data.optimalTime / data.tMax) * 100));
    marker.style.left = 'calc(' + pct + '% - 2px)';

    ['phase-seg-1', 'phase-seg-2', 'phase-seg-3'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.opacity = '0.6';
    });

    var optPH = data.atOptimal.pH;
    if (optPH >= 5.0) { setOpacity('phase-seg-1', '1'); }
    else if (optPH >= 4.0) { setOpacity('phase-seg-2', '1'); }
    else { setOpacity('phase-seg-3', '1'); }
  }

  function setOpacity(id, val) {
    var el = document.getElementById(id);
    if (el) el.style.opacity = val;
  }

  // ─── Expert Stats (backward compat) ───

  function trendArrow(rate, threshold) {
    threshold = threshold || 0.5;
    if (rate > threshold) return ' \u2197';
    if (rate < -threshold) return ' \u2198';
    return ' \u2192';
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

    setVal('info-opt-time', formatTimeDisplay(data.optimalTime));
    setVal('info-ph', data.atOptimal.pH.toFixed(2) + trendArrow(tr.pH, 0.05));
    setVal('info-acid', data.atOptimal.acid.toFixed(2) + '%' + trendArrow(tr.acid, 0.02));
    setVal('info-flavor', Math.round(data.atOptimal.flavor) + '/100' + trendArrow(tr.flavor, 0.5));

    // Nitrite
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

    // Dashboard + sentences
    updateDashGauge(data);
    updateStatusSentences(data);
    updateExplainPanel(data);
    updateScoringBreakdown(data);
    updateExtendAdvice(data);
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
      setVal('nitrite-nitrate', meta.initialNitrate.toFixed(1) + ' \u2192 ' + (atOptimal.nitrate || 0).toFixed(1) + ' mg/kg');
    }
    if (sodium.mgKg != null && sodium.molar != null) {
      setVal('nitrite-sodium', (sodium.mgKg / 1000).toFixed(1) + ' g/kg \u00B7 ' + Math.round(sodium.molar * 1000) + ' mmol/L');
    }
    if (peak.value != null && peak.time != null) {
      setVal('nitrite-peak', peak.value.toFixed(1) + ' mg/kg @ ' + formatCompactTime(peak.time));
    }
    setVal('nitrite-window', formatNitriteWindow(meta));
    if (atOptimal.formationRate != null && atOptimal.clearanceRate != null) {
      setVal(
        'nitrite-flux',
        t('nitrite.form') + ' ' + atOptimal.formationRate.toFixed(2) + ' \u00B7 ' +
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

  function initControlsToggle() { /* no-op in new layout */ }

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
