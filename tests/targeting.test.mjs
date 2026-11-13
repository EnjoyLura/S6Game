import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquadBattleModel} from '../assets/scripts/SquadBattleModel.ts';
test('equal intervals select every living enemy uniformly, never dead enemies',()=>{
 let r=0;const b=new SquadBattleModel(0,()=>r,3),counts=[0,0,0];
 for(let i=0;i<6000;i++){r=(i+.5)/6000;counts[b.selectEnemy()-3]++;}
 assert.deepEqual(counts,[2000,2000,2000]);b.enemies[1].hp=0;
 const survivors=[0,0,0];for(let i=0;i<6000;i++){r=(i+.5)/6000;survivors[b.selectEnemy()-3]++;}
 assert.deepEqual(survivors,[3000,0,3000]);b.enemies.forEach(e=>e.hp=0);assert.equal(b.selectEnemy(),-1);
});
test('basic attacks draw independently instead of following slot order',()=>{
 const values=[.9,.1,.5];const b=new SquadBattleModel(0,()=>values.shift()??0,3);b.autoSkill=false;
 assert.deepEqual(b.step(3).map(h=>h.target),[5,3,4]);
});
test('targeted rules override random and fall back when preferred enemy dies',()=>{
 const b=new SquadBattleModel(0,()=>.99,3);
 assert.equal(b.selectEnemy({preferred:3}),3);b.enemies[0].hp=0;assert.equal(b.selectEnemy({preferred:3}),5);
 b.enemies[1].hp=1;assert.equal(b.selectEnemy('lowest-hp-ratio'),4);
 b.enemies[1].attack=999;assert.equal(b.selectEnemy('highest-attack'),4);
});
test('fire chooses random enemies while guard and heal remain directed; hits preserve impact HP',()=>{
 const b=new SquadBattleModel(0,()=>.99,3);b.heroes[1].hp=500;
 const hits=b.step(3);assert.deepEqual(hits.map(h=>h.target),[5,0,1]);
 assert.equal(hits[0].hpAfter,b.enemies[2].hp);assert.equal(hits[1].shieldAfter,220);assert.equal(hits[2].hpAfter,740);
 const c=new SquadBattleModel(0,()=>.5,3);c.autoSkill=false;c.requestSkill(1);assert.equal(c.step(1)[0].target,4);
});
