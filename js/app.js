/**
 * Kimchi Fermentation Simulator — Application Entry Point
 */
window.KimchiSim = window.KimchiSim || {};

(function () {
  'use strict';

  var sim = window.KimchiSim;
  var lastSimData = null;

  function runAndUpdate(params, stages) {
    var data = sim.simulation.run(params, stages);
    lastSimData = data;
    sim.charts.update(data);
    sim.ui.updatePhaseIndicator(data);
    sim.ui.updateStats(data);
    sim.ui.updateEducation(data);
    updateBatchTracker();
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('kimchi-theme'); } catch (e) {}
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.getElementById('theme-toggle').addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('kimchi-theme', next); } catch (e) {}
      sim.charts.updateLabels();
    });
  }

  function initLang() {
    sim.i18n.loadSaved();
    var lang = sim.i18n.getLang();
    sim.i18n.setLang(lang);
    updateLangButtons(lang);

    var switchEl = document.getElementById('lang-switch');
    if (switchEl) {
      switchEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lang-btn');
        if (!btn) return;
        var newLang = btn.getAttribute('data-lang');
        sim.i18n.setLang(newLang);
        sim.charts.updateLabels();
        sim.ui.renderStages();
        sim.recipe.updateLang();
        updateCalcResults();
        updateLangButtons(newLang);
        runAndUpdate(sim.ui.getParams(), sim.ui.getStages());
      });
    }
  }

  function updateLangButtons(lang) {
    var btns = document.querySelectorAll('.lang-btn');
    btns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // --- Recipe Calculator ---
  // Per 2.5kg cabbage (1 head, 1포기) — Korean government + traditional standard
  // Sources: 농촌진흥청 (RDA), Codex CXS 223-2001, 식품공전
  // After salting, cabbage weighs ~1.8kg. Gov standard: 4.5g chili + 2.0g garlic per 100g salted
  var RECIPE_PER_2_5KG = {
    coarseSalt: 200, // g — 8% of raw weight for dry-salting (절임)
    chili: 80,       // g — 4.5g/100g × 1800g salted ≈ 81g (고춧가루 약1컵)
    fish: 45,        // ml — 멸치액젓 3큰술
    shrimp: 30,      // g — 새우젓 2큰술 (fish:shrimp = 3:2)
    garlic: 36,      // g — 2.0g/100g × 1800g = 36g (마늘 6-7쪽)
    ginger: 8,       // g — 생강 약1큰술
    ricePaste: 40,   // ml — 찹쌀풀 2.5큰술
    scallion: 50     // g — 쪽파 5-6줄기
  };

  function updateCalcResults() {
    var input = document.getElementById('calc-weight');
    var container = document.getElementById('calc-results');
    if (!input || !container) return;

    var weight = parseFloat(input.value) || 2.5;
    var ratio = weight / 2.5;
    var t = sim.i18n.t;

    var items = [
      { name: t('calc.coarse.salt'), amount: (RECIPE_PER_2_5KG.coarseSalt * ratio).toFixed(0), unit: 'g' },
      { name: t('calc.chili'), amount: (RECIPE_PER_2_5KG.chili * ratio).toFixed(0), unit: 'g' },
      { name: t('calc.fish'), amount: (RECIPE_PER_2_5KG.fish * ratio).toFixed(0), unit: 'ml' },
      { name: t('calc.shrimp'), amount: (RECIPE_PER_2_5KG.shrimp * ratio).toFixed(0), unit: 'g' },
      { name: t('calc.garlic'), amount: (RECIPE_PER_2_5KG.garlic * ratio).toFixed(0), unit: 'g' },
      { name: t('calc.ginger'), amount: (RECIPE_PER_2_5KG.ginger * ratio).toFixed(0), unit: 'g' },
      { name: t('calc.rice'), amount: (RECIPE_PER_2_5KG.ricePaste * ratio).toFixed(0), unit: 'ml' },
      { name: t('calc.scallion'), amount: (RECIPE_PER_2_5KG.scallion * ratio).toFixed(0), unit: 'g' }
    ];

    var html = '';
    for (var i = 0; i < items.length; i++) {
      html += '<div class="calc-item">' +
        '<div class="calc-item-name">' + items[i].name + '</div>' +
        '<div class="calc-item-amount">' + items[i].amount + '<span class="calc-item-unit"> ' + items[i].unit + '</span></div>' +
        '</div>';
    }
    html += '<div class="calc-note">' + t('calc.note') + '</div>';
    container.innerHTML = html;
  }

  function initCalc() {
    var input = document.getElementById('calc-weight');
    if (!input) return;
    input.addEventListener('input', function() {
      updateCalcResults();
      sim.ui.saveState();
    });
    updateCalcResults();
  }

  function initTooltips() {
    var box = document.getElementById('tooltip-box');
    if (!box) return;
    var timer = null;
    var pinnedEl = null;

    function getTipText(el) {
      var text = el.getAttribute('data-tip-text');
      if (!text) {
        var key = el.getAttribute('data-tip');
        text = sim.i18n.t(key);
      }
      return text;
    }

    function position(el) {
      var rect = el.getBoundingClientRect();
      box.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 296)) + 'px';
      box.style.top = (rect.bottom + 8) + 'px';
    }

    function show(el) {
      var text = getTipText(el);
      if (!text || text === el.getAttribute('data-tip')) return;
      box.textContent = text;
      position(el);
      box.classList.add('visible');
    }

    function hide(force) {
      if (!force && pinnedEl) return;
      box.classList.remove('visible');
    }

    document.addEventListener('mouseenter', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el || pinnedEl === el) return;
      clearTimeout(timer);
      timer = setTimeout(function() {
        show(el);
      }, 400);
    }, true);

    document.addEventListener('mouseleave', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el || pinnedEl === el) return;
      clearTimeout(timer);
      hide(false);
    }, true);

    document.addEventListener('focusin', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el) return;
      clearTimeout(timer);
      show(el);
    }, true);

    document.addEventListener('focusout', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el || pinnedEl === el) return;
      hide(false);
    }, true);

    document.addEventListener('click', function(e) {
      var info = e.target.closest('.info-dot[data-tip]');
      if (info) {
        e.preventDefault();
        if (pinnedEl === info) {
          pinnedEl = null;
          hide(true);
        } else {
          pinnedEl = info;
          show(info);
        }
        return;
      }
      pinnedEl = null;
      hide(true);
    });

    window.addEventListener('resize', function() {
      if (pinnedEl) position(pinnedEl);
    });

    window.addEventListener('scroll', function() {
      if (pinnedEl) position(pinnedEl);
    }, true);
  }

  // --- Batch Tracker ---
  function initBatchTracker() {
    var dateInput = document.getElementById('batch-start-date');
    if (!dateInput) return;

    // Default: today
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var todayStr = yyyy + '-' + mm + '-' + dd;

    // Restore saved date or use today
    var saved = null;
    try { saved = localStorage.getItem('kimchi-batch-date'); } catch (e) {}
    dateInput.value = saved || todayStr;

    dateInput.addEventListener('change', function () {
      try { localStorage.setItem('kimchi-batch-date', dateInput.value); } catch (e) {}
      updateBatchTracker();
    });
  }

  function updateBatchTracker() {
    var dateInput = document.getElementById('batch-start-date');
    var elapsedEl = document.getElementById('batch-elapsed');
    var statusEl = document.getElementById('batch-status');
    if (!dateInput || !elapsedEl || !statusEl || !lastSimData) return;

    var t = sim.i18n.t;
    var startDate = new Date(dateInput.value);
    var now = new Date();

    if (isNaN(startDate.getTime())) {
      elapsedEl.textContent = '--';
      statusEl.innerHTML = '<span class="batch-stat-label">' + t('batch.notStarted') + '</span>';
      sim.charts.setNowMarker(null);
      return;
    }

    var elapsedMs = now.getTime() - startDate.getTime();
    var elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
    if (elapsedDays < 0) elapsedDays = 0;

    // Show elapsed time
    var elapsedText = t('batch.elapsed').replace('{d}', elapsedDays.toFixed(1));
    elapsedEl.textContent = elapsedText;

    // Find current values in simulation data
    var data = lastSimData;
    var tp = data.timePoints;
    var idx = 0;
    for (var i = 0; i < tp.length; i++) {
      if (tp[i] >= elapsedDays) { idx = i; break; }
      idx = i;
    }
    if (idx >= tp.length) idx = tp.length - 1;

    var curPH = data.pH[idx];
    var curAcid = data.lacticAcid[idx];
    var curFlavor = data.flavorScore[idx];
    var curNitrite = data.nitrite[idx];
    var comp = sim.models.microbialComposition(curPH, sim.ui.getParams().starter);
    var dominant = 'Leuc. mesenteroides';
    var dominantKey = 'mesenteroides';
    if (comp.sakei > comp.mesenteroides && comp.sakei > comp.plantarum) {
      dominant = 'L. sakei'; dominantKey = 'sakei';
    } else if (comp.plantarum > comp.mesenteroides) {
      dominant = 'L. plantarum'; dominantKey = 'plantarum';
    }

    // Determine phase and suggestion
    var phase, suggestion;
    if (curPH >= 5.0) {
      phase = t('phase.initial');
      suggestion = t('batch.suggestion.early');
    } else if (curPH >= 4.0) {
      phase = t('phase.optimal');
      suggestion = t('batch.suggestion.optimal');
    } else {
      phase = t('phase.over');
      suggestion = t('batch.suggestion.over');
    }

    // Nitrite class
    var nitriteClass = 'safe';
    if (curNitrite >= 8) nitriteClass = 'danger';
    else if (curNitrite >= 3) nitriteClass = 'warning';

    statusEl.innerHTML =
      '<div class="batch-stat">' +
        '<span class="batch-stat-label">' + t('batch.phase') + '</span>' +
        '<span class="batch-stat-value">' + phase + '</span>' +
      '</div>' +
      '<div class="batch-stat">' +
        '<span class="batch-stat-label">pH</span>' +
        '<span class="batch-stat-value">' + curPH.toFixed(2) + '</span>' +
      '</div>' +
      '<div class="batch-stat">' +
        '<span class="batch-stat-label">' + t('stat.flavor') + '</span>' +
        '<span class="batch-stat-value">' + Math.round(curFlavor) + '/100</span>' +
      '</div>' +
      '<div class="batch-stat">' +
        '<span class="batch-stat-label">' + t('batch.dominant') + '</span>' +
        '<span class="batch-stat-value">' + t('microbe.' + dominantKey + '.name') + '</span>' +
      '</div>' +
      '<div class="batch-stat">' +
        '<span class="batch-stat-label">NO\u2082</span>' +
        '<span class="batch-stat-value ' + nitriteClass + '">' + curNitrite.toFixed(1) + ' mg/kg</span>' +
      '</div>' +
      '<div class="batch-stat" style="grid-column: 1 / -1;">' +
        '<span class="batch-stat-label">' + t('batch.suggestion') + '</span>' +
        '<span class="batch-stat-value" style="font-size:0.75rem;font-weight:500;">' + suggestion + '</span>' +
      '</div>';

    // Set NOW marker on chart
    sim.charts.setNowMarker(elapsedDays);
  }

  function init() {
    initTheme();
    initLang();
    initTooltips();
    sim.charts.init();

    sim.ui.initSliders(function (params, stages) {
      runAndUpdate(params, stages);
    });
    sim.ui.initControlsToggle();
    sim.recipe.init();
    initCalc();
    initBatchTracker();

    // Restore saved inputs (sliders, stages, calc weight)
    sim.ui.restoreSavedInputs();
    updateCalcResults();

    // Initial run with current stages
    var params = sim.ui.getParams();
    var stg = sim.ui.getStages();
    runAndUpdate(params, stg || [
      { temperature: 25, duration: 6 },
      { temperature: 4, duration: 504 }
    ]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
