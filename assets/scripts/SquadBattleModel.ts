import {initialV2,validV2,FORMATIONS,V2_CONFIG,TREE_NODES,treeBonuses} from './V2Progress.ts';
// Dungeon values are test tuning; all clocks use milliseconds and the local calendar.
export const DUNGEON_CONFIG={staminaCap:120,recoverMs:6*60*1000,dailyLimit:2,costs:[10,15,20],scales:[1,1.7,2.6],mobWaves:10};
export const DUNGEONS=[
 {name:'金币宝库',drop:'金币产出',kind:0},
 {name:'历练营地',drop:'英雄经验',kind:3},
 {name:'锻造矿洞',drop:'强化材料',kind:2},
 {name:'遗落秘境',drop:'装备掉落',kind:1},
 {name:'蘑菇守卫战',drop:'金币 · 经验 · 强化材料',kind:1},
 {name:'无尽之塔',drop:'无限关卡 · 阵亡后结算',kind:0},
];
export const DIFFICULTIES=['普通','困难','噩梦'];
export type DungeonReceipt={gold:number;experience:number;materials:number;gear:number;salvaged:number;cleared:number};
export type DungeonEncounter={id:number;difficulty:number;startFloor:number};
export type DungeonRun={id:number;difficulty:number;floor:number;battle:any;receipt?:DungeonReceipt};
export type DungeonProgress={stamina:number;anchor:number;clock:number;day:number;dailyUsed:number;floor:number;run:DungeonRun|null};
export const initialDungeon=():DungeonProgress=>({stamina:120,anchor:0,clock:0,day:0,dailyUsed:0,floor:1,run:null});
export const localDay=(ms:number)=>{const d=new Date(ms);return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();};
export function recoverDungeon(p:DungeonProgress,now:number){
 if(!Number.isSafeInteger(now)||now<=0)return;
 now=Math.max(now,p.clock);p.clock=now;
 const day=localDay(now);if(day>p.day){p.day=day;p.dailyUsed=0;}
 if(!p.anchor){p.anchor=now;return;}
 if(p.stamina>=DUNGEON_CONFIG.staminaCap){p.anchor=now;return;}
 const recovered=Math.floor((now-p.anchor)/DUNGEON_CONFIG.recoverMs);
 if(recovered>0){p.stamina=Math.min(DUNGEON_CONFIG.staminaCap,p.stamina+recovered);p.anchor=p.stamina===DUNGEON_CONFIG.staminaCap?now:p.anchor+recovered*DUNGEON_CONFIG.recoverMs;}
}
export function validDungeon(p:DungeonProgress){
 const int=(v:any,max=1e15)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
 if(!p||!int(p.stamina,120)||!int(p.anchor)||!int(p.clock)||p.anchor>p.clock||!int(p.day,99991231)||!int(p.dailyUsed,2)||!int(p.floor,1e12)||p.floor<1)return false;
 const r=p.run;return r===null||!!r&&int(r.id,5)&&int(r.difficulty,2)&&int(r.floor,1e12)&&r.floor>=1&&!!r.battle&&r.battle.version===9&&r.battle.continuous===false&&r.battle.count===3&&(!r.receipt||['gold','experience','materials','gear','salvaged','cleared'].every(k=>int((r.receipt as any)[k]))&&r.battle.result!=='fighting'&&r.receipt.cleared===r.battle.clearedWaves);
}
export function dungeonReward(id:number,difficulty:number,floor=1){
 const scale=difficulty+1,layer=id===5?floor:1;
 return {gold:([3000,0,0,0,1500,500][id]||0)*scale*layer,experience:([0,1200,0,0,600,100][id]||0)*scale*layer,materials:([0,0,30,0,15,5][id]||0)*scale,gear:id===3?scale:0,level:Math.min(100,12+difficulty*6)};
}

export const RECRUIT_CONFIG={initialTickets:60,epicPity:10,legendPity:30,legendRate:.05,epicRate:.2,upMageRate:.5};
export const RECRUIT_HEROES=['骑士','法师','牧师','弓箭手'];
export type RecruitResult={id:number;pool:number;hero:number;rarity:number;fresh:boolean};
export function initialRecruit(){return {tickets:RECRUIT_CONFIG.initialTickets,counts:[1,1,1,0],pity:[{epic:0,legend:0,total:0},{epic:0,legend:0,total:0}],history:[] as RecruitResult[],last:[] as RecruitResult[]};}
export type RecruitState=ReturnType<typeof initialRecruit>;
export function validRecruit(r:RecruitState){const integer=(v:any,max=1e9)=>Number.isInteger(v)&&v>=0&&v<=max;
 if(!r||!integer(r.tickets)||!Array.isArray(r.counts)||r.counts.length!==4||!r.counts.every(n=>integer(n))||r.counts.slice(0,3).some(n=>n<1)||!Array.isArray(r.pity)||r.pity.length!==2||!r.pity.every(p=>p&&integer(p.epic,9)&&integer(p.legend,29)&&integer(p.total)))return false;
 const total=r.pity[0].total+r.pity[1].total;
 const valid=(a:any)=>Array.isArray(a)&&a.every((x,i)=>x&&integer(x.id,total)&&x.id>0&&integer(x.pool,1)&&integer(x.hero,3)&&integer(x.rarity,2)&&typeof x.fresh==='boolean'&&(i===0||x.id>a[i-1].id));
 return valid(r.history)&&r.history.length===Math.min(total,100)&&valid(r.last)&&(total===0?r.last.length===0:[1,10].indexOf(r.last.length)>=0)&&JSON.stringify(r.last)===JSON.stringify(r.history.slice(-r.last.length||r.history.length))&&r.counts.reduce((a,b)=>a+b,0)===total+3;
}
export function recruit(state:RecruitState,pool:number,n:number,random= Math.random):string|null{
 if([0,1].indexOf(pool)<0||[1,10].indexOf(n)<0)return '无效的招募请求';
 if(state.tickets<n)return '招募券不足，需要'+n+'张，当前'+state.tickets+'张';
 const next=JSON.parse(JSON.stringify(state)) as RecruitState,p=next.pity[pool];next.last=[];
 const roll=()=>{const v=random();if(!Number.isFinite(v)||v<0||v>=1)throw Error('invalid random');return v;};
 try{for(let i=0;i<n;i++){
 const r=roll();const rarity=p.legend+1>=RECRUIT_CONFIG.legendPity||r<RECRUIT_CONFIG.legendRate?2:p.epic+1>=RECRUIT_CONFIG.epicPity||r<RECRUIT_CONFIG.legendRate+RECRUIT_CONFIG.epicRate?1:0;
 const hero=pool===1&&rarity===2?1:pool===1&&roll()<RECRUIT_CONFIG.upMageRate?1:Math.floor(roll()*4);
 const result={id:next.pity[0].total+next.pity[1].total+1,pool,hero,rarity,fresh:next.counts[hero]===0};next.counts[hero]++;p.total++;p.epic=rarity>=1?0:p.epic+1;p.legend=rarity===2?0:p.legend+1;next.last.push(result);next.history.push(result);
 }}catch{return '招募随机数据异常，未扣券';}
 next.tickets-=n;next.history=next.history.slice(-100);Object.assign(state,next);return null;
}

// Temporary roster tuning, not final progression values.
export const HERO_CONFIG = [
  { name:'骑士', hp:1980, attack:128, speed:100, skill:'守护', cooldown:8, power:220 },
  { name:'法师', hp:1120, attack:145, speed:110, skill:'火焰', cooldown:7, power:290 },
  { name:'牧师', hp:1260, attack:75, speed:95, skill:'治愈', cooldown:9, power:240 },
  { name:'弓箭手', hp:1180, attack:152, speed:120, skill:'精准射击', cooldown:7, power:280 },
];
// Test tuning: active, passive, active, passive.
export const SKILL_LEVELS=[1,3,5,8];
export const SKILL_NAMES=[['守护','坚韧','盾击','守护精通'],['火焰','奥术专注','炎爆','烈焰精通'],['治愈','虔诚','强效治疗','治愈精通'],['精准射击','猎手','穿心箭','精准精通']];
export const TALENTS=[
 {name:'生命强化',max:3,cost:1,description:'每级最大生命 +10%'},
 {name:'攻击强化',max:3,cost:1,description:'每级普攻攻击 +10%'},
 {name:'技能强化',max:3,cost:1,description:'每级两个主动效果 +10%'},
 {name:'技能流转',max:1,cost:2,description:'需技能强化1级；第二主动冷却12秒→8秒'},
];
export const SECOND_COOLDOWN=12;
export const EQUIPMENT_PARTS=['武器','戒指','项链','头盔','衣服','鞋子'];
export const QUALITY_NAMES=['普通','优秀','稀有','史诗','传说'];
export const OFFLINE_CONFIG={capSeconds:8*60*60,tickSeconds:5,goldPerTick:10,experiencePerTick:8,gearSeconds:30};
export type OfflineReward={seconds:number;gold:number;experience:number[];equipment:Gear[];checkpoint:number};
export const DROP_SECONDS=30;
// Runtime resume/stall gaps are not offline reward time. Model tests may still settle explicit durations.
export const foregroundRewardDelta=(seconds:number)=>Number.isFinite(seconds)&&seconds>0&&seconds<=60?seconds:0;
export const GEAR_ART=[[0,3],[1,2],[2,1],[3,2],[4,3],[5,1],[0,4],[0,1],[2,2],[0,1],[3,0],[4,2],[0,3],[1,2],[2,1],[3,3],[4,2],[5,1]];
export type Gear={id:number;slot:number;quality:number;level:number;hp:number;attack:number;defense:number;power:number;locked:boolean;enhancement?:number;effects?:('attack'|'hp')[]};
export type GearAttribute='hp'|'attack'|'defense'|'power';
export const validGearEffects=(g:Gear)=>g.effects===undefined||Array.isArray(g.effects)&&g.effects.length<=(g.quality===4?2:g.quality===3?1:0)&&new Set(g.effects).size===g.effects.length&&g.effects.every(e=>e==='attack'||e==='hp');
export const GEAR_ATTRIBUTE_NAMES={hp:'生命',attack:'攻击',defense:'防御',power:'技能效果'};
export const gearPrimary=(g:Gear):GearAttribute=>(['attack','attack','power','defense','hp','hp'] as GearAttribute[])[g.slot];
export function gearUpgradePreview(g:Gear){
 const next={...g,level:Math.min(100,g.level+1)},primary=gearPrimary(g),breakthrough=g.level%10===9;
 if(g.level>=100)return next;
 for(const key of ['hp','attack','defense','power'] as const)if(g[key]&&(key===primary||breakthrough))next[key]=Math.min(1e6,Math.ceil(g[key]*(key===primary?1.1:1.15)));
 return next;
}
export type RetentionRules={enabled:boolean;minQuality:number;minLevel:number;attributes:GearAttribute[]};
export const ENHANCE_CAP=10;
export const gearStats=(g:Gear)=>{const scale=10+(g.enhancement||0);return {hp:Math.ceil(g.hp*scale/10),attack:Math.ceil(g.attack*scale/10),defense:Math.ceil(g.defense*scale/10),power:Math.ceil(g.power*scale/10)};};
export const enhanceCost=(g:Gear)=>(g.quality+1)*5*((g.enhancement||0)+1);
export const investedMaterials=(g:Gear)=>(g.quality+1)*5*(g.enhancement||0)*((g.enhancement||0)+1)/2;
export const salvageValue=(g:Gear)=>(g.quality+1)*3+g.level+investedMaterials(g);
export const gearScore=(g:Gear)=>{const v=gearStats(g);return v.hp/10+v.attack*2+v.defense*3+v.power;};
export const gearName=(g:Gear)=>QUALITY_NAMES[g.quality]+EQUIPMENT_PARTS[g.slot]+(g.enhancement?' +'+g.enhancement:'');
export const gearDescription=(g:Gear)=>{const v=gearStats(g);return [['生命',v.hp],['攻击',v.attack],['防御',v.defense],['技能效果',v.power]].filter(x=>Number(x[1])>0).map(x=>x[0]+' +'+x[1]).join(' · ');};
export const validRules=(r:RetentionRules)=>!!r&&typeof r.enabled==='boolean'&&Number.isInteger(r.minQuality)&&r.minQuality>=0&&r.minQuality<=5&&Number.isInteger(r.minLevel)&&r.minLevel>=0&&r.minLevel<=100&&Array.isArray(r.attributes)&&r.attributes.length<=4&&new Set(r.attributes).size===r.attributes.length&&r.attributes.every(k=>['hp','attack','defense','power'].indexOf(k)>=0);
// Separate deterministic loot stream: frame size and combat RNG never affect drops.
export function generateGear(id:number,level:number):Gear{
 let seed=(id*2654435761)>>>0;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 const [slot,quality]=GEAR_ART[Math.floor(random()*GEAR_ART.length)];
 const g:Gear={id,slot,quality,level,hp:0,attack:0,defense:0,power:0,locked:false};
 const scale=(1+(level-1)*.12)*(1+quality*.35);
 const main=['attack','attack','power','defense','hp','hp'][slot] as 'hp'|'attack'|'defense'|'power';
 g[main]=Math.round(({hp:100,attack:16,defense:7,power:22})[main]*scale);
 const secondary=(['hp','attack','defense','power'] as const).filter(k=>k!==main),key=secondary[Math.floor(random()*secondary.length)];
 g[key]=Math.round(({hp:40,attack:6,defense:3,power:9})[key]*scale*(.8+random()*.4));
 if(quality>=3){const count=Math.floor(random()*(quality===4?3:2));g.effects=count===2?['attack','hp']:count===1?[random()<.5?'attack':'hp']:[];}return g;
}
export const STAR_CONFIG={cap:5,costs:[1,2,3,4],attributePerStar:.15,skillPerStar:.25};
export const starSpent=(stars:number)=>STAR_CONFIG.costs.slice(0,stars-1).reduce((a,b)=>a+b,0);
export const LEVEL_CAP=100;
export const upgradeCost=(level:number)=>40*level;
export const MONSTERS = [
  {name:'嫩叶史莱姆',hp:2400,attack:230}, {name:'橙帽蘑菇',hp:2600,attack:245},
  {name:'圆壳蜗牛',hp:2800,attack:250}, {name:'芽芽树桩',hp:3000,attack:265},
];
export type EnemyTargetRule='random'|'lowest-hp-ratio'|'highest-attack'|{preferred:number};
// Skills may override this independently of basic attacks. Current fire stays random.
export const FIRE_TARGET:EnemyTargetRule='random';
export type SquadHit = {actor:number;hero?:number;target:number;damage:number;blocked:number;heal:number;skill:boolean;skillSlot?:number;killed?:boolean;hpAfter:number;shieldAfter:number};
// Combat indices 0..2 are formation slots, not roster IDs; 3..5 are enemies.
export class SquadBattleModel {
  encounter:DungeonEncounter|null=null;
  interfaceProgress=initialV2();
  dungeon:DungeonProgress=initialDungeon();
  refreshDungeon(now:number){recoverDungeon(this.dungeon,now);}
  startDungeon(id:number,difficulty:number,now:number){
    if(!Number.isInteger(id)||id<0||id>=DUNGEONS.length||!Number.isInteger(difficulty)||difficulty<0||difficulty>2)return '无效的副本或难度';
    this.refreshDungeon(now);const p=this.dungeon;if(p.run)return '已有进行中的挑战，请先继续或结束';
    if(!p.clock)return '时间异常，请重试';
    if(id===4&&p.dailyUsed>=DUNGEON_CONFIG.dailyLimit)return '今日挑战次数已用完，明日再来';
    const cost=DUNGEON_CONFIG.costs[difficulty];if(p.stamina<cost)return '体力不足，需要'+cost+'点';
    const battle=new SquadBattleModel(DUNGEONS[id].kind,Math.random,3,false);battle.inheritIncome(this);battle.dungeon=initialDungeon();battle.offline=null;battle.paused=false;
    battle.encounter={id,difficulty,startFloor:1};battle.wave=1;battle.kills=0;battle.clearedWaves=0;battle.spawn();
    const snapshot:any=battle.snapshot();snapshot.version=9;delete snapshot.dungeon;
    p.stamina-=cost;if(id===4)p.dailyUsed++;p.run={id,difficulty,floor:p.floor,battle:snapshot};return null;
  }
  /** Receipt and balances are saved atomically; retaining the run keeps the result screen resumable. */
  settleDungeon(){
    const p=this.dungeon,r=p.run;if(!r)return '没有进行中的挑战';if(r.receipt)return null;
    const battle=SquadBattleModel.restore(r.battle);if(!battle||battle.result==='fighting')return '挑战尚未结束';
    const cleared=battle.clearedWaves;
    const reward=r.id===5?{gold:500*(r.difficulty+1)*cleared,experience:100*(r.difficulty+1)*cleared,materials:5*(r.difficulty+1)*cleared,gear:0,level:1}:battle.result==='victory'?dungeonReward(r.id,r.difficulty):{gold:0,experience:0,materials:0,gear:0,level:1};
    this.gold+=reward.gold;this.heroes.forEach((h,i)=>{if(this.owns(i))h.experience+=reward.experience;});
    const materials=this.materials;this.materials+=reward.materials;let kept=0,salvaged=0;
    for(let i=0;i<reward.gear;i++){const g=generateGear(this.nextGearId++,reward.level);this.inventory.push(g);if(this.inventory.length>this.interfaceProgress.capacity||this.rules.enabled&&!this.retained(g)){this.salvage([g.id]);this.autoSalvaged++;salvaged++;}else kept++;}
    if(r.id===5)p.floor=Math.max(p.floor,cleared+1);
    r.receipt={gold:reward.gold,experience:reward.experience,materials:this.materials-materials,gear:kept,salvaged,cleared};return null;
  }
  finishDungeon(){const r=this.dungeon.run;if(!r)return '没有进行中的挑战';if(r.battle.result!=='victory')return '挑战尚未胜利';const error=this.settleDungeon();if(!error)this.dungeon.run=null;return error;}
  exitDungeon(){if(!this.dungeon.run?.receipt)return '请先完成结算';this.dungeon.run=null;return null;}
  retryDungeon(now:number){
    const r=this.dungeon.run;if(!r?.receipt)return '请先完成结算';this.dungeon.run=null;
    const error=this.startDungeon(r.id,r.difficulty,now);if(error)this.dungeon.run=r;return error;
  }
  abandonDungeon(){if(!this.dungeon.run)return '没有进行中的挑战';this.dungeon.run=null;return null;}
  lastSeen=0;offline:OfflineReward|null=null;
  markSeen(now:number){if(Number.isFinite(now)&&now>0)this.lastSeen=Math.max(this.lastSeen,Math.floor(now));}
  prepareOffline(now:number){
    if(!Number.isFinite(now)||now<=0)return false;now=Math.floor(now);
    if(!this.lastSeen){this.markSeen(now);return false;}
    const seconds=Math.min(OFFLINE_CONFIG.capSeconds-(this.offline?.seconds||0),Math.max(0,Math.floor((now-this.lastSeen)/1000)));
    this.markSeen(now);const ticks=Math.floor(seconds/OFFLINE_CONFIG.tickSeconds);if(!ticks)return false;
    const checkpoint=this.highestWave,scale=1+Math.floor((checkpoint-1)/5),earned=ticks*OFFLINE_CONFIG.tickSeconds;
    const reward=this.offline||{seconds:0,gold:0,experience:[0,0,0,0],equipment:[],checkpoint};
    reward.seconds+=earned;reward.gold+=ticks*OFFLINE_CONFIG.goldPerTick*scale;reward.checkpoint=Math.max(reward.checkpoint,checkpoint);
    reward.experience=reward.experience.map((v,i)=>v+(this.owns(i)?ticks*OFFLINE_CONFIG.experiencePerTick*scale:0));
    const drops=Math.floor(reward.seconds/OFFLINE_CONFIG.gearSeconds)-Math.floor((reward.seconds-earned)/OFFLINE_CONFIG.gearSeconds);
    for(let n=0;n<drops;n++)reward.equipment.push(generateGear(this.nextGearId++,Math.min(100,1+Math.floor((checkpoint-1)/3))));
    this.offline=reward;return true;
  }
  claimOffline(){
    const r=this.offline;if(!r)return '没有待领取收益';this.gold+=r.gold;r.experience.forEach((v,i)=>this.heroes[i].experience+=v);
    for(const gear of r.equipment){this.inventory.push({...gear});if(this.inventory.length>this.interfaceProgress.capacity||this.rules.enabled&&!this.retained(gear)){this.salvage([gear.id]);this.autoSalvaged++;}}
    this.offline=null;return null;
  }
  quickSweep(){
    if(this.dungeon.stamina<V2_CONFIG.quickCost)return {error:'体力不足',reward:null as OfflineReward|null};
    const pending=this.offline,seen=this.lastSeen,now=Math.max(Date.now(),seen);
    this.offline=null;this.lastSeen=now-V2_CONFIG.quickSeconds*1000;this.prepareOffline(now);
    const reward=this.offline as OfflineReward|null;this.claimOffline();this.offline=pending;this.lastSeen=seen;this.dungeon.stamina-=V2_CONFIG.quickCost;
    return {error:null,reward};
  }
  materials=0;autoSalvaged=0;rules:RetentionRules={enabled:false,minQuality:2,minLevel:0,attributes:[]};
  recruitment=initialRecruit();
  formation=[0,1,2];
  owns(i:number){return Number.isInteger(i)&&i>=0&&i<HERO_CONFIG.length&&this.recruitment.counts[i]>0;}
  get party(){return this.formation.map(i=>this.heroes[i]);}
  battleStats(slot:number){return this.stats(this.formation[slot]);}
  setFormation(ids:number[]){
    if(!Array.isArray(ids)||ids.length<1||ids.length>3||new Set(ids).size!==ids.length||!ids.every(i=>this.owns(i)))return "请选择1至3位已招募且不重复的英雄";
    if(ids.join()===this.formation.join())return null;
    this.formation=ids.slice();this.party.forEach((h,i)=>{h.hp=this.battleStats(i).hp;h.shield=0;h.cooldown=0;h.queued=false;h.cooldown2=0;h.queued2=false;});
    this.result="fighting";this.waveDelay=0;this.regrouping=false;this.spawn();return null;
  }
  setBattleFormation(ids:number[]){
    if(this.result!=='fighting')return '战斗已结束';
    if(!Array.isArray(ids)||ids.length<1||ids.length>3||new Set(ids).size!==ids.length||!ids.every(i=>this.owns(i)))return '请选择1至3位已招募且不重复的英雄';
    if(ids.every(i=>this.heroes[i].hp<=0))return '至少需要一位存活英雄';
    const next=this.order[this.cursor],hero=next<3?this.formation[next]:-1;
    this.formation=ids.slice();this.buildOrder();const actor=next>=3?next:this.formation.indexOf(hero);
    this.cursor=Math.max(0,this.order.indexOf(actor));return null;
  }
  private buildOrder(){this.order=[...this.formation.map((_,i)=>i).sort((a,b)=>this.battleStats(b).speed-this.battleStats(a).speed),...this.enemies.map((_,i)=>i+3)];}
  inventory:Gear[]=[];loadouts:(number|null)[][]=Array.from({length:4},()=>Array(6).fill(null));nextGearId=1;dropRemainder=0;highestWave=1;
  heroes=HERO_CONFIG.map(c=>({hp:c.hp,shield:0,cooldown:0,queued:false,cooldown2:0,queued2:false,damage:0,healing:0,experience:0,level:1,stars:1,talents:[0,0,0,0]}));
  enemies:{kind:number;hp:number;maxHp:number;attack:number}[]=[];
  elapsed=0; actions=0; damage=0; received=0; autoSkill=true; paused=false;
  idleElapsed=0;private incomeRemainder=0;
  wave=1;kills=0;gold=0;clearedWaves=0;waveDelay=0;regrouping=false;
  result:'fighting'|'victory'|'defeat'='fighting';
  order:number[]=[]; private cursor=0; private timer=0;
  monsterIndex:number; private random:()=>number; private count:number; private continuous:boolean;
  constructor(monsterIndex=0,random:()=>number=Math.random,count=1,continuous=false){
    this.monsterIndex=monsterIndex;this.random=random;this.count=Math.max(1,Math.min(3,count));this.continuous=continuous;this.spawn();
  }
  equipment(i:number){return this.loadouts[i].map(id=>this.inventory.find(g=>g.id===id)||null);}
  owner(id:number){return this.loadouts.findIndex(slots=>slots.indexOf(id)>=0);}
  stats(i:number,stars=this.heroes[i].stars){const tree=treeBonuses(this.interfaceProgress,i),base=HERO_CONFIG[i],scale=1+(this.heroes[i].level-1)*.1,attr=1+(stars-1)*STAR_CONFIG.attributePerStar,skill=1+(stars-1)*STAR_CONFIG.skillPerStar,gear=this.equipment(i);const effect=(key:'hp'|'attack')=>1+gear.reduce((n,g)=>n+(g?.effects&&g.effects.indexOf(key)>=0?1:0),0)*.05;const sum=(key:'hp'|'attack'|'defense'|'power')=>gear.reduce((n,g)=>n+(g?gearStats(g)[key]:0),0);return {...base,hp:Math.round((base.hp*scale*attr+sum('hp'))*(1+this.heroes[i].talents[0]*.1+tree.hp)*effect('hp')),attack:Math.round((base.attack*scale*attr+sum('attack'))*(this.unlocked(i,1)&&i===3?1.15:1)*(1+this.heroes[i].talents[1]*.1+tree.attack)*effect('attack')),defense:tree.defense+sum('defense')+(this.unlocked(i,1)&&i===0?25:0),power:Math.round((base.power*scale*skill+sum('power'))*(this.unlocked(i,1)&&(i===1||i===2)?1.15:1)*(this.unlocked(i,3)?1.2:1)*(1+this.heroes[i].talents[2]*.1+tree.power))};}
  talentPoints(i:number){return this.owns(i)?this.heroes[i].level-1-this.interfaceProgress.tree[i].reduce((n,r)=>n+r,0)-this.heroes[i].talents.reduce((n,r,j)=>n+r*TALENTS[j].cost,0):0;}
  secondCooldown(i:number){return (this.heroes[i].talents[3]?8:SECOND_COOLDOWN)-treeBonuses(this.interfaceProgress,i).cooldown;}
  trainTreeTalent(i:number,node:number){if(!this.owns(i)||!Number.isInteger(node)||node<0||node>=15)return '无效的天赋节点';const t=this.interfaceProgress.tree[i],c=TREE_NODES[node];if(t[node])return '节点已学习';if(c.parent>=0&&!t[c.parent])return '请先学习前置节点';if(this.talentPoints(i)<c.cost)return '天赋点不足';const h=this.heroes[i],ratio=h.hp/this.stats(i).hp;t[node]=1;h.hp=h.hp>0?Math.max(1,Math.round(this.stats(i).hp*ratio)):0;return null;}
  resetTreeTalents(i:number){if(!this.owns(i))return '请先招募该英雄';const h=this.heroes[i],ratio=h.hp/this.stats(i).hp;this.interfaceProgress.tree[i]=Array(15).fill(0);h.talents=[0,0,0,0];h.hp=h.hp>0?Math.max(1,Math.round(this.stats(i).hp*ratio)):0;h.shield=Math.min(h.shield,this.stats(i).power);return null;}
  trainTalent(i:number,node:number){
    if(!this.owns(i))return '请先招募该英雄';if(!Number.isInteger(node)||node<0||node>=TALENTS.length)return '无效天赋';
    const h=this.heroes[i],c=TALENTS[node];if(h.talents[node]>=c.max)return '天赋已满级';if(node===3&&!h.talents[2])return '需要技能强化1级';if(this.talentPoints(i)<c.cost)return '天赋点不足';
    const ratio=h.hp/this.stats(i).hp;h.talents[node]++;h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;return null;
  }
  resetTalents(i:number){if(!this.owns(i))return '请先招募该英雄';const h=this.heroes[i],ratio=h.hp/this.stats(i).hp;h.talents=[0,0,0,0];h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;h.shield=Math.min(h.shield,this.stats(i).power);return null;}
  spareCopies(i:number){return this.owns(i)?Math.max(0,this.recruitment.counts[i]-1-starSpent(this.heroes[i].stars)):0;}
  starPreview(i:number){if(!this.owns(i))return null;const stars=this.heroes[i].stars;return {stars,cost:stars<STAR_CONFIG.cap?STAR_CONFIG.costs[stars-1]:0,available:this.spareCopies(i),before:this.stats(i),after:this.stats(i,Math.min(STAR_CONFIG.cap,stars+1))};}
  starUp(i:number){
    const p=this.starPreview(i);if(!p)return '请先招募该英雄';if(p.stars>=STAR_CONFIG.cap)return '已达到5星上限';if(p.available<p.cost)return '重复份数不足：需要'+p.cost+'份，当前'+p.available+'份';
    const h=this.heroes[i],ratio=h.hp/p.before.hp;h.stars++;h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;return null;
  }
  private changeEquipment(i:number,slots:(number|null)[]){if(slots.every((id,j)=>id===this.loadouts[i][j]))return;const h=this.heroes[i],ratio=h.hp/this.stats(i).hp;this.loadouts[i]=slots;h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;h.shield=Math.min(h.shield,this.stats(i).power);}
  equip(i:number,id:number|null,slot:number){
    if(!this.owns(i))return '该英雄尚未招募';
    if(!Number.isInteger(slot)||slot<0||slot>=6)return '无效装备部位';
    if(id!==null){const g=this.inventory.find(g=>g.id===id);if(!g||g.slot!==slot)return '装备不存在或部位不匹配';const owner=this.owner(id);if(owner>=0&&owner!==i)return '该装备已被'+HERO_CONFIG[owner].name+'穿戴，请先卸下';}
    const slots=this.loadouts[i].slice();slots[slot]=id;this.changeEquipment(i,slots);return null;
  }
  autoEquip(i:number){
    if(!this.owns(i))return '该英雄尚未招募';
    const slots=this.loadouts[i].slice();
    for(let slot=0;slot<6;slot++){let best=this.inventory.find(g=>g.id===slots[slot]);for(const g of this.inventory){if(g.slot!==slot||this.owner(g.id)>=0&&this.owner(g.id)!==i)continue;if(!best||gearScore(g)>gearScore(best))best=g;}slots[slot]=best?.id??null;}
    this.changeEquipment(i,slots);return null;
  }
  toggleLock(id:number){const g=this.inventory.find(g=>g.id===id);if(!g)return '装备不存在';g.locked=!g.locked;return null;}
  retained(g:Gear){return g.locked||this.owner(g.id)>=0||(g.enhancement||0)>0||g.quality>=this.rules.minQuality||(this.rules.minLevel>0&&g.level>=this.rules.minLevel)||this.rules.attributes.some(key=>g[key]>0);}
  setRules(r:RetentionRules){if(!validRules(r))return '保留规则无效';this.rules={...r,attributes:r.attributes.slice()};return null;}
  salvagePreview(ids:number[]){
    const items:Gear[]=[];let error:string|null=null;
    if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length)error='请选择不重复的装备';
    else for(const id of ids){const g=this.inventory.find(g=>g.id===id);if(!g){error='装备已不存在，请重新选择';break;}if(g.locked||this.owner(id)>=0){error='锁定或已穿戴装备不能分解';break;}items.push(g);}
    return {items,error,materials:error?0:items.reduce((sum,g)=>sum+salvageValue(g),0)};
  }
  salvage(ids:number[]){const preview=this.salvagePreview(ids);if(preview.error)return preview.error;const removed=new Set(ids);this.inventory=this.inventory.filter(g=>!removed.has(g.id));this.materials+=preview.materials;return null;}
  enhance(id:number){
    const g=this.inventory.find(g=>g.id===id);if(!g)return '装备不存在';if((g.enhancement||0)>=ENHANCE_CAP)return '装备已达到强化上限';
    const cost=enhanceCost(g);if(this.materials<cost)return '强化石不足：需要'+cost+'，当前'+this.materials;
    const owner=this.owner(id),h=owner>=0?this.heroes[owner]:null,ratio=h?h.hp/this.stats(owner).hp:0;
    this.materials-=cost;g.enhancement=(g.enhancement||0)+1;
    if(h)h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(owner).hp*ratio)):0;return null;
  }
  recruitPool(pool:number,n:number){
    if(pool===0)return recruit(this.recruitment,pool,n);
    const old=this.recruitment.tickets;this.recruitment.tickets=this.interfaceProgress.upTickets;
    const error=recruit(this.recruitment,pool,n);this.interfaceProgress.upTickets=this.recruitment.tickets;this.recruitment.tickets=old;return error;
  }
  expandBag(){const p=this.interfaceProgress,cost=V2_CONFIG.capacityCost*Math.max(1,1+Math.floor((p.capacity-200)/50));if(p.capacity>=1e6)return '容量已达上限';if(this.gold<cost)return '金币不足';this.gold-=cost;p.capacity=Math.min(1e6,p.capacity+50);return null;}
  upgradeGear(id:number){
    const g=this.inventory.find(g=>g.id===id);if(!g)return '装备不存在';if(g.level>=100)return '已达等级上限';
    const breakthrough=g.level%10===9,material=(g.quality+1)*(breakthrough?15:4),gold=g.level*(breakthrough?100:30);
    if(this.materials<material||this.gold<gold)return '材料或金币不足';
    const owner=this.owner(id),h=owner>=0?this.heroes[owner]:null,ratio=h?h.hp/this.stats(owner).hp:0;
    this.materials-=material;this.gold-=gold;Object.assign(g,gearUpgradePreview(g));
    if(h)h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(owner).hp*ratio)):0;return null;
  }
  resetHeroExperience(i:number){if(!this.owns(i))return '请先招募该英雄';const h=this.heroes[i];if(h.level<=1)return '英雄已为1级';const refund=Array.from({length:h.level-1},(_,level)=>upgradeCost(level+1)).reduce((a,v)=>a+v,0);if(h.experience+refund>1e9)return '经验已达存储上限';const ratio=h.hp/this.stats(i).hp;h.level=1;h.experience+=refund;h.talents=[0,0,0,0];this.interfaceProgress.tree[i]=Array(15).fill(0);h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;h.shield=Math.min(h.shield,this.stats(i).power);h.cooldown2=0;h.queued2=false;this.buildOrder();return null;}
  upgrade(i:number){const h=this.heroes[i];if(!this.owns(i))return '该英雄尚未招募';if(h.level>=LEVEL_CAP)return '已达到当前等级上限';const cost=upgradeCost(h.level);if(h.experience<cost)return '经验不足，需要'+cost+'经验，当前'+h.experience;
    const ratio=h.hp/this.stats(i).hp;h.experience-=cost;h.level++;h.hp=h.hp>0?Math.ceil(this.stats(i).hp*ratio):0;return null;
  }
  get enemy(){return {...MONSTERS[this.enemies[0].kind],hp:this.enemies[0].maxHp};}
  get enemyHp(){return this.enemies[0].hp;} set enemyHp(value:number){this.enemies[0].hp=value;}
  private spawn(){
    this.enemies=Array.from({length:this.count},(_,i)=>{const kind=(this.monsterIndex+this.wave-1+i)%4,c=MONSTERS[kind];
      // Group trial uses lighter regular monsters; stable difficulty for the idle loop.
      return {kind,hp:this.count>1?Math.round(c.hp*.45):c.hp,maxHp:this.count>1?Math.round(c.hp*.45):c.hp,attack:this.count>1?Math.round(c.attack*.30):c.attack};});
    if(this.encounter){const c=this.encounter,scale=DUNGEON_CONFIG.scales[c.difficulty]*(c.id===5?1+(this.wave-1)*.15:1),boss=c.id!==5&&this.wave===DUNGEON_CONFIG.mobWaves+1;
      this.enemies.forEach((e,i)=>{const boost=boss&&i===0?3:1;e.hp=e.maxHp=Math.min(1000000,Math.round(e.maxHp*scale*boost));e.attack=Math.min(100000,Math.round(e.attack*scale*(boss&&i===0?1.6:1)));});}
    this.highestWave=Math.max(this.highestWave,this.wave);this.buildOrder();this.cursor=0;this.timer=0;
  }
  private alive(id:number){return id<3?!!this.party[id]&&this.party[id].hp>0:this.enemies[id-3].hp>0;}
  get nextActor(){for(let n=0;n<this.order.length;n++){const i=this.order[(this.cursor+n)%this.order.length];if(this.alive(i))return i;}return 0;}
  unlocked(id:number,slot:number){return this.owns(id)&&Number.isInteger(slot)&&slot>=0&&slot<4&&this.heroes[id].level>=SKILL_LEVELS[slot];}
  requestSkill(i:number,which=0){const h=this.party[i];if(!h||[0,1].indexOf(which)<0||!this.unlocked(this.formation[i],which*2)||h.hp<=0||(which?h.cooldown2:h.cooldown)>0||(which?h.queued2:h.queued)||this.result!=='fighting'||this.waveDelay>0)return false;if(which)h.queued2=true;else h.queued=true;return true;}
  selectEnemy(rule:EnemyTargetRule='random'){
    const alive=this.enemies.map((_,i)=>i).filter(i=>this.enemies[i].hp>0);if(!alive.length)return -1;
    if(typeof rule==='object'&&alive.indexOf(rule.preferred-3)>=0)return rule.preferred;
    if(rule==='lowest-hp-ratio'){const score=Math.min(...alive.map(i=>this.enemies[i].hp/this.enemies[i].maxHp));const tied=alive.filter(i=>this.enemies[i].hp/this.enemies[i].maxHp===score);return 3+tied[Math.min(tied.length-1,Math.floor(this.random()*tied.length))];}
    if(rule==='highest-attack'){const score=Math.max(...alive.map(i=>this.enemies[i].attack));const tied=alive.filter(i=>this.enemies[i].attack===score);return 3+tied[Math.min(tied.length-1,Math.floor(this.random()*tied.length))];}
    return 3+alive[Math.min(alive.length-1,Math.floor(this.random()*alive.length))];
  }
  private patient(){return this.party.map((_,i)=>i).filter(i=>this.party[i].hp>0&&this.party[i].hp<this.battleStats(i).hp).sort((a,b)=>this.party[a].hp/this.battleStats(a).hp-this.party[b].hp/this.battleStats(b).hp)[0];}
  private target(){const alive=this.party.map((_,i)=>i).filter(i=>this.party[i].hp>0);const total=alive.reduce((s,i)=>s+(FORMATIONS[this.interfaceProgress.formation].rates[i]||1),0);let roll=this.random()*total;for(const i of alive){roll-=FORMATIONS[this.interfaceProgress.formation].rates[i]||1;if(roll<0)return i;}return alive[alive.length-1];}
  inheritIncome(previous:SquadBattleModel){
    this.interfaceProgress=JSON.parse(JSON.stringify(previous.interfaceProgress));
    this.dungeon=JSON.parse(JSON.stringify(previous.dungeon));this.lastSeen=previous.lastSeen;this.offline=previous.offline?JSON.parse(JSON.stringify(previous.offline)):null;this.formation=previous.formation.slice();this.buildOrder();this.materials=previous.materials;this.autoSalvaged=previous.autoSalvaged;this.rules={...previous.rules,attributes:previous.rules.attributes.slice()};
    this.recruitment=JSON.parse(JSON.stringify(previous.recruitment));
    this.inventory=previous.inventory.map(g=>({...g}));this.loadouts=previous.loadouts.map(s=>s.slice());this.nextGearId=previous.nextGearId;this.dropRemainder=previous.dropRemainder;this.highestWave=previous.highestWave;
    this.gold=previous.gold;this.kills=previous.kills;this.idleElapsed=previous.idleElapsed;this.incomeRemainder=previous.incomeRemainder;
    this.heroes.forEach((h,i)=>{h.experience=previous.heroes[i].experience;h.level=previous.heroes[i].level;h.stars=previous.heroes[i].stars;h.talents=previous.heroes[i].talents.slice();h.hp=this.stats(i).hp;});
  }
  snapshot(){return {version:11,interfaceProgress:JSON.parse(JSON.stringify(this.interfaceProgress)),encounter:this.encounter?{...this.encounter}:null,dungeon:JSON.parse(JSON.stringify(this.dungeon)) as DungeonProgress,lastSeen:this.lastSeen,offline:this.offline?JSON.parse(JSON.stringify(this.offline)) as OfflineReward:null,formation:this.formation.slice(),recruitment:JSON.parse(JSON.stringify(this.recruitment)) as typeof this.recruitment,materials:this.materials,autoSalvaged:this.autoSalvaged,rules:{...this.rules,attributes:this.rules.attributes.slice()},inventory:this.inventory.map(g=>({...g,...(g.effects?{effects:g.effects.slice()}:{}),enhancement:g.enhancement||0})),loadouts:this.loadouts.map(s=>s.slice()),nextGearId:this.nextGearId,dropRemainder:this.dropRemainder,highestWave:this.highestWave,heroes:this.heroes.map(h=>({...h,talents:h.talents.slice()})),enemies:this.enemies.map(e=>({...e})),gold:this.gold,kills:this.kills,wave:this.wave,clearedWaves:this.clearedWaves,idleElapsed:this.idleElapsed,incomeRemainder:this.incomeRemainder,elapsed:this.elapsed,actions:this.actions,damage:this.damage,received:this.received,autoSkill:this.autoSkill,paused:this.paused,waveDelay:this.waveDelay,regrouping:this.regrouping,result:this.result,cursor:this.cursor,timer:this.timer,monsterIndex:this.monsterIndex,count:this.count,continuous:this.continuous};}
  static restore(value:unknown):SquadBattleModel|null{
    // Reject malformed or future saves as a whole; never partially apply balances.
    try{
      const d=value as ReturnType<SquadBattleModel['snapshot']>;
      const num=(v:unknown,max=1e12)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
      const integer=(v:unknown,max=1e12)=>num(v,max)&&Number.isInteger(v);
      if(!d||(d.version!==1&&d.version!==2&&d.version!==3&&d.version!==4&&d.version!==5&&d.version!==6&&d.version!==7&&d.version!==8&&d.version!==9&&d.version!==10&&d.version!==11)||!integer(d.monsterIndex,3)||!integer(d.count,3)||d.count<1||typeof d.continuous!=='boolean')return null;
      if(!Array.isArray(d.heroes)||d.heroes.length!==(d.version>=5?4:3)||!Array.isArray(d.enemies)||d.enemies.length!==d.count)return null;
      if(!['gold','kills','wave','clearedWaves','actions','damage','received'].every(k=>integer(d[k as keyof typeof d]))||d.wave<1)return null;
      if(!['idleElapsed','elapsed'].every(k=>num(d[k as keyof typeof d]))||!num(d.incomeRemainder,5)||d.incomeRemainder>=5||!num(d.timer,1)||d.timer>=1||!num(d.waveDelay,2))return null;
      if(typeof d.autoSkill!=='boolean'||typeof d.paused!=='boolean'||typeof d.regrouping!=='boolean'||['fighting','victory','defeat'].indexOf(d.result)<0||!integer(d.cursor,d.count+2))return null;
      const b=new SquadBattleModel(d.monsterIndex,Math.random,d.count,d.continuous);
      if(d.version>=2){
        if(!Array.isArray(d.inventory)||!Array.isArray(d.loadouts)||d.loadouts.length!==(d.version>=5?4:3)||!integer(d.nextGearId)||d.nextGearId<1||!num(d.dropRemainder,DROP_SECONDS)||d.dropRemainder>=DROP_SECONDS||!integer(d.highestWave)||d.highestWave<d.wave)return null;
        const ids=new Set<number>();
        for(const g of d.inventory){if(!g||!validGearEffects(g)||!integer(g.id)||g.id<1||g.id>=d.nextGearId||ids.has(g.id)||!integer(g.slot,5)||!integer(g.quality,4)||!integer(g.level,100)||g.level<1||typeof g.locked!=='boolean'||!['hp','attack','defense','power'].every(k=>integer(g[k],1000000)))return null;if(d.version>=3&&!integer(g.enhancement,ENHANCE_CAP))return null;ids.add(g.id);}
        const used=new Set<number>();for(const slots of d.loadouts){if(!Array.isArray(slots)||slots.length!==6)return null;for(let slot=0;slot<6;slot++){const id=slots[slot];if(id===null)continue;const g=d.inventory.find(g=>g.id===id);if(!g||g.slot!==slot||used.has(id))return null;used.add(id);}}
        if(d.interfaceProgress===undefined)b.interfaceProgress.capacity=Math.max(200,Math.ceil(d.inventory.length/50)*50);
        b.inventory=d.inventory.map(g=>({...g,...(g.effects?{effects:g.effects.slice()}:{}),enhancement:d.version>=3?g.enhancement:0}));b.loadouts=d.loadouts.map(s=>s.slice());b.nextGearId=d.nextGearId;b.dropRemainder=d.dropRemainder;b.highestWave=d.highestWave;
      }else b.highestWave=d.wave;
      if(d.version>=3){if(!integer(d.materials)||!integer(d.autoSalvaged)||!validRules(d.rules))return null;b.materials=d.materials;b.autoSalvaged=d.autoSalvaged;b.rules={...d.rules,attributes:d.rules.attributes.slice()};}
      if(d.version>=4){if(!validRecruit(d.recruitment))return null;b.recruitment=JSON.parse(JSON.stringify(d.recruitment));}
      if(d.version<5)b.loadouts[3]=Array(6).fill(null);
      if(d.version>=5){if(!Array.isArray(d.formation)||d.formation.length<1||d.formation.length>3||new Set(d.formation).size!==d.formation.length||!d.formation.every(i=>b.owns(i))||d.cursor>=d.formation.length+d.count)return null;b.formation=d.formation.slice();b.buildOrder();}
      if(d.interfaceProgress!==undefined){if(!validV2(d.interfaceProgress))return null;b.interfaceProgress=JSON.parse(JSON.stringify(d.interfaceProgress));}
      for(let i=0;i<d.heroes.length;i++){const h=d.heroes[i];if(!h||!integer(h.level,LEVEL_CAP)||h.level<1||!integer(h.experience)||!integer(h.hp)||!integer(h.shield)||!num(h.cooldown,HERO_CONFIG[i].cooldown)||typeof h.queued!=='boolean'||!integer(h.damage)||!integer(h.healing))return null;
        if(d.version>=5&&!b.owns(i)&&(h.level!==1||h.experience!==0||b.loadouts[i].some(id=>id!==null)))return null;
        const stars=d.version>=6?h.stars:1;if(!integer(stars,STAR_CONFIG.cap)||stars<1||starSpent(stars)>Math.max(0,b.recruitment.counts[i]-1))return null;
        if(d.version>=7&&(!num(h.cooldown2,SECOND_COOLDOWN)||typeof h.queued2!=='boolean'||(h.level<5&&(h.cooldown2>0||h.queued2))))return null;
        const talents=d.version>=8?h.talents:[0,0,0,0];
        if(!Array.isArray(talents)||talents.length!==4||!talents.every((r,j)=>integer(r,TALENTS[j].max))||(talents[3]>0&&talents[2]===0)||talents.reduce((n,r,j)=>n+r*TALENTS[j].cost,0)+b.interfaceProgress.tree[i].reduce((n,r)=>n+r,0)>h.level-1)return null;
        b.heroes[i]={...h,stars,talents:talents.slice(),cooldown2:d.version>=7?h.cooldown2:0,queued2:d.version>=7?h.queued2:false};if(h.hp>b.stats(i).hp||h.shield>b.stats(i).power)return null;
      }
      if(d.version>=9){
        if(!integer(d.lastSeen,1e15))return null;b.lastSeen=d.lastSeen;
        if(d.offline!==null){const r=d.offline;
          if(!r||!integer(r.seconds,OFFLINE_CONFIG.capSeconds)||r.seconds<5||r.seconds%5||!integer(r.gold)||!integer(r.checkpoint)||r.checkpoint<1||r.checkpoint>b.highestWave||!Array.isArray(r.experience)||r.experience.length!==4||!r.experience.every((v,i)=>integer(v)&&(b.owns(i)||v===0))||!Array.isArray(r.equipment)||r.equipment.length!==Math.floor(r.seconds/30))return null;
          const ids=new Set(b.inventory.map(g=>g.id));for(const g of r.equipment){if(!g||!validGearEffects(g)||!integer(g.id)||g.id<1||g.id>=b.nextGearId||ids.has(g.id)||!integer(g.slot,5)||!integer(g.quality,4)||!integer(g.level,100)||g.level<1||g.locked!==false||(g.enhancement||0)!==0||!['hp','attack','defense','power'].every(k=>integer(g[k],1000000)))return null;ids.add(g.id);}
          b.offline=JSON.parse(JSON.stringify(r));
        }
      }
      for(const e of d.enemies)if(!e||!integer(e.kind,3)||!integer(e.maxHp,1000000)||e.maxHp<1||!integer(e.hp,e.maxHp)||!integer(e.attack,100000))return null;
      if(d.result==='fighting'&&d.waveDelay===0&&(b.party.every(h=>h.hp===0)||d.enemies.every(e=>e.hp===0)))return null;
      if(d.encounter!=null){const c=d.encounter;if(!integer(c.id,5)||!integer(c.difficulty,2)||c.startFloor!==1||d.continuous||d.count!==3||d.regrouping||c.id!==5&&d.wave>DUNGEON_CONFIG.mobWaves+1||d.clearedWaves>d.wave||d.result==='victory'&&(c.id===5||d.clearedWaves!==DUNGEON_CONFIG.mobWaves+1))return null;b.encounter={...c};}
      b.enemies=d.enemies.map(e=>({...e}));
      for(const key of ['gold','kills','wave','clearedWaves','idleElapsed','incomeRemainder','elapsed','actions','damage','received','autoSkill','paused','waveDelay','regrouping','result','cursor','timer'] as const)(b as any)[key]=d[key];
      if(d.version>=10){if(!validDungeon(d.dungeon))return null;
        if(d.dungeon.run){const r=d.dungeon.run,fight=SquadBattleModel.restore(r.battle);if(!fight||fight.encounter&&(fight.encounter.id!==r.id||fight.encounter.difficulty!==r.difficulty))return null;}
        b.dungeon=JSON.parse(JSON.stringify(d.dungeon));
      }

      return b;
    }catch{return null;}
  }
  // Real foreground time, intentionally separate from battle speed and kill count.
  settleIdle(seconds:number){
    if(this.paused||!Number.isFinite(seconds)||seconds<=0)return 0;
    this.dropRemainder+=seconds;const drops=Math.floor((this.dropRemainder+1e-8)/DROP_SECONDS);if(drops){this.dropRemainder=Math.max(0,this.dropRemainder-drops*DROP_SECONDS);for(let n=0;n<drops;n++){const g=generateGear(this.nextGearId++,Math.min(100,1+Math.floor((this.highestWave-1)/3)));this.inventory.push(g);if(this.inventory.length>this.interfaceProgress.capacity||this.rules.enabled&&!this.retained(g)){this.salvage([g.id]);this.autoSalvaged++;}}}
    this.idleElapsed+=seconds;this.incomeRemainder+=seconds;
    const ticks=Math.floor((this.incomeRemainder+1e-8)/5);
    if(ticks){this.incomeRemainder=Math.max(0,this.incomeRemainder-ticks*5);this.gold+=ticks*10;this.heroes.forEach((h,i)=>{if(this.owns(i))h.experience+=ticks*8;});}
    return ticks;
  }
  step(dt:number):SquadHit[]{
    if(this.paused||this.result!=='fighting'||!Number.isFinite(dt)||dt<=0)return [];
    const hits:SquadHit[]=[];
    while(dt>1e-9&&this.result==='fighting'){
      if(this.waveDelay>0){const delta=Math.min(dt,this.waveDelay);this.waveDelay-=delta;dt-=delta;if(this.waveDelay<1e-8){this.waveDelay=0;if(this.regrouping){this.party.forEach((h,i)=>{h.hp=this.battleStats(i).hp;h.shield=0;h.cooldown=0;h.queued=false;h.cooldown2=0;h.queued2=false;});this.regrouping=false;}else this.wave++;this.spawn();}continue;}
      const delta=Math.min(dt,1-this.timer);this.timer+=delta;this.elapsed+=delta;dt-=delta;
      this.party.forEach(h=>{h.cooldown2=Math.max(0,h.cooldown2-delta);if(h.cooldown2<1e-8)h.cooldown2=0;h.cooldown=Math.max(0,h.cooldown-delta);if(h.cooldown<1e-8)h.cooldown=0;});
      if(this.timer+1e-8<1)break;this.timer=0;
      let actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;
      while(!this.alive(actor)){actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;}
      this.actions++;let target=actor,damage=0,blocked=0,heal=0,skill=false,killed=false,skillSlot=0;
      if(actor>=3){target=this.target();const h=this.party[target],attack=Math.max(1,this.enemies[actor-3].attack-this.battleStats(target).defense);blocked=Math.min(h.shield,attack);h.shield-=blocked;damage=Math.min(h.hp,attack-blocked);h.hp-=damage;this.received+=damage;}
      else{
        const h=this.party[actor],c=this.battleStats(actor),patient=this.patient(),hero=this.formation[actor];
        const second=this.unlocked(hero,2)&&h.cooldown2<=0&&(h.queued2||(!h.queued&&this.autoSkill&&h.cooldown>0))&&(hero!==2||patient!==undefined);
        if(second){skill=true;skillSlot=2;h.queued2=false;h.cooldown2=this.secondCooldown(hero);const power=Math.round(c.power*1.4);if(hero===2){target=patient!;heal=Math.min(power,this.battleStats(target).hp-this.party[target].hp);this.party[target].hp+=heal;h.healing+=heal;}else{target=this.selectEnemy(hero===0?'highest-attack':'lowest-hp-ratio');damage=Math.min(this.enemies[target-3].hp,power);}}else if(h.cooldown<=0&&(this.autoSkill||h.queued)&&(hero!==2||patient!==undefined)){
          skill=true;h.queued=false;h.cooldown=c.cooldown;
          if(hero===0){target=actor;h.shield=c.power;}
          else if(hero===2){target=patient!;heal=Math.min(c.power,this.battleStats(target).hp-this.party[target].hp);this.party[target].hp+=heal;h.healing+=heal;}
          else{target=this.selectEnemy(hero===3?'lowest-hp-ratio':FIRE_TARGET);damage=Math.min(this.enemies[target-3].hp,c.power);}
        }else{target=this.selectEnemy('random');damage=Math.min(this.enemies[target-3].hp,c.attack);}
        if(damage){const e=this.enemies[target-3];e.hp-=damage;h.damage+=damage;this.damage+=damage;
          if(e.hp===0){killed=true;this.kills++;}
        }
      }
      hits.push({actor,hero:actor<3?this.formation[actor]:undefined,target,damage,blocked,heal,skill,skillSlot,killed,hpAfter:target<3?this.party[target].hp:this.enemies[target-3].hp,shieldAfter:target<3?this.party[target].shield:0});
      if(this.enemies.every(e=>e.hp<=0)){
        this.clearedWaves++;
        if(this.continuous||this.encounter&&(this.encounter.id===5||this.wave<=DUNGEON_CONFIG.mobWaves)){this.waveDelay=1.2;this.party.forEach((h,i)=>{if(h.hp>0)h.hp=Math.min(this.battleStats(i).hp,h.hp+Math.ceil(this.battleStats(i).hp*.08));});}
        else this.result='victory';
      }else if(this.party.every(h=>h.hp<=0)){
        if(this.continuous){this.waveDelay=2;this.regrouping=true;}
        else this.result='defeat';
      }
    }
    return hits;
  }
}
