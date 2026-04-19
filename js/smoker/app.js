/**
 * Smoker Dynamics — UI controller (Mission Control).
 * Pregame → Cook → Score. Renders decision cards, phase flow, and ETA.
 */
(function () {
  'use strict';

  var C      = window.SmokerSim.constants;
  var Sim    = window.SmokerSim.simulator;
  var Dec    = window.SmokerSim.decisions;
  var Pre    = window.SmokerSim.presets;
  var MC     = window.SmokerSim.monteCarlo;

  // ---------- app state ----------
  var view = {
    screen:       'pregame',  // pregame | cook | score
    preset:       null,
    state:        null,
    chart:        null,
    running:      false,
    rafHandle:    null,
    lastWallMs:   0,
    simPerWallS:  3600,       // ×60 default
    history:      { samples: [] },     // for slope calc
    eta:          null,       // { p10, p50, p90, wallClockStr }
    dismissed:    {},         // card verdicts dismissed this session
    nowStarted:   null        // Date when cook started, for ETA wall-clock
  };

  // ---------- Utility ----------
  function $(id) { return document.getElementById(id); }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  var PHASE_META = {
    pregame:    { label: 'Getting ready',  tone: 'neutral', color: '--text-muted' },
    bark_build: { label: 'Smoking',        tone: 'active',  color: '--accent'     },
    stall:      { label: 'Stall',          tone: 'warn',    color: '--amber'      },
    wrap:       { label: 'Wrapped push',   tone: 'active',  color: '--blue'       },
    push:       { label: 'Finishing',      tone: 'active',  color: '--blue'       },
    rest:       { label: 'Resting',        tone: 'neutral', color: '--purple'     },
    slice:      { label: 'Sliced',         tone: 'done',    color: '--green-deep' }
  };

  function phaseMeta(state) {
    if (!state) return PHASE_META.pregame;
    var p = state.phase || 'pregame';
    // Augment bark_build with 'stall' if we detect the plateau
    if (p === 'bark_build' || p === 'push') {
      var n = state.T.length - 1;
      var coreF = C.cToF(state.T[n]);
      var slope = Dec.slopeFperMin(view.history, 10);
      if (coreF >= 145 && coreF <= 175 && slope < 0.4 && state.wrapState === 'none') {
        return Object.assign({}, PHASE_META.stall, { actual: 'stall' });
      }
      if (state.wrapState !== 'none' && p === 'push') return PHASE_META.wrap;
    }
    return PHASE_META[p] || PHASE_META.pregame;
  }

  // ---------- Pregame: preset picker ----------
  function renderPregame() {
    var grid = $('preset-grid');
    grid.innerHTML = '';
    Pre.list().forEach(function (p) {
      var card = document.createElement('button');
      card.className = 'preset-card';
      card.dataset.preset = p.id;
      card.innerHTML =
        '<div class="preset-icon">' + p.icon + '</div>' +
        '<div class="preset-name">' + p.name + '</div>' +
        '<div class="preset-tagline">' + p.tagline + '</div>';
      card.addEventListener('click', function () { pickPreset(p.id); });
      grid.appendChild(card);
    });
  }

  function pickPreset(id) {
    view.preset = Pre.get(id);
    show('cook');
    setupCook();
  }

  function show(screen) {
    view.screen = screen;
    $('screen-pregame').hidden = screen !== 'pregame';
    $('screen-cook').hidden    = screen !== 'cook';
    $('screen-score').hidden   = screen !== 'score';
  }

  // ---------- Cook: setup ----------
  function setupCook() {
    cancelAnimationFrame(view.rafHandle);
    view.running = false;
    view.lastWallMs = 0;
    view.history = { samples: [] };
    view.dismissed = {};
    view.nowStarted = null;

    // Build state from preset
    view.state = Sim.create(view.preset.inputs);
    view.state.damperPct = view.preset.policy.damperPct;

    // Chart
    if (!view.chart) view.chart = initChart();
    else resetChart();

    // Initial render
    updateUI();
    forecastETA();        // pregame ETA uses policy defaults
    $('btn-start').disabled = false;
    $('btn-pause').disabled = true;
  }

  // ---------- Cook: loop ----------
  function tick(now) {
    if (!view.running) return;
    if (!view.lastWallMs) view.lastWallMs = now;
    var dWall = (now - view.lastWallMs) / 1000;
    view.lastWallMs = now;
    var dSim = dWall * view.simPerWallS;
    if (dSim > 600) dSim = 600;

    Sim.step(view.state, dSim);
    pushHistorySample();
    pushChartSample();
    updateUI();

    // Re-forecast every ~60 sim-min
    if (!tick._lastForecast || view.state.tSimMin - tick._lastForecast > 60) {
      tick._lastForecast = view.state.tSimMin;
      forecastETA();
    }

    // Auto-stop
    if (view.state.C >= C.COLLAGEN_DONE && view.state.phase !== 'rest') {
      // Leave it running so user can see the "pull" decision card
    }
    if (view.state.phase === 'slice') { stopLoop(); showScore(); return; }
    if (view.state.tSimMin >= C.MAX_MINUTES) { stopLoop(); return; }

    view.rafHandle = requestAnimationFrame(tick);
  }

  function start() {
    if (!view.state) setupCook();
    view.simPerWallS = parseFloat($('in-speed').value) || 3600;
    view.running = true;
    view.nowStarted = view.nowStarted || new Date();
    view.lastWallMs = 0;
    $('btn-start').disabled = true;
    $('btn-pause').disabled = false;
    view.rafHandle = requestAnimationFrame(tick);
  }

  function pause() {
    view.running = false;
    cancelAnimationFrame(view.rafHandle);
    $('btn-start').disabled = false;
    $('btn-pause').disabled = true;
  }

  function stopLoop() {
    view.running = false;
    cancelAnimationFrame(view.rafHandle);
    $('btn-start').disabled = false;
    $('btn-pause').disabled = true;
  }

  function reset() {
    stopLoop();
    show('pregame');
    view.state = null;
  }

  // ---------- History buffer (for slope calc) ----------
  function pushHistorySample() {
    var n = view.state.T.length - 1;
    view.history.samples.push({
      t: view.state.tSimMin,
      coreF: C.cToF(view.state.T[n])
    });
    if (view.history.samples.length > 600) view.history.samples.shift();
  }

  // ---------- Render ----------
  function updateUI() {
    if (!view.state) return;
    var s = view.state;
    var n = s.T.length - 1;
    var coreF = C.cToF(s.T[n]);
    var pitF  = C.cToF(s.tPitC);
    var slope = Dec.slopeFperMin(view.history, 5);

    // Primary readouts
    $('pr-pit-val').textContent  = pitF.toFixed(0);
    $('pr-core-val').textContent = coreF.toFixed(0);
    $('pr-pit-sub').textContent  = pitSubtitle(s, pitF);
    $('pr-core-sub').textContent = coreSubtitle(slope);

    // Phase line
    var meta = phaseMeta(s);
    var dot  = $('phase-dot');
    dot.style.background = meta.color ? css(meta.color) : css('--text-muted');
    $('phase-name').textContent = meta.label;

    // Flow strip
    renderFlow(meta.actual || s.phase);

    // Clock
    $('sim-clock-val').textContent = minsToClock(s.tSimMin);
    $('damper-val').textContent = s.damperPct + '%';

    // Decision cards
    renderCards();

    // Timeline
    renderTimeline();
  }

  function pitSubtitle(state, pitF) {
    if (state.coals.length === 0) return 'unlit — light your fire';
    if (pitF > 320) return 'overshoot — close damper';
    if (pitF > 280) return 'hot';
    if (pitF < 190) return 'cold — add fuel';
    return 'stable';
  }

  function coreSubtitle(slope) {
    var arrow = slope > 0.3 ? '▲' : slope < -0.1 ? '▼' : '→';
    var sign = slope >= 0 ? '+' : '';
    return arrow + '  ' + sign + slope.toFixed(2) + ' °F/min';
  }

  function renderFlow(currentPhase) {
    var order = ['bark_build', 'stall', 'wrap', 'push', 'rest', 'slice'];
    document.querySelectorAll('#flow-strip .flow-step').forEach(function (el) {
      var step = el.dataset.step;
      el.classList.remove('current', 'done');
      if (step === currentPhase) el.classList.add('current');
      else if (order.indexOf(step) >= 0 && order.indexOf(step) < order.indexOf(currentPhase)) {
        el.classList.add('done');
      }
    });
  }

  function renderCards() {
    var cards = Dec.build(view.state, view.history).filter(function (c) {
      return !view.dismissed[c.verdict];
    });
    var stack = $('cards-stack');
    if (cards.length === 0) {
      stack.innerHTML = '<div class="card-empty">All quiet — keep pit steady and wait.</div>';
      return;
    }
    stack.innerHTML = cards.map(renderCard).join('');
    // Wire action buttons
    stack.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ev = btn.dataset.action;
        var verdict = btn.dataset.verdict;
        if (ev === 'dismiss') {
          view.dismissed[verdict] = true;
        } else {
          dispatchEvent(ev);
        }
        updateUI();
      });
    });
  }

  function renderCard(c) {
    var impact = c.impact ? Object.keys(c.impact).map(function (k) {
      return '<span class="impact-chip"><em>' + k + '</em>' + c.impact[k] + '</span>';
    }).join('') : '';
    var actions = (c.actions || []).map(function (a) {
      return '<button class="card-action" data-action="' + a.event + '" data-verdict="' + esc(c.verdict) + '">'
        + '<span>' + a.label + '</span>'
        + (a.hint ? '<em>' + a.hint + '</em>' : '')
        + '</button>';
    }).join('');
    return '<article class="dc dc-' + c.tier + '">'
      + '<header class="dc-header">'
      +   '<span class="dc-tier">' + tierGlyph(c.tier) + '</span>'
      +   '<h3 class="dc-verdict">' + esc(c.verdict) + '</h3>'
      + '</header>'
      + '<p class="dc-why">' + esc(c.why) + '</p>'
      + (impact ? '<div class="dc-impact">' + impact + '</div>' : '')
      + (actions ? '<div class="dc-actions">' + actions + '</div>' : '')
      + '</article>';
  }

  function tierGlyph(tier) {
    return {
      red:       '🛑',
      yellow:    '⚠',
      action:    '👉',
      recommend: '✨',
      headsup:   '👀',
      info:      'ℹ'
    }[tier] || '•';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function minsToClock(m) {
    var hh = Math.floor(m / 60);
    var mm = Math.floor(m % 60);
    return hh + ':' + String(mm).padStart(2, '0');
  }

  // ---------- ETA forecast ----------
  function forecastETA() {
    try {
      var fc = MC.forecast(view.preset.inputs, {
        igniteN: view.preset.policy.igniteN,
        damperPct: view.preset.policy.damperPct,
        refuelEveryMin: 45, refuelN: 4,
        autoWrap: view.preset.policy.wrapAt === 'auto',
        wrapType: view.preset.policy.wrapType
      }, 12);
      view.eta = fc;
      if (fc.P50 != null) {
        var p50 = Math.round(fc.P50);
        var pm  = Math.round((fc.P90 - fc.P10) / 2);
        var dateStr = '';
        if (view.nowStarted) {
          var end = new Date(view.nowStarted.getTime() + p50 * 60 * 1000);
          dateStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          dateStr = '+' + minsToClock(p50);
        }
        $('eta-value').textContent = dateStr;
        $('eta-range').textContent = '± ' + pm + ' min · ' + fc.confidence.toLowerCase() + ' confidence';
      }
    } catch (e) { /* ignore forecast errors during unstable state */ }
  }

  // ---------- Events ----------
  function dispatchEvent(ev) {
    var s = view.state;
    if (!s) return;
    switch (ev) {
      case 'ignite-6':  Sim.ignite(s, 6);  break;
      case 'ignite-8':  Sim.ignite(s, 8);  break;
      case 'ignite-12': Sim.ignite(s, 12); break;
      case 'refuel-3':  Sim.refuel(s, 3);  break;
      case 'refuel-6':  Sim.refuel(s, 6);  break;
      case 'wood':      Sim.addWood(s, 0.15, 'hickory'); break;
      case 'wrap-butcher_paper': Sim.wrap(s, 'butcher_paper'); break;
      case 'wrap-aluminum_foil': Sim.wrap(s, 'aluminum_foil'); break;
      case 'wrap-foil_boat':     Sim.wrap(s, 'foil_boat'); break;
      case 'wrap-none':          Sim.wrap(s, 'none'); break;
      case 'lid-30':             Sim.openLid(s, 30); break;
      case 'damper-up':
        s.damperPct = Math.min(100, s.damperPct + 10); break;
      case 'damper-down':
        s.damperPct = Math.max(0, s.damperPct - 10); break;
      case 'pull':  Sim.pull(s);  break;
      case 'slice': Sim.slice(s, view.preset.policy.restMethod); break;
    }
    updateUI();
    if (view.chart) view.chart.update('none');
  }

  function bindOverrideButtons() {
    document.querySelectorAll('.ev-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { dispatchEvent(btn.dataset.ev); });
    });
  }

  // ---------- Timeline ----------
  function renderTimeline() {
    var s = view.state;
    if (!s) return;
    var track = $('timeline-track');
    var axis  = $('timeline-axis');
    if (!track || !axis) return;
    var maxT = Math.max(s.tSimMin, 60);
    track.innerHTML = '';
    s.eventLog.forEach(function (e) {
      var el = document.createElement('div');
      el.className = 'tl-event tl-' + e.kind;
      el.style.left = (100 * e.t / maxT) + '%';
      el.title = e.kind + ' @ ' + e.t.toFixed(0) + 'min';
      el.textContent = glyphFor(e.kind);
      track.appendChild(el);
    });
    axis.innerHTML = '';
    var hours = Math.floor(maxT / 60);
    for (var h = 0; h <= hours; h++) {
      var tick = document.createElement('div');
      tick.className = 'tl-tick';
      tick.style.left = (100 * h * 60 / maxT) + '%';
      tick.textContent = h + 'h';
      axis.appendChild(tick);
    }
    var log = $('event-log');
    log.innerHTML = s.eventLog.slice().reverse().slice(0, 20).map(function (e) {
      return '<div class="log-row"><span class="log-t">'
        + e.t.toFixed(0) + 'min</span> ' + glyphFor(e.kind) + ' ' + e.kind + '</div>';
    }).join('');
  }

  function glyphFor(kind) {
    return {
      ignite: '🔥', refuel: '＋', wood: '🪵',
      wrap: '📜', lid: '↑', damper: '↕',
      pull: '🧺', slice: '🔪'
    }[kind] || '•';
  }

  // ---------- Chart ----------
  function initChart() {
    var canvas = $('chart-main');
    if (!canvas || !window.Chart) return null;
    var colors = {
      pit:  css('--red') || '#EF4444',
      core: css('--amber') || '#F59E0B',
      surf: css('--orange') || '#FB923C',
      w:    css('--blue') || '#3B82F6',
      c:    css('--purple') || '#8B5CF6',
      text: css('--text-muted') || '#94A3B8',
      grid: 'rgba(148, 163, 184, 0.12)'
    };
    var tickFont = { size: 11, family: 'Inter' };
    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          ds('T_pit',  colors.pit,  'yF', 2.5),
          ds('T_core', colors.core, 'yF', 2.5),
          ds('T_surf', colors.surf, 'yF', 1.5),
          ds('w',      colors.w,    'yFrac', 2, [4, 3]),
          ds('C',      colors.c,    'yFrac', 2, [2, 3])
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, parsing: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x:     { type: 'linear', min: 0, max: 60, title: { display: true, text: 'min' }, grid: { color: colors.grid }, ticks: { color: colors.text, font: tickFont, maxTicksLimit: 10 } },
          yF:    { position: 'left', min: 30, max: 500, title: { display: true, text: '°F' }, grid: { color: colors.grid }, ticks: { color: colors.text, font: tickFont } },
          yFrac: { position: 'right', min: 0, max: 1, title: { display: true, text: 'fraction' }, grid: { drawOnChartArea: false }, ticks: { color: colors.text, font: tickFont } }
        },
        plugins: {
          legend: { display: false },
          annotation: { annotations: {} }
        }
      }
    });
    function ds(label, color, axis, width, dash) {
      return { label: label, data: [], borderColor: color, backgroundColor: color + '20', borderWidth: width, borderDash: dash || [], pointRadius: 0, tension: 0.25, yAxisID: axis };
    }
  }

  function pushChartSample() {
    if (!view.chart || !view.state) return;
    var s = view.state;
    var n = s.T.length - 1;
    var t = s.tSimMin;
    view.chart.data.datasets[0].data.push({ x: t, y: C.cToF(s.tPitC) });
    view.chart.data.datasets[1].data.push({ x: t, y: C.cToF(s.T[n]) });
    view.chart.data.datasets[2].data.push({ x: t, y: C.cToF(s.T[0]) });
    view.chart.data.datasets[3].data.push({ x: t, y: s.w });
    view.chart.data.datasets[4].data.push({ x: t, y: s.C });
    if (view.chart.options.scales.x.max < t + 20) {
      view.chart.options.scales.x.max = Math.ceil((t + 20) / 60) * 60;
    }
    if (!pushChartSample._lastUpdate || Date.now() - pushChartSample._lastUpdate > 200) {
      view.chart.update('none');
      pushChartSample._lastUpdate = Date.now();
    }
  }

  function resetChart() {
    view.chart.data.datasets.forEach(function (d) { d.data.length = 0; });
    view.chart.options.plugins.annotation.annotations = {};
    view.chart.options.scales.x.max = 60;
    view.chart.update('none');
  }

  // ---------- Score ----------
  function showScore() {
    var s = view.state;
    if (!s) return;
    var done   = Math.min(1, s.C / C.COLLAGEN_DONE);
    var juicyW = s.wRetained != null ? s.wRetained : s.w;
    var juicy  = Math.max(0, Math.min(1, juicyW / 0.75));
    var bark   = Math.max(0, Math.min(1, 1 - (s.wSurface || 0)));
    var totalS = (s.smoke ? s.smoke.good + s.smoke.bad : 0) + 1e-9;
    var smoke  = s.smoke ? s.smoke.good / totalS : 0;
    var overall = Math.pow(Math.max(1e-3, done * juicy * bark * smoke), 0.25);

    $('sc-done').textContent    = done.toFixed(2);
    $('sc-juicy').textContent   = juicy.toFixed(2);
    $('sc-bark').textContent    = bark.toFixed(2);
    $('sc-smoke').textContent   = smoke.toFixed(2);
    $('sc-overall').textContent = overall.toFixed(2);

    var narrative = [];
    if (done < 0.8) narrative.push('Pulled before collagen was ready — tough flat is the result.');
    else narrative.push('Collagen fully rendered.');
    if (juicy < 0.7) narrative.push('Meat lost more moisture than ideal — consider shorter stall or longer rest next time.');
    else if (juicy > 0.85) narrative.push('Excellent moisture retention.');
    if (smoke < 0.7) narrative.push('Smoke was acrid — establish thin-blue flame before adding meat.');
    else narrative.push('Clean smoke throughout.');
    $('score-narrative').textContent = narrative.join(' ');

    show('score');
  }

  // ---------- Bootstrap ----------
  document.addEventListener('DOMContentLoaded', function () {
    renderPregame();
    bindOverrideButtons();
    $('btn-start').addEventListener('click', start);
    $('btn-pause').addEventListener('click', pause);
    $('btn-reset').addEventListener('click', reset);
    $('btn-again').addEventListener('click', reset);
    $('in-speed').addEventListener('change', function () {
      view.simPerWallS = parseFloat($('in-speed').value) || 3600;
    });
    show('pregame');
  });
})();
