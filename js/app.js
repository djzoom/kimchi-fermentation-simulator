/**
 * Fermentation Simulator — App Entry
 * Supports Kimchi, Sichuan Paocai, German Sauerkraut
 * L1/L2/L3 progressive disclosure, layer management
 */
window.KimchiSim = window.KimchiSim || {};

(function () {
  'use strict';

  var sim = window.KimchiSim;
  var lastSimData = null;
  var currentFermentType = 'kimchi';

  function runAndUpdate(params, stages) {
    var data = sim.simulation.run(params, stages);
    lastSimData = data;
    sim.charts.update(data);
    sim.ui.updatePhaseIndicator(data);
    sim.ui.updateStats(data);
    sim.ui.updateEducation(data);
    updateBatchTracker();
  }

  // ─── Ferment Type Selector ───
  function initFermentSelector() {
    var selector = document.getElementById('ferment-selector');
    if (!selector) return;

    // Restore saved type
    try {
      var saved = localStorage.getItem('kimchi-ferment-type');
      if (saved && sim.models.getProfile(saved)) {
        currentFermentType = saved;
      }
    } catch (e) {}

    if (currentFermentType !== 'kimchi') {
      switchFermentType(currentFermentType, true);
    }

    selector.addEventListener('click', function (e) {
      var chip = e.target.closest('.ferment-chip');
      if (!chip) return;
      var type = chip.getAttribute('data-ferment');
      if (type === currentFermentType) return;
      switchFermentType(type, false);
    });
  }

  function switchFermentType(type, isInit) {
    if (!sim.models.getProfile(type)) return;
    currentFermentType = type;

    // Update model
    sim.models.setFermentType(type);

    // Update UI buttons
    document.querySelectorAll('.ferment-chip').forEach(function (chip) {
      chip.classList.toggle('active', chip.getAttribute('data-ferment') === type);
    });

    // Reset species UI so it re-renders
    sim.ui.resetSpeciesUI();

    // Update recipe content
    if (sim.recipe.setFermentType) sim.recipe.setFermentType(type);

    // Update calculator
    updateCalcResults();

    // Update starter label
    var t = sim.i18n.t;
    var starterLabel = document.querySelector('.quick-label[data-i18n^="mixer.starter"]');
    if (starterLabel) {
      var starterKey = 'mixer.starter.' + type;
      var starterText = t(starterKey);
      if (starterText === starterKey) starterText = t('mixer.starter');
      starterLabel.textContent = starterText;
      starterLabel.setAttribute('data-i18n', starterKey);
    }

    // Update page title emoji
    var logoMark = document.querySelector('.logo-mark');
    if (logoMark) {
      var icons = { kimchi: '🥬', sichuan: '🫙', sauerkraut: '🥒' };
      logoMark.textContent = icons[type] || '🥬';
    }

    // Save preference
    try { localStorage.setItem('kimchi-ferment-type', type); } catch (e) {}

    // Re-run simulation
    if (!isInit) {
      var params = sim.ui.getParams();
      var stg = sim.ui.getStages();
      runAndUpdate(params, stg);
    }
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
        sim.ui.renderStages();
        sim.ui.resetSpeciesUI(); // re-render species names in new language
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

    var btnCalcNav = document.getElementById('btn-calc-nav');
    var btnProcessNav = document.getElementById('btn-process-nav');

    function ensureExpertVisible() {
      if (layer3 && layer3.style.display === 'none') {
        layer3.style.display = 'flex';
        if (btnExpert) btnExpert.setAttribute('aria-pressed', 'true');
      }
    }

    if (btnCalcNav) {
      btnCalcNav.addEventListener('click', function () {
        ensureExpertVisible();
        var el = document.getElementById('calc-weight');
        if (el) setTimeout(function () { el.closest('.expert-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
      });
    }

    if (btnProcessNav) {
      btnProcessNav.addEventListener('click', function () {
        ensureExpertVisible();
        var el = document.getElementById('recipe-content');
        if (el) {
          var content = document.getElementById('recipe-content');
          if (content && !content.classList.contains('expanded')) {
            var toggle = document.getElementById('recipe-toggle');
            if (toggle) toggle.click();
          }
          setTimeout(function () { el.closest('.expert-card').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        }
      });
    }
  }

  // ─── Recipe Calculator (dynamic per ferment type) ───

  function updateCalcResults() {
    var input = document.getElementById('calc-weight');
    var container = document.getElementById('calc-results');
    if (!input || !container) return;

    var profile = sim.models.getProfile(currentFermentType);
    var recipeItems = profile.recipe_items;
    var baseWeight = profile.recipe_base_weight;
    var weight = parseFloat(input.value) || baseWeight;
    var ratio = weight / baseWeight;
    var t = sim.i18n.t;

    // Build items from profile recipe
    var items = [];
    for (var key in recipeItems) {
      if (!recipeItems.hasOwnProperty(key)) continue;
      var calcKey = 'calc.' + key;
      var name = t(calcKey);
      if (name === calcKey) name = t('calc.coarse.salt'); // fallback
      var amount = recipeItems[key] * ratio;
      var unit = (key === 'fish' || key === 'ricePaste' || key === 'baijiu') ? 'ml' : 'g';
      items.push({ name: name, amount: amount.toFixed(0), unit: unit });
    }

    var html = '';
    for (var i = 0; i < items.length; i++) {
      html += '<div class="calc-item">' +
        '<div class="calc-item-name">' + items[i].name + '</div>' +
        '<div class="calc-item-amount">' + items[i].amount + '<span class="calc-item-unit"> ' + items[i].unit + '</span></div>' +
        '</div>';
    }

    // Note per type
    var noteKey = 'calc.note' + (currentFermentType === 'kimchi' ? '' : '.' + currentFermentType);
    html += '<div class="calc-note">' + t(noteKey) + '</div>';
    container.innerHTML = html;

    // Update input label
    var inputLabel = container.closest('.expert-card').querySelector('label[data-i18n^="calc.input"]');
    if (inputLabel) {
      var labelKey = 'calc.input' + (currentFermentType === 'kimchi' ? '' : '.' + currentFermentType);
      var labelText = t(labelKey);
      if (labelText === labelKey) labelText = t('calc.input');
      inputLabel.textContent = labelText;
      inputLabel.setAttribute('data-i18n', labelKey);
    }
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

  // ─── Tooltips ───
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

  // ─── Batch Tracker ───
  function initBatchTracker() {
    var dateInput = document.getElementById('batch-start-date');
    if (!dateInput) return;

    var today = new Date();
    var todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

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
    if (!dateInput || !elapsedEl || !lastSimData) return;

    var t = sim.i18n.t;
    var startDate = new Date(dateInput.value);
    var now = new Date();

    if (isNaN(startDate.getTime())) {
      elapsedEl.textContent = '--';
      sim.charts.setNowMarker(null);
      return;
    }

    var elapsedMs = now.getTime() - startDate.getTime();
    var elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

    elapsedEl.textContent = t('batch.elapsed').replace('{d}', elapsedDays.toFixed(1));
    sim.charts.setNowMarker(elapsedDays);
  }

  // ─── Init ───
  function init() {
    initTheme();
    initLang();
    initFermentSelector();
    initLayers();
    initTooltips();
    sim.charts.init();

    sim.ui.initSliders(function (params, stages) {
      runAndUpdate(params, stages);
    });
    sim.ui.initControlsToggle();
    sim.recipe.init();
    initCalc();
    initBatchTracker();

    sim.ui.restoreSavedInputs();
    updateCalcResults();

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
