import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,generateGear,gearPrimary,gearUpgradePreview,gearStats,validGearEffects} from '../assets/scripts/SquadBattleModel.ts';
import {FORMATIONS} from '../assets/scripts/V2Progress.ts';

const fresh=()=>new SquadBattleModel(0,()=>0,3,true);
const reload=m=>{const copy=SquadBattleModel.restore(m.snapshot());assert.ok(copy,'snapshot must survive validation');return copy;};

test('separate ticket currencies and independent pity persist across reload; rejected draw is atomic',()=>{
 const m=fresh(),normal=m.recruitment.tickets,up=m.interfaceProgress.upTickets;
 assert.equal(m.recruitPool(1,10),null);assert.equal(m.recruitment.tickets,normal);assert.equal(m.interfaceProgress.upTickets,up-10);
 assert.equal(m.recruitment.pity[1].total,10);assert.equal(m.recruitment.pity[0].total,0);
 const n=reload(m);assert.equal(n.recruitPool(0,1),null);assert.equal(n.recruitment.tickets,normal-1);assert.equal(n.interfaceProgress.upTickets,up-10);
 n.interfaceProgress.upTickets=0;const before=n.snapshot();assert.ok(n.recruitPool(1,10));assert.deepEqual(n.snapshot(),before);
});

test('bag expansion charges increasing gold and overflow converts only the incoming drop',()=>{
 const m=fresh();m.interfaceProgress.capacity=50;m.gold=10000;
 // Valid old capacities use the same minimum expansion cost.
 m.interfaceProgress.capacity=200;m.settleIdle(30*200);assert.equal(m.inventory.length,200);
 const first=m.inventory.map(g=>g.id),material=m.materials;m.settleIdle(30);assert.deepEqual(m.inventory.map(g=>g.id),first);assert.ok(m.materials>material);
 const gold=m.gold;assert.equal(m.expandBag(),null);assert.equal(m.gold,gold-500);assert.equal(m.interfaceProgress.capacity,250);
 assert.equal(m.expandBag(),null);assert.equal(m.gold,gold-1500);assert.equal(reload(m).interfaceProgress.capacity,300);
 m.gold=0;const before=m.snapshot();assert.ok(m.expandBag());assert.deepEqual(m.snapshot(),before);
});

test('all six equipment primaries upgrade singly; breakthrough upgrades random stats and preview equals result',()=>{
 for(let slot=0;slot<6;slot++)for(const level of [1,9]){
  const m=fresh(),g={id:1,slot,quality:3,level,hp:100,attack:20,defense:8,power:15,locked:false,enhancement:2};m.inventory=[g];m.nextGearId=2;m.gold=1e6;m.materials=1e6;
  const primary=gearPrimary(g),before={...g},preview=gearUpgradePreview(g);m.equip(0,1,slot);m.heroes[0].hp=Math.floor(m.stats(0).hp/2);
  assert.equal(m.upgradeGear(1),null);assert.deepEqual(g,preview);assert.equal(g.level,level+1);
  for(const key of ['hp','attack','defense','power'])assert.equal(g[key]>before[key],key===primary||level===9);
  assert.ok(Math.abs(m.heroes[0].hp/m.stats(0).hp-.5)<.002);assert.deepEqual(reload(m).inventory[0],g);
 }
 const m=fresh(),g={...generateGear(1,100),level:100};m.inventory=[g];m.nextGearId=2;const before=m.snapshot();assert.ok(m.upgradeGear(1));assert.deepEqual(m.snapshot(),before);
});

test('random equipment effects respect rarity, contribute real stats, deep-copy and reject forged effects',()=>{
 const drops=Array.from({length:300},(_,i)=>generateGear(i+1,1));assert.ok(drops.some(g=>g.effects?.length===2));assert.ok(drops.some(g=>g.quality===3&&!g.effects?.length));assert.ok(drops.every(validGearEffects));
 const m=fresh(),g={id:1,slot:0,quality:4,level:1,hp:0,attack:0,defense:0,power:0,locked:false,effects:['attack','hp']};m.inventory=[g];m.nextGearId=2;const baseline=m.stats(0);m.equip(0,1,0);
 assert.equal(m.stats(0).attack,Math.round(baseline.attack*1.05));assert.equal(m.stats(0).hp,Math.round(baseline.hp*1.05));
 const n=reload(m);const snapshot=m.snapshot();snapshot.inventory[0].effects[0]='hp';assert.equal(m.inventory[0].effects[0],'attack');assert.equal(n.inventory[0].effects[0],'attack');
 for(const effects of [['attack','attack'],['attack','hp','hp'],['unknown']]){const d=m.snapshot();d.inventory[0].effects=effects;assert.equal(SquadBattleModel.restore(d),null);}
});

test('fifteen talent nodes enforce chains and independent hero points, modify battle, reset without reviving',()=>{
 const m=fresh();m.heroes[0].level=20;m.heroes[0].hp=m.stats(0).hp;const before=m.stats(0);
 assert.ok(m.trainTreeTalent(0,1));for(const node of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])assert.equal(m.trainTreeTalent(0,node),null);
 assert.equal(m.talentPoints(0),4);assert.equal(m.talentPoints(1),0);assert.ok(m.stats(0).hp>before.hp);assert.ok(m.stats(0).attack>before.attack);assert.ok(m.stats(0).power>before.power);assert.equal(m.secondCooldown(0),11);
 assert.deepEqual(reload(m).interfaceProgress.tree,m.interfaceProgress.tree);m.heroes[0].hp=0;assert.equal(m.resetTreeTalents(0),null);assert.equal(m.heroes[0].hp,0);assert.equal(m.talentPoints(0),19);assert.deepEqual(m.stats(0),before);
 const invalid=m.snapshot();invalid.interfaceProgress.tree[0][2]=1;assert.equal(SquadBattleModel.restore(invalid),null);
});

test('quick sweep charges exactly ten stamina, follows checkpoint offline rates and preserves pending receipt',()=>{
 const m=fresh();m.highestWave=11;m.lastSeen=Date.now()-60000;m.prepareOffline(Date.now());const pending=structuredClone(m.offline),gold=m.gold,stamina=m.dungeon.stamina;
 const result=m.quickSweep();assert.equal(result.error,null);assert.equal(result.reward.gold,3600*3);assert.equal(result.reward.equipment.length,60);assert.equal(m.gold,gold+result.reward.gold);assert.equal(m.dungeon.stamina,stamina-10);assert.deepEqual(m.offline,pending);
 assert.deepEqual(reload(m).offline,pending);m.dungeon.stamina=9;const before=m.snapshot();assert.ok(m.quickSweep().error);assert.deepEqual(m.snapshot(),before);
});

test('formation presets, target rates and legacy saves remain valid',()=>{
 const m=fresh();m.interfaceProgress.presets=[[0],[1,0],[2,0,1],[0,2]];m.interfaceProgress.preset=2;m.interfaceProgress.formation=3;
 assert.deepEqual(reload(m).interfaceProgress,m.interfaceProgress);for(const f of FORMATIONS)assert.equal(f.rates.reduce((a,b)=>a+b),100);
 const d=m.snapshot();delete d.interfaceProgress;assert.deepEqual(SquadBattleModel.restore(d).interfaceProgress.presets,[[0,1,2],[0,1,2],[0,1,2],[0,1,2]]);
 for(const presets of [[[0,0],[0],[0],[0]],[[0],[0],[0],[9]]]){const d=m.snapshot();d.interfaceProgress.presets=presets;assert.equal(SquadBattleModel.restore(d),null);}
});
