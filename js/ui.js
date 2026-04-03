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

  function syncPickleHidden() {
    var y = readNum('input-pickle-y', 0);
    var m = readNum('input-pickle-m', 0);
    var d = readNum('input-pickle-d', 0);
    var hh = readNum('input-pickle-hh', 0);
    if (y && m && d) {
      var iso = y + '-' + String(m).padStart(2,'0') + '-' + String(d).padStart(2,'0') +
        'T' + String(hh).padStart(2,'0') + ':00';
      setInput('input-pickle-time', iso);
    } else {
      setInput('input-pickle-time', '');
    }
  }

  function setPickleToNow() {
    var now = new Date();
    setInput('input-pickle-y', now.getFullYear());
    setInput('input-pickle-m', now.getMonth() + 1);
    setInput('input-pickle-d', now.getDate());
    setInput('input-pickle-hh', now.getHours());
    syncPickleHidden();
  }

  function saveState() {
    try {
      syncPickleHidden();
      var roomTempC = getTempInputCelsius('input-room-temp', 22);
      var fridgeTempC = getTempInputCelsius('input-fridge-temp', 4);
      syncAccelTempInputsFromDisplay();
      var state = {
        pickleTime: (document.getElementById('input-pickle-time') || {}).value || '',
        roomTemp: roomTempC,
        roomHours: readNum('input-room-hours', 7),
        fridgeTemp: fridgeTempC,
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
    if (s.pickleTime) {
      setInput('input-pickle-time', s.pickleTime);
      var pd = new Date(s.pickleTime);
      if (!isNaN(pd.getTime())) {
        setInput('input-pickle-y', pd.getFullYear());
        setInput('input-pickle-m', pd.getMonth() + 1);
        setInput('input-pickle-d', pd.getDate());
        setInput('input-pickle-hh', pd.getHours());
      }
    } else {
      setPickleToNow();
    }
    if (s.roomTemp != null) {
      setTempInputCelsius('input-room-temp', s.roomTemp);
    }
    if (s.roomHours != null) setInput('input-room-hours', s.roomHours);
    if (s.fridgeTemp != null) {
      setTempInputCelsius('input-fridge-temp', s.fridgeTemp);
    }
    if (s.starter != null) {
      setInput('slider-starter', s.starter);
      updateSliderDisplay('starter');
    }
    if (s.accelStages && s.accelStages.length) {
      accelStages = s.accelStages;
      renderAccelStages();
    }
    getTempInputCelsius('input-room-temp', 22);
    getTempInputCelsius('input-fridge-temp', 4);
    if (s.useFahrenheit) {
      useFahrenheit = true;
      convertTempsToUnit();
      updateUnitLabels();
    }
    if (s.calcWeight != null) {
      var w = document.getElementById('calc-weight');
      if (w) w.value = s.calcWeight;
    }
    syncPresetButtons();
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

  function formatMetricTemp(celsius) {
    var rounded = Math.round(celsius * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 0.05) return String(Math.round(rounded));
    return String(rounded);
  }

  function formatTempForDisplay(celsius) {
    return useFahrenheit ? String(Math.round(celsius * 9 / 5 + 32)) : formatMetricTemp(celsius);
  }

  function setTempInputCelsius(id, celsius) {
    var el = document.getElementById(id);
    if (!el || isNaN(celsius)) return;
    el.setAttribute('data-celsius', celsius);
    el.value = formatTempForDisplay(celsius);
  }

  function getTempInputCelsius(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var c = parseFloat(el.getAttribute('data-celsius'));
    if (isNaN(c)) {
      var raw = parseFloat(el.value);
      c = isNaN(raw) ? fallback : (useFahrenheit ? Math.round((raw - 32) * 5 / 9) : raw);
      el.setAttribute('data-celsius', c);
    }
    return c;
  }

  function syncTempInputCelsiusFromDisplay(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var raw = parseFloat(el.value);
    var c = isNaN(raw) ? fallback : (useFahrenheit ? Math.round((raw - 32) * 5 / 9) : raw);
    el.setAttribute('data-celsius', c);
    return c;
  }

  function syncAccelTempInputsFromDisplay() {
    document.querySelectorAll('.accel-temp-input').forEach(function(el) {
      var raw = parseFloat(el.value);
      if (isNaN(raw)) return;
      var c = useFahrenheit ? (raw - 32) * 5 / 9 : raw;
      el.setAttribute('data-celsius', c);
    });
  }

  // ─── Temperature Unit Toggle ───

  function toggleUnit() {
    getTempInputCelsius('input-room-temp', 22);
    getTempInputCelsius('input-fridge-temp', 4);
    syncAccelTempInputsFromDisplay();
    useFahrenheit = !useFahrenheit;
    convertTempsToUnit();
    updateUnitLabels();
    saveState();
  }

  function convertTempsToUnit() {
    ['input-room-temp', 'input-fridge-temp'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      var fallback = id === 'input-room-temp' ? 22 : 4;
      var c = getTempInputCelsius(id, fallback);
      el.value = formatTempForDisplay(c);
    });
    // accel temps
    document.querySelectorAll('.accel-temp-input').forEach(function(el) {
      var c = parseFloat(el.getAttribute('data-celsius'));
      if (isNaN(c)) {
        var raw = parseFloat(el.value);
        c = isNaN(raw) ? 25 : (useFahrenheit ? (raw - 32) * 5 / 9 : raw);
        el.setAttribute('data-celsius', c);
      }
      el.value = formatTempForDisplay(c);
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
    var roomTemp = getTempInputCelsius('input-room-temp', 22);
    var roomHours = readNum('input-room-hours', 7);
    var fridgeTemp = getTempInputCelsius('input-fridge-temp', 4);

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
      temperature: getTempInputCelsius('input-room-temp', 22),
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
      var tempVal = formatTempForDisplay(a.temp);
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
      var tempInput = row.querySelector('.accel-temp-input');
      var tempC = toCelsius(parseFloat(tempInput.value) || 25);
      tempInput.setAttribute('data-celsius', tempC);
      accelStages.push({
        afterHours: parseFloat(row.querySelector('.accel-after').value) || 48,
        temp: tempC,
        hours: parseFloat(row.querySelector('.accel-hours').value) || 4
      });
    });
  }

  // ─── Initialization ───

  function initSliders(onChange) {
    onChangeCallback = onChange;

    // Timeline inputs
    ['input-pickle-y', 'input-pickle-m', 'input-pickle-d', 'input-pickle-hh',
     'input-room-temp', 'input-room-hours', 'input-fridge-temp'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() {
        syncPickleHidden();
        // Save manual values when user directly edits temp/hours/fridge
        if (id === 'input-room-temp' || id === 'input-room-hours' || id === 'input-fridge-temp') {
          if (id === 'input-room-temp') syncTempInputCelsiusFromDisplay('input-room-temp', 22);
          if (id === 'input-fridge-temp') syncTempInputCelsiusFromDisplay('input-fridge-temp', 4);
          saveManualValues();
          syncPresetButtons();
        }
        debouncedChange();
      });
    });

    // Starter slider
    var starter = document.getElementById('slider-starter');
    if (starter) {
      starter.addEventListener('input', function() {
        updateSliderDisplay('starter');
        debouncedChange();
      });
    }

    // Unit toggle (now in header, handled by app.js)

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

  // Manual preset: stores user's custom values
  var manualValues = { roomTemp: 28, roomHours: 7, fridgeTemp: 4 };

  function saveManualValues() {
    manualValues.roomTemp = getTempInputCelsius('input-room-temp', 22);
    manualValues.roomHours = readNum('input-room-hours', 7);
    manualValues.fridgeTemp = getTempInputCelsius('input-fridge-temp', 4);
  }

  function initPresets() {
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = btn.getAttribute('data-preset');

        if (preset === 'manual') {
          // Restore saved manual values
          setTempInputCelsius('input-room-temp', manualValues.roomTemp);
          setInput('input-room-hours', manualValues.roomHours);
          setTempInputCelsius('input-fridge-temp', manualValues.fridgeTemp);
          syncPresetButtons();
          debouncedChange();
          return;
        }

        // Save current values as manual before switching to preset
        saveManualValues();

        var p = PRESETS[preset];
        if (!p) return;
        setTempInputCelsius('input-room-temp', p.roomTemp);
        setInput('input-room-hours', p.roomHours);
        setTempInputCelsius('input-fridge-temp', p.fridgeTemp);
        accelStages = [];
        renderAccelStages();
        syncPresetButtons();
        debouncedChange();
      });
    });
  }

  function syncPresetButtons() {
    var roomT = getTempInputCelsius('input-room-temp', 22);
    var roomH = readNum('input-room-hours', 7);
    var fridgeT = getTempInputCelsius('input-fridge-temp', 4);
    var anyPresetActive = false;
    document.querySelectorAll('.preset-chip, .preset-btn').forEach(function(btn) {
      var preset = btn.getAttribute('data-preset');
      if (preset === 'manual') return; // handle below
      var p = PRESETS[preset];
      if (!p) return;
      var match = Math.abs(roomT - p.roomTemp) < 1 && Math.abs(roomH - p.roomHours) < 1 && Math.abs(fridgeT - p.fridgeTemp) < 1;
      btn.classList.toggle('active', match);
      if (match) anyPresetActive = true;
    });
    // Manual button: active when no preset matches
    var manualBtn = document.querySelector('[data-preset="manual"]');
    if (manualBtn) manualBtn.classList.toggle('active', !anyPresetActive);
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
        elapsedEl.textContent = t('ferment.elapsed') + ' ' + formatDayDisplay(elapsed);
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

  function findPh435Time(data) {
    var tp = data.timePoints;
    var ph = data.pH;
    if (!tp || !ph) return null;
    for (var i = 0; i < tp.length; i++) {
      if (ph[i] <= 4.35) return tp[i];
    }
    return null;
  }

  function dayToDate(pickleDate, days) {
    if (!pickleDate) return '';
    return formatDateLocale(new Date(pickleDate.getTime() + days * 86400000));
  }

  function updateTimelineMilestones(data) {
    var pickleDate = getPickleDate();
    var t = window.KimchiSim.i18n.t;
    var lang = window.KimchiSim.i18n.getLang();

    // i18n labels
    var sincePickle = lang === 'zh' ? '装坛后 ' : lang === 'ko' ? '담근 후 ' : 'After ';
    var fromNow = lang === 'zh' ? '距今 ' : lang === 'ko' ? '지금부터 ' : 'From now ';

    // Elapsed days from now
    var elapsedDays = 0;
    if (pickleDate) elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);

    // Helper: build "date  装坛后 Xd  距今 Yd" line
    function msWhen(days, suffix) {
      var sfx = suffix || '';
      var parts = [];
      if (pickleDate) parts.push(dayToDate(pickleDate, days) + sfx);
      parts.push(sincePickle + formatDayDisplay(days) + sfx);
      if (pickleDate) {
        var remaining = days - elapsedDays;
        if (remaining > 0) parts.push(fromNow + formatDayDisplay(remaining));
        else parts.push(fromNow + formatDayDisplay(Math.abs(remaining)) + (lang === 'zh' ? '前' : lang === 'ko' ? ' 전' : ' ago'));
      }
      return parts.join('  ');
    }

    // ── Old compat elements (hidden) ──
    setVal('tl-best-val', formatTimeDisplay(data.optimalTime));
    if (pickleDate) setVal('tl-best-date', dayToDate(pickleDate, data.optimalTime));
    var ph435Time = findPh435Time(data);
    if (ph435Time != null) {
      setVal('tl-ph435-val', formatTimeDisplay(ph435Time));
      if (pickleDate) setVal('tl-ph435-date', dayToDate(pickleDate, ph435Time));
    }
    var overSourDays = data.phases.phase2End;
    setVal('tl-sour-val', formatTimeDisplay(overSourDays));
    if (pickleDate) setVal('tl-sour-date', dayToDate(pickleDate, overSourDays));
    var endDays = overSourDays + 7;
    setVal('tl-end-val', formatTimeDisplay(endDays));
    if (pickleDate) setVal('tl-end-date', dayToDate(pickleDate, endDays));

    // ── New dashboard milestones ──
    var meta = data.nitriteMeta || {};
    var riskEnd = (meta.riskWindow && meta.riskWindow.end != null) ? meta.riskWindow.end : null;

    // 1. Nitrite clears — safe to eat
    var safeDays = riskEnd != null ? riskEnd : 0;
    setVal('tl-safe-when', msWhen(safeDays));
    setVal('tl-safe-desc', t('dash.nitriteClear'));

    // 2. Best flavor
    setVal('tl-best-when', msWhen(data.optimalTime));
    var flavor = data.atOptimal.flavor;
    setVal('tl-best-desc', t('dash.bestFlavor') + ' · pH ' + data.atOptimal.pH.toFixed(2));

    // 3. Over-sour
    setVal('tl-sour-when', msWhen(overSourDays));
    setVal('tl-sour-desc', t('dash.lastEdible'));

    // 4. Starter brine
    var starterDays = overSourDays;
    setVal('tl-starter-when', msWhen(starterDays, '+'));
    var starterNote = lang === 'zh' ? '可作母水（老泡菜液）· 下次加入 5–10% 提升发酵稳定性'
                    : lang === 'ko' ? '종균으로 사용 가능 · 다음 배치에 5-10% 추가'
                    : 'Use as starter brine · Add 5–10% to next batch';
    setVal('tl-starter-desc', starterNote);
  }

  // ─── Milestone Labels for Chart Annotations ───

  function buildMilestoneLabels(safeDays, bestDays, sourDays, data) {
    var t = window.KimchiSim.i18n.t;
    var pickleDate = getPickleDate();
    var labels = {};

    function fmtDay(days) {
      return formatDayDisplay(days);
    }
    function fmtDate(days) {
      if (!pickleDate) return '';
      var d = new Date(pickleDate.getTime() + days * 86400000);
      return (d.getMonth() + 1) + '/' + d.getDate();
    }

    // Safe
    if (safeDays > 0) {
      var safeLine1 = t('dash.nitriteClear');
      var safeLine2 = fmtDay(safeDays);
      if (pickleDate) safeLine2 += ' (' + fmtDate(safeDays) + ')';
      labels.safe = [safeLine1, safeLine2];
    }

    // Best
    var bestLine1 = t('dash.bestFlavor') + ' · pH ' + data.atOptimal.pH.toFixed(2);
    var bestLine2 = fmtDay(bestDays);
    if (pickleDate) bestLine2 += ' (' + fmtDate(bestDays) + ')';
    labels.best = [bestLine1, bestLine2];

    // Sour
    var sourLine1 = t('dash.lastEdible');
    var sourLine2 = fmtDay(sourDays);
    if (pickleDate) sourLine2 += ' (' + fmtDate(sourDays) + ')';
    labels.sour = [sourLine1, sourLine2];

    // Starter
    var starterLine1 = t('dash.starterReady');
    labels.starter = [starterLine1, sourLine2];

    return labels;
  }

  // ─── Dashboard Gauge ───

  function updateDashGauge(data) {
    var t = window.KimchiSim.i18n.t;
    var optDays = data.optimalTime;
    var flavor = data.atOptimal.flavor;
    var nitrite = data.atOptimal.nitrite || 0;
    var nitriteThreshold = (data.nitriteMeta || {}).safeThreshold || 3;
    var pickleDate = getPickleDate();

    // Compat hidden elements
    setVal('dash-day', formatDayDisplay(optDays));
    setVal('dash-best', formatTimeDisplay(optDays));
    setVal('dash-flavor', Math.round(flavor) + '/100');
    setVal('dash-ph', data.atOptimal.pH.toFixed(2));

    // ── New header summary ──
    // Current day
    var elapsedDays = 0;
    if (pickleDate) {
      elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);
    }
    setVal('dash-current-day', formatDayDisplay(elapsedDays));

    // Best flavor day — show "X天 (M月D日)"
    var bestDayEl = document.getElementById('dash-best-day');
    if (bestDayEl) {
      var bestDayMain = formatDayDisplay(optDays);
      if (pickleDate) {
        var bestDate = new Date(pickleDate.getTime() + optDays * 86400000);
        bestDayMain += ' (' + (bestDate.getMonth() + 1) + '/' + bestDate.getDate() + ')';
      }
      bestDayEl.textContent = bestDayMain;
    }

    // Status
    var statusEl = document.getElementById('dash-hero-status');
    if (statusEl) {
      var pH = data.atOptimal.pH;
      if (elapsedDays >= data.phases.phase2End) {
        statusEl.textContent = t('status.overSour');
        statusEl.style.color = 'var(--amber)';
      } else if (elapsedDays >= optDays * 0.85 && elapsedDays <= data.phases.phase2End) {
        statusEl.textContent = t('status.optimal');
        statusEl.style.color = 'var(--accent)';
      } else if (elapsedDays >= data.phases.phase1End) {
        statusEl.textContent = t('status.improving');
        statusEl.style.color = 'var(--blue)';
      } else {
        statusEl.textContent = t('status.developing');
        statusEl.style.color = 'var(--text-muted)';
      }
    }

    // ── Insight panel ──
    updateInsights(data, elapsedDays);

    // ── Pass milestones to charts ──
    var meta = data.nitriteMeta || {};
    var riskEnd = (meta.riskWindow && meta.riskWindow.end != null) ? meta.riskWindow.end : 0;
    var sourDay = data.phases.phase2End;
    if (window.KimchiSim.charts && window.KimchiSim.charts.setMilestones) {
      window.KimchiSim.charts.setMilestones({
        safeDay: riskEnd,
        bestDay: optDays,
        sourDay: sourDay,
        starterDay: sourDay,
        labels: buildMilestoneLabels(riskEnd, optDays, sourDay, data)
      });
    }

    // Compat hidden elements
    var safetyEl = document.getElementById('dash-safety');
    if (safetyEl) {
      if (nitrite < nitriteThreshold) { safetyEl.textContent = t('judge.safe'); safetyEl.style.color = 'var(--accent)'; }
      else if (nitrite < 8) { safetyEl.textContent = t('judge.caution'); safetyEl.style.color = 'var(--orange)'; }
      else { safetyEl.textContent = t('judge.danger'); safetyEl.style.color = 'var(--red)'; }
    }
    var dashStatusEl = document.getElementById('dash-status');
    if (dashStatusEl) {
      dashStatusEl.className = 'dash-status';
      if (flavor >= 80) { dashStatusEl.textContent = t('judge.excellent'); }
      else if (flavor >= 60) { dashStatusEl.textContent = t('judge.good'); }
      else { dashStatusEl.textContent = t('judge.improving'); }
    }
    var arc = document.getElementById('dash-arc');
    if (arc) {
      var circumference = 326.73;
      var progress = Math.min(1, Math.max(0, flavor / 100));
      arc.style.strokeDashoffset = circumference * (1 - progress);
    }
  }

  function updateInsights(data, elapsedDays) {
    var t = window.KimchiSim.i18n.t;
    var meta = data.nitriteMeta || {};
    var riskEnd = (meta.riskWindow && meta.riskWindow.end != null) ? meta.riskWindow.end : 0;
    var optDays = data.optimalTime;
    var p2End = data.phases.phase2End;

    var insights = [];

    // Safety insight
    if (elapsedDays < riskEnd) {
      insights.push({ icon: '⚠️', text: t('insight.notSafe') });
    } else {
      insights.push({ icon: '✅', text: t('insight.safe') });
    }

    // Flavor insight
    if (elapsedDays >= p2End) {
      insights.push({ icon: '🍲', text: t('insight.over') });
    } else if (elapsedDays >= optDays * 0.85 && elapsedDays <= optDays * 1.3) {
      insights.push({ icon: '🌟', text: t('insight.peak') });
    } else if (elapsedDays >= data.phases.phase1End) {
      insights.push({ icon: '📈', text: t('insight.rising') });
    } else {
      insights.push({ icon: '🔬', text: t('insight.developing') });
    }

    // Acid/future insight
    if (elapsedDays < optDays && elapsedDays > optDays * 0.5) {
      insights.push({ icon: '⏳', text: t('insight.balanced') });
    } else if (elapsedDays >= optDays && elapsedDays < p2End) {
      insights.push({ icon: '🔔', text: t('insight.overSoon') });
    } else if (elapsedDays < optDays * 0.5) {
      insights.push({ icon: '🍽', text: t('insight.balanced') });
    } else {
      insights.push({ icon: '🥘', text: t('insight.over') });
    }

    // Write to DOM
    for (var i = 0; i < 3; i++) {
      var row = document.getElementById('insight-' + (i + 1));
      if (row && insights[i]) {
        row.querySelector('.insight-icon').textContent = insights[i].icon;
        row.querySelector('.insight-text').textContent = insights[i].text;
      }
    }
  }

  function formatDayDisplay(days) {
    var tr = window.KimchiSim.i18n.t;
    var lang = window.KimchiSim.i18n.getLang();
    var dUnit = tr('unit.days');
    var hUnit = tr('unit.h');
    var sp = (lang === 'en') ? ' ' : '';
    var d = Math.floor(days);
    var h = Math.round((days - d) * 24);
    if (h >= 24) { d += 1; h = 0; }
    if (d === 0) return h + sp + hUnit;
    if (h === 0) return d + sp + dUnit;
    return d + sp + dUnit + h + sp + hUnit;
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
    updateDecisionZone(data);
    updateTimelineZone(data);
    updateStatusSentences(data);
    updateExplainPanel(data);
    updateScoringBreakdown(data);
    updateExtendAdvice(data);
    updateTimelineMilestones(data);
  }

  // ─── Decision Zone (Zone 1) ───

  function updateDecisionZone(data) {
    var t = window.KimchiSim.i18n.t;
    var pickleDate = getPickleDate();
    var elapsedDays = 0;
    if (pickleDate) {
      elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);
    }
    var optDays = data.optimalTime;
    var p2End = data.phases.phase2End;
    var meta = data.nitriteMeta || {};
    var riskEnd = (meta.riskWindow && meta.riskWindow.end != null) ? meta.riskWindow.end : 0;

    var stateEl = document.getElementById('dz-state');
    var elapsedEl = document.getElementById('dz-elapsed');
    var nextEl = document.getElementById('dz-next');
    if (!stateEl) return;

    // Determine state
    stateEl.className = 'dz-state';
    if (elapsedDays < riskEnd) {
      stateEl.textContent = t('dz.notSafe');
      stateEl.classList.add('state-risk');
    } else if (elapsedDays >= p2End) {
      stateEl.textContent = t('dz.overSour');
      stateEl.classList.add('state-warn');
    } else if (elapsedDays >= optDays * 0.85 && elapsedDays <= optDays * 1.3) {
      stateEl.textContent = t('dz.bestNow');
      stateEl.classList.add('state-best');
    } else if (elapsedDays >= riskEnd) {
      stateEl.textContent = t('dz.canEat');
      stateEl.classList.add('state-safe');
    } else {
      stateEl.textContent = t('dz.developing');
      stateEl.classList.add('state-risk');
    }

    // Elapsed time
    if (pickleDate && elapsedEl) {
      elapsedEl.textContent = t('dz.elapsed').replace('{d}', formatCompactTime(elapsedDays));
    } else if (elapsedEl) {
      elapsedEl.textContent = '';
    }

    // Next event
    if (nextEl) {
      if (elapsedDays < optDays) {
        var remaining = optDays - elapsedDays;
        nextEl.textContent = t('dz.nextBest').replace('{d}', formatCompactTime(remaining));
      } else if (elapsedDays >= optDays) {
        var pastDays = elapsedDays - optDays;
        nextEl.textContent = t('dz.pastBest').replace('{d}', formatCompactTime(pastDays));
      } else {
        nextEl.textContent = '';
      }
    }
  }

  // ─── Timeline Zone (Zone 2) ───

  function updateTimelineZone(data) {
    var pickleDate = getPickleDate();
    var elapsedDays = 0;
    if (pickleDate) {
      elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);
    }

    var meta = data.nitriteMeta || {};
    var riskEnd = (meta.riskWindow && meta.riskWindow.end != null) ? meta.riskWindow.end : 0;
    var optDays = data.optimalTime;
    var sourDays = data.phases.phase2End;
    var starterDays = sourDays;

    // Update times
    setVal('tz-safe-time', formatCompactTime(riskEnd));
    setVal('tz-best-time', formatCompactTime(optDays));
    setVal('tz-sour-time', formatCompactTime(sourDays));
    setVal('tz-starter-time', formatCompactTime(starterDays));

    // Mark past events
    var events = [
      { id: 'tz-safe', day: riskEnd },
      { id: 'tz-best', day: optDays },
      { id: 'tz-sour', day: sourDays },
      { id: 'tz-starter', day: starterDays }
    ];
    events.forEach(function(ev) {
      var el = document.getElementById(ev.id);
      if (el) {
        el.classList.toggle('past', pickleDate != null && elapsedDays > ev.day);
      }
    });
  }

  function formatCompactTime(days) {
    var tr = window.KimchiSim.i18n.t;
    var lang = window.KimchiSim.i18n.getLang();
    var dUnit = tr('unit.days');
    var hUnit = tr('unit.h');
    var sp = (lang === 'en') ? ' ' : '';
    var d = Math.floor(days);
    var h = Math.round((days - d) * 24);
    if (h >= 24) { d += 1; h = 0; }
    if (d === 0) return h + sp + hUnit;
    if (h === 0) return d + sp + dUnit;
    return d + sp + dUnit + h + sp + hUnit;
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
    var pickleDate = getPickleDate();

    // Old compat elements
    if (meta.initialNitrate != null) setVal('nitrite-nitrate', meta.initialNitrate.toFixed(1) + ' → ' + (atOptimal.nitrate || 0).toFixed(1) + ' mg/kg');
    if (sodium.mgKg != null && sodium.molar != null) setVal('nitrite-sodium', (sodium.mgKg / 1000).toFixed(1) + ' g/kg · ' + Math.round(sodium.molar * 1000) + ' mmol/L');
    if (peak.value != null && peak.time != null) {
      var peakStr = peak.value.toFixed(1) + ' mg/kg @ ' + formatCompactTime(peak.time);
      if (pickleDate) {
        peakStr += ' (' + formatDateLocale(new Date(pickleDate.getTime() + peak.time * 86400000)) + ')';
      }
      setVal('nitrite-peak', peakStr);
    }
    var windowStr = formatNitriteWindow(meta);
    if (pickleDate && meta.riskWindow && meta.riskWindow.start != null && meta.riskWindow.end != null) {
      var wStart = formatDateLocale(new Date(pickleDate.getTime() + meta.riskWindow.start * 86400000));
      var wEnd = formatDateLocale(new Date(pickleDate.getTime() + meta.riskWindow.end * 86400000));
      windowStr += ' (' + wStart + ' – ' + wEnd + ')';
    }
    setVal('nitrite-window', windowStr);
    if (atOptimal.formationRate != null && atOptimal.clearanceRate != null) {
      setVal('nitrite-flux', t('nitrite.form') + ' ' + atOptimal.formationRate.toFixed(2) + ' · ' + t('nitrite.clear') + ' ' + atOptimal.clearanceRate.toFixed(2) + ' mg/kg/d');
    }

    // New inline elements (under nitrite chart)
    var niBar = document.getElementById('ni-bar');
    if (niBar) {
      var currentNitrite = atOptimal.level != null ? atOptimal.level : (peak.value || 0);
      var safeThreshold = meta.safeThreshold || 3;
      var cls = currentNitrite < safeThreshold * 0.5 ? 'safe' : currentNitrite < safeThreshold ? 'warning' : 'danger';
      niBar.className = 'ni-bar ' + cls;
      setVal('ni-level', currentNitrite.toFixed(1) + ' mg/kg');
      var niStatus = document.getElementById('ni-status');
      if (niStatus) {
        var statusText = cls === 'safe' ? t('nitrite.safe') : cls === 'warning' ? t('nitrite.caution') : t('nitrite.danger');
        // Append safe-after date for danger/warning
        if (cls !== 'safe' && meta.riskWindow && meta.riskWindow.end != null && pickleDate) {
          var safeDate = new Date(pickleDate.getTime() + meta.riskWindow.end * 86400000);
          statusText += '  ' + t('nitrite.safeAfter') + ' ' + formatDateLocale(safeDate);
        }
        niStatus.textContent = statusText;
      }
    }
    if (peak.value != null && peak.time != null) {
      var niPeakStr = peak.value.toFixed(1) + ' mg/kg @ ' + formatCompactTime(peak.time);
      if (pickleDate) niPeakStr += ' (' + formatDateLocale(new Date(pickleDate.getTime() + peak.time * 86400000)) + ')';
      setVal('ni-peak', niPeakStr);
    }
    setVal('ni-window', windowStr);
    if (meta.initialNitrate != null) setVal('ni-nitrate', meta.initialNitrate.toFixed(1) + ' → ' + (atOptimal.nitrate || 0).toFixed(1) + ' mg/kg');
    if (sodium.mgKg != null && sodium.molar != null) setVal('ni-sodium', (sodium.mgKg / 1000).toFixed(1) + ' g/kg · ' + Math.round(sodium.molar * 1000) + ' mmol/L');
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

  function getNowComposition(data) {
    var pickleDate = getPickleDate();
    if (!pickleDate) return null;
    var elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);
    var tp = data.timePoints;
    if (!tp || tp.length === 0) return null;
    // Find nearest time index
    var idx = 0;
    for (var i = 0; i < tp.length; i++) {
      if (tp[i] <= elapsedDays) idx = i;
      else break;
    }
    return {
      sakei: data.microbial.sakei[idx],
      mesenteroides: data.microbial.mesenteroides[idx],
      plantarum: data.microbial.plantarum[idx],
      elapsed: elapsedDays
    };
  }

  function updateMicrobeCards(data) {
    var comp = data.atOptimal.composition || {};
    var nowComp = getNowComposition(data);
    var nowDominant = null;
    if (nowComp) {
      var maxVal = 0;
      ['sakei', 'mesenteroides', 'plantarum'].forEach(function(key) {
        if (nowComp[key] > maxVal) { maxVal = nowComp[key]; nowDominant = key; }
      });
    }
    ['sakei', 'mesenteroides', 'plantarum'].forEach(function(key) {
      var val = comp[key];
      var card = document.getElementById('microbe-card-' + key);
      if (card) {
        card.classList.toggle('active', key === data.atOptimal.dominantKey);
        card.classList.toggle('active-now', key === nowDominant);
      }
      setVal('microbe-val-' + key, val == null ? '--%' : Math.round(val * 100) + '%');
      if (nowComp) {
        setVal('microbe-now-' + key, Math.round(nowComp[key]) + '%');
      } else {
        setVal('microbe-now-' + key, '--%');
      }
    });
  }

  function updateEducation(data) {
    updateDominanceStrip(data);
    updateMicrobeCards(data);
  }

  function formatTimeDisplay(days) {
    var tr = window.KimchiSim.i18n.t;
    var lang = window.KimchiSim.i18n.getLang();
    var dUnit = tr('unit.days');
    var hUnit = tr('unit.h');
    var sp = (lang === 'en') ? ' ' : '';
    var d = Math.floor(days);
    var h = Math.round((days - d) * 24);
    if (h >= 24) { d += 1; h = 0; }
    if (d === 0) return h + sp + hUnit;
    if (h === 0) return d + sp + dUnit;
    return d + sp + dUnit + h + sp + hUnit;
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
    toggleUnit: function() { toggleUnit(); },
    getUseFahrenheit: function() { return useFahrenheit; },
    stages: [] // compat
  };
})();
