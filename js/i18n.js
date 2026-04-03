/**
 * Kimchi Fermentation Simulator — Internationalization
 * Trilingual: English (en) / Korean (ko) / Chinese (zh)
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.i18n = (function () {
  'use strict';

  var strings = {
    'app.title': {
      en: 'Kimchi Simulator',
      ko: '김치 시뮬레이터',
      zh: '泡菜模拟器'
    },
    'app.subtitle': {
      en: 'Interactive scientific simulation based on Modified Gompertz & Arrhenius kinetic models',
      ko: '수정 Gompertz 및 Arrhenius 동역학 모델 기반 과학적 시뮬레이션',
      zh: '基于修正 Gompertz 与 Arrhenius 动力学模型的交互式科学模拟'
    },
    'app.subtitleShort': {
      en: 'Kitchen-friendly flavor & safety guide · Fermentation biochemistry simulation',
      ko: '풍미·안전 주방 가이드 · 발효 생화학 시뮬레이션',
      zh: '面向厨房场景的风味与安全发酵指南 · 基于发酵生化动力学的模拟与预测'
    },
    'lang.toggle': {
      en: '中文',
      ko: 'English',
      zh: '한국어'
    },
    'info.more': {
      en: 'More info',
      ko: '자세히 보기',
      zh: '更多说明'
    },
    'hero.kicker': {
      en: 'Kimchi, explained for real kitchens',
      ko: '실제 부엌을 위한 김치 설명서',
      zh: '写给真实厨房场景的 Kimchi 说明书'
    },
    'hero.title': {
      en: 'See how salt, time, and temperature turn cabbage into lively, balanced kimchi.',
      ko: '소금, 시간, 온도가 배추를 생기 있고 균형 잡힌 김치로 바꾸는 과정을 보세요.',
      zh: '看看盐、时间和温度如何把白菜变成鲜活而平衡的 Kimchi。'
    },
    'hero.body': {
      en: 'Move the controls like a recipe, watch the chart respond instantly, and use the notes below to learn what makes kimchi crisp, tangy, safe, and deeply aromatic.',
      ko: '레시피를 조정하듯 컨트롤을 움직이고, 차트가 즉시 반응하는 모습을 보세요. 아래 설명을 통해 김치를 아삭하고, 새콤하고, 안전하고, 향기롭게 만드는 요소를 이해할 수 있습니다.',
      zh: '像调整配方一样移动控件，观察图表即时变化，并通过下方说明理解什么让 Kimchi 爽脆、酸香、安全且富有层次。'
    },
    'intro.fact1.title': {
      en: 'Start with the red score line',
      ko: '먼저 빨간 점수 곡선을 보세요',
      zh: '先看红色评分曲线'
    },
    'intro.fact1.body': {
      en: 'It summarizes taste, aroma, and texture so first-time visitors know where to look.',
      ko: '맛, 향, 식감을 하나로 요약해 처음 보는 사람도 어디를 봐야 할지 바로 알 수 있습니다.',
      zh: '它把味道、香气和口感合成一个结果，让第一次看的用户也知道先看哪里。'
    },
    'intro.fact2.title': {
      en: 'Use the colored bands as a story',
      ko: '색 띠를 발효 이야기로 읽어보세요',
      zh: '把彩色阶段带当作发酵故事来读'
    },
    'intro.fact2.body': {
      en: 'Each phase shows which friendly bacteria are leading the fermentation and what that means for flavor.',
      ko: '각 단계는 어떤 유익균이 발효를 주도하는지, 그리고 그것이 풍미에 어떤 의미인지 보여줍니다.',
      zh: '每个阶段都会告诉你是哪类有益菌在主导发酵，以及这会怎样改变风味。'
    },
    'intro.fact3.title': {
      en: 'Watch the nitrite warning carefully',
      ko: '아질산염 경고도 꼭 함께 보세요',
      zh: '别忽略亚硝酸盐提示'
    },
    'intro.fact3.body': {
      en: 'Kimchi is not only about taste. This model also estimates how nitrate reserve, brine strength, and acidification shape the safer eating window.',
      ko: '김치는 맛만의 문제가 아닙니다. 이 모델은 질산염 저장량, 염도, 산성화 속도가 더 안전한 섭취 구간을 어떻게 만드는지도 함께 추정합니다.',
      zh: 'Kimchi 不只关乎味道。这个模型也会估算硝酸根储量、盐水强度和酸化速度如何共同决定更安全的食用窗口。'
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
    'controls.subtitle': {
      en: 'Keep the household presets if you are learning, or edit each stage as if you were planning a real batch.',
      ko: '처음이라면 가정용 프리셋을 그대로 사용하고, 익숙하다면 실제 배치를 설계하듯 단계를 직접 수정해 보세요.',
      zh: '如果你正在入门，可以先用家用预设；熟悉以后，也可以像规划真实一坛泡菜那样逐段修改。'
    },
    'controls.stageHelp': {
      en: 'Warm stages wake the microbes up. Cold stages stretch flavor development and keep texture crisp.',
      ko: '따뜻한 단계는 미생물을 깨우고, 차가운 단계는 풍미 발달을 길게 끌어가며 식감을 더 아삭하게 유지합니다.',
      zh: '温暖阶段负责唤醒菌群，低温阶段负责拉长风味发展并帮助保持爽脆口感。'
    },
    'controls.addStage': {
      en: 'Add stage',
      ko: '단계 추가',
      zh: '添加阶段'
    },
    'controls.removeStage': {
      en: 'Remove stage',
      ko: '단계 삭제',
      zh: '删除阶段'
    },
    'presets.label': {
      en: 'Quick presets',
      ko: '빠른 프리셋',
      zh: '快速预设'
    },
    'preset.classic': {
      en: 'Classic Home',
      ko: '가정 기본',
      zh: '家常经典'
    },
    'preset.weekend': {
      en: 'Weekend Fast',
      ko: '주말 빠르게',
      zh: '周末快成'
    },
    'preset.slow': {
      en: 'Cold Slow',
      ko: '저온 천천히',
      zh: '冷藏慢熟'
    },
    'preset.manual': {
      en: 'Manual',
      ko: '수동 입력',
      zh: '手动输入'
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
      en: 'Starter Culture (종균)',
      ko: '종균 (묵은지국물)',
      zh: '母水（老泡菜发酵液）'
    },
    'slider.starter.hint': {
      en: 'Old kimchi brine — natural LAB inoculant (backslopping)',
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
    'phase.title': {
      en: 'Fermentation story at a glance',
      ko: '한눈에 보는 발효 이야기',
      zh: '一眼看懂发酵进程'
    },
    'phase.body': {
      en: 'The marker shows where your current settings reach their best flavor moment.',
      ko: '마커는 현재 설정에서 풍미가 가장 좋아지는 시점을 보여줍니다.',
      zh: '标记会告诉你当前设置下风味达到最佳的时刻。'
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
    'chart.flavor.subtitle': {
      en: 'Start simple with the score, then turn on pH, acid, LAB, or microbe lines when you want more detail.',
      ko: '먼저 점수 곡선으로 전체를 보고, 필요할 때 pH, 산도, 유산균, 균종 곡선을 켜서 더 깊게 읽어보세요.',
      zh: '先用评分曲线把整体读懂，再按需打开 pH、酸度、乳酸菌或菌群曲线查看细节。'
    },
    'chart.toolbar': {
      en: 'Show on chart',
      ko: '차트에 표시',
      zh: '主图显示'
    },
    'chart.toggle.score': {
      en: 'Score',
      ko: '점수',
      zh: '评分'
    },
    'chart.toggle.nitrite': {
      en: 'Nitrite',
      ko: '아질산염',
      zh: '亚硝酸盐'
    },
    'chart.toggle.ph': {
      en: 'pH',
      ko: 'pH',
      zh: 'pH'
    },
    'chart.toggle.acid': {
      en: 'Acid',
      ko: '산도',
      zh: '酸度'
    },
    'chart.toggle.lab': {
      en: 'LAB',
      ko: '유산균',
      zh: '乳酸菌'
    },
    'chart.toggle.microbes': {
      en: 'Microbes',
      ko: '균종',
      zh: '优势菌'
    },
    'chart.excellent': {
      en: 'Excellent',
      ko: '매우 좋음',
      zh: '优秀'
    },
    'chart.axis.no2': {
      en: 'Nitrite (mg/kg)',
      ko: '아질산염 (mg/kg)',
      zh: '亚硝酸盐 (mg/kg)'
    },
    'chart.axis.ph': {
      en: 'pH / Lactic Acid',
      ko: 'pH / 젖산',
      zh: 'pH / 乳酸'
    },
    'chart.nitrite.safeLine': {
      en: 'Safe line 3 mg/kg',
      ko: '안전선 3 mg/kg',
      zh: '安全线 3 mg/kg'
    },
    'dominance.title': {
      en: 'Dominant microbes across the whole story',
      ko: '발효 전 과정의 우세 미생물',
      zh: '整段发酵过程中的优势菌群'
    },
    'dominance.initial.note': {
      en: 'Builds a clean, fresh start.',
      ko: '깔끔하고 신선한 출발을 만듭니다.',
      zh: '让发酵从干净、新鲜的状态起步。'
    },
    'dominance.optimal.note': {
      en: 'Brings sparkle, aroma, and balance.',
      ko: '탄산감, 향, 균형감을 더합니다.',
      zh: '带来轻盈气泡感、香气与平衡。'
    },
    'dominance.over.note': {
      en: 'Pushes the batch into deeper sourness.',
      ko: '배치를 더 깊고 강한 신맛으로 이끕니다.',
      zh: '把这一坛推向更深、更强的酸味。'
    },
    'guide.title': {
      en: 'How to read this simulator',
      ko: '이 시뮬레이터 읽는 법',
      zh: '如何读懂这个模拟器'
    },
    'guide.body': {
      en: 'You do not need a lab background. Read the chart in three simple passes.',
      ko: '실험실 배경지식이 없어도 됩니다. 세 단계로 차트를 읽어보세요.',
      zh: '你不需要实验室背景。按三步读图就够了。'
    },
    'guide.step1.title': {
      en: 'Find the best eating window',
      ko: '가장 맛있는 먹는 시점을 찾기',
      zh: '先找到最佳食用窗口'
    },
    'guide.step1.body': {
      en: 'Read the red score line and the green dashed marker first. That is your fastest route to “when should I eat this batch?”.',
      ko: '빨간 점수 곡선과 초록 점선을 먼저 보세요. “이 배치는 언제 먹으면 좋은가?”에 가장 빠르게 답해줍니다.',
      zh: '先看红色评分曲线和绿色虚线，它们最快告诉你“这一坛什么时候最好吃”。'
    },
    'guide.step2.title': {
      en: 'Check safety before enthusiasm',
      ko: '맛보다 먼저 안전을 확인하기',
      zh: '在兴奋之前先看安全'
    },
    'guide.step2.body': {
      en: 'The nitrite line is recalculated from nitrate reserve, sodium strength, temperature stages, and LAB cleanup. Read flavor and safety together before tasting early.',
      ko: '아질산염 곡선은 질산염 저장량, Na\u207A 강도, 온도 단계, 유산균 정리 속도를 함께 반영해 다시 계산됩니다. 초기에 맛보기 전에는 풍미와 안전을 같이 읽어야 합니다.',
      zh: '亚硝酸盐曲线会根据硝酸根储量、Na\u207A 强度、温度阶段和乳酸菌清除速度重新计算。想早尝时，风味和安全要一起看。'
    },
    'guide.step3.title': {
      en: 'Use the microbe story to understand taste',
      ko: '균종의 이야기를 통해 맛을 이해하기',
      zh: '通过菌群变化理解味道'
    },
    'guide.step3.body': {
      en: 'The phase bands and microbe cards explain why kimchi tastes fresh, sparkly, or deep and sour at different points.',
      ko: '단계 띠와 균종 카드는 김치가 어떤 시점에는 신선하고, 어떤 시점에는 톡 쏘고, 또 어떤 시점에는 깊고 시게 느껴지는 이유를 설명합니다.',
      zh: '阶段带和菌群卡会解释为什么 Kimchi 在不同时间点会呈现清新、活泼或深沉偏酸的味道。'
    },
    'microbe.board.title': {
      en: 'Dominant bacteria at each stage',
      ko: '각 단계의 우세 균종',
      zh: '各阶段优势菌群'
    },
    'microbe.board.body': {
      en: 'These are the main friendly bacteria behind kimchi flavor. The highlighted card and percentages update with your parameters in real time.',
      ko: '이들은 김치 풍미를 만드는 주요 유익균입니다. 강조된 카드와 비율은 현재 파라미터에 따라 실시간으로 바뀝니다.',
      zh: '这些是塑造 Kimchi 风味的主要有益菌。高亮卡片和占比会随着参数实时变化。'
    },
    'microbe.atPeak': {
      en: 'At peak flavor',
      ko: '최적 풍미 시점',
      zh: '最佳风味时'
    },
    'microbe.sakei.name': {
      en: 'L. sakei',
      ko: 'L. sakei (사케이 유산균)',
      zh: 'L. sakei (清酒乳杆菌)'
    },
    'microbe.sakei.role': {
      en: 'Early stabilizer',
      ko: '초기 안정화 담당',
      zh: '早期稳定者'
    },
    'microbe.sakei.body': {
      en: 'Helps the batch settle in, keeps the taste fresh, and prepares the way for deeper fermentation.',
      ko: '배치가 안정적으로 시작되도록 돕고, 맛을 신선하게 유지하며, 다음 단계 발효의 바탕을 만듭니다.',
      zh: '帮助这一坛顺利进入状态，保持清新口感，并为后续更深的发酵打底。'
    },
    'microbe.mesenteroides.name': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides (메센테로이데스)',
      zh: 'Leuc. mesenteroides (肠膜明串珠菌)'
    },
    'microbe.mesenteroides.role': {
      en: 'Peak flavor maker',
      ko: '최적 풍미 메이커',
      zh: '最佳风味制造者'
    },
    'microbe.mesenteroides.body': {
      en: 'Creates lively aroma, gentle tang, and the fresh sparkle people often love in ripe kimchi.',
      ko: '생기 있는 향, 부드러운 산미, 잘 익은 김치 특유의 산뜻한 톡 쏘는 느낌을 만듭니다.',
      zh: '带来活泼香气、柔和酸感，以及很多人喜欢的成熟 Kimchi 清爽气息。'
    },
    'microbe.plantarum.name': {
      en: 'L. plantarum',
      ko: 'L. plantarum (플란타럼 유산균)',
      zh: 'L. plantarum (植物乳杆菌)'
    },
    'microbe.plantarum.role': {
      en: 'Deep sour finisher',
      ko: '깊은 신맛의 마무리 담당',
      zh: '深酸收尾者'
    },
    'microbe.plantarum.body': {
      en: 'Takes over later, deepens acidity, and moves the batch toward cooking kimchi territory.',
      ko: '후반에 우세해지며 산미를 깊게 만들고, 배치를 요리용 김치 쪽으로 이끕니다.',
      zh: '后期逐渐占优，进一步加深酸度，让这一坛更接近适合做菜的老 Kimchi。'
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
    'calc.subtitle': {
      en: 'Enter the cabbage weight and get a practical shopping list scaled from a standard household recipe.',
      ko: '배추 무게를 입력하면 표준 가정용 레시피를 기준으로 실제 장보기 분량이 계산됩니다.',
      zh: '输入白菜重量后，系统会按标准家庭配方换算出一份实用采购清单。'
    },
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
    'mixer.starter': { en: 'Starter', ko: '종균', zh: '母水' },

    // Process flowchart
    'process.title': { en: 'Making Process', ko: '제조 과정', zh: '制作流程' },
    'process.subtitle': {
      en: 'This is the kitchen workflow behind the chart: salting changes texture, seasoning feeds fermentation, and temperature shapes the final flavor.',
      ko: '이 공정은 위 차트의 주방 버전입니다. 절임은 식감을 바꾸고, 양념은 발효를 돕고, 온도는 최종 풍미를 결정합니다.',
      zh: '这是上方图表在厨房里的对应流程：盐会改变质地，酱料会喂养发酵，温度则决定最终风味。'
    },
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
    'nitrite.label': { en: 'Nitrite at best-eating point', ko: '최적 식미 시점 아질산염', zh: '最佳食用点亚硝酸盐' },
    'chart.nitrite': { en: 'Nitrite NO\u2082 (mg/kg)', ko: '아질산염 NO\u2082 (mg/kg)', zh: '亚硝酸盐 NO\u2082 (mg/kg)' },
    'nitrite.safe': { en: 'Safe', ko: '안전', zh: '安全' },
    'nitrite.caution': { en: 'Caution', ko: '주의', zh: '注意' },
    'nitrite.danger': { en: 'High Risk', ko: '위험', zh: '高风险' },
    'nitrite.model.title': {
      en: 'Nitrite kinetics for this batch',
      ko: '이 배치의 아질산염 동역학',
      zh: '这一坛的亚硝酸盐动力学'
    },
    'nitrite.model.body': {
      en: 'The curve now comes from nitrate reserve, sodium strength, temperature stages, and the speed at which LAB acidify and clear nitrite.',
      ko: '이 곡선은 이제 질산염 저장량, Na\u207A 강도, 온도 단계, 그리고 유산균의 산성화 및 아질산염 제거 속도에서 계산됩니다.',
      zh: '这条曲线现在由硝酸根储量、Na\u207A 强度、温度阶段，以及乳酸菌的产酸和清除速度共同推演。'
    },
    'nitrite.no3': { en: 'NO\u2083\u207B reserve', ko: 'NO\u2083\u207B 저장량', zh: 'NO\u2083\u207B 储量' },
    'nitrite.na': { en: 'Na\u207A strength', ko: 'Na\u207A 강도', zh: 'Na\u207A 强도' },
    'nitrite.peak': { en: 'Predicted peak', ko: '예상 최고치', zh: '预计峰值' },
    'nitrite.window': { en: 'Risk window', ko: '위험 구간', zh: '风险窗口' },
    'nitrite.flux': { en: 'Dynamic balance', ko: '동역학 균형', zh: '动力学平衡' },
    'nitrite.form': { en: 'Formation', ko: '생성', zh: '生成' },
    'nitrite.clear': { en: 'Clearance', ko: '清除', zh: '清除' },
    'nitrite.window.none': {
      en: 'Below 3 mg/kg throughout',
      ko: '전 구간 3 mg/kg 이하',
      zh: '全程低于 3 mg/kg'
    },

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
      en: 'Flavor score combines pH (tangy), lactic acid (sour depth), and Leuconostoc bacteria (CO\u2082 fizz + aroma). 70+ = Excellent! The green dashed line marks peak flavor.',
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
      ko: '종균 = 묵은지국물. 수백만 유산균이 발효를 빠르게 시작합니다.\n\n0%: 자연 발효 (느림)\n5%: 적당한 촉진\n10-15%: 빠른 시작, 일정한 결과\n\n빵의 천연 효모와 같은 원리!',
      zh: '母水=老泡菜汤汁，含有数百万活菌，能快速启动发酵。\n\n0%：自然发酵（较慢）\n5%：适度加速\n10-15%：快速启动，效果稳定\n\n就像面包的老面种一样！'
    },
    'tip.stages': {
      en: 'Real kimchi-making uses stages:\n\n1. Room temp (20-25°C): Kick-start bacteria for a few hours\n2. Fridge (4°C): Slow, deep flavor development over days\n\nThis is why Korean grandmas leave kimchi out overnight before refrigerating!',
      ko: '실제 김치는 단계별로 만듭니다:\n\n1. 실온 (20-25°C): 몇 시간 유산균 활성화\n2. 냉장 (4°C): 며칠에 걸쳐 깊은 풍미 발달\n\n할머니들이 김치를 하룻밤 실온에 두었다 냉장하는 이유!',
      zh: '实际做泡菜分阶段：\n\n1. 室温(20-25°C)：几小时激活细菌\n2. 冷藏(4°C)：数天缓慢发展深层风味\n\n这就是韩国奶奶做好泡菜后先放室温一晚再放冰箱的原因！'
    },
    'tip.nitrite': {
      en: 'Nitrite (NO\u2082) is not assigned to a fixed day count here.\n\nThis simulator estimates a nitrate reservoir from the kimchi mix, converts salt into an equivalent Na\u207A brine strength, speeds or slows nitrate reduction with your temperature stages, and then lets LAB acidity and biomass clear nitrite back down.\n\nWarm starts usually compress the risk window into an earlier, sharper peak. Cold plans often spread it over more time. More starter usually shortens the window because LAB take control sooner.\n\nRead the predicted peak and risk window for your actual settings instead of assuming every batch peaks on the same day.',
      ko: '여기서는 아질산염(NO\u2082)을 고정된 날짜 규칙으로 처리하지 않습니다.\n\n이 시뮬레이터는 김치 혼합물의 질산염 저장량을 추정하고, 소금을 등가 Na\u207A 염수 강도로 바꾸며, 온도 단계에 따라 질산염 환원 속도를 조절한 뒤, 유산균의 산성화와 균수 증가로 아질산염이 다시 낮아지도록 계산합니다.\n\n따뜻한 시작은 위험 구간을 더 이르고 날카로운 최고치로 압축하는 경향이 있고, 차가운 계획은 그 구간을 더 길게 펼치는 경향이 있습니다. 종균이 많을수록 유산균이 더 빨리 주도권을 잡아 위험 구간이 짧아지는 경우가 많습니다.\n\n따라서 모든 배치가 같은 날 최고치를 찍는다고 가정하지 말고, 현재 설정에서 계산된 최고치와 위험 구간을 읽어야 합니다.',
      zh: '这里不会把亚硝酸盐(NO\u2082)硬套成固定的第几天。\n\n这个模拟器会先根据配方估算 Kimchi 中的硝酸根储量，把盐换算成等效的 Na\u207A 盐水强度，再根据你的温度阶段加快或放慢硝酸根向亚硝酸盐的转化，最后让乳酸菌的产酸和菌量增长把亚硝酸盐继续压低。\n\n温暖起步通常会把风险窗口压缩成更早、更尖锐的峰值；低温计划往往会把它摊得更长。母水越多，乳酸菌越早接管，风险窗口通常也会更短。\n\n所以不要假设每一坛都会在同一天达到峰值，而要看当前参数下实时推演出的峰值和风险窗口。'
    },
    'tip.phase': {
      en: 'Fermentation has 3 phases:\n\n Blue = Initial: L. sakei grows first, mild taste\n Green = Optimal: Leuconostoc makes bubbles and great flavor\n Yellow = Over-ripened: L. plantarum takes over, very sour\n\nThe marker shows where your kimchi is now!',
      ko: '발효 3단계:\n\n 파랑 = 초기: L. sakei가 먼저 자라, 순한 맛\n 초록 = 최적: Leuconostoc이 탄산과 좋은 풍미 생성\n 노랑 = 과숙: L. plantarum 우세, 매우 시큼\n\n마커가 현재 김치 상태를 보여줍니다!',
      zh: '发酵分三个阶段：\n\n 蓝色=初期：L. sakei先生长，味道温和\n 绿色=最佳：明串珠菌产生气泡和绝佳风味\n 黄色=过熟：植物乳杆菌主导，非常酸\n\n标记显示你的泡菜现在处于哪个阶段！'
    },
    'tip.readChart': {
      en: 'Read it in this order:\n\n1. Red score line = overall eating quality\n2. Green dashed line = best flavor moment\n3. Nitrite line = early safety warning\n4. Colored phase bands = which bacteria are leading\n\nTurn on extra layers only when you want more detail.',
      ko: '이 순서로 보세요:\n\n1. 빨간 점수선 = 전체 먹기 좋은 정도\n2. 초록 점선 = 풍미가 가장 좋은 순간\n3. 아질산염 선 = 초기 안전 경고\n4. 색 띠 = 어떤 균이 발효를 주도하는지\n\n더 자세히 보고 싶을 때만 추가 레이어를 켜면 됩니다.',
      zh: '建议按这个顺序读图：\n\n1. 红色评分线 = 整体适口性\n2. 绿色虚线 = 风味最佳时刻\n3. 亚硝酸盐线 = 早期安全提醒\n4. 彩色阶段带 = 当前哪类菌在主导\n\n想看更深细节时，再打开其他图层。'
    },
    'tip.chartControls': {
      en: 'The chart starts in a family-friendly mode with the most important information on screen. Use these buttons to reveal deeper scientific layers without overwhelming the first view.',
      ko: '차트는 가장 중요한 정보만 보이는 쉬운 모드로 시작합니다. 이 버튼으로 과학적 세부 레이어를 필요할 때만 펼칠 수 있습니다.',
      zh: '主图默认采用适合大众阅读的模式，只显示最重要的信息。用这些按钮可以在不打乱第一眼阅读的前提下，逐层打开更深入的数据。'
    },
    'tip.dominance': {
      en: 'These bands summarize the dominant microbe over time.\n\nBlue: L. sakei helps the batch settle.\nGreen: Leuconostoc usually delivers peak eating quality.\nYellow: L. plantarum pushes kimchi toward stronger sourness.\n\nThe widths change with your temperature plan.',
      ko: '이 띠는 시간에 따라 우세한 미생물을 요약합니다.\n\n파랑: L. sakei가 배치를 안정화합니다.\n초록: Leuconostoc이 보통 최고의 식미를 만듭니다.\n노랑: L. plantarum이 더 강한 산미 쪽으로 이끕니다.\n\n폭은 온도 계획에 따라 달라집니다.',
      zh: '这些色带概括了不同时间段的优势菌。\n\n蓝色：L. sakei 帮助发酵起步并稳定。\n绿色：Leuconostoc 往往带来最佳食用品质。\n黄色：L. plantarum 会把 Kimchi 推向更明显的酸味。\n\n它们的宽度会随着你的温度计划变化。'
    },
    'tip.microbeBoard': {
      en: 'Kimchi flavor is a team effort.\n\nThese cards answer a simple question: who is doing the most work around the best-tasting moment? The highlighted card updates automatically as you change time, starter, and temperature stages.',
      ko: '김치 풍미는 팀플레이입니다.\n\n이 카드는 “가장 맛있는 시점 주변에서 누가 가장 큰 역할을 하고 있는가?”를 쉽게 보여줍니다. 시간, 종균, 온도 단계를 바꾸면 자동으로 강조 카드가 바뀝니다.',
      zh: 'Kimchi 的风味来自菌群协作。\n\n这组卡片回答的是一个简单问题：在最佳风味附近，究竟是谁出了最多力？当你调整时间、母水和温度阶段时，高亮卡片会自动变化。'
    },
    'tip.presets': {
      en: 'Presets are not rigid rules. They are teaching shortcuts.\n\nClassic Home: warm start, long cold finish\nWeekend Fast: quicker souring for short timelines\nCold Slow: mostly refrigerator fermentation for steadier texture',
      ko: '프리셋은 절대 규칙이 아니라 학습용 지름길입니다.\n\n가정 기본: 따뜻하게 시작하고 차갑게 길게 마무리\n주말 빠르게: 짧은 일정에 맞춘 빠른 산미 형성\n저온 천천히: 냉장 중심으로 더 안정적 식감 유지',
      zh: '这些预设不是死规则，而是学习捷径。\n\n家常经典：先温后冷，慢慢成熟\n周末快成：适合短周期，较快出酸\n冷藏慢熟：以冰箱发酵为主，质地更稳'
    },
    'tip.process': {
      en: 'This flow explains why household kimchi making is staged. Salting removes water, seasoning adds nutrients and aroma, and temperature decides whether the batch develops quickly or slowly.',
      ko: '이 흐름도는 가정용 김치가 왜 단계적으로 만들어지는지 설명합니다. 절임은 수분을 빼고, 양념은 영양과 향을 더하며, 온도는 발효 속도를 결정합니다.',
      zh: '这个流程图解释了为什么家庭做 Kimchi 往往要分步骤进行。盐会脱水，酱料会提供营养和香气，温度则决定它是快熟还是慢熟。'
    },
    'tip.calc': {
      en: 'This calculator is for practical kitchen prep. It scales a representative household recipe, so you can move from learning to making without mental math.',
      ko: '이 계산기는 실제 주방 준비를 위한 도구입니다. 대표적인 가정용 레시피를 비례 확장하므로, 머리로 환산하지 않고 바로 장보기 분량을 얻을 수 있습니다.',
      zh: '这个计算器服务于真实厨房准备。它会按一份代表性家庭配方等比换算，让你不用心算就能得到采购量。'
    },
    'tip.sakei': {
      en: 'L. sakei often dominates early.\n\nWhat it means for you: the batch is still fresh, clean, and not yet deeply sour. Think of it as the “settling in” stage.',
      ko: 'L. sakei는 보통 초기에 우세합니다.\n\n의미: 배치는 아직 신선하고 깔끔하며 깊게 시어지지 않았습니다. 발효가 자리를 잡는 단계라고 보면 됩니다.',
      zh: 'L. sakei 往往在前期占优。\n\n对你意味着什么：这一坛还偏清新、干净，酸味还不深，可以理解为“进入状态”的阶段。'
    },
    'tip.mesenteroides': {
      en: 'Leuconostoc is the crowd-pleaser.\n\nIt helps create aroma, light acidity, and a lively profile that many people associate with perfect eating kimchi.',
      ko: 'Leuconostoc은 가장 많은 사람들이 좋아하는 풍미를 만드는 균입니다.\n\n향, 가벼운 산미, 생기 있는 인상을 만들어 “먹기 가장 좋은 김치”와 자주 연결됩니다.',
      zh: 'Leuconostoc 常常是最讨喜的一类菌。\n\n它能带来香气、轻快酸感和鲜活口感，很多人心中的“最好吃 Kimchi”通常就和它有关。'
    },
    'tip.plantarum': {
      en: 'L. plantarum is powerful late in fermentation.\n\nIt deepens acidity and is useful when kimchi is heading toward soups, stews, fried rice, or other cooked dishes.',
      ko: 'L. plantarum은 발효 후반에 강해집니다.\n\n산미를 깊게 만들며, 김치찌개나 볶음밥 같은 요리용 김치로 갈 때 특히 의미가 큽니다.',
      zh: 'L. plantarum 在发酵后期会更强势。\n\n它会进一步加深酸味，因此当 Kimchi 逐渐转向适合做汤、炒饭、炖菜时，它就很关键。'
    },

    // Batch tracker
    'batch.startLabel': {
      en: 'Pickling start date',
      ko: '담근 날짜',
      zh: '腌渍开始日期'
    },
    'batch.elapsed': {
      en: '{d} days elapsed',
      ko: '{d}일 경과',
      zh: '已经过 {d} 天'
    },
    'batch.now': {
      en: 'Current status',
      ko: '현재 상태',
      zh: '当前状态'
    },
    'batch.phase': {
      en: 'Phase',
      ko: '단계',
      zh: '阶段'
    },
    'batch.dominant': {
      en: 'Dominant',
      ko: '우세균',
      zh: '优势菌'
    },
    'batch.suggestion': {
      en: 'Suggestion',
      ko: '제안',
      zh: '建议'
    },
    'batch.notStarted': {
      en: 'Set a start date to track your batch',
      ko: '담근 날짜를 입력하면 현재 상태를 볼 수 있습니다',
      zh: '输入腌渍日期即可追踪当前状态'
    },
    'batch.suggestion.early': {
      en: 'Still in early stage — nitrite may be elevated. Wait for further fermentation.',
      ko: '아직 초기 단계 — 아질산염이 높을 수 있습니다. 더 발효시키세요.',
      zh: '仍处于初期——亚硝酸盐可能偏高，继续等待发酵。'
    },
    'batch.suggestion.optimal': {
      en: 'Peak flavor window! Best time to start eating. Move to fridge if not already.',
      ko: '최적 풍미 구간! 지금 먹기 시작하세요. 아직 냉장하지 않았다면 냉장고에 넣으세요.',
      zh: '最佳风味窗口！可以开始食用了。如果还没放冰箱，建议现在移入冷藏。'
    },
    'batch.suggestion.over': {
      en: 'Past peak — increasingly sour. Best for cooking (kimchi jjigae, fried rice).',
      ko: '최적기를 지남 — 점점 시어집니다. 요리용 (김치찌개, 볶음밥)으로 좋습니다.',
      zh: '已过最佳期——酸度渐增，适合用来做菜（泡菜汤、炒饭等）。'
    },

    // Freezing warning
    'warn.frozen': {
      en: 'Below freezing point (~-1.5°C at 2.5% salt). Kimchi will freeze, LAB go dormant. Ice crystals damage vegetable texture.',
      ko: '빙점 이하 (~-1.5°C, 2.5% 소금 기준). 김치가 얼고 유산균이 휴면합니다. 얼음 결정이 채소 조직을 손상시킵니다.',
      zh: '低于冰点（2.5%盐约-1.5°C）。泡菜会结冰，乳酸菌休眠。冰晶会破坏蔬菜组织。'
    },

    // Date labels
    'date.year': { en: 'Year', ko: '년', zh: '年' },
    'date.month': { en: 'Mon', ko: '월', zh: '月' },
    'date.day': { en: 'Day', ko: '일', zh: '日' },
    'date.hour': { en: 'Hour', ko: '시', zh: '时' },

    // Units
    'unit.days': { en: 'days', ko: '일', zh: '天' },
    'unit.day': { en: 'day', ko: '일', zh: '天' },
    'unit.hours': { en: 'hours', ko: '시간', zh: '小时' },
    'unit.h': { en: 'h', ko: '시간', zh: '小时' },
    'unit.hourShort': { en: 'h', ko: '시', zh: '时' },

    // Navigator (L1)
    'nav.days': { en: 'days', ko: '일', zh: '天' },
    'nav.best': { en: 'Best at', ko: '최적 시점', zh: '最佳时间' },
    'nav.safety': { en: 'Safety', ko: '안전', zh: '安全' },
    'nav.expert': { en: 'Expert', ko: '전문가', zh: '专家' },
    'nav.why': { en: 'Why this result?', ko: '왜 이런 결과일까?', zh: '为什么是这个结果？' },
    'nav.calculating': { en: 'Calculating\u2026', ko: '계산 중\u2026', zh: '计算中\u2026' },

    // Judgment words (dashboard status)
    'judge.excellent': { en: 'Excellent', ko: '매우 좋음', zh: '非常好' },
    'judge.good': { en: 'Good flavor', ko: '좋은 풍미', zh: '风味良好' },
    'judge.improving': { en: 'Improving', ko: '발전 중', zh: '逐渐变好' },
    'judge.developing': { en: 'Developing', ko: '발효 진행 중', zh: '发酵进行中' },
    'judge.overSour': { en: 'Over-sour', ko: '과숙', zh: '过酸' },
    'judge.safe': { en: 'Safe', ko: '안전', zh: '安全' },
    'judge.caution': { en: 'Caution', ko: '주의', zh: '注意' },
    'judge.danger': { en: 'High risk', ko: '위험', zh: '高风险' },

    // Status sentences (L1 panel)
    'judge.flavor.excellent': {
      en: 'Peak flavor \u2014 best time to eat',
      ko: '최적 풍미 \u2014 먹기 가장 좋은 시점',
      zh: '风味巅峰 \u2014 最佳食用时机'
    },
    'judge.flavor.good': {
      en: 'Good flavor, approaching peak',
      ko: '좋은 풍미, 최적기에 가까움',
      zh: '风味不错，即将到达顶峰'
    },
    'judge.flavor.rising': {
      en: 'Flavor is rising \u2014 peak coming soon',
      ko: '풍미가 상승 중 \u2014 곧 최적기',
      zh: '风味正在上升 \u2014 顶峰即将到来'
    },
    'judge.flavor.developing': {
      en: 'Flavor still developing, be patient',
      ko: '풍미가 아직 발달 중, 기다려 주세요',
      zh: '风味还在发展中，请耐心等待'
    },
    'judge.acid.mild': {
      en: 'Acidity: very mild \u2014 not sour yet',
      ko: '산도: 매우 순함 \u2014 아직 시지 않음',
      zh: '酸度：很温和 \u2014 还没变酸'
    },
    'judge.acid.balanced': {
      en: 'Acidity: balanced \u2014 perfect tang',
      ko: '산도: 균형 잡힘 \u2014 완벽한 산미',
      zh: '酸度：恰到好处 \u2014 完美的酸爽'
    },
    'judge.acid.sour': {
      en: 'Acidity: getting sour \u2014 good for cooking',
      ko: '산도: 시어지는 중 \u2014 요리용으로 좋음',
      zh: '酸度：偏酸 \u2014 适合做菜'
    },
    'judge.acid.verySour': {
      en: 'Acidity: very sour \u2014 best for stews & fried rice',
      ko: '산도: 매우 시큼 \u2014 찌개 & 볶음밥에 최적',
      zh: '酸度：很酸 \u2014 适合做汤和炒饭'
    },
    'judge.safety.clear': {
      en: 'Nitrite has cleared \u2014 safe to eat',
      ko: '아질산염 안전 수준 \u2014 먹어도 됩니다',
      zh: '亚硝酸盐已清除 \u2014 可以安全食用'
    },
    'judge.safety.caution': {
      en: 'Nitrite still elevated \u2014 wait a bit longer',
      ko: '아질산염이 아직 높음 \u2014 조금 더 기다리세요',
      zh: '亚硝酸盐仍偏高 \u2014 再等等'
    },
    'judge.safety.risk': {
      en: 'Nitrite high \u2014 do not eat yet',
      ko: '아질산염 높음 \u2014 아직 먹지 마세요',
      zh: '亚硝酸盐偏高 \u2014 暂勿食用'
    },

    // Explain panel (L2)
    'explain.status': { en: 'Fermentation Status', ko: '발효 상태', zh: '发酵状态' },
    'explain.dominant': { en: 'dominant', ko: '우세', zh: '占优' },
    'explain.acid.high': { en: 'pH still high (mild)', ko: 'pH가 아직 높음 (순함)', zh: 'pH仍较高（温和）' },
    'explain.acid.high.effect': { en: 'Not sour yet, fermentation just starting', ko: '아직 시지 않음, 발효 시작 단계', zh: '还没变酸，发酵刚刚开始' },
    'explain.acid.balanced': { en: 'pH in sweet spot', ko: 'pH가 적정 범위', zh: 'pH在最佳区间' },
    'explain.acid.balanced.effect': { en: 'Perfect acidity for eating', ko: '먹기 좋은 완벽한 산도', zh: '酸度恰好适合食用' },
    'explain.acid.low': { en: 'pH very low (sour)', ko: 'pH가 매우 낮음 (시큼)', zh: 'pH很低（偏酸）' },
    'explain.acid.low.effect': { en: 'Too sour for most \u2014 use in cooking', ko: '대부분에게 너무 시큼 \u2014 요리에 사용', zh: '对多数人来说太酸 \u2014 适合做菜' },
    'explain.safety.clear': { en: 'Nitrite below safe line', ko: '아질산염 안전선 이하', zh: '亚硝酸盐低于安全线' },
    'explain.safety.clear.effect': { en: 'No safety concern', ko: '안전 우려 없음', zh: '没有安全隐患' },
    'explain.safety.risk': { en: 'Nitrite still above threshold', ko: '아질산염이 기준치 이상', zh: '亚硝酸盐仍超标' },
    'explain.safety.risk.effect': { en: 'Wait for LAB to clear it', ko: '유산균이 제거할 때까지 기다리세요', zh: '等乳酸菌将其清除' },

    // Fermentation timeline
    'ferment.title': { en: 'Making Process', ko: '제작 과정', zh: '制作过程' },
    'ferment.prep': { en: 'Preparation', ko: '준비', zh: '装坛' },
    'ferment.nav.calc': { en: 'Recipe Calculator', ko: '배합 계산기', zh: '配方计算器' },
    'ferment.nav.recipe': { en: 'Standard Recipe', ko: '표준 레시피', zh: '标准配方与流程' },
    'ferment.pickle': { en: 'Pickling complete', ko: '절임 완료', zh: '装坛完成' },
    'ferment.completeTime': { en: 'Completion time:', ko: '완료 시간:', zh: '完成时间：' },
    'ferment.ripenMethod': { en: 'Ripening method', ko: '숙성 방식', zh: '熟成方式' },
    'ferment.room': { en: 'Room temp rest', ko: '실온 숙성', zh: '室温静置' },
    'ferment.fridge': { en: 'Refrigerate', ko: '냉장 보관', zh: '冰箱冷藏' },
    'ferment.accel': { en: 'Room temp boost', ko: '실온 가속', zh: '室温加速' },
    'ferment.addAccel': { en: '+ Room temp boost', ko: '+ 실온 가속 추가', zh: '+ 添加室温加速' },
    'ferment.removeAccel': { en: 'Remove', ko: '삭제', zh: '删除' },
    'ferment.best': { en: 'Best flavor', ko: '최적 풍미', zh: '最佳风味' },
    'ferment.overSour': { en: 'Over-sour', ko: '과발효', zh: '过酸' },
    'ferment.end': { en: 'End (+7 days)', ko: '종료 (+7일)', zh: '终止（过酸+7天）' },
    'ferment.calcBtn': { en: 'Start Calculation', ko: '계산 시작', zh: '开始计算' },
    'dash.phAtBest': { en: 'pH at best flavor', ko: '최적 풍미 시 pH', zh: '최佳风味时 pH' },
    'ferment.ph435': { en: 'pH reaches 4.35', ko: 'pH 4.35 도달', zh: 'pH 降至 4.35' },
    'microbe.atNow': { en: 'Now', ko: '현재', zh: '当前' },
    'dash.nitriteClear': { en: 'Nitrite clears — safe to eat', ko: '아질산염 소멸 — 안전 섭취 가능', zh: '亚硝酸盐消退 · 可以开始吃' },
    'dash.bestFlavor': { en: 'Best flavor window', ko: '최적 풍미 구간', zh: '最佳风味' },
    'dash.lastEdible': { en: 'Over-sour — last good window', ko: '과숙 — 마지막 섭취 구간', zh: '过酸 · 最后宜食窗口' },
    'dash.starterReady': { en: 'Use as starter brine (母水)', ko: '종균으로 사용 가능 (묵은지국물)', zh: '可作母水（老泡菜液）' },
    'dash.nextBatch': { en: 'Add 5-10% of this brine to your next batch for faster, more consistent fermentation.', ko: '다음 배치에 이 국물의 5-10%를 넣으면 더 빠르고 안정적인 발효가 가능합니다.', zh: '下次做泡菜时加入 5-10% 这坛老汤，发酵更快更稳定。' },
    'dash.title': { en: 'Batch Timeline', ko: '배치 타임라인', zh: '这坛时间线' },
    'dash.batchTitle': { en: 'This Batch', ko: '이 배치', zh: '这坛泡菜' },
    'dash.currentDay': { en: 'Current', ko: '현재', zh: '当前' },
    'dash.bestDay': { en: 'Best flavor at', ko: '최적 풍미', zh: '最佳风味' },
    'dash.statusLabel': { en: 'Current status', ko: '현재 상태', zh: '当前状态' },
    'insight.rising': { en: 'Flavor is rising — getting better every day', ko: '풍미 상승 중 — 매일 더 좋아지고 있어요', zh: '风味正在上升，一天比一天好' },
    'insight.peak': { en: 'Peak flavor window — eat now for best taste!', ko: '최적 풍미 구간 — 지금 먹으면 가장 맛있어요!', zh: '最佳风味窗口 — 现在吃最好！' },
    'insight.balanced': { en: 'Acidity is balanced — pleasant tanginess', ko: '산도 균형 — 적절한 새콤함', zh: '酸度适中，口感平衡' },
    'insight.safe': { en: 'Already in the safe eating zone', ko: '이미 안전 섭취 구간입니다', zh: '已进入安全食用区间' },
    'insight.notSafe': { en: 'Nitrite still elevated — wait a bit longer', ko: '아질산염 아직 높음 — 조금 더 기다리세요', zh: '亚硝酸盐尚未消退，再等等' },
    'insight.overSoon': { en: 'Will become noticeably sour if left longer', ko: '더 두면 눈에 띄게 시어집니다', zh: '再发酵会明显变酸' },
    'insight.over': { en: 'Over-sour — good for stews and fried rice now', ko: '과숙 — 지금은 찌개나 볶음밥에 좋아요', zh: '已过酸 — 适合做汤、炒饭' },
    'insight.developing': { en: 'Still developing — mild flavor, needs more time', ko: '아직 발효 초기 — 순한 맛, 시간이 더 필요해요', zh: '仍在初期发酵，味道偏淡，需要更多时间' },
    'status.developing': { en: 'Developing', ko: '발효 중', zh: '发酵中' },
    'status.improving': { en: 'Improving', ko: '풍미 상승', zh: '风味上升' },
    'status.optimal': { en: 'Optimal', ko: '최적', zh: '最佳' },
    'status.declining': { en: 'Declining', ko: '풍미 하락', zh: '风味下降' },
    'status.overSour': { en: 'Over-sour', ko: '과숙', zh: '过酸' },
    'ferment.moveToFridge': { en: 'Move to fridge', ko: '냉장고 이동', zh: '移入冰箱' },
    'ferment.afterHours': { en: 'after h in fridge', ko: '냉장 후', zh: '冷藏后' },
    'ferment.elapsed': { en: 'Elapsed', ko: '경과', zh: '已经过' },
    'ferment.making': { en: 'Making Process', ko: '제조 과정', zh: '制作阶段' },
    'ferment.makingSub': { en: 'Expand for process & calculator', ko: '공정 및 계산기 펼치기', zh: '可展开详细流程与用量计算器' },

    // Scoring breakdown (L2)
    'score.title': {
      en: 'How the score is calculated',
      ko: '점수 산출 기준',
      zh: '评分是怎么算的'
    },
    'score.ph.label': {
      en: 'pH proximity to 4.35',
      ko: 'pH 4.35 근접도',
      zh: 'pH 接近 4.35 的程度'
    },
    'score.acid.label': {
      en: 'Lactic acid near 0.6%',
      ko: '젖산 0.6% 근접도',
      zh: '乳酸接近 0.6% 的程度'
    },
    'score.microbe.label': {
      en: 'Leuconostoc proportion',
      ko: 'Leuconostoc 비율',
      zh: '明串珠菌占比'
    },
    'score.weight': {
      en: 'weight',
      ko: '가중치',
      zh: '权重'
    },

    // Extend flavor advice (L2)
    'extend.title': {
      en: 'How to extend peak flavor',
      ko: '최적 풍미를 오래 유지하는 법',
      zh: '如何延长最佳风味'
    },
    'extend.chill': {
      en: 'Move to fridge (2-4\u00B0C) right at peak to slow fermentation',
      ko: '풍미 최적기에 냉장고(2-4\u00B0C)로 옮겨 발효를 늦추세요',
      zh: '在风味顶峰时移入冰箱（2-4\u00B0C）以减缓发酵'
    },
    'extend.salt': {
      en: 'Slightly higher salt (2.5-3.5%) stretches the optimal window',
      ko: '소금 농도를 약간 높이면(2.5-3.5%) 최적 구간이 늘어납니다',
      zh: '适当提高盐浓度（2.5-3.5%）可以拉长最佳窗口'
    },
    'extend.starter': {
      en: 'Less starter = slower start = longer window before over-souring',
      ko: '종균을 줄이면 = 시작이 느려져 = 과숙까지 시간이 길어집니다',
      zh: '少用母水 = 起步更慢 = 到过酸之前的窗口更长'
    },
    'extend.stage': {
      en: 'Use 2-stage: warm start (6-10h) then fridge for deep, slow development',
      ko: '2단계 활용: 따뜻한 시작(6-10시간) → 냉장으로 깊고 느린 발달',
      zh: '用两段式：先室温启动（6-10小时）再冷藏慢熟'
    },
    'extend.already.cold': {
      en: 'Already using cold fermentation \u2014 your peak window is naturally longer',
      ko: '이미 저온 발효 중 \u2014 최적 구간이 자연히 깁니다',
      zh: '已在低温发酵 \u2014 最佳窗口本身就较长'
    },
    'extend.reduce.starter': {
      en: 'Try reducing starter to {n}% for a wider peak window',
      ko: '종균을 {n}%로 줄이면 최적 구간이 넓어집니다',
      zh: '试试把母水减到 {n}% 以拓宽最佳窗口'
    },
    'extend.add.cold.stage': {
      en: 'Add a cold stage (4\u00B0C) after the warm start to stretch flavor development',
      ko: '따뜻한 시작 후 저온 단계(4\u00B0C)를 추가하면 풍미 발달이 길어집니다',
      zh: '在温暖启动后加一段冷藏（4\u00B0C）以延展风味'
    }
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

    var titleEls = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < titleEls.length; k++) {
      titleEls[k].setAttribute('title', t(titleEls[k].getAttribute('data-i18n-title')));
    }

    var ariaEls = document.querySelectorAll('[data-i18n-aria-label]');
    for (var m = 0; m < ariaEls.length; m++) {
      ariaEls[m].setAttribute('aria-label', t(ariaEls[m].getAttribute('data-i18n-aria-label')));
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
