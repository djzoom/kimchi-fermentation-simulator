/**
 * Smoker Dynamics — Decision-card engine.
 * Transforms simulator state into ranked, user-readable cards
 * following the "next best action" pattern from OPERATIONS.md.
 *
 * Each card has: { priority, tier, verdict, why, impact?, actions? }
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.decisions = (function () {
  'use strict';

  var C   = window.SmokerSim.constants;
  var Con = window.SmokerSim.constraints;

  // Rolling slope buffer — caller maintains { samples: [{t, coreF}] }
  function slopeFperMin(history, windowMin) {
    windowMin = windowMin || 10;
    var s = history.samples;
    if (s.length < 2) return 0;
    var last = s[s.length - 1];
    var cutoff = last.t - windowMin;
    var first = s[s.length - 1];
    for (var i = s.length - 1; i >= 0; i--) {
      if (s[i].t <= cutoff) { first = s[i]; break; }
      first = s[i];
    }
    var dt = last.t - first.t;
    if (dt <= 0.5) return 0;
    return (last.coreF - first.coreF) / dt;
  }

  /**
   * Build cards for current state. Returns up to 3 highest-priority cards.
   */
  function build(state, history) {
    var out = [];
    var n = state.T.length - 1;
    var coreF = C.cToF(state.T[n]);
    var surfF = C.cToF(state.T[0]);
    var pitF  = C.cToF(state.tPitC);
    var slope = slopeFperMin(history, 10);

    // ─── Red-line alerts (highest priority) ──────────────────────────
    var alerts = Con.evaluate({
      phase: state.phase,
      tPitC: state.tPitC,
      dTcoreDtCPerMin: slope / 1.8,
      dangerZoneMin: state.dangerZoneMin || 0,
      justPulled: false, C: state.C,
      S_bad: state.smoke ? state.smoke.bad : 0,
      tSurfC: state.T[0], justWrapped: false,
      wSurface: state.wSurface || 1,
      qFireW: 100, maxCoalProgress: 0.3, qFirePeakNominal: 400,
      tCoreF: coreF, spritzPerHour: 0, lidOpenSec: state.lidOpenSec || 0
    });
    alerts.forEach(function (a) {
      if (a.tier === 'red') {
        out.push({
          priority: 100, tier: 'red',
          verdict: a.label,
          verdict_zh: '⚠ 红线: ' + a.label,
          why: a.fix || '',
          why_zh: '不可逆的质量损失——必须立即纠正。',
          actions: []
        });
      } else if (a.tier === 'yellow') {
        out.push({
          priority: 60, tier: 'yellow',
          verdict: a.label,
          verdict_zh: '黄线: ' + a.label,
          why: 'Recoverable — adjust now to avoid cost.',
          why_zh: '可挽回——现在调整能避免打折扣。',
          actions: []
        });
      }
    });

    // ─── Pregame: no coals lit ───────────────────────────────────────
    if (state.coals.length === 0 && state.phase !== 'rest' && state.phase !== 'slice') {
      out.push({
        priority: 95, tier: 'action',
        verdict: 'Light your fire',
        verdict_zh: '点火',
        why: 'Get the pit to 225–250°F before the meat goes on. Wait for thin-blue smoke before adding anything.',
        why_zh: '先把炉温烧到 225–250°F 再放肉。一定要等到"薄蓝烟"——白烟是不完全燃烧，会让肉发苦。',
        actions: [
          { label: 'Ignite 12 coals', label_zh: '点 12 块炭', event: 'ignite-12', hint: 'Full chimney for offset', hint_zh: '适合偏置烟熏炉' },
          { label: 'Ignite 8 coals',  label_zh: '点 8 块炭',  event: 'ignite-8',  hint: 'Lighter start for kamado/WSM', hint_zh: 'Kamado/WSM 用' }
        ]
      });
    }

    // ─── Warmup: coals lit, pit not at target ────────────────────────
    if (state.coals.length > 0 && pitF < 210 && coreF < 50 && state.phase !== 'rest') {
      out.push({
        priority: 70, tier: 'info',
        verdict: 'Warming up',
        verdict_zh: '预热中',
        why: 'Pit climbing toward 225–250°F. This takes 20–40 minutes with fresh coals.',
        why_zh: '炉腔正在爬升到 225–250°F，新炭通常需要 20–40 分钟。',
        actions: []
      });
    }

    // ─── Early smoke window (surface still cold, smoke ring forming) ─
    if (coreF > 50 && surfF < 140 && !state.smoke.ringFrozen && state.phase === 'bark_build') {
      if (state.woodAdds.length === 0) {
        out.push({
          priority: 80, tier: 'action',
          verdict: 'Add wood for smoke',
          verdict_zh: '加果木块',
          why: 'Surface is still cold — this is the 90-minute window for smoke ring and flavor deposition.',
          why_zh: '肉表面还冷，前 90 分钟是形成烟环和沉积风味酚的唯一窗口，错过就锁死了。',
          actions: [{ label: 'Add hickory chunk', label_zh: '加山核桃木', event: 'wood', hint: '1 chunk, thin-blue smoke', hint_zh: '薄蓝烟，别冒白烟' }]
        });
      }
    }

    // ─── Stall approaching ───────────────────────────────────────────
    if (coreF >= 135 && coreF < 155 && slope > 0 && slope < 0.8 && state.wrapState === 'none') {
      out.push({
        priority: 72, tier: 'headsup',
        verdict: 'Stall approaching',
        verdict_zh: '停滞期逼近',
        why: 'Temperature rise is slowing — evaporative cooling will soon balance the heat. Plateau can last 1–3h.',
        why_zh: '升温在放缓——蒸发冷却很快会抵消炉温输入。停滞期可以持续 1–3 小时，属于正常现象。',
        actions: []
      });
    }

    // ─── In stall: recommend wrap ────────────────────────────────────
    var inStall = coreF >= 145 && coreF <= 175 && slope < 0.4;
    if (inStall && state.wrapState === 'none') {
      var stalledFor = stallDurationMin(history);
      if (stalledFor > 20) {
        out.push({
          priority: 88, tier: 'recommend',
          verdict: 'Wrap now to beat the stall',
          verdict_zh: '现在包裹，打破停滞',
          why: 'Stopping evaporation lets the meat resume climbing. Butcher paper keeps bark; foil is faster but softer.',
          why_zh: '包起来阻断蒸发，内温就能重新爬升。屠夫纸保 bark；铝箔更快但 bark 会变软。',
          impact: { time: '−1h 20min', bark: '−5%', juicy: '+8%' },
          actions: [
            { label: 'Butcher paper', label_zh: '屠夫纸', event: 'wrap-butcher_paper', hint: 'Balanced', hint_zh: '平衡' },
            { label: 'Aluminum foil', label_zh: '铝箔',   event: 'wrap-aluminum_foil', hint: 'Faster',   hint_zh: '最快' },
            { label: 'Wait',          label_zh: '再等等', event: 'dismiss',            hint: 'Keep chasing bark', hint_zh: '继续追 bark' }
          ]
        });
      } else {
        out.push({
          priority: 60, tier: 'info',
          verdict: 'In the stall',
          verdict_zh: '停滞期中',
          why: 'Internal temp has flattened — this is normal and expected. Keep pit at 225–250°F; do not crank heat.',
          why_zh: '内温已经"躺平"——这完全正常。保持炉温 225–250°F，千万别加大火。',
          actions: []
        });
      }
    }

    // ─── Post-wrap push ──────────────────────────────────────────────
    if (state.wrapState !== 'none' && coreF > 165 && state.C < 0.70) {
      out.push({
        priority: 55, tier: 'info',
        verdict: 'Back on track',
        verdict_zh: '重新爬升',
        why: 'Wrapped and climbing again. Start probe-checking when core hits 195°F.',
        why_zh: '包裹后恢复升温。到 195°F 可以开始用探针测"软硬"。',
        actions: []
      });
    }

    // ─── Nearly done ─────────────────────────────────────────────────
    if (state.C >= 0.70 && state.C < C.COLLAGEN_DONE && state.phase !== 'rest') {
      out.push({
        priority: 80, tier: 'headsup',
        verdict: 'Nearly done — start probing',
        verdict_zh: '快好了——开始探针测试',
        why: 'Collagen is close to fully rendered. Probe should slide in "like butter". Pull on feel, not temperature.',
        why_zh: '胶原快完全转化了。探针应该"像插黄油"一样滑入。看手感出炉，不看温度。',
        actions: [
          { label: 'Pull now', label_zh: '现在出炉', event: 'pull', hint: 'Only if probe-soft', hint_zh: '仅当探针软' }
        ]
      });
    }

    // ─── Done ────────────────────────────────────────────────────────
    if (state.C >= C.COLLAGEN_DONE && state.phase !== 'rest' && state.phase !== 'slice') {
      out.push({
        priority: 97, tier: 'action',
        verdict: 'Pull now',
        verdict_zh: '马上出炉',
        why: 'Collagen is fully rendered. More time on heat will only dry it out.',
        why_zh: '胶原已经完全水解。再烤下去只会变干。',
        impact: { time: '0', juicy: 'protect' },
        actions: [{ label: 'Pull', label_zh: '出炉', event: 'pull' }]
      });
    }

    // ─── Resting ─────────────────────────────────────────────────────
    if (state.phase === 'rest') {
      var tRest = restElapsedMin(state);
      var target = 45;
      if (tRest < target) {
        var left = Math.ceil(target - tRest);
        out.push({
          priority: 70, tier: 'info',
          verdict: 'Resting — ' + left + ' min to go',
          verdict_zh: '静置中——还剩 ' + left + ' 分钟',
          why: 'Juices are redistributing. Slicing now costs ~' + Math.round(100 * (1 - tRest / target)) + '% of potential moisture retention.',
          why_zh: '汁水正在重新分布。现在切会损失大约 ' + Math.round(100 * (1 - tRest / target)) + '% 的潜在保水量。',
          actions: [{ label: 'Slice anyway', label_zh: '硬切', event: 'slice', hint: 'Not recommended', hint_zh: '不建议' }]
        });
      } else {
        out.push({
          priority: 92, tier: 'action',
          verdict: 'Ready to slice',
          verdict_zh: '可以切了',
          why: 'Juice redistribution is complete. Cut against the grain in pencil-thick slices.',
          why_zh: '汁水重分布已经完成。逆纹切，厚度像铅笔。',
          actions: [{ label: 'Slice', label_zh: '切片', event: 'slice' }]
        });
      }
    }

    // ─── Food-safety info (only while surface cooked enough to matter) ──
    if (state.kSafety != null) {
      if (state.kSafety < 1 && coreF > 110 && state.tSimMin > 180) {
        // Surface has been in sub-kill range for 3+ h — danger-zone warning
        out.push({
          priority: 85, tier: 'yellow',
          verdict: 'Danger-zone dwell',
          verdict_zh: '危险温区停留',
          why: 'Surface has spent 3 + h below 140 °F — pathogens can multiply. Push pit to 250 °F+.',
          why_zh: '表面超过 3 小时在 140°F 以下，细菌会大量繁殖。立刻把炉温拉到 250°F+。',
          actions: [{ label: '+6 coals', label_zh: '+6 块炭', event: 'refuel-6' }]
        });
      } else if (state.kSafety >= 7.0 && state.phase !== 'rest') {
        // Safety milestone: silent info the user can check if curious
        // Only appears if core is < 180 F (still cooking for texture, not safety)
        if (coreF < 180) {
          out.push({
            priority: 40, tier: 'info',
            verdict: 'Pathogens already killed',
            verdict_zh: '病原已完全灭活',
            why: 'Surface has accumulated a 7-log reduction — USDA-safe. Any further cooking is for texture, not safety.',
            why_zh: '表面已累积 7 次对数灭菌 — USDA 认证的安全水平。继续烤只是为了口感，不是安全。',
            actions: []
          });
        }
      }
    }

    // ─── Refuel reminder (yellow) ────────────────────────────────────
    var activeCoals = state.coals.filter(function (c) {
      var x = (state.tSimMin - c.tIgniteMin) / c.tauBurnMin;
      return x > 0 && x < 1.0;
    });
    var peaked = state.coals.filter(function (c) {
      var x = (state.tSimMin - c.tIgniteMin) / c.tauBurnMin;
      return x > 0.75;
    });
    if (activeCoals.length > 0 && peaked.length / activeCoals.length > 0.5 && state.phase !== 'rest') {
      out.push({
        priority: 58, tier: 'headsup',
        verdict: 'Refuel soon',
        verdict_zh: '该加炭了',
        why: 'Most of your coals are past peak. Pit temp will sag in the next 15–30 minutes.',
        why_zh: '大部分炭都过了燃烧峰值。如果不补，炉温会在 15–30 分钟内掉下来。',
        actions: [
          { label: '+3 coals', label_zh: '+3 块炭', event: 'refuel-3' },
          { label: '+6 coals', label_zh: '+6 块炭', event: 'refuel-6' }
        ]
      });
    }

    // Sort by priority (desc), dedupe by verdict, cap at 3
    out.sort(function (a, b) { return b.priority - a.priority; });
    var seen = {};
    var top = [];
    for (var i = 0; i < out.length && top.length < 3; i++) {
      if (seen[out[i].verdict]) continue;
      seen[out[i].verdict] = true;
      top.push(out[i]);
    }
    return top;
  }

  // ---------- helpers ----------
  function stallDurationMin(history) {
    var s = history.samples;
    if (s.length < 2) return 0;
    for (var i = s.length - 1; i > 0; i--) {
      var slopeHere = (s[i].coreF - s[i - 1].coreF) / Math.max(0.1, s[i].t - s[i - 1].t);
      if (slopeHere > 0.5 || s[i].coreF < 140 || s[i].coreF > 180) {
        return s[s.length - 1].t - s[i].t;
      }
    }
    return s[s.length - 1].t - s[0].t;
  }

  function restElapsedMin(state) {
    return (state.tSimMin || 0) - (state.tPullMin || 0);
  }

  return {
    build: build,
    slopeFperMin: slopeFperMin,
    stallDurationMin: stallDurationMin,
    restElapsedMin: restElapsedMin
  };
})();
