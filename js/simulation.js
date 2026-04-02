/**
 * Kimchi Fermentation Simulation Engine
 * Multi-stage support with calibrated incremental model
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.simulation = (function () {
  'use strict';

  var models = null;
  function getModels() {
    if (!models) models = window.KimchiSim.models;
    return models;
  }

  function readNumber(value, fallback) {
    var num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  }

  /**
   * Run simulation with optional multi-stage temperature profile
   * @param {Object} params - { salt, starter, temperature (fallback) }
   * @param {Array|null} stages - [{ temperature, duration (hours) }, ...]
   */
  function run(params, stages) {
    var m = getModels();
    var salt = readNumber(params.salt, 2.5);
    var starter = readNumber(params.starter, 0);

    // Build stage list
    var stageList = [];
    if (stages && stages.length > 0) {
      for (var s = 0; s < stages.length; s++) {
        stageList.push({
          temperature: readNumber(stages[s].temperature, 10),
          duration: readNumber(stages[s].duration, 24)
        });
      }
    } else {
      var T = readNumber(params.temperature, 10);
      var autoOpt = m.optimalTime(T, salt, starter);
      stageList.push({
        temperature: T,
        duration: Math.max(72, autoOpt * 3 * 24) // at least 3 days
      });
    }

    // Total stage time in days (used for stage boundaries, not X-axis limit)
    var totalHours = 0;
    for (var i = 0; i < stageList.length; i++) totalHours += stageList[i].duration;
    var totalStageDays = totalHours / 24;

    // Simulate up to 90 days max — we'll trim after finding the over-sour point
    var tMaxDays = Math.min(90, Math.max(totalStageDays, 60));

    // Fine resolution: 0.02 days = ~29 minutes
    var dt = 0.02;
    var n = Math.ceil(tMaxDays / dt) + 1;
    if (n > 5000) { dt = tMaxDays / 5000; n = 5001; }

    // Result arrays
    var timePoints = [], labCounts = [], phValues = [], acidValues = [];
    var sakei = [], mesenteroides = [], plantarum = [];
    var flavorScores = [], tempProfile = [], nitriteValues = [];
    var nitrateValues = [], nitriteFormation = [], nitriteClearance = [];

    // Initial state
    var currentPH = m.effectiveInitialPH(starter);
    var pH_init = currentPH;
    var currentN = m.effectiveN0(starter);
    var nitriteState = m.initialNitriteState(salt, starter);
    var initialNitrate = nitriteState.nitrate;

    // Stage tracking
    var currentStageIdx = 0;
    var stageEndTime = stageList[0].duration / 24;
    var stageMarkers = [0];

    // Peak tracking
    var phase1End = -1, phase2End = -1;
    var peakFlavor = 0, peakFlavorTime = 0;
    var nitritePeak = nitriteState.nitrite, nitritePeakTime = 0;
    var riskStart = null, riskEnd = null;

    for (var i = 0; i < n; i++) {
      var t = i * dt;
      if (t > tMaxDays) break;

      // Advance stage if needed
      while (currentStageIdx < stageList.length - 1 && t >= stageEndTime) {
        currentStageIdx++;
        stageEndTime += stageList[currentStageIdx].duration / 24;
        stageMarkers.push(t);
      }

      var T = stageList[currentStageIdx].temperature;
      tempProfile.push(T);

      // Growth rate at current conditions
      var mu = m.growthRate(T, salt);
      var lambda = m.lagPhase(T, starter);

      // pH decay — incremental exponential toward pH_min
      // Derived from dPH/dt = -k * (pH - pH_min), solution: pH(t) = pH_min + (pH0-pH_min)*e^(-kt)
      var k_pH = m.kPH(T, salt);
      var pHDrop = k_pH * (currentPH - m.PARAMS.pH_min) * dt;
      currentPH = Math.max(m.PARAMS.pH_min, currentPH - pHDrop);

      // LAB growth — logistic with lag
      var growthCapacity = (m.PARAMS.N_max - currentN) / m.PARAMS.A_max;
      var lagFactor = 1.0;
      if (t < lambda && currentStageIdx === 0 && starter < 1) {
        lagFactor = Math.pow(t / lambda, 2); // smooth lag entry
      }
      var labIncrement = mu * growthCapacity * lagFactor * dt;
      currentN = Math.min(m.PARAMS.N_max, currentN + Math.max(0, labIncrement));

      // Lactic acid
      var currentAcid = m.lacticAcid(currentPH, pH_init);

      // Microbial composition
      var comp = m.microbialComposition(currentPH, starter);

      // Nitrite kinetics
      var nitriteSnapshot = m.nitriteStep(nitriteState, {
        temperature: T,
        pH: currentPH,
        labCount: currentN,
        starter: starter,
        composition: comp
      }, dt);
      var nitrite = nitriteSnapshot.nitrite;

      // Flavor score
      var score = m.flavorScore(currentPH, currentAcid, comp.mesenteroides);

      // Store results
      timePoints.push(t);
      labCounts.push(currentN);
      phValues.push(currentPH);
      acidValues.push(currentAcid);
      sakei.push(comp.sakei * 100);
      mesenteroides.push(comp.mesenteroides * 100);
      plantarum.push(comp.plantarum * 100);
      flavorScores.push(score);
      nitriteValues.push(nitrite);
      nitrateValues.push(nitriteSnapshot.nitrate);
      nitriteFormation.push(nitriteSnapshot.formationRate);
      nitriteClearance.push(nitriteSnapshot.clearanceRate);

      // Track peaks and phases
      if (score > peakFlavor) {
        peakFlavor = score;
        peakFlavorTime = t;
      }
      if (nitrite > nitritePeak) {
        nitritePeak = nitrite;
        nitritePeakTime = t;
      }
      if (riskStart === null && nitrite > m.PARAMS.nitrite_safe) riskStart = t;
      if (riskStart !== null && riskEnd === null && nitrite <= m.PARAMS.nitrite_safe && t > riskStart) riskEnd = t;
      if (phase1End < 0 && currentPH < 5.0) phase1End = t;
      if (phase2End < 0 && currentPH < 4.0) phase2End = t;
    }

    if (phase1End < 0) phase1End = tMaxDays;
    if (phase2End < 0) phase2End = tMaxDays;
    if (riskStart !== null && riskEnd === null) riskEnd = timePoints.length ? timePoints[timePoints.length - 1] : tMaxDays;

    // X-axis = 7 days after over-sour point (pH < 4.0), experience-based
    var displayMax = Math.ceil(phase2End + 7);
    if (riskEnd !== null) displayMax = Math.max(displayMax, Math.ceil(riskEnd + 1));
    displayMax = Math.max(displayMax, Math.ceil(nitritePeakTime + 2));
    displayMax = Math.max(displayMax, 3); // at least 3 days
    // Trim arrays to displayMax
    var trimIdx = timePoints.length;
    for (var i = 0; i < timePoints.length; i++) {
      if (timePoints[i] > displayMax) { trimIdx = i; break; }
    }
    timePoints = timePoints.slice(0, trimIdx);
    labCounts = labCounts.slice(0, trimIdx);
    phValues = phValues.slice(0, trimIdx);
    acidValues = acidValues.slice(0, trimIdx);
    sakei = sakei.slice(0, trimIdx);
    mesenteroides = mesenteroides.slice(0, trimIdx);
    plantarum = plantarum.slice(0, trimIdx);
    flavorScores = flavorScores.slice(0, trimIdx);
    nitriteValues = nitriteValues.slice(0, trimIdx);
    nitrateValues = nitrateValues.slice(0, trimIdx);
    nitriteFormation = nitriteFormation.slice(0, trimIdx);
    nitriteClearance = nitriteClearance.slice(0, trimIdx);
    tempProfile = tempProfile.slice(0, trimIdx);
    tMaxDays = displayMax;

    // Values at peak flavor time
    var optIdx = 0;
    for (var i = 0; i < timePoints.length; i++) {
      if (timePoints[i] >= peakFlavorTime) { optIdx = i; break; }
    }
    if (optIdx >= timePoints.length) optIdx = timePoints.length - 1;

    var optComp = m.microbialComposition(phValues[optIdx], starter);
    var dominant = 'Leuc. mesenteroides';
    var dominantKey = 'mesenteroides';
    if (optComp.sakei > optComp.mesenteroides && optComp.sakei > optComp.plantarum) {
      dominant = 'L. sakei';
      dominantKey = 'sakei';
    } else if (optComp.plantarum > optComp.mesenteroides) {
      dominant = 'L. plantarum';
      dominantKey = 'plantarum';
    }

    // Trend calculation at optimal point (derivative over ~0.5 day window)
    var trendWindow = Math.max(1, Math.round(0.5 / dt));
    var idxBefore = Math.max(0, optIdx - trendWindow);
    var idxAfter = Math.min(timePoints.length - 1, optIdx + trendWindow);
    function trend(arr) {
      var delta = arr[idxAfter] - arr[idxBefore];
      var span = timePoints[idxAfter] - timePoints[idxBefore];
      if (span === 0) return 0;
      return delta / span; // per day
    }

    return {
      timePoints: timePoints,
      labCounts: labCounts,
      pH: phValues,
      lacticAcid: acidValues,
      microbial: { sakei: sakei, mesenteroides: mesenteroides, plantarum: plantarum },
      flavorScore: flavorScores,
      nitrite: nitriteValues,
      tempProfile: tempProfile,
      stageMarkers: stageMarkers,
      optimalTime: peakFlavorTime,
      tMax: tMaxDays,
      phases: { phase1End: phase1End, phase2End: phase2End },
      atOptimal: {
        pH: phValues[optIdx] || 5.8,
        acid: acidValues[optIdx] || 0,
        lab: labCounts[optIdx] || 5,
        flavor: flavorScores[optIdx] || 0,
        dominant: dominant,
        dominantKey: dominantKey,
        composition: {
          sakei: optComp.sakei,
          mesenteroides: optComp.mesenteroides,
          plantarum: optComp.plantarum
        },
        nitrite: nitriteValues[optIdx] || 0,
        nitrate: nitrateValues[optIdx] || 0,
        trends: {
          pH: trend(phValues),
          acid: trend(acidValues),
          flavor: trend(flavorScores),
          nitrite: trend(nitriteValues),
          sakei: trend(sakei),
          mesenteroides: trend(mesenteroides),
          plantarum: trend(plantarum)
        }
      },
      peakFlavor: peakFlavor,
      peakFlavorTime: peakFlavorTime,
      nitriteMeta: {
        safeThreshold: m.PARAMS.nitrite_safe,
        cautionThreshold: m.PARAMS.nitrite_caution,
        initialNitrate: initialNitrate,
        peak: {
          value: nitritePeak,
          time: nitritePeakTime
        },
        riskWindow: {
          start: riskStart,
          end: riskEnd,
          duration: (riskStart !== null && riskEnd !== null) ? Math.max(0, riskEnd - riskStart) : 0
        },
        sodium: {
          mgKg: nitriteState.sodiumMgKg,
          molar: nitriteState.sodiumMolar
        },
        atOptimal: {
          nitrite: nitriteValues[optIdx] || 0,
          nitrate: nitrateValues[optIdx] || 0,
          formationRate: nitriteFormation[optIdx] || 0,
          clearanceRate: nitriteClearance[optIdx] || 0
        }
      }
    };
  }

  return { run: run };
})();
