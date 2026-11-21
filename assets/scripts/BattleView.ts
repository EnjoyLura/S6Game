import {battleDelta} from './BattleTiming';
import {Node,UITransform,Layers,Color,Graphics,Label,Sprite,SpriteFrame,Texture2D,Rect,tween,Vec3,UIOpacity,Tween,Mask} from 'cc';
import {SquadBattleModel,HERO_CONFIG,SquadHit,SKILL_NAMES,DROP_SECONDS,DUNGEON_CONFIG} from './SquadBattleModel';
import {BattleFeedback} from './BattleFeedback';
import {drawNavigation} from './GearView';
import {ModalView,modalButton,modalText,modalSection} from './ModalView';
const C={ink:'#704124',cream:'#FFF6E4'};
export type BattleArt={forest:Texture2D;ui:Texture2D;nav:Texture2D;bag:Texture2D;heroes:Texture2D[];monsters:Texture2D};
export type BattleOptions={title:string;dungeon?:boolean;subtitle?:()=>string;onChange:()=>void;onIncome?:()=>void;onFormation:()=>void;navigate:(index:number)=>void;onLeave?:()=>void;onEnd?:()=>void;onRestart?:(index?:number)=>void};
/** Shared adventure/dungeon presentation. Resource settlement stays with the owning page. */
export class BattleView{
 readonly root:Node;private speed=1;private battleArt:Texture2D[];
 private actors!:Node;private resultButton:Node|null=null;
 private get model(){return this.getModel();}
  private units:Node[]=[]; private hpLabels:Label[]=[]; private bars:Graphics[]=[];
  private contactShadows:{node:Node;offset:number}[]=[];
  private partyHP:Label[]=[]; private partyBars:Graphics[]=[]; private skillLabels:Label[]=[]; private skillShades:Graphics[]=[];
  private turns:Node[]=[]; private positions=[[-95,75],[-290,260],[-290,-55],[260,270],[210,70],[270,-135]];
  private status!:Label; private notice!:Label; private speedLabel!:Label; private pauseLabel!:Label; private stats!:Label; private enemyNames:Label[]=[]; private goldLabel!:Label; private incomeLabel!:Label;
  private heartIcons:Node[]=[]; private shields:Label[]=[];private shieldIcons:Node[]=[];private partyShields:Label[]=[];private partyShieldIcons:Node[]=[];private feedback!:BattleFeedback; private autoDot!:Graphics; private menu!:Node;
  private ui!:Texture2D; private heroTextures:Texture2D[]=[]; private monsters!:Texture2D; private enemyPortraits:Node[]=[]; private shownWave=0; private shownRegroup=false;
  private floating:{target:number;text:string;color:string}[]=[]; private floatTimer=0; private floatSerial=0; private effects=new Set<Node>();
  constructor(parent:Node,private getModel:()=>SquadBattleModel,art:BattleArt,private options:BattleOptions){
    this.root=new Node(options.dungeon?'Dungeon battle':'Adventure page');this.root.layer=Layers.Enum.UI_2D;this.root.parent=parent;this.root.addComponent(UITransform).setContentSize(887,1774);
    this.ui=art.ui;this.heroTextures=art.heroes;this.monsters=art.monsters;this.battleArt=[art.forest,art.nav,art.bag];this.rebuildBattle();
  }
  externalPresentation=false;private externalForest:Texture2D|null=null;
  useExternalPresentation(texture?:Texture2D){this.externalPresentation=true;if(texture)this.externalForest=texture;for(const n of this.root.children)n.active=n===this.actors||n.name==='Forest';const forest=this.root.getChildByName('Forest');if(forest&&this.externalForest){const f=new SpriteFrame();f.texture=this.externalForest;f.rect=new Rect(0,0,this.externalForest.width,this.externalForest.height);forest.getComponent(Sprite)!.spriteFrame=f;}}
  getSpeed(){return this.speed;}
  cycleSpeed(){this.speed=this.speed===1?2:1;}
  update(dt:number){const visual=battleDelta(dt,this.model.paused,this.speed);this.feedback.update(visual);for(const hit of this.model.step(visual))this.feedback.play(hit);this.updateFloats(this.model.paused?0:dt);this.sync();}
  destroy(){this.effects.forEach(n=>{Tween.stopAllByTarget(n);n.destroy();});this.effects.clear();this.root.active=false;this.root.destroy();}
  private rebuildBattle(){
    this.effects.forEach(n=>{Tween.stopAllByTarget(n);n.destroy();});this.effects.clear();this.floating=[];
    this.root.destroyAllChildren();this.units=[];this.contactShadows=[];this.turns=[];this.enemyPortraits=[];this.partyHP=[];this.partyBars=[];this.skillLabels=[];this.skillShades=[];this.partyShields=[];this.partyShieldIcons=[];
    this.panel('Page',0,0,887,1774,C.cream,0);
    const [forest,heroUI,bagUI]=this.battleArt;this.shownWave=0;
      this.picture(forest,new Rect(0,0,forest.width,forest.height),0,277,887,1220,'Forest');
      this.actors=this.base('Battle actors',0,0,887,1774);
      this.model.formation.forEach((id,i)=>{const t=this.heroTextures[id];const [x,y]=this.positions[i];this.units.push(this.picture(t,new Rect(0,0,t.width,t.height),x,y,i===0?280:260,i===0?280:260,HERO_CONFIG[this.model.formation[i]].name));});
      for(let i=this.units.length;i<3;i++){this.units[i]=this.picture(this.heroTextures[0],new Rect(0,0,this.heroTextures[0].width,this.heroTextures[0].height),this.positions[i][0],this.positions[i][1],260,260,'Empty slot');}
      this.model.enemies.forEach((e,j)=>{const [x,y]=this.positions[j+3];this.units.push(this.picture(this.monsters,this.monsterRect(j),x,y,260,260,'Monster '+j));});
      this.units.forEach(n=>n.parent=this.actors);
      if(this.model.formation.length>1)this.units[1].setSiblingIndex(0);
      this.units.forEach((unit,i)=>{
        const size=unit.getComponent(UITransform)!.contentSize,offset=this.contactOffset(unit),shadow=this.base('Contact shadow '+i,this.positions[i][0],this.positions[i][1]+offset,190,28,this.actors),g=shadow.addComponent(Graphics);
        g.fillColor=new Color(58,68,24,85);g.ellipse(0,0,size.width*.32,13);g.fill();shadow.setSiblingIndex(0);this.contactShadows.push({node:shadow,offset});
      });
      const fxLayer=this.base('Combat effects',0,0,887,1774,this.actors);this.feedback=new BattleFeedback(this.units,this.positions,fxLayer,h=>this.impactText(h));this.resetFeedback();
      this.drawPage(heroUI,bagUI);this.sync();if(this.externalPresentation)this.useExternalPresentation();this.pauseLabel.string=this.model.paused?'继续战斗':'暂停战斗';
  }
  private contactOffset(unit:Node){
    const frame=unit.getComponent(Sprite)!.spriteFrame!,rect=frame.rect,height=unit.getComponent(UITransform)!.height;
    if(typeof document==='undefined')return -height*.43+2;
    const canvas=document.createElement('canvas');canvas.width=rect.width;canvas.height=rect.height;
    const ctx=canvas.getContext('2d')!;ctx.drawImage((frame.texture as Texture2D).image.data as CanvasImageSource,rect.x,rect.y,rect.width,rect.height,0,0,rect.width,rect.height);
    const pixels=ctx.getImageData(0,0,rect.width,rect.height).data;
    for(let y=rect.height-1;y>=0;y--)for(let x=0;x<rect.width;x++)if(pixels[(y*rect.width+x)*4+3]>32)return -height*((y+1)/rect.height-.5)+2;
    return -height*.43+2;
  }
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
  refreshFormation(){this.rebuildBattle();}
  resetFeedback(){this.feedback.reset([...[0,1,2].map(i=>this.model.party[i]?.hp||0),...this.model.enemies.map(e=>e.hp)],[...[0,1,2].map(i=>this.model.party[i]?.shield||0),0,0,0]);}
  // Native Cocos SpriteFrame regions reference the untouched concept texture.
  // Only reusable UI pieces are sampled; combat and live values are real nodes.
  private cut(name:string,sx:number,sy:number,sw:number,sh:number,x:number,y:number,w=sw,h=sh){return this.picture(this.ui,new Rect(sx,sy,sw,sh),x,y,w,h,name);}
  private roundPortrait(n:Node){const size=n.getComponent(UITransform)!.contentSize;const holder=this.base(n.name+' mask',n.position.x,n.position.y,size.width,size.height);holder.addComponent(Mask).type=Mask.Type.GRAPHICS_ELLIPSE;n.parent=holder;n.setPosition(0,0);}
  private drawPage(navAtlas:Texture2D,bagAtlas:Texture2D){
    // Match v5's 887 x 1774 layout: forest 0..1220, party 1220..1610, nav below.
    this.cut('Menu',17,30,68,63,-392,826).on(Node.EventType.TOUCH_END,()=>{this.menu.active=!this.menu.active;});
    this.label(this.options.title,0,811,640,82,this.options.dungeon?48:60,'#542A12');
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
    if(this.options.onIncome){this.cut('Offline rewards',17,30,68,63,-392,510).on(Node.EventType.TOUCH_END,this.options.onIncome);this.label('收益',-392,457,95,40,23);}
    this.model.order.forEach((id,i)=>{const x=-200+i*99;this.turns[id]=this.panel('Turn '+id,x,611,85,85,'#FFD34F',42);
      const t=id>=3?this.monsters:this.heroTextures[this.model.formation[id]];const rect=id>=3?this.monsterRect(id-3):new Rect(0,0,t.width,t.height);
      const portrait=this.picture(t,rect,x,611,82,82,'Initiative '+id);if(id>=3)this.enemyPortraits[id-3]=portrait;
      if(i<5)this.label('›',x+49,611,35,44,38);
    });
    this.speedLabel=this.button(this.speed+'×',385,512,80,65,()=>{this.speed=this.speed===1?2:1;this.speedLabel.string=this.speed+'×';});
    this.speedLabel.fontSize=40;
    this.cut('Statistics button',788,421,81,84,385,424).on(Node.EventType.TOUCH_END,()=>this.showStatistics());
    this.cut('Auto skill button',788,519,83,86,385,325).on(Node.EventType.TOUCH_END,()=>{this.model.autoSkill=!this.model.autoSkill;this.sync();this.options.onChange();});
    this.autoDot=this.base('Auto state',416,361,26,26).addComponent(Graphics);
    this.positions.forEach(([x,y],i)=>{
      const by=y-(i>=3?125:140);this.bars[i]=this.bar(x,by);
      this.heartIcons[i]=this.statusIcon('heart',x-70,by-24,i<3?'#72E843':'#FF967B');this.hpLabels[i]=this.valueLabel('',x+23,by-24,150,26);
      this.shields[i]=this.valueLabel('',x+23,by-51,150,25);this.shieldIcons[i]=this.statusIcon('shield',x-70,by-51,'#6EDBFF');
      [this.bars[i].node,this.heartIcons[i],this.hpLabels[i].node,this.shields[i].node,this.shieldIcons[i]].forEach(n=>n.parent=this.actors);
    });
    this.model.enemies.forEach((e,j)=>{const [x,y]=this.positions[j+3];this.enemyNames[j]=this.label('',x,y+105,220,32,23);this.enemyNames[j].node.parent=this.actors;});
    this.cut('Formation',22,1141,152,59,-346,-260).on(Node.EventType.TOUCH_END,()=>this.options.onFormation());
    this.notice=this.label(this.options.dungeon?'点击技能手动释放 · 可切换自动技能':'持续挂机 · 收益按实际时间结算',55,-270,570,42,23);
    this.notice.node.name='Battle notice';
    this.cut('Party background',580,1230,8,370,0,-528,887,390);
    for(const x of [-148,148])this.panel('Party divider',x,-514,2,260,'#EBD6AF',0);
    const xs=[-365,-70,225];
    for(let i=0;i<this.model.formation.length;i++){
      const id=this.model.formation[i],t=this.heroTextures[id];const portrait=this.picture(t,new Rect(0,0,t.width,t.height),xs[i],-430,112,112,'Party '+i);this.roundPortrait(portrait);
      this.label(HERO_CONFIG[id].name,xs[i]+113,-410,135,44,31);
      this.partyBars[i]=this.bar(xs[i]+128,-450);this.statusIcon('heart',xs[i]+42,-478,'#72E843');this.partyHP[i]=this.valueLabel('',xs[i]+135,-478,150,24);this.partyShields[i]=this.valueLabel('',xs[i]+135,-512,150,23);this.partyShieldIcons[i]=this.statusIcon('shield',xs[i]+42,-512,'#6EDBFF');
      for(let j=0;j<2;j++){
        const x=-355+i*295+j*133;
        const n=this.model.unlocked(id,j*2)?(id===3?this.picture(bagAtlas,new Rect(405,618,120,85),x,-585,120,120,'Archer skill'):this.cut('Skill '+i,[28,316,612][id],1413,120,120,x,-585)):this.cut('Locked '+i,161,1413,116,120,x,-585);
        n.on(Node.EventType.TOUCH_END,()=>{this.toast(this.model.requestSkill(i,j)?SKILL_NAMES[id][j*2]+'已排队':'技能未解锁、冷却中、已排队或已倒下');this.sync();this.options.onChange();});
        this.label(this.model.unlocked(id,j*2)?SKILL_NAMES[id][j*2]:j===1?'5级解锁':'待解锁',x,-669,135,48,30,C.ink);
        this.skillShades[i*2+j]=this.base('Cooldown '+i+' '+j,x,-585,120,120).addComponent(Graphics);this.skillLabels[i*2+j]=this.label('',x,-585,110,70,30,'#FFFFFF');
      }
    }
    drawNavigation(this.root,navAtlas,bagAtlas,this.options.dungeon?4:2,this.options.navigate);
    this.stats=this.label('',-25,425,600,155,25);this.stats.node.active=false;
    const menuView=new ModalView(this.root,'战斗设置',870,()=>{this.menu.active=false;});this.menu=menuView.layer;const card=menuView.card;
    const pause=modalButton(card,'暂停战斗',0,145,520,78,()=>{if(this.model.result!=='fighting')return;this.model.paused=!this.model.paused;this.pauseLabel.string=this.model.paused?'继续战斗':'暂停战斗';this.options.onChange();});
    this.pauseLabel=pause.children[pause.children.length-1].getComponent(Label)!;
    if(this.options.dungeon){
      modalButton(card,'离开战斗',0,30,520,78,()=>this.options.onLeave!(),'peach');
      modalText(card,'离开可继续挑战；结束不返还体力与次数。',0,-95,680,85,25);
      modalButton(card,'结束挑战',0,-300,520,78,()=>this.options.onEnd!(),'peach');
    }else{
      modalButton(card,'重新挑战',0,30,520,78,()=>{this.options.onRestart!();},'peach');
      modalText(card,'重新挑战会重置当前波战斗，保留成长与收益。',0,-95,680,85,25);
      modalButton(card,'切换怪物并重试',0,-300,520,78,()=>this.options.onRestart!((this.model.monsterIndex+1)%4),'peach');
    }
    this.menu.active=false;
    if(this.options.dungeon){this.resultButton=this.button('查看结算',55,-270,570,59,()=>this.options.onEnd!()).node.parent!;this.resultButton.active=false;}
  }
  private statisticsModal:Node|null=null;
  private showStatistics(){
    if(this.statisticsModal){this.statisticsModal.destroy();this.statisticsModal=null;return;}
    const view=new ModalView(this.root,'战斗统计',920,()=>{view.layer.destroy();this.statisticsModal=null;});this.statisticsModal=view.layer;
    modalSection(view.card,'输出与治疗',215);
    this.stats=this.label('',0,5,680,300,31,C.ink,view.card);this.sync();
    modalText(view.card,'统计当前挑战中的实际伤害、治疗与承伤。',0,-270,680,75,24);
  }
  toast(s:string){this.notice.string=s;}
  private monsterRect(slot=0){const i=this.model.enemies[slot].kind;return new Rect((i%2)*this.monsters.width/2,Math.floor(i/2)*this.monsters.height/2,this.monsters.width/2,this.monsters.height/2);}
  private setMonsterFrame(n:Node,slot:number){const f=new SpriteFrame();f.texture=this.monsters;f.rect=this.monsterRect(slot);n.getComponent(Sprite)!.spriteFrame=f;const shadow=this.contactShadows[slot+3];if(shadow&&n===this.units[slot+3])shadow.offset=this.contactOffset(n);}
  private sync(){
    const b=this.model;if(this.resultButton){this.resultButton.active=b.result!=='fighting';this.notice.node.active=b.result==='fighting';}
    this.status.string=this.options.dungeon?this.options.subtitle!():b.regrouping?'整备后重试':b.waveDelay>0?'下一波即将入场':'第 '+b.wave+' 波';
    this.goldLabel.string=String(b.gold);this.incomeLabel.string=this.options.dungeon?(b.encounter?.id===5?'第 '+b.wave+' 关 · 已通关 '+b.clearedWaves:b.wave>DUNGEON_CONFIG.mobWaves?'Boss 波 · 击败首领及护卫':('第 '+b.wave+'/'+(DUNGEON_CONFIG.mobWaves+1)+' 波 · 击败 '+b.enemies.filter(e=>e.hp<=0).length+'/3')):'击杀 '+b.kills+' · 装备 '+b.inventory.length+' · 下件 '+Math.ceil(DROP_SECONDS-b.dropRemainder)+'秒';
    if(this.shownWave!==b.wave||(this.shownRegroup&&!b.regrouping)){
      this.shownWave=b.wave;this.model.enemies.forEach((e,j)=>{const n=this.units[j+3];const size=b.encounter&&b.encounter.id!==5&&b.wave>DUNGEON_CONFIG.mobWaves&&j===0?330:260;n.getComponent(UITransform)!.setContentSize(size,size);this.setMonsterFrame(n,j);this.setMonsterFrame(this.enemyPortraits[j],j);});this.resetFeedback();this.feedback.enter();
    }this.shownRegroup=b.regrouping;
    this.contactShadows.forEach(({node,offset},i)=>{const unit=this.units[i],angle=unit.angle*Math.PI/180,foot=(offset-2)*unit.scale.y;node.active=(this.feedback.hp[i]||0)>0;node.setPosition(unit.position.x-foot*Math.sin(angle),unit.position.y+foot*Math.cos(angle)+2,0);node.setScale(unit.scale.x,1,1);});
    b.enemies.forEach((e,j)=>{const i=j+3,hp=this.feedback.hp[i];this.hpLabels[i].string=hp+'/'+e.maxHp;this.paintBar(this.bars[i],hp,e.maxHp,'#F38B71');this.enemyNames[j].string=b.encounter&&b.encounter.id!==5&&b.wave>DUNGEON_CONFIG.mobWaves&&j===0&&hp>0?'BOSS':'';this.heartIcons[i].active=hp>0;this.hpLabels[i].node.active=hp>0;this.bars[i].node.active=hp>0;this.shields[i].node.active=false;this.shieldIcons[i].active=false;});
    for(let i=0;i<3;i++){const active=i<b.formation.length;this.bars[i].node.active=active;this.hpLabels[i].node.active=active;this.heartIcons[i].active=active;if(!active){this.shields[i].node.active=false;this.shieldIcons[i].active=false;}}
    b.party.forEach((h,i)=>{
      const hp=this.feedback.hp[i],shield=this.feedback.shields[i];this.hpLabels[i].string=hp+'/'+b.battleStats(i).hp;this.partyHP[i].string=this.hpLabels[i].string;
      this.paintBar(this.bars[i],hp,b.battleStats(i).hp,'#9AF032',shield);this.paintBar(this.partyBars[i],hp,b.battleStats(i).hp,'#9AF032',shield);
      for(const l of [this.shields[i],this.partyShields[i]]){l.string=String(shield);l.node.active=shield>0&&hp>0;}
      this.shieldIcons[i].active=this.partyShieldIcons[i].active=shield>0&&hp>0;
      for(let j=0;j<2;j++){const cd=j?h.cooldown2:h.cooldown,q=j?h.queued2:h.queued,open=b.unlocked(b.formation[i],j*2);this.skillLabels[i*2+j].string=!open?'':h.hp<=0?'已倒下':q?'已排队':cd>0?cd.toFixed(1):'';
      const g=this.skillShades[i*2+j];g.clear();if(cd>0||h.hp<=0){g.fillColor=new Color(15,34,62,155);g.roundRect(-60,-60,120,h.hp<=0?120:Math.max(1,120*cd/(j?b.secondCooldown(b.formation[i]):b.battleStats(i).cooldown)),10);g.fill();}}

    });
    this.autoDot.clear();this.autoDot.fillColor=new Color().fromHEX('#FFFFFF');this.autoDot.circle(0,0,13);this.autoDot.fill();this.autoDot.fillColor=new Color().fromHEX(b.autoSkill?'#71C730':'#B8A789');this.autoDot.circle(0,0,10);this.autoDot.fill();
    this.turns.forEach((n,i)=>n.active=!this.externalPresentation&&b.result==='fighting'&&b.waveDelay===0&&i===b.nextActor);
    if(this.stats&&this.stats.isValid)this.stats.string=b.party.map((h,i)=>b.battleStats(i).name+' '+h.damage+(b.formation[i]===2?' / 治疗 '+h.healing:'')).join('\n')+'\n承伤 '+b.received+' · '+b.elapsed.toFixed(1)+'秒';
  }
  private impactText(hit:SquadHit){
    if(hit.dodged)this.floating.push({target:hit.target,text:'闪避',color:'#AEEBFF'});
    if(hit.critical||hit.combo)this.floating.push({target:hit.target,text:hit.combo?'连击':'暴击',color:'#FFE36D'});
    if(hit.damage)this.floating.push({target:hit.target,text:(hit.skill&&hit.actor<3?SKILL_NAMES[this.model.formation[hit.actor]][hit.skillSlot||0]+' ':'−')+hit.damage,color:hit.actor>=3?'#EE7463':hit.skill?'#FFCD58':'#FFFFFF'});
    if(hit.blocked)this.floating.push({target:hit.target,text:'吸收 '+hit.blocked,color:'#8BD8FF'});
    if(hit.heal)this.floating.push({target:hit.target,text:'+'+hit.heal,color:'#95EF72'});
    if(hit.skill&&!hit.damage&&hit.actor<3&&this.model.formation[hit.actor]===0)this.floating.push({target:hit.actor,text:'护盾 +'+this.model.shieldCapacity(this.model.formation[hit.actor]),color:'#8BD8FF'});

    this.floatTimer=0;
    if(this.floating.length>18)this.floating.splice(0,this.floating.length-18);
  }
  private updateFloats(dt:number){
    this.floatTimer-=dt;if(this.floatTimer>0||!this.floating.length)return;this.floatTimer=.16;
    const f=this.floating.shift()!,p=this.positions[f.target],lane=this.floatSerial++%3;
    const l=this.label(f.text,p[0]+(lane-1)*23,p[1]+62+lane*18,240,48,32,f.color,this.actors);
    l.enableOutline=true;l.outlineColor=new Color(79,48,25,220);l.outlineWidth=2;
    const o=l.node.addComponent(UIOpacity);this.effects.add(l.node);l.node.setScale(.85,.85,1);
    tween(l.node).to(.10,{scale:new Vec3(1.08,1.08,1)}).to(.1,{scale:Vec3.ONE}).by(.65,{position:new Vec3(0,54,0)}).call(()=>{this.effects.delete(l.node);l.node.destroy();}).start();
    tween(o).delay(.48).to(.37,{opacity:0}).start();
  }
}
