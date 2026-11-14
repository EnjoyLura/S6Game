import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,gearStats,gearScore,salvageValue,enhanceCost,ENHANCE_CAP,foregroundRewardDelta} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave,SAVE_KEY} from '../assets/scripts/LocalSave.ts';
const gear=(id,extra={})=>({id,slot:0,quality:1,level:1,hp:100,attack:20,defense:10,power:20,locked:false,enhancement:0,...extra});
const setup=()=>{const b=new SquadBattleModel(0,()=>0);b.inventory=[gear(1),gear(2,{slot:4,locked:true}),gear(3,{slot:3}),gear(4,{slot:2,quality:3})];b.nextGearId=5;return b;};
test('batch salvage previews exact yield, removes only chosen items, and cannot repeat rewards',()=>{
 const b=setup(),yieldSum=salvageValue(b.inventory[0])+salvageValue(b.inventory[3]);assert.equal(b.salvagePreview([1,4]).materials,yieldSum);assert.equal(b.inventory.length,4);
 assert.equal(b.salvage([1,4]),null);assert.equal(b.materials,yieldSum);assert.deepEqual(b.inventory.map(g=>g.id),[2,3]);assert.ok(b.salvage([1,4]));assert.equal(b.materials,yieldSum);
});
test('locked and equipped gear block the whole batch atomically, including stale selections',()=>{
 const b=setup();b.equip(0,3,3);const before=b.snapshot();for(const ids of [[1,2],[1,3],[1,999],[1,1],[]]){assert.ok(b.salvage(ids));assert.deepEqual(b.snapshot(),before);}
 b.toggleLock(1);assert.ok(b.salvage([1]));b.toggleLock(1);b.equip(0,1,0);assert.ok(b.salvage([1]));assert.equal(b.materials,0);
});
test('retention is OR across quality, level and properties, with mandatory protection',()=>{
 const b=setup();b.setRules({enabled:true,minQuality:4,minLevel:20,attributes:['power']});
 assert.equal(b.retained(gear(9,{power:0,quality:4})),true);assert.equal(b.retained(gear(9,{power:0,level:20})),true);assert.equal(b.retained(gear(9,{power:1})),true);
 assert.equal(b.retained(gear(9,{power:0})),false);assert.equal(b.retained(gear(9,{power:0,enhancement:1})),true);assert.equal(b.retained(gear(9,{power:0,locked:true})),true);
 b.equip(0,1,0);b.setRules({enabled:true,minQuality:5,minLevel:0,attributes:[]});assert.equal(b.retained(b.inventory[0]),true);
});
test('saving rules does not destroy existing equipment; only future new drops are auto salvaged',()=>{
 const b=setup(),ids=b.inventory.map(g=>g.id);b.setRules({enabled:true,minQuality:5,minLevel:0,attributes:[]});assert.deepEqual(b.inventory.map(g=>g.id),ids);b.settleIdle(90);assert.deepEqual(b.inventory.map(g=>g.id),ids);assert.equal(b.autoSalvaged,3);assert.equal(b.nextGearId,8);assert.ok(b.materials>0);
 b.setRules({...b.rules,enabled:false});b.settleIdle(30);assert.equal(b.inventory.length,5);assert.equal(b.autoSalvaged,3);
});
test('auto salvage is frame-independent, freezes when paused and preserves material accounting',()=>{
 const a=setup(),b=setup();for(const m of [a,b])m.setRules({enabled:true,minQuality:2,minLevel:0,attributes:[]});a.settleIdle(600);for(let i=0;i<6000;i++)b.settleIdle(.1);
 assert.deepEqual(a.inventory,b.inventory);assert.equal(a.materials,b.materials);assert.equal(a.autoSalvaged,b.autoSalvaged);const before=a.snapshot();a.paused=true;a.settleIdle(90);a.paused=false;assert.deepEqual(a.snapshot(),before);
});
test('enhancement consumes exact cost, scales from base without compounding, increases combat effects',()=>{
 const b=setup();b.equip(1,1,0);b.materials=1000;const old=b.stats(1),cost=enhanceCost(b.inventory[0]);b.heroes[1].hp=610;
 assert.equal(b.enhance(1),null);assert.equal(b.materials,1000-cost);assert.deepEqual(gearStats(b.inventory[0]),{hp:110,attack:22,defense:11,power:22});assert.equal(b.heroes[1].hp,615);
 assert.equal(b.stats(1).hp,old.hp+10);assert.equal(b.stats(1).attack,old.attack+2);assert.equal(b.step(1)[0].damage,312);
 b.enhance(1);assert.equal(gearStats(b.inventory[0]).hp,120);assert.equal(b.inventory[0].hp,100);assert.ok(gearScore(b.inventory[0])>gearScore(gear(1)));
});
test('enhanced defense, shield and healing use actual battle formulas',()=>{
 const b=setup();b.materials=1000;b.equip(0,1,0);b.enhance(1);b.equip(2,4,2);b.enhance(4);b.heroes[1].hp=500;
 const hits=b.step(4);assert.equal(hits[1].shieldAfter,242);assert.equal(hits[2].heal,262);assert.equal(hits[3].blocked,219);
});
test('insufficient material, invalid ID and max level never spend; dead heroes stay dead',()=>{
 const b=setup(),initial=b.snapshot();assert.ok(b.enhance(1));assert.deepEqual(b.snapshot(),initial);b.materials=10000;assert.ok(b.enhance(999));b.equip(0,1,0);b.heroes[0].hp=0;
 for(let i=0;i<ENHANCE_CAP;i++)assert.equal(b.enhance(1),null);assert.equal(b.heroes[0].hp,0);const capped=b.snapshot();assert.ok(b.enhance(1));assert.deepEqual(b.snapshot(),capped);
});
test('salvaging enhanced gear refunds all spent materials but lock and equipped protections still apply',()=>{
 const b=setup();b.materials=100;const baseYield=salvageValue(b.inventory[0]);b.enhance(1);b.enhance(1);b.toggleLock(1);assert.ok(b.salvage([1]));b.toggleLock(1);b.equip(0,1,0);assert.ok(b.salvage([1]));b.equip(0,null,0);assert.equal(b.salvage([1]),null);assert.equal(b.materials,100+baseYield);
});
test('v2 migrates intact with automation off; v3 restores rules/materials/enhancement and retry preserves them',()=>{
 const old=setup().snapshot();old.version=2;old.heroes=old.heroes.slice(0,3);old.loadouts=old.loadouts.slice(0,3);delete old.materials;delete old.rules;delete old.autoSalvaged;old.inventory.forEach(g=>delete g.enhancement);const migrated=SquadBattleModel.restore(old);assert.ok(migrated);assert.equal(migrated.materials,0);assert.equal(migrated.rules.enabled,false);assert.equal(migrated.inventory.length,4);
 migrated.materials=100;migrated.equip(0,1,0);migrated.enhance(1);migrated.setRules({enabled:true,minQuality:3,minLevel:10,attributes:['defense']});const raw=migrated.snapshot(),restored=SquadBattleModel.restore(raw);assert.deepEqual(restored.snapshot(),raw);assert.deepEqual(restored.stats(0),migrated.stats(0));const retry=new SquadBattleModel();retry.inheritIncome(restored);assert.equal(retry.materials,restored.materials);assert.deepEqual(retry.rules,restored.rules);assert.equal(retry.inventory[0].enhancement,1);
});
test('invalid material/enhancement/rules reject entire save; invalid rules cannot alter live state',()=>{
 const b=setup();for(const mutate of [d=>d.materials=-1,d=>d.materials=NaN,d=>d.autoSalvaged=-1,d=>d.inventory[0].enhancement=11,d=>d.inventory[0].enhancement=.5,d=>d.rules.minQuality=6,d=>d.rules.attributes=['bogus'],d=>d.rules.attributes=['hp','hp'],d=>d.rules.minLevel=-1,d=>d.rules.enabled='yes']){const d=b.snapshot();mutate(d);assert.equal(SquadBattleModel.restore(d),null);}
 const before=b.snapshot();assert.ok(b.setRules({enabled:true,minQuality:99,minLevel:0,attributes:[]}));assert.deepEqual(b.snapshot(),before);
});
test('failed save preserves durable pre-salvage inventory and supports full rollback of materials',()=>{
 const map=new Map(),port={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},save=new LocalSave(port,SquadBattleModel.restore);let b=setup();assert.ok(save.save(b.snapshot()));const before=b.snapshot();b.salvage([1]);port.setItem=()=>{throw Error('quota');};assert.equal(save.save(b.snapshot()),false);b=SquadBattleModel.restore(before);assert.deepEqual(b.snapshot(),before);assert.deepEqual(SquadBattleModel.restore(JSON.parse(map.get(SAVE_KEY))).snapshot(),before);
});

test('runtime resume gaps cannot grant hours of loot or auto salvage income',()=>{
 const b=new SquadBattleModel();b.setRules({enabled:true,minQuality:5,minLevel:0,attributes:[]});
 b.settleIdle(foregroundRewardDelta(18000));assert.equal(b.nextGearId,1);assert.equal(b.materials,0);assert.equal(b.gold,0);
 for(const bad of [NaN,Infinity,-1])b.settleIdle(foregroundRewardDelta(bad));assert.equal(b.idleElapsed,0);
 for(let i=0;i<300;i++)b.settleIdle(foregroundRewardDelta(.1));assert.equal(b.nextGearId,2);assert.equal(b.autoSalvaged,1);
});

test('normal foreground slow frames still settle real elapsed time',()=>{
 const b=new SquadBattleModel();for(let i=0;i<6;i++)b.settleIdle(foregroundRewardDelta(5));assert.equal(b.inventory.length,1);assert.equal(b.gold,60);
});
