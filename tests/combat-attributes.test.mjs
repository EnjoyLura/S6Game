import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel,generateGear,gearUpgradePreview} from '../assets/scripts/SquadBattleModel.ts';
import {attackDamage,combatTotals,validCombatAffixes} from '../assets/scripts/CombatAttributes.ts';
const setup=(id,combat={})=>{const m=new SquadBattleModel(0,()=>0,1,false);m.heroes[id].level=5;m.setFormation([id]);m.inventory=[{id:1,slot:0,quality:4,level:1,hp:0,attack:0,defense:0,power:0,locked:false,enhancement:0,combat}];m.nextGearId=2;m.equip(id,1,0);m.autoSkill=false;return m;};
test('critical multiplier, extra basic strike, armor penetration and separate damage bonuses resolve actual HP',()=>{
 const m=setup(0,{critChance:.5,critDamage:.5,comboChance:.5,basicBonus:.1});const s=m.stats(0),hit=m.step(1)[0];assert.ok(hit.critical&&hit.combo);assert.equal(hit.damage,Math.round(s.attack*1.1*2)*2);assert.equal(m.enemies[0].hp,m.enemies[0].maxHp-hit.damage);assert.equal(m.damage,hit.damage);
 const c=combatTotals([{combat:{armorPen:.5,skillBonus:.2}}]);assert.equal(attackDamage(100,20,c,true,()=>.9).damage,110);assert.equal(attackDamage(100,20,c,false,()=>.9).damage,90);
 const b=setup(1,{skillBonus:.25});b.requestSkill(0);assert.equal(b.step(1)[0].damage,Math.round(b.stats(1).power*1.25));
});
test('dodge prevents damage and does not consume a shield',()=>{const m=setup(0,{dodgeChance:.5});m.heroes[0].shield=100;const hp=m.heroes[0].hp;m.step(1);const hit=m.step(1)[0];assert.ok(hit.dodged);assert.equal(hit.damage,0);assert.equal(hit.blocked,0);assert.equal(m.heroes[0].hp,hp);assert.equal(m.heroes[0].shield,100);});
test('cooldown reductions apply to both skills while heal and shield bonuses affect their own mechanisms',()=>{
 const m=setup(1,{cooldownReduction:.25});m.requestSkill(0);m.step(1);assert.equal(m.heroes[1].cooldown,7*.75);m.requestSkill(0,1);while(!m.step(1).some(h=>h.skillSlot===2)){}assert.equal(m.heroes[1].cooldown2,12*.75);
 const h=setup(2,{healingBonus:.5});h.heroes[2].hp=1;h.requestSkill(0);assert.equal(h.step(1)[0].heal,Math.round(h.stats(2).power*1.5));
 const k=setup(0,{shieldBonus:.5});k.requestSkill(0);k.step(1);assert.equal(k.heroes[0].shield,Math.round(k.stats(0).power*1.5));assert.ok(SquadBattleModel.restore(k.snapshot()));
});
test('affixes persist and deep-copy; old gear works; invalid values cannot enter a save',()=>{
 const m=setup(0,{critChance:.1});const d=m.snapshot(),n=SquadBattleModel.restore(d);assert.ok(n);d.inventory[0].combat.critChance=.6;assert.equal(m.inventory[0].combat.critChance,.1);assert.equal(n.inventory[0].combat.critChance,.1);
 for(const combat of [{evil:.1},{dodgeChance:-1},{critChance:NaN},{critChance:2},[]]){assert.equal(validCombatAffixes(combat),false);const d=m.snapshot();d.inventory[0].combat=combat;assert.equal(SquadBattleModel.restore(d),null);}
 const old=m.snapshot();delete old.inventory[0].combat;assert.ok(SquadBattleModel.restore(old));assert.ok(Array.from({length:30},(_,i)=>generateGear(i+1,1)).some(g=>g.combat));
});
test('breakthrough improves combat affixes while normal upgrades preserve them; retry copies independently',()=>{
 const m=setup(0,{critChance:.1});const g=m.inventory[0];g.level=8;assert.equal(gearUpgradePreview(g).combat.critChance,.1);g.level=9;assert.equal(gearUpgradePreview(g).combat.critChance,.115);assert.equal(g.combat.critChance,.1);
 const retry=new SquadBattleModel();retry.inheritIncome(m);retry.inventory[0].combat.critChance=.2;assert.equal(g.combat.critChance,.1);
 const a=setup(0,{armorPen:.5}),b=setup(0);a.wave=b.wave=11;assert.equal(a.step(1)[0].damage-b.step(1)[0].damage,10);
 assert.equal(combatTotals(Array(6).fill({combat:{dodgeChance:.5,skillBonus:1}})).dodgeChance,.75);assert.equal(combatTotals(Array(6).fill({combat:{skillBonus:1}})).skillBonus,3);
});
