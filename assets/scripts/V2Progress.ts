/** Second-edition test configuration. Persisted in the existing atomic save. */
export const V2_CONFIG={initialUpTickets:60,initialCapacity:200,capacityStep:50,capacityCost:500,quickSeconds:1800,quickCost:10,gearCap:100};
export const FORMATIONS=[{name:'守护阵',rates:[60,25,15]},{name:'双锋阵',rates:[40,40,20]},{name:'均衡阵',rates:[34,33,33]},{name:'突击阵',rates:[70,15,15]}];
export type V2Progress={upTickets:number;capacity:number;presets:number[][];preset:number;formation:number;tree:number[][]};
export const initialV2=():V2Progress=>({upTickets:60,capacity:200,presets:[[0,1,2],[0,1,2],[0,1,2],[0,1,2]],preset:0,formation:0,tree:Array.from({length:4},()=>Array(15).fill(0))});
export function validV2(p:V2Progress){return !!p&&Array.isArray(p.tree)&&p.tree.length===4&&p.tree.every(a=>Array.isArray(a)&&a.length===15&&a.every((v,i)=>[0,1].indexOf(v)>=0&&(!v||i%5===0||a[i-1]===1)))&&Number.isSafeInteger(p.upTickets)&&p.upTickets>=0&&p.upTickets<=1e9&&Number.isSafeInteger(p.capacity)&&p.capacity>=50&&p.capacity<=1e6&&Number.isInteger(p.preset)&&p.preset>=0&&p.preset<4&&Number.isInteger(p.formation)&&p.formation>=0&&p.formation<4&&Array.isArray(p.presets)&&p.presets.length===4&&p.presets.every(a=>Array.isArray(a)&&a.length>0&&a.length<=3&&new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<4));}

// Five trunk nodes, five left branches, five right branches; every purchase is independent.
export const TREE_NODES=Array.from({length:15},(_,i)=>({name:i<5?['主动强化','被动专精','技能增幅','治疗护盾','技能流转'][i]:i<10?'坚韧 '+(i-4):'锋芒 '+(i-9),description:i<5?i===4?'第二主动冷却减少1秒':'两个主动技能效果 +4%':i<10?'最大生命 +4%，防御 +2':'普通攻击伤害 +4%',cost:1,parent:i%5===0?-1:i-1}));
export function treeBonuses(p:V2Progress,id:number){const a=p.tree?.[id]||[];return {hp:a.slice(5,10).reduce((n,r)=>n+r,0)*.04,attack:a.slice(10,15).reduce((n,r)=>n+r,0)*.04,power:a.slice(0,4).reduce((n,r)=>n+r,0)*.04,defense:a.slice(5,10).reduce((n,r)=>n+r,0)*2,cooldown:a[4]||0};}
