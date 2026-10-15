"""Zone 1 sim v2: planner player that saves for the next upgrade. Usage: sim2.py '<json overrides>'"""
import math, sys, json
BASE = dict(
    drone_base=10, drone_growth=1.08, drone_rate=0.5, sup_mult=1.5, foreman_rate=5, span=10,
    foreman_drones=10, foreman_base=100, foreman_growth=2,
    coord_foremen=5, coord_base=1500, coord_growth=3, coord_mult=2,
    up=dict(optical=40, rop=60, selfasm=150, thermal=250, lattice=500, hc=1200, breach=15000),
    obs_k=0.08, wD=1, wF=10, wC=50, thermal_m=0.6, dorm_drain=3, dorm_min=5,
    purge=0.6, purge_reset=20, purge_matter=0.0, meter_at=30, autobuy_interval=2, selfasm_frac=1.0,
    text_E=0.5, tap_rate=2.0, horizon=30,
)
def run(P, E=0.8, dormant_at=85, wake_at=40, never_dormant=False, T=7200, dt=0.1):
    s=dict(m=0.0,D=0,F=0,C=0,O=0.0); up=set(); t=0; dorm=False; dt_d=0; purges=0; last_auto=-99; ev={}; harv=0
    U=P['up']
    dcost=lambda: P['drone_base']*P['drone_growth']**s['D']
    fcost=lambda: P['foreman_base']*P['foreman_growth']**s['F']
    ccost=lambda: P['coord_base']*P['coord_growth']**s['C']
    def rate():
        D,F,C=s['D'],s['F'],s['C']; S=min(D,P['span']*F); Un=D-S
        r=(1+P['drone_rate']*Un+P['drone_rate']*P['sup_mult']*S+P['foreman_rate']*F)*(2 if 'lattice' in up else 1)*P['coord_mult']**C
        return r*(E if 'optical' in up else P['text_E']) + (0 if 'optical' in up else P['tap_rate'])
    def obs_gain():
        return P['obs_k']*math.sqrt(P['wD']*s['D']+P['wF']*s['F']+P['wC']*s['C'])*(P['thermal_m'] if 'thermal' in up else 1)
    while t<T:
        if not dorm:
            r=rate(); s['m']+=r*dt; harv+=r*dt; s['O']+=obs_gain()*dt*(1 if ('selfasm' in up or not P.get('obs_after_selfasm')) else 0)
        else:
            s['O']=max(0,s['O']-P['dorm_drain']*dt); dt_d+=dt
            if dt_d>=P['dorm_min'] and s['O']<=wake_at: dorm=False
        if s['O']>=P['meter_at']: ev.setdefault('meter',t)
        if s['O']>=100:
            s['D']=int(s['D']*(1-P['purge'])); s['m']*=1-P['purge_matter']; s['O']=P['purge_reset']; purges+=1
        if not never_dormant and not dorm and 'meter' in ev and s['O']>=dormant_at: dorm=True; dt_d=0
        if dorm: t+=dt; continue
        reqs=[('optical',s['D']>=3),('rop',s['D']>=10),('selfasm','rop' in up),('thermal','meter' in ev),
              ('lattice',s['F']>=1),('hc',s['F']>=3),('breach',s['C']>=1)]
        goal=None
        for k,ok in reqs:
            if k in up: continue
            if ok and s['m']>=U[k]: s['m']-=U[k]; up.add(k); ev[k]=t; continue
            if ok and goal is None: goal=k
        if 'breach' in up: break
        r=rate(); reserve = U[goal] if goal and U[goal] <= s['m']+r*P['horizon'] else 0
        spend=s['m']-reserve
        if 'hc' in up and s['F']>=P['coord_foremen'] and spend>=ccost():
            s['m']-=ccost(); s['F']-=P['coord_foremen']; s['C']+=1; ev.setdefault('coord',t)
        elif 'rop' in up and s['D']-P['span']*s['F']>=P['foreman_drones'] and spend>=fcost() and not (s['C']>=1 and goal=='breach' and reserve==0 and False):
            s['m']-=fcost(); s['D']-=P['foreman_drones']; s['F']+=1; ev.setdefault('foreman',t)
        elif 'selfasm' not in up and spend>=dcost():
            s['m']-=dcost(); s['D']+=1
        if 'selfasm' in up and t-last_auto>=P['autobuy_interval'] and dcost()<=P['selfasm_frac']*s['m'] and s['m']>=dcost():
            s['m']-=dcost(); s['D']+=1; last_auto=t
        t+=dt
    return dict(ev=ev,t=t if 'breach' in up else None,purges=purges,harv=harv,**{k:s[k] for k in 'DFC'})
def fmt(r):
    e=r['ev']; g=lambda k: f"{e[k]/60:5.1f}" if k in e else "   — "
    b=f"{r['t']/60:5.1f}" if r['t'] else " NEVER"
    return f"fore{g('foreman')} meter{g('meter')} latt{g('lattice')} hc{g('hc')} coord{g('coord')} BREACH{b} purges {r['purges']:2d} D/F/C {r['D']}/{r['F']}/{r['C']} BP {int(math.sqrt(r['harv']/1000))}"
def report(P):
    for E in (1.0,0.8,0.6): print(f"  E={E}      ", fmt(run(P,E)))
    print("  E=0.8 lazy ", fmt(run(P,0.8,dormant_at=97,wake_at=60)))
    print("  E=0.8 never", fmt(run(P,0.8,never_dormant=True)))
if __name__=='__main__':
    P=json.loads(json.dumps(BASE))
    for a in sys.argv[1:]:
        o=json.loads(a); u=o.pop('up',{}); P.update(o); P['up'].update(u)
    report(P)
