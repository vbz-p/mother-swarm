// Automated playtest for Mother Swarm zone 1.
// Plays the real game in headless Chromium with a scripted player and prints a milestone timeline.
//
// Usage: node tools/playtest.js <game.html> <policy> [speed] [overrides.json]
//   policy: good | average | casual | reckless
//   speed:  game clock multiplier (default 10)
//   overrides: JSON like {"B": {"obsK": 0.2}, "MATTER": {"eat": 4}} applied before play
// Needs the `playwright` package (NODE_PATH to a global install works).
const { chromium } = require('playwright');
const path = require('path');

const [file, policy = 'good', speedArg = '10', overridesArg = '{}'] = process.argv.slice(2);
const SPEED = +speedArg, LIMIT_MIN = 60;

// Runs inside the page. Ticks on game time, so the result does not depend on the clock speed.
function bot(policy) {
  const ms = window.__ms, A = ms.act;
  const out = { ev: {}, ySum: 0, yN: 0, dorm: 0, beamHits: 0, done: false };
  window.__playtest = out;
  const mark = k => { if (!(k in out.ev)) out.ev[k] = Math.round(ms.S.t); };
  const good = policy === 'good', reckless = policy === 'reckless';
  const VAL = { speck: 1, crystal: 0.75, bloom: 1.5, cell: good ? 2 : 1.3 };
  let lastT = 0, tapAcc = 0, goal = null, noise = { x: 0, y: 0 }, retargetT = 0;

  function textPhase(S, dt) {
    const T = S.tx, f = S.flags;
    tapAcc += 3 * dt;                                  // a person taps about 3 times a second
    while (tapAcc >= 1) { tapAcc -= 1; A.harvestTap(); }
    if (f.s_scan && !T.signals.length && T.cdS <= 0) A.scan();
    if (T.signals.length && !T.seek) {
      const best = [...T.signals].sort((a, b) => (b.E / (b.dist + 2)) - (a.E / (a.dist + 2)))[0];
      A.seek(best.id);
    }
    if (f.s_d2 && T.cdL <= 0) A.listen();
    if (f.s_d3 && T.cdP <= 0 && T.probe < 4) A.probe();
    if (f.s_opt && ms.UPG[0].req()) { if (S.m >= ms.UPG[0].cost) A.buyUpgrade('optical'); return; }
    if (S.m >= ms.droneCost()) A.buildDrone();
  }

  function buy(S) {
    let saving = 0;
    const income = ms.rate;
    for (const u of ms.UPG) {
      if (S.up[u.id] || !u.show() || !u.req()) continue;
      if (S.m >= u.cost) { A.buyUpgrade(u.id); return; }
      if (u.cost <= S.m + income * 30) { saving = u.cost; break; }
    }
    const spare = S.m - saving;
    if (S.up.hc && S.F >= 5 && spare >= ms.coordCost()) { A.makeCoord(); return; }
    const needF = S.up.hc ? 5 : 3;
    if (S.up.rop && S.D >= 10 && spare >= ms.foremanCost() && (S.F < needF || ms.foremanCost() < spare * 0.3)) { A.makeForeman(); return; }
    if (spare >= ms.droneCost() && ms.droneCost() < spare * 0.25) A.buildDrone();
  }

  function pickGoal(c) {
    let best = null, bs = -1e9;
    for (const d of ms.deps) { const sc = VAL[d.kind] * 30 - Math.hypot(d.x - c.x, d.y - c.y); if (sc > bs) { bs = sc; best = d; } }
    return best;
  }

  function steer(S, dt) {
    const c = ms.cen;
    let t;
    if (S.breach) t = ms.crack();
    else if (ms.rival && (good || Math.hypot(ms.rival.x - c.x, ms.rival.y - c.y) < 60)) t = { x: ms.rival.x, y: ms.rival.y };
    else {
      retargetT -= dt;
      const stale = !goal || !ms.deps.includes(goal) || !goal.grains.length;
      if (stale && (good || retargetT <= 0)) {
        goal = pickGoal(c); retargetT = 1.5;
        noise = good ? { x: 0, y: 0 } : { x: (Math.random() - .5) * 10, y: (Math.random() - .5) * 10 };
      }
      if (!goal) return;
      t = { x: goal.x + noise.x, y: goal.y + noise.y };
    }
    // Good players step off a telegraphed spotlight path before it arrives.
    const sw = ms.sweep;
    if (good && sw) {
      const rx = c.x - sw.ox, ry = c.y - sw.oy, along = rx * sw.dx + ry * sw.dy, across = -rx * sw.dy + ry * sw.dx;
      const ahead = along > sw.s - sw.r - 4;
      if (ahead && Math.abs(across) < sw.r + 14) {
        const side = across >= 0 ? 1 : -1, push = sw.r + 22;
        t = { x: c.x - sw.dy * side * push, y: c.y + sw.dx * side * push };
      }
    }
    ms.steer(t.x, t.y);
  }

  function tick() {
    const S = ms.S, dt = Math.max(0, S.t - lastT); lastT = S.t;
    if (!document.getElementById('tip').hidden) A.tipOk();
    if (S.ended) { mark('end'); out.done = true; return; }
    if (S.up.optical) mark('optics'); if (S.everF) mark('foreman1'); if (S.meter) mark('meter');
    if (S.up.selfasm) mark('selfasm'); if (S.up.lattice) mark('lattice'); if (S.up.hc) mark('hc');
    if (S.everC) mark('coord1'); if (S.C >= 2) mark('coord2'); if (S.breach) mark('boreStart');
    if (S.rival === 'active') mark('rival'); if (S.rival === 'absorbed') mark('rivalAbsorbed');
    if (S.purges) mark('purge1');
    out.purges = S.purges; out.t = Math.round(S.t); out.m = Math.round(S.m); out.D = S.D; out.F = S.F; out.C = S.C;
    out.O = Math.round(S.O); out.bore = S.breach ? +S.breach.prog.toFixed(2) : 0;
    if (!S.up.optical) { textPhase(S, dt); return; }
    out.ySum += ms.E; out.yN++;
    // A casual player only glances at the meter every 15 seconds.
    const glance = policy !== 'casual' || S.t >= (out.nextGlance || 0) || S.dormant;
    if (policy === 'casual' && S.t >= (out.nextGlance || 0)) out.nextGlance = S.t + 15;
    if (!reckless && glance) {
      const hi = good ? 85 : policy === 'casual' ? 80 : 92, lo = good ? 40 : 30;
      if (!S.dormant && S.O >= hi) { A.toggleDormant(); out.dorm++; }
      else if (S.dormant && S.O <= lo && S.dormT >= 5) A.toggleDormant();
    }
    if (S.dormant) return;
    buy(S); steer(S, dt);
  }
  setInterval(tick, 50);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  await ctx.addInitScript(sp => { localStorage.clear(); localStorage.setItem('mother-swarm-z1-v2-prefs', JSON.stringify({ motion: false, text: 20, speed: sp })); }, SPEED);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(file));
  await page.waitForFunction(() => window.__ms);
  await page.evaluate(o => { const ms = window.__ms; for (const k in o) Object.assign(ms[k], o[k]); }, JSON.parse(overridesArg));
  await page.evaluate(bot, policy);
  const t0 = Date.now();
  let r;
  for (;;) {
    await page.waitForTimeout(2000);
    r = await page.evaluate(() => window.__playtest);
    if (r.done || r.t > LIMIT_MIN * 60 || Date.now() - t0 > 15 * 60e3) break;
  }
  const mm = s => s === undefined ? '  —  ' : `${String(Math.floor(s / 60)).padStart(2)}:${String(s % 60).padStart(2, '0')}`;
  const order = ['optics', 'foreman1', 'selfasm', 'meter', 'lattice', 'hc', 'coord1', 'rival', 'rivalAbsorbed', 'coord2', 'boreStart', 'purge1', 'end'];
  console.log(`policy=${policy}  ${r.done ? 'ESCAPED' : 'DID NOT ESCAPE'} at ${mm(r.t)}  purges=${r.purges}  dormant cycles=${r.dorm}  avg yield=${(r.ySum / Math.max(1, r.yN) * 100).toFixed(0)}%  final D/F/C=${r.D}/${r.F}/${r.C}  O=${r.O}  bore=${r.bore}`);
  console.log('  ' + order.map(k => `${k} ${mm(r.ev[k])}`).join(' | '));
  if (errors.length) console.log('  page errors:', errors.slice(0, 3));
  await browser.close();
})();
