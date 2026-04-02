/**
 * Kimchi Fermentation Simulator — UI Controls
 * Slider handling, multi-stage editor, phase indicator, stats
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.ui = (function () {
  'use strict';

  var debounceTimer = null;
  var onChangeCallback = null;
  var stages = [
    { temperature: 25, duration: 6 },   // 25°C for 6 hours
    { temperature: 4, duration: 504 }    // 4°C for 3 weeks
  ];
  var useMultiStage = true;

  function getParams() {
    return {
      temperature: parseFloat(document.getElementById('slider-temp').value),
      salt: parseFloat(document.getElementById('slider-salt').value),
      starter: parseFloat(document.getElementById('slider-starter').value)
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
          temperature: parseFloat(tempInput.value) || 10,
          duration: parseFloat(durInput.value) || 24
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

    var html = '';
    for (var i = 0; i < stages.length; i++) {
      html += '<div class="stage-row">' +
        '<div class="stage-num">' + (i + 1) + '</div>' +
        '<input type="number" class="stage-input stage-temp" value="' + stages[i].temperature + '" min="-5" max="40" step="0.5">' +
        '<span class="stage-unit">°C</span>' +
        '<input type="number" class="stage-input stage-dur" value="' + stages[i].duration + '" min="1" max="2400" step="1">' +
        '<span class="stage-unit" data-i18n="unit.h">' + t('unit.h') + '</span>' +
        (stages.length > 1 ?
          '<button class="btn-remove-stage" data-idx="' + i + '" title="Remove">&times;</button>' :
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
  }

  function readStagesFromDOM() {
    stages = [];
    var rows = document.querySelectorAll('.stage-row');
    rows.forEach(function(row) {
      var tempInput = row.querySelector('.stage-temp');
      var durInput = row.querySelector('.stage-dur');
      if (tempInput && durInput) {
        stages.push({
          temperature: parseFloat(tempInput.value) || 10,
          duration: parseFloat(durInput.value) || 24
        });
      }
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

  function updateStats(data) {
    var t = window.KimchiSim.i18n.t;

    setVal('stat-optimal-time', formatTimeDisplay(data.optimalTime));
    setVal('stat-ph', data.atOptimal.pH.toFixed(2));
    setVal('stat-acid', data.atOptimal.acid.toFixed(2) + '%');
    setVal('stat-bacteria', data.atOptimal.dominant);
    setVal('stat-flavor', Math.round(data.atOptimal.flavor));

    // Realtime info in sidebar
    setVal('info-opt-time', formatTimeDisplay(data.optimalTime));
    setVal('info-ph', data.atOptimal.pH.toFixed(2));
    setVal('info-acid', data.atOptimal.acid.toFixed(2) + '%');
    setVal('info-flavor', Math.round(data.atOptimal.flavor) + '/100');
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
    initControlsToggle: initControlsToggle,
    renderStages: renderStages,
    stages: stages
  };
})();
