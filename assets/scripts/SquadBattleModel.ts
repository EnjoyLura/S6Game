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

// Temporary tuning for the three-hero integration, not final progression values.
export const HERO_CONFIG = [
  { name:'骑士', hp:1980, attack:128, speed:100, skill:'守护', cooldown:8, power:220 },
  { name:'法师', hp:1120, attack:145, speed:110, skill:'火焰', cooldown:7, power:290 },
  { name:'牧师', hp:1260, attack:75, speed:95, skill:'治愈', cooldown:9, power:240 },
];
export const EQUIPMENT_PARTS=['武器','戒指','项链','头盔','衣服','鞋子'];
export const QUALITY_NAMES=['普通','优秀','稀有','史诗','传说'];
export const DROP_SECONDS=30;
// Runtime resume/stall gaps are not offline reward time. Model tests may still settle explicit durations.
export const foregroundRewardDelta=(seconds:number)=>Number.isFinite(seconds)&&seconds>0&&seconds<=60?seconds:0;
export const GEAR_ART=[[0,3],[1,2],[2,1],[3,2],[4,3],[5,1],[0,4],[0,1],[2,2],[0,1],[3,0],[4,2],[0,3],[1,2],[2,1],[3,3],[4,2],[5,1]];
export type Gear={id:number;slot:number;quality:number;level:number;hp:number;attack:number;defense:number;power:number;locked:boolean;enhancement?:number};
export type GearAttribute='hp'|'attack'|'defense'|'power';
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
 g[key]=Math.round(({hp:40,attack:6,defense:3,power:9})[key]*scale*(.8+random()*.4));return g;
}
export const LEVEL_CAP=100;
export const upgradeCost=(level:number)=>40*level;
export const MONSTERS = [
  {name:'嫩叶史莱姆',hp:2400,attack:230}, {name:'橙帽蘑菇',hp:2600,attack:245},
  {name:'圆壳蜗牛',hp:2800,attack:250}, {name:'芽芽树桩',hp:3000,attack:265},
];
export type EnemyTargetRule='random'|'lowest-hp-ratio'|'highest-attack'|{preferred:number};
// Skills may override this independently of basic attacks. Current fire stays random.
export const FIRE_TARGET:EnemyTargetRule='random';
export type SquadHit = {actor:number;target:number;damage:number;blocked:number;heal:number;skill:boolean;killed?:boolean;hpAfter:number;shieldAfter:number};
// Indices 0..2 are heroes; 3..5 are enemies. Only battle time advances cooldowns.
export class SquadBattleModel {
  materials=0;autoSalvaged=0;rules:RetentionRules={enabled:false,minQuality:2,minLevel:0,attributes:[]};
  recruitment=initialRecruit();
  inventory:Gear[]=[];loadouts:(number|null)[][]=Array.from({length:3},()=>Array(6).fill(null));nextGearId=1;dropRemainder=0;highestWave=1;
  heroes=HERO_CONFIG.map(c=>({hp:c.hp,shield:0,cooldown:0,queued:false,damage:0,healing:0,experience:0,level:1}));
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
  stats(i:number){const base=HERO_CONFIG[i],scale=1+(this.heroes[i].level-1)*.1,gear=this.equipment(i);const sum=(key:'hp'|'attack'|'defense'|'power')=>gear.reduce((n,g)=>n+(g?gearStats(g)[key]:0),0);return {...base,hp:Math.round(base.hp*scale)+sum('hp'),attack:Math.round(base.attack*scale)+sum('attack'),defense:sum('defense'),power:Math.round(base.power*scale)+sum('power')};}
  private changeEquipment(i:number,slots:(number|null)[]){if(slots.every((id,j)=>id===this.loadouts[i][j]))return;const h=this.heroes[i],ratio=h.hp/this.stats(i).hp;this.loadouts[i]=slots;h.hp=h.hp>0?Math.max(1,Math.floor(this.stats(i).hp*ratio)):0;h.shield=Math.min(h.shield,this.stats(i).power);}
  equip(i:number,id:number|null,slot:number){
    if(!Number.isInteger(i)||i<0||i>=3)return '该英雄尚未招募';
    if(!Number.isInteger(slot)||slot<0||slot>=6)return '无效装备部位';
    if(id!==null){const g=this.inventory.find(g=>g.id===id);if(!g||g.slot!==slot)return '装备不存在或部位不匹配';const owner=this.owner(id);if(owner>=0&&owner!==i)return '该装备已被'+HERO_CONFIG[owner].name+'穿戴，请先卸下';}
    const slots=this.loadouts[i].slice();slots[slot]=id;this.changeEquipment(i,slots);return null;
  }
  autoEquip(i:number){
    if(!Number.isInteger(i)||i<0||i>=3)return '该英雄尚未招募';
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
  upgrade(i:number){const h=this.heroes[i];if(!h)return '该英雄尚未招募';if(h.level>=LEVEL_CAP)return '已达到当前等级上限';const cost=upgradeCost(h.level);if(h.experience<cost)return '经验不足，需要'+cost+'经验，当前'+h.experience;
    const ratio=h.hp/this.stats(i).hp;h.experience-=cost;h.level++;h.hp=h.hp>0?Math.ceil(this.stats(i).hp*ratio):0;return null;
  }
  get enemy(){return {...MONSTERS[this.enemies[0].kind],hp:this.enemies[0].maxHp};}
  get enemyHp(){return this.enemies[0].hp;} set enemyHp(value:number){this.enemies[0].hp=value;}
  private spawn(){
    this.enemies=Array.from({length:this.count},(_,i)=>{const kind=(this.monsterIndex+this.wave-1+i)%4,c=MONSTERS[kind];
      // Group trial uses lighter regular monsters; stable difficulty for the idle loop.
      return {kind,hp:this.count>1?Math.round(c.hp*.45):c.hp,maxHp:this.count>1?Math.round(c.hp*.45):c.hp,attack:this.count>1?Math.round(c.attack*.30):c.attack};});
    this.highestWave=Math.max(this.highestWave,this.wave);this.order=[...HERO_CONFIG.map((_,i)=>i).sort((a,b)=>HERO_CONFIG[b].speed-HERO_CONFIG[a].speed),...this.enemies.map((_,i)=>i+3)];this.cursor=0;this.timer=0;
  }
  private alive(id:number){return id<3?this.heroes[id].hp>0:this.enemies[id-3].hp>0;}
  get nextActor(){for(let n=0;n<this.order.length;n++){const i=this.order[(this.cursor+n)%this.order.length];if(this.alive(i))return i;}return 0;}
  requestSkill(i:number){const h=this.heroes[i];if(!h||h.hp<=0||h.cooldown>0||h.queued||this.result!=='fighting'||this.waveDelay>0)return false;h.queued=true;return true;}
  selectEnemy(rule:EnemyTargetRule='random'){
    const alive=this.enemies.map((_,i)=>i).filter(i=>this.enemies[i].hp>0);if(!alive.length)return -1;
    if(typeof rule==='object'&&alive.indexOf(rule.preferred-3)>=0)return rule.preferred;
    if(rule==='lowest-hp-ratio'){const score=Math.min(...alive.map(i=>this.enemies[i].hp/this.enemies[i].maxHp));const tied=alive.filter(i=>this.enemies[i].hp/this.enemies[i].maxHp===score);return 3+tied[Math.min(tied.length-1,Math.floor(this.random()*tied.length))];}
    if(rule==='highest-attack'){const score=Math.max(...alive.map(i=>this.enemies[i].attack));const tied=alive.filter(i=>this.enemies[i].attack===score);return 3+tied[Math.min(tied.length-1,Math.floor(this.random()*tied.length))];}
    return 3+alive[Math.min(alive.length-1,Math.floor(this.random()*alive.length))];
  }
  private patient(){return this.heroes.map((_,i)=>i).filter(i=>this.heroes[i].hp>0&&this.heroes[i].hp<this.stats(i).hp).sort((a,b)=>this.heroes[a].hp/this.stats(a).hp-this.heroes[b].hp/this.stats(b).hp)[0];}
  private target(){const alive=this.heroes.map((_,i)=>i).filter(i=>this.heroes[i].hp>0);const total=alive.reduce((s,i)=>s+(i===0?6:2),0);let roll=this.random()*total;for(const i of alive){roll-=i===0?6:2;if(roll<0)return i;}return alive[alive.length-1];}
  inheritIncome(previous:SquadBattleModel){
    this.materials=previous.materials;this.autoSalvaged=previous.autoSalvaged;this.rules={...previous.rules,attributes:previous.rules.attributes.slice()};
    this.recruitment=JSON.parse(JSON.stringify(previous.recruitment));
    this.inventory=previous.inventory.map(g=>({...g}));this.loadouts=previous.loadouts.map(s=>s.slice());this.nextGearId=previous.nextGearId;this.dropRemainder=previous.dropRemainder;this.highestWave=previous.highestWave;
    this.gold=previous.gold;this.kills=previous.kills;this.idleElapsed=previous.idleElapsed;this.incomeRemainder=previous.incomeRemainder;
    this.heroes.forEach((h,i)=>{h.experience=previous.heroes[i].experience;h.level=previous.heroes[i].level;h.hp=this.stats(i).hp;});
  }
  snapshot(){return {version:4,recruitment:JSON.parse(JSON.stringify(this.recruitment)) as typeof this.recruitment,materials:this.materials,autoSalvaged:this.autoSalvaged,rules:{...this.rules,attributes:this.rules.attributes.slice()},inventory:this.inventory.map(g=>({...g,enhancement:g.enhancement||0})),loadouts:this.loadouts.map(s=>s.slice()),nextGearId:this.nextGearId,dropRemainder:this.dropRemainder,highestWave:this.highestWave,heroes:this.heroes.map(h=>({...h})),enemies:this.enemies.map(e=>({...e})),gold:this.gold,kills:this.kills,wave:this.wave,clearedWaves:this.clearedWaves,idleElapsed:this.idleElapsed,incomeRemainder:this.incomeRemainder,elapsed:this.elapsed,actions:this.actions,damage:this.damage,received:this.received,autoSkill:this.autoSkill,paused:this.paused,waveDelay:this.waveDelay,regrouping:this.regrouping,result:this.result,cursor:this.cursor,timer:this.timer,monsterIndex:this.monsterIndex,count:this.count,continuous:this.continuous};}
  static restore(value:unknown):SquadBattleModel|null{
    // Reject malformed or future saves as a whole; never partially apply balances.
    try{
      const d=value as ReturnType<SquadBattleModel['snapshot']>;
      const num=(v:unknown,max=1e12)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
      const integer=(v:unknown,max=1e12)=>num(v,max)&&Number.isInteger(v);
      if(!d||(d.version!==1&&d.version!==2&&d.version!==3&&d.version!==4)||!integer(d.monsterIndex,3)||!integer(d.count,3)||d.count<1||typeof d.continuous!=='boolean')return null;
      if(!Array.isArray(d.heroes)||d.heroes.length!==3||!Array.isArray(d.enemies)||d.enemies.length!==d.count)return null;
      if(!['gold','kills','wave','clearedWaves','actions','damage','received'].every(k=>integer(d[k as keyof typeof d]))||d.wave<1)return null;
      if(!['idleElapsed','elapsed'].every(k=>num(d[k as keyof typeof d]))||!num(d.incomeRemainder,5)||d.incomeRemainder>=5||!num(d.timer,1)||d.timer>=1||!num(d.waveDelay,2))return null;
      if(typeof d.autoSkill!=='boolean'||typeof d.paused!=='boolean'||typeof d.regrouping!=='boolean'||['fighting','victory','defeat'].indexOf(d.result)<0||!integer(d.cursor,d.count+2))return null;
      const b=new SquadBattleModel(d.monsterIndex,Math.random,d.count,d.continuous);
      if(d.version>=2){
        if(!Array.isArray(d.inventory)||!Array.isArray(d.loadouts)||d.loadouts.length!==3||!integer(d.nextGearId)||d.nextGearId<1||!num(d.dropRemainder,DROP_SECONDS)||d.dropRemainder>=DROP_SECONDS||!integer(d.highestWave)||d.highestWave<d.wave)return null;
        const ids=new Set<number>();
        for(const g of d.inventory){if(!g||!integer(g.id)||g.id<1||g.id>=d.nextGearId||ids.has(g.id)||!integer(g.slot,5)||!integer(g.quality,4)||!integer(g.level,100)||g.level<1||typeof g.locked!=='boolean'||!['hp','attack','defense','power'].every(k=>integer(g[k],1000000)))return null;if(d.version>=3&&!integer(g.enhancement,ENHANCE_CAP))return null;ids.add(g.id);}
        const used=new Set<number>();for(const slots of d.loadouts){if(!Array.isArray(slots)||slots.length!==6)return null;for(let slot=0;slot<6;slot++){const id=slots[slot];if(id===null)continue;const g=d.inventory.find(g=>g.id===id);if(!g||g.slot!==slot||used.has(id))return null;used.add(id);}}
        b.inventory=d.inventory.map(g=>({...g,enhancement:d.version>=3?g.enhancement:0}));b.loadouts=d.loadouts.map(s=>s.slice());b.nextGearId=d.nextGearId;b.dropRemainder=d.dropRemainder;b.highestWave=d.highestWave;
      }else b.highestWave=d.wave;
      if(d.version>=3){if(!integer(d.materials)||!integer(d.autoSalvaged)||!validRules(d.rules))return null;b.materials=d.materials;b.autoSalvaged=d.autoSalvaged;b.rules={...d.rules,attributes:d.rules.attributes.slice()};}
      if(d.version===4){if(!validRecruit(d.recruitment))return null;b.recruitment=JSON.parse(JSON.stringify(d.recruitment));}
      for(let i=0;i<3;i++){const h=d.heroes[i];if(!h||!integer(h.level,LEVEL_CAP)||h.level<1||!integer(h.experience)||!integer(h.hp)||!integer(h.shield)||!num(h.cooldown,HERO_CONFIG[i].cooldown)||typeof h.queued!=='boolean'||!integer(h.damage)||!integer(h.healing))return null;
        b.heroes[i]={...h};if(h.hp>b.stats(i).hp||h.shield>b.stats(i).power)return null;
      }
      for(const e of d.enemies)if(!e||!integer(e.kind,3)||!integer(e.maxHp,1000000)||e.maxHp<1||!integer(e.hp,e.maxHp)||!integer(e.attack,100000))return null;
      if(d.result==='fighting'&&d.waveDelay===0&&(d.heroes.every(h=>h.hp===0)||d.enemies.every(e=>e.hp===0)))return null;
      b.enemies=d.enemies.map(e=>({...e}));
      for(const key of ['gold','kills','wave','clearedWaves','idleElapsed','incomeRemainder','elapsed','actions','damage','received','autoSkill','paused','waveDelay','regrouping','result','cursor','timer'] as const)(b as any)[key]=d[key];
      return b;
    }catch{return null;}
  }
  // Real foreground time, intentionally separate from battle speed and kill count.
  settleIdle(seconds:number){
    if(this.paused||!Number.isFinite(seconds)||seconds<=0)return 0;
    this.dropRemainder+=seconds;const drops=Math.floor((this.dropRemainder+1e-8)/DROP_SECONDS);if(drops){this.dropRemainder=Math.max(0,this.dropRemainder-drops*DROP_SECONDS);for(let n=0;n<drops;n++){const g=generateGear(this.nextGearId++,Math.min(100,1+Math.floor((this.highestWave-1)/3)));this.inventory.push(g);if(this.rules.enabled&&!this.retained(g)){this.salvage([g.id]);this.autoSalvaged++;}}}
    this.idleElapsed+=seconds;this.incomeRemainder+=seconds;
    const ticks=Math.floor((this.incomeRemainder+1e-8)/5);
    if(ticks){this.incomeRemainder=Math.max(0,this.incomeRemainder-ticks*5);this.gold+=ticks*10;this.heroes.forEach(h=>h.experience+=ticks*8);}
    return ticks;
  }
  step(dt:number):SquadHit[]{
    if(this.paused||this.result!=='fighting'||!Number.isFinite(dt)||dt<=0)return [];
    const hits:SquadHit[]=[];
    while(dt>1e-9&&this.result==='fighting'){
      if(this.waveDelay>0){const delta=Math.min(dt,this.waveDelay);this.waveDelay-=delta;dt-=delta;if(this.waveDelay<1e-8){this.waveDelay=0;if(this.regrouping){this.heroes.forEach((h,i)=>{h.hp=this.stats(i).hp;h.shield=0;h.cooldown=0;h.queued=false;});this.regrouping=false;}else this.wave++;this.spawn();}continue;}
      const delta=Math.min(dt,1-this.timer);this.timer+=delta;this.elapsed+=delta;dt-=delta;
      this.heroes.forEach(h=>{h.cooldown=Math.max(0,h.cooldown-delta);if(h.cooldown<1e-8)h.cooldown=0;});
      if(this.timer+1e-8<1)break;this.timer=0;
      let actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;
      while(!this.alive(actor)){actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;}
      this.actions++;let target=actor,damage=0,blocked=0,heal=0,skill=false,killed=false;
      if(actor>=3){target=this.target();const h=this.heroes[target],attack=Math.max(1,this.enemies[actor-3].attack-this.stats(target).defense);blocked=Math.min(h.shield,attack);h.shield-=blocked;damage=Math.min(h.hp,attack-blocked);h.hp-=damage;this.received+=damage;}
      else{
        const h=this.heroes[actor],c=this.stats(actor),patient=this.patient();
        if(h.cooldown<=0&&(this.autoSkill||h.queued)&&(actor!==2||patient!==undefined)){
          skill=true;h.queued=false;h.cooldown=c.cooldown;
          if(actor===0){target=actor;h.shield=c.power;}
          else if(actor===2){target=patient!;heal=Math.min(c.power,this.stats(target).hp-this.heroes[target].hp);this.heroes[target].hp+=heal;h.healing+=heal;}
          else{target=this.selectEnemy(FIRE_TARGET);damage=Math.min(this.enemies[target-3].hp,c.power);}
        }else{target=this.selectEnemy('random');damage=Math.min(this.enemies[target-3].hp,c.attack);}
        if(damage){const e=this.enemies[target-3];e.hp-=damage;h.damage+=damage;this.damage+=damage;
          if(e.hp===0){killed=true;this.kills++;}
        }
      }
      hits.push({actor,target,damage,blocked,heal,skill,killed,hpAfter:target<3?this.heroes[target].hp:this.enemies[target-3].hp,shieldAfter:target<3?this.heroes[target].shield:0});
      if(this.enemies.every(e=>e.hp<=0)){
        this.clearedWaves++;
        if(this.continuous){this.waveDelay=1.2;this.heroes.forEach((h,i)=>{if(h.hp>0)h.hp=Math.min(this.stats(i).hp,h.hp+Math.ceil(this.stats(i).hp*.08));});}
        else this.result='victory';
      }else if(this.heroes.every(h=>h.hp<=0)){
        if(this.continuous){this.waveDelay=2;this.regrouping=true;}
        else this.result='defeat';
      }
    }
    return hits;
  }
}
