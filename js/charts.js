/**
 * Kimchi Fermentation Navigator — Multi-Chart Stack
 * 4 independent Chart.js instances sharing the same x-axis (days)
 * 1. Flavor Score  2. pH + LAB  3. Microbe Succession  4. Nitrite
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.charts = (function () {
  'use strict';

  var charts = {};  // { flavor, phLab, microbes, nitrite }

  function t(key) { return window.KimchiSim.i18n.t(key); }

  function css(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';
  }

  function colors() {
    return {
      text: css('--text'),
      muted: css('--text-muted'),
      border: css('--border'),
      accent: css('--accent') || '#22C55E',
      blue: css('--blue') || '#3B82F6',
      green: css('--green-deep') || '#16A34A',
      red: css('--red') || '#EF4444',
      redMuted: css('--red-muted') || '#F87171',
      orange: css('--orange') || '#FB923C',
      amber: css('--amber') || '#F59E0B',
      teal: css('--teal') || '#14B8A6',
      purple: css('--purple') || '#8B5CF6'
    };
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function gridColor() {
    return isDark() ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.12)';
  }

  // ─── Shared helpers ───

  function toXY(timePoints, values) {
    var pts = [];
    var step = Math.max(1, Math.floor(timePoints.length / 500));
    for (var i = 0; i < timePoints.length; i += step) {
      pts.push({ x: timePoints[i], y: values[i] });
    }
    var last = timePoints.length - 1;
    if (pts.length === 0 || pts[pts.length - 1].x !== timePoints[last]) {
      pts.push({ x: timePoints[last], y: values[last] });
    }
    return pts;
  }

  var _pickleDate = null;

  function formatDateTick(dayValue) {
    if (!_pickleDate) return dayValue.toFixed(0);
    var d = new Date(_pickleDate.getTime() + dayValue * 86400000);
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return m + '/' + day;
  }

  function sharedXScale(c) {
    return {
      type: 'linear', min: 0,
      grid: { color: gridColor() },
      ticks: {
        color: c.muted, font: { size: 10, family: 'Inter' },
        maxTicksLimit: 10,
        callback: function(v) {
          if (v !== Math.floor(v)) return '';
          return formatDateTick(v);
        }
      },
      title: { display: false }
    };
  }

  var Y_AXIS_WIDTH = 38; // fixed width for all left Y-axes to ensure x-axis alignment

  function sharedOpts(c, extraScales, extraAnnotations) {
    var scales = { x: sharedXScale(c) };
    if (extraScales) {
      for (var k in extraScales) {
        var s = extraScales[k];
        // Force consistent left Y-axis width (only for visible axes)
        if (s.position === 'left' && s.display !== false) {
          s.afterFit = function(axis) { axis.width = Y_AXIS_WIDTH; };
        }
        scales[k] = s;
      }
    }
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          titleColor: '#E2E8F0',
          bodyColor: '#CBD5E1',
          borderColor: 'rgba(148,163,184,0.2)',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 10,
          titleFont: { family: 'Inter', size: 11, weight: '600' },
          bodyFont: { family: 'JetBrains Mono', size: 11 },
          callbacks: {
            title: function(items) {
              var dayVal = items[0].parsed.x;
              var line1 = dayVal.toFixed(1) + ' ' + t('unit.days');
              if (!_pickleDate) return line1;
              var d = new Date(_pickleDate.getTime() + dayVal * 86400000);
              var lang = (window.KimchiSim.i18n && window.KimchiSim.i18n.getLang) ? window.KimchiSim.i18n.getLang() : 'en';
              var dateStr;
              if (lang === 'zh') {
                dateStr = (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + d.getHours() + '时';
              } else if (lang === 'ko') {
                dateStr = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + d.getHours() + '시';
              } else if (lang === 'de') {
                dateStr = d.getDate() + '. ' + d.toLocaleString('de', { month: 'short' }) + ' ' + d.getHours() + ':00';
              } else {
                var mon = d.toLocaleString('en', { month: 'short' });
                dateStr = mon + ' ' + d.getDate() + ', ' + d.getHours() + ':00';
              }
              return [line1, dateStr];
            }
          }
        },
        annotation: { annotations: extraAnnotations || {} }
      },
      scales: scales
    };
  }

  // ─── Glow point plugin (for flavor chart) ───
  var glowPointPlugin = {
    id: 'glowPoint',
    afterDatasetsDraw: function(chart) {
      if (!chart._isFlavorChart) return;
      var meta = chart.getDatasetMeta(0);
      if (!meta || meta.hidden) return;
      var optTime = chart._kimchiOptimalTime;
      if (optTime == null) return;
      var data = meta.data;
      var closest = null, minDist = Infinity;
      for (var i = 0; i < data.length; i++) {
        var raw = meta._parsed ? meta._parsed[i] : null;
        if (!raw) continue;
        var dist = Math.abs(raw.x - optTime);
        if (dist < minDist) { minDist = dist; closest = data[i]; }
      }
      if (!closest) return;
      var ctx = chart.ctx;
      var x = closest.x, y = closest.y;
      var c = colors();
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.accent + '20'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = c.accent + '40'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = c.accent; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.restore();
    }
  };

  // ─── Chart 1: Flavor Score ───
  function initFlavor() {
    var c = colors();
    var canvas = document.getElementById('chart-flavor');
    if (!canvas) return null;

    var opts = sharedOpts(c, {
      y: {
        position: 'left', min: 0, max: 100,
        grid: { color: gridColor() },
        ticks: { color: c.muted, font: { size: 10 } },
        title: { display: true, text: t('chart.flavor.yaxis'), color: c.muted, font: { size: 9, family: 'Inter' } }
      }
    }, {
      excellent: {
        type: 'box', yMin: 70, yMax: 100,
        backgroundColor: c.accent + '08',
        borderColor: c.accent + '18', borderWidth: 1
      },
      optLine: {
        type: 'line', scaleID: 'x', value: 0,
        borderColor: c.accent + 'AA', borderWidth: 2, borderDash: [6, 4]
      }
    });

    opts.plugins.tooltip.callbacks.label = function(ctx) {
      return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1);
    };

    var ch = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [{
          label: t('chart.score'),
          data: [],
          borderColor: c.accent,
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.4,
          yAxisID: 'y',
          fill: 'origin',
          backgroundColor: function(ctx2) {
            var area = ctx2.chart.chartArea;
            if (!area) return c.accent + '15';
            var g = ctx2.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            g.addColorStop(0, c.accent + '30');
            g.addColorStop(0.7, c.accent + '08');
            g.addColorStop(1, c.accent + '00');
            return g;
          }
        }]
      },
      options: opts
    });
    ch._isFlavorChart = true;
    return ch;
  }

  // ─── Chart 2: pH + Lactic Acid ───
  function initPhLab() {
    var c = colors();
    var canvas = document.getElementById('chart-ph-lab');
    if (!canvas) return null;

    var opts = sharedOpts(c, {
      yPH: {
        position: 'left', min: 3.0, max: 6.5, display: true,
        grid: { color: gridColor() },
        ticks: { color: c.blue, font: { size: 9 } },
        title: { display: false }
      },
      yAcid: {
        position: 'left', min: 0, max: 1.2, display: false,
        grid: { drawOnChartArea: false },
        ticks: { color: c.redMuted, font: { size: 9 }, callback: function(v) { return v.toFixed(1) + '%'; } },
        title: { display: false }
      }
    }, {
      phOptLine: {
        type: 'line', scaleID: 'yPH', value: 4.35,
        borderColor: c.blue + '66', borderWidth: 1.5, borderDash: [4, 4],
        label: {
          display: true, content: 'pH 4.35',
          position: 'end',
          backgroundColor: c.blue + 'CC', color: '#fff',
          font: { size: 9 }, padding: 3
        }
      },
      acidOptLine: {
        type: 'line', scaleID: 'yAcid', value: 0.6,
        borderColor: c.muted + '66', borderWidth: 1.5, borderDash: [4, 4],
        label: {
          display: true, content: '0.6%',
          position: 'start',
          backgroundColor: c.muted + 'CC', color: '#fff',
          font: { size: 9 }, padding: 3
        }
      }
    });

    opts.plugins.tooltip.callbacks.label = function(ctx) {
      var v = ctx.parsed.y;
      if (ctx.datasetIndex === 0) return ctx.dataset.label + ': ' + v.toFixed(2);
      if (ctx.datasetIndex === 1) return ctx.dataset.label + ': ' + v.toFixed(2) + '%';
      return ctx.dataset.label + ': ' + v.toFixed(2);
    };

    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: t('chart.ph'),
            data: [],
            borderColor: c.blue,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            yAxisID: 'yPH'
          },
          {
            label: t('chart.acid'),
            data: [],
            borderColor: c.muted,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            borderDash: [5, 3],
            fill: false,
            yAxisID: 'yAcid'
          }
        ]
      },
      options: opts
    });
  }

  // ─── Chart 3: Microbial Succession ───
  function initMicrobes() {
    var c = colors();
    var canvas = document.getElementById('chart-microbes');
    if (!canvas) return null;

    var opts = sharedOpts(c, {
      y: {
        position: 'left', min: 0, max: 100,
        grid: { color: gridColor() },
        ticks: {
          color: c.muted, font: { size: 9 },
          callback: function(v) { return v + '%'; }
        },
        title: { display: false }
      }
    }, {
      mesoPeak: {
        type: 'box', yMin: 40, yMax: 100,
        backgroundColor: c.accent + '06',
        borderColor: c.accent + '12', borderWidth: 1,
        label: {
          display: true, content: 'Leuc. dominant',
          position: { x: 'end', y: 'center' },
          color: c.accent + '44', font: { size: 9 }
        }
      }
    });

    opts.plugins.tooltip.callbacks.label = function(ctx) {
      return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '%';
    };

    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: t('microbe.sakei.name'),
            data: [],
            borderColor: c.muted,
            borderWidth: 1.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: c.muted + '10',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: t('microbe.mesenteroides.name'),
            data: [],
            borderColor: c.accent,
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            backgroundColor: c.accent + '12',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: t('microbe.plantarum.name'),
            data: [],
            borderColor: c.muted,
            borderWidth: 1.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: c.muted + '10',
            tension: 0.4,
            yAxisID: 'y'
          }
        ]
      },
      options: opts
    });
  }

  // ─── Chart 4: Nitrite ───
  function initNitrite() {
    var c = colors();
    var canvas = document.getElementById('chart-nitrite');
    if (!canvas) return null;

    var opts = sharedOpts(c, {
      y: {
        position: 'left', min: 0, max: 8,
        grid: { color: gridColor() },
        ticks: { color: c.amber, font: { size: 9 } },
        title: { display: false }
      }
    }, {
      safeLine: {
        type: 'line', scaleID: 'y', value: 3,
        borderColor: c.amber + '88', borderWidth: 1.5, borderDash: [4, 4],
        label: {
          display: true, content: t('chart.nitrite.safeLine'),
          position: 'start',
          backgroundColor: c.amber + 'CC',
          color: '#fff',
          font: { size: 9 },
          padding: 3
        }
      }
    });

    // x-axis needs label on the bottom chart
    opts.scales.x.title = { display: true, text: t('chart.xaxis'), color: c.muted, font: { size: 10, family: 'Inter' } };

    opts.plugins.tooltip.callbacks.label = function(ctx) {
      return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' mg/kg';
    };

    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [{
          label: t('chart.nitrite'),
          data: [],
          borderColor: c.amber,
          borderWidth: 1.8,
          pointRadius: 0,
          tension: 0.4,
          borderDash: [5, 3],
          fill: 'origin',
          backgroundColor: c.amber + '10',
          yAxisID: 'y'
        }]
      },
      options: opts
    });
  }

  // ─── Init all 4 charts ───
  function init() {
    Chart.register(glowPointPlugin);
    charts.flavor = initFlavor();
    charts.phLab = initPhLab();
    charts.microbes = initMicrobes();
    charts.nitrite = initNitrite();
  }

  // ─── Update all charts with simulation data ───
  function update(data) {
    var tp = data.timePoints;

    // Chart 1: Flavor with phase color zones
    if (charts.flavor) {
      var f = charts.flavor;
      var c = colors();
      f.data.datasets[0].data = toXY(tp, data.flavorScore);
      f.options.scales.x.max = data.tMax;
      var ann = f.options.plugins.annotation.annotations;
      ann.optLine.value = data.optimalTime;
      f._kimchiOptimalTime = data.optimalTime;

      // Phase zones
      var p1End = data.phases.phase1End;
      var p2End = data.phases.phase2End;
      ann.zoneInitial = {
        type: 'box', xMin: 0, xMax: p1End, yMin: 0, yMax: 100,
        backgroundColor: c.blue + '08', borderWidth: 0,
        label: { display: true, content: t('phase.initial'), position: { x: 'center', y: 'start' }, color: c.blue + '66', font: { size: 9 } }
      };
      ann.zoneOptimal = {
        type: 'box', xMin: p1End, xMax: p2End, yMin: 0, yMax: 100,
        backgroundColor: c.accent + '0A', borderWidth: 0,
        label: { display: true, content: t('phase.optimal'), position: { x: 'center', y: 'start' }, color: c.accent + '88', font: { size: 9, weight: 'bold' } }
      };
      ann.zoneOver = {
        type: 'box', xMin: p2End, xMax: data.tMax, yMin: 0, yMax: 100,
        backgroundColor: c.amber + '08', borderWidth: 0,
        label: { display: true, content: t('phase.over'), position: { x: 'center', y: 'start' }, color: c.amber + '66', font: { size: 9 } }
      };
      // Phase boundary lines
      ann.p1Line = { type: 'line', scaleID: 'x', value: p1End, borderColor: c.blue + '33', borderWidth: 1, borderDash: [3, 3] };
      ann.p2Line = { type: 'line', scaleID: 'x', value: p2End, borderColor: c.amber + '44', borderWidth: 1, borderDash: [3, 3] };

      f.update('none');
    }

    // Chart 2: pH + Lactic Acid
    if (charts.phLab) {
      var pl = charts.phLab;
      pl.data.datasets[0].data = toXY(tp, data.pH);
      pl.data.datasets[1].data = toXY(tp, data.lacticAcid);
      pl.options.scales.x.max = data.tMax;
      // pH 4.35 crossing vertical line
      var ph435t = null;
      for (var pi = 0; pi < tp.length; pi++) {
        if (data.pH[pi] <= 4.35) { ph435t = tp[pi]; break; }
      }
      var plAnn = pl.options.plugins.annotation.annotations;
      if (ph435t != null) {
        plAnn.ph435Line = {
          type: 'line', scaleID: 'x', value: ph435t,
          borderColor: colors().blue + '88', borderWidth: 1.5, borderDash: [4, 3]
        };
      } else {
        delete plAnn.ph435Line;
      }
      pl.update('none');
    }

    // Chart 3: Microbes
    if (charts.microbes) {
      var mb = charts.microbes;
      mb.data.datasets[0].data = toXY(tp, data.microbial.sakei);
      mb.data.datasets[1].data = toXY(tp, data.microbial.mesenteroides);
      mb.data.datasets[2].data = toXY(tp, data.microbial.plantarum);
      mb.options.scales.x.max = data.tMax;
      mb.update('none');
    }

    // Chart 4: Nitrite
    if (charts.nitrite) {
      var nr = charts.nitrite;
      nr.data.datasets[0].data = toXY(tp, data.nitrite);
      var nitriteMeta = data.nitriteMeta || {};
      var nitritePeak = nitriteMeta.peak ? nitriteMeta.peak.value : 0;
      var safeThreshold = nitriteMeta.safeThreshold || 3;
      nr.options.scales.y.max = Math.max(8, Math.ceil((Math.max(nitritePeak, safeThreshold) + 2) / 2) * 2);
      nr.options.scales.x.max = data.tMax;
      var nann = nr.options.plugins.annotation.annotations;
      nann.safeLine.value = safeThreshold;
      nr.update('none');
    }

    // Apply milestone markers across all charts
    applyMilestones();
    // Re-update all to render milestone lines
    if (charts.flavor) charts.flavor.update('none');
    if (charts.phLab) charts.phLab.update('none');
    if (charts.microbes) charts.microbes.update('none');
    if (charts.nitrite) charts.nitrite.update('none');
  }

  // ─── Update labels (language / theme switch) ───
  function updateLabels() {
    var c = colors();
    var gc = gridColor();

    // Flavor
    if (charts.flavor) {
      var f = charts.flavor;
      f.options.scales.x.grid.color = gc;
      f.options.scales.y.grid.color = gc;
      f.options.scales.x.ticks.color = c.muted;
      f.options.scales.y.ticks.color = c.muted;
      f.data.datasets[0].label = t('chart.score');
      f.data.datasets[0].borderColor = c.accent;
      f.options.scales.y.title.text = t('chart.flavor.yaxis');
      f.options.scales.y.title.color = c.muted;
      f.update('none');
    }

    // pH + Acid
    if (charts.phLab) {
      var pl = charts.phLab;
      pl.options.scales.x.grid.color = gc;
      pl.options.scales.yPH.grid.color = gc;
      pl.options.scales.x.ticks.color = c.muted;
      pl.options.scales.yPH.ticks.color = c.blue;
      pl.options.scales.yAcid.ticks.color = c.muted;
      pl.data.datasets[0].label = t('chart.ph');
      pl.data.datasets[1].label = t('chart.acid');
      pl.update('none');
    }

    // Microbes
    if (charts.microbes) {
      var mb = charts.microbes;
      mb.options.scales.x.grid.color = gc;
      mb.options.scales.y.grid.color = gc;
      mb.options.scales.x.ticks.color = c.muted;
      mb.options.scales.y.ticks.color = c.muted;
      mb.data.datasets[0].label = t('microbe.sakei.name');
      mb.data.datasets[1].label = t('microbe.mesenteroides.name');
      mb.data.datasets[2].label = t('microbe.plantarum.name');
      mb.update('none');
    }

    // Nitrite
    if (charts.nitrite) {
      var nr = charts.nitrite;
      nr.options.scales.x.grid.color = gc;
      nr.options.scales.y.grid.color = gc;
      nr.options.scales.x.ticks.color = c.muted;
      nr.options.scales.y.ticks.color = c.amber;
      nr.options.scales.x.title.text = t('chart.xaxis');
      nr.options.scales.x.title.color = c.muted;
      nr.data.datasets[0].label = t('chart.nitrite');
      var nann = nr.options.plugins.annotation.annotations;
      if (nann.safeLine) nann.safeLine.label.content = t('chart.nitrite.safeLine');
      nr.update('none');
    }
  }

  // ─── NOW marker (vertical line on all charts) ───
  function setNowMarker(day) {
    var chartList = [charts.flavor, charts.phLab, charts.microbes, charts.nitrite];
    for (var i = 0; i < chartList.length; i++) {
      var ch = chartList[i];
      if (!ch) continue;
      var ann = ch.options.plugins.annotation.annotations;
      if (day === null || day === undefined) {
        if (ann.nowLine) ann.nowLine.display = false;
      } else {
        var dk = isDark();
        ann.nowLine = {
          type: 'line', scaleID: 'x', value: day,
          borderColor: dk ? '#94A3B8' : '#334155', borderWidth: 2.5, borderDash: [2, 2],
          display: true,
          label: {
            display: i === 0, // only show label on top chart
            content: t('batch.now') || 'NOW',
            position: 'end',
            backgroundColor: dk ? '#E2E8F0' : '#1E293B',
            color: dk ? '#0F172A' : '#F8FAFC',
            font: { size: 10, weight: 'bold' }, padding: 4, borderRadius: 4
          }
        };
      }
      ch.update('none');
    }
  }

  function setPickleDate(date) {
    _pickleDate = date;
  }

  // ─── Milestone markers across all charts ───
  var _milestones = null;
  function setMilestones(m) {
    _milestones = m;
    applyMilestones();
    if (charts.flavor) charts.flavor.update('none');
    if (charts.phLab) charts.phLab.update('none');
    if (charts.microbes) charts.microbes.update('none');
    if (charts.nitrite) charts.nitrite.update('none');
  }

  function applyMilestones() {
    if (!_milestones) return;
    var c = colors();
    var chartList = [charts.flavor, charts.phLab, charts.microbes, charts.nitrite];
    var markers = [
      { key: 'safe', day: _milestones.safeDay, color: c.blue, dash: [3, 3], width: 1.2 },
      { key: 'best', day: _milestones.bestDay, color: c.accent, dash: [6, 3], width: 2 },
      { key: 'sour', day: _milestones.sourDay, color: c.amber, dash: [3, 3], width: 1.2 },
      { key: 'starter', day: _milestones.starterDay, color: '#8B5CF6', dash: [2, 4], width: 1 }
    ];

    // Draw vertical lines on all charts
    for (var ci = 0; ci < chartList.length; ci++) {
      var ch = chartList[ci];
      if (!ch) continue;
      var ann = ch.options.plugins.annotation.annotations;
      for (var mi = 0; mi < markers.length; mi++) {
        var mk = markers[mi];
        if (mk.day != null && mk.day > 0) {
          ann['ms_' + mk.key] = {
            type: 'line', scaleID: 'x', value: mk.day,
            borderColor: mk.color + '55', borderWidth: mk.width, borderDash: mk.dash
          };
        }
      }
    }

    // Flavor chart: add labeled milestone annotations with descriptions
    if (charts.flavor) {
      var fann = charts.flavor.options.plugins.annotation.annotations;
      var labels = _milestones.labels || {};
      // Merge sour+starter into one label if same day
      var sourDay = _milestones.sourDay;
      var starterDay = _milestones.starterDay;
      var sourAndStarter = (sourDay && starterDay && Math.abs(sourDay - starterDay) < 0.5);

      // Label style helper — opaque pill with readable text
      var dk = isDark();
      var labelBg = dk ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)';
      var labelBorder = dk ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.25)';

      // Safe milestone
      if (_milestones.safeDay > 0 && labels.safe) {
        fann['ms_safe'] = {
          type: 'line', scaleID: 'x', value: _milestones.safeDay,
          borderColor: c.blue + '88', borderWidth: 1.2, borderDash: [3, 3],
          label: {
            display: true, content: labels.safe,
            position: 'start',
            backgroundColor: labelBg, color: c.blue,
            borderColor: labelBorder, borderWidth: 1,
            font: { size: 9 }, padding: { top: 3, bottom: 3, left: 6, right: 6 },
            borderRadius: 4, yAdjust: 4
          }
        };
      }

      // Best milestone
      if (_milestones.bestDay > 0 && labels.best) {
        fann['ms_best'] = {
          type: 'line', scaleID: 'x', value: _milestones.bestDay,
          borderColor: c.accent + '88', borderWidth: 2, borderDash: [6, 3],
          label: {
            display: true, content: labels.best,
            position: 'start',
            backgroundColor: labelBg, color: c.accent,
            borderColor: labelBorder, borderWidth: 1,
            font: { size: 9, weight: 'bold' }, padding: { top: 3, bottom: 3, left: 6, right: 6 },
            borderRadius: 4, yAdjust: 28
          }
        };
      }

      // Sour + starter (combined or separate)
      if (sourDay > 0 && labels.sour) {
        var sourContent = sourAndStarter && labels.starter
          ? [labels.sour[0], labels.starter[0], labels.sour[1]]
          : labels.sour;
        fann['ms_sour'] = {
          type: 'line', scaleID: 'x', value: sourDay,
          borderColor: c.amber + '88', borderWidth: 1.2, borderDash: [3, 3],
          label: {
            display: true, content: sourContent,
            position: 'end',
            backgroundColor: labelBg, color: c.amber,
            borderColor: labelBorder, borderWidth: 1,
            font: { size: 9 }, padding: { top: 3, bottom: 3, left: 6, right: 6 },
            borderRadius: 4, yAdjust: 4
          }
        };
        // Remove separate starter line if merged
        if (sourAndStarter) delete fann['ms_starter'];
      }
    }
  }

  // ─── Animated update: progressively draw flavor curve ───
  var _animFrame = null;

  function animateUpdate(data) {
    // Cancel any running animation
    if (_animFrame) { cancelAnimationFrame(_animFrame); _animFrame = null; }

    var tp = data.timePoints;
    var fullData = toXY(tp, data.flavorScore);
    var totalPts = fullData.length;
    if (!charts.flavor || totalPts === 0) { update(data); return; }

    // Update non-flavor charts immediately (no animation)
    if (charts.phLab) {
      charts.phLab.data.datasets[0].data = toXY(tp, data.pH);
      charts.phLab.data.datasets[1].data = toXY(tp, data.lacticAcid);
      charts.phLab.options.scales.x.max = data.tMax;
      charts.phLab.update('none');
    }
    if (charts.microbes) {
      charts.microbes.data.datasets[0].data = toXY(tp, data.microbial.sakei);
      charts.microbes.data.datasets[1].data = toXY(tp, data.microbial.mesenteroides);
      charts.microbes.data.datasets[2].data = toXY(tp, data.microbial.plantarum);
      charts.microbes.options.scales.x.max = data.tMax;
      charts.microbes.update('none');
    }
    if (charts.nitrite) {
      charts.nitrite.data.datasets[0].data = toXY(tp, data.nitrite);
      var nitriteMeta = data.nitriteMeta || {};
      var nitritePeak = nitriteMeta.peak ? nitriteMeta.peak.value : 0;
      var safeThreshold = nitriteMeta.safeThreshold || 3;
      charts.nitrite.options.scales.y.max = Math.max(8, Math.ceil((Math.max(nitritePeak, safeThreshold) + 2) / 2) * 2);
      charts.nitrite.options.scales.x.max = data.tMax;
      charts.nitrite.update('none');
    }

    // Setup flavor chart scales/annotations but start with empty data
    var f = charts.flavor;
    var c = colors();
    f.options.scales.x.max = data.tMax;
    f._kimchiOptimalTime = data.optimalTime;
    var ann = f.options.plugins.annotation.annotations;
    ann.optLine.value = data.optimalTime;

    // Phase zones
    var p1End = data.phases.phase1End;
    var p2End = data.phases.phase2End;
    ann.zoneInitial = {
      type: 'box', xMin: 0, xMax: p1End, yMin: 0, yMax: 100,
      backgroundColor: c.blue + '08', borderWidth: 0,
      label: { display: false, content: t('phase.initial'), position: { x: 'center', y: 'start' }, color: c.blue + '66', font: { size: 9 } }
    };
    ann.zoneOptimal = {
      type: 'box', xMin: p1End, xMax: p2End, yMin: 0, yMax: 100,
      backgroundColor: c.accent + '0A', borderWidth: 0,
      label: { display: false, content: t('phase.optimal'), position: { x: 'center', y: 'start' }, color: c.accent + '88', font: { size: 9, weight: 'bold' } }
    };
    ann.zoneOver = {
      type: 'box', xMin: p2End, xMax: data.tMax, yMin: 0, yMax: 100,
      backgroundColor: c.amber + '08', borderWidth: 0,
      label: { display: false, content: t('phase.over'), position: { x: 'center', y: 'start' }, color: c.amber + '66', font: { size: 9 } }
    };
    ann.p1Line = { type: 'line', scaleID: 'x', value: p1End, borderColor: c.blue + '33', borderWidth: 1, borderDash: [3, 3] };
    ann.p2Line = { type: 'line', scaleID: 'x', value: p2End, borderColor: c.amber + '44', borderWidth: 1, borderDash: [3, 3] };

    // Clear milestone labels initially
    delete ann.ms_safe;
    delete ann.ms_best;
    delete ann.ms_sour;
    delete ann.ms_starter;

    // Animation parameters
    var duration = 1200; // ms
    var startTime = null;
    var phase1Shown = false, phase2Shown = false, phase3Shown = false;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min(1, (ts - startTime) / duration);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var count = Math.max(2, Math.round(eased * totalPts));
      var slice = fullData.slice(0, count);

      f.data.datasets[0].data = slice;

      // Show phase labels as curve reaches them
      var currentX = slice[slice.length - 1].x;
      if (!phase1Shown && currentX >= 0) {
        ann.zoneInitial.label.display = true;
        phase1Shown = true;
      }
      if (!phase2Shown && currentX >= p1End) {
        ann.zoneOptimal.label.display = true;
        phase2Shown = true;
      }
      if (!phase3Shown && currentX >= p2End) {
        ann.zoneOver.label.display = true;
        phase3Shown = true;
      }

      f.update('none');

      if (progress < 1) {
        _animFrame = requestAnimationFrame(step);
      } else {
        _animFrame = null;
        // Apply milestones after animation completes
        applyMilestones();
        f.update('none');
        if (charts.phLab) charts.phLab.update('none');
        if (charts.microbes) charts.microbes.update('none');
        if (charts.nitrite) charts.nitrite.update('none');
      }
    }

    f.data.datasets[0].data = [];
    f.update('none');
    _animFrame = requestAnimationFrame(step);
  }

  return {
    init: init,
    update: update,
    animateUpdate: animateUpdate,
    updateLabels: updateLabels,
    setNowMarker: setNowMarker,
    setPickleDate: setPickleDate,
    setMilestones: setMilestones
  };
})();
