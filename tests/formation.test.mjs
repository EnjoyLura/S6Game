import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,recruit} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave} from '../assets/scripts/LocalSave.ts';
const owned=()=>{const b=new SquadBattleModel(0,()=>.1,3,true);recruit(b.recruitment,0,1,()=>.99);return b;};
test('archer unlock gates progression and equipment; owned reserves gain individual XP',()=>{
 const b=new SquadBattleModel();b.settleIdle(25);assert.equal(b.heroes[3].experience,0);assert.ok(b.upgrade(3));assert.ok(b.autoEquip(3));assert.ok(b.equip(3,null,0));assert.ok(b.setFormation([3]));
 recruit(b.recruitment,0,1,()=>.99);b.settleIdle(25);assert.equal(b.heroes[3].experience,40);assert.equal(b.upgrade(3),null);assert.equal(b.heroes[3].level,2);assert.equal(b.heroes[3].experience,0);assert.equal(b.heroes[0].level,1);assert.equal(b.heroes[0].experience,80);
});
test('formation rejects empty, duplicate, too many and unowned identities atomically',()=>{
 const b=owned();for(const ids of [[],[0,0],[0,1,2,3],[4],[-1],[1.2]]){const before=b.snapshot();assert.ok(b.setFormation(ids));assert.deepEqual(b.snapshot(),before);}assert.equal(b.setFormation([3,2,0]),null);assert.deepEqual(b.formation,[3,2,0]);assert.deepEqual(b.order,[0,2,1,3,4,5]);
});
test('swapping resets current wave without losing equipment, balances or roster progression',()=>{
 const b=owned();b.settleIdle(60);b.upgrade(3);b.autoEquip(3);b.step(10);const old=b.snapshot();assert.equal(b.setFormation([3,1,2]),null);assert.equal(b.wave,old.wave);assert.equal(b.gold,old.gold);assert.equal(b.kills,old.kills);assert.deepEqual(b.loadouts,old.loadouts);assert.equal(b.heroes[3].level,2);assert.equal(b.enemies[0].hp,b.enemies[0].maxHp);assert.equal(b.heroes[3].hp,b.stats(3).hp);assert.equal(b.heroes[3].cooldown,0);
});
test('archer gear and upgrades raise actual targeted skill and basic attack damage',()=>{
 const b=owned();b.settleIdle(25);b.upgrade(3);b.inventory=[{id:1,slot:0,quality:2,level:1,hp:30,attack:20,defense:4,power:40,locked:false}];b.nextGearId=2;assert.equal(b.equip(3,1,0),null);b.setFormation([3]);b.enemies[1].hp=800;const hit=b.step(1)[0];assert.equal(hit.hero,3);assert.equal(hit.actor,0);assert.equal(hit.target,4);assert.equal(hit.damage,348);assert.equal(b.heroes[3].cooldown,7);b.autoSkill=false;const hits=b.step(4);assert.equal(hits.at(-1).damage,187);assert.ok(b.salvage([1]));
 const c=SquadBattleModel.restore(b.snapshot());assert.ok(c);assert.equal(c.owner(1),3);assert.equal(c.stats(3).attack,187);
});
test('knight and priest retain their skill identity after changing positions',()=>{
 const b=owned();b.setFormation([2,3,0]);b.heroes[3].hp=100;const hits=b.step(3);assert.equal(hits[1].hero,0);assert.equal(hits[1].actor,2);assert.equal(hits[1].target,2);assert.equal(b.heroes[0].shield,220);assert.equal(hits[2].hero,2);assert.equal(hits[2].heal,240);assert.equal(hits[2].target,1);
});
test('one and two heroes act and wipe correctly; reserves do not act, heal or prevent regroup',()=>{
 for(const ids of [[3],[3,0]]){const b=owned();b.setFormation(ids);b.party.forEach(h=>h.hp=1);b.autoSkill=false;const reserve=b.heroes[2].hp;for(let i=0;i<10&&!b.regrouping;i++)b.step(1);assert.equal(b.regrouping,true);assert.equal(b.heroes[2].hp,reserve);b.step(2);assert.equal(b.regrouping,false);assert.ok(b.party.every(h=>h.hp>0));assert.equal(b.requestSkill(2),false);}
});
test('v4 migration and v5 reload preserve roster, recruitment and formation; invalid formations rejected',()=>{
 const b=owned();b.settleIdle(30);const old=b.snapshot();old.version=4;old.heroes=old.heroes.slice(0,3);old.loadouts=old.loadouts.slice(0,3);delete old.formation;const migrated=SquadBattleModel.restore(old);assert.ok(migrated);assert.equal(migrated.heroes[3].level,1);assert.equal(migrated.recruitment.counts[3],1);assert.deepEqual(migrated.formation,[0,1,2]);
 b.setFormation([3,0]);b.step(1.5);const snap=b.snapshot(),c=SquadBattleModel.restore(snap);assert.deepEqual(c.snapshot(),snap);assert.deepEqual(c.order,b.order);const retry=new SquadBattleModel();retry.inheritIncome(c);assert.deepEqual(retry.formation,[3,0]);assert.deepEqual(retry.order,[0,1,3]);
 for(const formation of [[],[0,0],[0,1,2,3],[99]]){assert.equal(SquadBattleModel.restore({...snap,formation}),null);}
});
test('save failure supports full formation rollback without losing archers equipment',()=>{
 const b=owned();b.settleIdle(60);b.autoEquip(3);const before=b.snapshot();b.setFormation([3,1]);const saves=new LocalSave({getItem(){return null},setItem(){throw Error('quota');}},SquadBattleModel.restore);assert.equal(saves.save(b.snapshot()),false);assert.deepEqual(SquadBattleModel.restore(before).snapshot(),before);
});


test('saving unchanged formation does not heal, reset cooldowns or restart enemies',()=>{
 const b=owned();b.setFormation([3,0]);b.step(2);const before=b.snapshot();assert.equal(b.setFormation([3,0]),null);assert.deepEqual(b.snapshot(),before);
 b.autoSkill=false;b.heroes[3].cooldown=0;assert.equal(b.requestSkill(0),true);const hits=b.step(4);assert.ok(hits.some(h=>h.hero===3&&h.skill));
});
