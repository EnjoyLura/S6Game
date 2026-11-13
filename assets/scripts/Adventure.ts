import { _decorator, Component, Node, Canvas, UITransform, Camera, Layers, Color, Graphics, Label, Sprite, SpriteFrame, Texture2D, resources, Rect, view, ResolutionPolicy, tween, Vec3, UIOpacity, game, Game, profiler, Tween, Mask, sys } from 'cc';
import { SquadBattleModel, HERO_CONFIG, MONSTERS, SquadHit, gearName, DROP_SECONDS } from './SquadBattleModel';
import { BattleFeedback } from './BattleFeedback';
import { LocalSave } from './LocalSave';
import { HeroPage } from './HeroPage';
import { BagPage } from './BagPage';
const { ccclass } = _decorator;
const C = { ink: '#704124', cream: '#FFF6E4', gold: '#FFCD54', muted: '#AE8966', green: '#78C847', red: '#EB8068' };
@ccclass('Adventure')
export class Adventure extends Component {
  private root!: Node; private model = new SquadBattleModel(0,Math.random,3,true); private speed = 1; private ready = false;
  private units:Node[]=[]; private hpLabels:Label[]=[]; private bars:Graphics[]=[];
  private partyHP:Label[]=[]; private partyBars:Graphics[]=[]; private skillLabels:Label[]=[]; private skillShades:Graphics[]=[];
  private turns:Node[]=[]; private positions=[[-95,75],[-290,260],[-290,-55],[260,270],[210,70],[270,-135]];
  private status!:Label; private notice!:Label; private speedLabel!:Label; private pauseLabel!:Label; private stats!:Label; private enemyNames:Label[]=[]; private goldLabel!:Label; private incomeLabel!:Label;
  private heartIcons:Node[]=[]; private shields:Label[]=[];private shieldIcons:Node[]=[];private partyShields:Label[]=[];private partyShieldIcons:Node[]=[];private feedback!:BattleFeedback; private autoDot!:Graphics; private menu!:Node; private statsVisible=false; private foregroundPaused=false;
  private ui!:Texture2D; private heroTextures:Texture2D[]=[]; private monsters!:Texture2D; private enemyPortraits:Node[]=[]; private shownWave=0; private shownRegroup=false;
  private floating:{target:number;text:string;color:string}[]=[]; private floatTimer=0; private floatSerial=0; private effects=new Set<Node>();
  private heroPage!:HeroPage; private bagPage!:BagPage; private currentPage:'adventure'|'hero'|'bag'='adventure'; private canvasRoot!:Node;
  private saves!:LocalSave<SquadBattleModel>; private saveClock=0; private background=false;
  private saveProgress=()=>{if(!this.saves)return false;const snapshot=this.model.snapshot();if(this.background)snapshot.paused=this.foregroundPaused;const ok=this.saves.save(snapshot);if(!ok&&this.notice)this.notice.string=this.saves.error;return ok;};
  private upgradeHero=(i:number)=>{const before=this.model.snapshot();const error=this.model.upgrade(i);if(error)return error;if(!this.saveProgress()){this.model=SquadBattleModel.restore(before)!;return this.saves.error+'，本次升级未扣经验';}return null;};
  private mutateEquipment=(fn:(b:SquadBattleModel)=>string|null)=>{const before=this.model.snapshot();const error=fn(this.model);if(error)return error;if(!this.saveProgress()){this.model=SquadBattleModel.restore(before)!;return this.saves.error+'，装备操作已撤销';}this.resetFeedback();return null;};
  onLoad() {
    this.saves=new LocalSave(sys.localStorage,SquadBattleModel.restore);this.model=this.saves.load()||this.model;
    if(typeof window!=='undefined')window.addEventListener('beforeunload',this.saveProgress);
    profiler.hideStats();
    view.setDesignResolutionSize(887,1774,ResolutionPolicy.SHOW_ALL);
    const cameraNode = new Node('UI Camera'); cameraNode.parent = this.node;
    cameraNode.setPosition(443.5,887,1000); const camera=cameraNode.addComponent(Camera);
    camera.projection=Camera.ProjectionType.ORTHO; camera.orthoHeight=887;
    camera.clearColor=new Color(31,46,37,255); camera.visibility=Layers.Enum.UI_2D;
    this.root=new Node('Adventure Canvas');this.root.layer=Layers.Enum.UI_2D;this.root.parent=this.node;
    this.root.addComponent(UITransform).setContentSize(887,1774);this.root.setPosition(443.5,887,0);
    const canvas=this.root.addComponent(Canvas);canvas.cameraComponent=camera;
    this.canvasRoot=this.root;
    this.root=this.base('Adventure page',0,0,887,1774,this.canvasRoot);
    this.panel('Page',0,0,887,1774,C.cream,0);
    game.on(Game.EVENT_HIDE,this.hide,this);game.on(Game.EVENT_SHOW,this.show,this);
    Promise.all(['forest','hero-knight','hero-mage','hero-priest','monsters-4','adventure-ui-v5','hero-ui-v6','training-yard','bag-ui-v4'].map(n=>this.texture('art/'+n))).then(([forest,knight,mage,priest,monsters,ui,heroUI,yard,bagUI])=>{
      this.ui=ui;this.heroTextures=[knight,mage,priest];this.monsters=monsters;
      const bg=this.picture(forest,new Rect(0,0,forest.width,forest.height),0,277,887,1220,'Forest');bg.setSiblingIndex(1);
      this.heroTextures.forEach((t,i)=>{const [x,y]=this.positions[i];this.units.push(this.picture(t,new Rect(0,0,t.width,t.height),x,y,i===0?280:260,i===0?280:260,HERO_CONFIG[i].name));});
      this.units[1].setSiblingIndex(this.units[0].getSiblingIndex());
      this.model.enemies.forEach((e,j)=>{const [x,y]=this.positions[j+3];this.units.push(this.picture(monsters,this.monsterRect(j),x,y,260,260,'Monster '+j));});
      const fxLayer=this.base('Combat effects',0,0,887,1774);this.feedback=new BattleFeedback(this.units,this.positions,fxLayer,h=>this.impactText(h));this.resetFeedback();
      this.drawPage();this.ready=true;this.sync();this.pauseLabel.string=this.model.paused?'继续战斗':'暂停战斗';if(this.saves.error)this.notice.string=this.saves.error;
      this.heroPage=new HeroPage(this.canvasRoot,heroUI,yard,knight,()=>this.openPage('adventure'),(slot,hero)=>{this.openPage('bag');if(slot!==undefined)this.bagPage.showSlot(slot,hero!);},this.heroTextures,ui,()=>({gold:this.model.gold,experience:this.model.heroes.map(h=>h.experience),levels:this.model.heroes.map(h=>h.level),stats:this.model.heroes.map((_,i)=>this.model.stats(i))}),this.upgradeHero,()=>this.model,this.mutateEquipment,bagUI);
      this.bagPage=new BagPage(this.canvasRoot,bagUI,yard,(page)=>this.openPage(page),()=>this.model,this.mutateEquipment);
    }).catch(e=>{console.error(e);this.label('素材加载失败，请刷新重试',0,0,700,70,34);});
  }
  private texture(path:string):Promise<Texture2D>{return new Promise((resolve,reject)=>resources.load(path+'/texture',Texture2D,(e,t)=>e?reject(e):resolve(t)));}
  private base(name:string,x:number,y:number,w:number,h:number,parent=this.root){const n=new Node(name);n.layer=Layers.Enum.UI_2D;n.parent=parent;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
  private panel(name:string,x:number,y:number,w:number,h:number,color:string,r=24,parent=this.root){const n=this.base(name,x,y,w,h,parent);const g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
  private label(text:string,x:number,y:number,w:number,h:number,size=28,color=C.ink,parent=this.root){const n=this.base(text,x,y,w,h,parent),l=n.addComponent(Label);l.string=text;l.fontFamily='Microsoft YaHei';l.fontSize=size;l.lineHeight=size*1.3;l.isBold=true;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
  private button(text:string,x:number,y:number,w:number,h:number,fn:()=>void,color=C.cream){const n=this.panel(text,x,y,w,h,color,22);const l=this.label(text,0,0,w-12,h-8,28,C.ink,n);n.on(Node.EventType.TOUCH_END,()=>{fn();});return l;}
  private picture(t:Texture2D,rect:Rect,x:number,y:number,w:number,h:number,name:string){const n=this.base(name,x,y,w,h);const f=new SpriteFrame();f.texture=t;f.rect=rect;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;n.getComponent(UITransform)!.setContentSize(w,h);return n;}
  private bar(x:number,y:number){const n=this.base('Health',x,y,150,18),g=n.addComponent(Graphics);return g;}
  private paintBar(g:Graphics,value:number,max:number,color:string,shield=0){g.clear();g.fillColor=new Color().fromHEX('#65502E');g.roundRect(-76,-9,152,18,9);g.fill();g.fillColor=new Color().fromHEX('#DDD2AA');g.roundRect(-73,-6,146,12,6);g.fill();if(value>0){const w=Math.max(8,146*value/max);g.fillColor=new Color().fromHEX(color);g.roundRect(-73,-6,w,12,6);g.fill();g.fillColor=new Color(255,255,210,110);g.roundRect(-71,1,Math.max(4,w-4),4,2);g.fill();}if(shield>0){const w=158*Math.min(1,shield/max),left=79-w,r=Math.min(11,w/2);g.strokeColor=new Color().fromHEX('#6EDBFF');g.lineWidth=4;g.moveTo(left,12);g.lineTo(79-r,12);g.quadraticCurveTo(79,12,79,12-r);g.lineTo(79,-12+r);g.quadraticCurveTo(79,-12,79-r,-12);g.lineTo(left,-12);g.stroke();}}
  private valueLabel(text:string,x:number,y:number,w:number,size:number){const l=this.label(text,x,y,w,36,size,'#FFFFFF');l.enableOutline=true;l.outlineWidth=2;l.outlineColor=new Color(28,47,45,255);l.horizontalAlign=0;return l;}
  private statusIcon(kind:'heart'|'shield',x:number,y:number,color:string){const n=this.base(kind,x,y,24,24),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.strokeColor=new Color(38,86,75,255);g.lineWidth=1.5;
    if(kind==='heart'){g.moveTo(0,-10);g.bezierCurveTo(-23,3,-8,21,0,8);g.bezierCurveTo(8,21,23,3,0,-10);}else{g.moveTo(-10,8);g.lineTo(0,12);g.lineTo(10,8);g.lineTo(8,-4);g.lineTo(0,-12);g.lineTo(-8,-4);}g.close();g.fill();g.stroke();return n;}
  private resetFeedback(){this.feedback.reset([...this.model.heroes.map(h=>h.hp),...this.model.enemies.map(e=>e.hp)],[...this.model.heroes.map(h=>h.shield),0,0,0]);}
  // Native Cocos SpriteFrame regions reference the untouched concept texture.
  // Only reusable UI pieces are sampled; combat and live values are real nodes.
  private cut(name:string,sx:number,sy:number,sw:number,sh:number,x:number,y:number,w=sw,h=sh){return this.picture(this.ui,new Rect(sx,sy,sw,sh),x,y,w,h,name);}
  private roundPortrait(n:Node){const size=n.getComponent(UITransform)!.contentSize;const holder=this.base(n.name+' mask',n.position.x,n.position.y,size.width,size.height);holder.addComponent(Mask).type=Mask.Type.GRAPHICS_ELLIPSE;n.parent=holder;n.setPosition(0,0);}
  private drawPage(){
    // Match v5's 887 x 1774 layout: forest 0..1220, party 1220..1610, nav below.
    this.cut('Menu',17,30,68,63,-392,826).on(Node.EventType.TOUCH_END,()=>{this.menu.active=!this.menu.active;});
    this.label('镇外森林',0,811,500,82,60,'#542A12');
    this.status=this.label('第1波',0,754,340,48,35);
    this.cut('Coin',22,110,45,45,-400,754);
    this.goldLabel=this.label('0',-328,754,105,46,35);
    this.panel('Checkpoint rail',0,714,390,8,'#BFA77B',4);
    for(let i=0;i<6;i++){
      const x=-192+i*59;
      this.panel('Checkpoint rim',x,714,24,24,'#FFFAE8',12);
      this.panel('Checkpoint '+i,x,714,18,18,i===0?'#72C631':'#C2AD86',9);
    }
    this.label('⚑',183,717,70,55,48,'#AC9368');
    this.incomeLabel=this.label('击杀 0 · 每位英雄经验 +0',0,678,700,42,25);
    this.label('行动顺序',-332,611,220,48,28);
    this.model.order.forEach((id,i)=>{const x=-200+i*99;this.turns[id]=this.panel('Turn '+id,x,611,85,85,'#FFD34F',42);
      const t=id>=3?this.monsters:this.heroTextures[id];const rect=id>=3?this.monsterRect(id-3):new Rect(0,0,t.width,t.height);
      const portrait=this.picture(t,rect,x,611,82,82,'Initiative '+id);if(id>=3)this.enemyPortraits[id-3]=portrait;
      if(i<5)this.label('›',x+49,611,35,44,38);
    });
    this.speedLabel=this.button('1×',385,512,80,65,()=>{this.speed=this.speed===1?2:1;this.speedLabel.string=this.speed+'×';});
    this.speedLabel.fontSize=40;
    this.cut('Statistics button',788,421,81,84,385,424).on(Node.EventType.TOUCH_END,()=>{this.statsVisible=!this.statsVisible;this.stats.node.active=this.statsVisible;});
    this.cut('Auto skill button',788,519,83,86,385,325).on(Node.EventType.TOUCH_END,()=>{this.model.autoSkill=!this.model.autoSkill;this.sync();});
    this.autoDot=this.base('Auto state',416,361,26,26).addComponent(Graphics);
    this.positions.forEach(([x,y],i)=>{
      const by=y-(i>=3?125:140);this.bars[i]=this.bar(x,by);
      this.heartIcons[i]=this.statusIcon('heart',x-70,by-24,i<3?'#72E843':'#FF967B');this.hpLabels[i]=this.valueLabel('',x+23,by-24,150,26);
      this.shields[i]=this.valueLabel('',x+23,by-51,150,25);this.shieldIcons[i]=this.statusIcon('shield',x-70,by-51,'#6EDBFF');
    });
    this.model.enemies.forEach((e,j)=>{const [x,y]=this.positions[j+3];this.enemyNames[j]=this.label('',x,y+105,220,32,23);});
    this.cut('Formation',22,1141,152,59,-346,-284).on(Node.EventType.TOUCH_END,()=>this.toast('骑士前排：60%受击权重；法师、牧师各20%'));
    this.notice=this.label('持续挂机 · 收益按实际时间结算',55,-294,570,42,23);
    this.cut('Party background',580,1230,8,370,0,-528,887,390);
    for(const x of [-148,148])this.panel('Party divider',x,-514,2,260,'#EBD6AF',0);
    const xs=[-365,-70,225];
    for(let i=0;i<3;i++){
      const t=this.heroTextures[i];const portrait=this.picture(t,new Rect(0,0,t.width,t.height),xs[i],-430,112,112,'Party '+i);this.roundPortrait(portrait);
      this.label(HERO_CONFIG[i].name,xs[i]+113,-410,135,44,31);
      this.partyBars[i]=this.bar(xs[i]+128,-450);this.statusIcon('heart',xs[i]+42,-478,'#72E843');this.partyHP[i]=this.valueLabel('',xs[i]+135,-478,150,24);this.partyShields[i]=this.valueLabel('',xs[i]+135,-512,150,23);this.partyShieldIcons[i]=this.statusIcon('shield',xs[i]+42,-512,'#6EDBFF');
      for(let j=0;j<2;j++){
        const x=-355+i*295+j*133;
        const n=j===0?this.cut('Skill '+i,[28,316,612][i],1413,120,120,x,-585):this.cut('Locked '+i,161,1413,116,120,x,-585);
        n.on(Node.EventType.TOUCH_END,()=>{if(j===0){this.toast(this.model.requestSkill(i)?HERO_CONFIG[i].skill+'已排队':HERO_CONFIG[i].name+'技能冷却中、已排队或已倒下');this.sync();}else this.toast('第二主动技能尚未解锁');});
        this.label(j===0?HERO_CONFIG[i].skill:'待解锁',x,-669,135,48,30,j===0?C.ink:C.muted);
        if(j===0){this.skillShades[i]=this.base('Cooldown '+i,x,-585,120,120).addComponent(Graphics);this.skillLabels[i]=this.label('',x,-585,110,70,30,'#FFFFFF');}
      }
    }
    this.cut('Navigation background',580,1585,8,22,0,-802,887,170);
    const tabs=['英雄','招募','冒险','背包','副本'];
    const regions=[[11,1622,169,136],[181,1622,176,136],[359,1622,173,136],[535,1622,172,136],[709,1622,171,136]];
    tabs.forEach((text,i)=>{const r=regions[i];this.cut('Nav '+text,r[0],r[1],r[2],r[3],-348+i*174,-802,170,136).on(Node.EventType.TOUCH_END,()=>{if(i===0)this.openPage('hero');else if(i===3)this.openPage('bag');else if(i!==2)this.toast(text+'暂未开放，本轮仅验证冒险战斗');});});
    this.stats=this.label('',-25,425,600,155,25);this.stats.node.active=false;
    // Pause/retry belong in the hamburger menu, keeping the reference's battlefield clear.
    this.menu=this.panel('Battle menu',0,220,520,500,'#FFF6E4',30);
    this.label('战斗设置',0,205,450,55,36,C.ink,this.menu);
    const pause=this.button('暂停战斗',0,250,410,75,()=>{if(this.model.result!=='fighting')return;this.model.paused=!this.model.paused;this.pauseLabel.string=this.model.paused?'继续战斗':'暂停战斗';this.saveProgress();});
    pause.node.parent!.parent=this.menu;pause.node.parent!.setPosition(0,110);this.pauseLabel=pause;
    const retry=this.button('重新挑战',0,140,410,75,()=>{this.restart();this.menu.active=false;},C.gold);
    retry.node.parent!.parent=this.menu;retry.node.parent!.setPosition(0,15);
    const next=this.button('切换怪物并重试',0,0,410,75,()=>{this.restart((this.model.monsterIndex+1)%4);this.menu.active=false;},C.gold);next.node.parent!.parent=this.menu;next.node.parent!.setPosition(0,-80);
    this.label('四种怪物 · 点击菜单收起',0,-190,450,36,21,C.muted,this.menu);
    this.menu.active=false;
  }
  private toast(s:string){this.notice.string=s;}
  private monsterRect(slot=0){const i=this.model.enemies[slot].kind;return new Rect((i%2)*this.monsters.width/2,Math.floor(i/2)*this.monsters.height/2,this.monsters.width/2,this.monsters.height/2);}
  private setMonsterFrame(n:Node,slot:number){const f=new SpriteFrame();f.texture=this.monsters;f.rect=this.monsterRect(slot);n.getComponent(Sprite)!.spriteFrame=f;}
  private restart(index=this.model.monsterIndex){
    if(!this.ready)return;const previous=this.model,auto=previous.autoSkill;this.model=new SquadBattleModel(index,Math.random,3,true);this.model.inheritIncome(previous);this.floating=[];this.effects.forEach(n=>{Tween.stopAllByTarget(n);n.destroy();});this.effects.clear();this.model.autoSkill=auto;this.pauseLabel.string='暂停战斗';this.notice.string='持续挂机 · 收益按实际时间结算';
    this.units.forEach((n,i)=>{Tween.stopAllByTarget(n);const o=n.getComponent(UIOpacity);if(o){Tween.stopAllByTarget(o);o.opacity=255;}n.getComponent(Sprite)!.color=Color.WHITE;n.setScale(1,1,1);n.setPosition(this.positions[i][0],this.positions[i][1]);});
    this.shownWave=0;this.resetFeedback();this.sync();this.saveProgress();
  }
  private sync(){
    const b=this.model;
    this.status.string=b.regrouping?'整备后重试':b.waveDelay>0?'下一波即将入场':'第 '+b.wave+' 波';
    this.goldLabel.string=String(b.gold);this.incomeLabel.string='击杀 '+b.kills+' · 装备 '+b.inventory.length+' · 下件 '+Math.ceil(DROP_SECONDS-b.dropRemainder)+'秒';
    if(this.shownWave!==b.wave||(this.shownRegroup&&!b.regrouping)){
      this.shownWave=b.wave;this.model.enemies.forEach((e,j)=>{const n=this.units[j+3];this.setMonsterFrame(n,j);this.setMonsterFrame(this.enemyPortraits[j],j);});this.resetFeedback();this.feedback.enter();
    }this.shownRegroup=b.regrouping;
    b.enemies.forEach((e,j)=>{const i=j+3,hp=this.feedback.hp[i];this.hpLabels[i].string=hp+'/'+e.maxHp;this.paintBar(this.bars[i],hp,e.maxHp,'#F38B71');this.enemyNames[j].string='';this.heartIcons[i].active=hp>0;this.hpLabels[i].node.active=hp>0;this.bars[i].node.active=hp>0;this.shields[i].node.active=false;this.shieldIcons[i].active=false;});
    b.heroes.forEach((h,i)=>{
      const hp=this.feedback.hp[i],shield=this.feedback.shields[i];this.hpLabels[i].string=hp+'/'+b.stats(i).hp;this.partyHP[i].string=this.hpLabels[i].string;
      this.paintBar(this.bars[i],hp,b.stats(i).hp,'#9AF032',shield);this.paintBar(this.partyBars[i],hp,b.stats(i).hp,'#9AF032',shield);
      for(const l of [this.shields[i],this.partyShields[i]]){l.string=String(shield);l.node.active=shield>0&&hp>0;}
      this.shieldIcons[i].active=this.partyShieldIcons[i].active=shield>0&&hp>0;
      this.skillLabels[i].string=h.hp<=0?'已倒下':h.queued?'已排队':h.cooldown>0?h.cooldown.toFixed(1):'';
      const g=this.skillShades[i];g.clear();if(h.cooldown>0||h.hp<=0){g.fillColor=new Color(15,34,62,155);g.roundRect(-60,-60,120,h.hp<=0?120:Math.max(1,120*h.cooldown/HERO_CONFIG[i].cooldown),10);g.fill();}
    });
    this.autoDot.clear();this.autoDot.fillColor=new Color().fromHEX('#FFFFFF');this.autoDot.circle(0,0,13);this.autoDot.fill();this.autoDot.fillColor=new Color().fromHEX(b.autoSkill?'#71C730':'#B8A789');this.autoDot.circle(0,0,10);this.autoDot.fill();
    this.turns.forEach((n,i)=>n.active=b.result==='fighting'&&b.waveDelay===0&&i===b.nextActor);
    this.stats.string=b.heroes.map((h,i)=>HERO_CONFIG[i].name+' '+h.damage+(i===2?' / 治疗 '+h.healing:'')).join('   ')+'\n承伤 '+b.received+' · '+b.elapsed.toFixed(1)+'秒';
  }
  private impactText(hit:SquadHit){
    if(hit.damage)this.floating.push({target:hit.target,text:(hit.skill?'火焰 ':'−')+hit.damage,color:hit.actor>=3?'#EE7463':hit.skill?'#FFCD58':'#FFFFFF'});
    if(hit.blocked)this.floating.push({target:hit.target,text:'吸收 '+hit.blocked,color:'#8BD8FF'});
    if(hit.heal)this.floating.push({target:hit.target,text:'+'+hit.heal,color:'#95EF72'});
    if(hit.skill&&hit.actor===0)this.floating.push({target:0,text:'护盾 +'+this.model.stats(0).power,color:'#8BD8FF'});

    this.floatTimer=0;
    if(this.floating.length>18)this.floating.splice(0,this.floating.length-18);
  }
  private updateFloats(dt:number){
    this.floatTimer-=dt;if(this.floatTimer>0||!this.floating.length)return;this.floatTimer=.16;
    const f=this.floating.shift()!,p=this.positions[f.target],lane=this.floatSerial++%3;
    const l=this.label(f.text,p[0]+(lane-1)*23,p[1]+62+lane*18,240,48,32,f.color);
    l.node.setSiblingIndex(this.menu.getSiblingIndex());l.enableOutline=true;l.outlineColor=new Color(79,48,25,220);l.outlineWidth=2;
    const o=l.node.addComponent(UIOpacity);this.effects.add(l.node);l.node.setScale(.85,.85,1);
    tween(l.node).to(.10,{scale:new Vec3(1.08,1.08,1)}).to(.1,{scale:Vec3.ONE}).by(.65,{position:new Vec3(0,54,0)}).call(()=>{this.effects.delete(l.node);l.node.destroy();}).start();
    tween(o).delay(.48).to(.37,{opacity:0}).start();
  }
  private openPage(page:'adventure'|'hero'|'bag'){if(!this.heroPage||!this.bagPage)return;this.currentPage=page;this.resetFeedback();this.floating=[];if(page==='hero')this.heroPage.refresh();if(page==='bag'){this.bagPage.setGold(this.model.gold);this.bagPage.refresh();}this.root.active=page==='adventure';this.heroPage.node.active=page==='hero';this.bagPage.node.active=page==='bag';}
  update(dt:number){
    if(!this.ready)return;const count=this.model.inventory.length;this.model.settleIdle(dt);if(this.model.inventory.length>count){this.saveProgress();if(this.currentPage==='bag')this.bagPage.refresh();if(this.currentPage==='adventure')this.toast('获得 '+gearName(this.model.inventory[this.model.inventory.length-1])+' · 已进入背包');}this.saveClock+=dt;if(this.saveClock>=1){this.saveClock=0;this.saveProgress();}
    if(this.currentPage==='hero'){this.heroPage.refreshIncome();return;}if(this.currentPage==='bag'){this.bagPage.setGold(this.model.gold);return;}
    const visualDt=this.model.paused?0:Math.min(dt,.1)*this.speed;
    this.feedback.update(visualDt);for(const h of this.model.step(visualDt))this.feedback.play(h);this.updateFloats(this.model.paused?0:dt);this.sync();
  }
  private hide(){this.saveProgress();this.foregroundPaused=this.model.paused;this.background=true;this.model.paused=true;}
  private show(){this.background=false;this.model.paused=this.foregroundPaused;}
  onDestroy(){if(typeof window!=='undefined')window.removeEventListener('beforeunload',this.saveProgress);game.off(Game.EVENT_HIDE,this.hide,this);game.off(Game.EVENT_SHOW,this.show,this);}
}
