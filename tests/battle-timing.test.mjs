import {test} from 'node:test';
import assert from 'node:assert/strict';
import {battleDelta} from '../assets/scripts/BattleTiming.ts';
import {SquadBattleModel} from '../assets/scripts/SquadBattleModel.ts';
test('shared battle clock supports 1x/2x, pause and frame safety',()=>{
 assert.equal(battleDelta(.05,false,1),.05);assert.equal(battleDelta(.05,false,2),.1);
 assert.equal(battleDelta(8,false,2),.2);assert.equal(battleDelta(.1,true,2),0);
 for(const dt of [NaN,Infinity,-1,0])assert.equal(battleDelta(dt,false,2),0);
});
test('double speed advances the same finite combat in half the wall time without scaling idle income',()=>{
 const first=new SquadBattleModel(0,()=>.3,3,false),second=new SquadBattleModel(0,()=>.3,3,false);
 const income1=new SquadBattleModel(),income2=new SquadBattleModel();
 for(let i=0;i<50;i++){first.step(battleDelta(.05,false,1));income1.settleIdle(.05);income2.settleIdle(.05);}
 for(let i=0;i<25;i++)second.step(battleDelta(.05,false,2));
 const normalize=s=>JSON.parse(JSON.stringify(s,(_,v)=>typeof v==='number'?Math.round(v*1e8)/1e8:v));assert.deepEqual(normalize(second.snapshot()),normalize(first.snapshot()));assert.equal(income1.gold,income2.gold);assert.equal(income1.dropRemainder,income2.dropRemainder);
});
