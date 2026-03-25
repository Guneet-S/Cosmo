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
const UPGRADE_DEFS = [
  { id: 'click1', name: 'Focused Tap',      icon: '👆', desc: 'Click power x2',              cost: 100,    effect: () => { game.clickMultiplier *= 2; },           req: () => game.stats.totalClicks >= 10   },
  { id: 'click2', name: 'Charged Fingers',  icon: '⚡', desc: 'Click power x3',              cost: 5000,   effect: () => { game.clickMultiplier *= 3; },           req: () => game.stats.totalClicks >= 100  },
  { id: 'click3', name: 'Plasma Fist',      icon: '👊', desc: 'Click power x5',              cost: 500000, effect: () => { game.clickMultiplier *= 5; },           req: () => game.stats.totalClicks >= 500  },
  { id: 'gen1',   name: 'Spark Overcharge', icon: '✦',  desc: 'Sparks produce 5x',           cost: 500,    effect: () => { game.genMultipliers.spark  *= 5; },     req: () => getGenCount('spark')  >= 10    },
  { id: 'gen2',   name: 'Ember Catalyst',   icon: '🔥', desc: 'Embers produce 3x',           cost: 6000,   effect: () => { game.genMultipliers.ember  *= 3; },     req: () => getGenCount('ember')  >= 10    },
  { id: 'gen3',   name: 'Flare Amplifier',  icon: '☀️', desc: 'Solar Flares produce 3x',     cost: 70000,  effect: () => { game.genMultipliers.flare  *= 3; },     req: () => getGenCount('flare')  >= 10    },
  { id: 'gen4',   name: 'Arc Intensifier',  icon: '⚡', desc: 'Plasma Arcs produce 3x',      cost: 900000, effect: () => { game.genMultipliers.arc    *= 3; },     req: () => getGenCount('arc')    >= 10    },
  { id: 'gen5',   name: 'Fusion Optimizer', icon: '🌀', desc: 'Fusion Cores produce 3x',     cost: 1.2e7,  effect: () => { game.genMultipliers.fusion *= 3; },     req: () => getGenCount('fusion') >= 10    },
  { id: 'gen6',   name: 'Nova Capacitor',   icon: '💥', desc: 'Nova Bursts produce 3x',      cost: 1.8e8,  effect: () => { game.genMultipliers.nova   *= 3; },     req: () => getGenCount('nova')   >= 10    },
  { id: 'gen7',   name: 'Pulsar Regulator', icon: '🌟', desc: 'Pulsar Engines produce 3x',   cost: 2.8e9,  effect: () => { game.genMultipliers.pulsar *= 3; },     req: () => getGenCount('pulsar') >= 10    },
  { id: 'gen8',   name: 'Quasar Condenser', icon: '🌌', desc: 'Quasars produce 3x',          cost: 4.5e10, effect: () => { game.genMultipliers.quasar *= 3; },     req: () => getGenCount('quasar') >= 10    },
  { id: 'all1',   name: 'Cosmic Resonance', icon: '🪐', desc: 'All generators produce 2x',   cost: 1e7,    effect: () => { game.globalGenMultiplier   *= 2; },     req: () => game.stats.totalPlasma >= 5e6  },
  { id: 'all2',   name: 'Dimensional Flux', icon: '🌊', desc: 'All generators produce 3x',   cost: 1e9,    effect: () => { game.globalGenMultiplier   *= 3; },     req: () => game.stats.totalPlasma >= 5e8  },
  { id: 'all3',   name: 'Infinite Echo',    icon: '♾️', desc: 'All generators produce 5x',   cost: 1e12,   effect: () => { game.globalGenMultiplier   *= 5; },     req: () => game.stats.totalPlasma >= 5e11 },
  { id: 'click4', name: 'Quantum Touch',    icon: '🫴', desc: 'Clicks give 1% of your /sec', cost: 1e8,    effect: () => { game.clickPercentOfRate = 0.01; },      req: () => game.stats.totalClicks >= 2000 },
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
    stats: {
      totalPlasma: 0,
      totalClicks: 0,
      clickPlasma: 0,
      autoPlasma: 0,
      genPlasma: 0,
      startTime: Date.now(),
      playerName: 'Citizen_' + Math.floor(1000 + Math.random() * 9000),
    },
    leaderboard: [],
  };
}

let game = createFreshState();
let lastTickTime = Date.now();
let lastUIUpdateTime = 0;

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
function getGenOutput(def) {
  const shardGenMult = getShardEffect('shardGen');
  const shardBonus = 1 + game.cosmicShards * 0.05;
  return def.baseOutput * (game.genMultipliers[def.id] || 1) * game.globalGenMultiplier * shardBonus * shardGenMult;
}
function getTotalRate() {
  let rate = 0;
  GENERATOR_DEFS.forEach(def => { rate += getGenOutput(def) * game.generators[def.id]; });
  return rate;
}
function getClickPower() {
  const shardClickMult = getShardEffect('shardClick');
  let base = game.clickMultiplier * shardClickMult;
  const shardBonus = 1 + game.cosmicShards * 0.05;
  base *= shardBonus;
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

// ─── Click Handler ───
function handleClick(e) {
  initAudio();
  playSound('click');
  const power = getClickPower();
  game.plasma += power;
  game.totalPlasmaThisRun += power;
  game.stats.totalPlasma += power;
  game.stats.totalClicks++;
  game.stats.clickPlasma += power;

  if (Math.random() < 0.3) spawnClickText(power); // Throttle click text

  updateUI();
}

function spawnClickText(amount) {
  const btn = document.getElementById('plasma-click-btn');
  const rect = btn.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'click-float';
  el.textContent = '+' + fmt(amount);
  el.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
  el.style.top = (rect.top - 5) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ─── Game Mechanics ───
function buyGenerator(id) {
  const def = GENERATOR_DEFS.find(g => g.id === id);
  const cost = getGenCost(def);
  if (game.plasma >= cost) {
    playSound('buy');
    game.plasma -= cost;
    game.generators[def.id]++;
    updateUI();
  }
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
    `Prestige for ${fmt(shardsEarned)} Cosmic Shards? All generators, upgrades, and plasma will reset.`,
    function() {
      playSound('buy');

      const flash = document.createElement('div');
      flash.className = 'prestige-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1100);

      const shards = game.cosmicShards + shardsEarned;
      const totalShards = game.totalShardsEarned + shardsEarned;
      const pCount = game.prestigeCount + 1;
      const shardUpgs = { ...game.shardUpgrades };
      const stats = { ...game.stats };
      const lb = game.leaderboard || [];

      game = createFreshState();
      game.cosmicShards = shards;
      game.totalShardsEarned = totalShards;
      game.prestigeCount = pCount;
      game.shardUpgrades = shardUpgs;
      game.stats = stats;
      game.leaderboard = lb;

      if (window.Android && window.Android.pushScore) {
          var myPlayerId = 'player_' + game.stats.playerName.replace(/[^a-zA-Z0-9]/g, '') + '_' + game.stats.startTime;
          window.Android.pushScore(myPlayerId, game.stats.playerName, game.stats.totalPlasma);
      }

      const headStart = getShardEffect('shardStart');
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
}

function openLeaderboard() {
  initAudio();
  playSound('click');
  switchTab('leaderboard');
  renderLeaderboard();
}

const lbNames = ["CosmicW", "StarDust", "NovaKng", "PlasmaX", "VoidWlk", "AstroN", "Nebula9", "Qasar11", "GamerX", "Zenith", "OrbitG", "Pulse88", "Singlrty", "Apollo", "Drifter", "Pulsar", "Quantum", "GravityX", "Tachyon", "WarpSpd"];
function initLeaderboardData() {
    if (!game.leaderboard) game.leaderboard = [];
    
    // Check if existing data is valid (has rate property for live scoring)
    var hasValidBots = game.leaderboard.length > 0 && game.leaderboard[0].rate !== undefined;
    if (hasValidBots) return;
    
    // Force regenerate local bots
    game.leaderboard = [];
    for (var i = 1; i <= 100; i++) {
        var name = lbNames[Math.floor(Math.random() * lbNames.length)] + Math.floor(Math.random() * 999);
        var x = (100 - i) / 99;
        var exp = 3 + (x * 19);
        var baseScore = Math.pow(10, exp);
        var rate = baseScore / 43200;
        
        game.leaderboard.push({
            id: 'bot_' + i,
            name: name.substring(0, 10),
            initial: name.charAt(0).toUpperCase(),
            score: baseScore,
            rate: rate,
            isPlayer: false
        });
    }
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
                game.leaderboard.push({
                    id: 'fb_' + i,
                    name: entry.name || 'Unknown',
                    initial: (entry.name && entry.name.length > 0) ? entry.name.charAt(0).toUpperCase() : '?',
                    score: entry.score || 0,
                    rate: 0, // real players don't auto-grow
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
    const myScore = game.stats.totalPlasma;
    
    let pName = game.stats.playerName || 'Citizen_0000';
    let pool = [...game.leaderboard, {
        id: 'player',
        name: pName,
        initial: pName.charAt(0).toUpperCase(),
        score: myScore,
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
        
        if (lbViewMode === 'top') {
            podiumEl.style.display = 'flex';
            podiumEl.innerHTML = `
                <div class="podium-slot rank-2 ${pool[1].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[1].initial}</div>
                    <div class="podium-name">${pool[1].name}</div>
                    <div class="podium-score" id="podium-score-2">${fmt(pool[1].score)}</div>
                </div>
                <div class="podium-slot rank-1 ${pool[0].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[0].initial}</div>
                    <div class="podium-name">${pool[0].name}</div>
                    <div class="podium-score" id="podium-score-1">${fmt(pool[0].score)}</div>
                </div>
                <div class="podium-slot rank-3 ${pool[2].isPlayer ? 'is-player' : ''}">
                    <div class="podium-avatar">${pool[2].initial}</div>
                    <div class="podium-name">${pool[2].name}</div>
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
                <div class="lb-name">${pool[i].name}</div>
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
                    <span class="lb-footer-name" id="lb-footer-name"></span>
                    <span class="lb-edit-icon" onclick="openNameModal(false)">✏️</span>
                </div>
                <div class="lb-footer-score" id="lb-footer-score"></div>
                <div class="lb-footer-action">
                    <button class="lb-locate-btn" id="lb-locate-btn" onclick="toggleLeaderboardView()"></button>
                </div>
            </div>
        `;
    }
    
    document.getElementById('lb-footer-rank').textContent = `#${myRank > 100 ? '100+' : myRank}`;
    document.getElementById('lb-footer-name').textContent = pName;
    document.getElementById('lb-footer-score').textContent = fmt(myScore);
    
    const btn = document.getElementById('lb-locate-btn');
    if (lbViewMode === 'top') {
        btn.innerHTML = '⌖';
        btn.className = 'lb-locate-btn top';
    } else {
        btn.innerHTML = '⇈';
        btn.className = 'lb-locate-btn local';
    }
}

function switchLbTab(type, e) {
    document.querySelectorAll('.lb-toggle-btn').forEach(b => b.classList.remove('active'));
    if(e && e.target) e.target.classList.add('active');
    playSound('click');
    document.getElementById('lb-podium').innerHTML = '';
    document.getElementById('lb-list').innerHTML = '';
    renderLeaderboard();
}

function initGeneratorsUI() {
  const container = document.getElementById('generators-list');
  container.innerHTML = '';
  GENERATOR_DEFS.forEach(def => {
    const card = document.createElement('div');
    card.id = `gen-card-${def.id}`;
    card.className = 'generator-card';
    card.innerHTML = `<div class="gen-icon">${def.icon}</div><div class="gen-info"><div class="gen-name" id="gen-name-${def.id}"></div><div class="gen-details" id="gen-det-${def.id}"></div><div class="gen-output" id="gen-out-${def.id}"></div></div><div class="gen-buy-section"><span class="gen-count" id="gen-cnt-${def.id}"></span><button id="gen-btn-${def.id}" class="gen-buy-btn" onclick="buyGenerator('${def.id}')" oncontextmenu="buyMaxGenerator('${def.id}'); return false;"></button></div>`;
    container.appendChild(card);
  });
}

function updateGeneratorsUI() {
  GENERATOR_DEFS.forEach(def => {
    const isLocked = game.stats.totalPlasma < def.unlockAt && game.generators[def.id] === 0;
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

function updateUpgradesUI() {
  UPGRADE_DEFS.forEach(def => {
    const card = document.getElementById(`upg-card-${def.id}`);
    if (!card) return;
    const owned = game.upgrades.includes(def.id);
    const visible = owned || def.req();
    
    if (!visible) {
      card.style.display = 'none';
    } else {
      card.style.display = 'flex';
      card.className = 'upgrade-card' + (owned ? ' purchased' : '');
      const action = document.getElementById(`upg-action-${def.id}`);
      if (owned) {
        if (!action.querySelector('span')) {
            action.innerHTML = '<span style="color:var(--accent-green);font-family:var(--font-display);font-size:0.7rem;">OWNED</span>';
        }
      } else {
        if (!action.querySelector('button')) {
            action.innerHTML = `<button id="upg-btn-${def.id}" class="upg-buy-btn" onclick="buyUpgrade('${def.id}')"></button>`;
        }
        const btn = document.getElementById(`upg-btn-${def.id}`);
        btn.disabled = game.plasma < def.cost;
        btn.textContent = fmt(def.cost);
      }
    }
  });
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
  document.getElementById('click-power-display').textContent = fmt(getClickPower());
  document.getElementById('shard-count').textContent = fmt(game.cosmicShards);
  document.getElementById('prestige-level').textContent = game.prestigeCount;

  const totalMult = (1 + game.cosmicShards * 0.05) * game.globalGenMultiplier * getShardEffect('shardGen');
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
    const newMult = (1 + newShards * 0.05) * game.globalGenMultiplier * getShardEffect('shardGen');
    newMultEl.textContent = 'x' + newMult.toFixed(2);
  }
  const prestigeBtn = document.getElementById('prestige-btn');
  if (prestigeBtn) prestigeBtn.disabled = shardsOnPrestige <= 0;

  // Stats
  document.getElementById('stat-total-plasma').textContent = fmt(game.stats.totalPlasma);
  document.getElementById('stat-total-clicks').textContent = fmt(game.stats.totalClicks);
  document.getElementById('stat-click-plasma').textContent = fmt(game.stats.clickPlasma);
  document.getElementById('stat-auto-plasma').textContent = fmt(game.stats.autoPlasma || 0);
  document.getElementById('stat-gen-plasma').textContent = fmt(game.stats.genPlasma);
  document.getElementById('stat-prestiges').textContent = game.prestigeCount;
  document.getElementById('stat-total-shards').textContent = fmt(game.totalShardsEarned);
  document.getElementById('stat-multiplier').textContent = 'x' + totalMult.toFixed(2);

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
      game.leaderboard.forEach(b => { if (b.rate) b.score += b.rate * dt; });
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
    stats: game.stats,
    leaderboard: game.leaderboard,
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

    // Compute offline production
    if (data.savedAt) {
      const offlineSec = (Date.now() - data.savedAt) / 1000;
      if (offlineSec > 5) {
        const offlineRate = getTotalRate();
        const offlineGain = offlineRate * Math.min(offlineSec, 28800); // cap at 8h
        if (offlineGain > 0) {
          game.plasma += offlineGain;
          game.totalPlasmaThisRun += offlineGain;
          game.stats.totalPlasma += offlineGain;
          game.stats.genPlasma += offlineGain;
          showToast(`⏰ Offline for ${Math.floor(offlineSec / 60)}m — earned ${fmt(offlineGain)} plasma!`);
        }
      }
      if (game.leaderboard && game.leaderboard.length > 0) {
          game.leaderboard.forEach(b => { if (b.rate) b.score += b.rate * offlineSec; });
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

function init() {
  loadGame();
  renderAll();
  requestAnimationFrame(tick);
  setInterval(saveGame, 30000);
}
init();
