/**
 * Kimchi Fermentation Simulator — Application Entry Point
 */
window.KimchiSim = window.KimchiSim || {};

(function () {
  'use strict';

  var sim = window.KimchiSim;

  function runAndUpdate(params, stages) {
    var data = sim.simulation.run(params, stages);
    sim.charts.update(data);
    sim.ui.updatePhaseIndicator(data);
    sim.ui.updateStats(data);
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
        sim.recipe.updateLang();
        updateCalcResults();
        updateLangButtons(newLang);
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

    document.addEventListener('mouseenter', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el) return;
      clearTimeout(timer);
      timer = setTimeout(function() {
        var text = el.getAttribute('data-tip-text');
        if (!text) {
          var key = el.getAttribute('data-tip');
          text = sim.i18n.t(key);
        }
        if (!text || text === el.getAttribute('data-tip')) return;
        box.textContent = text;
        var rect = el.getBoundingClientRect();
        box.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 296)) + 'px';
        box.style.top = (rect.bottom + 8) + 'px';
        box.classList.add('visible');
      }, 500); // 500ms delay
    }, true);

    document.addEventListener('mouseleave', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el) return;
      clearTimeout(timer);
      box.classList.remove('visible');
    }, true);
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
