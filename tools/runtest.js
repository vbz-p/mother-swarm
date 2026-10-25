// Multi-run playtest for the Mother Swarm run game.
// Plays runs back to back: steers, dodges spotlights, ends a run when it stops making progress,
// buys skill-tree nodes between runs and picks evolutions when a sample is cleared. One line per run.
// Usage: node tools/runtest.js <game.html> [runs=10] [speed=6] [policy=good|average]
const { chromium } = require('playwright');
const path = require('path');
const [file, runsArg = '10', speedArg = '6', policy = 'good'] = process.argv.slice(2);

function bot(policy) {
  const r = window.__run, good = policy === 'good';
  let goal = null, retarget = 0, lastT = 0, run = null, bestPct = 0, stallT = 0;
  setInterval(() => {
    const R = r.R; if (!R || R.phase !== 'play') return;
    if (R !== run) { run = R; goal = null; retarget = 0; lastT = 0; bestPct = r.pct(); stallT = 0; }
    const dt = R.t - lastT; lastT = R.t; retarget -= dt;
    const c = r.centroid();
    // give up when nothing has been gained for a while (a player would press END RUN)
    const p = r.pct(); if (p > bestPct + 0.2) { bestPct = p; stallT = 0; } else stallT += dt;
    if (stallT > (good ? 20 : 30)) { r.endNow(); return; }
    if (!goal || !goal.alive || (good && retarget <= 0)) {
      const power = r.n + 6 * R.foremenMade;
      let best = null, bs = -1e9;
      for (const d of r.deps) { if (!d.alive) continue;
        const dist = Math.hypot(d.x - c.x, d.y - c.y), grains = d.grains.length / 2;
        const crackTime = d.hp / Math.max(1, power * 0.5);
        const sc = (d.kind === 'unstable' && r.evo('chain') ? 60 : 0) + grains / (1 + crackTime) * 4 - dist * (good ? 1 : 1.6);
        if (sc > bs) { bs = sc; best = d; } }
      goal = best; retarget = good ? 1 : 2.5;
    }
    let t = goal ? { x: goal.x, y: goal.y } : c;
    // step off a telegraphed spotlight path (the average player reacts late and only sometimes)
    const b = R.beam;
    if (b && (good || Math.random() < 0.5)) {
      const rx = c.x - b.ox, ry = c.y - b.oy, along = rx * b.dx + ry * b.dy, across = -rx * b.dy + ry * b.dx;
      const ahead = along > b.s - b.r - 6, near = Math.abs(across) < b.r + (good ? 16 : 8);
      if (ahead && near && (good || b.warn <= 0.6)) { const side = across >= 0 ? 1 : -1, push = b.r + 26; t = { x: c.x - b.dy * side * push, y: c.y + b.dx * side * push }; }
    }
    const j = good ? 0 : 4; r.steer(t.x + (Math.random() - .5) * j, t.y + (Math.random() - .5) * j);
    if (r.evo('pulse') && R.pulseCD <= 0 && r.n > 20 && R.O < (good ? 75 : 90)) {
      const rad = r.CONFIG.pulse.radius; let hits = 0;
      for (const d of r.deps) if (d.alive && Math.hypot(d.x - c.x, d.y - c.y) < rad + d.r) hits += d.kind === 'unstable' ? 3 : 1;
      if (hits >= (good ? 4 : 2)) r.pulse();
    }
  }, 50);
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 } });
  await ctx.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', 1); localStorage.clear(); } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(file)); await p.waitForFunction(() => window.__run);
  await p.evaluate(bot, policy);
  for (let run = 1; run <= +runsArg; run++) {
    const sample = await p.evaluate(sp => { window.__run.begin(); window.__runSpeed = sp; return window.__run.meta.dish; }, +speedArg);
    let s;
    for (;;) { await p.waitForTimeout(1000); s = await p.evaluate(() => { const r = window.__run, R = r.R; return { phase: R.phase, t: R.t, pct: r.pct(), start: R.pctStart, peak: R.peakMass, F: R.foremenMade, C: R.coordsMade, bp: R.bpGain, cause: R.cause, cleared: R.cleared, burned: R.burned || 0 }; }); if (s.phase === 'done') break; }
    let picked = '';
    if (s.cleared) picked = await p.evaluate(() => { const r = window.__run; for (const id of ['foreman', 'chain', 'pulse', 'coord', 'gut', 'cold']) { const e = r.CONFIG.evolutions.find(v => v.id === id); if (!r.evo(id) && (!e.req || r.evo(e.req))) { r.chooseEvo(id); return id; } } return ''; });
    // spend biomass in the skill tree: cheapest available node first
    const bought = await p.evaluate(() => { const r = window.__run, out = []; for (;;) {
      const open = r.nodes().filter(id => id !== 'root').map(id => ({ id, st: r.nodeState(id) })).filter(o => o.st.open && !o.st.max && o.st.afford).sort((a, b) => a.st.cost - b.st.cost);
      if (!open.length || !r.buyNode(open[0].id)) break; out.push(open[0].id); } return out; });
    const bio = await p.evaluate(() => window.__run.meta.bio);
    const mm = Math.floor(s.t / 60) + ':' + String(Math.floor(s.t % 60)).padStart(2, '0');
    const counts = {}; for (const id of bought) counts[id] = (counts[id] || 0) + 1;
    console.log(`run ${String(run).padStart(2)}  sample ${sample}  ate ${s.pct.toFixed(0).padStart(3)}%  ${mm}  ${s.cause.padEnd(7)} burned ${String(s.burned).padStart(3)}  peak ${s.peak}  F ${s.F} C ${s.C}  +${s.bp} bio (left ${bio})  ${picked ? 'EVOLVED ' + picked + '  ' : ''}bought ${Object.entries(counts).map(([k, v]) => k + (v > 1 ? '×' + v : '')).join(' ') || '-'}`);
  }
  if (errs.length) console.log('errors', errs.slice(0, 3));
  await b.close();
})();
