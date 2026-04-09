/**
 * Kimchi Fermentation Navigator — App Entry
 * L1/L2/L3 progressive disclosure, layer management
 */
window.KimchiSim = window.KimchiSim || {};

(function () {
  'use strict';

  var sim = window.KimchiSim;
  var lastSimData = null;
  var currentRecipeType = 'kimchi';
  var useImperial = false; // kg vs lb

  function runAndUpdate(params, stages, animate) {
    var data = sim.simulation.run(params, stages);
    lastSimData = data;
    var pickleVal = (document.getElementById('input-pickle-time') || {}).value;
    var pd = pickleVal ? new Date(pickleVal) : null;
    sim.charts.setPickleDate(pd && !isNaN(pd.getTime()) ? pd : null);
    if (animate && sim.charts.animateUpdate) {
      sim.charts.animateUpdate(data);
    } else {
      sim.charts.update(data);
    }
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
    applyLangDefaults(lang, false);
    sim.i18n.setLang(lang);
    updateLangButtons(lang);

    var switchEl = document.getElementById('lang-switch');
    if (switchEl) {
      switchEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lang-btn');
        if (!btn) return;
        var newLang = btn.getAttribute('data-lang');
        applyLangDefaults(newLang, true);
        sim.i18n.setLang(newLang);
        sim.charts.updateLabels();
        sim.recipe.updateLang();
        if (sim.ui.resetMicrobeKeys) sim.ui.resetMicrobeKeys();
        updateCalcResults();
        updateLangButtons(newLang);
        runAndUpdate(sim.ui.getParams(), sim.ui.getStages());
      });
    }
  }

  function applyLangDefaults(lang, isSwitch) {
    // German → default recipe to Sauerkraut; Chinese → default to Kimchi
    if (lang === 'de' && currentRecipeType === 'kimchi') {
      setRecipeType('sauerkraut');
    } else if (lang === 'zh' && currentRecipeType === 'sauerkraut') {
      setRecipeType('kimchi');
    } else if (lang === 'ko' && currentRecipeType !== 'kimchi' && isSwitch) {
      setRecipeType('kimchi');
    }

    // Only set unit defaults on explicit language switch (not on init)
    if (!isSwitch) return;

    var tempBtn = document.getElementById('btn-unit-temp');
    var weightBtn = document.getElementById('btn-unit-weight');
    if (lang === 'en') {
      // English → imperial (°F, lb)
      if (!sim.ui.getUseFahrenheit()) {
        sim.ui.toggleUnit();
        if (tempBtn) tempBtn.textContent = '°F';
      }
      if (!useImperial) {
        useImperial = true;
        if (weightBtn) weightBtn.textContent = 'lb';
        convertWeightDisplay();
        try { localStorage.setItem('kimchi-imperial', '1'); } catch (e) {}
      }
    } else {
      // Non-English → metric (°C, kg)
      if (sim.ui.getUseFahrenheit()) {
        sim.ui.toggleUnit();
        if (tempBtn) tempBtn.textContent = '°C';
      }
      if (useImperial) {
        useImperial = false;
        if (weightBtn) weightBtn.textContent = 'kg';
        convertWeightDisplay();
        try { localStorage.setItem('kimchi-imperial', '0'); } catch (e) {}
      }
    }
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ─── Unit Toggles (header) ───
  function initUnitToggles() {
    var tempBtn = document.getElementById('btn-unit-temp');
    var weightBtn = document.getElementById('btn-unit-weight');

    if (tempBtn) {
      tempBtn.addEventListener('click', function () {
        sim.ui.toggleUnit();
        var useFahrenheit = sim.ui.getUseFahrenheit();
        tempBtn.textContent = useFahrenheit ? '°F' : '°C';
        runAndUpdate(sim.ui.getParams(), sim.ui.getStages());
      });
    }

    if (weightBtn) {
      weightBtn.addEventListener('click', function () {
        useImperial = !useImperial;
        weightBtn.textContent = useImperial ? 'lb' : 'kg';
        convertWeightDisplay();
        try { localStorage.setItem('kimchi-imperial', useImperial ? '1' : '0'); } catch (e) {}
      });
    }

    // Restore saved unit preferences, or default by language
    try {
      var savedImperial = localStorage.getItem('kimchi-imperial');
      if (savedImperial === '1') {
        useImperial = true;
        if (weightBtn) weightBtn.textContent = 'lb';
        convertWeightDisplay();
      } else if (savedImperial === null && sim.i18n.getLang() === 'en') {
        // First visit, English → default to imperial
        useImperial = true;
        if (weightBtn) weightBtn.textContent = 'lb';
        convertWeightDisplay();
      }
    } catch (e) {}

    // Sync temp button label with ui state; default English to °F on first visit
    try {
      var savedState = localStorage.getItem('kimchi-sim-state');
      if (!savedState && sim.i18n.getLang() === 'en' && !sim.ui.getUseFahrenheit()) {
        sim.ui.toggleUnit();
      }
    } catch (e) {}
    if (tempBtn) {
      tempBtn.textContent = sim.ui.getUseFahrenheit() ? '°F' : '°C';
    }
  }

  function convertWeightDisplay() {
    var input = document.getElementById('calc-weight');
    var unitSpan = input ? input.parentElement.querySelector('.field-unit') : null;
    if (unitSpan) unitSpan.textContent = useImperial ? 'lb' : 'kg';
    // Note: the actual value stays in kg internally; display conversion happens in updateCalcResults
    updateCalcResults();
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

  // ─── Recipe Types ───
  var RECIPES = {
    kimchi: {
      base: 2,  // per 2 kg cabbage
      items: [
        // Base (required)
        { key: 'calc.salt', amount: 270, unit: 'g' },
        { key: 'calc.brine.water', amount: 2000, unit: 'ml' },
        { key: 'calc.chili.coarse', amount: 60, unit: 'g' },
        { key: 'calc.chili.fine', amount: 60, unit: 'g' },
        { key: 'calc.rice.flour', amount: 50, unit: 'g' },
        { key: 'calc.rice.water', amount: 300, unit: 'ml' },
        { key: 'calc.garlic', amount: 100, unit: 'g' },
        { key: 'calc.ginger', amount: 60, unit: 'g' },
        // Optional / flavor enhancers
        { key: 'calc.apple', amount: 0.5, unit: 'pcs', optional: true },
        { key: 'calc.pear', amount: 0.5, unit: 'pcs', optional: true },
        { key: 'calc.sugar', amount: 90, unit: 'g', optional: true },
        { key: 'calc.msg', amount: 8, unit: 'g', optional: true },
        { key: 'calc.fish', amount: 38, unit: 'ml', optional: true },
        { key: 'calc.shrimp', amount: 30, unit: 'g', optional: true },
        { key: 'calc.scallion', amount: 5, unit: 'pcs', optional: true }
      ],
      noteKey: 'calc.note'
    },
    sauerkraut: {
      base: 2.5,
      items: [
        { key: 'calc.sk.salt', amount: 50, unit: 'g' },
        { key: 'calc.sk.juniper', amount: 5, unit: 'g' },
        { key: 'calc.sk.caraway', amount: 3, unit: 'g' },
        { key: 'calc.sk.bay', amount: 3, unit: 'pcs' },
        { key: 'calc.sk.pepper', amount: 5, unit: 'pcs' }
      ],
      noteKey: 'calc.sk.note'
    },
    paocai: {
      base: 2.5,
      items: [
        { key: 'calc.pc.salt', amount: 100, unit: 'g' },
        { key: 'calc.pc.sichuan', amount: 15, unit: 'g' },
        { key: 'calc.pc.chili', amount: 20, unit: 'g' },
        { key: 'calc.pc.ginger', amount: 30, unit: 'g' },
        { key: 'calc.pc.garlic', amount: 20, unit: 'g' },
        { key: 'calc.pc.baijiu', amount: 15, unit: 'ml' },
        { key: 'calc.pc.sugar', amount: 20, unit: 'g' },
        { key: 'calc.pc.water', amount: 1500, unit: 'ml' }
      ],
      noteKey: 'calc.pc.note'
    }
  };

  function initRecipeType() {
    var switchEl = document.getElementById('recipe-type-switch');
    if (!switchEl) return;

    switchEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.recipe-type-btn');
      if (!btn) return;
      var type = btn.getAttribute('data-recipe');
      setRecipeType(type);
    });
  }

  function setRecipeType(type) {
    if (!RECIPES[type]) return;
    currentRecipeType = type;

    document.querySelectorAll('.recipe-type-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-recipe') === type);
    });

    // Map recipe type to ferment model type and switch model
    var modelType = type === 'paocai' ? 'sichuan' : type;
    if (sim.models.setFermentType) {
      sim.models.setFermentType(modelType);
    }

    // Show/hide starter culture (only for kimchi)
    var starterItem = document.querySelector('.field-item:has(#input-starter-weight)');
    if (!starterItem) {
      // Fallback: find by slider
      var starterSlider = document.getElementById('slider-starter');
      if (starterSlider) starterItem = starterSlider.previousElementSibling;
    }

    // Toggle visibility of kimchi-specific fields
    var starterFields = document.querySelectorAll('.field-item');
    if (starterFields.length >= 2) {
      // Item 2 is starter culture — only show for kimchi
      starterFields[1].style.display = type === 'kimchi' ? '' : 'none';
    }

    updateCalcResults();

    // Re-run simulation with new ferment type parameters
    var params = sim.ui.getParams();
    var stg = sim.ui.getStages();
    runAndUpdate(params, stg, true);
  }

  // ─── Recipe Calculator ───
  function updateCalcResults() {
    var input = document.getElementById('calc-weight');
    var container = document.getElementById('calc-results');
    if (!input || !container) return;

    var weight = parseFloat(input.value) || 2.5;
    var recipe = RECIPES[currentRecipeType] || RECIPES.kimchi;
    var ratio = weight / recipe.base;
    var t = sim.i18n.t;
    var weightDisp = document.getElementById('fg-weight-display');
    if (weightDisp) weightDisp.textContent = weight;

    var html = '';
    var optionalStarted = false;
    for (var i = 0; i < recipe.items.length; i++) {
      var item = recipe.items[i];
      if (item.optional && !optionalStarted) {
        optionalStarted = true;
        html += '<div class="calc-section-label">' + t('calc.optional.label') + '</div>';
      }
      var scaled = item.amount * ratio;
      // Whole-piece units stay decimal (e.g. 0.5 apple); weights/volumes round to nearest int.
      var amount = (item.unit === 'pcs')
        ? (Math.round(scaled * 10) / 10).toString()
        : scaled.toFixed(0);
      var cls = 'calc-item' + (item.optional ? ' calc-item-optional' : '');
      html += '<div class="' + cls + '"><div class="calc-item-name">' + t(item.key) +
        '</div><div class="calc-item-amount">' + amount +
        '<span class="calc-item-unit"> ' + item.unit + '</span></div></div>';
    }
    html += '<div class="calc-note">' + t(recipe.noteKey) + '</div>';
    container.innerHTML = html;
  }

  // ─── Starter Culture Sync (weight ↔ percentage ↔ hidden slider) ───
  function initStarter() {
    var weightInput = document.getElementById('input-starter-weight');
    var pctInput = document.getElementById('input-starter-pct');
    var slider = document.getElementById('slider-starter');
    var cabbageInput = document.getElementById('calc-weight');
    if (!weightInput || !pctInput || !slider) return;

    function getCabbageG() {
      return (parseFloat(cabbageInput.value) || 2.5) * 1000;
    }

    weightInput.addEventListener('input', function () {
      var g = parseFloat(weightInput.value) || 0;
      var pct = (g / getCabbageG()) * 100;
      pctInput.value = Math.min(15, pct).toFixed(1);
      slider.value = Math.min(15, pct);
      slider.dispatchEvent(new Event('input'));
    });

    pctInput.addEventListener('input', function () {
      var pct = parseFloat(pctInput.value) || 0;
      pct = Math.min(15, pct);
      weightInput.value = Math.round(getCabbageG() * pct / 100);
      slider.value = pct;
      slider.dispatchEvent(new Event('input'));
    });

    if (cabbageInput) {
      cabbageInput.addEventListener('input', function () {
        var pct = parseFloat(pctInput.value) || 0;
        weightInput.value = Math.round(getCabbageG() * pct / 100);
      });
    }
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
    initStarter();
    initRecipeType();
    initUnitToggles();

    sim.ui.restoreSavedInputs();
    updateCalcResults();

    // "Start Calculation" button
    var calcBtn = document.getElementById('btn-calc-start');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        sim.ui.saveState();
        var p = sim.ui.getParams();
        var s = sim.ui.getStages();
        runAndUpdate(p, s, true);
        updateCalcResults();
      });
    }

    // Recipe link: scroll to recipe section + auto-expand
    var recipeLink = document.getElementById('link-recipe');
    if (recipeLink) {
      recipeLink.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById('section-recipe');
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () {
          if (target && !target.open) target.open = true;
        }, 400);
      });
    }

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
