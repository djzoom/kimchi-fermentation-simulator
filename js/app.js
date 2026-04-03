/**
 * Kimchi Fermentation Navigator — App Entry
 * L1/L2/L3 progressive disclosure, layer management
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
    updateNowMarker();
  }

  // ─── Now Marker (from pickle time) ───
  function updateNowMarker() {
    var pickleVal = (document.getElementById('input-pickle-time') || {}).value;
    if (!pickleVal) { sim.charts.setNowMarker(null); return; }
    var pickleDate = new Date(pickleVal);
    if (isNaN(pickleDate.getTime())) { sim.charts.setNowMarker(null); return; }
    var elapsedDays = Math.max(0, (Date.now() - pickleDate.getTime()) / 86400000);
    sim.charts.setNowMarker(elapsedDays);
  }

  // ─── Theme ───
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

  // ─── Language ───
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
        runAndUpdate(sim.ui.getParams(), sim.ui.getStages());
      });
    }
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ─── Layer Management (L1/L2/L3) ───
  function initLayers() {
    var btnWhy = document.getElementById('btn-why');
    var btnExpert = document.getElementById('btn-expert');
    var layer2 = document.getElementById('layer-2');
    var layer3 = document.getElementById('layer-3');

    if (btnWhy && layer2) {
      btnWhy.addEventListener('click', function () {
        var visible = layer2.style.display !== 'none';
        layer2.style.display = visible ? 'none' : 'flex';
        btnWhy.classList.toggle('expanded', !visible);
      });
    }

    if (btnExpert && layer3) {
      btnExpert.addEventListener('click', function () {
        var pressed = btnExpert.getAttribute('aria-pressed') === 'true';
        btnExpert.setAttribute('aria-pressed', !pressed);
        layer3.style.display = pressed ? 'none' : 'flex';
      });
    }
  }

  // ─── Recipe Calculator ───
  var RECIPE_PER_2_5KG = {
    coarseSalt: 200, chili: 80, fish: 45, shrimp: 30,
    garlic: 36, ginger: 8, ricePaste: 40, scallion: 50
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
      html += '<div class="calc-item"><div class="calc-item-name">' + items[i].name +
        '</div><div class="calc-item-amount">' + items[i].amount +
        '<span class="calc-item-unit"> ' + items[i].unit + '</span></div></div>';
    }
    html += '<div class="calc-note">' + t('calc.note') + '</div>';
    container.innerHTML = html;
  }

  function initCalc() {
    var input = document.getElementById('calc-weight');
    if (!input) return;
    input.addEventListener('input', function() { updateCalcResults(); sim.ui.saveState(); });
    updateCalcResults();
  }

  // ─── Tooltips ───
  function initTooltips() {
    var box = document.getElementById('tooltip-box');
    if (!box) return;
    var timer = null;
    var pinnedEl = null;

    function show(el) {
      var text = el.getAttribute('data-tip-text') || sim.i18n.t(el.getAttribute('data-tip'));
      if (!text || text === el.getAttribute('data-tip')) return;
      box.textContent = text;
      var rect = el.getBoundingClientRect();
      box.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 296)) + 'px';
      box.style.top = (rect.bottom + 8) + 'px';
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
      timer = setTimeout(function() { show(el); }, 400);
    }, true);

    document.addEventListener('mouseleave', function(e) {
      var el = e.target.closest('[data-tip]');
      if (!el || pinnedEl === el) return;
      clearTimeout(timer);
      hide(false);
    }, true);

    document.addEventListener('click', function(e) {
      var info = e.target.closest('[data-tip]');
      if (info) {
        e.preventDefault();
        if (pinnedEl === info) { pinnedEl = null; hide(true); }
        else { pinnedEl = info; show(info); }
        return;
      }
      pinnedEl = null;
      hide(true);
    });
  }

  // ─── Init ───
  function init() {
    initTheme();
    initLang();
    initLayers();
    initTooltips();
    sim.charts.init();

    sim.ui.initSliders(function (params, stages) {
      runAndUpdate(params, stages);
    });
    sim.recipe.init();
    initCalc();

    sim.ui.restoreSavedInputs();
    updateCalcResults();

    var params = sim.ui.getParams();
    var stg = sim.ui.getStages();
    runAndUpdate(params, stg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
