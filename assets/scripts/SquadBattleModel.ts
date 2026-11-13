// Temporary tuning for the three-hero integration, not final progression values.
export const HERO_CONFIG = [
  { name:'骑士', hp:1980, attack:128, speed:100, skill:'守护', cooldown:8, power:220 },
  { name:'法师', hp:1120, attack:145, speed:110, skill:'火焰', cooldown:7, power:290 },
  { name:'牧师', hp:1260, attack:75, speed:95, skill:'治愈', cooldown:9, power:240 },
];
export const MONSTERS = [
  {name:'嫩叶史莱姆',hp:2400,attack:230}, {name:'橙帽蘑菇',hp:2600,attack:245},
  {name:'圆壳蜗牛',hp:2800,attack:250}, {name:'芽芽树桩',hp:3000,attack:265},
];
export type SquadHit = {actor:number;target:number;damage:number;blocked:number;heal:number;skill:boolean;killed?:boolean};
// Indices 0..2 are heroes; 3..5 are enemies. Only battle time advances cooldowns.
export class SquadBattleModel {
  heroes=HERO_CONFIG.map(c=>({hp:c.hp,shield:0,cooldown:0,queued:false,damage:0,healing:0,experience:0}));
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
  private patient(){return this.heroes.map((_,i)=>i).filter(i=>this.heroes[i].hp>0&&this.heroes[i].hp<HERO_CONFIG[i].hp).sort((a,b)=>this.heroes[a].hp/HERO_CONFIG[a].hp-this.heroes[b].hp/HERO_CONFIG[b].hp)[0];}
  private target(){const alive=this.heroes.map((_,i)=>i).filter(i=>this.heroes[i].hp>0);const total=alive.reduce((s,i)=>s+(i===0?6:2),0);let roll=this.random()*total;for(const i of alive){roll-=i===0?6:2;if(roll<0)return i;}return alive[alive.length-1];}
  inheritIncome(previous:SquadBattleModel){
    this.gold=previous.gold;this.kills=previous.kills;this.idleElapsed=previous.idleElapsed;this.incomeRemainder=previous.incomeRemainder;
    this.heroes.forEach((h,i)=>h.experience=previous.heroes[i].experience);
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
      if(this.waveDelay>0){const delta=Math.min(dt,this.waveDelay);this.waveDelay-=delta;dt-=delta;if(this.waveDelay<1e-8){this.waveDelay=0;if(this.regrouping){this.heroes.forEach((h,i)=>{h.hp=HERO_CONFIG[i].hp;h.shield=0;h.cooldown=0;h.queued=false;});this.regrouping=false;}else this.wave++;this.spawn();}continue;}
      const delta=Math.min(dt,1-this.timer);this.timer+=delta;this.elapsed+=delta;dt-=delta;
      this.heroes.forEach(h=>{h.cooldown=Math.max(0,h.cooldown-delta);if(h.cooldown<1e-8)h.cooldown=0;});
      if(this.timer+1e-8<1)break;this.timer=0;
      let actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;
      while(!this.alive(actor)){actor=this.order[this.cursor];this.cursor=(this.cursor+1)%this.order.length;}
      this.actions++;let target=3+this.enemies.findIndex(e=>e.hp>0),damage=0,blocked=0,heal=0,skill=false,killed=false;
      if(actor>=3){target=this.target();const h=this.heroes[target],attack=this.enemies[actor-3].attack;blocked=Math.min(h.shield,attack);h.shield-=blocked;damage=Math.min(h.hp,attack-blocked);h.hp-=damage;this.received+=damage;}
      else{
        const h=this.heroes[actor],c=HERO_CONFIG[actor],patient=this.patient();
        if(h.cooldown<=0&&(this.autoSkill||h.queued)&&(actor!==2||patient!==undefined)){
          skill=true;h.queued=false;h.cooldown=c.cooldown;
          if(actor===0){target=actor;h.shield=c.power;}
          else if(actor===2){target=patient!;heal=Math.min(c.power,HERO_CONFIG[target].hp-this.heroes[target].hp);this.heroes[target].hp+=heal;h.healing+=heal;}
          else damage=Math.min(this.enemies[target-3].hp,c.power);
        }else damage=Math.min(this.enemies[target-3].hp,c.attack);
        if(damage){const e=this.enemies[target-3];e.hp-=damage;h.damage+=damage;this.damage+=damage;
          if(e.hp===0){killed=true;this.kills++;}
        }
      }
      hits.push({actor,target,damage,blocked,heal,skill,killed});
      if(this.enemies.every(e=>e.hp<=0)){
        this.clearedWaves++;
        if(this.continuous){this.waveDelay=1.2;this.heroes.forEach((h,i)=>{if(h.hp>0)h.hp=Math.min(HERO_CONFIG[i].hp,h.hp+Math.ceil(HERO_CONFIG[i].hp*.08));});}
        else this.result='victory';
      }else if(this.heroes.every(h=>h.hp<=0)){
        if(this.continuous){this.waveDelay=2;this.regrouping=true;}
        else this.result='defeat';
      }
    }
    return hits;
  }
}
