/**
 * Kimchi Fermentation Simulator — Standard Recipe & Industry Standards
 * Codex CXS 223-2001, KS H 2169, Traditional Korean Recipe
 */
window.KimchiSim = window.KimchiSim || {};

window.KimchiSim.recipe = (function () {
  'use strict';

  function getContent(lang) {
    if (lang === 'ko') return getKorean();
    if (lang === 'zh') return getChinese();
    if (lang === 'de') return getGerman();
    return getEnglish();
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

    '<h4>Starter Culture — Old Kimchi Brine (Backslopping)</h4>' +
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

    '<h4>종균 — 묵은지국물</h4>' +
    '<p>전통 방법: 이전에 잘 발효된 김치의 국물(묵은지국물)을 배추 무게의 5-10% 첨가한다. 이는 요거트 종균이나 사워도우 종균과 같은 천연 종균 역할을 한다.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>효과</th><th>메커니즘</th></tr>' +
    '<tr><td>발효 촉진</td><td>적응된 유산균이 지연기를 단축 (10⁶-10⁸ CFU/mL)</td></tr>' +
    '<tr><td>초기 pH 저하</td><td>국물 자체가 산성 (pH ~3.5-4.0)이므로 시작 pH를 낮춤</td></tr>' +
    '<tr><td>일관된 풍미</td><td>검증된 Leuconostoc 우세 군집을 도입</td></tr>' +
    '<tr><td>부패 위험 감소</td><td>유해 미생물에 대한 경쟁적 배제</td></tr>' +
    '</table>' +
    '<p><strong>권장 사용량:</strong> 가정용 5-10%. 산업용은 순수 유산균 종균으로 표준화할 수 있음.</p>' +

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

  /**
   * Initialize recipe section
   */
  function init() {
    var content = document.getElementById('recipe-content');
    var toggle = document.getElementById('recipe-toggle');
    if (!content || !toggle) return;

    var lang = window.KimchiSim.i18n.getLang();
    content.innerHTML = getContent(lang);

    // <details> handles toggle natively, no JS needed
  }

  /**
   * Update recipe content for language change
   */
  function updateLang() {
    var content = document.getElementById('recipe-content');
    if (!content) return;
    var lang = window.KimchiSim.i18n.getLang();
    content.innerHTML = getContent(lang);
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

    '<h4>酵种 — 老泡菜发酵液（回浆法 Backslopping）</h4>' +
    '<p>传统方法：取前一坛充分发酵的泡菜液，按白菜重量的5-10%添加。这相当于天然发酵剂，类似酸面团的"老面"或酸奶的"引种"。</p>' +
    '<table class="recipe-table">' +
    '<tr><th>效果</th><th>机制</th></tr>' +
    '<tr><td>加速发酵</td><td>预适应的乳酸菌跳过迟滞期（含10⁶-10⁸ CFU/mL活菌）</td></tr>' +
    '<tr><td>降低初始pH</td><td>老汤本身呈酸性（pH约3.5-4.0），直接降低起始pH</td></tr>' +
    '<tr><td>风味更稳定</td><td>引入经验证的Leuconostoc优势菌群</td></tr>' +
    '<tr><td>降低腐败风险</td><td>对有害微生物的竞争性排斥</td></tr>' +
    '</table>' +
    '<p><strong>推荐用量：</strong>家庭制作5-10%；工业生产可使用纯乳酸菌酵种标准化。</p>' +

    '<h4>品质指标</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>阶段</th><th>pH</th><th>酸度</th><th>特征</th></tr>' +
    '<tr><td>未熟</td><td>&gt; 5.0</td><td>&lt; 0.2%</td><td>咸味，生菜味</td></tr>' +
    '<tr><td>发酵中</td><td>4.5 – 5.0</td><td>0.2 – 0.4%</td><td>轻微酸味出现</td></tr>' +
    '<tr><td>最佳熟成</td><td>4.0 – 4.5</td><td>0.4 – 0.8%</td><td>酸鲜平衡，脆爽口感，复合香气</td></tr>' +
    '<tr><td>过熟</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>强酸味，质地变软（适合做泡菜锅 김치찌개）</td></tr>' +
    '</table>' +

    '</div>' +

    getSichuan();
  }

  function getSichuan() {
    return '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +

    '<h3>四川泡菜</h3>' +

    '<h4>国家标准：GB/T 24421-2009《泡菜》</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>项目</th><th>规格</th></tr>' +
    '<tr><td>定义</td><td>以新鲜蔬菜为原料，经食盐水浸泡自然发酵（乳酸发酵）而成的蔬菜制品</td></tr>' +
    '<tr><td>食盐</td><td>3.0 \u2013 8.0%（盐水浓度）</td></tr>' +
    '<tr><td>总酸度（以乳酸计）</td><td>0.3 \u2013 1.0%</td></tr>' +
    '<tr><td>pH</td><td>3.5 \u2013 4.5（成熟品）</td></tr>' +
    '<tr><td>亚硝酸盐</td><td>\u2264 4 mg/kg</td></tr>' +
    '<tr><td>食品添加剂</td><td>不得使用人工防腐剂（传统工艺）</td></tr>' +
    '</table>' +

    '<h4>四川地方特色</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>特征</th><th>说明</th></tr>' +
    '<tr><td>发酵容器</td><td>泡菜坛子（陶瓷坛）\u2014\u2014 坛口有凹槽（水槽），注水形成厌氧密封</td></tr>' +
    '<tr><td>水封发酵法</td><td>坛沿注入清水，盖上坛盖，利用水封隔绝空气，维持严格厌氧环境。水槽需每2\u20133天检查补水。</td></tr>' +
    '<tr><td>花椒</td><td>核心香料，提供独特麻味，兼有抑菌作用</td></tr>' +
    '<tr><td>干辣椒</td><td>整根投入，增色增香，辣椒素抑制杂菌</td></tr>' +
    '<tr><td>老姜</td><td>切厚片投入，增香暖胃，姜辣素有抑菌功能</td></tr>' +
    '<tr><td>大蒜</td><td>整瓣投入，大蒜素抑制有害菌</td></tr>' +
    '<tr><td>白酒</td><td>加入少量高度白酒（\u226552\u00b0），乙醇抑菌、酯化增香</td></tr>' +
    '<tr><td>酵种/老卤</td><td>传统泡菜坛终年不换水，老卤含丰富乳酸菌，新菜入坛即可快速发酵。建议取上一坛老卤5\u201310%（约100\u2013250 mL/2.5 kg蔬菜）加入新坛。</td></tr>' +
    '</table>' +

    '<h4>传统配方（蔬菜约2.5公斤）</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>混合蔬菜（萝卜、豇豆、白菜、芹菜、嫩姜等）</td><td>2.5 kg</td><td>主料基质</td></tr>' +
    '<tr><td>清水（凉白开或纯净水）</td><td>约2 L（没过蔬菜）</td><td>盐水介质</td></tr>' +
    '<tr><td>食盐（不加碘）</td><td>120\u2013150 g（水重5\u20137%）</td><td>渗透压选择乳酸菌</td></tr>' +
    '<tr><td>花椒</td><td>15\u201320 g（约2大匙）</td><td>麻味、抑菌</td></tr>' +
    '<tr><td>干辣椒</td><td>5\u20138 根（整根）</td><td>辣味、抑菌、增色</td></tr>' +
    '<tr><td>老姜</td><td>50 g（切厚片）</td><td>增香、抑菌</td></tr>' +
    '<tr><td>大蒜</td><td>1 整头（剥瓣）</td><td>大蒜素抑菌</td></tr>' +
    '<tr><td>白酒（\u226552\u00b0）</td><td>20\u201330 mL（约2大匙）</td><td>乙醇抑菌、酯化增香</td></tr>' +
    '<tr><td>冰糖（可选）</td><td>10\u201315 g</td><td>提供碳源促发酵、调和口味</td></tr>' +
    '<tr><td>酵种/老卤（可选）</td><td>100\u2013250 mL</td><td>取上坛老泡菜水加速发酵、稳定风味</td></tr>' +
    '</table>' +

    '<h4>标准制作流程（5步）</h4>' +
    '<ol>' +
    '<li><strong>制盐水：</strong>将清水烧开，加入食盐搅拌至完全溶解（5\u20137%浓度），放凉至室温。切勿使用生水，以免引入杂菌。</li>' +
    '<li><strong>投入香料：</strong>在泡菜坛底部放入花椒、干辣椒、姜片、蒜瓣。倒入白酒和冰糖（如使用）。</li>' +
    '<li><strong>处理蔬菜：</strong>蔬菜洗净沥干（表面无生水），切成适当大小。萝卜切条/块，豇豆切段，嫩姜切片。蔬菜表面需完全晾干后入坛。</li>' +
    '<li><strong>入坛浸泡：</strong>将蔬菜放入坛中，倒入冷却的盐水，确保蔬菜完全没入液面以下（可用竹片或陶瓷篦子压住）。液面距坛口留5\u201310cm空间。</li>' +
    '<li><strong>水封发酵：</strong>盖上坛盖，坛沿凹槽注满清水密封。置于阴凉通风处（18\u201325\u00b0C）。跳水泡菜（快泡菜）约1\u20132天即可食用；深度发酵3\u20137天风味更佳；老坛泡菜可持续发酵数月。</li>' +
    '</ol>' +

    '<h4>品质指标</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>指标</th><th>合格标准</th><th>说明</th></tr>' +
    '<tr><td>盐水澄清度</td><td>清亮透明，无浑浊</td><td>浑浊或起白膜表示杂菌污染，需捞除</td></tr>' +
    '<tr><td>香气</td><td>酸香协调，有花椒和辣椒复合香</td><td>异味（腐臭、酒精过重）为异常</td></tr>' +
    '<tr><td>脆度</td><td>咬感清脆爽口</td><td>发软或绵软表示过度发酵或蔬菜入坛前未充分沥干</td></tr>' +
    '<tr><td>色泽</td><td>保持蔬菜原有色泽，略微半透明</td><td>发黄或发暗为异常</td></tr>' +
    '<tr><td>亚硝酸盐安全期</td><td>发酵第3\u20137天后食用</td><td>发酵初期（1\u20133天）亚硝酸盐峰值较高，之后被乳酸菌降解至安全水平</td></tr>' +
    '</table>' +

    '<h4>对比：四川泡菜 vs 韩国泡菜 (Kimchi)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>参数</th><th>四川泡菜</th><th>韩国泡菜</th></tr>' +
    '<tr><td>腌制方式</td><td>盐水浸泡法</td><td>干腌法 + 调味酱涂抹</td></tr>' +
    '<tr><td>盐浓度</td><td>5\u20137%（盐水浓度）</td><td>2\u20134%（成品含盐量）</td></tr>' +
    '<tr><td>发酵温度</td><td>18\u201325\u00b0C（室温发酵）</td><td>2\u20135\u00b0C（低温）或15\u201320\u00b0C（快速）</td></tr>' +
    '<tr><td>发酵时长</td><td>1\u20137天（跳水泡菜）；数月（老坛）</td><td>3\u201314天（低温）；2\u20133天（常温）</td></tr>' +
    '<tr><td>核心调料</td><td>花椒、干辣椒、老姜、白酒</td><td>辣椒粉、鱼露、虾酱、大蒜</td></tr>' +
    '<tr><td>风味特征</td><td>酸爽、麻辣、清香</td><td>酸辣、鲜香、复合发酵香</td></tr>' +
    '<tr><td>发酵容器</td><td>泡菜坛子（水封陶坛）</td><td>瓮器或密封容器</td></tr>' +
    '<tr><td>优势乳酸菌</td><td>植物乳杆菌、短乳杆菌</td><td>肠膜明串珠菌 \u2192 植物乳杆菌</td></tr>' +
    '</table>' +

    '</div>';
  }

  function getGerman() {
    return '<div class="recipe-inner">' +

    '<h4>Deutsches Lebensmittelbuch: Leits\u00e4tze f\u00fcr Gem\u00fcseerzeugnis\u00ade</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Spezifikation</th></tr>' +
    '<tr><td>Definition</td><td>Milchsauer vergorenes Wei\u00dfkraut (Brassica oleracea var. capitata), durch nat\u00fcrliche Milchs\u00e4ureg\u00e4rung haltbar gemacht</td></tr>' +
    '<tr><td>Kochsalz (NaCl)</td><td>1,5 \u2013 2,5% (typisch 2,0%)</td></tr>' +
    '<tr><td>Gesamts\u00e4ure (als Milchs\u00e4ure)</td><td>1,0 \u2013 2,0%</td></tr>' +
    '<tr><td>pH-Wert</td><td>\u2264 4,1 (fertig vergoren)</td></tr>' +
    '<tr><td>Mindestg\u00e4rzeit</td><td>\u2265 7 Tage bei 15\u201320\u00b0C</td></tr>' +
    '</table>' +

    '<h4>EU-Verordnung: Gesch\u00fctzte Ursprungsbezeichnungen</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Region</th><th>Bezeichnung</th></tr>' +
    '<tr><td>Filder (Baden-W\u00fcrttemberg)</td><td>Filderkraut \u2014 spitzkopfiges Wei\u00dfkraut, besonders mild</td></tr>' +
    '<tr><td>Hessen / Th\u00fcringen</td><td>Fa\u00dfsauerkraut \u2014 traditionelle Holzfassg\u00e4rung</td></tr>' +
    '</table>' +

    '<h4>Traditionelles Rezept (pro 2,5 kg Kohl)</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Zutat</th><th>Menge</th><th>Funktion</th></tr>' +
    '<tr><td>Wei\u00dfkohl</td><td>2,5 kg (fein gehobelt)</td><td>Hauptsubstrat</td></tr>' +
    '<tr><td>Salz (nicht jodiert)</td><td>50 g (2% des Kohlgewichts)</td><td>Osmotische Entwässerung, LAB-Selektion</td></tr>' +
    '<tr><td>Wacholderbeeren</td><td>5 g (~10 St\u00fcck)</td><td>Aroma, antimikrobiell</td></tr>' +
    '<tr><td>K\u00fcmmel</td><td>3 g (~1 TL)</td><td>Aroma, verdauungsf\u00f6rdernd</td></tr>' +
    '<tr><td>Lorbeerbl\u00e4tter</td><td>2\u20133 St\u00fcck</td><td>Aroma</td></tr>' +
    '<tr><td>Pfefferk\u00f6rner</td><td>5 St\u00fcck</td><td>Aroma</td></tr>' +
    '<tr><td>Altlake (optional)</td><td>100\u2013250 mL</td><td>Lake aus einer fr\u00fcheren Charge \u2014 enth\u00e4lt aktive Milchs\u00e4urebakterien, beschleunigt die G\u00e4rung</td></tr>' +
    '</table>' +
    '<p><strong>Wichtig:</strong> Nur nicht jodiertes Salz verwenden \u2014 Jod hemmt die Milchs\u00e4urebakterien.</p>' +

    '<h4>Standardverfahren (5 Schritte)</h4>' +
    '<ol>' +
    '<li><strong>Hobeln & Salzen:</strong> Kohl fein hobeln (3\u20135 mm). Mit 2% Salz vermengen und 30 Min. ruhen lassen, bis Saft austritt.</li>' +
    '<li><strong>Kneten & Stampfen:</strong> Kr\u00e4ftig kneten, bis reichlich Lake entsteht. In G\u00e4rtopf oder Glas schichten und fest stampfen.</li>' +
    '<li><strong>Abdecken:</strong> Kraut muss vollst\u00e4ndig von Lake bedeckt sein. Beschwerstein auflegen. Anaerobe Bedingungen sicherstellen.</li>' +
    '<li><strong>G\u00e4rung (warm):</strong> 3\u20135 Tage bei 18\u201322\u00b0C. T\u00e4glich entl\u00fcften (Gasbildung durch Leuc. mesenteroides). Schaum absch\u00f6pfen.</li>' +
    '<li><strong>Nachg\u00e4rung (kalt):</strong> 2\u20136 Wochen bei 10\u201315\u00b0C oder 4\u20138 Wochen im K\u00fchlschrank (4\u00b0C). L. plantarum \u00fcbernimmt und vertieft die S\u00e4ure.</li>' +
    '</ol>' +

    '<h4>Qualit\u00e4tsmerkmale</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Phase</th><th>pH</th><th>S\u00e4ure</th><th>Merkmale</th></tr>' +
    '<tr><td>Frisch eingelegt</td><td>&gt; 5,0</td><td>&lt; 0,3%</td><td>Salzig, Kohlgeschmack</td></tr>' +
    '<tr><td>Anf\u00e4ngliche G\u00e4rung</td><td>4,5 \u2013 5,0</td><td>0,3 \u2013 0,6%</td><td>Leichte S\u00e4ure, CO\u2082-Bläschen</td></tr>' +
    '<tr><td>Optimal (essreif)</td><td>3,8 \u2013 4,2</td><td>0,8 \u2013 1,5%</td><td>Mild-s\u00e4uerlich, knackig, aromatisch</td></tr>' +
    '<tr><td>\u00dcberreif</td><td>&lt; 3,5</td><td>&gt; 1,8%</td><td>Sehr sauer, weich (gut f\u00fcr Eintopf)</td></tr>' +
    '</table>' +

    '<h4>Vergleich mit Kimchi-Fermentation</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Sauerkraut</th><th>Kimchi</th></tr>' +
    '<tr><td>Salzgehalt</td><td>1,5\u20132,5%</td><td>2,0\u20134,0%</td></tr>' +
    '<tr><td>G\u00e4rtemperatur</td><td>15\u201322\u00b0C \u2192 4\u201315\u00b0C</td><td>20\u201325\u00b0C \u2192 4\u00b0C</td></tr>' +
    '<tr><td>G\u00e4rdauer bis essreif</td><td>2\u20136 Wochen</td><td>3\u201314 Tage</td></tr>' +
    '<tr><td>Gew\u00fcrze</td><td>K\u00fcmmel, Wacholder, Lorbeer</td><td>Chili, Knoblauch, Fischsauce</td></tr>' +
    '<tr><td>pH optimal</td><td>3,8\u20134,2</td><td>4,0\u20134,5</td></tr>' +
    '<tr><td>Dominante LAB</td><td>L. plantarum (sp\u00e4t)</td><td>Leuc. mesenteroides (Mitte)</td></tr>' +
    '</table>' +

    '</div>';
  }

  return { init: init, updateLang: updateLang };
})();

