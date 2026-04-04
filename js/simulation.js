/**
 * Fermentation Simulation Engine
 * Multi-stage, multi-ferment-type support
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
    var P = m.PARAMS;
    var salt = readNumber(params.salt, P.salt_optimal);
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
        duration: Math.max(72, autoOpt * 3 * 24)
      });
    }

    var totalHours = 0;
    for (var i = 0; i < stageList.length; i++) totalHours += stageList[i].duration;
    var totalStageDays = totalHours / 24;

    var tMaxDays = Math.min(90, Math.max(totalStageDays, 60));
    var dt = 0.02;
    var n = Math.ceil(tMaxDays / dt) + 1;
    if (n > 5000) { dt = tMaxDays / 5000; n = 5001; }

    // Species keys from profile
    var speciesKeys = [];
    for (var si = 0; si < P.species.length; si++) {
      speciesKeys.push(P.species[si].key);
    }

    // Result arrays
    var timePoints = [], labCounts = [], phValues = [], acidValues = [];
    var speciesArrays = {};
    for (var sk = 0; sk < speciesKeys.length; sk++) {
      speciesArrays[speciesKeys[sk]] = [];
    }
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

    // Phase thresholds adapt to ferment type
    var phase1Threshold = P.pH_initial - 0.8; // ~5.0 for kimchi, ~5.4 for sauerkraut
    var phase2Threshold = P.pH_min + 0.2;     // ~4.0 for kimchi, ~3.7 for sauerkraut

    for (var i = 0; i < n; i++) {
      var t = i * dt;
      if (t > tMaxDays) break;

      while (currentStageIdx < stageList.length - 1 && t >= stageEndTime) {
        currentStageIdx++;
        stageEndTime += stageList[currentStageIdx].duration / 24;
        stageMarkers.push(t);
      }

      var T = stageList[currentStageIdx].temperature;
      tempProfile.push(T);

      var mu = m.growthRate(T, salt);
      var lambda = m.lagPhase(T, starter);

      // pH decay
      var k_pH = m.kPH(T, salt);
      var pHDrop = k_pH * (currentPH - P.pH_min) * dt;
      currentPH = Math.max(P.pH_min, currentPH - pHDrop);

      // LAB growth
      var growthCapacity = (P.N_max - currentN) / P.A_max;
      var lagFactor = 1.0;
      if (t < lambda && currentStageIdx === 0 && starter < 1) {
        lagFactor = Math.pow(t / lambda, 2);
      }
      var labIncrement = mu * growthCapacity * lagFactor * dt;
      currentN = Math.min(P.N_max, currentN + Math.max(0, labIncrement));

      var currentAcid = m.lacticAcid(currentPH, pH_init);
      var comp = m.microbialComposition(currentPH, starter);

      // Nitrite kinetics
      var nitriteSnapshot = m.nitriteStep(nitriteState, {
        temperature: T, pH: currentPH, labCount: currentN,
        starter: starter, composition: comp
      }, dt);
      var nitrite = nitriteSnapshot.nitrite;

      // Flavor score
      var score = m.flavorScore(currentPH, currentAcid, comp);

      // Store results
      timePoints.push(t);
      labCounts.push(currentN);
      phValues.push(currentPH);
      acidValues.push(currentAcid);
      for (var sk = 0; sk < speciesKeys.length; sk++) {
        speciesArrays[speciesKeys[sk]].push((comp[speciesKeys[sk]] || 0) * 100);
      }
      flavorScores.push(score);
      nitriteValues.push(nitrite);
      nitrateValues.push(nitriteSnapshot.nitrate);
      nitriteFormation.push(nitriteSnapshot.formationRate);
      nitriteClearance.push(nitriteSnapshot.clearanceRate);

      if (score > peakFlavor) { peakFlavor = score; peakFlavorTime = t; }
      if (nitrite > nitritePeak) { nitritePeak = nitrite; nitritePeakTime = t; }
      if (riskStart === null && nitrite > P.nitrite_safe) riskStart = t;
      if (riskStart !== null && riskEnd === null && nitrite <= P.nitrite_safe && t > riskStart) riskEnd = t;
      if (phase1End < 0 && currentPH < phase1Threshold) phase1End = t;
      if (phase2End < 0 && currentPH < phase2Threshold) phase2End = t;
    }

    if (phase1End < 0) phase1End = tMaxDays;
    if (phase2End < 0) phase2End = tMaxDays;
    if (riskStart !== null && riskEnd === null) riskEnd = timePoints.length ? timePoints[timePoints.length - 1] : tMaxDays;

    var displayMax = Math.ceil(phase2End + 7);
    if (riskEnd !== null) displayMax = Math.max(displayMax, Math.ceil(riskEnd + 1));
    displayMax = Math.max(displayMax, Math.ceil(nitritePeakTime + 2));
    displayMax = Math.max(displayMax, 3);

    var trimIdx = timePoints.length;
    for (var i = 0; i < timePoints.length; i++) {
      if (timePoints[i] > displayMax) { trimIdx = i; break; }
    }

    timePoints = timePoints.slice(0, trimIdx);
    labCounts = labCounts.slice(0, trimIdx);
    phValues = phValues.slice(0, trimIdx);
    acidValues = acidValues.slice(0, trimIdx);
    for (var sk = 0; sk < speciesKeys.length; sk++) {
      speciesArrays[speciesKeys[sk]] = speciesArrays[speciesKeys[sk]].slice(0, trimIdx);
    }
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

    // Find dominant species
    var dominantKey = speciesKeys[0];
    var dominantVal = 0;
    for (var sk = 0; sk < speciesKeys.length; sk++) {
      var v = optComp[speciesKeys[sk]] || 0;
      if (v > dominantVal) { dominantVal = v; dominantKey = speciesKeys[sk]; }
    }

    // Trends
    var trendWindow = Math.max(1, Math.round(0.5 / dt));
    var idxBefore = Math.max(0, optIdx - trendWindow);
    var idxAfter = Math.min(timePoints.length - 1, optIdx + trendWindow);
    function trend(arr) {
      var delta = arr[idxAfter] - arr[idxBefore];
      var span = timePoints[idxAfter] - timePoints[idxBefore];
      return span === 0 ? 0 : delta / span;
    }

    var speciesTrends = {};
    for (var sk = 0; sk < speciesKeys.length; sk++) {
      speciesTrends[speciesKeys[sk]] = trend(speciesArrays[speciesKeys[sk]]);
    }

    // Build microbial data keyed by actual species
    var microbialData = {};
    for (var sk = 0; sk < speciesKeys.length; sk++) {
      microbialData[speciesKeys[sk]] = speciesArrays[speciesKeys[sk]];
    }

    return {
      fermentType: m.getFermentType(),
      speciesKeys: speciesKeys,
      timePoints: timePoints,
      labCounts: labCounts,
      pH: phValues,
      lacticAcid: acidValues,
      microbial: microbialData,
      flavorScore: flavorScores,
      nitrite: nitriteValues,
      tempProfile: tempProfile,
      stageMarkers: stageMarkers,
      optimalTime: peakFlavorTime,
      tMax: tMaxDays,
      phases: { phase1End: phase1End, phase2End: phase2End },
      atOptimal: {
        pH: phValues[optIdx] || P.pH_initial,
        acid: acidValues[optIdx] || 0,
        lab: labCounts[optIdx] || P.N0,
        flavor: flavorScores[optIdx] || 0,
        dominantKey: dominantKey,
        composition: optComp,
        nitrite: nitriteValues[optIdx] || 0,
        nitrate: nitrateValues[optIdx] || 0,
        trends: Object.assign({
          pH: trend(phValues),
          acid: trend(acidValues),
          flavor: trend(flavorScores),
          nitrite: trend(nitriteValues)
        }, speciesTrends)
      },
      peakFlavor: peakFlavor,
      peakFlavorTime: peakFlavorTime,
      nitriteMeta: {
        safeThreshold: P.nitrite_safe,
        cautionThreshold: P.nitrite_caution,
        initialNitrate: initialNitrate,
        peak: { value: nitritePeak, time: nitritePeakTime },
        riskWindow: {
          start: riskStart, end: riskEnd,
          duration: (riskStart !== null && riskEnd !== null) ? Math.max(0, riskEnd - riskStart) : 0
        },
        sodium: { mgKg: nitriteState.sodiumMgKg, molar: nitriteState.sodiumMolar },
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
