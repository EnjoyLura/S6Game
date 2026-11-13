import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,upgradeCost,LEVEL_CAP} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave,SAVE_KEY,BACKUP_KEY} from '../assets/scripts/LocalSave.ts';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),map};};
test('upgrade spends only selected hero XP and changes real damage, not other heroes',()=>{
 const b=new SquadBattleModel();b.settleIdle(25);const old=b.stats(1);assert.equal(b.upgrade(1),null);
 assert.deepEqual(b.heroes.map(h=>h.level),[1,2,1]);assert.deepEqual(b.heroes.map(h=>h.experience),[40,0,40]);
 assert.equal(b.stats(1).hp,1232);assert.equal(b.stats(1).attack,160);assert.equal(b.stats(1).power,319);
 assert.equal(b.step(1)[0].damage,319);assert.ok(b.stats(1).attack>old.attack);assert.equal(b.heroes[0].hp,1980);
});
test('insufficient XP / invalid hero / cap cannot spend, and upgrading never revives',()=>{
 const b=new SquadBattleModel();const before=b.snapshot();assert.ok(b.upgrade(0));assert.deepEqual(b.snapshot(),before);assert.ok(b.upgrade(3));
 b.heroes[0].experience=1000;b.heroes[0].hp=0;assert.equal(b.upgrade(0),null);assert.equal(b.heroes[0].hp,0);assert.equal(b.heroes[0].experience,960);
 b.heroes[0].level=LEVEL_CAP;assert.ok(b.upgrade(0));assert.equal(b.heroes[0].experience,960);assert.equal(upgradeCost(2),80);
});
test('upgraded shield and heal use level-scaled power; retries keep level and XP',()=>{
 const b=new SquadBattleModel();b.heroes.forEach(h=>h.experience=40);b.upgrade(0);b.upgrade(2);b.heroes[1].hp=500;
 const hits=b.step(3);assert.equal(b.heroes[0].shield,242);assert.equal(hits[2].heal,264);
 const c=new SquadBattleModel();c.inheritIncome(b);assert.deepEqual(c.heroes.map(h=>h.level),[2,1,2]);assert.equal(c.heroes[0].hp,2178);
});
test('complete battle/progression snapshot survives round-trip without extra income',()=>{
 const b=new SquadBattleModel(2,()=>0,3,true);b.settleIdle(28.5);b.upgrade(0);b.step(12.4);b.requestSkill(1);b.autoSkill=false;
 const raw=JSON.parse(JSON.stringify(b.snapshot())),c=SquadBattleModel.restore(raw);assert.ok(c);assert.deepEqual(c.snapshot(),raw);
 c.settleIdle(1.5);assert.equal(c.gold,b.gold+10);assert.equal(c.heroes[0].experience,b.heroes[0].experience+8);
});
test('corrupt schema and impossible battle state are rejected',()=>{
 const b=new SquadBattleModel();for(const mutate of [d=>d.version=99,d=>d.heroes[0].level=0,d=>d.heroes[0].experience=-1,d=>d.heroes[0].hp=1e10,d=>d.enemies=[],d=>d.enemies[0].hp=0,d=>d.timer=NaN,d=>d.cursor=99]){const d=b.snapshot();mutate(d);assert.equal(SquadBattleModel.restore(d),null);}
});
test('save backup recovers corruption and write errors do not destroy last good primary',()=>{
 const port=storage(),repo=new LocalSave(port,SquadBattleModel.restore),b=new SquadBattleModel();assert.equal(repo.load(),null);b.settleIdle(25);assert.equal(repo.save(b.snapshot()),true);b.upgrade(0);assert.equal(repo.save(b.snapshot()),true);
 assert.ok(port.map.has(BACKUP_KEY));port.map.set(SAVE_KEY,'broken');const recovered=new LocalSave(port,SquadBattleModel.restore);assert.equal(recovered.load().heroes[0].level,1);assert.match(recovered.error,/备份/);
 port.setItem=()=>{throw new Error('quota');};assert.equal(recovered.save(b.snapshot()),false);assert.match(recovered.error,/失败/);
});
test('unreadable saves remain untouched and disable overwrites',()=>{
 const port=storage();port.map.set(SAVE_KEY,'{bad');const repo=new LocalSave(port,SquadBattleModel.restore);assert.equal(repo.load(),null);assert.equal(repo.save(new SquadBattleModel().snapshot()),false);assert.equal(port.map.get(SAVE_KEY),'{bad');
});
