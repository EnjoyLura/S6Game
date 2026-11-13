// Temporary tuning for the three-hero integration, not final progression values.
export const HERO_CONFIG = [
  { name:'骑士', hp:1980, attack:128, speed:100, skill:'守护', cooldown:8, power:220 },
  { name:'法师', hp:1120, attack:145, speed:110, skill:'火焰', cooldown:7, power:290 },
  { name:'牧师', hp:1260, attack:75, speed:95, skill:'治愈', cooldown:9, power:240 },
];
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
  stats(i:number){const base=HERO_CONFIG[i],scale=1+(this.heroes[i].level-1)*.1;return {...base,hp:Math.round(base.hp*scale),attack:Math.round(base.attack*scale),power:Math.round(base.power*scale)};}
  upgrade(i:number){const h=this.heroes[i];if(!h)return '该英雄尚未招募';if(h.level>=LEVEL_CAP)return '已达到当前等级上限';const cost=upgradeCost(h.level);if(h.experience<cost)return '经验不足，需要'+cost+'经验，当前'+h.experience;
    const ratio=h.hp/this.stats(i).hp;h.experience-=cost;h.level++;h.hp=h.hp>0?Math.ceil(this.stats(i).hp*ratio):0;return null;
  }
  get enemy(){return {...MONSTERS[this.enemies[0].kind],hp:this.enemies[0].maxHp};}
  get enemyHp(){return this.enemies[0].hp;} set enemyHp(value:number){this.enemies[0].hp=value;}
  private spawn(){
    this.enemies=Array.from({length:this.count},(_,i)=>{const kind=(this.monsterIndex+this.wave-1+i)%4,c=MONSTERS[kind];
      // Group trial uses lighter regular monsters; stable difficulty for the idle loop.
      return {kind,hp:this.count>1?Math.round(c.hp*.45):c.hp,maxHp:this.count>1?Math.round(c.hp*.45):c.hp,attack:this.count>1?Math.round(c.attack*.30):c.attack};});
    this.order=[...HERO_CONFIG.map((_,i)=>i).sort((a,b)=>HERO_CONFIG[b].speed-HERO_CONFIG[a].speed),...this.enemies.map((_,i)=>i+3)];this.cursor=0;this.timer=0;
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
    this.gold=previous.gold;this.kills=previous.kills;this.idleElapsed=previous.idleElapsed;this.incomeRemainder=previous.incomeRemainder;
    this.heroes.forEach((h,i)=>{h.experience=previous.heroes[i].experience;h.level=previous.heroes[i].level;h.hp=this.stats(i).hp;});
  }
  snapshot(){return {version:1,heroes:this.heroes.map(h=>({...h})),enemies:this.enemies.map(e=>({...e})),gold:this.gold,kills:this.kills,wave:this.wave,clearedWaves:this.clearedWaves,idleElapsed:this.idleElapsed,incomeRemainder:this.incomeRemainder,elapsed:this.elapsed,actions:this.actions,damage:this.damage,received:this.received,autoSkill:this.autoSkill,paused:this.paused,waveDelay:this.waveDelay,regrouping:this.regrouping,result:this.result,cursor:this.cursor,timer:this.timer,monsterIndex:this.monsterIndex,count:this.count,continuous:this.continuous};}
  static restore(value:unknown):SquadBattleModel|null{
    // Reject malformed or future saves as a whole; never partially apply balances.
    try{
      const d=value as ReturnType<SquadBattleModel['snapshot']>;
      const num=(v:unknown,max=1e12)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max;
      const integer=(v:unknown,max=1e12)=>num(v,max)&&Number.isInteger(v);
      if(!d||d.version!==1||!integer(d.monsterIndex,3)||!integer(d.count,3)||d.count<1||typeof d.continuous!=='boolean')return null;
      if(!Array.isArray(d.heroes)||d.heroes.length!==3||!Array.isArray(d.enemies)||d.enemies.length!==d.count)return null;
      if(!['gold','kills','wave','clearedWaves','actions','damage','received'].every(k=>integer(d[k as keyof typeof d]))||d.wave<1)return null;
      if(!['idleElapsed','elapsed'].every(k=>num(d[k as keyof typeof d]))||!num(d.incomeRemainder,5)||d.incomeRemainder>=5||!num(d.timer,1)||d.timer>=1||!num(d.waveDelay,2))return null;
      if(typeof d.autoSkill!=='boolean'||typeof d.paused!=='boolean'||typeof d.regrouping!=='boolean'||['fighting','victory','defeat'].indexOf(d.result)<0||!integer(d.cursor,d.count+2))return null;
      const b=new SquadBattleModel(d.monsterIndex,Math.random,d.count,d.continuous);
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
      if(actor>=3){target=this.target();const h=this.heroes[target],attack=this.enemies[actor-3].attack;blocked=Math.min(h.shield,attack);h.shield-=blocked;damage=Math.min(h.hp,attack-blocked);h.hp-=damage;this.received+=damage;}
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
