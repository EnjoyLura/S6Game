import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,recruit,starSpent} from '../assets/scripts/SquadBattleModel.ts';
import {LocalSave} from '../assets/scripts/LocalSave.ts';
const copies=(b,id,n)=>{for(let i=0;i<n;i++){let turn=0;recruit(b.recruitment,0,1,()=>turn++===0?.8:(id+.1)/4);}};
test('star costs consume only duplicates, preserve ownership and cap at five stars',()=>{
 const b=new SquadBattleModel();copies(b,0,10);const counts=b.recruitment.counts.slice();for(let star=1;star<5;star++){assert.equal(b.starPreview(0).cost,star);assert.equal(b.starUp(0),null);assert.equal(b.spareCopies(0),10-starSpent(star+1));}assert.equal(b.heroes[0].stars,5);assert.equal(b.spareCopies(0),0);assert.deepEqual(b.recruitment.counts,counts);assert.ok(b.owns(0));const before=b.snapshot();assert.ok(b.starUp(0));assert.deepEqual(b.snapshot(),before);
});
test('unowned, invalid, insufficient and missing next-star duplicates never mutate',()=>{
 const b=new SquadBattleModel();for(const id of [-1,4,NaN,3,0]){const before=b.snapshot();assert.ok(b.starUp(id));assert.deepEqual(b.snapshot(),before);}copies(b,3,2);assert.equal(b.starUp(3),null);assert.equal(b.spareCopies(3),0);assert.ok(b.owns(3));assert.ok(b.starUp(3));copies(b,3,1);assert.equal(b.spareCopies(3),1);assert.equal(b.recruitment.last[0].fresh,false);assert.ok(SquadBattleModel.restore(b.snapshot()));
});
test('preview matches stat formula and gear stays additive; HP ratio, cooldown and death preserved',()=>{
 const b=new SquadBattleModel();copies(b,1,1);b.heroes[1].experience=40;b.upgrade(1);b.inventory=[{id:1,slot:0,quality:1,level:1,hp:100,attack:20,defense:5,power:30,locked:false,enhancement:0}];b.nextGearId=2;b.equip(1,1,0);b.heroes[1].hp=666;b.heroes[1].cooldown=3;b.heroes[1].queued=true;const p=b.starPreview(1);assert.equal(b.starUp(1),null);assert.deepEqual(b.stats(1),p.after);assert.equal(b.stats(1).hp,1517);assert.equal(b.stats(1).attack,203);assert.equal(b.stats(1).power,429);assert.equal(b.heroes[1].hp,758);assert.equal(b.heroes[1].cooldown,3);assert.equal(b.heroes[1].queued,true);copies(b,1,2);b.heroes[1].hp=0;b.starUp(1);assert.equal(b.heroes[1].hp,0);
});
test('all four signature skills and basic attacks use star-enhanced combat values in arbitrary slots',()=>{
 for(let id=0;id<4;id++){const b=new SquadBattleModel(0,()=>0,3,true);copies(b,id,id===3?2:1);b.starUp(id);b.setFormation(id===2?[1,2]:[id]);if(id===2)b.heroes[1].hp=100;const hits=b.step(id===2?2:1),hit=hits.find(h=>h.hero===id);assert.ok(hit.skill);if(id===0)assert.equal(b.heroes[0].shield,275);else if(id===2)assert.equal(hit.heal,300);else assert.equal(hit.damage,b.stats(id).power);if(id!==2){b.autoSkill=false;assert.equal(b.step(4).at(-1).damage,b.stats(id).attack);}}
});
test('v5 migration defaults to one star; v6 reload/retry preserve consumption and reject forged stars',()=>{
 const b=new SquadBattleModel();copies(b,0,3);const old=b.snapshot();old.version=5;old.heroes.forEach(h=>delete h.stars);const migrated=SquadBattleModel.restore(old);assert.ok(migrated);assert.equal(migrated.spareCopies(0),3);b.starUp(0);b.starUp(0);const c=SquadBattleModel.restore(b.snapshot());assert.deepEqual(c.snapshot(),b.snapshot());const retry=new SquadBattleModel();retry.inheritIncome(c);assert.equal(retry.heroes[0].stars,3);assert.equal(retry.spareCopies(0),0);assert.equal(retry.stats(0).power,330);
 for(const stars of [0,6,1.5,NaN,4]){const raw=b.snapshot();raw.heroes[0].stars=stars;assert.equal(SquadBattleModel.restore(raw),null);}const raw=b.snapshot();delete raw.heroes[0].stars;assert.equal(SquadBattleModel.restore(raw),null);
});
test('failed star save can roll back stats and duplicate budget together',()=>{
 const b=new SquadBattleModel();copies(b,0,1);const before=b.snapshot();b.starUp(0);const saves=new LocalSave({getItem(){return null},setItem(){throw Error('quota');}},SquadBattleModel.restore);assert.equal(saves.save(b.snapshot()),false);const rollback=SquadBattleModel.restore(before);assert.equal(rollback.heroes[0].stars,1);assert.equal(rollback.spareCopies(0),1);assert.deepEqual(rollback.snapshot(),before);
});
