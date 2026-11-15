import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,DUNGEON_CONFIG} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave} from '../assets/scripts/LocalSave.ts';
const now=new Date(2026,10,15,12).getTime();
const store=(owner,battle)=>{const s=battle.snapshot();s.version=9;delete s.dungeon;owner.dungeon.run.battle=s;};
const begin=(id=0)=>{const b=new SquadBattleModel();b.heroes.slice(0,3).forEach(h=>h.level=20);assert.equal(b.startDungeon(id,0,now),null);return [b,SquadBattleModel.restore(b.dungeon.run.battle)];};
const end=b=>{for(let n=0;n<40000&&b.result==='fighting';n++)b.step(.5);};
test('fixed encounter has ten triple packs and one boss pack, one entry charge and persistent inter-wave cooldown',()=>{
 const [owner,b]=begin(),waves=new Map();let transition=false;
 for(let n=0;n<40000&&b.result==='fighting';n++){
  if(!waves.has(b.wave))waves.set(b.wave,b.enemies.map(e=>({...e})));
  b.step(.5);
  if(!transition&&b.waveDelay>0){transition=true;const cd=b.party[0].cooldown,hp=b.party[0].hp;b.step(.2);assert.equal(b.party[0].cooldown,cd);assert.equal(b.party[0].hp,hp);store(owner,b);assert.ok(SquadBattleModel.restore(owner.snapshot()));}
 }
 assert.equal(b.result,'victory');assert.equal(waves.size,11);assert.equal(b.clearedWaves,11);assert.equal(b.kills,33);assert.equal(owner.dungeon.stamina,110);
 assert.ok([...waves.values()].every(es=>es.length===3));const boss=waves.get(11);assert.ok(boss[0].maxHp>boss[1].maxHp*2);assert.ok(boss[0].attack>boss[1].attack);
 store(owner,b);const loaded=SquadBattleModel.restore(owner.snapshot());assert.equal(loaded.dungeon.run.battle.clearedWaves,11);
});
test('encounter composition is fixed across retries at the same wave and difficulty',()=>{
 const [,a]=begin(),[,b]=begin();const frames=new Map();
 for(let i=0;i<40000&&a.result==='fighting';i++){frames.set(a.wave,a.enemies.map(e=>[e.kind,e.maxHp,e.attack]));a.step(1);}
 for(let i=0;i<40000&&b.result==='fighting';i++){assert.deepEqual(b.enemies.map(e=>[e.kind,e.maxHp,e.attack]),frames.get(b.wave));b.step(1);}
});
test('result receipt survives reload, cannot pay twice, remains until explicit exit and retry charges anew',()=>{
 const [owner,b]=begin(3);end(b);store(owner,b);const inventory=owner.inventory.length;assert.equal(owner.settleDungeon(),null);const r=owner.dungeon.run;assert.ok(r.receipt);assert.equal(owner.inventory.length,inventory+1);
 const loaded=SquadBattleModel.restore(owner.snapshot());assert.ok(loaded);const saved=loaded.snapshot();assert.equal(loaded.settleDungeon(),null);assert.deepEqual(loaded.snapshot(),saved);
 assert.equal(loaded.retryDungeon(now),null);assert.equal(loaded.dungeon.stamina,100);assert.equal(loaded.dungeon.run.battle.wave,1);assert.equal(loaded.dungeon.run.battle.clearedWaves,0);assert.equal(loaded.dungeon.run.receipt,undefined);assert.equal(loaded.inventory.length,inventory+1);
 assert.ok(loaded.exitDungeon());loaded.dungeon.run.battle.result='defeat';assert.equal(loaded.settleDungeon(),null);assert.equal(loaded.exitDungeon(),null);assert.equal(loaded.dungeon.run,null);
});
test('daily or stamina rejection keeps result and balances; failed writes restore pre-retry receipt',()=>{
 const [b,f]=begin(4);end(f);store(b,f);b.settleDungeon();b.dungeon.dailyUsed=2;const before=b.snapshot();assert.match(b.retryDungeon(now),/次数/);assert.deepEqual(b.snapshot(),before);
 b.dungeon.dailyUsed=1;b.dungeon.stamina=0;const empty=b.snapshot();assert.match(b.retryDungeon(now),/体力/);assert.deepEqual(b.snapshot(),empty);
 b.dungeon.stamina=120;const prior=b.snapshot();assert.equal(b.retryDungeon(now),null);
 const save=new LocalSave({getItem(){return null;},setItem(){throw Error('full');}},SquadBattleModel.restore);assert.equal(save.save(b.snapshot()),false);
 const restored=SquadBattleModel.restore(prior);assert.ok(restored.dungeon.run.receipt);assert.equal(restored.dungeon.dailyUsed,1);assert.equal(restored.dungeon.stamina,120);
});
test('battle formation changes retain identity HP, cooldown, enemy damage, wave and statistics without healing',()=>{
 const [owner,b]=begin();b.step(12);b.heroes[0].hp-=99;b.heroes[0].cooldown=3;
 const enemies=JSON.stringify(b.enemies),stats=[b.wave,b.kills,b.elapsed,b.damage,b.received],hp=b.heroes.map(h=>h.hp);
 assert.equal(b.setBattleFormation([2,0,1]),null);assert.deepEqual(b.heroes.map(h=>h.hp),hp);assert.equal(b.heroes[0].cooldown,3);assert.equal(JSON.stringify(b.enemies),enemies);assert.deepEqual([b.wave,b.kills,b.elapsed,b.damage,b.received],stats);
 assert.ok(b.setBattleFormation([0,0]));assert.ok(b.setBattleFormation([3]));b.heroes[0].hp=0;assert.ok(b.setBattleFormation([0]));assert.equal(b.heroes[0].hp,0);
 store(owner,b);const restored=SquadBattleModel.restore(owner.snapshot());assert.deepEqual(restored.dungeon.run.battle.formation,[2,0,1]);
});
test('failed finite challenge earns zero, endless defeat settles cleared gates and never auto-revives',()=>{
 const [owner,b]=begin();b.result='defeat';store(owner,b);owner.settleDungeon();assert.deepEqual(owner.dungeon.run.receipt,{gold:0,experience:0,materials:0,gear:0,salvaged:0,cleared:0});
 const [tower,f]=begin(5);end(f);assert.equal(f.result,'defeat');assert.ok(f.clearedWaves>0);assert.ok(f.party.every(h=>h.hp===0));const snapshot=f.snapshot();f.step(100);assert.deepEqual(f.snapshot(),snapshot);
 store(tower,f);assert.equal(tower.settleDungeon(),null);assert.equal(tower.dungeon.run.receipt.gold,f.clearedWaves*500);assert.equal(tower.dungeon.stamina,110);
});
test('legacy one-wave runs remain resumable; malformed receipts and encounter metadata are rejected',()=>{
 const [b,f]=begin();const old=b.snapshot();old.version=10;delete old.encounter;delete old.dungeon.run.battle.encounter;assert.ok(SquadBattleModel.restore(old));
 for(const change of [s=>s.dungeon.run.battle.encounter.id=7,s=>s.dungeon.run.battle.encounter.difficulty=3,s=>s.dungeon.run.battle.encounter.id=1,s=>s.dungeon.run.receipt={gold:1,experience:0,materials:0,gear:0,salvaged:0,cleared:0}]){const d=b.snapshot();change(d);assert.equal(SquadBattleModel.restore(d),null);}
});
