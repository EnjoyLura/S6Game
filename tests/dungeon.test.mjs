import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,DUNGEON_CONFIG,dungeonReward} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave} from '../assets/scripts/LocalSave.ts';
const now=new Date(2026,10,15,12).getTime();
const begun=(id=0,difficulty=0)=>{const b=new SquadBattleModel();assert.equal(b.startDungeon(id,difficulty,now),null);return b;};
const complete=b=>{const trial=SquadBattleModel.restore(b.dungeon.run.battle);for(let i=0;i<20000&&trial.result==='fighting';i++)trial.step(1);assert.equal(trial.result,'victory');const s=trial.snapshot();s.version=9;delete s.dungeon;b.dungeon.run.battle=s;};
test('stamina starts capped, retains partial recovery and full cap discards accumulated time',()=>{const b=begun();assert.equal(b.dungeon.stamina,110);b.refreshDungeon(now+359999);assert.equal(b.dungeon.stamina,110);const c=SquadBattleModel.restore(b.snapshot());c.refreshDungeon(now+360000);assert.equal(c.dungeon.stamina,111);c.refreshDungeon(now+360000*30);assert.equal(c.dungeon.stamina,120);c.abandonDungeon();c.startDungeon(0,0,now+360000*30);c.refreshDungeon(now+360000*30+1);assert.equal(c.dungeon.stamina,110);});
test('daily pool allows only two entries shared across difficulty, reset at local midnight, clock rollback cannot reset',()=>{const b=begun(4);b.abandonDungeon();assert.equal(b.startDungeon(4,1,now),null);b.abandonDungeon();assert.ok(b.startDungeon(4,2,now));assert.equal(b.dungeon.stamina,95);const midnight=new Date(2026,10,16).getTime();b.refreshDungeon(midnight);assert.equal(b.dungeon.dailyUsed,0);assert.equal(b.startDungeon(4,0,midnight),null);b.abandonDungeon();b.refreshDungeon(now);assert.equal(b.dungeon.dailyUsed,1);assert.equal(b.dungeon.day,20261116);});
test('entry checks stamina, difficulty, duplicate run; reload resumes without repaying',()=>{const b=begun(3,2);assert.equal(b.dungeon.stamina,100);assert.ok(b.startDungeon(0,0,now));const restored=SquadBattleModel.restore(b.snapshot());assert.ok(restored.dungeon.run);assert.equal(restored.dungeon.stamina,100);restored.abandonDungeon();restored.dungeon.stamina=9;assert.ok(restored.startDungeon(0,0,now));assert.equal(restored.dungeon.stamina,9);assert.ok(restored.startDungeon(7,0,now));assert.ok(restored.startDungeon(0,5,now));});
test('actual squad combat preserves talents, equipment and stars; difficulty scales monsters and pays correct rewards once',()=>{for(let id=0;id<5;id++){const b=begun(id);const gold=b.gold,xp=b.heroes[0].experience;assert.ok(b.finishDungeon());complete(b);assert.equal(b.finishDungeon(),null);const r=dungeonReward(id,0);assert.equal(b.gold,gold+r.gold);assert.equal(b.heroes[0].experience,xp+r.experience);assert.equal(b.heroes[3].experience,0);assert.equal(b.materials,r.materials);assert.equal(b.inventory.length,r.gear);assert.ok(b.finishDungeon());assert.ok(SquadBattleModel.restore(b.snapshot()));}const a=begun(),hard=begun(0,2);assert.ok(hard.dungeon.run.battle.enemies[0].hp>a.dungeon.run.battle.enemies[0].hp);});
test('run hp, cooldown and result survive reload; defeated or abandoned runs never give loot',()=>{const b=begun();const trial=SquadBattleModel.restore(b.dungeon.run.battle);trial.step(5);const s=trial.snapshot();s.version=9;delete s.dungeon;b.dungeon.run.battle=s;const c=SquadBattleModel.restore(b.snapshot());assert.deepEqual(c.dungeon.run.battle,s);assert.equal(c.abandonDungeon(),null);assert.equal(c.gold,0);assert.equal(c.dungeon.stamina,110);assert.ok(c.finishDungeon());});
test('endless keeps advancing in one run, charges once and settles completed gates only on defeat',()=>{
 const b=begun(5),trial=SquadBattleModel.restore(b.dungeon.run.battle);
 for(let i=0;i<20000&&trial.result==='fighting';i++)trial.step(1);
 assert.equal(trial.result,'defeat');assert.ok(trial.clearedWaves>1);assert.equal(b.dungeon.stamina,110);
 const s=trial.snapshot();s.version=9;delete s.dungeon;b.dungeon.run.battle=s;
 assert.equal(b.settleDungeon(),null);const receipt=b.dungeon.run.receipt;
 assert.equal(receipt.gold,500*trial.clearedWaves);assert.equal(receipt.materials,5*trial.clearedWaves);assert.equal(b.dungeon.floor,trial.clearedWaves+1);
 const c=SquadBattleModel.restore(b.snapshot());assert.ok(c);const gold=c.gold;assert.equal(c.settleDungeon(),null);assert.equal(c.gold,gold);
 assert.equal(c.retryDungeon(now),null);assert.equal(c.dungeon.run.battle.wave,1);assert.equal(c.dungeon.stamina,100);
});
test('failed saves support rollback of entry and reward, preserving receipt for retry',()=>{const b=new SquadBattleModel(),before=b.snapshot(),saves=new LocalSave({getItem(){return null;},setItem(){throw Error('full');}},SquadBattleModel.restore);b.startDungeon(4,0,now);assert.equal(saves.save(b.snapshot()),false);const prior=SquadBattleModel.restore(before);assert.equal(prior.dungeon.stamina,120);assert.equal(prior.dungeon.dailyUsed,0);const run=begun();complete(run);const receipt=run.snapshot();run.finishDungeon();assert.equal(saves.save(run.snapshot()),false);const retry=SquadBattleModel.restore(receipt);assert.equal(retry.gold,0);retry.finishDungeon();assert.equal(retry.gold,3000);});
test('v9 migration preserves progress and gives full initial stamina; invalid and recursive run saves rejected',()=>{const b=begun(),old=b.snapshot();old.version=9;delete old.dungeon;const c=SquadBattleModel.restore(old);assert.equal(c.dungeon.stamina,120);for(const change of [d=>d.stamina=-1,d=>d.dailyUsed=3,d=>d.anchor=d.clock+1,d=>d.run.difficulty=4,d=>d.run.battle.version=10]){const s=b.snapshot();change(s.dungeon);assert.equal(SquadBattleModel.restore(s),null);}const retry=new SquadBattleModel();retry.inheritIncome(b);retry.dungeon.stamina=1;assert.equal(b.dungeon.stamina,110);});

test('defeat cannot settle rewards; all difficulties share one daily counter',()=>{const b=begun(4,2),trial=SquadBattleModel.restore(b.dungeon.run.battle);for(let i=0;i<600&&trial.result==='fighting';i++)trial.step(1);assert.equal(trial.result,'defeat');const s=trial.snapshot();s.version=9;delete s.dungeon;b.dungeon.run.battle=s;assert.ok(b.finishDungeon());assert.equal(b.gold,0);b.abandonDungeon();assert.equal(b.dungeon.stamina,100);assert.equal(b.dungeon.dailyUsed,1);assert.ok(SquadBattleModel.restore(b.snapshot()));});
test('trial uses upgraded talent/equipment stats without mutating adventure health and reward gear obeys retention',()=>{const b=new SquadBattleModel();b.heroes[0].level=8;b.heroes[0].talents=[1,1,1,1];b.heroes[0].hp=b.stats(0).hp;b.heroes[0].hp-=100;const hp=b.heroes[0].hp;b.startDungeon(3,0,now);const trial=SquadBattleModel.restore(b.dungeon.run.battle);assert.deepEqual(trial.stats(0),b.stats(0));assert.equal(trial.heroes[0].hp,b.stats(0).hp);assert.equal(b.heroes[0].hp,hp);b.rules.enabled=true;b.rules.minQuality=5;complete(b);b.finishDungeon();assert.equal(b.inventory.length,0);assert.ok(b.materials>0);assert.equal(b.autoSalvaged,1);});


test('finite dungeon manual dual skills, auto toggle and pause survive resume without a second entry charge',()=>{
 const owner=new SquadBattleModel();owner.heroes.slice(0,3).forEach(h=>h.level=5);
 assert.equal(owner.startDungeon(0,2,now),null);const trial=SquadBattleModel.restore(owner.dungeon.run.battle);
 trial.autoSkill=false;assert.ok(trial.requestSkill(0,0));assert.ok(trial.requestSkill(0,1));
 assert.equal(trial.requestSkill(0,0),false);trial.paused=true;
 const snap=trial.snapshot();snap.version=9;delete snap.dungeon;owner.dungeon.run.battle=snap;
 const loaded=SquadBattleModel.restore(owner.snapshot()),fight=SquadBattleModel.restore(loaded.dungeon.run.battle);
 assert.equal(loaded.dungeon.stamina,100);assert.equal(fight.autoSkill,false);assert.equal(fight.paused,true);
 assert.ok(fight.party[0].queued);assert.ok(fight.party[0].queued2);
 assert.deepEqual(fight.step(.1),[]);fight.paused=false;
 const hits=[];for(let i=0;i<150&&fight.result==='fighting';i++)hits.push(...fight.step(.1));
 assert.ok(hits.some(h=>h.actor===0&&h.skill&&h.skillSlot===0));
 assert.ok(hits.some(h=>h.actor===0&&h.skill&&h.skillSlot===2));
 assert.ok(hits.filter(h=>h.actor===1).every(h=>!h.skill));
 fight.autoSkill=true;assert.equal(SquadBattleModel.restore(fight.snapshot()).autoSkill,true);
});
