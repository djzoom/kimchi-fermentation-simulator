/**
 * Kimchi Fermentation Simulator — Unified Main Chart
 * Friendly defaults for broad audiences with optional deeper data layers.
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
      blue: css('--blue') || '#0047A0',
      green: css('--green') || '#2D6A4F',
      red: css('--red') || '#CD2E3A',
      yellow: css('--yellow') || '#D4A017',
      orange: css('--orange') || '#E07B39',
      teal: css('--teal') || '#2D9E8F',
      purple: css('--purple') || '#7B5EA7'
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

  function phaseBandLabel(phaseKey, microbeKey) {
    return t(phaseKey) + ' · ' + t('microbe.' + microbeKey + '.name');
  }

  function applyAnnotationLabels() {
    if (!chart) return;
    var c = colors();
    var ann = chart.options.plugins.annotation.annotations;
    ann.excellent.label.content = t('chart.excellent');
    ann.excellent.label.color = c.green;
    ann.phaseInitial.label.content = phaseBandLabel('phase.initial', 'sakei');
    ann.phaseOptimal.label.content = phaseBandLabel('phase.optimal', 'mesenteroides');
    ann.phaseOver.label.content = phaseBandLabel('phase.over', 'plantarum');
    ann.nitriteSafe.label.content = t('chart.nitrite.safeLine');
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
    ann.nitriteSafe.display = chart.isDatasetVisible(DS.NITRITE);
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

  function init() {
    var c = colors();
    var gridColor = c.border + '30';

    chart = new Chart(document.getElementById('flavor-chart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: t('chart.score'),
            data: [],
            borderColor: c.red,
            borderWidth: 2.8,
            pointRadius: 0,
            tension: 0.3,
            yAxisID: 'y',
            fill: 'origin',
            backgroundColor: function(ctx) {
              var ch = ctx.chart;
              var area = ch.chartArea;
              if (!area) return c.red + '20';
              var g = ch.ctx.createLinearGradient(0, area.top, 0, area.bottom);
              g.addColorStop(0, c.red + '38');
              g.addColorStop(1, c.red + '06');
              return g;
            }
          },
          {
            label: t('chart.nitrite'),
            data: [],
            borderColor: c.orange,
            borderWidth: 1.6,
            pointRadius: 0,
            tension: 0.3,
            borderDash: [4, 3],
            fill: false,
            yAxisID: 'yNO2'
          },
          {
            label: t('chart.ph'),
            data: [],
            borderColor: c.blue,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35,
            fill: false,
            yAxisID: 'yPH',
            hidden: true
          },
          {
            label: t('chart.acid'),
            data: [],
            borderColor: c.red + 'AA',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.35,
            borderDash: [5, 3],
            fill: false,
            yAxisID: 'yPH',
            hidden: true
          },
          {
            label: t('chart.lab'),
            data: [],
            borderColor: c.green,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35,
            fill: false,
            yAxisID: 'yLAB',
            hidden: true
          },
          {
            label: t('microbe.sakei.name'),
            data: [],
            borderColor: c.orange,
            borderWidth: 1.8,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            yAxisID: 'y',
            hidden: true
          },
          {
            label: t('microbe.mesenteroides.name'),
            data: [],
            borderColor: c.teal,
            borderWidth: 1.8,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            yAxisID: 'y',
            hidden: true
          },
          {
            label: t('microbe.plantarum.name'),
            data: [],
            borderColor: c.purple,
            borderWidth: 1.8,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
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
                yMin: 70,
                yMax: 100,
                backgroundColor: c.green + '10',
                borderColor: c.green + '25',
                borderWidth: 1,
                label: {
                  display: true,
                  content: '',
                  position: { x: 'end', y: 'center' },
                  color: c.green,
                  font: { size: 10 }
                }
              },
              optLine: {
                type: 'line',
                scaleID: 'x',
                value: 0,
                borderColor: c.green + 'BB',
                borderWidth: 2,
                borderDash: [6, 4]
              },
              phaseInitial: {
                type: 'box',
                xMin: 0,
                xMax: 0,
                yMin: 0,
                yMax: 8,
                backgroundColor: c.blue + '16',
                borderWidth: 0,
                label: {
                  display: true,
                  content: '',
                  position: { x: 'center', y: 'center' },
                  color: c.blue,
                  font: { size: 9, weight: 'bold' }
                }
              },
              phaseOptimal: {
                type: 'box',
                xMin: 0,
                xMax: 0,
                yMin: 0,
                yMax: 8,
                backgroundColor: c.green + '16',
                borderWidth: 0,
                label: {
                  display: true,
                  content: '',
                  position: { x: 'center', y: 'center' },
                  color: c.green,
                  font: { size: 9, weight: 'bold' }
                }
              },
              phaseOver: {
                type: 'box',
                xMin: 0,
                xMax: 0,
                yMin: 0,
                yMax: 8,
                backgroundColor: c.yellow + '18',
                borderWidth: 0,
                label: {
                  display: true,
                  content: '',
                  position: { x: 'center', y: 'center' },
                  color: '#9A7B00',
                  font: { size: 9, weight: 'bold' }
                }
              },
              nitriteSafe: {
                type: 'line',
                scaleID: 'yNO2',
                value: 3,
                borderColor: c.orange + 'AA',
                borderWidth: 1.5,
                borderDash: [4, 4],
                label: {
                  display: true,
                  content: '',
                  position: 'start',
                  backgroundColor: c.orange + 'DD',
                  color: '#fff',
                  font: { size: 9 },
                  padding: 3
                }
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            grid: { color: gridColor },
            ticks: {
              color: c.muted,
              font: { size: 11 },
              maxTicksLimit: 12,
              callback: function(v) {
                if (v !== Math.floor(v)) return '';
                return v.toFixed(0);
              }
            },
            title: { display: true, text: t('chart.xaxis'), color: c.text, font: { size: 11 } }
          },
          y: {
            position: 'left',
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 } },
            title: { display: true, text: t('chart.score') + ' / %', color: c.text, font: { size: 11 } }
          },
          yNO2: {
            position: 'right',
            min: 0,
            max: 20,
            display: true,
            grid: { drawOnChartArea: false },
            ticks: { color: c.orange, font: { size: 10 } },
            title: { display: true, text: t('chart.axis.no2'), color: c.orange, font: { size: 10 } }
          },
          yPH: {
            position: 'left',
            min: 3.0,
            max: 6.5,
            display: false,
            grid: { drawOnChartArea: false },
            ticks: { color: c.blue, font: { size: 10 } },
            title: { display: true, text: t('chart.axis.ph'), color: c.blue, font: { size: 10 } }
          },
          yLAB: {
            position: 'right',
            min: 3,
            max: 10,
            display: false,
            grid: { drawOnChartArea: false },
            ticks: { color: c.green, font: { size: 10 } },
            title: { display: true, text: t('chart.lab'), color: c.green, font: { size: 10 } }
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
    ann.phaseInitial.xMin = 0;
    ann.phaseInitial.xMax = data.phases.phase1End;
    ann.phaseOptimal.xMin = data.phases.phase1End;
    ann.phaseOptimal.xMax = data.phases.phase2End;
    ann.phaseOver.xMin = data.phases.phase2End;
    ann.phaseOver.xMax = data.tMax;
    ann.nitriteSafe.value = safeThreshold;

    syncAxisVisibility();
    syncControlButtons();
    chart.update('none');
  }

  function updateLabels() {
    if (!chart) return;
    var c = colors();

    chart.options.scales.x.grid.color = c.border + '30';
    chart.options.scales.y.grid.color = c.border + '30';
    chart.options.scales.x.ticks.color = c.muted;
    chart.options.scales.y.ticks.color = c.muted;
    chart.options.scales.x.title.text = t('chart.xaxis');
    chart.options.scales.x.title.color = c.text;
    chart.options.scales.y.title.text = t('chart.score') + ' / %';
    chart.options.scales.y.title.color = c.text;
    chart.options.scales.yPH.title.text = t('chart.axis.ph');
    chart.options.scales.yNO2.title.text = t('chart.axis.no2');
    chart.options.scales.yLAB.title.text = t('chart.lab');

    chart.data.datasets[DS.FLAVOR].label = t('chart.score');
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
    ann.nowLine = {
      type: 'line', scaleID: 'x', value: day,
      borderColor: c.text + 'CC', borderWidth: 2.5, borderDash: [2, 2],
      display: true,
      label: {
        display: true, content: t('batch.now') || 'NOW',
        position: 'end', backgroundColor: c.text + 'DD', color: c.text === '#1a1a1a' ? '#fff' : '#1a1a1a',
        font: { size: 10, weight: 'bold' }, padding: 4
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
