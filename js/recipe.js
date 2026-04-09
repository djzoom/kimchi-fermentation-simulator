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

    '<h4>Home Recipe (per 2 kg napa cabbage)</h4>' +

    '<p><strong>Base ingredients (required)</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>Ingredient</th><th>Amount</th><th>Function</th></tr>' +
    '<tr><td>Napa cabbage (배추)</td><td>2 kg</td><td>Primary substrate</td></tr>' +
    '<tr><td>Salt (curing)</td><td>240–300 g</td><td>12–15% brine, osmotic dehydration</td></tr>' +
    '<tr><td>Water (curing brine)</td><td>~2 L (to cover cabbage)</td><td>Brine medium</td></tr>' +
    '<tr><td>Coarse chili flakes (굵은 고춧가루)</td><td>60 g</td><td>Color, texture</td></tr>' +
    '<tr><td>Fine chili powder (고운 고춧가루)</td><td>60 g</td><td>Heat penetration</td></tr>' +
    '<tr><td>Sweet rice flour (찹쌀가루)</td><td>50 g</td><td>Binder, sugar source for LAB</td></tr>' +
    '<tr><td>Water (for paste)</td><td>300 g</td><td>Paste medium</td></tr>' +
    '<tr><td>Garlic (마늘)</td><td>100 g</td><td>Flavor, mild antimicrobial</td></tr>' +
    '<tr><td>Ginger (생강)</td><td>60 g</td><td>Flavor, antimicrobial</td></tr>' +
    '</table>' +

    '<p><strong>Optional / flavor enhancers (add to taste)</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>Ingredient</th><th>Amount</th><th>Function</th></tr>' +
    '<tr><td>Apple (사과)</td><td>1/2</td><td>Natural sweetness, fructose for LAB</td></tr>' +
    '<tr><td>Pear (배)</td><td>1/2</td><td>Natural sweetness, enzymatic tenderizing</td></tr>' +
    '<tr><td>Sugar</td><td>90 g</td><td>Seasoning, additional carbon source</td></tr>' +
    '<tr><td>MSG</td><td>8 g</td><td>Umami booster</td></tr>' +
    '<tr><td>Fish sauce (멸치액젓)</td><td>30–45 mL</td><td>Umami, nitrogen source for LAB</td></tr>' +
    '<tr><td>Salted shrimp (새우젓)</td><td>30 g</td><td>Umami, proteolytic enzymes</td></tr>' +
    '<tr><td>Green onion (쪽파)</td><td>5–6 stalks</td><td>Flavor, texture</td></tr>' +
    '</table>' +

    '<h4>Process</h4>' +
    '<ol>' +
    '<li><strong>Cure:</strong> Quarter the cabbage. Dissolve 240–300 g salt in ~2 L water (12–15% brine), pour over the cabbage to submerge it. Press and leave overnight (8–12 h).</li>' +
    '<li><strong>Rinse:</strong> Wash in cold water 3 times and squeeze out excess water.</li>' +
    '<li><strong>Chili base:</strong> Mix 60 g coarse + 60 g fine chili flakes with a little hot water; let bloom.</li>' +
    '<li><strong>Sweet rice paste:</strong> Cook 50 g sweet rice flour in 300 g water over low heat, stirring until translucent. Cool, then stir into the chili base.</li>' +
    '<li><strong>Aromatics:</strong> Blend 100 g garlic + 60 g ginger (with apple/pear if used) into a paste. Mix in sugar, MSG, fish sauce, salted shrimp as desired.</li>' +
    '<li><strong>Apply:</strong> Spread paste between each leaf, packing tightly into a fermentation jar.</li>' +
    '<li><strong>Ferment:</strong> Rest at room temperature for several hours, then refrigerate (~4°C) for about 1 week.</li>' +
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
    '<tr><td>Optimal</td><td>4.0 – 4.5</td><td>0.4 – 0.8%</td><td>Balanced sour-umami, crisp texture, complex aroma</td></tr>' +
    '<tr><td>Over-fermented</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>Strongly sour, soft texture (good for cooking)</td></tr>' +
    '</table>' +

    '</div>' +

    // Sichuan Paocai
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>Sichuan Paocai (\u56DB\u5DDD\u6CE1\u83DC)</h3>' +
    '<h4>Overview</h4>' +
    '<p>Brine-submerged vegetable fermentation using a water-sealed clay jar. Mixed vegetables (radish, long beans, cabbage, ginger) ferment in 5\u20137% salt brine at room temperature. Key spices: Sichuan pepper, dried chili, baijiu (Chinese liquor).</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Sichuan Paocai</th><th>Korean Kimchi</th></tr>' +
    '<tr><td>Method</td><td>Brine submersion</td><td>Dry salting + paste</td></tr>' +
    '<tr><td>Salt</td><td>5\u20137% (brine)</td><td>2\u20134% (finished)</td></tr>' +
    '<tr><td>Temperature</td><td>18\u201325\u00b0C (room temp)</td><td>2\u20135\u00b0C (cold) or 15\u201320\u00b0C (fast)</td></tr>' +
    '<tr><td>Key spices</td><td>Sichuan pepper, dried chili, ginger, baijiu</td><td>Chili powder, fish sauce, shrimp paste, garlic</td></tr>' +
    '<tr><td>Dominant LAB</td><td>W. confusa \u2192 L. plantarum \u2192 P. pentosaceus</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td></tr>' +
    '</table>' +
    '</div>' +

    // German Sauerkraut
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>German Sauerkraut</h3>' +
    '<h4>Overview</h4>' +
    '<p>Finely shredded white cabbage fermented with 2% salt. The classic three-phase succession: Leu. mesenteroides (CO\u2082 + ethanol) \u2192 L. brevis (acetic acid complexity) \u2192 L. plantarum (final acid). Fermentation takes 2\u20136 weeks at 15\u201322\u00b0C.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Sauerkraut</th><th>Korean Kimchi</th></tr>' +
    '<tr><td>Salt</td><td>1.5\u20132.5%</td><td>2.0\u20134.0%</td></tr>' +
    '<tr><td>Temperature</td><td>15\u201322\u00b0C \u2192 4\u201315\u00b0C</td><td>20\u201325\u00b0C \u2192 4\u00b0C</td></tr>' +
    '<tr><td>Time to ready</td><td>2\u20136 weeks</td><td>3\u201314 days</td></tr>' +
    '<tr><td>Spices</td><td>Caraway, juniper, bay leaf</td><td>Chili, garlic, fish sauce</td></tr>' +
    '<tr><td>Dominant LAB</td><td>Leuc. mesenteroides \u2192 L. brevis \u2192 L. plantarum</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td></tr>' +
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

    '<h4>가정 레시피 (배추 2 kg 기준)</h4>' +

    '<p><strong>기본 재료 (필수)</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>재료</th><th>분량</th><th>기능</th></tr>' +
    '<tr><td>배추</td><td>2 kg</td><td>주재료</td></tr>' +
    '<tr><td>소금 (절임용)</td><td>240–300 g</td><td>12–15% 소금물, 삼투압 탈수</td></tr>' +
    '<tr><td>물 (절임용)</td><td>약 2 L (배추가 잠길 정도)</td><td>소금물 매개</td></tr>' +
    '<tr><td>굵은 고춧가루</td><td>60 g</td><td>색감, 식감</td></tr>' +
    '<tr><td>고운 고춧가루</td><td>60 g</td><td>매운맛 침투</td></tr>' +
    '<tr><td>찹쌀가루</td><td>50 g</td><td>결착, 유산균 당원</td></tr>' +
    '<tr><td>물 (찹쌀풀용)</td><td>300 g</td><td>풀 매개</td></tr>' +
    '<tr><td>마늘</td><td>100 g</td><td>풍미, 약한 항균</td></tr>' +
    '<tr><td>생강</td><td>60 g</td><td>풍미, 항균</td></tr>' +
    '</table>' +

    '<p><strong>선택 / 풍미 강화 (취향껏 추가)</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>재료</th><th>분량</th><th>기능</th></tr>' +
    '<tr><td>사과</td><td>1/2개</td><td>천연 단맛, 과당 (유산균 당원)</td></tr>' +
    '<tr><td>배</td><td>1/2개</td><td>천연 단맛, 효소로 조직 연화</td></tr>' +
    '<tr><td>설탕</td><td>90 g</td><td>조미, 탄소원 보충</td></tr>' +
    '<tr><td>MSG (조미료)</td><td>8 g</td><td>감칠맛 강화</td></tr>' +
    '<tr><td>멸치액젓</td><td>30–45 mL</td><td>감칠맛, 유산균 질소원</td></tr>' +
    '<tr><td>새우젓</td><td>30 g</td><td>감칠맛, 단백질 분해 효소</td></tr>' +
    '<tr><td>쪽파</td><td>5–6 줄기</td><td>풍미, 식감</td></tr>' +
    '</table>' +

    '<h4>제조 공정</h4>' +
    '<ol>' +
    '<li><strong>절임:</strong> 배추를 4등분. 소금 240–300 g을 약 2 L 물에 녹여 (12–15% 소금물) 배추가 잠기도록 부은 뒤, 누름돌로 눌러 하룻밤 (8–12시간) 절인다.</li>' +
    '<li><strong>세척:</strong> 찬물에 3회 헹구고 물기를 짠다.</li>' +
    '<li><strong>고추 베이스:</strong> 굵은 + 고운 고춧가루 (각 60 g)를 따뜻한 물 약간으로 불려 색을 낸다.</li>' +
    '<li><strong>찹쌀풀:</strong> 찹쌀가루 50 g + 물 300 g을 약불에 저으며 투명한 풀이 될 때까지 끓인다. 식힌 후 고추 베이스에 섞는다.</li>' +
    '<li><strong>양념 베이스:</strong> 마늘 100 g + 생강 60 g (사과/배 사용 시 함께)을 갈아 페이스트로 만든다. 설탕, MSG, 액젓, 새우젓을 취향껏 추가한다.</li>' +
    '<li><strong>버무리기:</strong> 양념을 잎 사이에 고루 발라 발효 용기에 꼭꼭 눌러 담는다.</li>' +
    '<li><strong>발효:</strong> 상온에서 몇 시간 두어 발효를 시작한 뒤 냉장 (~4°C) 약 1주일 숙성.</li>' +
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

    '</div>' +

    // 사천 파오차이
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>사천 파오차이 (四川泡菜)</h3>' +
    '<h4>개요</h4>' +
    '<p>물봉인 도자기 항아리에서 소금물에 채소를 담가 발효시키는 방식. 무, 강낭콩, 배추, 생강 등을 5-7% 소금물에 실온 발효. 핵심 향신료: 화자오(사천 후추), 건고추, 바이주(중국 백주).</p>' +
    '<table class="recipe-table">' +
    '<tr><th>항목</th><th>사천 파오차이</th><th>한국 김치</th></tr>' +
    '<tr><td>방법</td><td>소금물 침지</td><td>건절임 + 양념 도포</td></tr>' +
    '<tr><td>염도</td><td>5-7% (소금물)</td><td>2-4% (완성품)</td></tr>' +
    '<tr><td>온도</td><td>18-25°C (실온)</td><td>2-5°C (저온) 또는 15-20°C (고속)</td></tr>' +
    '<tr><td>핵심 양념</td><td>화자오, 건고추, 생강, 바이주</td><td>고춧가루, 멸치액젓, 새우젓, 마늘</td></tr>' +
    '<tr><td>우세 유산균</td><td>W. confusa \u2192 L. plantarum \u2192 P. pentosaceus</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td></tr>' +
    '</table>' +
    '</div>' +

    // 독일 사우어크라우트
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>독일 사우어크라우트 (Sauerkraut)</h3>' +
    '<h4>개요</h4>' +
    '<p>양배추를 곱게 채 썰어 2% 소금으로 절여 발효. 3단계 미생물 천이: Leu. mesenteroides (CO₂ + 에탄올) \u2192 L. brevis (초산 복합풍미) \u2192 L. plantarum (최종 산화). 15-22°C에서 2-6주 발효.</p>' +
    '<table class="recipe-table">' +
    '<tr><th>항목</th><th>사우어크라우트</th><th>한국 김치</th></tr>' +
    '<tr><td>염도</td><td>1.5-2.5%</td><td>2.0-4.0%</td></tr>' +
    '<tr><td>온도</td><td>15-22°C \u2192 4-15°C</td><td>20-25°C \u2192 4°C</td></tr>' +
    '<tr><td>발효 기간</td><td>2-6주</td><td>3-14일</td></tr>' +
    '<tr><td>향신료</td><td>캐러웨이, 주니퍼, 월계수</td><td>고추, 마늘, 액젓</td></tr>' +
    '<tr><td>우세 유산균</td><td>Leuc. mesenteroides \u2192 L. brevis \u2192 L. plantarum</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td></tr>' +
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
    '<tr><td>微辣</td><td>&lt; 2.9 ppm</td></tr>' +
    '<tr><td>中辣</td><td>2.9 – 14.9 ppm</td></tr>' +
    '<tr><td>辣</td><td>&ge; 14.9 ppm</td></tr>' +
    '</table>' +

    '<h4>家庭配方（白菜 2 kg）</h4>' +

    '<p><strong>主料（必需）</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>大白菜</td><td>2 kg</td><td>主料基质</td></tr>' +
    '<tr><td>盐（腌制）</td><td>240–300 g</td><td>12–15% 盐水浓度，渗透脱水</td></tr>' +
    '<tr><td>水（腌制）</td><td>约 2 L（没过白菜）</td><td>溶盐介质</td></tr>' +
    '<tr><td>粗辣椒面</td><td>60 g</td><td>色泽与口感</td></tr>' +
    '<tr><td>细辣椒面</td><td>60 g</td><td>辣味渗透</td></tr>' +
    '<tr><td>糯米粉</td><td>50 g</td><td>结合调料、乳酸菌糖源</td></tr>' +
    '<tr><td>水（糯米糊）</td><td>300 g</td><td>调糊</td></tr>' +
    '<tr><td>大蒜</td><td>100 g</td><td>风味、轻度抑菌</td></tr>' +
    '<tr><td>生姜</td><td>60 g</td><td>风味、抑菌</td></tr>' +
    '</table>' +

    '<p><strong>备选 / 提升风味（可酌情添加）</strong></p>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>苹果</td><td>1/2 个</td><td>天然甜味、果糖促发酵</td></tr>' +
    '<tr><td>梨</td><td>1/2 个</td><td>天然甜味、酶解嫩化</td></tr>' +
    '<tr><td>白糖</td><td>90 g</td><td>调味、补充碳源</td></tr>' +
    '<tr><td>味精</td><td>8 g</td><td>补充鲜味</td></tr>' +
    '<tr><td>鱼露</td><td>30–45 mL</td><td>咸鲜、乳酸菌氮源</td></tr>' +
    '<tr><td>虾酱</td><td>30 g</td><td>咸鲜、蛋白质分解酶</td></tr>' +
    '<tr><td>小葱</td><td>5–6 根</td><td>风味、口感</td></tr>' +
    '</table>' +

    '<h4>制作流程</h4>' +
    '<ol>' +
    '<li><strong>腌制：</strong>白菜切 4 块。将盐 240–300 g 溶于约 2 L 水（12–15% 盐水），倒入容器没过白菜，压一夜（约 8–12 小时）。</li>' +
    '<li><strong>清洗：</strong>清水冲洗 3 次，挤干水分。</li>' +
    '<li><strong>辣基：</strong>粗辣椒面 60 g + 细辣椒面 60 g，加少量开水拌匀，静置使其吸水出色。</li>' +
    '<li><strong>糯米糊：</strong>糯米粉 50 g + 水 300 g，小火搅拌煮至透明糊状，放凉后倒入辣基。</li>' +
    '<li><strong>增味：</strong>大蒜 100 g + 生姜 60 g（如用，加苹果/梨）打成泥；按需加入糖、味精、鱼露、虾酱。</li>' +
    '<li><strong>抹酱：</strong>酱料逐层均匀涂抹白菜，压紧装入发酵罐。</li>' +
    '<li><strong>发酵：</strong>室温静置数小时启动发酵 → 转入冷藏（约 4°C）约 1 周成熟。</li>' +
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
    '<tr><td>过熟</td><td>&lt; 4.0</td><td>&gt; 0.9%</td><td>强酸味，质地变软（适合做泡菜锅）</td></tr>' +
    '</table>' +

    '</div>' +

    getSichuan() +
    getSauerkrautZh();
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
    '<tr><td>优势乳酸菌</td><td>魏斯氏菌 \u2192 植物乳杆菌 \u2192 戊糖片球菌</td><td>明串珠菌 \u2192 清酒乳杆菌 \u2192 植物乳杆菌</td></tr>' +
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

  function getSauerkrautZh() {
    return '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +

    '<h3>德国酸菜 Sauerkraut</h3>' +

    '<h4>德国食品法典标准</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>项目</th><th>规格</th></tr>' +
    '<tr><td>定义</td><td>以圆白菜（卷心菜）为原料，经食盐腌渍自然乳酸发酵制成的蔬菜制品</td></tr>' +
    '<tr><td>食盐</td><td>1.5 \u2013 2.5%（成品含盐量，典型值 2.0%）</td></tr>' +
    '<tr><td>总酸度（以乳酸计）</td><td>1.0 \u2013 2.0%</td></tr>' +
    '<tr><td>pH</td><td>\u2264 4.1（充分发酵后）</td></tr>' +
    '<tr><td>最短发酵时间</td><td>\u2265 7 天（15\u201320\u00b0C）</td></tr>' +
    '</table>' +

    '<h4>传统配方（每2.5公斤圆白菜）</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>原料</th><th>用量</th><th>作用</th></tr>' +
    '<tr><td>圆白菜</td><td>2.5 kg（细丝刨切）</td><td>主料基质</td></tr>' +
    '<tr><td>非碘盐</td><td>50 g（菜重的2%）</td><td>渗透脱水，筛选乳酸菌</td></tr>' +
    '<tr><td>杜松子</td><td>约10粒</td><td>增香，轻度抑菌</td></tr>' +
    '<tr><td>葛缕子</td><td>3 g（约1小匙）</td><td>增香，助消化</td></tr>' +
    '<tr><td>月桂叶</td><td>2\u20133片</td><td>增香</td></tr>' +
    '</table>' +
    '<p><strong>注意：</strong>必须使用非碘盐——碘会抑制乳酸菌。</p>' +

    '<h4>制作流程（5步）</h4>' +
    '<ol>' +
    '<li><strong>刨丝与拌盐：</strong>将圆白菜刨成3\u20135毫米细丝，拌入2%盐，静置30分钟至出水。</li>' +
    '<li><strong>揉搓与装坛：</strong>用力揉搓直至充分出汁。分层装入发酵坛或玻璃罐，每层压实。</li>' +
    '<li><strong>加压密封：</strong>菜丝必须完全浸没在自身析出的菜汁中。放上压石，确保厌氧环境。</li>' +
    '<li><strong>初期发酵（温发酵）：</strong>18\u201322\u00b0C 放置 3\u20135 天。每天释放气体（明串珠菌产 CO\u2082）。</li>' +
    '<li><strong>后期发酵（冷发酵）：</strong>10\u201315\u00b0C 发酵 2\u20136 周，或冰箱 4\u00b0C 发酵 4\u20138 周。植物乳杆菌逐渐主导，酸度加深。</li>' +
    '</ol>' +

    '<h4>微生物演替特征</h4>' +
    '<table class="recipe-table">' +
    '<tr><th>阶段</th><th>优势菌</th><th>特征</th></tr>' +
    '<tr><td>第1阶段（0\u20133天）</td><td>Leu. mesenteroides（明串珠菌）</td><td>异型发酵，产 CO\u2082、乙醇、甘露醇，降 pH 至约 5.0</td></tr>' +
    '<tr><td>第2阶段（3\u201310天）</td><td>L. brevis（短乳杆菌）</td><td>异型发酵，产醋酸增加风味层次</td></tr>' +
    '<tr><td>第3阶段（10天+）</td><td>L. plantarum（植物乳杆菌）</td><td>同型发酵，终端酸化，pH 降至 3.5 以下</td></tr>' +
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
    '<tr><td>Dominante LAB</td><td>Leuc. mesenteroides \u2192 L. brevis \u2192 L. plantarum</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td></tr>' +
    '</table>' +

    '</div>' +

    // Koreanisches Kimchi
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>Koreanisches Kimchi (\uD55C\uAD6D \uAE40\uCE58)</h3>' +
    '<h4>\u00dcberblick</h4>' +
    '<p>Chinakohl wird trocken gesalzen, mit Chilipaste, Fischsauce, Garnelenpaste und Knoblauch gew\u00fcrzt, dann bei niedriger Temperatur fermentiert. Typische Mikrobenfolge: Leuc. mesenteroides (CO\u2082, Aroma) \u2192 L. sakei (k\u00e4ltetolerant, Kimchi-Signaturart) \u2192 L. plantarum (tiefe S\u00e4ure).</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Kimchi</th><th>Sauerkraut</th></tr>' +
    '<tr><td>Salzgehalt</td><td>2,0\u20134,0%</td><td>1,5\u20132,5%</td></tr>' +
    '<tr><td>Temperatur</td><td>2\u20135\u00b0C (langsam) oder 15\u201320\u00b0C (schnell)</td><td>15\u201322\u00b0C \u2192 4\u201315\u00b0C</td></tr>' +
    '<tr><td>Fertigzeit</td><td>3\u201314 Tage</td><td>2\u20136 Wochen</td></tr>' +
    '<tr><td>Gew\u00fcrze</td><td>Chili, Knoblauch, Fischsauce, Garnelenpaste</td><td>K\u00fcmmel, Wacholder, Lorbeer</td></tr>' +
    '<tr><td>Dominante LAB</td><td>Leuc. mesenteroides \u2192 L. sakei \u2192 L. plantarum</td><td>Leuc. mesenteroides \u2192 L. brevis \u2192 L. plantarum</td></tr>' +
    '</table>' +
    '</div>' +

    // Sichuan Paocai
    '<div class="recipe-inner" style="margin-top:2em;border-top:1px solid var(--border,#ccc);padding-top:1.5em;">' +
    '<h3>Sichuan Paocai (\u56DB\u5DDD\u6CE1\u83DC)</h3>' +
    '<h4>\u00dcberblick</h4>' +
    '<p>Gem\u00fcse wird in Salzlake in einem wasserversiegelten Tongef\u00e4\u00df fermentiert. Salz 5\u20137%, Raumtemperatur. Gew\u00fcrze: Sichuan-Pfeffer, getrocknete Chili, Ingwer, Baijiu (chinesischer Schnaps). Mikrobielle Sukzession: Weissella (fr\u00fch) \u2192 L. plantarum (Mitte) \u2192 Pediococcus (sp\u00e4t).</p>' +
    '<table class="recipe-table">' +
    '<tr><th>Parameter</th><th>Sichuan Paocai</th><th>Sauerkraut</th></tr>' +
    '<tr><td>Salzgehalt</td><td>5\u20137% (Lake)</td><td>1,5\u20132,5%</td></tr>' +
    '<tr><td>Temperatur</td><td>18\u201325\u00b0C</td><td>15\u201322\u00b0C \u2192 4\u201315\u00b0C</td></tr>' +
    '<tr><td>Gew\u00fcrze</td><td>Sichuan-Pfeffer, Chili, Ingwer, Baijiu</td><td>K\u00fcmmel, Wacholder, Lorbeer</td></tr>' +
    '<tr><td>Dominante LAB</td><td>W. confusa \u2192 L. plantarum \u2192 P. pentosaceus</td><td>Leuc. mesenteroides \u2192 L. brevis \u2192 L. plantarum</td></tr>' +
    '</table>' +
    '</div>';
  }

  return { init: init, updateLang: updateLang };
})();

