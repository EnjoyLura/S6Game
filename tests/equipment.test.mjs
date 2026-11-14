import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,generateGear,gearScore,DROP_SECONDS} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave,SAVE_KEY} from '../assets/scripts/LocalSave.ts';
const gear=(id,slot,extra={})=>({id,slot,quality:1,level:1,hp:0,attack:0,defense:0,power:0,locked:false,...extra});
const add=(b,...items)=>{b.inventory.push(...items);b.nextGearId=Math.max(...items.map(g=>g.id))+1;};
test('drops settle once per foreground interval and are independent of combat RNG, frames and speed',()=>{
 const a=new SquadBattleModel(0,()=>0,3,true),b=new SquadBattleModel(0,()=>.99,3,true);
 a.settleIdle(299.9);for(let i=0;i<2999;i++)b.settleIdle(.1);assert.deepEqual(a.inventory,b.inventory);assert.equal(a.inventory.length,9);
 a.settleIdle(.1);assert.equal(a.inventory.length,10);a.paused=true;a.settleIdle(600);assert.equal(a.inventory.length,10);
 b.step(10);assert.equal(b.inventory.length,9);assert.equal(DROP_SECONDS,30);
});
test('all six slots drop with persistent unique IDs, rolled attributes and progress-based levels',()=>{
 const b=new SquadBattleModel();b.highestWave=10;b.settleIdle(30*200);assert.equal(new Set(b.inventory.map(g=>g.slot)).size,6);assert.equal(new Set(b.inventory.map(g=>g.id)).size,200);
 assert.ok(b.inventory.every(g=>g.level===4&&gearScore(g)>0));const copy=new SquadBattleModel();copy.inheritIncome(b);copy.settleIdle(30);assert.equal(copy.inventory.at(-1).id,201);assert.equal(copy.inventory.at(-1).level,4);assert.equal(b.inventory.length,200);
});
test('equip, replace and unequip preserve HP ratio and cannot duplicate or steal equipment',()=>{
 const b=new SquadBattleModel();add(b,gear(1,4,{hp:1980}),gear(2,4,{hp:100}));b.heroes[0].hp=990;
 assert.equal(b.equip(0,1,4),null);assert.equal(b.heroes[0].hp,1980);assert.equal(b.stats(0).hp,3960);
 assert.ok(b.equip(1,1,4));assert.ok(b.equip(0,2,0));assert.ok(b.equip(3,2,4));assert.ok(b.equip(0,999,4));
 b.equip(0,2,4);assert.equal(b.owner(1),-1);assert.equal(b.heroes[0].hp,1040);b.equip(0,null,4);assert.equal(b.heroes[0].hp,990);assert.equal(b.inventory.length,2);
 b.heroes[0].hp=0;b.equip(0,1,4);assert.equal(b.heroes[0].hp,0);
});
test('one-click equips best score per slot, preserves ties and does not take other heroes gear',()=>{
 const b=new SquadBattleModel();add(b,gear(1,0,{attack:5}),gear(2,0,{attack:30}),gear(3,0,{attack:60}),gear(4,4,{hp:200}),gear(5,4,{hp:200}));
 b.equip(1,3,0);b.equip(0,5,4);b.autoEquip(0);assert.deepEqual(b.loadouts[0],[2,null,null,null,5,null]);assert.equal(b.owner(3),1);
 const hp=b.heroes[0].hp;b.autoEquip(0);assert.equal(b.heroes[0].hp,hp);b.toggleLock(2);assert.equal(b.inventory[1].locked,true);assert.equal(b.owner(2),0);
});
test('attack, defense and skill power alter actual damage, shield and healing',()=>{
 const b=new SquadBattleModel(0,()=>0);add(b,gear(1,0,{attack:30,power:40}),gear(2,3,{defense:50,power:20}),gear(3,2,{power:70}));b.equip(1,1,0);b.equip(0,2,3);b.equip(2,3,2);
 b.autoSkill=false;assert.equal(b.step(1)[0].damage,175);b.requestSkill(0);b.heroes[1].hp=500;b.requestSkill(2);
 const hits=b.step(3);assert.equal(hits[0].shieldAfter,240);assert.equal(hits[1].heal,310);assert.equal(hits[2].blocked,180);assert.equal(hits[2].damage,0);
 const fire=new SquadBattleModel();add(fire,gear(1,0,{power:40}));fire.equip(1,1,0);assert.equal(fire.step(1)[0].damage,330);
 b.equip(0,null,3);assert.equal(b.stats(0).defense,0);assert.ok(b.heroes[0].shield<=b.stats(0).power);
});
test('v1 migration preserves progression, starts empty inventory and does not award historical drops',()=>{
 const b=new SquadBattleModel();b.settleIdle(90);b.upgrade(0);const v1=b.snapshot();v1.version=1;v1.heroes=v1.heroes.slice(0,3);v1.loadouts=v1.loadouts.slice(0,3);
 for(const key of ['inventory','loadouts','nextGearId','dropRemainder','highestWave'])delete v1[key];
 const c=SquadBattleModel.restore(v1);assert.ok(c);assert.equal(c.heroes[0].level,2);assert.equal(c.gold,b.gold);assert.equal(c.inventory.length,0);assert.equal(c.dropRemainder,0);c.settleIdle(29);assert.equal(c.inventory.length,0);c.settleIdle(1);assert.equal(c.inventory.length,1);
});
test('save round-trip retains items, ownership, locks, stats and fractional drop timer',()=>{
 const b=new SquadBattleModel();b.settleIdle(91.5);b.autoEquip(0);b.toggleLock(1);const raw=b.snapshot(),c=SquadBattleModel.restore(JSON.parse(JSON.stringify(raw)));assert.ok(c);assert.deepEqual(c.snapshot(),raw);assert.deepEqual(c.stats(0),b.stats(0));c.settleIdle(28.5);assert.equal(c.inventory.length,4);assert.equal(c.inventory.at(-1).id,4);
});
test('malformed inventory, duplicate IDs, wrong slots and shared equipment invalidate the entire save',()=>{
 const b=new SquadBattleModel();add(b,gear(1,0,{attack:10}));b.equip(0,1,0);
 for(const mutate of [d=>d.inventory.push({...d.inventory[0]}),d=>d.inventory[0].attack=-1,d=>d.inventory[0].level=0,d=>d.inventory[0].slot=6,d=>d.loadouts[1][0]=1,d=>d.loadouts[0][0]=999,d=>d.loadouts[0][1]=1,d=>d.dropRemainder=30,d=>d.nextGearId=1,d=>d.highestWave=0]){const raw=b.snapshot();mutate(raw);assert.equal(SquadBattleModel.restore(raw),null);}
});
test('failed persistence keeps the previous valid equipment save intact',()=>{
 const map=new Map(),port={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},save=new LocalSave(port,SquadBattleModel.restore),b=new SquadBattleModel();b.settleIdle(60);assert.equal(save.save(b.snapshot()),true);const good=map.get(SAVE_KEY);b.autoEquip(0);port.setItem=()=>{throw Error('quota');};assert.equal(save.save(b.snapshot()),false);assert.equal(map.get(SAVE_KEY),good);assert.deepEqual(SquadBattleModel.restore(JSON.parse(good)).loadouts,Array.from({length:4},()=>Array(6).fill(null)));
});
