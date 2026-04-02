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

  /**
   * Initialize recipe section
   */
  function init() {
    var content = document.getElementById('recipe-content');
    var toggle = document.getElementById('recipe-toggle');
    if (!content || !toggle) return;

    var lang = window.KimchiSim.i18n.getLang();
    content.innerHTML = getContent(lang);

    toggle.addEventListener('click', function () {
      content.classList.toggle('expanded');
      var arrow = toggle.querySelector('.toggle-arrow');
      if (arrow) {
        arrow.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : '';
      }
    });
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

  return { init: init, updateLang: updateLang };
})();
