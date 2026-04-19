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
  var Notify = window.SmokerSim.notify;
  var CM     = window.SmokerSim.collagenModel;

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
    nowStarted:   null,       // Date when cook started, for ETA wall-clock
    lastVerdicts: [],         // previous render's card verdicts (for notify diff)
    demoMode:     false,      // demo/auto-run flag
    sparkPit:     [],         // rolling sparkline samples (60 points)
    sparkCore:    [],
    // A/B compare
    compare:      null        // { a: {preset, result}, b: {preset, result} }
  };

  // ---------- Utility ----------
  function $(id) { return document.getElementById(id); }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  // ---------- Persistence (localStorage) ----------
  var STORE_KEY = 'smoker.prefs.v1';
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function savePrefs(patch) {
    try {
      var cur = loadPrefs();
      Object.keys(patch).forEach(function (k) { cur[k] = patch[k]; });
      localStorage.setItem(STORE_KEY, JSON.stringify(cur));
    } catch (e) { /* quota / private mode */ }
  }

  var PHASE_META = {
    pregame:    { label: 'Getting ready', zh: '准备中', tone: 'neutral', color: '--text-muted' },
    bark_build: { label: 'Smoking',       zh: '烟熏',   tone: 'active',  color: '--accent'     },
    stall:      { label: 'Stall',         zh: '停滞期', tone: 'warn',    color: '--amber'      },
    wrap:       { label: 'Wrapped push',  zh: '包裹推进', tone: 'active',color: '--blue'       },
    push:       { label: 'Finishing',     zh: '收尾',   tone: 'active',  color: '--blue'       },
    rest:       { label: 'Resting',       zh: '静置',   tone: 'neutral', color: '--purple'     },
    slice:      { label: 'Sliced',        zh: '切片',   tone: 'done',    color: '--green-deep' }
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
  var PRESET_ZH = {
    texas:       { name: '德州牛胸肉',   tagline: '慢火 · 屠夫纸包裹 · 盐+黑胡椒' },
    competition: { name: '比赛级',       tagline: '注射 + 铝箔船 + 长静置（KCBS 评分规则）' },
    backyard:    { name: '家常快烤',     tagline: '猛火 + 铝箔 · 晚饭前搞定' },
    custom:      { name: '自定义',       tagline: '每个参数都能调' }
  };

  function renderPregame() {
    var grid = $('preset-grid');
    grid.innerHTML = '';
    Pre.list().forEach(function (p) {
      var zh = PRESET_ZH[p.id] || {};
      var card = document.createElement('button');
      card.className = 'preset-card';
      card.dataset.preset = p.id;
      card.innerHTML =
        '<div class="preset-icon">' + p.icon + '</div>' +
        '<div class="preset-name">' + p.name
          + (zh.name ? '<span class="zh">' + zh.name + '</span>' : '') + '</div>' +
        '<div class="preset-tagline">' + p.tagline
          + (zh.tagline ? '<span class="zh">' + zh.tagline + '</span>' : '') + '</div>';
      card.addEventListener('click', function () { pickPreset(p.id); });
      grid.appendChild(card);
    });
  }

  function pickPreset(id) {
    view.preset = Pre.get(id);
    savePrefs({ lastPreset: id });
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
    view.lastVerdicts = [];
    Notify.reset();
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

    // Sparklines (rolling 60-sample buffer)
    view.sparkPit.push(pitF);   if (view.sparkPit.length > 60) view.sparkPit.shift();
    view.sparkCore.push(coreF); if (view.sparkCore.length > 60) view.sparkCore.shift();
    drawSparkline('spark-pit',  view.sparkPit,  css('--red') || '#EF4444');
    drawSparkline('spark-core', view.sparkCore, css('--amber') || '#F59E0B');

    // Progress bar — based on (coreF vs target 203°F) capped
    var progress = Math.min(100, Math.max(0, ((coreF - 40) / (203 - 40)) * 100));
    $('progress-fill').style.width = progress + '%';

    // Phase line
    var meta = phaseMeta(s);
    var dot  = $('phase-dot');
    dot.style.background = meta.color ? css(meta.color) : css('--text-muted');
    $('phase-name').innerHTML = meta.label + '<em class="zh">' + (meta.zh || '') + '</em>';

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
    if (state.coals.length === 0) return 'unlit · 未点火 — light your fire';
    if (pitF > 320) return 'overshoot · 过热 — close damper';
    if (pitF > 280) return 'hot · 偏热';
    if (pitF < 190) return 'cold · 偏冷 — add fuel';
    return 'stable · 稳定';
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

    // Notify on new verdicts (diff against previous render)
    var prev = view.lastVerdicts || [];
    cards.forEach(function (c) {
      if (prev.indexOf(c.verdict) === -1) Notify.fireCard(c);
    });
    view.lastVerdicts = cards.map(function (c) { return c.verdict; });

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
      var labelHtml = esc(a.label) + (a.label_zh ? '<span class="zh">' + esc(a.label_zh) + '</span>' : '');
      var hintHtml = '';
      if (a.hint || a.hint_zh) {
        hintHtml = '<em>' + esc(a.hint || '') + (a.hint_zh ? ' · ' + esc(a.hint_zh) : '') + '</em>';
      }
      return '<button class="card-action" data-action="' + a.event + '" data-verdict="' + esc(c.verdict) + '">'
        + '<span>' + labelHtml + '</span>'
        + hintHtml
        + '</button>';
    }).join('');
    var verdictHtml = esc(c.verdict)
      + (c.verdict_zh ? '<span class="zh">' + esc(c.verdict_zh) + '</span>' : '');
    var whyHtml = esc(c.why)
      + (c.why_zh ? '<span class="zh">' + esc(c.why_zh) + '</span>' : '');
    return '<article class="dc dc-' + c.tier + '">'
      + '<header class="dc-header">'
      +   '<span class="dc-tier">' + tierGlyph(c.tier) + '</span>'
      +   '<h3 class="dc-verdict">' + verdictHtml + '</h3>'
      + '</header>'
      + '<p class="dc-why">' + whyHtml + '</p>'
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
      case 'spritz':             Sim.spritz(s, 30); break;
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

  // ---------- Sparkline ----------
  function drawSparkline(id, data, color) {
    var canvas = $(id);
    if (!canvas || data.length < 2) return;
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth || 120;
    var H = canvas.clientHeight || 32;
    if (canvas.width !== W * dpr) {
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var min = Math.min.apply(null, data) - 2;
    var max = Math.max.apply(null, data) + 2;
    var span = Math.max(1, max - min);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i < data.length; i++) {
      var x = (i / (data.length - 1)) * W;
      var y = H - 2 - ((data[i] - min) / span) * (H - 4);
      if (i === 0) ctx.moveTo(x, y);
      else         ctx.lineTo(x, y);
    }
    ctx.stroke();
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
    if (s.kSafety != null) {
      if (s.kSafety >= 7) narrative.push('Food-safety: ' + s.kSafety.toFixed(1) + '-log pathogen reduction — over the 7-log USDA target.');
      else if (s.kSafety >= 4) narrative.push('Food-safety: ' + s.kSafety.toFixed(1) + '-log reduction (partial). Consider a hotter finish on future cooks.');
      else narrative.push('⚠ Food-safety undercooked at surface (' + s.kSafety.toFixed(1) + '-log reduction, target ≥ 7).');
    }
    if (s.spritzCount > 0) narrative.push('Spritzed ' + s.spritzCount + '×.');
    $('score-narrative').textContent = narrative.join(' ');

    show('score');
  }

  // ═══════════════════════════════════════════════════════════════
  //  A/B Compare mode — headless simulation of two presets + diff
  // ═══════════════════════════════════════════════════════════════

  function openCompare() {
    show('compare');
    populateCompareSelectors();
  }

  function populateCompareSelectors() {
    var prefs = loadPrefs();
    var defaults = [prefs.cmpA || 'texas', prefs.cmpB || 'competition'];
    ['cmp-a-preset', 'cmp-b-preset'].forEach(function (id, idx) {
      var sel = $(id);
      sel.innerHTML = '';
      Pre.list().forEach(function (p) {
        if (p.id === 'custom') return;
        var o = document.createElement('option');
        o.value = p.id;
        o.textContent = p.icon + ' ' + p.name;
        sel.appendChild(o);
      });
      sel.value = defaults[idx] || sel.options[0].value;
      sel.addEventListener('change', function () {
        var patch = {};
        patch[idx === 0 ? 'cmpA' : 'cmpB'] = sel.value;
        savePrefs(patch);
      });
    });
  }

  function runCompare() {
    var idA = $('cmp-a-preset').value;
    var idB = $('cmp-b-preset').value;
    $('cmp-spinner').hidden = false;
    $('cmp-status-text').textContent = 'Running both cooks · 正在跑两场烤肉…';
    $('cmp-run').disabled = true;

    // Defer to next frame so the status message paints first
    setTimeout(function () {
      var resultA = simulateToEnd(Pre.get(idA));
      var resultB = simulateToEnd(Pre.get(idB));
      view.compare = {
        a: { preset: Pre.get(idA), result: resultA },
        b: { preset: Pre.get(idB), result: resultB }
      };
      renderCompareChart();
      renderCompareDiff();
      $('cmp-spinner').hidden = true;
      $('cmp-status-text').textContent = '';
      $('cmp-run').disabled = false;
    }, 50);
  }

  function simulateToEnd(preset) {
    var state = Sim.create(preset.inputs);
    state.damperPct = preset.policy.damperPct;
    Sim.ignite(state, preset.policy.igniteN);
    // Seed wood chunks
    (preset.policy.woodChunks || []).forEach(function (w) {
      if (w.tMin === 0) Sim.addWood(state, 0.15, w.species || 'hickory');
    });
    var woodIdx = 0;
    var refuelEvery = 45;
    var nextRefuel = refuelEvery;
    var pullAt = null, sliceAt = null;
    var samples = [];
    var targetRest = preset.policy.targetRestMin || 45;
    var wrapType = preset.policy.wrapType || 'butcher_paper';
    var autoWrap = preset.policy.wrapAt === 'auto';

    for (var t = 0; t < C.MAX_MINUTES * 60; t += 60) {
      // Timed wood chunks
      while (woodIdx < (preset.policy.woodChunks || []).length) {
        var w = preset.policy.woodChunks[woodIdx];
        if (w.tMin === 0) { woodIdx++; continue; }
        if (state.tSimMin >= w.tMin) {
          Sim.addWood(state, 0.15, w.species || 'hickory');
          woodIdx++;
        } else { break; }
      }
      // Refuel cadence
      if (state.tSimMin >= nextRefuel) {
        Sim.refuel(state, 4);
        nextRefuel += refuelEvery;
      }
      // Auto-wrap at 160°F
      if (autoWrap && state.wrapState === 'none') {
        var coreF = C.cToF(state.T[state.T.length - 1]);
        if (coreF >= 160) Sim.wrap(state, wrapType);
      }
      Sim.step(state, 60);
      samples.push({
        t: state.tSimMin,
        pitF:  C.cToF(state.tPitC),
        coreF: C.cToF(state.T[state.T.length - 1]),
        w:     state.w,
        C:     state.C
      });
      if (!pullAt && CM.isDone(state.C)) {
        pullAt = state.tSimMin;
        Sim.pull(state);
      }
      if (pullAt && state.tSimMin - pullAt >= targetRest) {
        Sim.slice(state, preset.policy.restMethod || 'cooler');
        sliceAt = state.tSimMin;
        break;
      }
    }

    // Score
    var done   = Math.min(1, state.C / C.COLLAGEN_DONE);
    var juicyW = state.wRetained != null ? state.wRetained : state.w;
    var juicy  = Math.max(0, Math.min(1, juicyW / 0.75));
    var bark   = Math.max(0, Math.min(1, 1 - (state.wSurface || 0)));
    var totalS = (state.smoke ? state.smoke.good + state.smoke.bad : 0) + 1e-9;
    var smoke  = state.smoke ? state.smoke.good / totalS : 0;
    var overall = Math.pow(Math.max(1e-3, done * juicy * bark * smoke), 0.25);

    return {
      samples: samples,
      pullMin: pullAt,
      sliceMin: sliceAt,
      scores: { done: done, juicy: juicy, bark: bark, smoke: smoke, overall: overall }
    };
  }

  function renderCompareChart() {
    var canvas = $('cmp-chart');
    if (!canvas || !window.Chart) return;
    if (renderCompareChart._chart) renderCompareChart._chart.destroy();
    var A = view.compare.a, B = view.compare.b;

    var colA = css('--red') || '#EF4444';
    var colB = css('--blue') || '#3B82F6';
    var text = css('--text-muted') || '#94A3B8';
    var grid = 'rgba(148, 163, 184, 0.12)';

    renderCompareChart._chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          ds('A · T_core', colA, A.result.samples, 'coreF'),
          ds('B · T_core', colB, B.result.samples, 'coreF'),
          ds('A · w',      colA, A.result.samples, 'w',   'yFrac', [4, 3]),
          ds('B · w',      colB, B.result.samples, 'w',   'yFrac', [4, 3])
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, parsing: false,
        plugins: { legend: { display: true, labels: { font: { size: 11 }, color: text } } },
        scales: {
          x:     { type: 'linear', min: 0, title: { display: true, text: 'min' }, grid: { color: grid }, ticks: { color: text, font: { size: 11 } } },
          yF:    { position: 'left',  min: 30, max: 220, title: { display: true, text: '°F' },       grid: { color: grid }, ticks: { color: text, font: { size: 11 } } },
          yFrac: { position: 'right', min: 0,  max: 1,   title: { display: true, text: 'fraction' }, grid: { drawOnChartArea: false }, ticks: { color: text, font: { size: 11 } } }
        }
      }
    });

    function ds(label, color, samples, key, axis, dash) {
      return {
        label: label,
        data: samples.map(function (s) { return { x: s.t, y: s[key] }; }),
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 2, borderDash: dash || [],
        pointRadius: 0, tension: 0.25,
        yAxisID: axis || 'yF'
      };
    }
  }

  function renderCompareDiff() {
    var A = view.compare.a, B = view.compare.b;
    var rA = A.result.scores, rB = B.result.scores;
    var eA = A.result.pullMin || 0, eB = B.result.pullMin || 0;

    function row(label, vA, vB, fmt, winBig) {
      var dA = fmt(vA), dB = fmt(vB);
      var delta = vB - vA;
      var winnerClass = (delta > 0 && winBig) || (delta < 0 && !winBig) ? 'B' : 'A';
      if (Math.abs(delta) < 1e-3) winnerClass = 'tie';
      var sign = delta > 0 ? '+' : '';
      var dDisp = fmt === fmtPct
        ? (sign + (delta * 100).toFixed(1) + ' pp')
        : (sign + fmt(Math.abs(delta)).replace(/^[^\d-]*/, (delta < 0 ? '−' : '')));
      return '<tr class="win-' + winnerClass + '">'
        + '<th>' + label + '</th>'
        + '<td class="a">' + dA + '</td>'
        + '<td class="b">' + dB + '</td>'
        + '<td class="d">' + dDisp + '</td>'
        + '</tr>';
    }
    function fmtTime(m) { return Math.floor(m/60) + 'h ' + String(Math.round(m%60)).padStart(2,'0') + 'm'; }
    function fmtPct(v) { return (v * 100).toFixed(0) + '%'; }

    var html =
      '<table class="cmp-table">'
      + '<thead><tr><th></th><th>A · ' + A.preset.name + '</th><th>B · ' + B.preset.name + '</th><th>Δ</th></tr></thead>'
      + '<tbody>'
      + row('Time to pull', eA, eB, fmtTime, false)  // shorter wins
      + row('Doneness',   rA.done,    rB.done,    fmtPct, true)
      + row('Juicy',      rA.juicy,   rB.juicy,   fmtPct, true)
      + row('Bark',       rA.bark,    rB.bark,    fmtPct, true)
      + row('Smoke',      rA.smoke,   rB.smoke,   fmtPct, true)
      + row('Overall',    rA.overall, rB.overall, fmtPct, true)
      + '</tbody></table>';
    $('cmp-diff').innerHTML = html;

    // Verdict sentence
    var verdict = summarise(A, B);
    $('cmp-verdict').textContent = verdict;
  }

  function summarise(A, B) {
    var rA = A.result.scores, rB = B.result.scores;
    var eA = A.result.pullMin || 0, eB = B.result.pullMin || 0;
    var dTime = Math.round(eB - eA);
    var dOverall = Math.round((rB.overall - rA.overall) * 100);
    var dJuicy   = Math.round((rB.juicy - rA.juicy) * 100);

    var parts = [];
    if (Math.abs(dOverall) < 2) parts.push('Near tie overall.');
    else if (dOverall > 0) parts.push('B (' + B.preset.name + ') wins by ' + dOverall + ' pp overall.');
    else parts.push('A (' + A.preset.name + ') wins by ' + (-dOverall) + ' pp overall.');
    if (dTime !== 0) {
      var faster = dTime > 0 ? A.preset.name : B.preset.name;
      parts.push(faster + ' is ' + Math.abs(dTime) + ' min faster.');
    }
    if (Math.abs(dJuicy) >= 3) {
      var juicier = dJuicy > 0 ? B.preset.name : A.preset.name;
      parts.push(juicier + ' is ' + Math.abs(dJuicy) + ' pp juicier.');
    }
    return parts.join(' ');
  }

  // ---------- Notify toggle ----------
  function updateNotifyToggle() {
    var btn = $('btn-notify');
    if (!btn) return;
    btn.textContent = Notify.isEnabled() ? '🔔 Alerts on' : '🔕 Alerts off';
    btn.classList.toggle('is-off', !Notify.isEnabled());
  }
  function toggleNotify() {
    Notify.toggle();
    updateNotifyToggle();
  }

  // ---------- Demo mode ----------
  function startDemo() {
    view.demoMode = true;
    view.preset = Pre.get('texas');
    savePrefs({ lastPreset: 'texas' });
    show('cook');
    setupCook();
    // Speed up to 300× so demo finishes in ~2 min of wall time
    $('in-speed').value = '18000';
    view.simPerWallS = 18000;
    // Auto-start after a short beat
    setTimeout(start, 400);
  }

  // ---------- Theme toggle ----------
  function applyTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      var icon = $('theme-icon'); if (icon) icon.textContent = '☀';
    } else {
      document.documentElement.removeAttribute('data-theme');
      var icon2 = $('theme-icon'); if (icon2) icon2.textContent = '🌙';
    }
    savePrefs({ theme: mode });
  }
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }
  function initTheme() {
    var prefs = loadPrefs();
    if (prefs.theme) applyTheme(prefs.theme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  }

  // ---------- Help modal ----------
  function showHelp()  { $('modal-help').hidden = false; }
  function hideHelp()  { $('modal-help').hidden = true;  }

  // ---------- Keyboard shortcuts ----------
  function bindKeyboard() {
    document.addEventListener('keydown', function (e) {
      // Skip if focus is in input/select/textarea
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          if (view.screen === 'cook') {
            e.preventDefault();
            view.running ? pause() : start();
          }
          break;
        case 'r': case 'R':
          if (view.screen === 'cook' || view.screen === 'score') reset();
          break;
        case 'w': case 'W':
          if (view.state && view.state.wrapState === 'none') dispatchEvent('wrap-butcher_paper');
          break;
        case 'f': case 'F':
          if (view.state && view.state.wrapState === 'none') dispatchEvent('wrap-aluminum_foil');
          break;
        case '+': case '=':
          if (view.state) dispatchEvent('refuel-3');
          break;
        case 's': case 'S':
          if (view.state) dispatchEvent('spritz');
          break;
        case 'd': case 'D':
          toggleTheme();
          break;
        case '?':
          showHelp();
          break;
        case 'Escape':
          if (!$('modal-help').hidden) hideHelp();
          break;
      }
    });
  }

  // ---------- Bootstrap ----------
  document.addEventListener('DOMContentLoaded', function () {
    renderPregame();
    bindOverrideButtons();
    $('btn-start').addEventListener('click', start);
    $('btn-pause').addEventListener('click', pause);
    $('btn-reset').addEventListener('click', reset);
    $('btn-again').addEventListener('click', reset);
    // Restore persisted prefs
    var prefs = loadPrefs();
    if (prefs.speed) {
      var sel = $('in-speed');
      if (sel) {
        // pick closest option
        var want = String(prefs.speed);
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === want) { sel.selectedIndex = i; break; }
        }
        view.simPerWallS = parseFloat(sel.value) || 3600;
      }
    }
    if (prefs.cmpA) {
      // restored lazily when compare screen opens
    }

    $('in-speed').addEventListener('change', function () {
      view.simPerWallS = parseFloat($('in-speed').value) || 3600;
      savePrefs({ speed: view.simPerWallS });
    });
    // Compare entry points
    var bCompare = $('btn-compare');
    if (bCompare) bCompare.addEventListener('click', openCompare);
    var bCmpBack = $('btn-cmp-back');
    if (bCmpBack) bCmpBack.addEventListener('click', function () { show('pregame'); });
    var bCmpRun = $('cmp-run');
    if (bCmpRun) bCmpRun.addEventListener('click', runCompare);
    // Notify
    var bNotify = $('btn-notify');
    if (bNotify) bNotify.addEventListener('click', toggleNotify);
    updateNotifyToggle();

    // Demo mode
    var bDemo = $('btn-demo');
    if (bDemo) bDemo.addEventListener('click', startDemo);

    // Theme toggle
    initTheme();
    var bTheme = $('btn-theme');
    if (bTheme) bTheme.addEventListener('click', toggleTheme);

    // Help modal
    var bHelp = $('btn-help');
    var bModalClose = $('modal-close');
    var mBackdrop = $('modal-help');
    if (bHelp) bHelp.addEventListener('click', showHelp);
    if (bModalClose) bModalClose.addEventListener('click', hideHelp);
    if (mBackdrop) mBackdrop.addEventListener('click', function (e) {
      if (e.target === mBackdrop) hideHelp();
    });

    // Keyboard shortcuts
    bindKeyboard();

    show('pregame');
  });
})();
