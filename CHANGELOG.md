# Cosmic Plasma — Changelog

## [Unreleased] — Balance Pass & Code Cleanup

### Game Balance
- **Tap upgrades rebalanced** — now double each tier: ×2 → ×4 → ×8 → ×16
- **New upgrade: Nova Strike** — 4th tap tier, ×16 power at 5,000 total taps
- **Generator upgrades buffed** — scaled by tier (early ×8–×10, mid ×10–×12, late ×15–×20, up from flat ×3)
- **Quantum Touch buffed** — now gives 3% of /sec per tap (was 1%), cost adjusted to 300M plasma
- **Global multipliers rebalanced** — now ×4 → ×8 → ×15 (was ×2 → ×3 → ×5), with higher plasma gates

### Under the Hood
- Extracted repeated shard bonus formula into `getShardBonus()` helper
- CSS formatting cleaned up — expanded single-line keyframe rules for readability

---

## [1.1] — edfa3c6

### Bug Fixes
- Fixed leaderboard display and player rank highlighting
- Improved podium slot and avatar styling for top 3 players

---

## [1.0] — c55cc11 — Initial Release

### Features
- 10 generators unlocking progressively: Spark → Singularity
- Tap power upgrade chain and per-generator multiplier upgrades
- Global multiplier upgrades (Cosmic Resonance, Dimensional Flux, Infinite Echo)
- Prestige system with Cosmic Shards that carry over and boost all output
- Shard upgrade tree for permanent bonuses (generator output, tap power, prestige gains)
- Global leaderboard with podium display and live rank tracking
- Dark space theme with animated plasma orb, pulse rings, and floating tap particles
- Tab navigation: Generators, Upgrades, Prestige, Stats
- Android WebView wrapper with full-screen layout
