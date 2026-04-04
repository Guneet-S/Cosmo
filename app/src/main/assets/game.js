/* ===== COSMIC PLASMA — GAME ENGINE ===== */

// ─── Number Formatter ───
const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg'];

function fmt(n) {
  if (n < 0) return '-' + fmt(-n);
  if (n < 1000) return Math.floor(n).toString();
  const tier = Math.min(Math.floor(Math.log10(n) / 3), SUFFIXES.length - 1);
  const scaled = n / Math.pow(10, tier * 3);
  return (scaled < 10 ? scaled.toFixed(2) : scaled < 100 ? scaled.toFixed(1) : scaled.toFixed(0)) + SUFFIXES[tier];
}

// ─── Generator Definitions ───
const GENERATOR_DEFS = [
  { id: 'spark',        name: 'Spark',         icon: '✦',  baseCost: 10,     baseOutput: 1,      costMult: 1.12, unlockAt: 0      },
  { id: 'ember',        name: 'Ember',         icon: '🔥', baseCost: 120,    baseOutput: 5,      costMult: 1.14, unlockAt: 100    },
  { id: 'flare',        name: 'Solar Flare',   icon: '☀️', baseCost: 1400,   baseOutput: 22,     costMult: 1.15, unlockAt: 1200   },
  { id: 'arc',          name: 'Plasma Arc',    icon: '⚡', baseCost: 18000,  baseOutput: 100,    costMult: 1.16, unlockAt: 15000  },
  { id: 'fusion',       name: 'Fusion Core',   icon: '🌀', baseCost: 250000, baseOutput: 500,    costMult: 1.17, unlockAt: 200000 },
  { id: 'nova',         name: 'Nova Burst',    icon: '💥', baseCost: 3.6e6,  baseOutput: 2800,   costMult: 1.18, unlockAt: 3e6    },
  { id: 'pulsar',       name: 'Pulsar Engine', icon: '🌟', baseCost: 5.5e7,  baseOutput: 18000,  costMult: 1.19, unlockAt: 4.5e7  },
  { id: 'quasar',       name: 'Quasar',        icon: '🌌', baseCost: 9e8,    baseOutput: 130000, costMult: 1.20, unlockAt: 7e8    },
  { id: 'nebula',       name: 'Nebula Forge',  icon: '🔮', baseCost: 1.5e10, baseOutput: 1e6,    costMult: 1.21, unlockAt: 1e10   },
  { id: 'singularity',  name: 'Singularity',   icon: '🕳️', baseCost: 3e11,   baseOutput: 8.5e6,  costMult: 1.22, unlockAt: 2e11   },
];

// ─── Upgrade Definitions ───
// Tap chain:   ×2 → ×4 → ×8 → ×16 (doubles every tier; costs ~10× each step)
// Gen upgrades: early gens get ×8–×10 (high impact on weak output); late gens get ×12–×20 (cost-gated)
// Global mults: ×4 → ×8 → ×15 (massive but expensive; each step costs ~200× previous)
const UPGRADE_DEFS = [
  // ── Tap power chain (doubles each step) ──
  { id: 'click1', name: 'Focused Tap',      icon: '👆', desc: 'Tap power ×2',                cost: 100,    effect: () => { game.clickMultiplier *= 2;  },          req: () => game.stats.totalClicks >= 10   },
  { id: 'click2', name: 'Charged Fingers',  icon: '⚡', desc: 'Tap power ×4',                cost: 6000,   effect: () => { game.clickMultiplier *= 4;  },          req: () => game.stats.totalClicks >= 100  },
  { id: 'click3', name: 'Plasma Fist',      icon: '👊', desc: 'Tap power ×8',                cost: 750000, effect: () => { game.clickMultiplier *= 8;  },          req: () => game.stats.totalClicks >= 500  },
  { id: 'click5', name: 'Nova Strike',      icon: '💥', desc: 'Tap power ×16',               cost: 4e8,    effect: () => { game.clickMultiplier *= 16; },          req: () => game.stats.totalClicks >= 5000 },

  // ── Per-generator upgrades (early gens: ×8–×10; mid: ×10–×12; late: ×15–×20) ──
  { id: 'gen1',   name: 'Spark Overcharge', icon: '✦',  desc: 'Sparks produce ×8',            cost: 600,    effect: () => { game.genMultipliers.spark  *= 8;  },    req: () => getGenCount('spark')  >= 10    },
  { id: 'gen2',   name: 'Ember Catalyst',   icon: '🔥', desc: 'Embers produce ×9',            cost: 10000,  effect: () => { game.genMultipliers.ember  *= 9;  },    req: () => getGenCount('ember')  >= 10    },
  { id: 'gen3',   name: 'Flare Amplifier',  icon: '☀️', desc: 'Solar Flares produce ×10',     cost: 120000, effect: () => { game.genMultipliers.flare  *= 10; },    req: () => getGenCount('flare')  >= 10    },
  { id: 'gen4',   name: 'Arc Intensifier',  icon: '⚡', desc: 'Plasma Arcs produce ×10',      cost: 1.8e6,  effect: () => { game.genMultipliers.arc    *= 10; },    req: () => getGenCount('arc')    >= 10    },
  { id: 'gen5',   name: 'Fusion Optimizer', icon: '🌀', desc: 'Fusion Cores produce ×12',     cost: 2.8e7,  effect: () => { game.genMultipliers.fusion *= 12; },    req: () => getGenCount('fusion') >= 10    },
  { id: 'gen6',   name: 'Nova Capacitor',   icon: '💥', desc: 'Nova Bursts produce ×12',      cost: 4.5e8,  effect: () => { game.genMultipliers.nova   *= 12; },    req: () => getGenCount('nova')   >= 10    },
  { id: 'gen7',   name: 'Pulsar Regulator', icon: '🌟', desc: 'Pulsar Engines produce ×15',   cost: 7e9,    effect: () => { game.genMultipliers.pulsar *= 15; },    req: () => getGenCount('pulsar') >= 10    },
  { id: 'gen8',   name: 'Quasar Condenser', icon: '🌌', desc: 'Quasars produce ×20',          cost: 1.2e11, effect: () => { game.genMultipliers.quasar *= 20; },    req: () => getGenCount('quasar') >= 10    },

  // ── Global multipliers: ×4 → ×8 → ×15 (heavily gated by total plasma) ──
  { id: 'all1',   name: 'Cosmic Resonance', icon: '🪐', desc: 'All generators ×4',            cost: 1.5e7,  effect: () => { game.globalGenMultiplier   *= 4;  },    req: () => game.stats.totalPlasma >= 6e6  },
  { id: 'all2',   name: 'Dimensional Flux', icon: '🌊', desc: 'All generators ×8',            cost: 3e9,    effect: () => { game.globalGenMultiplier   *= 8;  },    req: () => game.stats.totalPlasma >= 1e9  },
  { id: 'all3',   name: 'Infinite Echo',    icon: '♾️', desc: 'All generators ×15',           cost: 6e12,   effect: () => { game.globalGenMultiplier   *= 15; },    req: () => game.stats.totalPlasma >= 2e12 },

  // ── Quantum Touch: 3% of /sec per tap (end-game scaling) ──
  { id: 'click4', name: 'Quantum Touch',    icon: '🫴', desc: 'Each tap = 3% of your /sec',  cost: 3e8,    effect: () => { game.clickPercentOfRate = 0.03; },      req: () => game.stats.totalClicks >= 2000 },

  // ── Tier 2: per-generator upgrades (requires Tier 1 owned + 25 of that gen) ──
  { id: 'gen1b',  name: 'Spark Overdrive',  icon: '✦',  desc: 'Sparks produce ×20',           cost: 8e4,    effect: () => { game.genMultipliers.spark  *= 20; },    req: () => game.upgrades.includes('gen1')  && getGenCount('spark')  >= 25 },
  { id: 'gen2b',  name: 'Ember Ignition',   icon: '🔥', desc: 'Embers produce ×22',           cost: 1.5e6,  effect: () => { game.genMultipliers.ember  *= 22; },    req: () => game.upgrades.includes('gen2')  && getGenCount('ember')  >= 25 },
  { id: 'gen3b',  name: 'Flare Supercharge',icon: '☀️', desc: 'Solar Flares produce ×25',     cost: 2e7,    effect: () => { game.genMultipliers.flare  *= 25; },    req: () => game.upgrades.includes('gen3')  && getGenCount('flare')  >= 25 },
  { id: 'gen4b',  name: 'Arc Overload',     icon: '⚡', desc: 'Plasma Arcs produce ×25',      cost: 3e8,    effect: () => { game.genMultipliers.arc    *= 25; },    req: () => game.upgrades.includes('gen4')  && getGenCount('arc')    >= 25 },
  { id: 'gen5b',  name: 'Fusion Singularity',icon: '🌀',desc: 'Fusion Cores produce ×30',     cost: 5e9,    effect: () => { game.genMultipliers.fusion *= 30; },    req: () => game.upgrades.includes('gen5')  && getGenCount('fusion') >= 25 },
  { id: 'gen6b',  name: 'Nova Cataclysm',   icon: '💥', desc: 'Nova Bursts produce ×30',      cost: 8e10,   effect: () => { game.genMultipliers.nova   *= 30; },    req: () => game.upgrades.includes('gen6')  && getGenCount('nova')   >= 25 },
  { id: 'gen7b',  name: 'Pulsar Resonance', icon: '🌟', desc: 'Pulsar Engines produce ×40',   cost: 1.5e12, effect: () => { game.genMultipliers.pulsar *= 40; },    req: () => game.upgrades.includes('gen7')  && getGenCount('pulsar') >= 25 },
  { id: 'gen8b',  name: 'Quasar Collapse',  icon: '🌌', desc: 'Quasars produce ×50',          cost: 3e13,   effect: () => { game.genMultipliers.quasar *= 50; },    req: () => game.upgrades.includes('gen8')  && getGenCount('quasar') >= 25 },

  // ── Tier 2: global multipliers ──
  { id: 'all4',   name: 'Quantum Resonance', icon: '🪐', desc: 'All generators ×25',           cost: 5e14,   effect: () => { game.globalGenMultiplier   *= 25; },    req: () => game.upgrades.includes('all3')  && game.stats.totalPlasma >= 1e14 },
  { id: 'all5',   name: 'Cosmic Singularity',icon: '♾️', desc: 'All generators ×50',           cost: 1e17,   effect: () => { game.globalGenMultiplier   *= 50; },    req: () => game.upgrades.includes('all4')  && game.stats.totalPlasma >= 5e16 },

  // ── Tier 2: tap power ──
  { id: 'click6', name: 'Stellar Fist',     icon: '👊', desc: 'Tap power ×32',                cost: 2e11,   effect: () => { game.clickMultiplier *= 32; },          req: () => game.upgrades.includes('click5') && game.stats.totalClicks >= 20000 },
  { id: 'click7', name: 'Void Touch',       icon: '🫴', desc: 'Each tap = 8% of your /sec',   cost: 5e13,   effect: () => { game.clickPercentOfRate = 0.08; },       req: () => game.upgrades.includes('click4') && game.stats.totalClicks >= 50000 },
];

// ─── Shard Upgrade Definitions (permanent, persist through prestige) ───
const SHARD_UPGRADE_DEFS = [
  { id: 'shardClick',    name: 'Stellar Touch', icon: '✋', desc: 'x2 click power per level',    baseCost: 2,  costMult: 2,   maxLvl: 10, effect: (lvl) => Math.pow(2, lvl)   },
  { id: 'shardGen',      name: 'Cosmic Flow',   icon: '🌊', desc: 'x1.5 all production per lvl', baseCost: 3,  costMult: 2.5, maxLvl: 15, effect: (lvl) => Math.pow(1.5, lvl) },
  { id: 'shardStart',    name: 'Head Start',    icon: '🚀', desc: 'Start with 10^lvl plasma',    baseCost: 5,  costMult: 3,   maxLvl: 8,  effect: (lvl) => Math.pow(10, lvl)  },
  { id: 'shardPrestige', name: 'Shard Magnet',  icon: '🧲', desc: '+25% prestige shards/lvl',    baseCost: 10, costMult: 3,   maxLvl: 10, effect: (lvl) => 1 + 0.25 * lvl     },
  { id: 'shardAuto',     name: 'Auto Clicker',  icon: '🤖', desc: '1 auto-click/sec per lvl',    baseCost: 4,  costMult: 2,   maxLvl: 20, effect: (lvl) => lvl                 },
];

// ─── Game State ───
function createFreshState() {
  const gens = {};
  GENERATOR_DEFS.forEach(g => gens[g.id] = 0);
  const genMults = {};
  GENERATOR_DEFS.forEach(g => genMults[g.id] = 1);
  return {
    plasma: 0,
    totalPlasmaThisRun: 0,
    clickMultiplier: 1,
    clickPercentOfRate: 0,
    globalGenMultiplier: 1,
    generators: gens,
    genMultipliers: genMults,
    upgrades: [],
    cosmicShards: 0,
    totalShardsEarned: 0,
    prestigeCount: 0,
    shardUpgrades: {},
    lastLoginDate: null,
    loginStreak: 0,
    achievements: {},
    stats: {
      totalPlasma: 0,
      totalClicks: 0,
      clickPlasma: 0,
      autoPlasma: 0,
      genPlasma: 0,
      startTime: Date.now(),
      playerName: 'Citizen_' + Math.floor(1000 + Math.random() * 9000),
    },
    sessionPlasma: 0,
    sessionClicks: 0,
    leaderboard: [],
    dailyChallenges: { date: null, challenges: [], completed: [], tapsToday: 0, prestigeToday: 0 },
  };
}

let game = createFreshState();
let lastTickTime = Date.now();
let lastUIUpdateTime = 0;

// ─── Combo State (session only, no persistence) ───
let comboCount = 0;
let comboTimestamp = 0;
let comboFadeTimer = null;
const COMBO_RESET_MS = 2000;
const COMBO_TIERS = [
  { min: 20, mult: 2.0, label: '2×' },
  { min: 10, mult: 1.5, label: '1.5×' },
  { min: 5,  mult: 1.25, label: '1.25×' },
];

// ─── Tutorial State ───
let tutorialActive = false;
let tutorialStep = 0;

// ─── Audio & Settings ───
let adx = null;
let soundEnabled = true;

function initAudio() {
  if (!adx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) adx = new AudioContext();
  }
}

function playSound(type) {
  if (!soundEnabled || !adx) return;
  if (adx.state === 'suspended') adx.resume();
  try {
      const osc = adx.createOscillator();
      const gain = adx.createGain();
      osc.connect(gain);
      gain.connect(adx.destination);
      const now = adx.currentTime;
      if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      } else if (type === 'buy') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.setValueAtTime(400, now + 0.05);
          osc.frequency.setValueAtTime(600, now + 0.1);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
      }
  } catch(e) {}
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) btn.textContent = `Sound: ${soundEnabled ? 'ON' : 'OFF'}`;
    if (soundEnabled) {
        initAudio();
        playSound('click');
    }
}

function openSettings() {
    initAudio();
    document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

// ─── Name Registration ───
let pendingPrestige = false;

function initNameInput() {
    const input = document.getElementById('name-input');
    if(!input) return;
    input.addEventListener('input', (e) => {
        const val = e.target.value;
        const sanitized = val.replace(/[^a-zA-Z0-9]/g, '');
        if(val !== sanitized) {
            e.target.value = sanitized;
        }
        if(sanitized.length > 0) {
            e.target.classList.remove('error');
            document.getElementById('name-error').style.display = 'none';
        }
    });
}

function openNameModal(isFirstPrestige = false) {
    initAudio();
    playSound('click');
    pendingPrestige = isFirstPrestige;
    const modal = document.getElementById('name-modal');
    const title = document.getElementById('name-modal-title');
    const cancelBtn = document.getElementById('name-cancel-btn');
    const input = document.getElementById('name-input');

    input.value = game.stats.playerName.startsWith('Citizen_') ? '' : game.stats.playerName;
    input.classList.remove('error');
    document.getElementById('name-error').style.display = 'none';

    if (isFirstPrestige) {
        title.textContent = "ESTABLISH LEADERBOARD IDENTITY";
        cancelBtn.textContent = "SKIP FOR NOW";
    } else {
        title.textContent = "REGISTER CALLSIGN";
        cancelBtn.textContent = "CANCEL";
    }

    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 50);
}

function closeNameModal(isConfirm) {
    playSound('click');
    document.getElementById('name-modal').style.display = 'none';
    if (pendingPrestige) {
        pendingPrestige = false;
        setTimeout(() => doPrestige(true), 100);
    }
}

function confirmName() {
    const input = document.getElementById('name-input');
    const name = input.value.trim();
    if (name.length === 0) {
        input.classList.add('error');
        document.getElementById('name-error').style.display = 'block';
        return;
    }

    playSound('buy');
    game.stats.playerName = name;

    if (window._lastMyRank > 0) window._lastMyRank = -1; // force UI rebuild
    if (document.getElementById('tab-leaderboard').classList.contains('active')) {
        updateLeaderboardLive();
    }

    closeNameModal(true);
}

function exitApp() {
    if (navigator.app && navigator.app.exitApp) {
        navigator.app.exitApp();
    } else if (navigator.device && navigator.device.exitApp) {
        navigator.device.exitApp();
    } else if (window.Android && window.Android.exitApp) {
        window.Android.exitApp();
    } else {
        window.close();
    }
}

window.addEventListener('load', () => {
    history.pushState({ page: 'main' }, null, '');
    initNameInput();

    // Dismiss Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            setTimeout(() => splash.remove(), 800);
        }
    }, 2000);
});

window.addEventListener('popstate', (e) => {
    const modal = document.getElementById('settings-modal');
    if (modal && modal.style.display === 'flex') {
        closeSettings();
    } else {
        openSettings();
    }
    history.pushState({ page: 'main' }, null, '');
});

// ─── Helpers ───
function getGenCount(id) { return game.generators[id] || 0; }
function getGenCost(def) { return Math.ceil(def.baseCost * Math.pow(def.costMult, game.generators[def.id])); }
function getShardBonus(shards) { return 1 + shards * 0.05; }
function getGenOutput(def) {
  const shardGenMult = getShardEffect('shardGen');
  return def.baseOutput * (game.genMultipliers[def.id] || 1) * game.globalGenMultiplier * getShardBonus(game.cosmicShards) * shardGenMult;
}
function getTotalRate() {
  let rate = 0;
  GENERATOR_DEFS.forEach(def => { rate += getGenOutput(def) * game.generators[def.id]; });
  return rate;
}
function getClickPower() {
  const shardClickMult = getShardEffect('shardClick');
  let base = game.clickMultiplier * shardClickMult;
  base *= getShardBonus(game.cosmicShards);
  if (game.clickPercentOfRate > 0) base += getTotalRate() * game.clickPercentOfRate;
  return Math.max(1, base);
}
function getPrestigeShardsEarned() {
  const shardPrestigeMult = getShardEffect('shardPrestige');
  return Math.floor(Math.sqrt(game.totalPlasmaThisRun / 1e6) * shardPrestigeMult);
}
function getShardUpgradeCost(def) {
  const lvl = game.shardUpgrades[def.id] || 0;
  return Math.ceil(def.baseCost * Math.pow(def.costMult, lvl));
}
function getShardEffect(id) {
  const def = SHARD_UPGRADE_DEFS.find(d => d.id === id);
  if (!def) return 1;
  const lvl = game.shardUpgrades[def.id] || 0;
  return def.effect(lvl);
}

// ─── Tap Handler ───
function handleClick(e) {
  initAudio();
  playSound('click');

  // Combo tracking
  const now = Date.now();
  if (now - comboTimestamp > COMBO_RESET_MS) comboCount = 0;
  comboCount++;
  comboTimestamp = now;
  clearTimeout(comboFadeTimer);
  comboFadeTimer = setTimeout(() => { comboCount = 0; resetComboUI(); }, COMBO_RESET_MS);

  const comboMult = getComboMultiplier();
  const power = getClickPower() * comboMult;
  game.plasma += power;
  game.totalPlasmaThisRun += power;
  game.stats.totalPlasma += power;
  game.stats.totalClicks++;
  game.stats.clickPlasma += power;
  game.sessionPlasma += power;
  game.sessionClicks++;

  // Daily challenge tap tracking
  if (game.dailyChallenges && game.dailyChallenges.date === getTodayStr()) {
    game.dailyChallenges.tapsToday = (game.dailyChallenges.tapsToday || 0) + 1;
    checkChallengeCompletion();
  }

  // Tutorial step 0: first tap
  if (tutorialActive && tutorialStep === 0) advanceTutorial();

  // Tap animation boost
  var btn = document.getElementById('plasma-click-btn');
  if (btn) {
    btn.classList.remove('tap-burst');
    void btn.offsetWidth;
    btn.classList.add('tap-burst');
  }

  if (Math.random() < 0.3) spawnClickText(power, comboMult);
  updateComboUI();
  updateUI();
}

function spawnClickText(amount, comboMult) {
  const btn = document.getElementById('plasma-click-btn');
  const rect = btn.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'click-float';
  el.textContent = '+' + fmt(amount) + (comboMult > 1 ? ' ' + comboMult + '×' : '');
  el.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
  el.style.top = (rect.top - 5) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ─── Game Mechanics ───
function buyGenerator(id, silent = false) {
  const def = GENERATOR_DEFS.find(g => g.id === id);
  const cost = getGenCost(def);
  if (game.plasma >= cost) {
    playSound('buy');
    game.plasma -= cost;
    game.generators[def.id]++;
    checkChallengeCompletion();
    if (tutorialActive && tutorialStep === 1 && id === 'spark') advanceTutorial();
    if (!silent) updateUI();
    return true;
  }
  return false;
}

function buyMaxGenerator(id) {
  const def = GENERATOR_DEFS.find(g => g.id === id);
  const currentCount = game.generators[def.id];
  const C0 = def.baseCost * Math.pow(def.costMult, currentCount);
  const r = def.costMult;
  const n = Math.floor(Math.log(game.plasma * (r - 1) / C0 + 1) / Math.log(r));
  if (n <= 0) return;
  const totalCost = C0 * (Math.pow(r, n) - 1) / (r - 1);
  playSound('buy');
  game.plasma -= totalCost;
  game.generators[def.id] += n;
  updateUI();
}

function buyUpgrade(id) {
  const def = UPGRADE_DEFS.find(u => u.id === id);
  if (!def || game.upgrades.includes(id)) return;
  if (game.plasma >= def.cost) {
    playSound('buy');
    game.plasma -= def.cost;
    game.upgrades.push(id);
    def.effect();
    showToast(`Purchased: ${def.name}`);
    updateUI();
  }
}

function buyShardUpgrade(id) {
  const def = SHARD_UPGRADE_DEFS.find(u => u.id === id);
  if (!def) return;
  const lvl = game.shardUpgrades[def.id] || 0;
  if (lvl >= def.maxLvl) return;
  const cost = getShardUpgradeCost(def);
  if (game.cosmicShards >= cost) {
    playSound('buy');
    game.cosmicShards -= cost;
    game.shardUpgrades[def.id] = lvl + 1;
    showToast(`Shard Upgrade: ${def.name} → Lv.${lvl + 1}`);
    updateUI();
  }
}

function doPrestige(force = false) {
  const shardsEarned = getPrestigeShardsEarned();
  if (shardsEarned <= 0) return;

  if (!force && game.prestigeCount === 0 && game.stats.playerName.startsWith('Citizen_')) {
      openNameModal(true);
      return;
  }

  showConfirmModal(
    'Prestige for ' + fmt(shardsEarned) + ' Cosmic Shards? All generators, upgrades, and plasma will reset.',
    function() {
      playSound('buy');

      var flash = document.createElement('div');
      flash.className = 'prestige-flash';
      document.body.appendChild(flash);
      setTimeout(function() { flash.remove(); }, 1100);

      var shards = game.cosmicShards + shardsEarned;
      var totalShards = game.totalShardsEarned + shardsEarned;
      var pCount = game.prestigeCount + 1;
      var shardUpgs = Object.assign({}, game.shardUpgrades);
      var savedStats = Object.assign({}, game.stats);
      var lb = game.leaderboard || [];

      if (window.Android && window.Android.pushScore) {
          var myPlayerId = 'player_' + game.stats.playerName.replace(/[^a-zA-Z0-9]/g, '') + '_' + game.stats.startTime;
          window.Android.pushScore(myPlayerId, game.stats.playerName, game.stats.totalPlasma);
      }

      var savedAchievements    = Object.assign({}, game.achievements);
      var savedLastLogin       = game.lastLoginDate;
      var savedLoginStreak     = game.loginStreak;
      var savedDailyChallenges = game.dailyChallenges ? Object.assign({}, game.dailyChallenges) : null;
      if (savedDailyChallenges) savedDailyChallenges.prestigeToday = (savedDailyChallenges.prestigeToday || 0) + 1;

      game = createFreshState();
      game.cosmicShards      = shards;
      game.totalShardsEarned = totalShards;
      game.prestigeCount     = pCount;
      game.shardUpgrades     = shardUpgs;
      game.achievements      = savedAchievements;
      game.lastLoginDate     = savedLastLogin;
      game.loginStreak       = savedLoginStreak;
      game.stats             = savedStats;
      game.leaderboard       = lb;
      if (savedDailyChallenges) game.dailyChallenges = savedDailyChallenges;
      game.sessionPlasma     = 0;
      game.sessionClicks     = 0;
      checkAchievements();
      checkChallengeCompletion();

      var headStart = getShardEffect('shardStart');
      if (headStart > 1) { game.plasma = headStart; game.totalPlasmaThisRun = headStart; }
      showToast('✨ Prestiged! +' + fmt(shardsEarned) + ' Cosmic Shards');
      renderAll();
      updateUI();
      saveGame();
    }
  );
}

// ─── Rendering & UI ───
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', tab !== 'leaderboard' && b.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
  if (tutorialActive && tutorialStep === 2 && tab === 'upgrades') advanceTutorial();
  else if (tutorialActive && tutorialStep === 3 && tab === 'prestige') advanceTutorial();
}

function openLeaderboard() {
  initAudio();
  playSound('click');
  switchTab('leaderboard');
  renderLeaderboard();
}

const lbNames = [
  "CosmicW","StarDust","NovaKng","PlasmaX","VoidWlk","AstroN","Nebula9","Qasar11",
  "GamerX","Zenith","OrbitG","Pulse88","Singlrty","Apollo","Drifter","Pulsar",
  "Quantum","GravityX","Tachyon","WarpSpd","IonFlux","DarkMtr","ArcLight","FuseCore",
  "Photonx","CelestX","HyperG","SingularR","PlasmaBrst","VortexQ","NeutronZ","SolarRift",
  "GalacticB","InfiniteP","CrystalV","EchoWave","StarlordK","NovaDawn","PulsarX","QuasarJ"
];

function initLeaderboardData() {
    if (!game.leaderboard) game.leaderboard = [];

    // Count actual bot entries — Firebase entries (fb_*) don't count
    var botCount = game.leaderboard.filter(function(e) { return e.id && e.id.indexOf('bot_') === 0; }).length;
    if (botCount >= 100) return;

    // Preserve any Firebase entries already merged in
    var fbEntries = game.leaderboard.filter(function(e) { return e.id && e.id.indexOf('fb_') === 0; });
    game.leaderboard = [];

    for (var i = 1; i <= 100; i++) {
        var baseName = lbNames[Math.floor(Math.random() * lbNames.length)];
        var suffix = Math.floor(Math.random() * 99);
        var name = (baseName + suffix).substring(0, 12);
        var x = (100 - i) / 99; // 1.0 = rank 1, 0.0 = rank 100

        // All-time: 10^6 (rank 100) → 10^14 (rank 1)
        var atScore = Math.pow(10, 6 + x * 8);
        // Grows ~1 full tier per week so top bots stay competitive
        var atRate  = atScore / (7 * 24 * 3600);

        // Weekly/session: 10^4 (rank 100) → 10^9 (rank 1)
        // Represents a realistic single session's worth of plasma
        var wkScore = Math.pow(10, 4 + x * 5);
        var wkRate  = wkScore / (24 * 3600); // grows ~1 tier per day

        game.leaderboard.push({
            id: 'bot_' + i,
            name: name,
            initial: name.charAt(0).toUpperCase(),
            score: atScore,
            weeklyScore: wkScore,
            rate: atRate,
            weeklyRate: wkRate,
            isPlayer: false
        });
    }

    // Re-add Firebase entries after bots
    game.leaderboard = game.leaderboard.concat(fbEntries);
}

function renderLeaderboard() {
    initLeaderboardData();
    window._lastMyRank = -1;
    updateLeaderboardLive();

    // Fetch real players from Firebase and merge them in
    if (window.Android && window.Android.fetchLeaderboard) {
        window.Android.fetchLeaderboard();
    }
}

// Callback from Android: merges Firebase players into the local bot pool
window.updateLeaderboardFromAndroid = function(inputData) {
    try {
        var data = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;
        if (data && data.length > 0) {
            // Remove any previously merged Firebase entries
            game.leaderboard = game.leaderboard.filter(function(e) { return e.id.indexOf('fb_') !== 0; });

            // Add Firebase players into the pool alongside local bots
            data.forEach(function(entry, i) {
                var atScore = entry.score || 0;
                // Estimate weekly as ~1% of all-time for real players (no session data stored)
                var wkScore = entry.weeklyScore || atScore * 0.01;
                game.leaderboard.push({
                    id: 'fb_' + i,
                    name: entry.name || 'Unknown',
                    initial: (entry.name && entry.name.length > 0) ? entry.name.charAt(0).toUpperCase() : '?',
                    score: atScore,
                    weeklyScore: wkScore,
                    rate: 0,
                    weeklyRate: 0,
                    isPlayer: false
                });
            });

            window._lastMyRank = -1;
            var lbTab = document.getElementById('tab-leaderboard');
            if (lbTab && lbTab.classList.contains('active')) {
                updateLeaderboardLive();
            }
        }
    } catch(e) { }
};



let lbViewMode = 'top';

function toggleLeaderboardView() {
    playSound('click');
    lbViewMode = lbViewMode === 'top' ? 'local' : 'top';

    const container = document.querySelector('.lb-list-container');
    if (container) {
        container.classList.remove('list-transition');
        void container.offsetWidth; // force reflow
        container.classList.add('list-transition');
    }

    window._lastMyRank = -1; // force html rebuild for fade effect
    updateLeaderboardLive();
}

function updateLeaderboardLive() {
    if (!game.leaderboard || game.leaderboard.length === 0) return;

    const isWeekly = currentLbType === 'weekly';

    // All-time: total plasma ever earned
    // Weekly/session: plasma earned in the current run (resets on prestige)
    const myScore = isWeekly ? game.totalPlasmaThisRun : game.stats.totalPlasma;

    let pName = game.stats.playerName || 'Citizen_0000';
    let pool = [...game.leaderboard.map(b => ({
        ...b,
        score: isWeekly
            ? (b.weeklyScore !== undefined ? b.weeklyScore : b.score * 0.01)
            : b.score
    })), {
        id: 'player',
        name: pName,
        initial: pName.charAt(0).toUpperCase(),
        score: Math.max(0, myScore),
        isPlayer: true
    }];

    pool.sort((a, b) => b.score - a.score);

    let myRank = pool.findIndex(p => p.isPlayer) + 1;

    const listEl = document.getElementById('lb-list');
    const podiumEl = document.getElementById('lb-podium');

    if (listEl.children.length === 0 || window._lastMyRank !== myRank || window._lastLbView !== lbViewMode) {
        window._lastMyRank = myRank;
        window._lastLbView = lbViewMode;

        let startIdx = 3;
        let endIdx = 100;
        const truncName = (n) => (n && n.length > 12) ? n.substring(0, 12) + '...' : (n || 'Unknown');

        if (lbViewMode === 'top') {
            podiumEl.style.display = 'flex';
            podiumEl.innerHTML = `
                <div class="podium-slot rank-2 ${pool[1].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[1].initial}</div>
                    <div class="podium-name">${truncName(pool[1].name)}</div>
                    <div class="podium-score" id="podium-score-2">${fmt(pool[1].score)}</div>
                </div>
                <div class="podium-slot rank-1 ${pool[0].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[0].initial}</div>
                    <div class="podium-name">${truncName(pool[0].name)}</div>
                    <div class="podium-score" id="podium-score-1">${fmt(pool[0].score)}</div>
                </div>
                <div class="podium-slot rank-3 ${pool[2].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[2].initial}</div>
                    <div class="podium-name">${truncName(pool[2].name)}</div>
                    <div class="podium-score" id="podium-score-3">${fmt(pool[2].score)}</div>
                </div>
            `;
        } else {
            podiumEl.style.display = 'none';
            podiumEl.innerHTML = '';

            // local neighborhood view (5 above, 5 below)
            startIdx = Math.max(0, myRank - 6);
            endIdx = Math.min(pool.length, startIdx + 11);
        }

        let listHTML = '';
        for (let i = startIdx; i < endIdx; i++) {
            if (!pool[i]) break;
            listHTML += `
            <div class="lb-row ${pool[i].isPlayer ? 'is-player-row' : ''}">
                <div class="lb-rank">#${i+1}</div>
                <div class="lb-name">${truncName(pool[i].name)}</div>
                <div class="lb-dots"></div>
                <div class="lb-score" id="list-score-${pool[i].id}">${fmt(pool[i].score)}</div>
            </div>`;
        }
        listEl.innerHTML = listHTML;
    } else {
        if (lbViewMode === 'top') {
            document.getElementById('podium-score-1').textContent = fmt(pool[0].score);
            document.getElementById('podium-score-2').textContent = fmt(pool[1].score);
            document.getElementById('podium-score-3').textContent = fmt(pool[2].score);
        }

        let startIdx = lbViewMode === 'top' ? 3 : Math.max(0, myRank - 6);
        let endIdx = lbViewMode === 'top' ? 100 : Math.min(pool.length, startIdx + 11);

        for (let i = startIdx; i < endIdx; i++) {
            if (!pool[i]) break;
            const el = document.getElementById(`list-score-${pool[i].id}`);
            if (el) el.textContent = fmt(pool[i].score);
        }
    }

    // Update footer
    const footerEl = document.getElementById('lb-footer');

    if (footerEl.children.length === 0) {
        footerEl.innerHTML = `
            <div class="lb-footer-container">
                <div class="lb-footer-rank" id="lb-footer-rank"></div>
                <div class="lb-footer-name-col">
                    <div style="display:flex; align-items:center;">
                        <span class="lb-footer-name" id="lb-footer-name"></span>
                        <span class="lb-edit-icon" onclick="openNameModal(false)">✏️</span>
                    </div>
                    <div class="lb-footer-subtext" id="lb-footer-subtext"></div>
                </div>
                <div class="lb-footer-score" id="lb-footer-score"></div>
                <div class="lb-footer-action">
                    <button class="lb-locate-btn" id="lb-locate-btn" onclick="toggleLeaderboardView()"></button>
                </div>
            </div>
        `;
    }

    document.getElementById('lb-footer-rank').textContent = `#${myRank > 100 ? '100+' : myRank}`;
    const truncName = (n) => n.length > 12 ? n.substring(0, 12) + '...' : n;
    document.getElementById('lb-footer-name').textContent = truncName(pName);
    document.getElementById('lb-footer-score').textContent = fmt(myScore);

    const subtextEl = document.getElementById('lb-footer-subtext');
    if (myRank > 1 && pool[myRank - 2]) {
        const gap = pool[myRank - 2].score - myScore;
        subtextEl.textContent = '+' + fmt(gap) + ' to next rank';
    } else if (myRank === 1) {
        subtextEl.textContent = 'Top of the world!';
    } else {
        subtextEl.textContent = '';
    }

    const btn = document.getElementById('lb-locate-btn');
    if (lbViewMode === 'top') {
        btn.innerHTML = '⌖';
        btn.className = 'lb-locate-btn top';
    } else {
        btn.innerHTML = '⇈';
        btn.className = 'lb-locate-btn local';
    }
}

let currentLbType = 'weekly';

function switchLbTab(type, e) {
    currentLbType = type;
    document.querySelectorAll('.lb-toggle-btn').forEach(b => b.classList.remove('active'));
    if(e && e.target) e.target.classList.add('active');
    playSound('click');
    document.getElementById('lb-podium').innerHTML = '';
    document.getElementById('lb-list').innerHTML = '';
    window._lastMyRank = -1;
    renderLeaderboard();
}

function initGeneratorsUI() {
  const container = document.getElementById('generators-list');
  container.innerHTML = '';
  GENERATOR_DEFS.forEach(def => {
    const card = document.createElement('div');
    card.id = `gen-card-${def.id}`;
    card.className = 'generator-card';
    card.innerHTML = `<div class="gen-icon">${def.icon}</div><div class="gen-info"><div class="gen-name" id="gen-name-${def.id}"></div><div class="gen-details" id="gen-det-${def.id}"></div><div class="gen-output" id="gen-out-${def.id}"></div></div><div class="gen-buy-section"><span class="gen-count" id="gen-cnt-${def.id}"></span><button id="gen-btn-${def.id}" class="gen-buy-btn" oncontextmenu="buyMaxGenerator('${def.id}'); return false;"></button></div>`;
    container.appendChild(card);

    // Hold-to-buy: continuously buy while finger/mouse held down
    const btn = card.querySelector(`#gen-btn-${def.id}`);
    let holdTimer = null;
    let holdInterval = null;

    function startHold(e) {
      e.preventDefault();
      buyGenerator(def.id);
      holdTimer = setTimeout(() => {
        holdInterval = setInterval(() => {
          if (!buyGenerator(def.id, true)) clearInterval(holdInterval);
        }, 80);
      }, 400);
    }

    function stopHold() {
      clearTimeout(holdTimer);
      clearInterval(holdInterval);
      holdTimer = null;
      holdInterval = null;
    }

    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('touchend', stopHold);
    btn.addEventListener('touchcancel', stopHold);
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', stopHold);
    btn.addEventListener('mouseleave', stopHold);
  });
}

function updateGeneratorsUI() {
  GENERATOR_DEFS.forEach(def => {
    const isLocked = game.totalPlasmaThisRun < def.unlockAt && game.generators[def.id] === 0;
    const cost = getGenCost(def);
    const output = getGenOutput(def);
    const count = game.generators[def.id];

    const card = document.getElementById(`gen-card-${def.id}`);
    if (!card) return;

    if(isLocked) {
      if(!card.classList.contains('locked')) card.classList.add('locked');
      document.getElementById(`gen-name-${def.id}`).textContent = '???';
      document.getElementById(`gen-det-${def.id}`).textContent = `Unlocks at ${fmt(def.unlockAt)} total plasma`;
      document.getElementById(`gen-out-${def.id}`).textContent = '';
      document.getElementById(`gen-btn-${def.id}`).disabled = true;
      document.getElementById(`gen-btn-${def.id}`).textContent = fmt(cost);
      document.getElementById(`gen-cnt-${def.id}`).textContent = count;
    } else {
      if(card.classList.contains('locked')) card.classList.remove('locked');
      document.getElementById(`gen-name-${def.id}`).textContent = def.name;
      document.getElementById(`gen-det-${def.id}`).textContent = `Each: ${fmt(output)}/s`;
      document.getElementById(`gen-out-${def.id}`).textContent = `Total: ${fmt(output * count)}/s`;
      const btn = document.getElementById(`gen-btn-${def.id}`);
      btn.disabled = game.plasma < cost;
      btn.textContent = fmt(cost);
      document.getElementById(`gen-cnt-${def.id}`).textContent = count;
    }
  });
}

function initUpgradesUI() {
  const container = document.getElementById('upgrades-list');
  container.innerHTML = '';
  UPGRADE_DEFS.forEach(def => {
    const card = document.createElement('div');
    card.id = `upg-card-${def.id}`;
    card.innerHTML = `<div class="upg-icon">${def.icon}</div><div class="upg-info"><div class="upg-name">${def.name}</div><div class="upg-desc">${def.desc}</div></div><div id="upg-action-${def.id}"></div>`;
    container.appendChild(card);
  });
}

let _lastUpgradeOrderKey = '';

function updateUpgradesUI() {
  UPGRADE_DEFS.forEach(def => {
    const card = document.getElementById(`upg-card-${def.id}`);
    if (!card) return;
    const owned = game.upgrades.includes(def.id);
    const unlocked = def.req();
    const action = document.getElementById(`upg-action-${def.id}`);

    card.style.display = 'flex';

    if (owned) {
      card.className = 'upgrade-card purchased';
      if (!action.querySelector('.upg-owned-tag')) {
        action.innerHTML = '<span class="upg-owned-tag" style="color:var(--accent-green);font-family:var(--font-display);font-size:0.7rem;">OWNED</span>';
      }
    } else if (!unlocked) {
      card.className = 'upgrade-card locked';
      action.innerHTML = '<span style="color:var(--text-muted);font-family:var(--font-display);font-size:0.6rem;">LOCKED</span>';
    } else {
      card.className = 'upgrade-card';
      if (!action.querySelector('button')) {
        action.innerHTML = `<button id="upg-btn-${def.id}" class="upg-buy-btn" onclick="buyUpgrade('${def.id}')"></button>`;
      }
      const btn = document.getElementById(`upg-btn-${def.id}`);
      btn.disabled = game.plasma < def.cost;
      btn.textContent = fmt(def.cost);
    }
  });

  // Sort: purchasable first → locked → owned — only when order changes
  const container = document.getElementById('upgrades-list');
  if (!container) return;
  const order = (card) => {
    if (card.classList.contains('purchased')) return 2;
    if (card.classList.contains('locked'))   return 1;
    return 0;
  };
  const cards = Array.from(container.children);
  const orderKey = cards.map(c => order(c)).join(',');
  if (orderKey !== _lastUpgradeOrderKey) {
    _lastUpgradeOrderKey = orderKey;
    cards.sort((a, b) => order(a) - order(b));
    cards.forEach(c => container.appendChild(c));
  }
}

function initShardUpgradesUI() {
  const container = document.getElementById('shard-upgrades-list');
  container.innerHTML = '';
  SHARD_UPGRADE_DEFS.forEach(def => {
    const card = document.createElement('div');
    card.id = `shard-card-${def.id}`;
    card.innerHTML = `<div class="shard-icon">${def.icon}</div><div class="shard-info"><div class="shard-name">${def.name}</div><div class="shard-desc">${def.desc}</div><div id="shard-lvl-${def.id}" class="shard-level"></div></div><div id="shard-action-${def.id}"></div>`;
    container.appendChild(card);
  });
}

function updateShardUpgradesUI() {
  SHARD_UPGRADE_DEFS.forEach(def => {
    const card = document.getElementById(`shard-card-${def.id}`);
    if (!card) return;
    const lvl = game.shardUpgrades[def.id] || 0;
    const maxed = lvl >= def.maxLvl;
    const cost = getShardUpgradeCost(def);

    card.className = 'shard-card' + (maxed ? ' maxed' : '');
    document.getElementById(`shard-lvl-${def.id}`).textContent = `Lv. ${lvl} / ${def.maxLvl}`;

    const action = document.getElementById(`shard-action-${def.id}`);
    if (maxed) {
      if (!action.querySelector('span')) {
        action.innerHTML = '<span style="color:var(--accent-green);font-family:var(--font-display);font-size:0.7rem;">MAX</span>';
      }
    } else {
      if (!action.querySelector('button')) {
        action.innerHTML = `<button id="shard-btn-${def.id}" class="shard-buy-btn" onclick="buyShardUpgrade('${def.id}')"></button>`;
      }
      const btn = document.getElementById(`shard-btn-${def.id}`);
      btn.disabled = game.cosmicShards < cost;
      btn.textContent = `💎 ${cost}`;
    }
  });
}

function updateUI() {
  updateGeneratorsUI();
  updateUpgradesUI();
  updateShardUpgradesUI();

  document.getElementById('plasma-amount').textContent = fmt(game.plasma);
  document.getElementById('plasma-rate').textContent = fmt(getTotalRate()) + ' / sec';
  // Update tap-power span WITHOUT destroying it (setting textContent on the parent would kill the span)
  var cpDisplay = document.getElementById('click-power-display');
  if (cpDisplay) cpDisplay.textContent = fmt(getClickPower());
  document.getElementById('shard-count').textContent = fmt(game.cosmicShards);
  document.getElementById('prestige-level').textContent = game.prestigeCount;

  const totalMult = getShardBonus(game.cosmicShards) * game.globalGenMultiplier * getShardEffect('shardGen');
  document.getElementById('multiplier-display').textContent = 'x' + totalMult.toFixed(2);
  const holdingEl = document.getElementById('shard-holding-bonus');
  if (holdingEl) holdingEl.textContent = '+' + (game.cosmicShards * 5).toFixed(0) + '%';

  // Prestige preview
  const shardsOnPrestige = getPrestigeShardsEarned();
  const previewEl = document.getElementById('prestige-shards-preview');
  if (previewEl) previewEl.textContent = fmt(shardsOnPrestige);
  const totalAfterEl = document.getElementById('prestige-shards-total');
  if (totalAfterEl) totalAfterEl.textContent = fmt(game.cosmicShards + shardsOnPrestige);
  const newMultEl = document.getElementById('prestige-new-mult');
  if (newMultEl) {
    const newShards = game.cosmicShards + shardsOnPrestige;
    const newMult = getShardBonus(newShards) * game.globalGenMultiplier * getShardEffect('shardGen');
    newMultEl.textContent = 'x' + newMult.toFixed(2);
  }
  const prestigeBtn = document.getElementById('prestige-btn');
  if (prestigeBtn) prestigeBtn.disabled = shardsOnPrestige <= 0;

  // Stats
  document.getElementById('stat-total-plasma').textContent = fmt(game.stats.totalPlasma);
  document.getElementById('stat-total-taps').textContent = fmt(game.stats.totalClicks);
  document.getElementById('stat-tap-plasma').textContent = fmt(game.stats.clickPlasma);
  document.getElementById('stat-auto-plasma').textContent = fmt(game.stats.autoPlasma || 0);
  document.getElementById('stat-gen-plasma').textContent = fmt(game.stats.genPlasma);
  document.getElementById('stat-prestiges').textContent = game.prestigeCount;
  document.getElementById('stat-total-shards').textContent = fmt(game.totalShardsEarned);
  document.getElementById('stat-multiplier').textContent = 'x' + totalMult.toFixed(2);
  // Session stats
  var sessionPlasmaEl = document.getElementById('stat-session-plasma');
  if (sessionPlasmaEl) sessionPlasmaEl.textContent = fmt(game.totalPlasmaThisRun);
  var sessionTapsEl = document.getElementById('stat-session-taps');
  if (sessionTapsEl) sessionTapsEl.textContent = fmt(game.sessionClicks || 0);

  // Leaderboard live update if active
  const lbTab = document.getElementById('tab-leaderboard');
  if (lbTab && lbTab.classList.contains('active')) {
      updateLeaderboardLive();
  }

  // Play time
  const playtimeEl = document.getElementById('stat-playtime');
  if (playtimeEl) {
    const elapsed = Math.floor((Date.now() - game.stats.startTime) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    playtimeEl.textContent = h > 0 ? h + 'h ' + m + 'm ' + s + 's' : m > 0 ? m + 'm ' + s + 's' : s + 's';
  }
}

function renderAll() {
  initGeneratorsUI();
  initUpgradesUI();
  initShardUpgradesUI();
  updateUI();
}

// ─── Core Game Loop ───
function tick() {
  const now = Date.now();
  const dt = (now - lastTickTime) / 1000;
  lastTickTime = now;

  const rate = getTotalRate();
  if (rate > 0) {
    const produced = rate * dt;
    game.plasma += produced;
    game.totalPlasmaThisRun += produced;
    game.stats.totalPlasma += produced;
    game.stats.genPlasma += produced;
  }

  const autoClicks = getShardEffect('shardAuto');
  if (autoClicks > 0) {
    const power = getClickPower() * autoClicks * dt;
    game.plasma += power;
    game.totalPlasmaThisRun += power;
    game.stats.totalPlasma += power;
    game.stats.autoPlasma = (game.stats.autoPlasma || 0) + power;
  }

  if (game.leaderboard && game.leaderboard.length > 0) {
      game.leaderboard.forEach(b => {
          if (b.rate) b.score += b.rate * dt;
          if (b.weeklyRate) b.weeklyScore += b.weeklyRate * dt;
      });
  }

  if (now - lastUIUpdateTime > 200) {
      updateUI();
      lastUIUpdateTime = now;
  }



  requestAnimationFrame(tick);
}

// ─── Data Management ───
function saveGame() {
  const data = {
    plasma: game.plasma,
    totalPlasmaThisRun: game.totalPlasmaThisRun,
    generators: game.generators,
    upgrades: game.upgrades,
    clickMultiplier: game.clickMultiplier,
    clickPercentOfRate: game.clickPercentOfRate,
    globalGenMultiplier: game.globalGenMultiplier,
    genMultipliers: game.genMultipliers,
    cosmicShards: game.cosmicShards,
    totalShardsEarned: game.totalShardsEarned,
    prestigeCount: game.prestigeCount,
    shardUpgrades: game.shardUpgrades,
    achievements: game.achievements,
    lastLoginDate: game.lastLoginDate,
    loginStreak: game.loginStreak,
    stats: game.stats,
    leaderboard: game.leaderboard,
    dailyChallenges: game.dailyChallenges,
    savedAt: Date.now(),
  };
  localStorage.setItem('cosmicPlasma_save', JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem('cosmicPlasma_save');
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    // Ensure all generator IDs exist before assigning
    GENERATOR_DEFS.forEach(g => {
      if (data.generators && data.generators[g.id] === undefined) data.generators[g.id] = 0;
      if (data.genMultipliers && data.genMultipliers[g.id] === undefined) data.genMultipliers[g.id] = 1;
    });
    Object.assign(game, data);

    // For legacy saves that didn't persist multiplier state, re-apply upgrade effects
    if (data.clickMultiplier === undefined && data.upgrades) {
      game.clickMultiplier = 1;
      game.clickPercentOfRate = 0;
      game.globalGenMultiplier = 1;
      GENERATOR_DEFS.forEach(g => game.genMultipliers[g.id] = 1);
      data.upgrades.forEach(uid => {
        const udef = UPGRADE_DEFS.find(u => u.id === uid);
        if (udef) udef.effect();
      });
    }

    if (!game.stats.playerName) game.stats.playerName = 'Citizen_' + Math.floor(1000 + Math.random() * 9000);
    if (!game.dailyChallenges) game.dailyChallenges = { date: null, challenges: [], completed: [], tapsToday: 0, prestigeToday: 0 };

    // Compute offline production
    if (data.savedAt) {
      const offlineSec = (Date.now() - data.savedAt) / 1000;
      if (offlineSec > 5) {
        const offlineRate = getTotalRate();
        const offlineGain = offlineRate * Math.min(offlineSec, 28800) * 0.8; // cap at 8h, 80% efficiency
        if (offlineGain > 0) {
          game.plasma += offlineGain;
          game.totalPlasmaThisRun += offlineGain;
          game.stats.totalPlasma += offlineGain;
          game.stats.genPlasma += offlineGain;
          setTimeout(() => showOfflineModal(offlineGain, Math.min(offlineSec, 28800)), 400);
        }
      }
      if (game.leaderboard && game.leaderboard.length > 0) {
          game.leaderboard.forEach(b => {
              if (b.rate) b.score += b.rate * offlineSec;
              // Weekly scores capped at 1 day of offline growth so session board stays competitive
              if (b.weeklyRate) b.weeklyScore += b.weeklyRate * Math.min(offlineSec, 86400);
          });
      }
    }
    return true;
  } catch (e) { return false; }
}

function hardReset() {
  showConfirmModal(
    'Are you sure? This will DELETE all progress permanently!',
    function() {
      showConfirmModal(
        'Really? This cannot be undone!',
        function() {
          localStorage.removeItem('cosmicPlasma_save');
          game = createFreshState();
          renderAll();
          showToast('🗑️ Game has been reset.');
        }
      );
    }
  );
}

// ─── Custom Confirm Modal ───
function showConfirmModal(message, onConfirm) {
  const overlay = document.getElementById('confirm-modal');
  const msgEl = document.getElementById('confirm-message');
  const okBtn = document.getElementById('confirm-ok-btn');
  const cancelBtn = document.getElementById('confirm-cancel-btn');

  msgEl.textContent = message;
  overlay.classList.add('active');

  function cleanup() {
    overlay.classList.remove('active');
    okBtn.removeEventListener('click', handleOk);
    cancelBtn.removeEventListener('click', handleCancel);
  }

  function handleOk() {
    playSound('buy');
    cleanup();
    onConfirm();
  }

  function handleCancel() {
    playSound('click');
    cleanup();
  }

  okBtn.addEventListener('click', handleOk);
  cancelBtn.addEventListener('click', handleCancel);
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── Modal Helper ───
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ─── Offline Earnings Modal ───
function showOfflineModal(plasma, secs) {
  const hrs  = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  document.getElementById('offline-time').textContent = timeStr;
  document.getElementById('offline-plasma').textContent = '+' + fmt(plasma) + ' Plasma';
  document.getElementById('offline-modal').classList.add('active');
}

function closeOfflineModal() { closeModal('offline-modal'); }

// ─── Daily Login System ───
const DAILY_REWARDS = [
  { day: 1, label: '500 Plasma',  apply: () => { game.plasma += 500;   game.totalPlasmaThisRun += 500;   game.stats.totalPlasma += 500;   } },
  { day: 2, label: '1K Plasma',   apply: () => { game.plasma += 1000;  game.totalPlasmaThisRun += 1000;  game.stats.totalPlasma += 1000;  } },
  { day: 3, label: '2 Shards',    apply: () => { game.cosmicShards += 2;  game.totalShardsEarned += 2;  } },
  { day: 4, label: '5K Plasma',   apply: () => { game.plasma += 5000;  game.totalPlasmaThisRun += 5000;  game.stats.totalPlasma += 5000;  } },
  { day: 5, label: '5 Shards',    apply: () => { game.cosmicShards += 5;  game.totalShardsEarned += 5;  } },
  { day: 6, label: '10K Plasma',  apply: () => { game.plasma += 10000; game.totalPlasmaThisRun += 10000; game.stats.totalPlasma += 10000; } },
  { day: 7, label: '10 Shards',   apply: () => { game.cosmicShards += 10; game.totalShardsEarned += 10; } },
];

function getTodayStr() { return new Date().toISOString().slice(0, 10); }

function checkDailyLogin() {
  const today = getTodayStr();
  if (game.lastLoginDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const streakBroken = game.lastLoginDate && game.lastLoginDate !== yesterdayStr;
  if (streakBroken) game.loginStreak = 0;

  game.loginStreak = (game.loginStreak || 0) + 1;
  if (game.loginStreak > 7) game.loginStreak = 1;

  showDailyLoginModal(streakBroken);
}

function showDailyLoginModal(streakBroken) {
  const streak = game.loginStreak;
  document.getElementById('daily-streak-status').textContent = streakBroken
    ? '💔 Streak reset — starting fresh!'
    : `🔥 Day ${streak} streak!`;

  const calendarEl = document.getElementById('daily-calendar');
  calendarEl.innerHTML = '';
  DAILY_REWARDS.forEach(r => {
    const cell = document.createElement('div');
    cell.className = 'calendar-day' +
      (r.day < streak ? ' claimed' : '') +
      (r.day === streak ? ' today' : '') +
      (r.day > streak ? ' locked' : '');
    cell.innerHTML = `<div class="cal-day-num">Day ${r.day}</div><div class="cal-reward">${r.label}</div>`;
    calendarEl.appendChild(cell);
  });
  document.getElementById('daily-login-modal').classList.add('active');
}

function claimDailyReward() {
  const reward = DAILY_REWARDS.find(r => r.day === game.loginStreak);
  if (reward) reward.apply();
  game.lastLoginDate = getTodayStr();
  closeModal('daily-login-modal');
  showToast(`🎁 Day ${game.loginStreak} reward: ${reward ? reward.label : ''}`);
  saveGame();
  updateUI();
}

// ─── Achievement System ───
const ACHIEVEMENT_DEFS = [
  { id: 'first_ascension', title: 'First Ascension', subtitle: 'You prestiged for the first time.', icon: '✨', check: () => game.prestigeCount >= 1 },
  { id: 'generator_baron', title: 'Generator Baron',  subtitle: 'Owned 10 of the same generator.',  icon: '🏭', check: () => GENERATOR_DEFS.some(def => game.generators[def.id] >= 10) },
  { id: 'gigaplasma',      title: 'Gigaplasma',       subtitle: 'Generated 1 billion total plasma.', icon: '🌌', check: () => game.stats.totalPlasma >= 1e9 },
];

let achievementQueue = [];
let achievementShowing = false;

function checkAchievements() {
  if (!game.achievements) game.achievements = {};
  ACHIEVEMENT_DEFS.forEach(def => {
    if (!game.achievements[def.id] && def.check()) {
      game.achievements[def.id] = true;
      achievementQueue.push(def);
    }
  });
  if (!achievementShowing && achievementQueue.length > 0) showNextAchievement();
}

function showNextAchievement() {
  if (achievementQueue.length === 0) { achievementShowing = false; return; }
  achievementShowing = true;
  const def = achievementQueue.shift();
  document.getElementById('ach-icon').textContent = def.icon;
  document.getElementById('ach-title').textContent = def.title;
  document.getElementById('ach-subtitle').textContent = def.subtitle;
  document.getElementById('achievement-pop').classList.add('active');
  showToast(`🏆 Achievement: ${def.title}`);
  setTimeout(() => {
    document.getElementById('achievement-pop').classList.remove('active');
    setTimeout(showNextAchievement, 400);
  }, 3000);
}

function openAchievements() {
  playSound('click');
  const earned = game.achievements || {};
  const list = document.getElementById('achievements-list');
  list.innerHTML = ACHIEVEMENT_DEFS.map(def => {
    const done = !!earned[def.id];
    return `<div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,${done ? '0.18' : '0.07'});border-radius:10px;padding:10px 14px;opacity:${done ? '1' : '0.45'}">
      <span style="font-size:1.5rem">${def.icon}</span>
      <div style="flex:1;text-align:left">
        <div style="font-weight:700;color:${done ? '#22d3ee' : '#aaa'};font-size:0.95rem">${def.title}</div>
        <div style="font-size:0.78rem;color:#888;margin-top:2px">${def.subtitle}</div>
      </div>
      <span style="font-size:1.1rem">${done ? '✅' : '🔒'}</span>
    </div>`;
  }).join('');
  document.getElementById('achievements-modal').classList.add('active');
}

// ═══════════════════════════════════════════════
// ─── COMBO MULTIPLIER ───
// ═══════════════════════════════════════════════
function getComboMultiplier() {
  if (Date.now() - comboTimestamp > COMBO_RESET_MS) return 1;
  for (const tier of COMBO_TIERS) {
    if (comboCount >= tier.min) return tier.mult;
  }
  return 1;
}

function updateComboUI() {
  const el = document.getElementById('combo-display');
  const countEl = document.getElementById('combo-count');
  const multEl  = document.getElementById('combo-mult');
  if (!el) return;
  if (comboCount < 5) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  el.classList.remove('fading');
  const prev = parseInt(countEl.textContent) || 0;
  countEl.textContent = comboCount;
  const mult = getComboMultiplier();
  multEl.textContent = mult > 1 ? mult + '×' : '';
  if ([5, 10, 20].includes(comboCount) && comboCount !== prev) {
    el.classList.remove('combo-pulse');
    void el.offsetWidth;
    el.classList.add('combo-pulse');
  }
}

function resetComboUI() {
  const el = document.getElementById('combo-display');
  if (!el) return;
  el.classList.add('fading');
  setTimeout(() => { el.style.display = 'none'; el.classList.remove('fading'); }, 400);
}

// ═══════════════════════════════════════════════
// ─── DAILY CHALLENGES ───
// ═══════════════════════════════════════════════
const CHALLENGE_TEMPLATES = [
  { type: 'buy-generators', genId: 'spark',  target: 10,  rewardType: 'plasma', rewardAmount: 500,  labelFn: (t) => `Buy ${t} Spark generators`,       rewardFn: (r) => `+${fmt(r)} Plasma` },
  { type: 'buy-generators', genId: 'ember',  target: 5,   rewardType: 'plasma', rewardAmount: 2000, labelFn: (t) => `Buy ${t} Ember generators`,        rewardFn: (r) => `+${fmt(r)} Plasma` },
  { type: 'buy-generators', genId: 'flare',  target: 3,   rewardType: 'shards', rewardAmount: 1,    labelFn: (t) => `Buy ${t} Solar Flares`,            rewardFn: (r) => `+${r} 💎 Shards` },
  { type: 'earn-plasma',                     target: 1e4, rewardType: 'plasma', rewardAmount: 1000, labelFn: (t) => `Earn ${fmt(t)} plasma this session`,rewardFn: (r) => `+${fmt(r)} Plasma` },
  { type: 'earn-plasma',                     target: 1e6, rewardType: 'shards', rewardAmount: 2,    labelFn: (t) => `Earn ${fmt(t)} plasma this session`,rewardFn: (r) => `+${r} 💎 Shards` },
  { type: 'tap-count',                       target: 50,  rewardType: 'plasma', rewardAmount: 300,  labelFn: (t) => `Tap the orb ${t} times today`,     rewardFn: (r) => `+${fmt(r)} Plasma` },
  { type: 'tap-count',                       target: 200, rewardType: 'shards', rewardAmount: 1,    labelFn: (t) => `Tap the orb ${t} times today`,     rewardFn: (r) => `+${r} 💎 Shards` },
  { type: 'prestige',                        target: 1,   rewardType: 'shards', rewardAmount: 5,    labelFn: ()  => `Prestige once today`,              rewardFn: (r) => `+${r} 💎 Shards` },
];

function generateDailyChallenges(dateStr) {
  const seed = parseInt(dateStr.replace(/-/g, '')) || 20260101;
  function seededRand(n, offset) {
    return ((seed * 1664525 + offset * 22695477 + 1013904223) >>> 0) % n;
  }
  const pool = CHALLENGE_TEMPLATES.slice();
  const chosen = [];
  for (let i = 0; i < 3; i++) {
    const idx = seededRand(pool.length, i * 7);
    const tpl = pool.splice(idx, 1)[0];
    chosen.push({
      id: 'ch' + i,
      type: tpl.type,
      genId: tpl.genId || null,
      target: tpl.target,
      rewardType: tpl.rewardType,
      rewardAmount: tpl.rewardAmount,
      label: tpl.labelFn(tpl.target),
      rewardLabel: tpl.rewardFn(tpl.rewardAmount),
    });
  }
  return chosen;
}

function checkAndRefreshDailyChallenges() {
  const today = getTodayStr();
  if (!game.dailyChallenges) {
    game.dailyChallenges = { date: null, challenges: [], completed: [], tapsToday: 0, prestigeToday: 0 };
  }
  if (game.dailyChallenges.date !== today) {
    game.dailyChallenges.date = today;
    game.dailyChallenges.challenges = generateDailyChallenges(today);
    game.dailyChallenges.completed = [];
    game.dailyChallenges.tapsToday = 0;
    game.dailyChallenges.prestigeToday = 0;
    saveGame();
  }
}

function getChallengeProgress(ch) {
  const dc = game.dailyChallenges;
  if (ch.type === 'buy-generators') return game.generators[ch.genId] || 0;
  if (ch.type === 'earn-plasma')    return game.totalPlasmaThisRun;
  if (ch.type === 'tap-count')      return dc.tapsToday || 0;
  if (ch.type === 'prestige')       return dc.prestigeToday || 0;
  return 0;
}

function applyDailyChallengeReward(ch) {
  if (ch.rewardType === 'plasma') {
    game.plasma += ch.rewardAmount;
    game.totalPlasmaThisRun += ch.rewardAmount;
    game.stats.totalPlasma += ch.rewardAmount;
  } else if (ch.rewardType === 'shards') {
    game.cosmicShards += ch.rewardAmount;
    game.totalShardsEarned += ch.rewardAmount;
  }
}

function checkChallengeCompletion() {
  const dc = game.dailyChallenges;
  if (!dc || !dc.challenges) return;
  dc.challenges.forEach(ch => {
    if (dc.completed.includes(ch.id)) return;
    if (getChallengeProgress(ch) >= ch.target) {
      dc.completed.push(ch.id);
      applyDailyChallengeReward(ch);
      showToast('✅ Challenge done: ' + ch.label + ' → ' + ch.rewardLabel);
      updateDailyChallengesUI();
      saveGame();
    }
  });
}

function updateDailyChallengesUI() {
  const container = document.getElementById('daily-challenges-list');
  if (!container) return;
  const dc = game.dailyChallenges;
  if (!dc || !dc.challenges || dc.challenges.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:12px 0">No challenges today.</p>';
    return;
  }
  const dateEl = document.getElementById('daily-challenges-date');
  if (dateEl) dateEl.textContent = 'Resets at midnight · ' + (dc.date || '');
  container.innerHTML = dc.challenges.map(ch => {
    const done = dc.completed.includes(ch.id);
    const prog = Math.min(getChallengeProgress(ch), ch.target);
    const pct  = Math.floor((prog / ch.target) * 100);
    return `<div class="challenge-card${done ? ' completed' : ''}">
      <span class="challenge-check">${done ? '✅' : '🔲'}</span>
      <div class="challenge-info">
        <div class="challenge-label">${ch.label}</div>
        <div class="challenge-progress-text">${fmt(prog)} / ${fmt(ch.target)}</div>
        <div class="challenge-bar-wrap"><div class="challenge-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="challenge-reward">${ch.rewardLabel}</div>
    </div>`;
  }).join('');
}

function openDailyChallengesModal() {
  initAudio();
  playSound('click');
  updateDailyChallengesUI();
  document.getElementById('daily-challenges-modal').classList.add('active');
}

// ═══════════════════════════════════════════════
// ─── TUTORIAL / ONBOARDING ───
// ═══════════════════════════════════════════════
const TUTORIAL_STEPS = [
  { targetId: 'plasma-click-btn', text: 'Tap the orb to generate Plasma Energy!', arrow: 'up' },
  { targetId: 'gen-btn-spark',    text: 'Buy a Spark generator — tap more to earn plasma first if it\'s grayed out!', arrow: 'right' },
  { targetId: 'tab-btn-upgrades', text: 'Open Upgrades to boost your tap power and generators.', arrow: 'down' },
  { targetId: 'tab-btn-prestige', text: 'Prestige resets your run but earns permanent Cosmic Shards!', arrow: 'down' },
];

function initTutorial() {
  if (localStorage.getItem('cosmicPlasma_tutorialDone')) return;
  const modal = document.getElementById('daily-login-modal');
  if (modal && modal.classList.contains('active')) {
    const observer = new MutationObserver(() => {
      if (!modal.classList.contains('active')) {
        observer.disconnect();
        setTimeout(startTutorial, 400);
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  } else {
    startTutorial();
  }
}

function startTutorial() {
  tutorialActive = true;
  tutorialStep = 0;
  document.getElementById('tutorial-overlay').style.display = 'block';
  renderTutorialStep(0);
}

function renderTutorialStep(n) {
  const step = TUTORIAL_STEPS[n];
  const target = document.getElementById(step.targetId);
  if (!target) { advanceTutorial(); return; }

  const rect = target.getBoundingClientRect();
  const pad  = 10;
  const hbox = document.getElementById('tutorial-highlight');
  const tip  = document.getElementById('tutorial-tip');
  const txt  = document.getElementById('tutorial-text');

  hbox.style.left   = (rect.left - pad) + 'px';
  hbox.style.top    = (rect.top  - pad) + 'px';
  hbox.style.width  = (rect.width  + pad * 2) + 'px';
  hbox.style.height = (rect.height + pad * 2) + 'px';

  txt.textContent = step.text;

  // Position tooltip above or below target
  const tipH = 110;
  const margin = 16;
  if (rect.top > tipH + margin) {
    tip.style.top    = (rect.top - pad - tipH - 8) + 'px';
  } else {
    tip.style.top    = (rect.bottom + pad + 8) + 'px';
  }
  tip.style.left = Math.max(margin, Math.min(rect.left - 20, window.innerWidth - 260 - margin)) + 'px';

  document.getElementById('tutorial-step-num').textContent = (n + 1) + ' / ' + TUTORIAL_STEPS.length;
}

function advanceTutorial() {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL_STEPS.length) {
    endTutorial();
  } else {
    requestAnimationFrame(() => renderTutorialStep(tutorialStep));
  }
}

function endTutorial() {
  tutorialActive = false;
  document.getElementById('tutorial-overlay').style.display = 'none';
  localStorage.setItem('cosmicPlasma_tutorialDone', '1');
  showToast('🚀 Tutorial complete! Good luck, Commander.');
}

function skipTutorial() {
  endTutorial();
}

function init() {
  loadGame();
  checkAndRefreshDailyChallenges();
  renderAll();
  setTimeout(checkDailyLogin, 600);
  setTimeout(initTutorial, 1400);
  requestAnimationFrame(tick);
  setInterval(saveGame, 30000);
  setInterval(checkAchievements, 1000);
}
init();

// ─── Particle System ───
(function () {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mkParticle(fromBottom) {
    return {
      x: Math.random() * canvas.width,
      y: fromBottom ? canvas.height + 5 : Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -(Math.random() * 0.45 + 0.1),
      alpha: Math.random() * 0.55 + 0.1,
      fade: Math.random() * 0.0008 + 0.0003,
      purple: Math.random() > 0.5
    };
  }

  resize();
  window.addEventListener('resize', resize);
  for (var i = 0; i < 75; i++) particles.push(mkParticle(false));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = particles.length - 1; j >= 0; j--) {
      var p = particles[j];
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= p.fade;
      if (p.alpha <= 0 || p.y < -5) {
        particles[j] = mkParticle(true);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.purple
          ? 'rgba(168,85,247,' + p.alpha + ')'
          : 'rgba(34,211,238,' + p.alpha + ')';
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();