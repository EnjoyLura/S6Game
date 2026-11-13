import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BattleModel, CONFIG } from '../assets/scripts/BattleModel.ts';
test('manual skill uses the knight turn, shield absorbs hits',()=>{
 const b=new BattleModel();b.autoSkill=false;assert.ok(b.requestSkill());
 assert.equal(b.step(1.25)[0].skill,true);assert.equal(b.enemyHp,940);
 assert.equal(b.step(1.25)[0].blocked,105);assert.equal(b.hp,1980);
 assert.equal(b.requestSkill(),false);
});
test('pause and post battle never consume cooldown',()=>{
 const b=new BattleModel();b.step(1.25);const c=b.cooldown;b.paused=true;b.step(100);assert.equal(b.cooldown,c);
 b.paused=false;b.enemyHp=1;b.autoSkill=false;b.step(2.5);assert.equal(b.result,'victory');const time=b.elapsed;b.step(100);assert.equal(b.elapsed,time);
});
test('simulation outcome independent of frame size',()=>{
 const a=new BattleModel(),b=new BattleModel();a.step(50);for(let i=0;i<5000;i++)b.step(.01);
 assert.equal(a.result,'victory');assert.equal(a.hp,b.hp);assert.equal(a.actions,b.actions);assert.equal(a.damage,CONFIG.slimeHp);
});
test('death ends combat, fresh challenge resets all state',()=>{
 const b=new BattleModel();b.autoSkill=false;b.hp=1;b.step(2.5);assert.equal(b.result,'defeat');assert.equal(b.hp,0);
 const reset=new BattleModel();assert.equal(reset.hp,1980);assert.equal(reset.cooldown,0);assert.equal(reset.actions,0);
});
