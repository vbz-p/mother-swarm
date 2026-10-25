// Multi-run playtest for the Mother Swarm run prototype.
// Plays several runs back to back, buying upgrades between runs, and prints one line per run.
// Usage: node tools/runtest.js <run.html> [runs=5] [speed=6] [policy=good|average] [config-overrides.json]
const { chromium } = require('playwright');
const path = require('path');
const [file, runsArg = '5', speedArg = '6', policy = 'good', ovArg = '{}'] = process.argv.slice(2);

function bot(policy) {
  const r = window.__run, good = policy === 'good';
  let goal = null, retarget = 0, lastT = 0, run = null;
  setInterval(() => {
    const R = r.R; if (!R || R.phase !== 'play') return;
    if (R !== run) { run = R; goal = null; retarget = 0; lastT = 0; }   // new run: forget old targets
    const dt = R.t - lastT; lastT = R.t; retarget -= dt;
    const c = r.centroid();
    if (!goal || !goal.alive || (good && retarget <= 0)) {
      // prefer unstable deposits (chains) and anything the swarm can crack; avoid hopeless targets
      const power = r.n + 6 * r.R.foremenMade;
      let best = null, bs = -1e9;
      for (const d of r.deps) { if (!d.alive) continue;
        const dist = Math.hypot(d.x - c.x, d.y - c.y), grains = d.grains.length / 2;
        const crackTime = d.hp / Math.max(1, power * 0.5);
        const sc = (d.kind === 'unstable' ? 60 : 0) + grains / (1 + crackTime) * 4 - dist * (good ? 1 : 1.6);
        if (sc > bs) { bs = sc; best = d; } }
      goal = best; retarget = good ? 1 : 2.5;
    }
    if (goal) { const j = good ? 0 : 4; r.steer(goal.x + (Math.random() - .5) * j, goal.y + (Math.random() - .5) * j); }
    if (R.pulseCD <= 0 && r.n > 20) {
      // pulse when it would hit something worth it
      const rad = r.CONFIG.pulse.radius; let hits = 0;
      for (const d of r.deps) if (d.alive && Math.hypot(d.x - c.x, d.y - c.y) < rad + d.r) hits += d.kind === 'unstable' ? 3 : 1;
      if (hits >= (good ? 3 : 1)) r.pulse();
    }
  }, 50);
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 } });
  await ctx.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', 1); localStorage.clear(); } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(file)); await p.waitForFunction(() => window.__run);
  await p.evaluate(o => { const C = window.__run.CONFIG; for (const k in o) { if (typeof o[k] === 'object' && !Array.isArray(o[k])) for (const j in o[k]) { if (typeof o[k][j] === 'object' && !Array.isArray(o[k][j])) Object.assign(C[k][j], o[k][j]); else C[k][j] = o[k][j]; } else C[k] = o[k]; } }, JSON.parse(ovArg));
  await p.evaluate(bot, policy);
  for (let run = 1; run <= +runsArg; run++) {
    await p.evaluate(sp => { window.__run.begin(); window.__runSpeed = sp; }, +speedArg);
    let s;
    for (;;) { await p.waitForTimeout(1000); s = await p.evaluate(() => { const r = window.__run, R = r.R; return { phase: R.phase, t: R.t, pct: r.pct(), peak: R.peakMass, F: R.foremenMade, C: R.coordsMade, bp: R.bpGain, empty: R.empty, meta: r.meta }; }); if (s.phase === 'done') break; }
    // buy upgrades: cheapest first, as a player would
    const bought = await p.evaluate(() => { const r = window.__run, out = []; for (;;) { const ups = r.CONFIG.upgrades.filter(u => (r.meta.up[u.id] || 0) < u.max).sort((a, b) => r.upCost(a.id) - r.upCost(b.id)); if (!ups.length || !r.buy(ups[0].id)) break; out.push(ups[0].id); } return out; });
    const mm = Math.floor(s.t / 60) + ':' + String(Math.floor(s.t % 60)).padStart(2, '0');
    console.log(`run ${run}: ${mm}  consumed ${s.pct.toFixed(0).padStart(3)}%${s.empty ? ' (empty)' : ''}  peak mass ${s.peak}  foremen ${s.F}  coords ${s.C}  +${s.bp} bp  bought [${bought.join(', ')}]`);
  }
  if (errs.length) console.log('errors', errs.slice(0, 3));
  await b.close();
})();
