import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,HERO_CONFIG,MONSTERS} from '../assets/scripts/SquadBattleModel.ts';
test('three heroes act in speed order, full-health healing never wastes cooldown',()=>{
 const b=new SquadBattleModel(0,()=>0);const h=b.step(4);
 assert.deepEqual(h.map(x=>x.actor),[1,0,2,3]);assert.equal(h[0].damage,290);assert.equal(h[1].skill,true);
 assert.equal(h[2].skill,false);assert.equal(b.heroes[2].cooldown,0);assert.equal(h[3].blocked,220);
});
test('healer picks lowest HP ratio, caps healing, and never revives dead heroes',()=>{
 const b=new SquadBattleModel();b.heroes[0].hp=0;b.heroes[1].hp=1000;b.heroes[2].hp=1200;
 const hits=b.step(2);const heal=hits.find(x=>x.heal>0);assert.equal(heal.target,1);assert.equal(heal.heal,120);assert.equal(b.heroes[0].hp,0);
});
test('manual skills queue per hero, dead heroes cannot queue or act',()=>{
 const b=new SquadBattleModel();b.autoSkill=false;b.heroes[2].hp=0;
 assert.equal(b.requestSkill(2),false);assert.equal(b.requestSkill(1),true);assert.equal(b.requestSkill(1),false);
 const hits=b.step(3);assert.deepEqual(hits.map(x=>x.actor),[1,0,3]);assert.equal(hits[0].skill,true);assert.equal(hits[1].skill,false);
});
test('pause/end freeze all cooldowns and frame sizes give same outcome',()=>{
 const a=new SquadBattleModel(2,()=>.7),b=new SquadBattleModel(2,()=>.7);
 a.step(100);for(let n=0;n<10000;n++)b.step(.01);
 assert.equal(a.result,'victory');assert.equal(a.damage,MONSTERS[2].hp);assert.deepEqual(a.heroes.map(h=>({...h,cooldown:Math.round(h.cooldown*1e6)})),b.heroes.map(h=>({...h,cooldown:Math.round(h.cooldown*1e6)})));assert.equal(a.actions,b.actions);
 const frozen=JSON.stringify(a);a.step(100);assert.equal(JSON.stringify(a),frozen);
 const c=new SquadBattleModel();c.step(2);c.paused=true;const state=JSON.stringify(c);c.step(100);assert.equal(JSON.stringify(c),state);
});
test('front target weights, wipe and reset are valid for all four monsters',()=>{
 for(let index=0;index<4;index++){
 const b=new SquadBattleModel(index,()=>.59);b.autoSkill=false;assert.equal(b.step(4).at(-1).target,0);
 b.heroes.forEach(h=>h.hp=0);b.heroes[1].hp=1;b.step(4);assert.equal(b.result,'defeat');
 const reset=new SquadBattleModel(index);assert.deepEqual(reset.heroes.map(h=>h.hp),HERO_CONFIG.map(c=>c.hp));assert.equal(reset.enemyHp,MONSTERS[index].hp);
 }
});
test('three enemies act, each death counts once, waves continue and cooldown freezes between waves',()=>{
 const b=new SquadBattleModel(0,()=>0,3,true);b.autoSkill=false;
 assert.deepEqual(b.step(6).map(h=>h.actor),[1,0,2,3,4,5]);
 b.enemies.forEach(e=>e.hp=1);b.step(3);
 assert.equal(b.kills,3);assert.equal(b.gold,0);assert.equal(b.heroes[0].experience,0);assert.equal(b.waveDelay,1.2);
 b.heroes[0].cooldown=5;b.step(.6);assert.equal(b.heroes[0].cooldown,5);assert.equal(b.wave,1);
 b.step(.6);assert.equal(b.wave,2);assert.equal(b.enemies.length,3);assert.ok(b.enemies.every(e=>e.hp===e.maxHp));assert.equal(b.gold,0);
});
test('continuous defeat automatically regroups without phantom rewards',()=>{
 const b=new SquadBattleModel(0,()=>0,3,true);b.autoSkill=false;b.heroes.forEach(h=>h.hp=1);b.step(6);
 assert.equal(b.regrouping,true);assert.equal(b.kills,0);assert.equal(b.gold,0);b.step(2);
 assert.equal(b.wave,1);assert.equal(b.regrouping,false);assert.deepEqual(b.heroes.map(h=>h.hp),HERO_CONFIG.map(c=>c.hp));
});
test('idle rewards are identical across frame sizes over multiple waves',()=>{
 const a=new SquadBattleModel(0,()=>.2,3,true),b=new SquadBattleModel(0,()=>.2,3,true);
 a.step(300);for(let i=0;i<30000;i++)b.step(.01);
 assert.ok(a.wave>3);assert.equal(a.wave,b.wave);assert.equal(a.kills,b.kills);assert.equal(a.gold,0);assert.equal(a.gold,b.gold);assert.equal(a.heroes[0].experience,0);assert.equal(a.actions,b.actions);
});

test('idle income follows real time, independent of battle speed and kills',()=>{
 const a=new SquadBattleModel(0,()=>.2,3,true),b=new SquadBattleModel(0,()=>.2,3,true);
 for(let i=0;i<6000;i++){a.step(.01);b.step(.02);a.settleIdle(.01);b.settleIdle(.01);}
 assert.equal(a.gold,120);assert.equal(b.gold,120);assert.equal(a.heroes[0].experience,96);assert.equal(b.heroes[0].experience,96);assert.ok(b.kills>a.kills);
 a.paused=true;a.settleIdle(100);assert.equal(a.gold,120);
});
