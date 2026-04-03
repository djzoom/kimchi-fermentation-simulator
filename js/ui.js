/**
 * Kimchi Fermentation Navigator — UI
 * Timeline-based input, dashboard gauge, judgment sentences
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.ui = (function () {
  'use strict';

  var debounceTimer = null;
  var onChangeCallback = null;
  var STORAGE_KEY = 'kimchi-sim-state';
  var useFahrenheit = false;

  // Timeline presets (room temp + fridge)
  var PRESETS = {
    classic: { roomTemp: 22, roomHours: 10, fridgeTemp: 4 },
    weekend: { roomTemp: 25, roomHours: 8, fridgeTemp: 8 },
    slow:    { roomTemp: 6, roomHours: 0, fridgeTemp: 6 }
  };

  var accelStages = []; // [{afterHours, temp, hours}]

  // ─── Persistence ───

  function loadState() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
  }

  function saveState() {
    try {
      var state = {
        pickleTime: (document.getElementById('input-pickle-time') || {}).value || '',
        roomTemp: readNum('input-room-temp', 28),
        roomHours: readNum('input-room-hours', 7),
        fridgeTemp: readNum('input-fridge-temp', 4),
        starter: readNum('slider-starter', 0),
        salt: readNum('slider-salt', 2.5),
        accelStages: accelStages,
        useFahrenheit: useFahrenheit,
        calcWeight: readNum('calc-weight', 2.5)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function restoreSavedInputs() {
    var s = loadState();
    if (s.pickleTime) setInput('input-pickle-time', s.pickleTime);
    if (s.roomTemp != null) setInput('input-room-temp', s.roomTemp);
    if (s.roomHours != null) setInput('input-room-hours', s.roomHours);
    if (s.fridgeTemp != null) setInput('input-fridge-temp', s.fridgeTemp);
    if (s.starter != null) {
      setInput('slider-starter', s.starter);
      updateSliderDisplay('starter');
    }
    if (s.accelStages && s.accelStages.length) {
      accelStages = s.accelStages;
      renderAccelStages();
    }
    if (s.useFahrenheit) {
      useFahrenheit = true;
      convertTempsToUnit();
      updateUnitLabels();
    }
    if (s.calcWeight != null) {
      var w = document.getElementById('calc-weight');
      if (w) w.value = s.calcWeight;
    }
  }

  function readNum(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  }

  function setInput(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  // ─── Temperature Unit Toggle ───

  function toggleUnit() {
    useFahrenheit = !useFahrenheit;
    convertTempsToUnit();
    updateUnitLabels();
    saveState();
  }

  function convertTempsToUnit() {
    ['input-room-temp', 'input-fridge-temp'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      var c = parseFloat(el.getAttribute('data-celsius'));
      if (isNaN(c)) c = parseFloat(el.value);
      if (useFahrenheit) {
        el.value = Math.round(c * 9 / 5 + 32);
      } else {
        el.value = c;
      }
    });
    // accel temps
    document.querySelectorAll('.accel-temp-input').forEach(function(el) {
      var c = parseFloat(el.getAttribute('data-celsius'));
      if (isNaN(c)) c = parseFloat(el.value);
      el.value = useFahrenheit ? Math.round(c * 9 / 5 + 32) : c;
    });
  }

  function updateUnitLabels() {
    var label = useFahrenheit ? '°F' : '°C';
    ['unit-room', 'unit-fridge'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.textContent = label;
    });
    document.querySelectorAll('.accel-unit').forEach(function(el) {
      el.textContent = label;
    });
    var btn = document.getElementById('btn-unit-toggle');
    if (btn) btn.textContent = useFahrenheit ? '°C' : '°F'; // show what to switch TO
  }

  function toCelsius(displayVal) {
    return useFahrenheit ? (displayVal - 32) * 5 / 9 : displayVal;
  }

  // ─── Timeline → Stages Conversion ───

  function getTimelineStages() {
    var roomTemp = toCelsius(readNum('input-room-temp', 28));
    var roomHours = readNum('input-room-hours', 7);
    var fridgeTemp = toCelsius(readNum('input-fridge-temp', 4));

    // Store celsius for unit conversion
    document.getElementById('input-room-temp').setAttribute('data-celsius', roomTemp);
    document.getElementById('input-fridge-temp').setAttribute('data-celsius', fridgeTemp);

    var stages = [];
    if (roomHours > 0) {
      stages.push({ temperature: roomTemp, duration: roomHours });
    }

    // Acceleration stages
    for (var i = 0; i < accelStages.length; i++) {
      var a = accelStages[i];
      stages.push({ temperature: fridgeTemp, duration: a.afterHours || 48 });
      stages.push({ temperature: toCelsius(a.temp || 25), duration: a.hours || 4 });
    }

    // Final fridge — generous duration (90 days)
    stages.push({ temperature: fridgeTemp, duration: 2160 });

    return stages;
  }

  function getStages() {
    return getTimelineStages();
  }

  function getParams() {
    return {
      temperature: toCelsius(readNum('input-room-temp', 28)),
      salt: readNum('slider-salt', 2.5),
      starter: readNum('slider-starter', 0)
    };
  }

  // ─── Acceleration Stages ───

  function addAccelStage() {
    accelStages.push({ afterHours: 48, temp: 25, hours: 4 });
    renderAccelStages();
    debouncedChange();
  }

  function removeAccelStage(idx) {
    accelStages.splice(idx, 1);
    renderAccelStages();
    debouncedChange();
  }

  function renderAccelStages() {
    var container = document.getElementById('accel-container');
    if (!container) return;
    var t = window.KimchiSim.i18n.t;
    var unit = useFahrenheit ? '°F' : '°C';
    var html = '';
    for (var i = 0; i < accelStages.length; i++) {
      var a = accelStages[i];
      var tempVal = useFahrenheit ? Math.round(a.temp * 9 / 5 + 32) : a.temp;
      html += '<div class="accel-row" data-idx="' + i + '">' +
        '<span class="tl-dot tl-dot-warm" style="width:14px;height:14px;font-size:0"></span>' +
        '<span class="tl-unit-lbl">' + t('ferment.afterHours') + '</span>' +
        '<input type="number" class="tl-input accel-after" value="' + a.afterHours + '" min="1" max="2000" step="1">' +
        '<span class="tl-unit-lbl">' + t('unit.h') + '</span>' +
        '<input type="number" class="tl-input accel-temp-input" value="' + tempVal + '" data-celsius="' + a.temp + '" min="15" max="40" step="0.5">' +
        '<span class="tl-unit-lbl accel-unit">' + unit + '</span>' +
        '<input type="number" class="tl-input accel-hours" value="' + a.hours + '" min="1" max="72" step="1">' +
        '<span class="tl-unit-lbl">' + t('unit.h') + '</span>' +
        '<button class="accel-remove" data-idx="' + i + '">&times;</button>' +
        '</div>';
    }
    container.innerHTML = html;

    container.querySelectorAll('.accel-row input').forEach(function(input) {
      input.addEventListener('input', function() {
        readAccelFromDOM();
        debouncedChange();
      });
    });
    container.querySelectorAll('.accel-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        removeAccelStage(parseInt(btn.getAttribute('data-idx')));
      });
    });
  }

  function readAccelFromDOM() {
    accelStages = [];
    document.querySelectorAll('.accel-row').forEach(function(row) {
      accelStages.push({
        afterHours: parseFloat(row.querySelector('.accel-after').value) || 48,
        temp: toCelsius(parseFloat(row.querySelector('.accel-temp-input').value) || 25),
        hours: parseFloat(row.querySelector('.accel-hours').value) || 4
      });
    });
  }

  // ─── Initialization ───

  function initSliders(onChange) {
    onChangeCallback = onChange;

    // Timeline inputs
    ['input-pickle-time', 'input-room-temp', 'input-room-hours', 'input-fridge-temp'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() { debouncedChange(); });
    });

    // Starter slider
    var starter = document.getElementById('slider-starter');
    if (starter) {
      starter.addEventListener('input', function() {
        updateSliderDisplay('starter');
        debouncedChange();
      });
    }

    // Unit toggle
    var unitBtn = document.getElementById('btn-unit-toggle');
    if (unitBtn) unitBtn.addEventListener('click', function() {
      toggleUnit();
      debouncedChange();
    });

    // Acceleration
    var accelBtn = document.getElementById('btn-add-accel');
    if (accelBtn) accelBtn.addEventListener('click', addAccelStage);

    // Presets
    initPresets();
  }

  function updateSliderDisplay(id) {
    var slider = document.getElementById('slider-' + id);
    var display = document.getElementById('val-' + id);
    if (!slider || !display) return;
    display.textContent = slider.value + '%';
  }

  function initPresets() {
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = btn.getAttribute('data-preset');
        var p = PRESETS[preset];
        if (!p) return;
        setInput('input-room-temp', useFahrenheit ? Math.round(p.roomTemp * 9 / 5 + 32) : p.roomTemp);
        setInput('input-room-hours', p.roomHours);
        setInput('input-fridge-temp', useFahrenheit ? Math.round(p.fridgeTemp * 9 / 5 + 32) : p.fridgeTemp);
        document.getElementById('input-room-temp').setAttribute('data-celsius', p.roomTemp);
        document.getElementById('input-fridge-temp').setAttribute('data-celsius', p.fridgeTemp);
        accelStages = [];
        renderAccelStages();
        syncPresetButtons();
        debouncedChange();
      });
    });
  }

  function syncPresetButtons() {
    var roomT = toCelsius(readNum('input-room-temp', 28));
    var roomH = readNum('input-room-hours', 7);
    var fridgeT = toCelsius(readNum('input-fridge-temp', 4));
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
      var p = PRESETS[btn.getAttribute('data-preset')];
      if (!p) return;
      var match = Math.abs(roomT - p.roomTemp) < 1 && Math.abs(roomH - p.roomHours) < 1 && Math.abs(fridgeT - p.fridgeTemp) < 1;
      btn.classList.toggle('active', match);
    });
  }

  function debouncedChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      syncPresetButtons();
      updateTimelineDisplay();
      if (onChangeCallback) {
        onChangeCallback(getParams(), getTimelineStages());
      }
      saveState();
    }, 30);
  }

  // ─── Timeline Display Updates ───

  function formatDateLocale(date) {
    if (!date || isNaN(date.getTime())) return '--';
    var lang = window.KimchiSim.i18n.getLang();
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    var h = String(date.getHours()).padStart(2, '0');
    var min = String(date.getMinutes()).padStart(2, '0');
    if (lang === 'zh') return y + '年' + m + '月' + d + '日 ' + h + ':' + min;
    if (lang === 'ko') return y + '년 ' + m + '월 ' + d + '일 ' + h + ':' + min;
    return m + '/' + d + '/' + y + ' ' + h + ':' + min;
  }

  function getPickleDate() {
    var val = (document.getElementById('input-pickle-time') || {}).value;
    if (!val) return null;
    return new Date(val);
  }

  function updateTimelineDisplay() {
    var pickleDate = getPickleDate();
    var t = window.KimchiSim.i18n.t;

    // Elapsed time
    var elapsedEl = document.getElementById('tl-elapsed');
    if (elapsedEl && pickleDate) {
      var elapsed = (Date.now() - pickleDate.getTime()) / 86400000;
      if (elapsed >= 0) {
        elapsedEl.textContent = t('ferment.elapsed') + ' ' + elapsed.toFixed(1) + ' ' + t('nav.days');
      } else {
        elapsedEl.textContent = '';
      }
    }

    // Room end → fridge start
    var roomHours = readNum('input-room-hours', 7);
    var noteEl = document.getElementById('tl-room-end');
    if (noteEl && pickleDate && roomHours > 0) {
      var roomEnd = new Date(pickleDate.getTime() + roomHours * 3600000);
      noteEl.textContent = '→ ' + t('ferment.moveToFridge') + ': ' + formatDateLocale(roomEnd);
    } else if (noteEl) {
      noteEl.textContent = '';
    }
  }

  function updateTimelineMilestones(data) {
    var pickleDate = getPickleDate();

    // Best flavor
    setVal('tl-best-val', formatTimeDisplay(data.optimalTime));
    if (pickleDate) {
      setVal('tl-best-date', formatDateLocale(new Date(pickleDate.getTime() + data.optimalTime * 86400000)));
    }

    // Over-sour (phase2End)
    var overSourDays = data.phases.phase2End;
    setVal('tl-sour-val', formatTimeDisplay(overSourDays));
    if (pickleDate) {
      setVal('tl-sour-date', formatDateLocale(new Date(pickleDate.getTime() + overSourDays * 86400000)));
    }

    // End (over-sour + 7)
    var endDays = overSourDays + 7;
    setVal('tl-end-val', formatTimeDisplay(endDays));
    if (pickleDate) {
      setVal('tl-end-date', formatDateLocale(new Date(pickleDate.getTime() + endDays * 86400000)));
    }
  }

  // ─── Dashboard Gauge ───

  function updateDashGauge(data) {
    var t = window.KimchiSim.i18n.t;
    var optDays = data.optimalTime;
    var flavor = data.atOptimal.flavor;
    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;

    setVal('dash-day', formatDayDisplay(optDays));
    setVal('dash-best', formatTimeDisplay(optDays));
    setVal('dash-flavor', Math.round(flavor) + '/100');
    setVal('dash-ph', data.atOptimal.pH.toFixed(2));

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

    var statusEl = document.getElementById('dash-status');
    if (statusEl) {
      statusEl.className = 'dash-status';
      if (flavor >= 80) { statusEl.textContent = t('judge.excellent'); statusEl.classList.add('status-peak'); }
      else if (flavor >= 60) { statusEl.textContent = t('judge.good'); statusEl.classList.add('status-improving'); }
      else if (data.atOptimal.pH > 5.0) { statusEl.textContent = t('judge.developing'); statusEl.classList.add('status-improving'); }
      else if (data.atOptimal.pH < 3.9) { statusEl.textContent = t('judge.overSour'); statusEl.classList.add('status-over'); }
      else { statusEl.textContent = t('judge.improving'); statusEl.classList.add('status-improving'); }
    }

    var arc = document.getElementById('dash-arc');
    if (arc) {
      var circumference = 326.73;
      var progress = Math.min(1, Math.max(0, flavor / 100));
      arc.style.strokeDashoffset = circumference * (1 - progress);
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
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;

    var flavorLine = document.querySelector('#status-flavor .status-text');
    var flavorDot = document.querySelector('#status-flavor .status-dot');
    if (flavorLine) {
      if (flavor >= 80) { flavorLine.textContent = t('judge.flavor.excellent'); setDotClass(flavorDot, 'dot-green'); }
      else if (flavor >= 60) { flavorLine.textContent = t('judge.flavor.good'); setDotClass(flavorDot, 'dot-green'); }
      else if (tr.flavor > 0.5) { flavorLine.textContent = t('judge.flavor.rising'); setDotClass(flavorDot, 'dot-blue'); }
      else { flavorLine.textContent = t('judge.flavor.developing'); setDotClass(flavorDot, 'dot-blue'); }
    }

    var acidLine = document.querySelector('#status-acidity .status-text');
    var acidDot = document.querySelector('#status-acidity .status-dot');
    if (acidLine) {
      if (pH >= 5.0) { acidLine.textContent = t('judge.acid.mild'); setDotClass(acidDot, 'dot-blue'); }
      else if (pH >= 4.2) { acidLine.textContent = t('judge.acid.balanced'); setDotClass(acidDot, 'dot-green'); }
      else if (pH >= 3.9) { acidLine.textContent = t('judge.acid.sour'); setDotClass(acidDot, 'dot-amber'); }
      else { acidLine.textContent = t('judge.acid.verySour'); setDotClass(acidDot, 'dot-red'); }
    }

    var safetyLine = document.querySelector('#status-safety .status-text');
    var safetyDot = document.querySelector('#status-safety .status-dot');
    if (safetyLine) {
      if (nitrite < nitriteThreshold) { safetyLine.textContent = t('judge.safety.clear'); setDotClass(safetyDot, 'dot-green'); }
      else if (nitrite < 8) { safetyLine.textContent = t('judge.safety.caution'); setDotClass(safetyDot, 'dot-amber'); }
      else { safetyLine.textContent = t('judge.safety.risk'); setDotClass(safetyDot, 'dot-red'); }
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

    setVal('explain-microbe', t('microbe.' + dominantKey + '.name') + ' ' + t('explain.dominant'));
    setVal('explain-microbe-effect', t('microbe.' + dominantKey + '.role'));

    if (pH >= 5.0) { setVal('explain-acid-cause', t('explain.acid.high')); setVal('explain-acid-effect', t('explain.acid.high.effect')); }
    else if (pH >= 4.2) { setVal('explain-acid-cause', t('explain.acid.balanced')); setVal('explain-acid-effect', t('explain.acid.balanced.effect')); }
    else { setVal('explain-acid-cause', t('explain.acid.low')); setVal('explain-acid-effect', t('explain.acid.low.effect')); }

    if (nitrite < nitriteThreshold) { setVal('explain-safety-cause', t('explain.safety.clear')); setVal('explain-safety-effect', t('explain.safety.clear.effect')); }
    else { setVal('explain-safety-cause', t('explain.safety.risk')); setVal('explain-safety-effect', t('explain.safety.risk.effect')); }
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

    var phScore = Math.round(phFactor * 50);
    var acidScore = Math.round(acidFactor * 30);
    var microbeScore = Math.round(meso * 20);

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

    var starter = readNum('slider-starter', 0);
    var tips = [];

    tips.push({ icon: '❄️', text: t('extend.chill'), primary: true });

    var allCold = true;
    var roomH = readNum('input-room-hours', 7);
    if (roomH > 0) allCold = false;

    if (allCold) {
      tips.push({ icon: '✓', text: t('extend.already.cold') });
    } else {
      tips.push({ icon: '🌡', text: t('extend.stage') });
    }

    if (starter > 5) {
      var suggested = Math.max(0, Math.round(starter * 0.5));
      tips.push({ icon: '🧪', text: t('extend.reduce.starter').replace('{n}', suggested) });
    } else {
      tips.push({ icon: '🧂', text: t('extend.salt') });
    }

    var html = '';
    for (var j = 0; j < tips.length; j++) {
      html += '<div class="extend-tip' + (tips[j].primary ? ' extend-tip-primary' : '') + '">' +
        '<span class="extend-tip-icon">' + tips[j].icon + '</span>' +
        '<span>' + tips[j].text + '</span></div>';
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
    if (optPH >= 5.0) setOpacity('phase-seg-1', '1');
    else if (optPH >= 4.0) setOpacity('phase-seg-2', '1');
    else setOpacity('phase-seg-3', '1');
  }

  function setOpacity(id, val) { var el = document.getElementById(id); if (el) el.style.opacity = val; }

  // ─── Expert Stats (backward compat) ───

  function trendArrow(rate, threshold) {
    threshold = threshold || 0.5;
    if (rate > threshold) return ' ↗';
    if (rate < -threshold) return ' ↘';
    return ' →';
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

    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteBar = document.getElementById('nitrite-bar');
    if (nitriteBar) {
      setVal('nitrite-level', nitrite.toFixed(1) + ' mg/kg' + trendArrow(tr.nitrite, 0.3));
      nitriteBar.classList.remove('safe', 'warning', 'danger');
      var statusEl = document.getElementById('nitrite-status');
      if (nitrite < nitriteThreshold) { nitriteBar.classList.add('safe'); if (statusEl) statusEl.textContent = t('nitrite.safe'); }
      else if (nitrite < cautionThreshold) { nitriteBar.classList.add('warning'); if (statusEl) statusEl.textContent = t('nitrite.caution'); }
      else { nitriteBar.classList.add('danger'); if (statusEl) statusEl.textContent = t('nitrite.danger'); }
    }

    updateNitriteModel(data);
    updateDashGauge(data);
    updateStatusSentences(data);
    updateExplainPanel(data);
    updateScoringBreakdown(data);
    updateExtendAdvice(data);
    updateTimelineMilestones(data);
  }

  function formatCompactTime(days) {
    if (days < 1) return Math.round(days * 24) + 'h';
    return days < 10 ? days.toFixed(1) + 'd' : Math.round(days) + 'd';
  }

  function formatNitriteWindow(meta) {
    var t = window.KimchiSim.i18n.t;
    if (!meta || !meta.riskWindow || meta.riskWindow.start == null || meta.riskWindow.end == null) return t('nitrite.window.none');
    return formatCompactTime(meta.riskWindow.start) + ' - ' + formatCompactTime(meta.riskWindow.end);
  }

  function updateNitriteModel(data) {
    var t = window.KimchiSim.i18n.t;
    var meta = data.nitriteMeta || {};
    var peak = meta.peak || {};
    var sodium = meta.sodium || {};
    var atOptimal = meta.atOptimal || {};

    if (meta.initialNitrate != null) setVal('nitrite-nitrate', meta.initialNitrate.toFixed(1) + ' → ' + (atOptimal.nitrate || 0).toFixed(1) + ' mg/kg');
    if (sodium.mgKg != null && sodium.molar != null) setVal('nitrite-sodium', (sodium.mgKg / 1000).toFixed(1) + ' g/kg · ' + Math.round(sodium.molar * 1000) + ' mmol/L');
    if (peak.value != null && peak.time != null) setVal('nitrite-peak', peak.value.toFixed(1) + ' mg/kg @ ' + formatCompactTime(peak.time));
    setVal('nitrite-window', formatNitriteWindow(meta));
    if (atOptimal.formationRate != null && atOptimal.clearanceRate != null) {
      setVal('nitrite-flux', t('nitrite.form') + ' ' + atOptimal.formationRate.toFixed(2) + ' · ' + t('nitrite.clear') + ' ' + atOptimal.clearanceRate.toFixed(2) + ' mg/kg/d');
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
    ['sakei', 'mesenteroides', 'plantarum'].forEach(function(key) {
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

  // ─── Compat stubs ───
  function renderStages() {}
  function initControlsToggle() {}

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
    updateTimelineMilestones: updateTimelineMilestones,
    stages: [] // compat
  };
})();
