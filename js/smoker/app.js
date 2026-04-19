/**
 * Smoker Dynamics — UI controller.
 * Owns the sim loop, chart, event dispatch, and timeline rendering.
 */
(function () {
  'use strict';

  var C   = window.SmokerSim.constants;
  var Sim = window.SmokerSim.simulator;
  var Con = window.SmokerSim.constraints;

  var state = null;
  var chart = null;
  var rafHandle = null;
  var running = false;
  var simTimePerWallSec = 3600;            // ×60 default
  var lastWallMs = 0;
  var eventMarkers = [];                   // { tMin, kind, label }

  // ---------- Utility ----------
  function $(id) { return document.getElementById(id); }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  function readInputs() {
    return {
      protein:     'beef',
      grade:       $('in-grade').value,
      equipment:   $('in-equipment').value,
      weightLb:    parseFloat($('in-weight').value),
      thicknessIn: parseFloat($('in-thickness').value),
      tAmbF:       parseFloat($('in-tamb').value),
      humidityPct: parseFloat($('in-humid').value),
      windMph:     parseFloat($('in-wind').value),
      elevationFt: parseFloat($('in-elev').value),
      wrapType:    'none',
      tInitF:      40
    };
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

    var ch = new Chart(canvas.getContext('2d'), {
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
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            type: 'linear', min: 0, max: 60,
            title: { display: true, text: 'time (min)', color: colors.text, font: tickFont },
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: tickFont, maxTicksLimit: 10 }
          },
          yF: {
            position: 'left', min: 30, max: 500,
            title: { display: true, text: '°F', color: colors.text, font: tickFont },
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: tickFont }
          },
          yFrac: {
            position: 'right', min: 0, max: 1,
            title: { display: true, text: 'fraction', color: colors.text, font: tickFont },
            grid: { drawOnChartArea: false },
            ticks: { color: colors.text, font: tickFont }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { size: 12 }, bodyFont: { size: 12 },
            callbacks: {
              title: function (items) { return 't = ' + Math.round(items[0].parsed.x) + ' min'; },
              label: function (ctx) {
                var v = ctx.parsed.y;
                return ctx.dataset.label + ': ' + (v >= 10 ? v.toFixed(0) : v.toFixed(3));
              }
            }
          },
          annotation: { annotations: {} }
        }
      }
    });
    return ch;

    function ds(label, color, axis, width, dash) {
      return {
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: width,
        borderDash: dash || [],
        pointRadius: 0,
        tension: 0.25,
        yAxisID: axis
      };
    }
  }

  function pushSample() {
    if (!chart || !state) return;
    var n = state.T.length - 1;
    var t = state.tSimMin;
    var f = C.cToF;
    chart.data.datasets[0].data.push({ x: t, y: f(state.tPitC) });
    chart.data.datasets[1].data.push({ x: t, y: f(state.T[n]) });
    chart.data.datasets[2].data.push({ x: t, y: f(state.T[0]) });
    chart.data.datasets[3].data.push({ x: t, y: state.w });
    chart.data.datasets[4].data.push({ x: t, y: state.C });

    // Extend x-axis as the cook progresses
    if (chart.options.scales.x.max < t + 20) {
      chart.options.scales.x.max = Math.ceil((t + 20) / 60) * 60;
    }
  }

  function pushEventAnnotation(ev) {
    if (!chart) return;
    var key = 'e' + eventMarkers.length;
    chart.options.plugins.annotation.annotations[key] = {
      type: 'line',
      scaleID: 'x',
      value: ev.tMin,
      borderColor: 'rgba(148, 163, 184, 0.45)',
      borderWidth: 1,
      borderDash: [3, 3],
      label: {
        display: true,
        content: ev.label,
        position: 'start',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        color: '#fff',
        font: { size: 10 },
        padding: 3,
        yAdjust: 8 + 14 * (eventMarkers.length % 4)
      }
    };
  }

  // ---------- Readouts ----------
  function updateReadouts() {
    if (!state) return;
    var n = state.T.length - 1;
    $('r-pit').textContent  = C.cToF(state.tPitC).toFixed(0);
    $('r-core').textContent = C.cToF(state.T[n]).toFixed(0);
    $('r-surf').textContent = C.cToF(state.T[0]).toFixed(0);
    $('r-w').textContent    = state.w.toFixed(3);
    $('r-c').textContent    = state.C.toFixed(3);
    $('r-t').textContent    = state.tSimMin.toFixed(0);
    $('r-phase').textContent= state.phase;
  }

  // ---------- Timeline ----------
  function renderTimeline() {
    if (!state) return;
    var track = $('timeline-track');
    var axis  = $('timeline-axis');
    var maxT  = Math.max(state.tSimMin, 60);
    track.innerHTML = '';

    for (var i = 0; i < eventMarkers.length; i++) {
      var ev = eventMarkers[i];
      var node = document.createElement('div');
      node.className = 'tl-event tl-' + ev.kind;
      node.style.left = (100 * ev.tMin / maxT) + '%';
      node.title = ev.label + ' @ ' + ev.tMin.toFixed(0) + 'min';
      node.textContent = ev.icon || '•';
      track.appendChild(node);
    }
    // Axis hour ticks
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
    log.innerHTML = eventMarkers.slice().reverse().map(function (ev) {
      return '<div class="log-row"><span class="log-t">'
           + ev.tMin.toFixed(0) + 'min</span> '
           + (ev.icon || '•') + ' ' + ev.label + '</div>';
    }).join('');
  }

  function logEvent(kind, icon, label) {
    eventMarkers.push({ tMin: state.tSimMin, kind: kind, icon: icon, label: label });
    pushEventAnnotation({ tMin: state.tSimMin, label: label });
    renderTimeline();
  }

  // ---------- Alerts ----------
  function checkAlerts() {
    if (!state) return;
    var n = state.T.length - 1;
    var coreF = C.cToF(state.T[n]);
    var snap = {
      phase: state.phase,
      tPitC: state.tPitC,
      dTcoreDtCPerMin: 0,
      dangerZoneMin: state.dangerZoneMin || 0,
      justPulled: false,
      C: state.C,
      S_bad: state.smoke ? state.smoke.bad : 0,
      tSurfC: state.T[0],
      justWrapped: false,
      wSurface: state.wSurface || 1,
      qFireW: 100,
      qFirePeakNominal: 400,
      maxCoalProgress: 0.3,
      tCoreF: coreF,
      spritzPerHour: 0,
      lidOpenSec: state.lidOpenSec || 0
    };
    var alerts = Con.evaluate(snap);
    var card = $('alerts-card');
    var list = $('alerts-list');
    if (alerts.length === 0) { card.hidden = true; return; }
    card.hidden = false;
    list.innerHTML = alerts.map(function (a) {
      return '<li class="alert alert-' + a.tier + '">'
        + '<strong>' + a.id + '</strong> ' + a.label
        + (a.fix ? ' <em>→ ' + a.fix + '</em>' : '')
        + '</li>';
    }).join('');
  }

  // ---------- Event dispatch ----------
  function dispatch(ev) {
    if (!state) return;
    switch (ev) {
      case 'ignite-6':  Sim.ignite(state, 6);  logEvent('ignite', '🔥', 'Ignite 6'); break;
      case 'ignite-12': Sim.ignite(state, 12); logEvent('ignite', '🔥', 'Ignite 12'); break;
      case 'refuel-3':  Sim.refuel(state, 3);  logEvent('refuel', '＋', '+3 coals'); break;
      case 'refuel-6':  Sim.refuel(state, 6);  logEvent('refuel', '＋', '+6 coals'); break;
      case 'wood':      Sim.addWood(state, 0.15, 'hickory'); logEvent('wood', '🪵', 'Hickory chunk'); break;
      case 'wrap-paper':Sim.wrap(state, 'butcher_paper'); logEvent('wrap', '📜', 'Wrap: paper'); break;
      case 'wrap-foil': Sim.wrap(state, 'aluminum_foil'); logEvent('wrap', '🟦', 'Wrap: foil'); break;
      case 'wrap-none': Sim.wrap(state, 'none');          logEvent('wrap', '✂', 'Unwrap'); break;
      case 'lid-30':    Sim.openLid(state, 30);           logEvent('lid', '↑', 'Lid 30 s'); break;
      case 'damper-up':
        state.damperPct = Math.min(100, state.damperPct + 10);
        $('in-damper').value = state.damperPct;
        logEvent('damper', '▲', 'Damper ' + state.damperPct + '%'); break;
      case 'damper-down':
        state.damperPct = Math.max(0, state.damperPct - 10);
        $('in-damper').value = state.damperPct;
        logEvent('damper', '▼', 'Damper ' + state.damperPct + '%'); break;
      case 'pull':  Sim.pull(state);  logEvent('pull', '🧺', 'Pull'); running = false; pauseUI(); showScore(); break;
      case 'slice': Sim.slice(state, 'cooler'); logEvent('slice', '🔪', 'Slice'); showScore(); break;
    }
    updateReadouts();
    if (chart) chart.update('none');
  }

  function bindEventButtons() {
    document.querySelectorAll('.ev-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ev = btn.dataset.ev;
        if (ev === 'ignite') ev = 'ignite-' + btn.dataset.n;
        else if (ev === 'refuel') ev = 'refuel-' + btn.dataset.n;
        else if (ev === 'wrap')   ev = 'wrap-' + btn.dataset.type;
        else if (ev === 'lid')    ev = 'lid-' + btn.dataset.sec;
        dispatch(ev);
      });
    });
  }

  // ---------- Score ----------
  function showScore() {
    if (!state) return;
    var done   = Math.min(1, state.C / C.COLLAGEN_DONE);
    var juicyW = state.wRetained != null ? state.wRetained : state.w;
    var juicy  = Math.max(0, Math.min(1, juicyW / 0.75));
    var bark   = Math.max(0, Math.min(1, 1 - state.wSurface));
    var totalSmoke = (state.smoke ? state.smoke.good + state.smoke.bad : 0) + 1e-9;
    var smoke  = state.smoke ? state.smoke.good / totalSmoke : 0;
    var overall = Math.pow(done * juicy * bark * smoke, 0.25);
    $('score-card').hidden = false;
    $('sc-done').textContent   = done.toFixed(2);
    $('sc-juicy').textContent  = juicy.toFixed(2);
    $('sc-bark').textContent   = bark.toFixed(2);
    $('sc-smoke').textContent  = smoke.toFixed(2);
    $('sc-overall').textContent= overall.toFixed(2);
  }

  // ---------- Sim loop ----------
  function tick(now) {
    if (!running) return;
    if (!lastWallMs) lastWallMs = now;
    var dWall = (now - lastWallMs) / 1000;
    lastWallMs = now;
    var dSim = dWall * simTimePerWallSec;     // seconds of sim time
    if (dSim > 600) dSim = 600;               // guard against tab-switch gaps
    Sim.step(state, dSim);
    pushSample();
    updateReadouts();
    checkAlerts();

    // Throttle chart updates to every ~150 ms of wall time
    if (!tick._lastUpdate || now - tick._lastUpdate > 150) {
      chart.update('none');
      renderTimeline();
      tick._lastUpdate = now;
    }

    // Auto-stop at MAX_MINUTES
    if (state.tSimMin >= C.MAX_MINUTES) { running = false; pauseUI(); return; }
    rafHandle = requestAnimationFrame(tick);
  }

  function startUI() {
    $('btn-start').disabled = true;
    $('btn-pause').disabled = false;
  }
  function pauseUI() {
    $('btn-start').disabled = false;
    $('btn-pause').disabled = true;
  }

  // ---------- Lifecycle ----------
  function reset() {
    cancelAnimationFrame(rafHandle);
    running = false;
    lastWallMs = 0;
    eventMarkers = [];
    state = Sim.create(readInputs());
    state.damperPct = parseFloat($('in-damper').value) || 70;
    if (chart) {
      chart.data.datasets.forEach(function (d) { d.data.length = 0; });
      chart.options.plugins.annotation.annotations = {};
      chart.options.scales.x.max = 60;
      chart.update('none');
    }
    $('alerts-card').hidden = true;
    $('score-card').hidden = true;
    pauseUI();
    updateReadouts();
    renderTimeline();
  }

  function start() {
    if (!state) reset();
    simTimePerWallSec = parseFloat($('in-speed').value) || 3600;
    running = true;
    lastWallMs = 0;
    startUI();
    rafHandle = requestAnimationFrame(tick);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(rafHandle);
    pauseUI();
  }

  // ---------- Bootstrap ----------
  document.addEventListener('DOMContentLoaded', function () {
    chart = initChart();
    bindEventButtons();
    $('btn-start').addEventListener('click', start);
    $('btn-pause').addEventListener('click', pause);
    $('btn-reset').addEventListener('click', reset);
    $('in-speed').addEventListener('change', function () {
      simTimePerWallSec = parseFloat($('in-speed').value) || 3600;
    });
    reset();
  });
})();
