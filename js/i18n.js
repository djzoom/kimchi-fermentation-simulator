/**
 * Kimchi Fermentation Simulator — Internationalization
 * Trilingual: English (en) / Korean (ko) / Chinese (zh)
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.i18n = (function () {
  'use strict';

  var strings = {
    'app.title': {
      en: 'Kimchi Dynamics',
      ko: '김치 동역학',
      zh: '泡菜动力学',
      de: 'Fermentationsdynamik'
    },
    'app.subtitle': {
      en: 'Process prediction & flavor assessment based on fermentation kinetics',
      ko: '발효 동역학 기반 과정 예측 및 풍미 평가',
      zh: '基于发酵动力学的过程预测与风味评估',
      de: 'Prozessvorhersage & Geschmacksbewertung auf Basis der G\u00e4rungskinetik'
    },
    'app.subtitleShort': {
      en: 'Process prediction & flavor assessment based on fermentation kinetics',
      ko: '발효 동역학 기반 과정 예측 및 풍미 평가',
      zh: '基于发酵动力学的过程预测与风味评估',
      de: 'Prozessvorhersage & Geschmacksbewertung auf Basis der G\u00e4rungskinetik'
    },
    'lang.toggle': {
      en: '中文',
      ko: 'English',
      zh: '한국어',
      de: 'English'
    },
    'info.more': {
      en: 'More info',
      ko: '자세히 보기',
      zh: '更多说明',
      de: 'Mehr Infos'
    },
    'hero.kicker': {
      en: 'Kimchi, explained for real kitchens',
      ko: '실제 부엌을 위한 김치 설명서',
      zh: '写给真实厨房场景的 Kimchi 说明书',
      de: 'Kimchi, erklärt für echte Küchen'
    },
    'hero.title': {
      en: 'See how salt, time, and temperature turn cabbage into lively, balanced kimchi.',
      ko: '소금, 시간, 온도가 배추를 생기 있고 균형 잡힌 김치로 바꾸는 과정을 보세요.',
      zh: '看看盐、时间和温度如何把白菜变成鲜活而平衡的 Kimchi。',
      de: 'Sehen Sie, wie Salz, Zeit und Temperatur Kohl in lebendiges, ausgewogenes Kimchi verwandeln.'
    },
    'hero.body': {
      en: 'Move the controls like a recipe, watch the chart respond instantly, and use the notes below to learn what makes kimchi crisp, tangy, safe, and deeply aromatic.',
      ko: '레시피를 조정하듯 컨트롤을 움직이고, 차트가 즉시 반응하는 모습을 보세요. 아래 설명을 통해 김치를 아삭하고, 새콤하고, 안전하고, 향기롭게 만드는 요소를 이해할 수 있습니다.',
      zh: '像调整配方一样移动控件，观察图表即时变化，并通过下方说明理解什么让 Kimchi 爽脆、酸香、安全且富有层次。',
      de: 'Bewegen Sie die Regler wie bei einem Rezept, beobachten Sie die sofortige Reaktion im Diagramm und erfahren Sie, was Kimchi knackig, säuerlich, sicher und aromatisch macht.'
    },
    'intro.fact1.title': {
      en: 'Start with the red score line',
      ko: '먼저 빨간 점수 곡선을 보세요',
      zh: '先看红色评分曲线',
      de: 'Beginnen Sie mit der roten Bewertungslinie'
    },
    'intro.fact1.body': {
      en: 'It summarizes taste, aroma, and texture so first-time visitors know where to look.',
      ko: '맛, 향, 식감을 하나로 요약해 처음 보는 사람도 어디를 봐야 할지 바로 알 수 있습니다.',
      zh: '它把味道、香气和口感合成一个结果，让第一次看的用户也知道先看哪里。',
      de: 'Sie fasst Geschmack, Aroma und Textur zusammen, damit Erstbesucher sofort wissen, worauf sie achten müssen.'
    },
    'intro.fact2.title': {
      en: 'Use the colored bands as a story',
      ko: '색 띠를 발효 이야기로 읽어보세요',
      zh: '把彩色阶段带当作发酵故事来读',
      de: 'Lesen Sie die Farbbänder wie eine Geschichte'
    },
    'intro.fact2.body': {
      en: 'Each phase shows which friendly bacteria are leading the fermentation and what that means for flavor.',
      ko: '각 단계는 어떤 유익균이 발효를 주도하는지, 그리고 그것이 풍미에 어떤 의미인지 보여줍니다.',
      zh: '每个阶段都会告诉你是哪类有益菌在主导发酵，以及这会怎样改变风味。',
      de: 'Jede Phase zeigt, welche nützlichen Bakterien die Fermentation anführen und was das für den Geschmack bedeutet.'
    },
    'intro.fact3.title': {
      en: 'Watch the nitrite warning carefully',
      ko: '아질산염 경고도 꼭 함께 보세요',
      zh: '别忽略亚硝酸盐提示',
      de: 'Achten Sie genau auf die Nitrit-Warnung'
    },
    'intro.fact3.body': {
      en: 'Kimchi is not only about taste. This model also estimates how nitrate reserve, brine strength, and acidification shape the safer eating window.',
      ko: '김치는 맛만의 문제가 아닙니다. 이 모델은 질산염 저장량, 염도, 산성화 속도가 더 안전한 섭취 구간을 어떻게 만드는지도 함께 추정합니다.',
      zh: 'Kimchi 不只关乎味道。这个模型也会估算硝酸根储量、盐水强度和酸化速度如何共同决定更安全的食用窗口。',
      de: 'Kimchi dreht sich nicht nur um Geschmack. Dieses Modell schätzt auch, wie Nitratreserve, Salzstärke und Säurebildung das sichere Essfenster formen.'
    },

    // Stages
    'controls.stages': {
      en: 'Fermentation Stages',
      ko: '발효 단계',
      zh: '发酵阶段',
      de: 'Fermentationsstufen'
    },
    'controls.stageTemp': {
      en: 'Temp',
      ko: '온도',
      zh: '温度',
      de: 'Temp.'
    },
    'controls.stageDur': {
      en: 'Duration',
      ko: '시간',
      zh: '时长',
      de: 'Dauer'
    },
    'controls.singleStage': {
      en: 'Single Stage',
      ko: '단일 단계',
      zh: '单阶段',
      de: 'Einstufig'
    },
    'controls.multiStage': {
      en: 'Multi-Stage',
      ko: '다단계',
      zh: '多阶段',
      de: 'Mehrstufig'
    },

    // Controls
    'controls.title': {
      en: 'Fermentation Parameters',
      ko: '발효 매개변수',
      zh: '发酵参数',
      de: 'Fermentationsparameter'
    },
    'controls.subtitle': {
      en: 'Keep the household presets if you are learning, or edit each stage as if you were planning a real batch.',
      ko: '처음이라면 가정용 프리셋을 그대로 사용하고, 익숙하다면 실제 배치를 설계하듯 단계를 직접 수정해 보세요.',
      zh: '如果你正在入门，可以先用家用预设；熟悉以后，也可以像规划真实一坛泡菜那样逐段修改。',
      de: 'Behalten Sie die Haushalts-Voreinstellungen beim Lernen, oder passen Sie jede Stufe an wie bei einer echten Charge.'
    },
    'controls.stageHelp': {
      en: 'Warm stages wake the microbes up. Cold stages stretch flavor development and keep texture crisp.',
      ko: '따뜻한 단계는 미생물을 깨우고, 차가운 단계는 풍미 발달을 길게 끌어가며 식감을 더 아삭하게 유지합니다.',
      zh: '温暖阶段负责唤醒菌群，低温阶段负责拉长风味发展并帮助保持爽脆口感。',
      de: 'Warme Stufen wecken die Mikroben. Kalte Stufen verlängern die Geschmacksentwicklung und halten die Textur knackig.'
    },
    'controls.addStage': {
      en: 'Add stage',
      ko: '단계 추가',
      zh: '添加阶段',
      de: 'Stufe hinzufügen'
    },
    'controls.removeStage': {
      en: 'Remove stage',
      ko: '단계 삭제',
      zh: '删除阶段',
      de: 'Stufe entfernen'
    },
    'presets.label': {
      en: 'Quick presets',
      ko: '빠른 프리셋',
      zh: '快速预设',
      de: 'Schnellvorlagen'
    },
    'preset.classic': {
      en: 'Classic Home',
      ko: '가정 기본',
      zh: '家常经典',
      de: 'Klassisch'
    },
    'preset.weekend': {
      en: 'Weekend Fast',
      ko: '주말 빠르게',
      zh: '周末快成',
      de: 'Schnell'
    },
    'preset.slow': {
      en: 'Cold Slow',
      ko: '저온 천천히',
      zh: '冷藏慢熟',
      de: 'Kalt & langsam'
    },
    'preset.manual': {
      en: 'Manual',
      ko: '수동 입력',
      zh: '手动输入',
      de: 'Manuell'
    },

    // Sliders
    'slider.temp': {
      en: 'Temperature',
      ko: '온도',
      zh: '温度',
      de: 'Temperatur'
    },
    'slider.salt': {
      en: 'Salt Concentration',
      ko: '소금 농도',
      zh: '盐浓度',
      de: 'Salzkonzentration'
    },
    'slider.starter': {
      en: 'Starter Culture',
      ko: '종균 (묵은지국물)',
      zh: '母水（老泡菜发酵液）',
      de: 'Starterkultur'
    },
    'slider.starter.hint': {
      en: 'Old kimchi brine — natural LAB inoculant (backslopping)',
      ko: '묵은지국물 — 천연 유산균 종균',
      zh: '旧泡菜发酵液 — 天然乳酸菌种子液',
      de: 'Alte Kimchi-Lake — natürliches LAB-Inokulum (Rückführung)'
    },

    // Phases
    'phase.initial': {
      en: 'Initial',
      ko: '초기',
      zh: '初期',
      de: 'Anfang'
    },
    'phase.optimal': {
      en: 'Optimal',
      ko: '최적숙성',
      zh: '最佳熟成',
      de: 'Optimal'
    },
    'phase.over': {
      en: 'Over-ripened',
      ko: '과숙',
      zh: '过熟',
      de: '\u00dcberreif'
    },
    'phase.initial.sub': {
      en: 'L. sakei dominant',
      ko: 'L. sakei 우세',
      zh: 'L. sakei 主导',
      de: 'L. sakei dominant'
    },
    'phase.optimal.sub': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides',
      zh: 'Leuc. mesenteroides 主导',
      de: 'Leuc. mesenteroides'
    },
    'phase.over.sub': {
      en: 'L. plantarum dominant',
      ko: 'L. plantarum 우세',
      zh: 'L. plantarum 主导',
      de: 'L. plantarum dominant'
    },
    'phase.title': {
      en: 'Fermentation story at a glance',
      ko: '한눈에 보는 발효 이야기',
      zh: '一眼看懂发酵进程',
      de: 'Die Fermentation auf einen Blick'
    },
    'phase.body': {
      en: 'The marker shows where your current settings reach their best flavor moment.',
      ko: '마커는 현재 설정에서 풍미가 가장 좋아지는 시점을 보여줍니다.',
      zh: '标记会告诉你当前设置下风味达到最佳的时刻。',
      de: 'Die Markierung zeigt, wann Ihre aktuellen Einstellungen den besten Geschmack erreichen.'
    },

    // Stats
    'stat.optimalTime': {
      en: 'Optimal Time',
      ko: '최적 시간',
      zh: '最佳时间',
      de: 'Optimale Zeit'
    },
    'stat.ph': {
      en: 'pH at Optimal',
      ko: '최적 pH',
      zh: '最佳pH',
      de: 'pH bei Optimum'
    },
    'stat.acid': {
      en: 'Lactic Acid',
      ko: '젖산',
      zh: '乳酸',
      de: 'Milchsäure'
    },
    'stat.bacteria': {
      en: 'Dominant LAB',
      ko: '우세 유산균',
      zh: '优势菌种',
      de: 'Dominante LAB'
    },
    'stat.flavor': {
      en: 'Flavor Score',
      ko: '풍미 점수',
      zh: '风味评分',
      de: 'Geschmacksbewertung'
    },

    // Charts
    'chart.main.title': {
      en: 'Fermentation Dynamics',
      ko: '발효 역학',
      zh: '发酵动力学',
      de: 'Fermentationsdynamik'
    },
    'chart.microbe.title': {
      en: 'Microbial Succession',
      ko: '미생물 천이',
      zh: '微生物演替',
      de: 'Mikrobielle Sukzession'
    },
    'chart.flavor.title': {
      en: 'Flavor Score',
      ko: '풍미 점수',
      zh: '风味评分曲线',
      de: 'Geschmacksbewertung'
    },
    'chart.xaxis': {
      en: 'Time (days)',
      ko: '시간 (일)',
      zh: '时间（天）',
      de: 'Zeit (Tage)'
    },
    'chart.ph': {
      en: 'pH',
      ko: 'pH',
      zh: 'pH',
      de: 'pH'
    },
    'chart.lab': {
      en: 'LAB (log CFU/g)',
      ko: '유산균 (log CFU/g)',
      zh: '乳酸菌 (log CFU/g)',
      de: 'LAB (log CFU/g)'
    },
    'chart.acid': {
      en: 'Lactic Acid (%)',
      ko: '젖산 (%)',
      zh: '乳酸 (%)',
      de: 'Milchsäure (%)'
    },
    'chart.sakei': {
      en: 'L. sakei',
      ko: 'L. sakei',
      zh: 'L. sakei (清酒乳杆菌)',
      de: 'L. sakei'
    },
    'chart.mesenteroides': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides',
      zh: 'Leuc. mesenteroides (肠膜明串珠菌)',
      de: 'Leuc. mesenteroides'
    },
    'chart.plantarum': {
      en: 'L. plantarum',
      ko: 'L. plantarum',
      zh: 'L. plantarum (植物乳杆菌)',
      de: 'L. plantarum'
    },
    'chart.proportion': {
      en: 'Proportion (%)',
      ko: '비율 (%)',
      zh: '比例 (%)',
      de: 'Anteil (%)'
    },
    'chart.score': {
      en: 'Score',
      ko: '점수',
      zh: '评分',
      de: 'Bewertung'
    },
    'chart.flavor.yaxis': {
      en: 'Flavor score (0–100): how close pH is to the ideal 4.35 (50%) + whether lactic acid is at its sweet spot (30%) + proportion of aroma-producing Leuconostoc bacteria (20%)',
      ko: '풍미 점수 (0–100): pH가 이상적인 4.35에 얼마나 가까운지 (50%) + 젖산이 적정 수준인지 (30%) + 향미를 내는 Leuconostoc 균의 비율 (20%)',
      zh: '风味评分（0–100）：pH 与最佳值 4.35 的接近程度（占 50%）+ 乳酸是否处于最佳浓度（占 30%）+ 产香菌肠膜明串珠菌的占比（占 20%）',
      de: 'Geschmackswert (0–100): Nähe des pH zum Idealwert 4,35 (50%) + ob die Milchsäure im optimalen Bereich liegt (30%) + Anteil der aromabildenden Leuconostoc-Bakterien (20%)'
    },
    'chart.optimal': {
      en: 'Optimal',
      ko: '최적',
      zh: '最佳',
      de: 'Optimal'
    },
    'chart.flavor.subtitle': {
      en: 'Start simple with the score, then turn on pH, acid, LAB, or microbe lines when you want more detail.',
      ko: '먼저 점수 곡선으로 전체를 보고, 필요할 때 pH, 산도, 유산균, 균종 곡선을 켜서 더 깊게 읽어보세요.',
      zh: '先用评分曲线把整体读懂，再按需打开 pH、酸度、乳酸菌或菌群曲线查看细节。',
      de: 'Beginnen Sie mit der Bewertung, dann schalten Sie pH, Säure, LAB oder Mikrobenlinien ein, wenn Sie mehr Details möchten.'
    },
    'chart.toolbar': {
      en: 'Show on chart',
      ko: '차트에 표시',
      zh: '主图显示',
      de: 'Im Diagramm anzeigen'
    },
    'chart.toggle.score': {
      en: 'Score',
      ko: '점수',
      zh: '评分',
      de: 'Bewertung'
    },
    'chart.toggle.nitrite': {
      en: 'Nitrite',
      ko: '아질산염',
      zh: '亚硝酸盐',
      de: 'Nitrit'
    },
    'chart.toggle.ph': {
      en: 'pH',
      ko: 'pH',
      zh: 'pH',
      de: 'pH'
    },
    'chart.toggle.acid': {
      en: 'Acid',
      ko: '산도',
      zh: '酸度',
      de: 'Säure'
    },
    'chart.toggle.lab': {
      en: 'LAB',
      ko: '유산균',
      zh: '乳酸菌',
      de: 'LAB'
    },
    'chart.toggle.microbes': {
      en: 'Microbes',
      ko: '균종',
      zh: '优势菌',
      de: 'Mikroben'
    },
    'chart.excellent': {
      en: 'Excellent',
      ko: '매우 좋음',
      zh: '优秀',
      de: 'Ausgezeichnet'
    },
    'chart.axis.no2': {
      en: 'Nitrite (mg/kg)',
      ko: '아질산염 (mg/kg)',
      zh: '亚硝酸盐 (mg/kg)',
      de: 'Nitrit (mg/kg)'
    },
    'chart.axis.ph': {
      en: 'pH / Lactic Acid',
      ko: 'pH / 젖산',
      zh: 'pH / 乳酸',
      de: 'pH / Milchsäure'
    },
    'chart.nitrite.safeLine': {
      en: 'Safe line 3 mg/kg',
      ko: '안전선 3 mg/kg',
      zh: '安全线 3 mg/kg',
      de: 'Sicherheitsgrenze 3 mg/kg'
    },
    'dominance.title': {
      en: 'Dominant microbes across the whole story',
      ko: '발효 전 과정의 우세 미생물',
      zh: '整段发酵过程中的优势菌群',
      de: 'Dominante Mikroben über den gesamten Verlauf'
    },
    'dominance.initial.note': {
      en: 'Builds a clean, fresh start.',
      ko: '깔끔하고 신선한 출발을 만듭니다.',
      zh: '让发酵从干净、新鲜的状态起步。',
      de: 'Sorgt für einen sauberen, frischen Start.'
    },
    'dominance.optimal.note': {
      en: 'Brings sparkle, aroma, and balance.',
      ko: '탄산감, 향, 균형감을 더합니다.',
      zh: '带来轻盈气泡感、香气与平衡。',
      de: 'Bringt Prickeln, Aroma und Ausgewogenheit.'
    },
    'dominance.over.note': {
      en: 'Pushes the batch into deeper sourness.',
      ko: '배치를 더 깊고 강한 신맛으로 이끕니다.',
      zh: '把这一坛推向更深、更强的酸味。',
      de: 'Treibt die Charge in tiefere Säure.'
    },
    'guide.title': {
      en: 'How to read this simulator',
      ko: '이 시뮬레이터 읽는 법',
      zh: '如何读懂这个模拟器',
      de: 'So lesen Sie diesen Simulator'
    },
    'guide.body': {
      en: 'You do not need a lab background. Read the chart in three simple passes.',
      ko: '실험실 배경지식이 없어도 됩니다. 세 단계로 차트를 읽어보세요.',
      zh: '你不需要实验室背景。按三步读图就够了。',
      de: 'Sie brauchen keinen Laborhintergrund. Lesen Sie das Diagramm in drei einfachen Schritten.'
    },
    'guide.step1.title': {
      en: 'Find the best eating window',
      ko: '가장 맛있는 먹는 시점을 찾기',
      zh: '先找到最佳食用窗口',
      de: 'Finden Sie das beste Essfenster'
    },
    'guide.step1.body': {
      en: 'Read the red score line and the green dashed marker first. That is your fastest route to “when should I eat this batch?”.',
      ko: '빨간 점수 곡선과 초록 점선을 먼저 보세요. “이 배치는 언제 먹으면 좋은가?”에 가장 빠르게 답해줍니다.',
      zh: '先看红色评分曲线和绿色虚线，它们最快告诉你“这一坛什么时候最好吃”。',
      de: 'Schauen Sie zuerst auf die rote Bewertungslinie und die grüne Strichmarkierung. Das ist der schnellste Weg zu „Wann sollte ich diese Charge essen?".'
    },
    'guide.step2.title': {
      en: 'Check safety before enthusiasm',
      ko: '맛보다 먼저 안전을 확인하기',
      zh: '在兴奋之前先看安全',
      de: 'Sicherheit vor Begeisterung prüfen'
    },
    'guide.step2.body': {
      en: 'The nitrite line is recalculated from nitrate reserve, sodium strength, temperature stages, and LAB cleanup. Read flavor and safety together before tasting early.',
      ko: '아질산염 곡선은 질산염 저장량, Na\u207A 강도, 온도 단계, 유산균 정리 속도를 함께 반영해 다시 계산됩니다. 초기에 맛보기 전에는 풍미와 안전을 같이 읽어야 합니다.',
      zh: '亚硝酸盐曲线会根据硝酸根储量、Na\u207A 强度、温度阶段和乳酸菌清除速度重新计算。想早尝时，风味和安全要一起看。',
      de: 'Die Nitritlinie wird aus Nitratreserve, Na⁺-Stärke, Temperaturstufen und LAB-Abbau neu berechnet. Lesen Sie Geschmack und Sicherheit zusammen, bevor Sie früh probieren.'
    },
    'guide.step3.title': {
      en: 'Use the microbe story to understand taste',
      ko: '균종의 이야기를 통해 맛을 이해하기',
      zh: '通过菌群变化理解味道',
      de: 'Nutzen Sie die Mikrobengeschichte, um den Geschmack zu verstehen'
    },
    'guide.step3.body': {
      en: 'The phase bands and microbe cards explain why kimchi tastes fresh, sparkly, or deep and sour at different points.',
      ko: '단계 띠와 균종 카드는 김치가 어떤 시점에는 신선하고, 어떤 시점에는 톡 쏘고, 또 어떤 시점에는 깊고 시게 느껴지는 이유를 설명합니다.',
      zh: '阶段带和菌群卡会解释为什么 Kimchi 在不同时间点会呈现清新、活泼或深沉偏酸的味道。',
      de: 'Die Phasenbänder und Mikrobenkarten erklären, warum Kimchi zu verschiedenen Zeitpunkten frisch, prickelnd oder tief und sauer schmeckt.'
    },
    'microbe.board.title': {
      en: 'Dominant bacteria at each stage',
      ko: '각 단계의 우세 균종',
      zh: '各阶段优势菌群',
      de: 'Dominante Bakterien in jeder Phase'
    },
    'microbe.board.body': {
      en: 'These are the main friendly bacteria behind kimchi flavor. The highlighted card and percentages update with your parameters in real time.',
      ko: '이들은 김치 풍미를 만드는 주요 유익균입니다. 강조된 카드와 비율은 현재 파라미터에 따라 실시간으로 바뀝니다.',
      zh: '这些是塑造 Kimchi 风味的主要有益菌。高亮卡片和占比会随着参数实时变化。',
      de: 'Das sind die wichtigsten nützlichen Bakterien hinter dem Kimchi-Geschmack. Die hervorgehobene Karte und die Prozentwerte aktualisieren sich in Echtzeit mit Ihren Parametern.'
    },
    'microbe.atPeak': {
      en: 'At peak flavor',
      ko: '최적 풍미 시점',
      zh: '最佳风味时',
      de: 'Bei bestem Geschmack'
    },
    'microbe.sakei.name': {
      en: 'L. sakei',
      ko: 'L. sakei (청주유산균)',
      zh: 'L. sakei (清酒乳杆菌)',
      de: 'L. sakei'
    },
    'microbe.sakei.role': {
      en: 'Early stabilizer',
      ko: '초기 안정화 담당',
      zh: '早期稳定者',
      de: 'Früher Stabilisator'
    },
    'microbe.sakei.body': {
      en: 'Helps the batch settle in, keeps the taste fresh, and prepares the way for deeper fermentation.',
      ko: '배치가 안정적으로 시작되도록 돕고, 맛을 신선하게 유지하며, 다음 단계 발효의 바탕을 만듭니다.',
      zh: '帮助这一坛顺利进入状态，保持清新口感，并为后续更深的发酵打底。',
      de: 'Hilft der Charge beim Einpendeln, hält den Geschmack frisch und bereitet den Weg für tiefere Fermentation.'
    },
    'microbe.mesenteroides.name': {
      en: 'Leuc. mesenteroides',
      ko: 'Leuc. mesenteroides (장막구균)',
      zh: 'Leuc. mesenteroides (肠膜明串珠菌)',
      de: 'Leuc. mesenteroides'
    },
    'microbe.mesenteroides.role': {
      en: 'Peak flavor maker',
      ko: '최적 풍미 메이커',
      zh: '最佳风味制造者',
      de: 'Spitzengeschmack-Macher'
    },
    'microbe.mesenteroides.body': {
      en: 'Creates lively aroma, gentle tang, and the fresh sparkle people often love in ripe kimchi.',
      ko: '생기 있는 향, 부드러운 산미, 잘 익은 김치 특유의 산뜻한 톡 쏘는 느낌을 만듭니다.',
      zh: '带来活泼香气、柔和酸感，以及很多人喜欢的成熟 Kimchi 清爽气息。',
      de: 'Erzeugt lebhaftes Aroma, sanfte Säure und das frische Prickeln, das viele an reifem Kimchi lieben.'
    },
    'microbe.plantarum.name': {
      en: 'L. plantarum',
      ko: 'L. plantarum (식물유산균)',
      zh: 'L. plantarum (植物乳杆菌)',
      de: 'L. plantarum'
    },
    'microbe.plantarum.role': {
      en: 'Deep sour finisher',
      ko: '깊은 신맛의 마무리 담당',
      zh: '深酸收尾者',
      de: 'Tiefsäure-Abschluss'
    },
    'microbe.plantarum.body': {
      en: 'Takes over later, deepens acidity, and moves the batch toward cooking kimchi territory.',
      ko: '후반에 우세해지며 산미를 깊게 만들고, 배치를 요리용 김치 쪽으로 이끕니다.',
      zh: '后期逐渐占优，进一步加深酸度，让这一坛更接近适合做菜的老 Kimchi。',
      de: 'Übernimmt später, vertieft die Säure und bewegt die Charge in Richtung Koch-Kimchi.'
    },

    // Recipe
    'recipe.title': {
      en: 'Standard Recipe & Process',
      ko: '표준 레시피 및 공정',
      zh: '标准配方与制作流程',
      de: 'Standardrezept & Verfahren'
    },
    'recipe.standards': {
      en: 'Industry Standards',
      ko: '산업 표준',
      zh: '行业标准',
      de: 'Industriestandards'
    },

    // Footer
    'footer.description': {
      en: 'Open-source kimchi fermentation simulator based on Korean food science research.',
      ko: '한국 식품과학 연구 기반 오픈소스 김치 발효 시뮬레이터.',
      zh: '基于韩国食品科学研究的开源辣白菜发酵模拟器。',
      de: 'Open-Source-Kimchi-Fermentationssimulator basierend auf koreanischer Lebensmittelforschung.'
    },
    'footer.refs': {
      en: 'References:',
      ko: '참고문헌:',
      zh: '参考文献：',
      de: 'Referenzen:'
    },
    'footer.models': {
      en: 'Models: Modified Gompertz (LAB growth) · Arrhenius (temperature kinetics) · Sigmoid (microbial succession)',
      ko: '모델: 수정 Gompertz (유산균 성장) · Arrhenius (온도 동역학) · 시그모이드 (미생물 천이)',
      zh: '模型：修正Gompertz（乳酸菌增长）· Arrhenius（温度动力学）· Sigmoid（微生物演替）',
      de: 'Modelle: Modifiziertes Gompertz (LAB-Wachstum) · Arrhenius (Temperaturkinetik) · Sigmoid (mikrobielle Sukzession)'
    },
    'footer.scope': {
      en: 'Applicable to German Sauerkraut, Chinese 泡菜 (paocai), and Korean 김치 (kimchi) — same fermentation kinetics',
      ko: '독일 Sauerkraut, 중국 泡菜, 한국 김치에 모두 적용 — 동일한 발효 동역학 원리',
      zh: '适用于德国泡菜 Sauerkraut、中国四川泡菜与韩国泡菜 김치',
      de: 'G\u00FCltig f\u00FCr deutsches Sauerkraut, chinesisches 泡菜 (Paocai) und koreanisches 김치 (Kimchi) — gleiche G\u00E4rungskinetik'
    },

    // Column titles
    'col.recipe': { en: 'Recipe Calculator', ko: '레시피 계산기', zh: '配方计算器', de: 'Rezeptrechner' },
    'col.ferment': { en: 'Fermentation Calculator', ko: '발효 계산기', zh: '发酵计算器', de: 'G\u00e4rungsrechner' },

    // Calculator
    'calc.title': { en: 'Ingredients', ko: '양념 재료', zh: '配料', de: 'Zutaten' },
    'calc.subtitle': {
      en: 'Enter the cabbage weight and get a practical shopping list scaled from a standard household recipe.',
      ko: '배추 무게를 입력하면 표준 가정용 레시피를 기준으로 실제 장보기 분량이 계산됩니다.',
      zh: '输入白菜重量后，系统会按标准家庭配方换算出一份实用采购清单。',
      de: 'Geben Sie das Kohlgewicht ein und erhalten Sie eine praktische Einkaufsliste, skaliert nach einem Standard-Haushaltsrezept.'
    },
    'calc.input': { en: 'Cabbage Weight', ko: '배추 무게', zh: '白菜重量', de: 'Kohlgewicht' },
    'calc.salt.brine': { en: 'Brine (12%)', ko: '소금물 (12%)', zh: '盐水 (12%)', de: 'Salzlake (12%)' },
    'calc.coarse.salt': { en: 'Coarse Salt', ko: '굵은소금', zh: '粗盐', de: 'Grobes Salz' },
    'calc.chili': { en: 'Chili Powder', ko: '고춧가루', zh: '辣椒粉', de: 'Chilipulver' },
    'calc.fish': { en: 'Fish Sauce', ko: '멸치액젓', zh: '鱼露', de: 'Fischsauce' },
    'calc.shrimp': { en: 'Shrimp Paste', ko: '새우젓', zh: '虾酱', de: 'Garnelenpaste' },
    'calc.garlic': { en: 'Garlic', ko: '마늘', zh: '大蒜', de: 'Knoblauch' },
    'calc.ginger': { en: 'Ginger', ko: '생강', zh: '生姜', de: 'Ingwer' },
    'calc.rice': { en: 'Rice Paste', ko: '찹쌀풀', zh: '糯米糊', de: 'Reispaste' },
    'calc.scallion': { en: 'Green Onion', ko: '쪽파', zh: '小葱', de: 'Fr\u00fchlingszwiebel' },
    'calc.note': { en: 'Fish:Shrimp ratio = 3:2 for optimal umami', ko: '액젓:새우젓 = 3:2 최적 감칠맛', zh: '鱼露:虾酱 = 3:2 为最佳鲜味比例', de: 'Fischsauce:Garnelenpaste = 3:2 f\u00fcr optimalen Umami' },

    // Mixer labels
    'mixer.salt': { en: 'Salt', ko: '소금', zh: '盐', de: 'Salz' },
    'mixer.starter': { en: 'Starter', ko: '종균', zh: '母水', de: 'Starterkultur' },
    'starter.label': {
      en: 'Starter Culture (Old Brine)',
      ko: '종균 (묵은지국물)',
      zh: '母水（老泡菜发酵液）',
      de: 'Starterkultur (Altlake)'
    },
    'starter.hint': {
      en: 'Brine from a previous fermented batch — natural LAB inoculant',
      ko: '이전 발효 배치의 국물 — 천연 유산균 종균',
      zh: '取自上一坛充分发酵的泡菜液，含天然乳酸菌群，可加速发酵、稳定风味',
      de: 'Lake aus einer fr\u00fcheren Charge \u2014 nat\u00fcrliches LAB-Inokulum'
    },

    // Process flowchart
    'process.title': { en: 'Making Process', ko: '제조 과정', zh: '制作流程', de: 'Herstellungsprozess' },
    'process.subtitle': {
      en: 'This is the kitchen workflow behind the chart: salting changes texture, seasoning feeds fermentation, and temperature shapes the final flavor.',
      ko: '이 공정은 위 차트의 주방 버전입니다. 절임은 식감을 바꾸고, 양념은 발효를 돕고, 온도는 최종 풍미를 결정합니다.',
      zh: '这是上方图表在厨房里的对应流程：盐会改变质地，酱料会喂养发酵，温度则决定最终风味。',
      de: 'Dies ist der Küchenablauf hinter dem Diagramm: Salzen verändert die Textur, Würzen nährt die Fermentation und die Temperatur formt den endgültigen Geschmack.'
    },
    'process.s1': { en: 'Select', ko: '선별', zh: '选菜', de: 'Ausw\u00e4hlen' },
    'process.s1d': { en: 'Fresh napa cabbage', ko: '신선한 배추', zh: '新鲜大白菜', de: 'Frischer Wei\u00dfkohl' },
    'process.s2': { en: 'Salt', ko: '절임', zh: '腌制', de: 'Salzen' },
    'process.s2d': { en: '6-8h, 8% salt', ko: '6-8시간, 8% 소금', zh: '6-8小时, 8%盐', de: '6\u20138 Std., 8% Salz' },
    'process.s3': { en: 'Season', ko: '양념', zh: '调味', de: 'W\u00fcrzen' },
    'process.s3d': { en: 'Mix paste into leaves', ko: '양념 배추 사이에 넣기', zh: '将调味料抹入菜叶间', de: 'Paste in Bl\u00e4tter einarbeiten' },
    'process.s4': { en: 'Pack', ko: '밀봉', zh: '装坛', de: 'Einf\u00fcllen' },
    'process.s4d': { en: 'Press tight, no air', ko: '꽉 눌러 공기 제거', zh: '压紧，排尽空气', de: 'Fest dr\u00fccken, keine Luft' },
    'process.s5': { en: 'Ferment', ko: '발효', zh: '发酵', de: 'G\u00e4ren' },
    'process.s5d': { en: 'Room temp 1-2 days', ko: '실온 1-2일', zh: '室温1-2天', de: 'Raumtemp. 1\u20132 Tage' },
    'process.s6': { en: 'Chill', ko: '냉장', zh: '冷藏', de: 'K\u00fchlen' },
    'process.s6d': { en: 'Fridge 4°C, slow ripen', ko: '냉장고 4°C 숙성', zh: '冰箱4°C，缓慢熟成', de: 'K\u00fchlschrank 4\u00b0C, langsam reifen' },
    'process.s7': { en: 'Enjoy!', ko: '완성!', zh: '开吃!', de: 'Genie\u00dfen!' },
    'process.s7d': { en: 'Best at peak flavor', ko: '최적 풍미에서 즐기기', zh: '最佳风味期食用', de: 'Am besten bei Spitzengeschmack' },

    // Calculator source
    'calc.source': { en: 'Korean RDA Standard', ko: '농촌진흥청 기준', zh: '韩国农村振兴厅标准', de: 'Koreanischer RDA-Standard' },
    'calc.codex': { en: 'Codex CXS 223-2001', ko: 'Codex CXS 223-2001', zh: 'Codex CXS 223-2001', de: 'Codex CXS 223-2001' },

    // Nitrite warning
    'nitrite.label': { en: 'Nitrite at best-eating point', ko: '최적 식미 시점 아질산염', zh: '最佳食用点亚硝酸盐', de: 'Nitrit am besten Esspunkt' },
    'chart.nitrite': { en: 'Nitrite NO\u2082 (mg/kg)', ko: '아질산염 NO\u2082 (mg/kg)', zh: '亚硝酸盐 NO\u2082 (mg/kg)', de: 'Nitrit NO₂ (mg/kg)' },
    'nitrite.safe': { en: 'Safe', ko: '안전', zh: '安全', de: 'Sicher' },
    'nitrite.caution': { en: 'Caution', ko: '주의', zh: '注意', de: 'Vorsicht' },
    'nitrite.danger': { en: 'High Risk', ko: '위험', zh: '高风险', de: 'Hohes Risiko' },
    'nitrite.safeAfter': { en: 'Safe after', ko: '안전 예상:', zh: '预计安全食用：', de: 'Sicher ab' },
    'nitrite.model.title': {
      en: 'Nitrite kinetics for this batch',
      ko: '이 배치의 아질산염 동역학',
      zh: '这一坛的亚硝酸盐动力学',
      de: 'Nitritkinetik für diese Charge'
    },
    'nitrite.model.body': {
      en: 'The curve now comes from nitrate reserve, sodium strength, temperature stages, and the speed at which LAB acidify and clear nitrite.',
      ko: '이 곡선은 이제 질산염 저장량, Na\u207A 강도, 온도 단계, 그리고 유산균의 산성화 및 아질산염 제거 속도에서 계산됩니다.',
      zh: '这条曲线现在由硝酸根储量、Na\u207A 强度、温度阶段，以及乳酸菌的产酸和清除速度共同推演。',
      de: 'Die Kurve ergibt sich aus Nitratreserve, Na⁺-Stärke, Temperaturstufen und der Geschwindigkeit, mit der LAB ansäuern und Nitrit abbauen.'
    },
    'nitrite.no3': { en: 'NO\u2083\u207B reserve', ko: 'NO\u2083\u207B 저장량', zh: 'NO\u2083\u207B 储量', de: 'NO₃⁻-Reserve' },
    'nitrite.na': { en: 'Na\u207A strength', ko: 'Na\u207A 강도', zh: 'Na\u207A 强度', de: 'Na⁺-Stärke' },
    'nitrite.peak': { en: 'Predicted peak', ko: '예상 최고치', zh: '预计峰值', de: 'Vorhergesagter Höchstwert' },
    'nitrite.window': { en: 'Risk window', ko: '위험 구간', zh: '风险窗口', de: 'Risikofenster' },
    'nitrite.flux': { en: 'Dynamic balance', ko: '동역학 균형', zh: '动力学平衡', de: 'Dynamisches Gleichgewicht' },
    'nitrite.form': { en: 'Formation', ko: '생성', zh: '生成', de: 'Bildung' },
    'nitrite.clear': { en: 'Clearance', ko: '제거', zh: '清除', de: 'Abbau' },
    'nitrite.window.none': {
      en: 'Below 3 mg/kg throughout',
      ko: '전 구간 3 mg/kg 이하',
      zh: '全程低于 3 mg/kg',
      de: 'Durchgehend unter 3 mg/kg'
    },

    // Educational tooltips (delayed hover popups)
    'tip.ph': {
      en: 'pH measures acidity. Fresh cabbage starts ~5.8. As bacteria produce lactic acid, pH drops. Best flavor is around pH 4.2-4.6 — tangy but not too sour.',
      ko: 'pH는 산도를 나타냅니다. 신선 배추는 ~5.8에서 시작합니다. 유산균이 젖산을 만들면 pH가 내려갑니다. 최적 풍미는 pH 4.2-4.6 — 적당히 새콤한 맛.',
      zh: 'pH是酸碱度。新鲜白菜约5.8，乳酸菌产酸后pH下降。最佳风味在pH 4.2-4.6之间——酸爽而不过酸。',
      de: 'pH misst den Säuregrad. Frischer Kohl beginnt bei ~5,8. Wenn Bakterien Milchsäure produzieren, sinkt der pH. Bester Geschmack liegt bei pH 4,2–4,6 — säuerlich, aber nicht zu sauer.'
    },
    'tip.acid': {
      en: 'Lactic acid is what makes kimchi sour. It is produced by beneficial bacteria. The ideal amount is 0.6-0.8% — enough for tang, not too sharp.',
      ko: '젖산은 김치를 신맛나게 합니다. 유산균이 만들어냅니다. 이상적인 양은 0.6-0.8% — 적당한 신맛.',
      zh: '乳酸是泡菜变酸的原因，由有益菌产生。理想含量0.6-0.8%——酸度适中，口感最佳。',
      de: 'Milchsäure macht Kimchi sauer. Sie wird von nützlichen Bakterien produziert. Die ideale Menge ist 0,6–0,8 % — genug Säure, nicht zu scharf.'
    },
    'tip.lab': {
      en: 'LAB = Lactic Acid Bacteria. These friendly microbes are the heroes of fermentation! They preserve food, create flavor, and are great for gut health.',
      ko: 'LAB = 유산균. 발효의 주역입니다! 음식을 보존하고, 풍미를 만들고, 장 건강에 좋습니다.',
      zh: 'LAB=乳酸菌，发酵的功臣！它们保鲜食物、创造风味，还有益肠道健康。',
      de: 'LAB = Milchsäurebakterien. Diese nützlichen Mikroben sind die Helden der Fermentation! Sie konservieren Lebensmittel, erzeugen Geschmack und sind gut für die Darmgesundheit.'
    },
    'tip.flavor': {
      en: 'Flavor score combines pH (tangy), lactic acid (sour depth), and Leuconostoc bacteria (CO\u2082 fizz + aroma). 70+ = Excellent! The green dashed line marks peak flavor.',
      ko: '풍미 점수는 pH(신맛), 젖산(깊이), Leuconostoc 균(탄산+향)을 종합합니다. 70+ = 최고! 초록 점선이 최적 시점입니다.',
      zh: '风味评分综合了pH（酸爽）、乳酸（酸度深度）和明串珠菌（气泡+香气）。70分以上=优秀！绿色虚线标记最佳风味点。',
      de: 'Die Geschmacksbewertung kombiniert pH (Säure), Milchsäure (Säuretiefe) und Leuconostoc-Bakterien (CO₂-Prickeln + Aroma). 70+ = Ausgezeichnet! Die grüne Strichlinie markiert den besten Geschmack.'
    },
    'tip.optimalTime': {
      en: 'The moment when flavor peaks! After this, kimchi keeps fermenting and gets more sour. Move to the fridge to slow it down.',
      ko: '풍미가 최고인 시점! 이후에는 계속 발효되어 더 시큼해집니다. 냉장고에 넣어 속도를 늦추세요.',
      zh: '风味达到巅峰的时刻！之后泡菜继续发酵会更酸。放入冰箱可以减缓发酵速度。',
      de: 'Der Moment, in dem der Geschmack seinen Höhepunkt erreicht! Danach fermentiert Kimchi weiter und wird saurer. In den Kühlschrank stellen, um es zu verlangsamen.'
    },
    'tip.salt': {
      en: 'Salt controls fermentation speed.\n\nToo little (<2%): spoils quickly, mushy texture\nJust right (2-3%): perfect crunch and flavor\nToo much (>4%): very slow, overly salty taste\n\nKorean standard: 2.5% after salting.',
      ko: '소금은 발효 속도를 조절합니다.\n\n너무 적으면 (<2%): 빨리 상하고 물러짐\n적당히 (2-3%): 아삭하고 맛있음\n너무 많으면 (>4%): 매우 느리고 짬\n\n한국 표준: 절임 후 2.5%.',
      zh: '盐控制发酵速度。\n\n太少(<2%)：容易坏，口感软烂\n刚好(2-3%)：爽脆可口\n太多(>4%)：发酵很慢，太咸\n\n韩国标准：腌制后2.5%。',
      de: 'Salz steuert die Fermentationsgeschwindigkeit.\n\nZu wenig (<2 %): verdirbt schnell, matschige Textur\nGenau richtig (2–3 %): perfekter Biss und Geschmack\nZu viel (>4 %): sehr langsam, zu salziger Geschmack\n\nKoreanischer Standard: 2,5 % nach dem Salzen.'
    },
    'tip.starter': {
      en: 'Starter = old kimchi brine. It contains millions of live bacteria that jumpstart fermentation.\n\n0%: Natural fermentation (slower)\n5%: Moderate boost\n10-15%: Fast start, consistent results\n\nLike sourdough starter for bread!',
      ko: '종균 = 묵은지국물. 수백만 유산균이 발효를 빠르게 시작합니다.\n\n0%: 자연 발효 (느림)\n5%: 적당한 촉진\n10-15%: 빠른 시작, 일정한 결과\n\n빵의 천연 효모와 같은 원리!',
      zh: '母水=老泡菜汤汁，含有数百万活菌，能快速启动发酵。\n\n0%：自然发酵（较慢）\n5%：适度加速\n10-15%：快速启动，效果稳定\n\n就像面包的老面种一样！',
      de: 'Starterkultur = alte Kimchi-Lake. Sie enthält Millionen lebender Bakterien, die die Fermentation beschleunigen.\n\n0 %: Natürliche Fermentation (langsamer)\n5 %: Moderater Schub\n10–15 %: Schneller Start, gleichmäßige Ergebnisse\n\nWie Sauerteig beim Brotbacken!'
    },
    'tip.stages': {
      en: 'Real kimchi-making uses stages:\n\n1. Room temp (20-25°C): Kick-start bacteria for a few hours\n2. Fridge (4°C): Slow, deep flavor development over days\n\nThis is why Korean grandmas leave kimchi out overnight before refrigerating!',
      ko: '실제 김치는 단계별로 만듭니다:\n\n1. 실온 (20-25°C): 몇 시간 유산균 활성화\n2. 냉장 (4°C): 며칠에 걸쳐 깊은 풍미 발달\n\n할머니들이 김치를 하룻밤 실온에 두었다 냉장하는 이유!',
      zh: '实际做泡菜分阶段：\n\n1. 室温(20-25°C)：几小时激活细菌\n2. 冷藏(4°C)：数天缓慢发展深层风味\n\n这就是韩国奶奶做好泡菜后先放室温一晚再放冰箱的原因！',
      de: 'Echte Kimchi-Herstellung nutzt Stufen:\n\n1. Raumtemperatur (20–25 °C): Bakterien für einige Stunden aktivieren\n2. Kühlschrank (4 °C): Langsame, tiefe Geschmacksentwicklung über Tage\n\nDeshalb lassen koreanische Großmütter Kimchi über Nacht draußen, bevor sie es kühlen!'
    },
    'tip.nitrite': {
      en: 'Nitrite (NO\u2082) is not assigned to a fixed day count here.\n\nThis simulator estimates a nitrate reservoir from the kimchi mix, converts salt into an equivalent Na\u207A brine strength, speeds or slows nitrate reduction with your temperature stages, and then lets LAB acidity and biomass clear nitrite back down.\n\nWarm starts usually compress the risk window into an earlier, sharper peak. Cold plans often spread it over more time. More starter usually shortens the window because LAB take control sooner.\n\nRead the predicted peak and risk window for your actual settings instead of assuming every batch peaks on the same day.',
      ko: '여기서는 아질산염(NO\u2082)을 고정된 날짜 규칙으로 처리하지 않습니다.\n\n이 시뮬레이터는 김치 혼합물의 질산염 저장량을 추정하고, 소금을 등가 Na\u207A 염수 강도로 바꾸며, 온도 단계에 따라 질산염 환원 속도를 조절한 뒤, 유산균의 산성화와 균수 증가로 아질산염이 다시 낮아지도록 계산합니다.\n\n따뜻한 시작은 위험 구간을 더 이르고 날카로운 최고치로 압축하는 경향이 있고, 차가운 계획은 그 구간을 더 길게 펼치는 경향이 있습니다. 종균이 많을수록 유산균이 더 빨리 주도권을 잡아 위험 구간이 짧아지는 경우가 많습니다.\n\n따라서 모든 배치가 같은 날 최고치를 찍는다고 가정하지 말고, 현재 설정에서 계산된 최고치와 위험 구간을 읽어야 합니다.',
      zh: '这里不会把亚硝酸盐(NO\u2082)硬套成固定的第几天。\n\n这个模拟器会先根据配方估算 Kimchi 中的硝酸根储量，把盐换算成等效的 Na\u207A 盐水强度，再根据你的温度阶段加快或放慢硝酸根向亚硝酸盐的转化，最后让乳酸菌的产酸和菌量增长把亚硝酸盐继续压低。\n\n温暖起步通常会把风险窗口压缩成更早、更尖锐的峰值；低温计划往往会把它摊得更长。母水越多，乳酸菌越早接管，风险窗口通常也会更短。\n\n所以不要假设每一坛都会在同一天达到峰值，而要看当前参数下实时推演出的峰值和风险窗口。',
      de: 'Nitrit (NO₂) wird hier nicht an eine feste Tageszahl gebunden.\n\nDieser Simulator schätzt eine Nitratreserve aus der Kimchi-Mischung, rechnet Salz in eine äquivalente Na⁺-Lakestärke um, beschleunigt oder verlangsamt die Nitratreduktion mit Ihren Temperaturstufen und lässt dann LAB-Säure und Biomasse das Nitrit wieder abbauen.\n\nWarme Starts komprimieren das Risikofenster meist zu einem früheren, schärferen Höchstwert. Kalte Pläne verteilen es oft über mehr Zeit. Mehr Starterkultur verkürzt das Fenster meist, weil LAB schneller die Kontrolle übernehmen.\n\nLesen Sie den vorhergesagten Höchstwert und das Risikofenster für Ihre tatsächlichen Einstellungen, anstatt anzunehmen, dass jede Charge am selben Tag ihren Höchstwert erreicht.'
    },
    'tip.phase': {
      en: 'Fermentation has 3 phases:\n\n Blue = Initial: L. sakei grows first, mild taste\n Green = Optimal: Leuconostoc makes bubbles and great flavor\n Yellow = Over-ripened: L. plantarum takes over, very sour\n\nThe marker shows where your kimchi is now!',
      ko: '발효 3단계:\n\n 파랑 = 초기: L. sakei가 먼저 자라, 순한 맛\n 초록 = 최적: Leuconostoc이 탄산과 좋은 풍미 생성\n 노랑 = 과숙: L. plantarum 우세, 매우 시큼\n\n마커가 현재 김치 상태를 보여줍니다!',
      zh: '发酵分三个阶段：\n\n 蓝色=初期：L. sakei先生长，味道温和\n 绿色=最佳：明串珠菌产生气泡和绝佳风味\n 黄色=过熟：植物乳杆菌主导，非常酸\n\n标记显示你的泡菜现在处于哪个阶段！',
      de: 'Fermentation hat 3 Phasen:\n\nBlau = Anfang: L. sakei wächst zuerst, milder Geschmack\nGrün = Optimal: Leuconostoc erzeugt Bläschen und tollen Geschmack\nGelb = Überreif: L. plantarum übernimmt, sehr sauer\n\nDie Markierung zeigt, wo Ihr Kimchi jetzt steht!'
    },
    'tip.readChart': {
      en: 'Read it in this order:\n\n1. Red score line = overall eating quality\n2. Green dashed line = best flavor moment\n3. Nitrite line = early safety warning\n4. Colored phase bands = which bacteria are leading\n\nTurn on extra layers only when you want more detail.',
      ko: '이 순서로 보세요:\n\n1. 빨간 점수선 = 전체 먹기 좋은 정도\n2. 초록 점선 = 풍미가 가장 좋은 순간\n3. 아질산염 선 = 초기 안전 경고\n4. 색 띠 = 어떤 균이 발효를 주도하는지\n\n더 자세히 보고 싶을 때만 추가 레이어를 켜면 됩니다.',
      zh: '建议按这个顺序读图：\n\n1. 红色评分线 = 整体适口性\n2. 绿色虚线 = 风味最佳时刻\n3. 亚硝酸盐线 = 早期安全提醒\n4. 彩色阶段带 = 当前哪类菌在主导\n\n想看更深细节时，再打开其他图层。',
      de: 'Lesen Sie es in dieser Reihenfolge:\n\n1. Rote Bewertungslinie = Gesamtessqualität\n2. Grüne Strichlinie = bester Geschmacksmoment\n3. Nitritlinie = Frühwarnung zur Sicherheit\n4. Farbige Phasenbänder = welche Bakterien führen\n\nSchalten Sie zusätzliche Ebenen nur ein, wenn Sie mehr Details möchten.'
    },
    'tip.chartControls': {
      en: 'The chart starts in a family-friendly mode with the most important information on screen. Use these buttons to reveal deeper scientific layers without overwhelming the first view.',
      ko: '차트는 가장 중요한 정보만 보이는 쉬운 모드로 시작합니다. 이 버튼으로 과학적 세부 레이어를 필요할 때만 펼칠 수 있습니다.',
      zh: '主图默认采用适合大众阅读的模式，只显示最重要的信息。用这些按钮可以在不打乱第一眼阅读的前提下，逐层打开更深入的数据。',
      de: 'Das Diagramm startet im familienfreundlichen Modus mit den wichtigsten Informationen. Nutzen Sie diese Schaltflächen, um tiefere wissenschaftliche Ebenen einzublenden, ohne die erste Ansicht zu überladen.'
    },
    'tip.dominance': {
      en: 'These bands summarize the dominant microbe over time.\n\nBlue: L. sakei helps the batch settle.\nGreen: Leuconostoc usually delivers peak eating quality.\nYellow: L. plantarum pushes kimchi toward stronger sourness.\n\nThe widths change with your temperature plan.',
      ko: '이 띠는 시간에 따라 우세한 미생물을 요약합니다.\n\n파랑: L. sakei가 배치를 안정화합니다.\n초록: Leuconostoc이 보통 최고의 식미를 만듭니다.\n노랑: L. plantarum이 더 강한 산미 쪽으로 이끕니다.\n\n폭은 온도 계획에 따라 달라집니다.',
      zh: '这些色带概括了不同时间段的优势菌。\n\n蓝色：L. sakei 帮助发酵起步并稳定。\n绿色：Leuconostoc 往往带来最佳食用品质。\n黄色：L. plantarum 会把 Kimchi 推向更明显的酸味。\n\n它们的宽度会随着你的温度计划变化。',
      de: 'Diese Bänder zeigen die dominanten Mikroben im Zeitverlauf.\n\nBlau: L. sakei hilft der Charge beim Einpendeln.\nGrün: Leuconostoc liefert meist die beste Essqualität.\nGelb: L. plantarum treibt Kimchi in Richtung stärkerer Säure.\n\nDie Breiten ändern sich mit Ihrem Temperaturplan.'
    },
    'tip.microbeBoard': {
      en: 'Kimchi flavor is a team effort.\n\nThese cards answer a simple question: who is doing the most work around the best-tasting moment? The highlighted card updates automatically as you change time, starter, and temperature stages.',
      ko: '김치 풍미는 팀플레이입니다.\n\n이 카드는 “가장 맛있는 시점 주변에서 누가 가장 큰 역할을 하고 있는가?”를 쉽게 보여줍니다. 시간, 종균, 온도 단계를 바꾸면 자동으로 강조 카드가 바뀝니다.',
      zh: 'Kimchi 的风味来自菌群协作。\n\n这组卡片回答的是一个简单问题：在最佳风味附近，究竟是谁出了最多力？当你调整时间、母水和温度阶段时，高亮卡片会自动变化。',
      de: 'Kimchi-Geschmack ist Teamarbeit.\n\nDiese Karten beantworten eine einfache Frage: Wer leistet rund um den besten Geschmacksmoment die meiste Arbeit? Die hervorgehobene Karte aktualisiert sich automatisch, wenn Sie Zeit, Starterkultur und Temperaturstufen ändern.'
    },
    'tip.presets': {
      en: 'Presets are not rigid rules. They are teaching shortcuts.\n\nClassic Home: warm start, long cold finish\nWeekend Fast: quicker souring for short timelines\nCold Slow: mostly refrigerator fermentation for steadier texture',
      ko: '프리셋은 절대 규칙이 아니라 학습용 지름길입니다.\n\n가정 기본: 따뜻하게 시작하고 차갑게 길게 마무리\n주말 빠르게: 짧은 일정에 맞춘 빠른 산미 형성\n저온 천천히: 냉장 중심으로 더 안정적 식감 유지',
      zh: '这些预设不是死规则，而是学习捷径。\n\n家常经典：先温后冷，慢慢成熟\n周末快成：适合短周期，较快出酸\n冷藏慢熟：以冰箱发酵为主，质地更稳',
      de: 'Voreinstellungen sind keine starren Regeln, sondern Lernhilfen.\n\nKlassisch: Warmer Start, lange kalte Phase\nSchnell: Schnellere Säuerung für kurze Zeitpläne\nKalt & langsam: Hauptsächlich Kühlschrankfermentation für gleichmäßigere Textur'
    },
    'tip.process': {
      en: 'This flow explains why household kimchi making is staged. Salting removes water, seasoning adds nutrients and aroma, and temperature decides whether the batch develops quickly or slowly.',
      ko: '이 흐름도는 가정용 김치가 왜 단계적으로 만들어지는지 설명합니다. 절임은 수분을 빼고, 양념은 영양과 향을 더하며, 온도는 발효 속도를 결정합니다.',
      zh: '这个流程图解释了为什么家庭做 Kimchi 往往要分步骤进行。盐会脱水，酱料会提供营养和香气，温度则决定它是快熟还是慢熟。',
      de: 'Dieser Ablauf erklärt, warum die Kimchi-Herstellung im Haushalt stufenweise erfolgt. Salzen entzieht Wasser, Würzen liefert Nährstoffe und Aroma, und die Temperatur entscheidet, ob sich die Charge schnell oder langsam entwickelt.'
    },
    'tip.calc': {
      en: 'This calculator is for practical kitchen prep. It scales a representative household recipe, so you can move from learning to making without mental math.',
      ko: '이 계산기는 실제 주방 준비를 위한 도구입니다. 대표적인 가정용 레시피를 비례 확장하므로, 머리로 환산하지 않고 바로 장보기 분량을 얻을 수 있습니다.',
      zh: '这个计算器服务于真实厨房准备。它会按一份代表性家庭配方等比换算，让你不用心算就能得到采购量。',
      de: 'Dieser Rechner ist für die praktische Küchenvorbereitung. Er skaliert ein repräsentatives Haushaltsrezept, damit Sie vom Lernen zum Machen kommen, ohne im Kopf umrechnen zu müssen.'
    },
    'tip.sakei': {
      en: 'L. sakei often dominates early.\n\nWhat it means for you: the batch is still fresh, clean, and not yet deeply sour. Think of it as the “settling in” stage.',
      ko: 'L. sakei는 보통 초기에 우세합니다.\n\n의미: 배치는 아직 신선하고 깔끔하며 깊게 시어지지 않았습니다. 발효가 자리를 잡는 단계라고 보면 됩니다.',
      zh: 'L. sakei 往往在前期占优。\n\n对你意味着什么：这一坛还偏清新、干净，酸味还不深，可以理解为“进入状态”的阶段。',
      de: 'L. sakei dominiert oft in der Frühphase.\n\nWas das für Sie bedeutet: Die Charge ist noch frisch, sauber und noch nicht tief sauer. Betrachten Sie es als die „Einpendelungsphase".'
    },
    'tip.mesenteroides': {
      en: 'Leuconostoc is the crowd-pleaser.\n\nIt helps create aroma, light acidity, and a lively profile that many people associate with perfect eating kimchi.',
      ko: 'Leuconostoc은 가장 많은 사람들이 좋아하는 풍미를 만드는 균입니다.\n\n향, 가벼운 산미, 생기 있는 인상을 만들어 “먹기 가장 좋은 김치”와 자주 연결됩니다.',
      zh: 'Leuconostoc 常常是最讨喜的一类菌。\n\n它能带来香气、轻快酸感和鲜活口感，很多人心中的“最好吃 Kimchi”通常就和它有关。',
      de: 'Leuconostoc ist der Publikumsliebling.\n\nEs hilft, Aroma, leichte Säure und ein lebhaftes Profil zu erzeugen, das viele mit perfektem Ess-Kimchi verbinden.'
    },
    'tip.plantarum': {
      en: 'L. plantarum is powerful late in fermentation.\n\nIt deepens acidity and is useful when kimchi is heading toward soups, stews, fried rice, or other cooked dishes.',
      ko: 'L. plantarum은 발효 후반에 강해집니다.\n\n산미를 깊게 만들며, 김치찌개나 볶음밥 같은 요리용 김치로 갈 때 특히 의미가 큽니다.',
      zh: 'L. plantarum 在发酵后期会更强势。\n\n它会进一步加深酸味，因此当 Kimchi 逐渐转向适合做汤、炒饭、炖菜时，它就很关键。',
      de: 'L. plantarum ist in der späten Fermentation stark.\n\nEs vertieft die Säure und ist nützlich, wenn Kimchi in Richtung Suppen, Eintöpfe, Bratreis oder andere gekochte Gerichte geht.'
    },

    // Batch tracker
    'batch.startLabel': {
      en: 'Pickling start date',
      ko: '담근 날짜',
      zh: '腌渍开始日期',
      de: 'Startdatum der Fermentation'
    },
    'batch.elapsed': {
      en: '{d} days elapsed',
      ko: '{d}일 경과',
      zh: '已经过 {d} 天',
      de: '{d} Tage vergangen'
    },
    'batch.now': {
      en: 'Now',
      ko: '현재',
      zh: '当前',
      de: 'Jetzt'
    },
    'batch.phase': {
      en: 'Phase',
      ko: '단계',
      zh: '阶段',
      de: 'Phase'
    },
    'batch.dominant': {
      en: 'Dominant',
      ko: '우세균',
      zh: '优势菌',
      de: 'Dominant'
    },
    'batch.suggestion': {
      en: 'Suggestion',
      ko: '제안',
      zh: '建议',
      de: 'Empfehlung'
    },
    'batch.notStarted': {
      en: 'Set a start date to track your batch',
      ko: '담근 날짜를 입력하면 현재 상태를 볼 수 있습니다',
      zh: '输入腌渍日期即可追踪当前状态',
      de: 'Legen Sie ein Startdatum fest, um Ihre Charge zu verfolgen'
    },
    'batch.suggestion.early': {
      en: 'Still in early stage — nitrite may be elevated. Wait for further fermentation.',
      ko: '아직 초기 단계 — 아질산염이 높을 수 있습니다. 더 발효시키세요.',
      zh: '仍处于初期——亚硝酸盐可能偏高，继续等待发酵。',
      de: 'Noch in der Frühphase — Nitrit kann erhöht sein. Warten Sie auf weitere Fermentation.'
    },
    'batch.suggestion.optimal': {
      en: 'Peak flavor window! Best time to start eating. Move to fridge if not already.',
      ko: '최적 풍미 구간! 지금 먹기 시작하세요. 아직 냉장하지 않았다면 냉장고에 넣으세요.',
      zh: '最佳风味窗口！可以开始食用了。如果还没放冰箱，建议现在移入冷藏。',
      de: 'Bestes Geschmacksfenster! Beste Zeit zum Essen. In den Kühlschrank stellen, falls noch nicht geschehen.'
    },
    'batch.suggestion.over': {
      en: 'Past peak — increasingly sour. Best for cooking (kimchi jjigae, fried rice).',
      ko: '최적기를 지남 — 점점 시어집니다. 요리용 (김치찌개, 볶음밥)으로 좋습니다.',
      zh: '已过最佳期——酸度渐增，适合用来做菜（泡菜汤、炒饭等）。',
      de: 'Über den Höhepunkt hinaus — zunehmend sauer. Am besten zum Kochen (Kimchi-Eintopf, Bratreis).'
    },

    // Freezing warning
    'warn.frozen': {
      en: 'Below freezing point (~-1.5°C at 2.5% salt). Kimchi will freeze, LAB go dormant. Ice crystals damage vegetable texture.',
      ko: '빙점 이하 (~-1.5°C, 2.5% 소금 기준). 김치가 얼고 유산균이 휴면합니다. 얼음 결정이 채소 조직을 손상시킵니다.',
      zh: '低于冰点（2.5%盐约-1.5°C）。泡菜会结冰，乳酸菌休眠。冰晶会破坏蔬菜组织。',
      de: 'Unter dem Gefrierpunkt (~-1,5 °C bei 2,5 % Salz). Kimchi friert ein, LAB werden inaktiv. Eiskristalle schädigen die Gemüsetextur.'
    },

    // Date labels
    'date.year': { en: 'Year', ko: '년', zh: '年', de: 'Jahr' },
    'date.month': { en: 'Mon', ko: '월', zh: '月', de: 'Mon' },
    'date.day': { en: 'Day', ko: '일', zh: '日', de: 'Tag' },
    'date.hour': { en: 'Hour', ko: '시', zh: '时', de: 'Std' },

    // Units
    'unit.days': { en: 'days', ko: '일', zh: '天', de: 'Tage' },
    'unit.day': { en: 'day', ko: '일', zh: '天', de: 'Tag' },
    'unit.hours': { en: 'hours', ko: '시간', zh: '小时', de: 'Stunden' },
    'unit.h': { en: 'h', ko: '시간', zh: '小时', de: 'Std' },
    'unit.hourShort': { en: 'h', ko: '시', zh: '时', de: 'h' },

    // Navigator (L1)
    'nav.days': { en: 'days', ko: '일', zh: '天', de: 'Tage' },
    'nav.best': { en: 'Best at', ko: '최적 시점', zh: '最佳时间', de: 'Bestes bei' },
    'nav.safety': { en: 'Safety', ko: '안전', zh: '安全', de: 'Sicherheit' },
    'nav.expert': { en: 'Expert', ko: '전문가', zh: '专家', de: 'Experte' },
    'nav.why': { en: 'Why this result?', ko: '왜 이런 결과일까?', zh: '为什么是这个结果？', de: 'Warum dieses Ergebnis?' },
    'nav.calculating': { en: 'Calculating\u2026', ko: '계산 중\u2026', zh: '计算中\u2026', de: 'Berechne…' },

    // Judgment words (dashboard status)
    'judge.excellent': { en: 'Excellent', ko: '매우 좋음', zh: '非常好', de: 'Ausgezeichnet' },
    'judge.good': { en: 'Good flavor', ko: '좋은 풍미', zh: '风味良好', de: 'Guter Geschmack' },
    'judge.improving': { en: 'Improving', ko: '발전 중', zh: '逐渐变好', de: 'Verbessert sich' },
    'judge.developing': { en: 'Developing', ko: '발효 진행 중', zh: '发酵进行中', de: 'In Entwicklung' },
    'judge.overSour': { en: 'Over-sour', ko: '과숙', zh: '过酸', de: 'Übersäuert' },
    'judge.safe': { en: 'Safe', ko: '안전', zh: '安全', de: 'Sicher' },
    'judge.caution': { en: 'Caution', ko: '주의', zh: '注意', de: 'Vorsicht' },
    'judge.danger': { en: 'High risk', ko: '위험', zh: '高风险', de: 'Hohes Risiko' },

    // Status sentences (L1 panel)
    'judge.flavor.excellent': {
      en: 'Peak flavor \u2014 best time to eat',
      ko: '최적 풍미 \u2014 먹기 가장 좋은 시점',
      zh: '风味巅峰 \u2014 最佳食用时机',
      de: 'Spitzengeschmack — beste Zeit zum Essen'
    },
    'judge.flavor.good': {
      en: 'Good flavor, approaching peak',
      ko: '좋은 풍미, 최적기에 가까움',
      zh: '风味不错，即将到达顶峰',
      de: 'Guter Geschmack, nähert sich dem Höhepunkt'
    },
    'judge.flavor.rising': {
      en: 'Flavor is rising \u2014 peak coming soon',
      ko: '풍미가 상승 중 \u2014 곧 최적기',
      zh: '风味正在上升 \u2014 顶峰即将到来',
      de: 'Geschmack steigt — Höhepunkt kommt bald'
    },
    'judge.flavor.developing': {
      en: 'Flavor still developing, be patient',
      ko: '풍미가 아직 발달 중, 기다려 주세요',
      zh: '风味还在发展中，请耐心等待',
      de: 'Geschmack entwickelt sich noch, Geduld bitte'
    },
    'judge.acid.mild': {
      en: 'Acidity: very mild \u2014 not sour yet',
      ko: '산도: 매우 순함 \u2014 아직 시지 않음',
      zh: '酸度：很温和 \u2014 还没变酸',
      de: 'Säure: sehr mild — noch nicht sauer'
    },
    'judge.acid.balanced': {
      en: 'Acidity: balanced \u2014 perfect tang',
      ko: '산도: 균형 잡힘 \u2014 완벽한 산미',
      zh: '酸度：恰到好处 \u2014 完美的酸爽',
      de: 'Säure: ausgewogen — perfekte Säure'
    },
    'judge.acid.sour': {
      en: 'Acidity: getting sour \u2014 good for cooking',
      ko: '산도: 시어지는 중 \u2014 요리용으로 좋음',
      zh: '酸度：偏酸 \u2014 适合做菜',
      de: 'Säure: wird sauer — gut zum Kochen'
    },
    'judge.acid.verySour': {
      en: 'Acidity: very sour \u2014 best for stews & fried rice',
      ko: '산도: 매우 시큼 \u2014 찌개 & 볶음밥에 최적',
      zh: '酸度：很酸 \u2014 适合做汤和炒饭',
      de: 'Säure: sehr sauer — am besten für Eintöpfe & Bratreis'
    },
    'judge.safety.clear': {
      en: 'Nitrite has cleared \u2014 safe to eat',
      ko: '아질산염 안전 수준 \u2014 먹어도 됩니다',
      zh: '亚硝酸盐已清除 \u2014 可以安全食用',
      de: 'Nitrit abgebaut — sicher zum Essen'
    },
    'judge.safety.caution': {
      en: 'Nitrite still elevated \u2014 wait a bit longer',
      ko: '아질산염이 아직 높음 \u2014 조금 더 기다리세요',
      zh: '亚硝酸盐仍偏高 \u2014 再等等',
      de: 'Nitrit noch erhöht — noch etwas warten'
    },
    'judge.safety.risk': {
      en: 'Nitrite high \u2014 do not eat yet',
      ko: '아질산염 높음 \u2014 아직 먹지 마세요',
      zh: '亚硝酸盐偏高 \u2014 暂勿食用',
      de: 'Nitrit hoch — noch nicht essen'
    },

    // Explain panel (L2)
    'explain.status': { en: 'Fermentation Status', ko: '발효 상태', zh: '发酵状态', de: 'Fermentationsstatus' },
    'explain.dominant': { en: 'dominant', ko: '우세', zh: '占优', de: 'dominant' },
    'explain.acid.high': { en: 'pH still high (mild)', ko: 'pH가 아직 높음 (순함)', zh: 'pH仍较高（温和）', de: 'pH noch hoch (mild)' },
    'explain.acid.high.effect': { en: 'Not sour yet, fermentation just starting', ko: '아직 시지 않음, 발효 시작 단계', zh: '还没变酸，发酵刚刚开始', de: 'Noch nicht sauer, Fermentation beginnt gerade' },
    'explain.acid.balanced': { en: 'pH in sweet spot', ko: 'pH가 적정 범위', zh: 'pH在最佳区间', de: 'pH im optimalen Bereich' },
    'explain.acid.balanced.effect': { en: 'Perfect acidity for eating', ko: '먹기 좋은 완벽한 산도', zh: '酸度恰好适合食用', de: 'Perfekte Säure zum Essen' },
    'explain.acid.low': { en: 'pH very low (sour)', ko: 'pH가 매우 낮음 (시큼)', zh: 'pH很低（偏酸）', de: 'pH sehr niedrig (sauer)' },
    'explain.acid.low.effect': { en: 'Too sour for most \u2014 use in cooking', ko: '대부분에게 너무 시큼 \u2014 요리에 사용', zh: '对多数人来说太酸 \u2014 适合做菜', de: 'Zu sauer für die meisten — zum Kochen verwenden' },
    'explain.safety.clear': { en: 'Nitrite below safe line', ko: '아질산염 안전선 이하', zh: '亚硝酸盐低于安全线', de: 'Nitrit unter der Sicherheitsgrenze' },
    'explain.safety.clear.effect': { en: 'No safety concern', ko: '안전 우려 없음', zh: '没有安全隐患', de: 'Kein Sicherheitsrisiko' },
    'explain.safety.risk': { en: 'Nitrite still above threshold', ko: '아질산염이 기준치 이상', zh: '亚硝酸盐仍超标', de: 'Nitrit noch über dem Schwellenwert' },
    'explain.safety.risk.effect': { en: 'Wait for LAB to clear it', ko: '유산균이 제거할 때까지 기다리세요', zh: '等乳酸菌将其清除', de: 'Warten, bis LAB es abgebaut haben' },

    // Fermentation timeline
    'ferment.title': { en: 'Making Process', ko: '제작 과정', zh: '制作过程', de: 'Herstellungsprozess' },
    'ferment.prep': { en: 'Preparation', ko: '준비', zh: '装坛', de: 'Vorbereitung' },
    'ferment.nav.calc': { en: 'Recipe Calculator', ko: '배합 계산기', zh: '配方计算器', de: 'Rezeptrechner' },
    'ferment.nav.recipe': { en: 'Standard Recipe', ko: '표준 레시피', zh: '标准配方与流程', de: 'Standardrezept' },
    'ferment.pickle': { en: 'Packing Complete Time', ko: '장입 완료 시간', zh: '装坛完成时间', de: 'Einf\u00fcllzeit' },
    'ferment.completeTime': { en: 'Completion time:', ko: '완료 시간:', zh: '完成时间：', de: 'Fertigstellungszeit:' },
    'ferment.ripenMethod': { en: 'Fermentation Method', ko: '발효 방식', zh: '发酵方式', de: 'Fermentationsmethode' },
    'ferment.method': { en: 'Fermentation Method', ko: '발효 방식', zh: '发酵方式', de: 'G\u00e4rmethode' },
    'ferment.room': { en: 'Room temp rest', ko: '실온 숙성', zh: '室温静置', de: 'Raumtemperatur' },
    'ferment.fridge': { en: 'Refrigerate', ko: '냉장 보관', zh: '冰箱冷藏', de: 'K\u00fchlschrank' },
    'ferment.accel': { en: 'Room temp boost', ko: '실온 가속', zh: '室温加速', de: 'Raumtemperatur-Boost' },
    'ferment.addAccel': { en: '+ Room temp boost', ko: '+ 실온 가속 추가', zh: '+ 添加室温加速', de: '+ Raumtemp.-Boost' },
    'ferment.removeAccel': { en: 'Remove', ko: '삭제', zh: '删除', de: 'Entfernen' },
    'ferment.best': { en: 'Best flavor', ko: '최적 풍미', zh: '最佳风味', de: 'Bester Geschmack' },
    'ferment.overSour': { en: 'Over-sour', ko: '과발효', zh: '过酸', de: 'Übersäuert' },
    'ferment.end': { en: 'End (+7 days)', ko: '종료 (+7일)', zh: '终止（过酸+7天）', de: 'Ende (+7 Tage)' },
    'ferment.calcBtn': { en: 'Start Calculation', ko: '계산 시작', zh: '开始计算', de: 'Berechnung starten' },
    'dash.phAtBest': { en: 'pH at best flavor', ko: '최적 풍미 시 pH', zh: '最佳风味时 pH', de: 'pH bei bestem Geschmack' },
    'ferment.ph435': { en: 'pH reaches 4.35', ko: 'pH 4.35 도달', zh: 'pH 降至 4.35', de: 'pH erreicht 4,35' },
    'microbe.atNow': { en: 'Now', ko: '현재', zh: '当前', de: 'Jetzt' },
    'dash.nitriteClear': { en: 'Nitrite clears — safe to eat', ko: '아질산염 소멸 — 안전 섭취 가능', zh: '亚硝酸盐消退 · 可以开始吃', de: 'Nitrit abgebaut — sicher zum Essen' },
    'dash.bestFlavor': { en: 'Best flavor window', ko: '최적 풍미 구간', zh: '最佳风味', de: 'Bestes Geschmacksfenster' },
    'dash.lastEdible': { en: 'Over-sour — last good window', ko: '과숙 — 마지막 섭취 구간', zh: '过酸 · 最后宜食窗口', de: 'Übersäuert — letztes gutes Fenster' },
    'dash.starterReady': { en: 'Ready as starter brine for next batch', ko: '종균으로 사용 가능 (묵은지국물)', zh: '可作母水（老泡菜液）', de: 'Bereit als Starterlake für die nächste Charge' },
    'dash.nextBatch': { en: 'Add 5-10% of this brine to your next batch for faster, more consistent fermentation.', ko: '다음 배치에 이 국물의 5-10%를 넣으면 더 빠르고 안정적인 발효가 가능합니다.', zh: '下次做泡菜时加入 5-10% 这坛老汤，发酵更快更稳定。', de: 'Fügen Sie 5–10 % dieser Lake Ihrer nächsten Charge hinzu für schnellere, gleichmäßigere Fermentation.' },
    'dash.title': { en: 'Batch Timeline', ko: '배치 타임라인', zh: '这坛时间线', de: 'Chargen-Zeitachse' },
    'dash.batchTitle': { en: 'This Batch', ko: '이 배치', zh: '这坛泡菜', de: 'Diese Charge' },
    'dash.currentDay': { en: 'Current', ko: '현재', zh: '当前', de: 'Aktuell' },
    'dash.bestDay': { en: 'Best flavor at', ko: '최적 풍미', zh: '最佳风味', de: 'Bester Geschmack bei' },
    'dash.statusLabel': { en: 'Current status', ko: '현재 상태', zh: '当前状态', de: 'Aktueller Status' },
    'insight.rising': { en: 'Flavor is rising — getting better every day', ko: '풍미 상승 중 — 매일 더 좋아지고 있어요', zh: '风味正在上升，一天比一天好', de: 'Geschmack steigt — wird jeden Tag besser' },
    'insight.peak': { en: 'Peak flavor window — eat now for best taste!', ko: '최적 풍미 구간 — 지금 먹으면 가장 맛있어요!', zh: '最佳风味窗口 — 现在吃最好！', de: 'Bestes Geschmacksfenster — jetzt essen für besten Geschmack!' },
    'insight.balanced': { en: 'Acidity is balanced — pleasant tanginess', ko: '산도 균형 — 적절한 새콤함', zh: '酸度适中，口感平衡', de: 'Säure ist ausgewogen — angenehme Säure' },
    'insight.safe': { en: 'Already in the safe eating zone', ko: '이미 안전 섭취 구간입니다', zh: '已进入安全食用区间', de: 'Bereits in der sicheren Esszone' },
    'insight.notSafe': { en: 'Nitrite still elevated — wait a bit longer', ko: '아질산염 아직 높음 — 조금 더 기다리세요', zh: '亚硝酸盐尚未消退，再等等', de: 'Nitrit noch erhöht — noch etwas warten' },
    'insight.overSoon': { en: 'Will become noticeably sour if left longer', ko: '더 두면 눈에 띄게 시어집니다', zh: '再发酵会明显变酸', de: 'Wird merklich saurer, wenn länger stehen gelassen' },
    'insight.over': { en: 'Over-sour — good for stews and fried rice now', ko: '과숙 — 지금은 찌개나 볶음밥에 좋아요', zh: '已过酸 — 适合做汤、炒饭', de: 'Übersäuert — jetzt gut für Eintöpfe und Bratreis' },
    'insight.developing': { en: 'Still developing — mild flavor, needs more time', ko: '아직 발효 초기 — 순한 맛, 시간이 더 필요해요', zh: '仍在初期发酵，味道偏淡，需要更多时间', de: 'Noch in Entwicklung — milder Geschmack, braucht mehr Zeit' },
    'status.developing': { en: 'Developing', ko: '발효 중', zh: '发酵中', de: 'In Entwicklung' },
    'status.improving': { en: 'Improving', ko: '풍미 상승', zh: '风味上升', de: 'Verbessert sich' },
    'status.optimal': { en: 'Optimal', ko: '최적', zh: '最佳', de: 'Optimal' },
    'status.declining': { en: 'Declining', ko: '풍미 하락', zh: '风味下降', de: 'Abnehmend' },
    'status.overSour': { en: 'Over-sour', ko: '과숙', zh: '过酸', de: 'Übersäuert' },
    'ferment.moveToFridge': { en: 'Move to fridge', ko: '냉장고 이동', zh: '移入冰箱', de: 'In den Kühlschrank stellen' },
    'ferment.afterHours': { en: 'after h in fridge', ko: '냉장 후', zh: '冷藏后', de: 'nach Std. im Kühlschrank' },
    'ferment.elapsed': { en: 'Elapsed', ko: '경과', zh: '已经过', de: 'Vergangen' },
    'ferment.making': { en: 'Making Process', ko: '제조 과정', zh: '制作阶段', de: 'Herstellungsprozess' },
    'ferment.makingSub': { en: 'Expand for process & calculator', ko: '공정 및 계산기 펼치기', zh: '可展开详细流程与用量计算器', de: 'Aufklappen für Prozess & Rechner' },

    // Decision zone
    'dz.prefix': { en: 'Status:', ko: '현재 상태:', zh: '目前状态：', de: 'Status:' },
    'dz.developing': { en: 'Fermenting, not yet ripened', ko: '발효 중, 아직 숙성 미완료', zh: '发酵中，尚未熟成完毕', de: 'In Gärung, noch nicht gereift' },
    'dz.canEat': { en: 'Safe to eat', ko: '먹어도 됩니다', zh: '可以食用', de: 'Essbar' },
    'dz.bestNow': { en: 'Best flavor now', ko: '지금이 가장 맛있습니다', zh: '现在最好吃', de: 'Jetzt am besten' },
    'dz.overSour': { en: 'Over-sour — cook with it', ko: '과숙 — 요리에 활용하세요', zh: '偏酸 — 适合做菜', de: '\u00dcbers\u00e4uert \u2014 zum Kochen' },
    'dz.notSafe': { en: 'Fermenting, not yet ripened', ko: '발효 중, 아직 숙성 미완료', zh: '发酵中，尚未熟成完毕', de: 'In Gärung, noch nicht gereift' },
    'dz.elapsed': { en: '{d} since packed', ko: '장입 후 {d}', zh: '装坛后 {d}', de: '{d} seit Einpacken' },
    'dz.nextBest': { en: '{d} until best flavor', ko: '최적 풍미까지 {d}', zh: '距最佳风味 {d}', de: '{d} bis zum besten Geschmack' },
    'dz.pastBest': { en: '{d} past peak', ko: '최적기 이후 {d}', zh: '过了最佳期 {d}', de: '{d} nach Höhepunkt' },
    'ez.toggle': { en: 'Scientific Details', ko: '과학적 세부 정보', zh: '查看详情', de: 'Wissenschaftliche Details' },

    // Scoring breakdown (L2)
    'score.title': {
      en: 'How the score is calculated',
      ko: '점수 산출 기준',
      zh: '评分是怎么算的',
      de: 'So wird die Bewertung berechnet'
    },
    'score.ph.label': {
      en: 'pH proximity to 4.35',
      ko: 'pH 4.35 근접도',
      zh: 'pH 接近 4.35 的程度',
      de: 'pH-Nähe zu 4,35'
    },
    'score.acid.label': {
      en: 'Lactic acid near 0.6%',
      ko: '젖산 0.6% 근접도',
      zh: '乳酸接近 0.6% 的程度',
      de: 'Milchsäure nahe 0,6 %'
    },
    'score.microbe.label': {
      en: 'Leuconostoc proportion',
      ko: 'Leuconostoc 비율',
      zh: '明串珠菌占比',
      de: 'Leuconostoc-Anteil'
    },
    'score.weight': {
      en: 'weight',
      ko: '가중치',
      zh: '权重',
      de: 'Gewichtung'
    },

    // Extend flavor advice (L2)
    'extend.title': {
      en: 'How to extend peak flavor',
      ko: '최적 풍미를 오래 유지하는 법',
      zh: '如何延长最佳风味',
      de: 'So verlängern Sie den Spitzengeschmack'
    },
    'extend.chill': {
      en: 'Move to fridge (2-4\u00B0C) right at peak to slow fermentation',
      ko: '풍미 최적기에 냉장고(2-4\u00B0C)로 옮겨 발효를 늦추세요',
      zh: '在风味顶峰时移入冰箱（2-4\u00B0C）以减缓发酵',
      de: 'Bei Höhepunkt in den Kühlschrank (2–4 °C), um die Fermentation zu verlangsamen'
    },
    'extend.salt': {
      en: 'Slightly higher salt (2.5-3.5%) stretches the optimal window',
      ko: '소금 농도를 약간 높이면(2.5-3.5%) 최적 구간이 늘어납니다',
      zh: '适当提高盐浓度（2.5-3.5%）可以拉长最佳窗口',
      de: 'Etwas höherer Salzgehalt (2,5–3,5 %) verlängert das optimale Fenster'
    },
    'extend.starter': {
      en: 'Less starter = slower start = longer window before over-souring',
      ko: '종균을 줄이면 = 시작이 느려져 = 과숙까지 시간이 길어집니다',
      zh: '少用母水 = 起步更慢 = 到过酸之前的窗口更长',
      de: 'Weniger Starterkultur = langsamerer Start = längeres Fenster vor Übersäuerung'
    },
    'extend.stage': {
      en: 'Use 2-stage: warm start (6-10h) then fridge for deep, slow development',
      ko: '2단계 활용: 따뜻한 시작(6-10시간) → 냉장으로 깊고 느린 발달',
      zh: '用两段式：先室温启动（6-10小时）再冷藏慢熟',
      de: '2-Stufen-Methode: Warmer Start (6–10 Std.), dann Kühlschrank für tiefe, langsame Entwicklung'
    },
    'extend.already.cold': {
      en: 'Already using cold fermentation \u2014 your peak window is naturally longer',
      ko: '이미 저온 발효 중 \u2014 최적 구간이 자연히 깁니다',
      zh: '已在低温发酵 \u2014 最佳窗口本身就较长',
      de: 'Bereits Kaltfermentation — Ihr Spitzenfenster ist von Natur aus länger'
    },
    'extend.reduce.starter': {
      en: 'Try reducing starter to {n}% for a wider peak window',
      ko: '종균을 {n}%로 줄이면 최적 구간이 넓어집니다',
      zh: '试试把母水减到 {n}% 以拓宽最佳窗口',
      de: 'Versuchen Sie, die Starterkultur auf {n} % zu reduzieren für ein breiteres Spitzenfenster'
    },
    'extend.add.cold.stage': {
      en: 'Add a cold stage (4\u00B0C) after the warm start to stretch flavor development',
      ko: '따뜻한 시작 후 저온 단계(4\u00B0C)를 추가하면 풍미 발달이 길어집니다',
      zh: '在温暖启动后加一段冷藏（4\u00B0C）以延展风味',
      de: 'Fügen Sie nach dem warmen Start eine Kaltstufe (4 °C) hinzu, um die Geschmacksentwicklung zu verlängern'
    },

    // Recipe type selector
    'recipe.type.kimchi': { en: 'Kimchi', ko: '김치', zh: '韩国泡菜', de: 'Kimchi' },
    'recipe.type.sauerkraut': { en: 'Sauerkraut', ko: '사워크라우트', zh: '德国酸菜', de: 'Sauerkraut' },
    'recipe.type.paocai': { en: 'Sichuan Paocai', ko: '쓰촨 파오차이', zh: '四川泡菜', de: 'Sichuan Paocai' },

    // Sauerkraut calculator items
    'calc.sk.salt': { en: 'Salt (non-iodized)', ko: '소금 (비요오드)', zh: '盐（不含碘）', de: 'Salz (nicht jodiert)' },
    'calc.sk.juniper': { en: 'Juniper Berries', ko: '주니퍼 베리', zh: '杜松子', de: 'Wacholderbeeren' },
    'calc.sk.caraway': { en: 'Caraway Seeds', ko: '캐러웨이 씨', zh: '葛缕子', de: 'K\u00fcmmel' },
    'calc.sk.bay': { en: 'Bay Leaves', ko: '월계수 잎', zh: '月桂叶', de: 'Lorbeerbl\u00e4tter' },
    'calc.sk.pepper': { en: 'Peppercorns', ko: '통후추', zh: '胡椒粒', de: 'Pfefferk\u00f6rner' },
    'calc.sk.note': { en: 'Salt = 2% of cabbage weight. Only non-iodized salt.', ko: '소금 = 배추 무게의 2%. 비요오드 소금만 사용.', zh: '盐 = 白菜重量的2%，仅用无碘盐', de: 'Salz = 2% des Kohlgewichts. Nur nicht jodiertes Salz.' },

    // Sichuan paocai calculator items
    'calc.pc.salt': { en: 'Salt', ko: '소금', zh: '盐', de: 'Salz' },
    'calc.pc.sichuan': { en: 'Sichuan Peppercorn', ko: '쓰촨 후추', zh: '花椒', de: 'Sichuan-Pfeffer' },
    'calc.pc.chili': { en: 'Dried Chili', ko: '건고추', zh: '干辣椒', de: 'Trockene Chili' },
    'calc.pc.ginger': { en: 'Ginger', ko: '생강', zh: '生姜', de: 'Ingwer' },
    'calc.pc.garlic': { en: 'Garlic', ko: '마늘', zh: '大蒜', de: 'Knoblauch' },
    'calc.pc.baijiu': { en: 'Baijiu (or rice wine)', ko: '바이주 (또는 미린)', zh: '白酒', de: 'Baijiu (oder Reiswein)' },
    'calc.pc.sugar': { en: 'Brown Sugar', ko: '흑설탕', zh: '红糖', de: 'Brauner Zucker' },
    'calc.pc.water': { en: 'Brine Water', ko: '소금물', zh: '泡菜水', de: 'Salzlake' },
    'calc.pc.note': { en: 'Salt = 4% of vegetable weight. Brine covers all vegetables.', ko: '소금 = 채소 무게의 4%. 소금물이 모든 채소를 덮어야 함.', zh: '盐 = 蔬菜重量的4%，泡菜水须没过所有蔬菜', de: 'Salz = 4% des Gem\u00fcsegewichts. Lake muss alles bedecken.' },

    // Unit toggle labels
    'unit.metric': { en: 'Metric', ko: '미터법', zh: '公制', de: 'Metrisch' },
    'unit.imperial': { en: 'Imperial', ko: '야드파운드', zh: '英制', de: 'Imperial' }
  };

  var langOrder = ['zh', 'ko', 'en', 'de'];
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
