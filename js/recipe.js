/**
 * Fermentation Simulator — Recipe & Process Content
 * Supports: Kimchi, Sichuan Paocai, German Sauerkraut
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.recipe = (function () {
  'use strict';

  var currentType = 'kimchi';

  function getContent(lang, type) {
    type = type || currentType;
    if (type === 'sichuan') return getSichuanContent(lang);
    if (type === 'sauerkraut') return getSauerkrautContent(lang);
    // Default: kimchi
    if (lang === 'ko') return getKorean();
    if (lang === 'zh') return getChinese();
    return getEnglish();
  }

  // ─── Sichuan Paocai ───
  function getSichuanContent(lang) {
    if (lang === 'ko') return getSichuanKorean();
    if (lang === 'zh') return getSichuanChinese();
    return getSichuanEnglish();
  }

  function getSichuanEnglish() {
    return '<div class="recipe-inner">' +
    '<h4>Traditional Sichuan Paocai (泡菜)</h4>' +
    '<p>Sichuan paocai is a brine-fermented pickle from southwestern China. Unlike kimchi, vegetables ferment whole or in large pieces submerged in seasoned brine inside an earthenware jar (泡菜坛) with a water-seal lid.</p>' +

    '<h4>Brine Recipe (per 1L water)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Ingredient</th><th>Amount</th><th>Function</th></tr>' +
    '<tr><td>Water</td><td>1 L (boiled, cooled)</td><td>Base medium</td></tr>' +
    '<tr><td>Coarse Salt</td><td>50 g</td><td>Osmotic control, LAB selection</td></tr>' +
    '<tr><td>Sichuan Pepper (花椒)</td><td>10 g</td><td>Numbing aroma, antimicrobial</td></tr>' +
    '<tr><td>Baijiu (白酒)</td><td>15 ml</td><td>Antimicrobial, flavor complexity</td></tr>' +
    '<tr><td>Ginger</td><td>10 g, sliced</td><td>Flavor, mild antimicrobial</td></tr>' +
    '<tr><td>Sugar</td><td>8 g</td><td>LAB carbon source</td></tr>' +
    '<tr><td>Dried Chili</td><td>5 g</td><td>Flavor, capsaicin antimicrobial</td></tr>' +
    '<tr><td>Star Anise</td><td>3 g</td><td>Aromatic</td></tr>' +
    '<tr><td>Bay Leaf</td><td>2 g</td><td>Aromatic</td></tr>' +
    '</table>' +

    '<h4>Common Vegetables</h4>' +
    '<p>Radish (萝卜), long beans (豇豆), cabbage (圆白菜), chili pepper (辣椒), ginger, garlic — almost any crisp vegetable works.</p>' +

    '<h4>Standard Process (5 Steps)</h4>' +
    '<ol>' +
    '<li><strong>Prepare brine:</strong> Boil water with salt and spices, cool completely.</li>' +
    '<li><strong>Prepare vegetables:</strong> Wash, dry thoroughly. Cut into large pieces or leave whole. Ensure no oil or raw water contamination.</li>' +
    '<li><strong>Submerge in brine:</strong> Place vegetables in the jar (泡菜坛), pour cooled brine over until fully submerged.</li>' +
    '<li><strong>Seal the jar:</strong> Fill the water-seal groove with water. This creates an anaerobic environment — CO₂ escapes but air cannot enter.</li>' +
    '<li><strong>Ferment:</strong> 15-25°C for 3-7 days (quick/跳水泡菜), or 5-10°C for 2-4 weeks (slow/老泡菜).</li>' +
    '</ol>' +

    '<h4>Starter Brine (老盐水)</h4>' +
    '<p>The most important secret in Sichuan paocai: old brine (老盐水) from a previous batch. Add 10-20% by weight. A well-maintained mother brine can be decades old and contains a stable, proven LAB community.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Effect</th><th>Mechanism</th></tr>' +
    '<tr><td>Rapid acidification</td><td>Pre-adapted LAB at 10⁷-10⁹ CFU/mL bypass lag phase</td></tr>' +
    '<tr><td>Consistent flavor</td><td>Established microbial community produces reliable taste</td></tr>' +
    '<tr><td>Anti-spoilage</td><td>Low pH + competitive exclusion blocks unwanted organisms</td></tr>' +
    '<tr><td>Complex aroma</td><td>Accumulated metabolites from many batches add depth</td></tr>' +
    '</table>' +

    '<h4>Quality Indicators</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Stage</th><th>pH</th><th>Acidity</th><th>Characteristics</th></tr>' +
    '<tr><td>Fresh</td><td>> 5.0</td><td>< 0.2%</td><td>Salty, raw vegetable taste</td></tr>' +
    '<tr><td>Quick pickle</td><td>4.2 – 5.0</td><td>0.3 – 0.5%</td><td>Crisp, lightly sour, refreshing</td></tr>' +
    '<tr><td>Optimal (最佳)</td><td>3.8 – 4.2</td><td>0.5 – 0.8%</td><td>Sour-spicy balance, crisp texture, complex aroma</td></tr>' +
    '<tr><td>Over-fermented</td><td>< 3.8</td><td>> 0.9%</td><td>Very sour, softer texture (good for stir-fry: 酸菜鱼)</td></tr>' +
    '</table>' +
    '</div>';
  }

  function getSichuanKorean() {
    return '<div class="recipe-inner">' +
    '<h4>전통 쓰촨 파오차이 (泡菜)</h4>' +
    '<p>쓰촨 파오차이는 중국 남서부의 소금물 발효 절임입니다. 김치와 달리 채소를 통째로 또는 큰 조각으로 양념 소금물에 담가 도자기 항아리(泡菜坛)에서 발효합니다.</p>' +

    '<h4>소금물 레시피 (물 1L 기준)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>재료</th><th>분량</th><th>기능</th></tr>' +
    '<tr><td>물</td><td>1L (끓여서 식힌 것)</td><td>기본 배지</td></tr>' +
    '<tr><td>굵은소금</td><td>50g</td><td>삼투압 조절, 유산균 선택</td></tr>' +
    '<tr><td>화자오 (花椒)</td><td>10g</td><td>마비 향, 항균</td></tr>' +
    '<tr><td>바이주 (白酒)</td><td>15ml</td><td>항균, 풍미 복합성</td></tr>' +
    '<tr><td>생강</td><td>10g, 편으로</td><td>풍미, 약한 항균</td></tr>' +
    '<tr><td>설탕</td><td>8g</td><td>유산균 탄소원</td></tr>' +
    '<tr><td>마른 고추</td><td>5g</td><td>풍미, 캡사이신 항균</td></tr>' +
    '<tr><td>팔각</td><td>3g</td><td>향신료</td></tr>' +
    '<tr><td>월계수잎</td><td>2g</td><td>향신료</td></tr>' +
    '</table>' +

    '<h4>표준 공정 (5단계)</h4>' +
    '<ol>' +
    '<li><strong>소금물 준비:</strong> 물에 소금과 향신료를 넣고 끓인 후 완전히 식힌다.</li>' +
    '<li><strong>채소 준비:</strong> 세척 후 완전히 건조. 큰 조각으로 자르거나 통째로 사용. 기름이나 생수 오염 주의.</li>' +
    '<li><strong>소금물에 담그기:</strong> 항아리(泡菜坛)에 채소를 넣고 식힌 소금물을 완전히 잠길 때까지 붓는다.</li>' +
    '<li><strong>항아리 밀봉:</strong> 물때 홈에 물을 채운다. 이것이 혐기성 환경을 만든다.</li>' +
    '<li><strong>발효:</strong> 15-25°C에서 3-7일(빠른 발효) 또는 5-10°C에서 2-4주(느린 발효).</li>' +
    '</ol>' +

    '<h4>묵은 소금물 (老盐水)</h4>' +
    '<p>쓰촨 파오차이의 가장 중요한 비결: 이전 배치의 묵은 소금물. 무게의 10-20% 첨가. 잘 관리된 모체 소금물은 수십 년 된 것도 있습니다.</p>' +

    '<h4>품질 지표</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>단계</th><th>pH</th><th>산도</th><th>특성</th></tr>' +
    '<tr><td>초기</td><td>> 5.0</td><td>< 0.2%</td><td>짠맛, 생채소 맛</td></tr>' +
    '<tr><td>빠른 절임</td><td>4.2 – 5.0</td><td>0.3 – 0.5%</td><td>아삭, 살짝 신맛</td></tr>' +
    '<tr><td>최적</td><td>3.8 – 4.2</td><td>0.5 – 0.8%</td><td>신맛-매운맛 균형, 아삭한 식감</td></tr>' +
    '<tr><td>과숙</td><td>< 3.8</td><td>> 0.9%</td><td>매우 신맛, 무른 식감 (볶음 요리용)</td></tr>' +
    '</table>' +
    '</div>';
  }

  function getSichuanChinese() {
    return '<div class="recipe-inner">' +
    '<h4>传统四川泡菜</h4>' +
    '<p>四川泡菜是中国西南地区的盐水浸泡发酵腌菜。与韩式辣白菜不同，蔬菜以整块或大块浸入调味盐水，在泡菜坛中利用坛沿水封进行厌氧发酵。</p>' +

    '<h4>盐水配方（每1升水）</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>水</td><td>1升（煮沸放凉）</td><td>基础培养基</td></tr>' +
    '<tr><td>粗盐</td><td>50克</td><td>渗透压调控，筛选乳酸菌</td></tr>' +
    '<tr><td>花椒</td><td>10克</td><td>麻香，抑菌</td></tr>' +
    '<tr><td>白酒</td><td>15毫升</td><td>抑菌，增加风味层次</td></tr>' +
    '<tr><td>生姜</td><td>10克，切片</td><td>风味，轻度抑菌</td></tr>' +
    '<tr><td>白糖</td><td>8克</td><td>乳酸菌碳源</td></tr>' +
    '<tr><td>干辣椒</td><td>5克</td><td>风味，辣椒素抑菌</td></tr>' +
    '<tr><td>八角</td><td>3克</td><td>增香</td></tr>' +
    '<tr><td>香叶</td><td>2克</td><td>增香</td></tr>' +
    '</table>' +

    '<h4>常用蔬菜</h4>' +
    '<p>萝卜、豇豆、圆白菜、辣椒、生姜、大蒜——几乎任何爽脆蔬菜都可以泡制。</p>' +

    '<h4>标准制作流程（5步）</h4>' +
    '<ol>' +
    '<li><strong>制备盐水：</strong>将水与盐和香料一起煮沸，彻底放凉。</li>' +
    '<li><strong>处理蔬菜：</strong>清洗后完全晾干。切成大块或整棵使用。确保无油、无生水污染。</li>' +
    '<li><strong>浸入盐水：</strong>将蔬菜放入泡菜坛，倒入凉透的盐水直至完全没过蔬菜。</li>' +
    '<li><strong>密封坛口：</strong>在坛沿水槽中注满水，形成水封。CO₂ 可以逸出，但空气无法进入，创造厌氧环境。</li>' +
    '<li><strong>发酵：</strong>15-25°C 发酵3-7天（跳水泡菜/快泡），或 5-10°C 发酵2-4周（老泡菜/慢泡）。</li>' +
    '</ol>' +

    '<h4>老盐水（母水）</h4>' +
    '<p>四川泡菜最重要的秘诀：取上一坛的老盐水，按重量的 10-20% 添加。一坛养护得当的老盐水可以传承数十年，其中含有稳定而成熟的乳酸菌群落。</p>' +
    '<table class="recipe-table">' +
    '<tr><th>效果</th><th>机制</th></tr>' +
    '<tr><td>快速产酸</td><td>预适应的乳酸菌达 10⁷-10⁹ CFU/mL，跳过迟滞期</td></tr>' +
    '<tr><td>风味稳定</td><td>成熟菌群产生可靠、一致的口感</td></tr>' +
    '<tr><td>抑制腐败</td><td>低 pH + 竞争排斥阻止有害微生物</td></tr>' +
    '<tr><td>复合香气</td><td>多次发酵积累的代谢产物增加风味深度</td></tr>' +
    '</table>' +

    '<h4>品质指标</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>阶段</th><th>pH</th><th>酸度</th><th>特征</th></tr>' +
    '<tr><td>初泡</td><td>> 5.0</td><td>< 0.2%</td><td>咸味，生菜味</td></tr>' +
    '<tr><td>跳水泡菜</td><td>4.2 – 5.0</td><td>0.3 – 0.5%</td><td>脆爽，微酸，清新开胃</td></tr>' +
    '<tr><td>最佳熟成</td><td>3.8 – 4.2</td><td>0.5 – 0.8%</td><td>酸辣平衡，质地脆爽，复合香气</td></tr>' +
    '<tr><td>过熟</td><td>< 3.8</td><td>> 0.9%</td><td>酸味浓烈，质地变软（适合做酸菜鱼等菜肴）</td></tr>' +
    '</table>' +
    '</div>';
  }

  function getEnglish() {
    return '<div class="recipe-inner">' +

    '<h4>International Standard: Codex CXS 223-2001</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Specification</th></tr>' +
    '<tr><td>Definition</td><td>Fermented food using salted napa cabbage with seasonings, undergoing lactic acid production at low temperature</td></tr>' +
    '<tr><td>Salt (NaCl)</td><td>1.0 – 4.0%</td></tr>' +
    '<tr><td>Total Acidity</td><td>&le; 1.0%</td></tr>' +
    '<tr><td>pH (CCP)</td><td>&le; 4.6</td></tr>' +
    '<tr><td>Mineral Impurities</td><td>&le; 0.03%</td></tr>' +
    '</table>' +

    '<h4>Korean Standard: KS H 2169</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Spiciness Level</th><th>Capsaicinoids</th></tr>' +
    '<tr><td>Mild (순한)</td><td>&lt; 2.9 ppm</td></tr>' +
    '<tr><td>Medium (보통)</td><td>2.9 – 14.9 ppm</td></tr>' +
    '<tr><td>Spicy (매운)</td><td>&ge; 14.9 ppm</td></tr>' +
    '</table>' +

    '<h4>Traditional Recipe (per 1 napa cabbage head / 1포기)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Ingredient</th><th>Amount</th><th>Function</th></tr>' +
    '<tr><td>Napa Cabbage (배추)</td><td>1 head (~2.5 kg)</td><td>Primary substrate</td></tr>' +
    '<tr><td>Coarse Salt (굵은소금)</td><td>1 cup (for curing)</td><td>Osmotic dehydration, LAB selection</td></tr>' +
    '<tr><td>Red Chili Powder (고춧가루)</td><td>1 cup</td><td>Color, capsaicin antimicrobial, flavor</td></tr>' +
    '<tr><td>Fish Sauce (멸치액젓)</td><td>3 tbsp</td><td>Umami, nitrogen source for LAB</td></tr>' +
    '<tr><td>Salted Shrimp (새우젓)</td><td>2 tbsp</td><td>Umami, enzymes for protein breakdown</td></tr>' +
    '<tr><td>Garlic (마늘)</td><td>5-6 cloves, minced</td><td>Flavor, mild antimicrobial</td></tr>' +
    '<tr><td>Ginger (생강)</td><td>1 tsp, minced</td><td>Flavor, antimicrobial</td></tr>' +
    '<tr><td>Sweet Rice Paste (찹쌀풀)</td><td>3 tbsp</td><td>Binding, sugar source for LAB</td></tr>' +
    '<tr><td>Green Onion (쪽파)</td><td>5-6 stalks</td><td>Flavor, texture</td></tr>' +
    '</table>' +
    '<p><strong>Key ratio:</strong> Fish sauce : Shrimp paste = 3 : 2 (optimal umami balance)</p>' +
    '<p><strong>Government standard (농촌진흥청):</strong> 4.5g chili powder + 2.0g garlic per 100g salted cabbage</p>' +

    '<h4>Standard Process (6 Steps)</h4>' +
    '<ol>' +
    '<li><strong>Cut & Salt:</strong> Split cabbage, sprinkle coarse salt between leaves. Soak in 12-15% brine for 6-8 hours.</li>' +
    '<li><strong>Test Readiness:</strong> Stem should bend without breaking (줄기가 꺾이지 않아야 함). Target leaf salt: 1.5-2.0%.</li>' +
    '<li><strong>Rinse & Drain:</strong> Rinse 3 times in cold water. Drain cut-side down for 1-2 hours.</li>' +
    '<li><strong>Prepare Seasoning:</strong> Make sweet rice paste base. Mix with fish sauce, shrimp paste, chili powder, garlic, ginger.</li>' +
    '<li><strong>Apply Seasoning:</strong> Spread paste between each leaf, working from outer to inner leaves.</li>' +
    '<li><strong>Pack & Ferment:</strong> Pack tightly into fermentation vessel, minimizing air gaps. Ferment at 2-5°C for 2-3 weeks (slow) or 15-20°C for 2-3 days (fast).</li>' +
    '</ol>' +

    '<h4>Starter Culture (종균/母水) — Old Kimchi Brine</h4>' +
    '<p>Traditional method (backslopping): add 5-10% (by weight) of brine from a previous batch of well-fermented kimchi (묵은지국물). This acts as a natural starter culture, similar to sourdough starter or yogurt mother.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Effect</th><th>Mechanism</th></tr>' +
    '<tr><td>Faster fermentation</td><td>Pre-adapted LAB bypass lag phase (10⁶-10⁸ CFU/mL)</td></tr>' +
    '<tr><td>Lower initial pH</td><td>Brine is acidic (pH ~3.5-4.0), immediately lowers starting pH</td></tr>' +
    '<tr><td>More consistent flavor</td><td>Introduces proven Leuconostoc-dominant community</td></tr>' +
    '<tr><td>Reduced spoilage risk</td><td>Competitive exclusion of unwanted microorganisms</td></tr>' +
    '</table>' +
    '<p><strong>Recommended dosage:</strong> 5-10% for home use. Industrial use may standardize with pure LAB starters (종균).</p>' +

    '<h4>Quality Indicators</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Stage</th><th>pH</th><th>Acidity</th><th>Characteristics</th></tr>' +
    '<tr><td>Under-fermented</td><td>&gt; 5.0</td><td>&lt; 0.2%</td><td>Salty, raw vegetable taste</td></tr>' +
    '<tr><td>Developing</td><td>4.5 – 5.0</td><td>0.2 – 0.4%</td><td>Mild sourness emerging</td></tr>' +
    '<tr><td>Optimal (최적)</td><td>4.0 – 4.5</td><td>0.4 – 0.8%</td><td>Balanced sour-umami, crisp texture, complex aroma</td></tr>' +
    '<tr><td>Over-fermented</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>Strongly sour, soft texture (good for cooking: 김치찌개)</td></tr>' +
    '</table>' +

    '</div>';
  }

  function getKorean() {
    return '<div class="recipe-inner">' +

    '<h4>국제표준: Codex CXS 223-2001</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>항목</th><th>규격</th></tr>' +
    '<tr><td>정의</td><td>절인 배추를 주원료로 양념류를 혼합하여 저온에서 젖산생성 과정을 거쳐 발효된 식품</td></tr>' +
    '<tr><td>소금 (NaCl)</td><td>1.0 – 4.0%</td></tr>' +
    '<tr><td>총산도</td><td>&le; 1.0%</td></tr>' +
    '<tr><td>pH (중요관리점)</td><td>&le; 4.6</td></tr>' +
    '<tr><td>이물</td><td>&le; 0.03%</td></tr>' +
    '</table>' +

    '<h4>한국산업표준: KS H 2169</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>매운맛 등급</th><th>캡사이시노이드</th></tr>' +
    '<tr><td>순한맛</td><td>&lt; 2.9 ppm</td></tr>' +
    '<tr><td>보통 매운맛</td><td>2.9 – 14.9 ppm</td></tr>' +
    '<tr><td>매운맛</td><td>&ge; 14.9 ppm</td></tr>' +
    '</table>' +

    '<h4>전통 레시피 (배추 1포기 기준)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>재료</th><th>분량</th><th>기능</th></tr>' +
    '<tr><td>배추</td><td>1포기 (~2.5 kg)</td><td>주재료</td></tr>' +
    '<tr><td>굵은소금</td><td>1컵 (절임용)</td><td>삼투압 탈수, 유산균 선택</td></tr>' +
    '<tr><td>고춧가루</td><td>1컵</td><td>색, 캡사이신 항균, 풍미</td></tr>' +
    '<tr><td>멸치액젓</td><td>3큰술</td><td>감칠맛, 유산균 질소원</td></tr>' +
    '<tr><td>새우젓</td><td>2큰술</td><td>감칠맛, 단백질 분해 효소</td></tr>' +
    '<tr><td>마늘</td><td>5-6쪽, 다진 것</td><td>풍미, 약한 항균</td></tr>' +
    '<tr><td>생강</td><td>1작은술, 다진 것</td><td>풍미, 항균</td></tr>' +
    '<tr><td>찹쌀풀</td><td>3큰술</td><td>결착, 유산균 당원</td></tr>' +
    '<tr><td>쪽파</td><td>5-6줄기</td><td>풍미, 식감</td></tr>' +
    '</table>' +
    '<p><strong>핵심 비율:</strong> 멸치액젓 : 새우젓 = 3 : 2 (최적 감칠맛 균형)</p>' +
    '<p><strong>농촌진흥청 표준:</strong> 절인 배추 100g당 고춧가루 4.5g + 마늘 2.0g</p>' +

    '<h4>표준 공정 (6단계)</h4>' +
    '<ol>' +
    '<li><strong>절단 및 절임:</strong> 배추를 반으로 가르고 잎 사이에 굵은소금을 뿌린다. 12-15% 소금물에 6-8시간 절인다.</li>' +
    '<li><strong>절임 확인:</strong> 줄기부분을 구부렸을 때 꺾이지 않아야 함. 목표 엽내 염도: 1.5-2.0%.</li>' +
    '<li><strong>세척 및 탈수:</strong> 찬물에 3회 헹군다. 절단면이 아래로 가도록 1-2시간 물기를 뺀다.</li>' +
    '<li><strong>양념 준비:</strong> 찹쌀풀을 만들고 액젓, 새우젓, 고춧가루, 마늘, 생강을 혼합한다.</li>' +
    '<li><strong>양념 바르기:</strong> 바깥잎부터 안쪽잎까지 양념을 고루 바른다.</li>' +
    '<li><strong>담기 및 발효:</strong> 발효 용기에 꼭꼭 눌러 담아 공기 접촉을 최소화한다. 2-5°C에서 2-3주(저온) 또는 15-20°C에서 2-3일(고온) 발효.</li>' +
    '</ol>' +

    '<h4>종균 (母水) — 묵은지국물</h4>' +
    '<p>전통 방법: 이전에 잘 발효된 김치의 국물(묵은지국물)을 배추 무게의 5-10% 첨가한다. 이는 요거트 종균이나 사워도우 스타터와 같은 천연 종균 역할을 한다.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>효과</th><th>메커니즘</th></tr>' +
    '<tr><td>발효 촉진</td><td>적응된 유산균이 지연기를 단축 (10⁶-10⁸ CFU/mL)</td></tr>' +
    '<tr><td>초기 pH 저하</td><td>국물 자체가 산성 (pH ~3.5-4.0)이므로 시작 pH를 낮춤</td></tr>' +
    '<tr><td>일관된 풍미</td><td>검증된 Leuconostoc 우세 군집을 도입</td></tr>' +
    '<tr><td>부패 위험 감소</td><td>유해 미생물에 대한 경쟁적 배제</td></tr>' +
    '</table>' +
    '<p><strong>권장 사용량:</strong> 가정용 5-10%. 산업용은 순수 유산균 종균(종균)으로 표준화할 수 있음.</p>' +

    '<h4>품질 지표</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>단계</th><th>pH</th><th>산도</th><th>특성</th></tr>' +
    '<tr><td>미숙</td><td>&gt; 5.0</td><td>&lt; 0.2%</td><td>짠맛, 생채소 맛</td></tr>' +
    '<tr><td>발효 중</td><td>4.5 – 5.0</td><td>0.2 – 0.4%</td><td>약한 신맛 발현</td></tr>' +
    '<tr><td>최적 숙성</td><td>4.0 – 4.5</td><td>0.4 – 0.8%</td><td>신맛-감칠맛 균형, 아삭한 식감, 복합적 향</td></tr>' +
    '<tr><td>과숙</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>강한 신맛, 무른 식감 (김치찌개용)</td></tr>' +
    '</table>' +

    '</div>';
  }

  // ─── German Sauerkraut ───
  function getSauerkrautContent(lang) {
    if (lang === 'ko') return getSauerkrautKorean();
    if (lang === 'zh') return getSauerkrautChinese();
    return getSauerkrautEnglish();
  }

  function getSauerkrautEnglish() {
    return '<div class="recipe-inner">' +
    '<h4>Traditional German Sauerkraut</h4>' +
    '<p>Sauerkraut is one of the simplest fermented foods: just cabbage and salt. The natural LAB on cabbage leaves do all the work. No brine is added — the salt draws liquid from the cabbage itself.</p>' +

    '<h4>Recipe (per 1 kg cabbage)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Ingredient</th><th>Amount</th><th>Function</th></tr>' +
    '<tr><td>White Cabbage</td><td>1 kg, finely shredded</td><td>Primary substrate</td></tr>' +
    '<tr><td>Coarse Salt</td><td>20 g (2% by weight)</td><td>Osmotic dehydration, LAB selection</td></tr>' +
    '<tr><td>Caraway Seeds (optional)</td><td>3 g</td><td>Traditional flavor</td></tr>' +
    '<tr><td>Juniper Berries (optional)</td><td>2 g</td><td>Aromatic, antimicrobial</td></tr>' +
    '<tr><td>Bay Leaf (optional)</td><td>2 leaves</td><td>Aromatic</td></tr>' +
    '</table>' +

    '<h4>Standard Process (4 Steps)</h4>' +
    '<ol>' +
    '<li><strong>Shred cabbage:</strong> Remove outer leaves (save for covering). Quarter, core, then shred finely (2-3 mm).</li>' +
    '<li><strong>Salt and massage:</strong> Mix salt into cabbage. Massage firmly for 5-10 minutes until liquid pools at the bottom. Rest 30 minutes, massage again.</li>' +
    '<li><strong>Pack tightly:</strong> Press cabbage into a clean vessel (crock, jar, or food-grade bucket). Push down firmly — the brine must cover the cabbage completely. Place saved leaves on top, then a weight to keep everything submerged.</li>' +
    '<li><strong>Ferment:</strong> Cover loosely (gas must escape). 18-22°C for 3-5 days (initial active phase), then move to 10-15°C for 2-4 weeks. Skim any surface scum if it appears.</li>' +
    '</ol>' +

    '<h4>Quality Indicators</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Stage</th><th>pH</th><th>Acidity</th><th>Characteristics</th></tr>' +
    '<tr><td>Day 1-2</td><td>> 5.5</td><td>< 0.2%</td><td>Salty, bubbling begins, mild cabbage aroma</td></tr>' +
    '<tr><td>Day 3-7</td><td>4.5 – 5.5</td><td>0.3 – 0.5%</td><td>Active bubbling, developing tang, still crunchy</td></tr>' +
    '<tr><td>Week 2-4 (optimal)</td><td>3.8 – 4.5</td><td>0.6 – 1.0%</td><td>Clean sour, firm-tender texture, complex flavor</td></tr>' +
    '<tr><td>Over-fermented</td><td>< 3.5</td><td>> 1.2%</td><td>Very sour, soft texture (good for cooking: Choucroute)</td></tr>' +
    '</table>' +

    '<h4>Key Tips</h4>' +
    '<ul>' +
    '<li>Keep cabbage submerged at all times — exposed cabbage will mold</li>' +
    '<li>No starter needed — wild LAB on cabbage are sufficient</li>' +
    '<li>Temperature is critical: too warm (>25°C) produces off-flavors; too cold (<10°C) stalls fermentation</li>' +
    '<li>Ready sauerkraut keeps for months refrigerated</li>' +
    '</ul>' +
    '</div>';
  }

  function getSauerkrautKorean() {
    return '<div class="recipe-inner">' +
    '<h4>전통 독일 자우어크라우트</h4>' +
    '<p>자우어크라우트는 가장 단순한 발효식품 중 하나입니다: 양배추와 소금만으로 만듭니다. 양배추 잎에 자연적으로 존재하는 유산균이 모든 일을 합니다.</p>' +

    '<h4>레시피 (양배추 1kg 기준)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>재료</th><th>분량</th><th>기능</th></tr>' +
    '<tr><td>양배추</td><td>1kg, 가늘게 채 썬 것</td><td>주재료</td></tr>' +
    '<tr><td>굵은소금</td><td>20g (무게의 2%)</td><td>삼투압 탈수, 유산균 선택</td></tr>' +
    '<tr><td>캐러웨이 씨앗 (선택)</td><td>3g</td><td>전통 풍미</td></tr>' +
    '<tr><td>주니퍼 베리 (선택)</td><td>2g</td><td>향, 항균</td></tr>' +
    '<tr><td>월계수잎 (선택)</td><td>2장</td><td>향신료</td></tr>' +
    '</table>' +

    '<h4>표준 공정 (4단계)</h4>' +
    '<ol>' +
    '<li><strong>양배추 채 썰기:</strong> 바깥잎을 떼어두고, 4등분 후 심을 제거하고 2-3mm로 가늘게 채 썬다.</li>' +
    '<li><strong>소금 절이기:</strong> 소금을 넣고 5-10분간 힘껏 주무른다. 30분 휴지 후 다시 주무른다.</li>' +
    '<li><strong>꽉 눌러 담기:</strong> 깨끗한 용기에 꾹꾹 눌러 담는다. 소금물이 양배추를 완전히 덮어야 한다. 무거운 것으로 눌러둔다.</li>' +
    '<li><strong>발효:</strong> 18-22°C에서 3-5일 (초기 활성 단계), 이후 10-15°C로 옮겨 2-4주간 발효.</li>' +
    '</ol>' +

    '<h4>품질 지표</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>단계</th><th>pH</th><th>산도</th><th>특성</th></tr>' +
    '<tr><td>1-2일</td><td>> 5.5</td><td>< 0.2%</td><td>짠맛, 발포 시작</td></tr>' +
    '<tr><td>3-7일</td><td>4.5 – 5.5</td><td>0.3 – 0.5%</td><td>활발한 발포, 신맛 발달</td></tr>' +
    '<tr><td>2-4주 (최적)</td><td>3.8 – 4.5</td><td>0.6 – 1.0%</td><td>깨끗한 신맛, 적당히 아삭</td></tr>' +
    '<tr><td>과숙</td><td>< 3.5</td><td>> 1.2%</td><td>매우 신맛, 무른 식감 (요리용)</td></tr>' +
    '</table>' +
    '</div>';
  }

  function getSauerkrautChinese() {
    return '<div class="recipe-inner">' +
    '<h4>传统德国酸菜（Sauerkraut）</h4>' +
    '<p>酸菜是最简单的发酵食品之一：只需卷心菜和盐。卷心菜叶片上天然存在的乳酸菌会完成所有发酵工作。不需要额外加水——盐会从卷心菜中析出水分。</p>' +

    '<h4>配方（每1公斤卷心菜）</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>白卷心菜</td><td>1公斤，细切丝</td><td>主料基质</td></tr>' +
    '<tr><td>粗盐</td><td>20克（重量的2%）</td><td>渗透脱水，筛选乳酸菌</td></tr>' +
    '<tr><td>葛缕子（可选）</td><td>3克</td><td>传统风味</td></tr>' +
    '<tr><td>杜松子（可选）</td><td>2克</td><td>增香，抑菌</td></tr>' +
    '<tr><td>香叶（可选）</td><td>2片</td><td>增香</td></tr>' +
    '</table>' +

    '<h4>标准制作流程（4步）</h4>' +
    '<ol>' +
    '<li><strong>切丝：</strong>去掉外叶（留作覆盖用），四等分去芯，切成2-3毫米细丝。</li>' +
    '<li><strong>揉盐：</strong>撒入盐后用力揉搓5-10分钟，直到底部出水。静置30分钟后再揉一次。</li>' +
    '<li><strong>紧密装坛：</strong>将卷心菜紧紧压入干净容器（陶缸、玻璃罐或食品级桶）。用力按压——盐水必须完全没过菜丝。上面铺一层外叶，再放重物压住。</li>' +
    '<li><strong>发酵：</strong>18-22°C 发酵3-5天（初期活跃阶段），然后移至 10-15°C 继续发酵2-4周。如表面出现浮沫，及时撇去。</li>' +
    '</ol>' +

    '<h4>品质指标</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>阶段</th><th>pH</th><th>酸度</th><th>特征</th></tr>' +
    '<tr><td>第1-2天</td><td>> 5.5</td><td>< 0.2%</td><td>咸味，开始冒泡，淡卷心菜香</td></tr>' +
    '<tr><td>第3-7天</td><td>4.5 – 5.5</td><td>0.3 – 0.5%</td><td>活跃冒泡，酸味渐起，口感仍脆</td></tr>' +
    '<tr><td>第2-4周（最佳）</td><td>3.8 – 4.5</td><td>0.6 – 1.0%</td><td>纯净酸香，质地韧脆，风味丰富</td></tr>' +
    '<tr><td>过熟</td><td>< 3.5</td><td>> 1.2%</td><td>酸味浓烈，质地变软（适合炖煮，如法式酸菜锅）</td></tr>' +
    '</table>' +

    '<h4>要点提示</h4>' +
    '<ul>' +
    '<li>确保菜丝始终浸没在盐水中——露出水面的部分会长霉</li>' +
    '<li>无需母水——卷心菜上的野生乳酸菌已足够</li>' +
    '<li>温度很关键：过高（>25°C）产生异味；过低（<10°C）发酵停滞</li>' +
    '<li>做好的酸菜冷藏可保存数月</li>' +
    '</ul>' +
    '</div>';
  }

  /**
   * Initialize recipe section
   */
  function init() {
    var content = document.getElementById('recipe-content');
    var toggle = document.getElementById('recipe-toggle');
    if (!content || !toggle) return;

    var lang = window.KimchiSim.i18n.getLang();
    content.innerHTML = getContent(lang, currentType);

    toggle.addEventListener('click', function () {
      content.classList.toggle('expanded');
      var arrow = toggle.querySelector('.toggle-arrow');
      if (arrow) {
        arrow.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : '';
      }
    });
  }

  function updateLang() {
    var content = document.getElementById('recipe-content');
    if (!content) return;
    var lang = window.KimchiSim.i18n.getLang();
    content.innerHTML = getContent(lang, currentType);
  }

  function setFermentType(type) {
    currentType = type || 'kimchi';
    updateLang();
  }

  function getChinese() {
    return '<div class="recipe-inner">' +

    '<h4>国际标准：Codex CXS 223-2001</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>项目</th><th>规格</th></tr>' +
    '<tr><td>定义</td><td>以腌渍大白菜为主料，混合调味料，经低温乳酸发酵制成的食品</td></tr>' +
    '<tr><td>食盐 (NaCl)</td><td>1.0 – 4.0%</td></tr>' +
    '<tr><td>总酸度</td><td>&le; 1.0%</td></tr>' +
    '<tr><td>pH（关键控制点）</td><td>&le; 4.6</td></tr>' +
    '<tr><td>矿物杂质</td><td>&le; 0.03%</td></tr>' +
    '</table>' +

    '<h4>韩国标准：KS H 2169</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>辣度等级</th><th>辣椒素含量</th></tr>' +
    '<tr><td>微辣（순한맛）</td><td>&lt; 2.9 ppm</td></tr>' +
    '<tr><td>中辣（보통）</td><td>2.9 – 14.9 ppm</td></tr>' +
    '<tr><td>辣（매운맛）</td><td>&ge; 14.9 ppm</td></tr>' +
    '</table>' +

    '<h4>传统配方（每1棵大白菜 / 1포기）</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>大白菜（배추）</td><td>1棵（约2.5公斤）</td><td>主料基质</td></tr>' +
    '<tr><td>粗盐（굵은소금）</td><td>1杯（腌制用）</td><td>渗透脱水，筛选乳酸菌</td></tr>' +
    '<tr><td>辣椒粉（고춧가루）</td><td>1杯</td><td>色泽、辣椒素抑菌、风味</td></tr>' +
    '<tr><td>鱼露（멸치액젓）</td><td>3大匙</td><td>鲜味，乳酸菌氮源</td></tr>' +
    '<tr><td>虾酱（새우젓）</td><td>2大匙</td><td>鲜味，蛋白质分解酶</td></tr>' +
    '<tr><td>大蒜（마늘）</td><td>5-6瓣，切末</td><td>风味，轻度抑菌</td></tr>' +
    '<tr><td>生姜（생강）</td><td>1小匙，切末</td><td>风味，抑菌</td></tr>' +
    '<tr><td>糯米糊（찹쌀풀）</td><td>3大匙</td><td>粘合调料，乳酸菌糖源</td></tr>' +
    '<tr><td>小葱（쪽파）</td><td>5-6根</td><td>风味，口感</td></tr>' +
    '</table>' +
    '<p><strong>核心比例：</strong>鱼露 : 虾酱 = 3 : 2（最佳鲜味平衡）</p>' +
    '<p><strong>农村振兴厅标准：</strong>每100克腌白菜配辣椒粉4.5克 + 大蒜2.0克</p>' +

    '<h4>标准制作流程（6步）</h4>' +
    '<ol>' +
    '<li><strong>切分与腌制：</strong>大白菜对半切开，叶间撒粗盐。浸入12-15%盐水中6-8小时。</li>' +
    '<li><strong>检验腌制程度：</strong>茎部弯曲而不折断即可。目标叶片含盐量：1.5-2.0%。</li>' +
    '<li><strong>冲洗与沥干：</strong>冷水冲洗3次，切面朝下沥水1-2小时。</li>' +
    '<li><strong>调制酱料：</strong>制作糯米糊底料，混入鱼露、虾酱、辣椒粉、蒜末、姜末。</li>' +
    '<li><strong>涂抹酱料：</strong>从外叶到内叶逐层均匀涂抹。</li>' +
    '<li><strong>装坛发酵：</strong>紧密装入发酵容器，尽量排除空气。2-5°C低温发酵2-3周，或15-20°C常温发酵2-3天。</li>' +
    '</ol>' +

    '<h4>母水（종균）— 老泡菜发酵液</h4>' +
    '<p>传统方法（回浆法/backslopping）：取前一坛充分发酵的泡菜液（묵은지국물），按白菜重量的5-10%添加。这相当于天然发酵剂，类似酸面团的"老面"或酸奶的"引种"。</p>' +
    '<table class="recipe-table">' +
    '<tr><th>效果</th><th>机制</th></tr>' +
    '<tr><td>加速发酵</td><td>预适应的乳酸菌跳过迟滞期（含10⁶-10⁸ CFU/mL活菌）</td></tr>' +
    '<tr><td>降低初始pH</td><td>老汤本身呈酸性（pH约3.5-4.0），直接降低起始pH</td></tr>' +
    '<tr><td>风味更稳定</td><td>引入经验证的Leuconostoc优势菌群</td></tr>' +
    '<tr><td>降低腐败风险</td><td>对有害微生物的竞争性排斥</td></tr>' +
    '</table>' +
    '<p><strong>推荐用量：</strong>家庭制作5-10%；工业生产可使用纯乳酸菌种（종균）标准化。</p>' +

    '<h4>品质指标</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>阶段</th><th>pH</th><th>酸度</th><th>特征</th></tr>' +
    '<tr><td>未熟</td><td>&gt; 5.0</td><td>&lt; 0.2%</td><td>咸味，生菜味</td></tr>' +
    '<tr><td>发酵中</td><td>4.5 – 5.0</td><td>0.2 – 0.4%</td><td>轻微酸味出现</td></tr>' +
    '<tr><td>最佳熟成</td><td>4.0 – 4.5</td><td>0.4 – 0.8%</td><td>酸鲜平衡，脆爽口感，复合香气</td></tr>' +
    '<tr><td>过熟</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>强酸味，质地变软（适合做泡菜锅 김치찌개）</td></tr>' +
    '</table>' +

    '</div>';
  }

  return { init: init, updateLang: updateLang, setFermentType: setFermentType };
})();
