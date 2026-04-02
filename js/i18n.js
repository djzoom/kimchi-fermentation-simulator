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

    // Mixer labels
    'mixer.salt': { en: 'Salt', ko: '소금', zh: '盐' },
    'mixer.starter': { en: 'Starter', ko: '종국', zh: '引子' },

    // Process flowchart
    'process.title': { en: 'Making Process', ko: '제조 과정', zh: '制作流程' },
    'process.s1': { en: 'Select', ko: '선별', zh: '选菜' },
    'process.s1d': { en: 'Fresh napa cabbage', ko: '신선한 배추', zh: '新鲜大白菜' },
    'process.s2': { en: 'Salt', ko: '절임', zh: '腌制' },
    'process.s2d': { en: '6-8h, 8% salt', ko: '6-8시간, 8% 소금', zh: '6-8小时, 8%盐' },
    'process.s3': { en: 'Season', ko: '양념', zh: '调味' },
    'process.s3d': { en: 'Mix paste into leaves', ko: '양념 배추 사이에 넣기', zh: '将调味料抹入菜叶间' },
    'process.s4': { en: 'Pack', ko: '밀봉', zh: '装坛' },
    'process.s4d': { en: 'Press tight, no air', ko: '꽉 눌러 공기 제거', zh: '压紧，排尽空气' },
    'process.s5': { en: 'Ferment', ko: '발효', zh: '发酵' },
    'process.s5d': { en: 'Room temp 1-2 days', ko: '실온 1-2일', zh: '室温1-2天' },
    'process.s6': { en: 'Chill', ko: '냉장', zh: '冷藏' },
    'process.s6d': { en: 'Fridge 4°C, slow ripen', ko: '냉장고 4°C 숙성', zh: '冰箱4°C，缓慢熟成' },
    'process.s7': { en: 'Enjoy!', ko: '완성!', zh: '开吃!' },
    'process.s7d': { en: 'Best at peak flavor', ko: '최적 풍미에서 즐기기', zh: '最佳风味期食用' },

    // Calculator source
    'calc.source': { en: 'Korean RDA Standard', ko: '농촌진흥청 기준', zh: '韩国农村振兴厅标准' },
    'calc.codex': { en: 'Codex CXS 223-2001', ko: 'Codex CXS 223-2001', zh: 'Codex CXS 223-2001' },

    // Nitrite warning
    'nitrite.label': { en: 'Nitrite at optimal', ko: '최적시점 아질산염', zh: '最佳时点亚硝酸盐' },
    'chart.nitrite': { en: 'Nitrite NO2 (mg/kg)', ko: '아질산염 NO2 (mg/kg)', zh: '亚硝酸盐 NO2 (mg/kg)' },
    'nitrite.safe': { en: 'Safe', ko: '안전', zh: '安全' },
    'nitrite.caution': { en: 'Caution', ko: '주의', zh: '注意' },
    'nitrite.danger': { en: 'High Risk', ko: '위험', zh: '高风险' },

    // Educational tooltips (delayed hover popups)
    'tip.ph': {
      en: 'pH measures acidity. Fresh cabbage starts ~5.8. As bacteria produce lactic acid, pH drops. Best flavor is around pH 4.2-4.6 — tangy but not too sour.',
      ko: 'pH는 산도를 나타냅니다. 신선 배추는 ~5.8에서 시작합니다. 유산균이 젖산을 만들면 pH가 내려갑니다. 최적 풍미는 pH 4.2-4.6 — 적당히 새콤한 맛.',
      zh: 'pH是酸碱度。新鲜白菜约5.8，乳酸菌产酸后pH下降。最佳风味在pH 4.2-4.6之间——酸爽而不过酸。'
    },
    'tip.acid': {
      en: 'Lactic acid is what makes kimchi sour. It is produced by beneficial bacteria. The ideal amount is 0.6-0.8% — enough for tang, not too sharp.',
      ko: '젖산은 김치를 신맛나게 합니다. 유산균이 만들어냅니다. 이상적인 양은 0.6-0.8% — 적당한 신맛.',
      zh: '乳酸是泡菜变酸的原因，由有益菌产生。理想含量0.6-0.8%——酸度适中，口感最佳。'
    },
    'tip.lab': {
      en: 'LAB = Lactic Acid Bacteria. These friendly microbes are the heroes of fermentation! They preserve food, create flavor, and are great for gut health.',
      ko: 'LAB = 유산균. 발효의 주역입니다! 음식을 보존하고, 풍미를 만들고, 장 건강에 좋습니다.',
      zh: 'LAB=乳酸菌，发酵的功臣！它们保鲜食物、创造风味，还有益肠道健康。'
    },
    'tip.flavor': {
      en: 'Flavor score combines pH (tangy), lactic acid (sour depth), and Leuconostoc bacteria (CO2 fizz + aroma). 70+ = Excellent! The green dashed line marks peak flavor.',
      ko: '풍미 점수는 pH(신맛), 젖산(깊이), Leuconostoc 균(탄산+향)을 종합합니다. 70+ = 최고! 초록 점선이 최적 시점입니다.',
      zh: '风味评分综合了pH（酸爽）、乳酸（酸度深度）和明串珠菌（气泡+香气）。70分以上=优秀！绿色虚线标记最佳风味点。'
    },
    'tip.optimalTime': {
      en: 'The moment when flavor peaks! After this, kimchi keeps fermenting and gets more sour. Move to the fridge to slow it down.',
      ko: '풍미가 최고인 시점! 이후에는 계속 발효되어 더 시큼해집니다. 냉장고에 넣어 속도를 늦추세요.',
      zh: '风味达到巅峰的时刻！之后泡菜继续发酵会更酸。放入冰箱可以减缓发酵速度。'
    },
    'tip.salt': {
      en: 'Salt controls fermentation speed.\n\nToo little (<2%): spoils quickly, mushy texture\nJust right (2-3%): perfect crunch and flavor\nToo much (>4%): very slow, overly salty taste\n\nKorean standard: 2.5% after salting.',
      ko: '소금은 발효 속도를 조절합니다.\n\n너무 적으면 (<2%): 빨리 상하고 물러짐\n적당히 (2-3%): 아삭하고 맛있음\n너무 많으면 (>4%): 매우 느리고 짬\n\n한국 표준: 절임 후 2.5%.',
      zh: '盐控制发酵速度。\n\n太少(<2%)：容易坏，口感软烂\n刚好(2-3%)：爽脆可口\n太多(>4%)：发酵很慢，太咸\n\n韩国标准：腌制后2.5%。'
    },
    'tip.starter': {
      en: 'Starter = old kimchi brine. It contains millions of live bacteria that jumpstart fermentation.\n\n0%: Natural fermentation (slower)\n5%: Moderate boost\n10-15%: Fast start, consistent results\n\nLike sourdough starter for bread!',
      ko: '종국 = 묵은지국물. 수백만 유산균이 발효를 빠르게 시작합니다.\n\n0%: 자연 발효 (느림)\n5%: 적당한 촉진\n10-15%: 빠른 시작, 일정한 결과\n\n빵의 천연 효모와 같은 원리!',
      zh: '引子=老泡菜汤汁，含有数百万活菌，能快速启动发酵。\n\n0%：自然发酵（较慢）\n5%：适度加速\n10-15%：快速启动，效果稳定\n\n就像面包的老面种一样！'
    },
    'tip.stages': {
      en: 'Real kimchi-making uses stages:\n\n1. Room temp (20-25°C): Kick-start bacteria for a few hours\n2. Fridge (4°C): Slow, deep flavor development over days\n\nThis is why Korean grandmas leave kimchi out overnight before refrigerating!',
      ko: '실제 김치는 단계별로 만듭니다:\n\n1. 실온 (20-25°C): 몇 시간 유산균 활성화\n2. 냉장 (4°C): 며칠에 걸쳐 깊은 풍미 발달\n\n할머니들이 김치를 하룻밤 실온에 두었다 냉장하는 이유!',
      zh: '实际做泡菜分阶段：\n\n1. 室温(20-25°C)：几小时激活细菌\n2. 冷藏(4°C)：数天缓慢发展深层风味\n\n这就是韩国奶奶做好泡菜后先放室温一晚再放冰箱的原因！'
    },
    'tip.nitrite': {
      en: 'Nitrite (NO2) forms naturally during early fermentation as bacteria convert vegetable nitrates.\n\nDANGER ZONE: Days 2-5, nitrite peaks!\nNever eat kimchi that\'s only 1-3 days old.\n\nOnce fully fermented (pH < 4.2), LAB break down nitrite to safe levels (<3 mg/kg).\n\nThis is why proper fermentation time matters for safety!',
      ko: '아질산염(NO2)은 발효 초기에 세균이 야채의 질산염을 전환하면서 자연 발생합니다.\n\n위험 구간: 2-5일, 아질산염 최고치!\n1-3일된 김치는 먹지 마세요.\n\n충분히 발효되면 (pH < 4.2), 유산균이 아질산염을 안전 수준으로 분해합니다 (<3 mg/kg).\n\n적절한 발효 시간이 안전에 중요한 이유입니다!',
      zh: '亚硝酸盐(NO2)在发酵初期自然产生，细菌将蔬菜中的硝酸盐转化而来。\n\n危险期：第2-5天，亚硝酸盐达到峰值！\n千万不要吃只腌了1-3天的泡菜！\n\n充分发酵后(pH<4.2)，乳酸菌会将亚硝酸盐分解到安全水平(<3mg/kg)。\n\n这就是为什么充分发酵对食品安全至关重要！'
    },
    'tip.phase': {
      en: 'Fermentation has 3 phases:\n\n Blue = Initial: L. sakei grows first, mild taste\n Green = Optimal: Leuconostoc makes bubbles and great flavor\n Yellow = Over-ripened: L. plantarum takes over, very sour\n\nThe marker shows where your kimchi is now!',
      ko: '발효 3단계:\n\n 파랑 = 초기: L. sakei가 먼저 자라, 순한 맛\n 초록 = 최적: Leuconostoc이 탄산과 좋은 풍미 생성\n 노랑 = 과숙: L. plantarum 우세, 매우 시큼\n\n마커가 현재 김치 상태를 보여줍니다!',
      zh: '发酵分三个阶段：\n\n 蓝色=初期：L. sakei先生长，味道温和\n 绿色=最佳：明串珠菌产生气泡和绝佳风味\n 黄色=过熟：植物乳杆菌主导，非常酸\n\n标记显示你的泡菜现在处于哪个阶段！'
    },

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

    // Update tooltip data attributes
    var tips = document.querySelectorAll('[data-tip]');
    for (var j = 0; j < tips.length; j++) {
      var tipKey = tips[j].getAttribute('data-tip');
      tips[j].setAttribute('data-tip-text', t(tipKey));
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
