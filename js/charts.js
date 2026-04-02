/**
 * Kimchi Fermentation Simulator — Chart.js Visualization
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.charts = (function () {
  'use strict';

  var mainChart = null, microbeChart = null, flavorChart = null;

  function t(key) { return window.KimchiSim.i18n.t(key); }

  function css(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#888';
  }

  function colors() {
    return {
      text: css('--text'), muted: css('--text-muted'), border: css('--border'),
      blue: css('--blue') || '#0047A0', green: css('--green') || '#2D6A4F',
      red: css('--red') || '#CD2E3A', yellow: css('--yellow') || '#D4A017',
      surface: css('--bg-surface') || '#fff'
    };
  }

  function init() {
    var c = colors();
    var gridColor = c.border + '30';

    // Main chart: pH, LAB, Lactic Acid
    mainChart = new Chart(document.getElementById('main-chart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          { label: 'pH', data: [], borderColor: c.blue, borderWidth: 2.5, pointRadius: 0, yAxisID: 'y1', tension: 0.35, fill: false },
          { label: t('chart.lab'), data: [], borderColor: c.green, borderWidth: 2, pointRadius: 0, yAxisID: 'y2', tension: 0.35, fill: false },
          { label: t('chart.acid'), data: [], borderColor: c.red, borderWidth: 2, pointRadius: 0, borderDash: [5, 3], yAxisID: 'y1', tension: 0.35, fill: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: c.text, usePointStyle: true, pointStyle: 'line', font: { size: 11 } } },
          tooltip: {
            callbacks: {
              title: function(items) { return items[0].parsed.x.toFixed(1) + ' ' + t('unit.days'); }
            }
          },
          annotation: {
            annotations: {
              optLine: { type: 'line', scaleID: 'x', value: 0,
                borderColor: c.green + 'BB', borderWidth: 2, borderDash: [6, 4],
                label: { display: true, content: t('chart.optimal'), position: 'start',
                  backgroundColor: c.green + 'DD', color: '#fff', font: { size: 10 } } }
            }
          }
        },
        scales: {
          x: { type: 'linear', min: 0, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 }, maxTicksLimit: 12,
              callback: function(v) { if (v !== Math.floor(v)) return ''; return v.toFixed(0); } },
            title: { display: true, text: t('chart.xaxis'), color: c.text, font: { size: 12 } } },
          y1: { position: 'left', min: 3.5, max: 6.5, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 } },
            title: { display: true, text: 'pH / ' + t('chart.acid'), color: c.text, font: { size: 11 } } },
          y2: { position: 'right', min: 3, max: 10, grid: { drawOnChartArea: false },
            ticks: { color: c.muted, font: { size: 11 } },
            title: { display: true, text: t('chart.lab'), color: c.text, font: { size: 11 } } }
        }
      }
    });

    // Microbe chart
    microbeChart = new Chart(document.getElementById('microbe-chart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          { label: 'L. sakei', data: [], borderColor: '#E07B39', backgroundColor: '#E07B3955', borderWidth: 1.5, pointRadius: 0, fill: 'origin', tension: 0.3, order: 3 },
          { label: 'Leuc. mesenteroides', data: [], borderColor: '#2D9E8F', backgroundColor: '#2D9E8F55', borderWidth: 1.5, pointRadius: 0, fill: '-1', tension: 0.3, order: 2 },
          { label: 'L. plantarum', data: [], borderColor: '#7B5EA7', backgroundColor: '#7B5EA755', borderWidth: 1.5, pointRadius: 0, fill: '-1', tension: 0.3, order: 1 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: c.text, usePointStyle: true, pointStyle: 'circle', font: { size: 10 } } },
          tooltip: {
            callbacks: {
              title: function(items) { return items[0].parsed.x.toFixed(1) + ' ' + t('unit.days'); },
              label: function(ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '%'; }
            }
          }
        },
        scales: {
          x: { type: 'linear', min: 0, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 }, maxTicksLimit: 12,
              callback: function(v) { if (v !== Math.floor(v)) return ''; return v.toFixed(0); } },
            title: { display: true, text: t('chart.xaxis'), color: c.text, font: { size: 11 } } },
          y: { stacked: true, min: 0, max: 100, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 } },
            title: { display: true, text: t('chart.proportion'), color: c.text, font: { size: 11 } } }
        }
      }
    });

    // Flavor chart
    flavorChart = new Chart(document.getElementById('flavor-chart').getContext('2d'), {
      type: 'line',
      data: {
        datasets: [{
          label: t('chart.score'), data: [],
          borderColor: c.red, borderWidth: 2.5, pointRadius: 0, tension: 0.3,
          fill: 'origin',
          backgroundColor: function(ctx) {
            var chart = ctx.chart; var area = chart.chartArea;
            if (!area) return c.red + '20';
            var g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            g.addColorStop(0, c.red + '40'); g.addColorStop(1, c.red + '05');
            return g;
          }
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function(items) { return items[0].parsed.x.toFixed(1) + ' ' + t('unit.days'); }
            }
          },
          annotation: {
            annotations: {
              excellent: { type: 'box', yMin: 70, yMax: 100,
                backgroundColor: c.green + '10', borderColor: c.green + '25', borderWidth: 1,
                label: { display: true, content: 'Excellent', position: { x: 'end', y: 'center' },
                  color: c.green, font: { size: 10 } } },
              optLine: { type: 'line', scaleID: 'x', value: 0,
                borderColor: c.green + 'BB', borderWidth: 2, borderDash: [6, 4] }
            }
          }
        },
        scales: {
          x: { type: 'linear', min: 0, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 }, maxTicksLimit: 12,
              callback: function(v) { if (v !== Math.floor(v)) return ''; return v.toFixed(0); } },
            title: { display: true, text: t('chart.xaxis'), color: c.text, font: { size: 11 } } },
          y: { min: 0, max: 100, grid: { color: gridColor },
            ticks: { color: c.muted, font: { size: 11 } },
            title: { display: true, text: t('chart.score'), color: c.text, font: { size: 11 } } }
        }
      }
    });
  }

  /**
   * Convert simulation data to {x, y} point arrays for linear scale
   */
  function toXY(timePoints, values) {
    var pts = [];
    // Downsample for performance (max ~500 points)
    var step = Math.max(1, Math.floor(timePoints.length / 500));
    for (var i = 0; i < timePoints.length; i += step) {
      pts.push({ x: timePoints[i], y: values[i] });
    }
    // Always include last point
    var last = timePoints.length - 1;
    if (pts.length === 0 || pts[pts.length - 1].x !== timePoints[last]) {
      pts.push({ x: timePoints[last], y: values[last] });
    }
    return pts;
  }

  function update(data) {
    if (!mainChart) return;

    // Main chart
    mainChart.data.datasets[0].data = toXY(data.timePoints, data.pH);
    mainChart.data.datasets[1].data = toXY(data.timePoints, data.labCounts);
    mainChart.data.datasets[2].data = toXY(data.timePoints, data.lacticAcid);
    mainChart.options.scales.x.max = data.tMax;
    mainChart.options.plugins.annotation.annotations.optLine.value = data.optimalTime;
    mainChart.update('none');

    // Microbe chart
    microbeChart.data.datasets[0].data = toXY(data.timePoints, data.microbial.sakei);
    microbeChart.data.datasets[1].data = toXY(data.timePoints, data.microbial.mesenteroides);
    microbeChart.data.datasets[2].data = toXY(data.timePoints, data.microbial.plantarum);
    microbeChart.options.scales.x.max = data.tMax;
    microbeChart.update('none');

    // Flavor chart
    flavorChart.data.datasets[0].data = toXY(data.timePoints, data.flavorScore);
    flavorChart.options.scales.x.max = data.tMax;
    flavorChart.options.plugins.annotation.annotations.optLine.value = data.optimalTime;
    flavorChart.update('none');
  }

  function updateLabels() {
    if (!mainChart) return;
    var c = colors();

    // Rebuild all charts with new theme colors and language
    [mainChart, microbeChart, flavorChart].forEach(function(chart) {
      if (!chart) return;
      Object.keys(chart.options.scales).forEach(function(key) {
        var s = chart.options.scales[key];
        if (s.ticks) s.ticks.color = c.muted;
        if (s.title) s.title.color = c.text;
        if (s.grid) s.grid.color = c.border + '30';
      });
      if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
        chart.options.plugins.legend.labels.color = c.text;
      }
    });

    mainChart.data.datasets[1].label = t('chart.lab');
    mainChart.data.datasets[2].label = t('chart.acid');
    mainChart.options.scales.x.title.text = t('chart.xaxis');
    mainChart.options.scales.y1.title.text = 'pH / ' + t('chart.acid');
    mainChart.options.scales.y2.title.text = t('chart.lab');
    if (mainChart.options.plugins.annotation.annotations.optLine.label) {
      mainChart.options.plugins.annotation.annotations.optLine.label.content = t('chart.optimal');
    }
    mainChart.update('none');

    microbeChart.options.scales.x.title.text = t('chart.xaxis');
    microbeChart.options.scales.y.title.text = t('chart.proportion');
    microbeChart.update('none');

    flavorChart.data.datasets[0].label = t('chart.score');
    flavorChart.options.scales.x.title.text = t('chart.xaxis');
    flavorChart.options.scales.y.title.text = t('chart.score');
    flavorChart.update('none');
  }

  return { init: init, update: update, updateLabels: updateLabels };
})();
