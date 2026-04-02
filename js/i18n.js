/**
 * Kimchi Fermentation Simulator — Internationalization
 * Trilingual: English (en) / Korean (ko) / Chinese (zh)
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.i18n = (function () {
  'use strict';

  var strings = {
    'app.title': {
      en: 'Kimchi Fermentation Simulator',
      ko: '김치 발효 시뮬레이터',
      zh: '韩式辣白菜发酵模拟器'
    },
    'app.subtitle': {
      en: 'Interactive scientific simulation based on Modified Gompertz & Arrhenius kinetic models',
      ko: '수정 Gompertz 및 Arrhenius 동역학 모델 기반 과학적 시뮬레이션',
      zh: '基于修正 Gompertz 与 Arrhenius 动力学模型的交互式科学模拟'
    },
    'lang.toggle': {
      en: '中文',
      ko: 'English',
      zh: '한국어'
    },

    // Stages
    'controls.stages': {
      en: 'Fermentation Stages',
      ko: '발효 단계',
      zh: '发酵阶段'
    },
    'controls.stageTemp': {
      en: 'Temp',
      ko: '온도',
      zh: '温度'
    },
    'controls.stageDur': {
      en: 'Duration',
      ko: '시간',
      zh: '时长'
    },
    'controls.singleStage': {
      en: 'Single Stage',
      ko: '단일 단계',
      zh: '单阶段'
    },
    'controls.multiStage': {
      en: 'Multi-Stage',
      ko: '다단계',
      zh: '多阶段'
    },

    // Controls
    'controls.title': {
      en: 'Fermentation Parameters',
      ko: '발효 매개변수',
      zh: '发酵参数'
    },

    // Sliders
    'slider.temp': {
      en: 'Temperature',
      ko: '온도',
      zh: '温度'
    },
    'slider.salt': {
      en: 'Salt Concentration',
      ko: '소금 농도',
      zh: '盐浓度'
    },
    'slider.starter': {
      en: 'Starter Culture (종국)',
      ko: '종국 (묵은지국물)',
      zh: '引子（老坛泡菜汤）'
    },
    'slider.starter.hint': {
      en: 'Old kimchi brine — natural LAB inoculant',
      ko: '묵은지국물 — 천연 유산균 종균',
      zh: '旧泡菜发酵液 — 天然乳酸菌种子液'
    },

    // Phases
    'phase.initial': {
      en: 'Initial',
      ko: '초기',
      zh: '初期'
    },
    'phase.optimal': {
      en: 'Optimal',
      ko: '최적숙성',
      zh: '最佳熟成'
    },
    'phase.over': {
      en: 'Over-ripened',
      ko: '과숙',
      zh: '过熟'
    },
    'phase.initial.sub': {
      en: 'L. sakei dominant',
      ko: 'L. sakei 우세',
      zh: 'L. sakei 主导'
    },
    'phase.optimal.sub': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides',
      zh: 'Leuc. mesenteroides 主导'
    },
    'phase.over.sub': {
      en: 'L. plantarum dominant',
      ko: 'L. plantarum 우세',
      zh: 'L. plantarum 主导'
    },

    // Stats
    'stat.optimalTime': {
      en: 'Optimal Time',
      ko: '최적 시간',
      zh: '最佳时间'
    },
    'stat.ph': {
      en: 'pH at Optimal',
      ko: '최적 pH',
      zh: '最佳pH'
    },
    'stat.acid': {
      en: 'Lactic Acid',
      ko: '젖산',
      zh: '乳酸'
    },
    'stat.bacteria': {
      en: 'Dominant LAB',
      ko: '우세 유산균',
      zh: '优势菌种'
    },
    'stat.flavor': {
      en: 'Flavor Score',
      ko: '풍미 점수',
      zh: '风味评分'
    },

    // Charts
    'chart.main.title': {
      en: 'Fermentation Dynamics',
      ko: '발효 역학',
      zh: '发酵动力学'
    },
    'chart.microbe.title': {
      en: 'Microbial Succession',
      ko: '미생물 천이',
      zh: '微生物演替'
    },
    'chart.flavor.title': {
      en: 'Flavor Score',
      ko: '풍미 점수',
      zh: '风味评分曲线'
    },
    'chart.xaxis': {
      en: 'Time (days)',
      ko: '시간 (일)',
      zh: '时间（天）'
    },
    'chart.ph': {
      en: 'pH',
      ko: 'pH',
      zh: 'pH'
    },
    'chart.lab': {
      en: 'LAB (log CFU/g)',
      ko: '유산균 (log CFU/g)',
      zh: '乳酸菌 (log CFU/g)'
    },
    'chart.acid': {
      en: 'Lactic Acid (%)',
      ko: '젖산 (%)',
      zh: '乳酸 (%)'
    },
    'chart.sakei': {
      en: 'L. sakei',
      ko: 'L. sakei',
      zh: 'L. sakei (清酒乳杆菌)'
    },
    'chart.mesenteroides': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides',
      zh: 'Leuc. mesenteroides (肠膜明串珠菌)'
    },
    'chart.plantarum': {
      en: 'L. plantarum',
      ko: 'L. plantarum',
      zh: 'L. plantarum (植物乳杆菌)'
    },
    'chart.proportion': {
      en: 'Proportion (%)',
      ko: '비율 (%)',
      zh: '比例 (%)'
    },
    'chart.score': {
      en: 'Score',
      ko: '점수',
      zh: '评分'
    },
    'chart.optimal': {
      en: 'Optimal',
      ko: '최적',
      zh: '最佳'
    },

    // Recipe
    'recipe.title': {
      en: 'Standard Recipe & Process',
      ko: '표준 레시피 및 공정',
      zh: '标准配方与制作流程'
    },
    'recipe.standards': {
      en: 'Industry Standards',
      ko: '산업 표준',
      zh: '行业标准'
    },

    // Footer
    'footer.description': {
      en: 'Open-source kimchi fermentation simulator based on Korean food science research.',
      ko: '한국 식품과학 연구 기반 오픈소스 김치 발효 시뮬레이터.',
      zh: '基于韩国食品科学研究的开源辣白菜发酵模拟器。'
    },
    'footer.refs': {
      en: 'References:',
      ko: '참고문헌:',
      zh: '参考文献：'
    },
    'footer.models': {
      en: 'Models: Modified Gompertz (LAB growth) · Arrhenius (temperature kinetics) · Sigmoid (microbial succession)',
      ko: '모델: 수정 Gompertz (유산균 성장) · Arrhenius (온도 동역학) · 시그모이드 (미생물 천이)',
      zh: '模型：修正Gompertz（乳酸菌增长）· Arrhenius（温度动力学）· Sigmoid（微生物演替）'
    },

    // Calculator
    'calc.title': { en: 'Recipe Calculator', ko: '레시피 계산기', zh: '配方计算器' },
    'calc.input': { en: 'Cabbage Weight', ko: '배추 무게', zh: '白菜重量' },
    'calc.salt.brine': { en: 'Brine (12%)', ko: '소금물 (12%)', zh: '盐水 (12%)' },
    'calc.coarse.salt': { en: 'Coarse Salt', ko: '굵은소금', zh: '粗盐' },
    'calc.chili': { en: 'Chili Powder', ko: '고춧가루', zh: '辣椒粉' },
    'calc.fish': { en: 'Fish Sauce', ko: '멸치액젓', zh: '鱼露' },
    'calc.shrimp': { en: 'Shrimp Paste', ko: '새우젓', zh: '虾酱' },
    'calc.garlic': { en: 'Garlic', ko: '마늘', zh: '大蒜' },
    'calc.ginger': { en: 'Ginger', ko: '생강', zh: '生姜' },
    'calc.rice': { en: 'Rice Paste', ko: '찹쌀풀', zh: '糯米糊' },
    'calc.scallion': { en: 'Green Onion', ko: '쪽파', zh: '小葱' },
    'calc.note': { en: 'Fish:Shrimp ratio = 3:2 for optimal umami', ko: '액젓:새우젓 = 3:2 최적 감칠맛', zh: '鱼露:虾酱 = 3:2 为最佳鲜味比例' },

    // Units
    'unit.days': { en: 'days', ko: '일', zh: '天' },
    'unit.day': { en: 'day', ko: '일', zh: '天' },
    'unit.hours': { en: 'hours', ko: '시간', zh: '小时' },
    'unit.h': { en: 'h', ko: '시간', zh: '时' }
  };

  var langOrder = ['en', 'ko', 'zh'];
  var currentLang = 'en';

  function t(key) {
    var entry = strings[key];
    if (!entry) return key;
    return entry[currentLang] || entry['en'] || key;
  }

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      els[i].textContent = t(key);
    }

    try { localStorage.setItem('kimchi-lang', lang); } catch (e) {}
  }

  function getLang() {
    return currentLang;
  }

  function cycleLang() {
    var idx = langOrder.indexOf(currentLang);
    var next = langOrder[(idx + 1) % langOrder.length];
    setLang(next);
    return currentLang;
  }

  function loadSaved() {
    try {
      var saved = localStorage.getItem('kimchi-lang');
      if (langOrder.indexOf(saved) >= 0) currentLang = saved;
    } catch (e) {}
  }

  return {
    t: t,
    setLang: setLang,
    getLang: getLang,
    cycleLang: cycleLang,
    loadSaved: loadSaved,
    strings: strings
  };
})();
