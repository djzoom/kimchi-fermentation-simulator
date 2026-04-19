/**
 * Smoker Dynamics — Notifications.
 * Web Audio tones + desktop Notification API, with per-verdict throttling.
 * Design:
 *   - audio: short tier-pitched tones, played whether tab is focused or not
 *   - desktop: only when document.hidden; granted permission required
 *   - throttle: same verdict can fire at most once per 60 s
 */
window.SmokerSim = window.SmokerSim || {};

window.SmokerSim.notify = (function () {
  'use strict';

  var state = {
    enabled: loadEnabled(),
    audioCtx: null,
    lastFired: {},
    permission: (typeof Notification !== 'undefined') ? Notification.permission : 'default'
  };

  var TIER_FREQ_HZ = {
    red:       440,    // low urgent A4
    yellow:    660,    // E5
    action:    880,    // A5 bright
    recommend: 988,    // B5 sparkle
    headsup:   740,    // F#5 gentle
    info:      0       // silent
  };

  function loadEnabled() {
    try { return localStorage.getItem('smoker.notify') !== 'off'; }
    catch (e) { return true; }
  }
  function saveEnabled() {
    try { localStorage.setItem('smoker.notify', state.enabled ? 'on' : 'off'); }
    catch (e) {}
  }

  function isEnabled() { return state.enabled; }

  function toggle() {
    state.enabled = !state.enabled;
    saveEnabled();
    if (state.enabled) requestPermission();
    return state.enabled;
  }

  function requestPermission() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(function (p) { state.permission = p; });
    } else {
      state.permission = Notification.permission;
    }
  }

  function audioCtx() {
    if (state.audioCtx) return state.audioCtx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    state.audioCtx = new AC();
    return state.audioCtx;
  }

  function playTone(tier) {
    if (!state.enabled) return;
    var freq = TIER_FREQ_HZ[tier] || 0;
    if (freq === 0) return;
    var ctx = audioCtx();
    if (!ctx) return;
    // Some browsers suspend the context until a gesture; resume silently.
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }
    toneAt(ctx, freq, ctx.currentTime);
    if (tier === 'red') toneAt(ctx, freq, ctx.currentTime + 0.28);  // double-beep urgency
  }

  function toneAt(ctx, freq, at) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.08, at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.38);
    osc.start(at);
    osc.stop(at + 0.42);
  }

  /**
   * Called by app.js whenever a new card appears. Dedupes by verdict.
   */
  function fireCard(card) {
    if (!state.enabled) return;
    if (!card || !card.verdict) return;
    // Only audibly alert on actionable tiers
    if (['red', 'yellow', 'action', 'recommend', 'headsup'].indexOf(card.tier) === -1) return;

    var now = Date.now();
    if (state.lastFired[card.verdict] && now - state.lastFired[card.verdict] < 60000) return;
    state.lastFired[card.verdict] = now;

    playTone(card.tier);

    if (typeof document !== 'undefined' && document.hidden
        && typeof Notification !== 'undefined'
        && state.permission === 'granted') {
      try {
        var n = new Notification(card.verdict, {
          body: card.why,
          tag: 'smoker-' + card.verdict,
          silent: true
        });
        setTimeout(function () { try { n.close(); } catch (e) {} }, 8000);
      } catch (e) { /* notification API quirks — ignore */ }
    }
  }

  function reset() { state.lastFired = {}; }

  return {
    isEnabled: isEnabled,
    toggle: toggle,
    requestPermission: requestPermission,
    fireCard: fireCard,
    reset: reset
  };
})();
