/**
 * Kimchi Fermentation Navigator — Unified Chart
 * Soft Scientific UI: smooth spline, gradient fill, glowing optimal point
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.charts = (function () {
  'use strict';

  var chart = null;

  var DS = {
    FLAVOR: 0,
    NITRITE: 1,
    PH: 2,
    ACID: 3,
    LAB: 4,
    SAKEI: 5,
    MESEN: 6,
    PLANT: 7
  };

  var GROUPS = {
    flavor: [DS.FLAVOR],
    nitrite: [DS.NITRITE],
    ph: [DS.PH],
    acid: [DS.ACID],
    lab: [DS.LAB],
    microbes: [DS.SAKEI, DS.MESEN, DS.PLANT]
  };

  function t(key) {
    return window.KimchiSim.i18n.t(key);
  }

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

  function groupVisible(name) {
    var indices = GROUPS[name] || [];
    if (!chart || indices.length === 0) return false;
    return indices.every(function(idx) {
      return chart.isDatasetVisible(idx);
    });
  }

  function setGroupVisibility(name, visible) {
    var indices = GROUPS[name] || [];
    indices.forEach(function(idx) {
      chart.setDatasetVisibility(idx, visible);
    });
  }

  function formatCompact(days) {
    if (days < 1) return Math.round(days * 24) + 'h';
    return days < 10 ? days.toFixed(1) + 'd' : Math.round(days) + 'd';
  }

  function phaseLabelText(microbeKey, startDays, endDays) {
    return t('microbe.' + microbeKey + '.name') + '  ' + formatCompact(startDays) + '-' + formatCompact(endDays);
  }

  function applyAnnotationLabels() {
    if (!chart) return;
    var c = colors();
    var ann = chart.options.plugins.annotation.annotations;
    if (ann.excellent) ann.excellent.label.content = t('chart.excellent');
    if (ann.nitriteSafe) ann.nitriteSafe.label.content = t('chart.nitrite.safeLine');
    // Phase labels are set in update() with actual time values
  }

  function syncControlButtons() {
    if (!chart) return;
    var buttons = document.querySelectorAll('.chart-toggle');
    buttons.forEach(function(btn) {
      var key = btn.getAttribute('data-series');
      var active = groupVisible(key);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function syncAxisVisibility() {
    if (!chart) return;
    chart.options.scales.yPH.display = chart.isDatasetVisible(DS.PH) || chart.isDatasetVisible(DS.ACID);
    chart.options.scales.yLAB.display = chart.isDatasetVisible(DS.LAB);
    chart.options.scales.yNO2.display = chart.isDatasetVisible(DS.NITRITE);

    var ann = chart.options.plugins.annotation.annotations;
    if (ann.nitriteSafe) ann.nitriteSafe.display = chart.isDatasetVisible(DS.NITRITE);
  }

  function bindControls() {
    var buttons = document.querySelectorAll('.chart-toggle');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-series');
        if (!key || key === 'flavor' || !chart) return;
        setGroupVisibility(key, !groupVisible(key));
        syncAxisVisibility();
        syncControlButtons();
        chart.update('none');
      });
    });
  }

  // Glowing point plugin
  var glowPointPlugin = {
    id: 'glowPoint',
    afterDatasetsDraw: function(chart) {
      var meta = chart.getDatasetMeta(DS.FLAVOR);
      if (!meta || meta.hidden) return;
      var optTime = chart._kimchiOptimalTime;
      if (optTime == null) return;
      var xScale = chart.scales.x;
      var yScale = chart.scales.y;
      if (!xScale || !yScale) return;

      // Find closest data point to optimal time
      var data = meta.data;
      var closest = null;
      var minDist = Infinity;
      for (var i = 0; i < data.length; i++) {
        var pt = data[i];
        var raw = meta._parsed ? meta._parsed[i] : null;
        if (!raw) continue;
        var dist = Math.abs(raw.x - optTime);
        if (dist < minDist) { minDist = dist; closest = pt; }
      }
      if (!closest) return;

      var ctx = chart.ctx;
      var x = closest.x;
      var y = closest.y;
      var c = colors();

      // Outer glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = c.accent + '20';
      ctx.fill();

      // Mid glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = c.accent + '40';
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = c.accent;
      ctx.fill();

      // White center
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
    }
  };

  function init() {
    var c = colors();
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var gridColor = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.12)';

    Chart.register(glowPointPlugin);

    chart = new Chart(document.getElementById('flavor-chart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          /* 0: Flavor Score */
          {
            label: t('chart.score'),
            data: [],
            borderColor: c.accent,
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.4,
            yAxisID: 'y',
            fill: 'origin',
            backgroundColor: function(ctx) {
              var ch = ctx.chart;
              var area = ch.chartArea;
              if (!area) return c.accent + '15';
              var g = ch.ctx.createLinearGradient(0, area.top, 0, area.bottom);
              g.addColorStop(0, c.accent + '30');
              g.addColorStop(0.7, c.accent + '08');
              g.addColorStop(1, c.accent + '00');
              return g;
            }
          },
          /* 1: Nitrite */
          {
            label: t('chart.nitrite'),
            data: [],
            borderColor: c.orange,
            borderWidth: 1.8,
            pointRadius: 0,
            tension: 0.4,
            borderDash: [5, 3],
            fill: false,
            yAxisID: 'yNO2'
          },
          /* 2: pH */
          {
            label: t('chart.ph'),
            data: [],
            borderColor: c.blue,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            yAxisID: 'yPH',
            hidden: true
          },
          /* 3: Lactic Acid */
          {
            label: t('chart.acid'),
            data: [],
            borderColor: c.redMuted,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            borderDash: [5, 3],
            fill: false,
            yAxisID: 'yPH',
            hidden: true
          },
          /* 4: LAB count */
          {
            label: t('chart.lab'),
            data: [],
            borderColor: c.green,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            yAxisID: 'yLAB',
            hidden: true
          },
          /* 5-7: Microbe species */
          {
            label: t('microbe.sakei.name'),
            data: [],
            borderColor: c.orange,
            borderWidth: 1.6,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            yAxisID: 'y',
            hidden: true
          },
          {
            label: t('microbe.mesenteroides.name'),
            data: [],
            borderColor: c.teal,
            borderWidth: 1.6,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            yAxisID: 'y',
            hidden: true
          },
          {
            label: t('microbe.plantarum.name'),
            data: [],
            borderColor: c.purple,
            borderWidth: 1.6,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            yAxisID: 'y',
            hidden: true
          }
        ]
      },
      options: {
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
                return items[0].parsed.x.toFixed(1) + ' ' + t('unit.days');
              },
              label: function(ctx) {
                var v = ctx.parsed.y;
                var lbl = ctx.dataset.label;
                if (ctx.datasetIndex === DS.PH) return lbl + ': ' + v.toFixed(2);
                if (ctx.datasetIndex === DS.ACID) return lbl + ': ' + v.toFixed(2) + '%';
                if (ctx.datasetIndex === DS.LAB) return lbl + ': ' + v.toFixed(1) + ' log CFU/g';
                if (ctx.datasetIndex === DS.NITRITE) return lbl + ': ' + v.toFixed(1) + ' mg/kg';
                if (ctx.datasetIndex >= DS.SAKEI) return lbl + ': ' + v.toFixed(1) + '%';
                return lbl + ': ' + v.toFixed(1);
              }
            }
          },
          annotation: {
            annotations: {
              excellent: {
                type: 'box',
                yMin: 70, yMax: 100,
                backgroundColor: c.accent + '08',
                borderColor: c.accent + '18',
                borderWidth: 1,
                label: {
                  display: true, content: '',
                  position: { x: 'end', y: 'center' },
                  color: c.accent, font: { size: 10 }
                }
              },
              optLine: {
                type: 'line', scaleID: 'x', value: 0,
                borderColor: c.accent + 'AA',
                borderWidth: 2,
                borderDash: [6, 4]
              },
              nitriteSafe: {
                type: 'line', scaleID: 'yNO2', value: 3,
                borderColor: c.orange + '88',
                borderWidth: 1.5,
                borderDash: [4, 4],
                label: {
                  display: true, content: '',
                  position: 'start',
                  backgroundColor: c.orange + 'CC',
                  color: '#fff',
                  font: { size: 9 },
                  padding: 3
                }
              },
              phaseInitial: {
                type: 'box', xMin: 0, xMax: 0, yMin: 0, yMax: 8,
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderWidth: 0,
                label: {
                  display: true, content: '',
                  position: { x: 'center', y: 'center' },
                  color: 'rgba(59,130,246,0.7)',
                  font: { size: 9, weight: 'bold', family: 'Inter' }
                }
              },
              phaseOptimal: {
                type: 'box', xMin: 0, xMax: 0, yMin: 0, yMax: 8,
                backgroundColor: 'rgba(34,197,94,0.08)',
                borderWidth: 0,
                label: {
                  display: true, content: '',
                  position: { x: 'center', y: 'center' },
                  color: 'rgba(34,197,94,0.7)',
                  font: { size: 9, weight: 'bold', family: 'Inter' }
                }
              },
              phaseOver: {
                type: 'box', xMin: 0, xMax: 0, yMin: 0, yMax: 8,
                backgroundColor: 'rgba(245,158,11,0.08)',
                borderWidth: 0,
                label: {
                  display: true, content: '',
                  position: { x: 'center', y: 'center' },
                  color: 'rgba(180,120,0,0.7)',
                  font: { size: 9, weight: 'bold', family: 'Inter' }
                }
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear', min: 0,
            grid: { color: gridColor },
            ticks: {
              color: c.muted, font: { size: 10, family: 'Inter' },
              maxTicksLimit: 10,
              callback: function(v) { return v !== Math.floor(v) ? '' : v.toFixed(0); }
            },
            title: { display: true, text: t('chart.xaxis'), color: c.muted, font: { size: 10, family: 'Inter' } }
          },
          y: {
            position: 'left', min: 0, max: 100,
            grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 10 } },
            title: { display: false }
          },
          yNO2: {
            position: 'right', min: 0, max: 20, display: true,
            grid: { drawOnChartArea: false },
            ticks: { color: c.orange, font: { size: 9 } },
            title: { display: true, text: t('chart.axis.no2'), color: c.orange, font: { size: 9 } }
          },
          yPH: {
            position: 'left', min: 3.0, max: 6.5, display: false,
            grid: { drawOnChartArea: false },
            ticks: { color: c.blue, font: { size: 9 } },
            title: { display: true, text: t('chart.axis.ph'), color: c.blue, font: { size: 9 } }
          },
          yLAB: {
            position: 'right', min: 3, max: 10, display: false,
            grid: { drawOnChartArea: false },
            ticks: { color: c.green, font: { size: 9 } },
            title: { display: true, text: t('chart.lab'), color: c.green, font: { size: 9 } }
          }
        }
      }
    });

    applyAnnotationLabels();
    bindControls();
    syncAxisVisibility();
    syncControlButtons();
    chart.update('none');
  }

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

  function update(data) {
    if (!chart) return;

    var ds = chart.data.datasets;
    ds[DS.FLAVOR].data = toXY(data.timePoints, data.flavorScore);
    ds[DS.NITRITE].data = toXY(data.timePoints, data.nitrite);
    ds[DS.PH].data = toXY(data.timePoints, data.pH);
    ds[DS.ACID].data = toXY(data.timePoints, data.lacticAcid);
    ds[DS.LAB].data = toXY(data.timePoints, data.labCounts);
    ds[DS.SAKEI].data = toXY(data.timePoints, data.microbial.sakei);
    ds[DS.MESEN].data = toXY(data.timePoints, data.microbial.mesenteroides);
    ds[DS.PLANT].data = toXY(data.timePoints, data.microbial.plantarum);

    chart.options.scales.x.max = data.tMax;
    var nitriteMeta = data.nitriteMeta || {};
    var nitritePeak = nitriteMeta.peak ? nitriteMeta.peak.value : 0;
    var safeThreshold = nitriteMeta.safeThreshold || 3;
    chart.options.scales.yNO2.max = Math.max(8, Math.ceil((Math.max(nitritePeak, safeThreshold) + 2) / 2) * 2);

    var ann = chart.options.plugins.annotation.annotations;
    ann.optLine.value = data.optimalTime;
    ann.nitriteSafe.value = safeThreshold;

    // Phase bands with microbe names + time ranges directly on chart
    var p1End = data.phases.phase1End;
    var p2End = data.phases.phase2End;
    ann.phaseInitial.xMin = 0;
    ann.phaseInitial.xMax = p1End;
    ann.phaseInitial.label.content = phaseLabelText('sakei', 0, p1End);
    ann.phaseOptimal.xMin = p1End;
    ann.phaseOptimal.xMax = p2End;
    ann.phaseOptimal.label.content = phaseLabelText('mesenteroides', p1End, p2End);
    ann.phaseOver.xMin = p2End;
    ann.phaseOver.xMax = data.tMax;
    ann.phaseOver.label.content = phaseLabelText('plantarum', p2End, data.tMax);

    // Store optimal time for glow point plugin
    chart._kimchiOptimalTime = data.optimalTime;

    syncAxisVisibility();
    syncControlButtons();
    chart.update('none');
  }

  function updateLabels() {
    if (!chart) return;
    var c = colors();

    var isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
    var gColor = isDarkNow ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.12)';
    chart.options.scales.x.grid.color = gColor;
    chart.options.scales.y.grid.color = gColor;
    chart.options.scales.x.ticks.color = c.muted;
    chart.options.scales.y.ticks.color = c.muted;
    chart.options.scales.x.title.text = t('chart.xaxis');
    chart.options.scales.x.title.color = c.muted;
    chart.options.scales.yPH.title.text = t('chart.axis.ph');
    chart.options.scales.yNO2.title.text = t('chart.axis.no2');
    chart.options.scales.yLAB.title.text = t('chart.lab');

    chart.data.datasets[DS.FLAVOR].label = t('chart.score');
    chart.data.datasets[DS.FLAVOR].borderColor = c.accent;
    chart.data.datasets[DS.NITRITE].label = t('chart.nitrite');
    chart.data.datasets[DS.PH].label = t('chart.ph');
    chart.data.datasets[DS.ACID].label = t('chart.acid');
    chart.data.datasets[DS.LAB].label = t('chart.lab');
    chart.data.datasets[DS.SAKEI].label = t('microbe.sakei.name');
    chart.data.datasets[DS.MESEN].label = t('microbe.mesenteroides.name');
    chart.data.datasets[DS.PLANT].label = t('microbe.plantarum.name');

    applyAnnotationLabels();
    syncControlButtons();
    chart.update('none');
  }

  function setNowMarker(day) {
    if (!chart) return;
    var ann = chart.options.plugins.annotation.annotations;
    if (day === null || day === undefined) {
      if (ann.nowLine) ann.nowLine.display = false;
      chart.update('none');
      return;
    }
    var c = colors();
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ann.nowLine = {
      type: 'line', scaleID: 'x', value: day,
      borderColor: isDark ? '#94A3B8' : '#334155', borderWidth: 2.5, borderDash: [2, 2],
      display: true,
      label: {
        display: true, content: t('batch.now') || 'NOW',
        position: 'end',
        backgroundColor: isDark ? '#E2E8F0' : '#1E293B',
        color: isDark ? '#0F172A' : '#F8FAFC',
        font: { size: 10, weight: 'bold' }, padding: 4,
        borderRadius: 4
      }
    };
    chart.update('none');
  }

  return {
    init: init,
    update: update,
    updateLabels: updateLabels,
    setNowMarker: setNowMarker
  };
})();
