import {formationModal} from './FormationModal';
import {equipmentHeader,equipmentStats} from './EquipmentModal';
import {ModalView,modalIcon,inModal,modalButton,modalRow,modalSection,modalPanel,modalImage} from './ModalView';
import { Node, UITransform, Graphics, Label, Color, Texture2D, SpriteFrame, Sprite, Rect, Layers, BlockInputEvents, Mask, ScrollView } from 'cc';
import { TALENTS, SKILL_LEVELS, SKILL_NAMES, SECOND_COOLDOWN, STAR_CONFIG, HERO_CONFIG, upgradeCost, LEVEL_CAP, SquadBattleModel, gearName, gearDescription, gearStats, QUALITY_NAMES } from './SquadBattleModel';

import {gearTile,drawNavigation} from './GearView';

const INK='#704124', CREAM='#FFF5E5';
const HEROES=['骑士','法师','牧师','弓箭手'];
const EQUIPMENT=['武器','戒指','项链','头盔','衣服','鞋子'];
// Roster progression is independent of the three battle positions.
export class HeroPage {
  readonly node:Node;
  private selected=0; private balance!:Label; private experienceLabel!:Label; private experienceFill!:Graphics; private upgradeButton!:Node;
  private content!:Node;
  private dialog:Node|null=null;
  constructor(parent:Node,private atlas:Texture2D,private forest:Texture2D,private actors:Texture2D,private onAdventure:()=>void,private onBag:(slot?:number,hero?:number)=>void,private heroTextures:Texture2D[],private battleUI:Texture2D,private progress:()=>{gold:number;experience:number[];levels:number[];stats:typeof HERO_CONFIG},private onUpgrade:(i:number)=>string|null,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null,private bagAtlas:Texture2D,private onRecruit:()=>void,private onDungeon:()=>void){
    this.node=this.nodeAt(parent,'Hero page',0,0,887,1774);this.render();this.node.active=false;
  }
  private nodeAt(parent:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.layer=Layers.Enum.UI_2D;n.parent=parent;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
  private panel(parent:Node,x:number,y:number,w:number,h:number,color=CREAM,r=25){const n=this.nodeAt(parent,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
  private text(parent:Node,text:string,x:number,y:number,w:number,h:number,size=28,color=INK){const n=this.nodeAt(parent,text,x,y,w,h),l=n.addComponent(Label);l.string=text;l.fontFamily='Microsoft YaHei';l.isBold=true;l.fontSize=size;l.lineHeight=size*1.4;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
  private sprite(parent:Node,t:Texture2D,rect:Rect,x:number,y:number,w:number,h:number){const n=this.nodeAt(parent,'Artwork',x,y,w,h),f=new SpriteFrame();f.texture=t;f.rect=rect;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;n.getComponent(UITransform)!.setContentSize(w,h);return n;}
  private cut(sx:number,sy:number,sw:number,sh:number,x:number,y:number,w=sw,h=sh,parent=this.content){return this.sprite(parent,this.atlas,new Rect(sx,sy,sw,sh),x,y,w,h);}
  private button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,color='#FFCE52'){if(inModal(parent))return modalButton(parent,text,x,y,w,h,fn,color==='#E2D2B9'?'muted':color==='#FFCE52'?'gold':'peach');const n=this.panel(parent,x,y,w,h,color,h/2);this.text(n,text,0,0,w-18,h-6,30);n.on(Node.EventType.TOUCH_END,fn);return n;}
  private round(n:Node){const u=n.getComponent(UITransform)!;const h=this.nodeAt(n.parent!, 'Portrait mask',n.position.x,n.position.y,u.width,u.height);h.addComponent(Mask).type=Mask.Type.GRAPHICS_ELLIPSE;n.parent=h;n.setPosition(0,0);}
  private info(title:string,body:string){
    this.closeEquipment();
    const {layer,card}=this.equipmentLayer(title,820);this.dialog=layer;
    modalIcon(card,4,0,120,90);this.text(card,body,0,-80,680,260,28);
  }

  private closeEquipment(){this.dialog?.destroy();this.dialog=null;}
  private equipmentLayer(title:string,height:number,parent=this.node){
    let view:ModalView;view=new ModalView(parent,title,height,()=>{if(view.layer===this.dialog)this.closeEquipment();else view.layer.destroy();});
    return {layer:view.layer,card:view.card};
  }
  private equipmentInfo(slot:number){
    const g=this.model().equipment(this.selected)[slot];this.closeEquipment();
    if(g)this.equipmentDetail(g.id);else this.equipmentPicker(slot);
  }
  private equipmentPicker(initialSlot:number){
    let part=initialSlot,quality=-1;
    const {layer,card}=this.equipmentLayer('装备选择',1430);this.dialog=layer;
    let body:Node|null=null;
    const draw=()=>{
      body?.destroy();body=this.nodeAt(card,'Equipment picker content',0,-20,780,1180);const p=body!,b=this.model();
      const items=b.inventory.filter(g=>b.owner(g.id)<0&&(part<0||g.slot===part)&&(quality<0||g.quality===quality)).slice().sort((a,b)=>b.quality-a.quality||b.level-a.level||b.id-a.id);
      const viewport=this.nodeAt(p,'Equipment selection scroll',0,95,750,850);viewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;
      const list=this.nodeAt(viewport,'Equipment choices',0,425,750,Math.max(850,Math.ceil(items.length/5)*150+20));list.getComponent(UITransform)!.setAnchorPoint(.5,1);
      const scroll=viewport.addComponent(ScrollView);scroll.content=list;scroll.horizontal=false;scroll.vertical=true;scroll.cancelInnerEvents=true;
      items.forEach((g,i)=>{const owner=b.owner(g.id),n=gearTile(list,this.bagAtlas,g,g.slot,-300+i%5*150,-80-Math.floor(i/5)*150,138,owner>=0?HEROES[owner]:'');n.on(Node.EventType.TOUCH_END,()=>this.equipmentDetail(g.id,layer,draw));});
      for(let i=items.length;i<Math.max(15,Math.ceil(items.length/5)*5);i++)this.panel(list,-300+i%5*150,-80-Math.floor(i/5)*150,138,138,'#E8D7BD',16);
      if(!items.length)this.text(viewport,'没有符合条件的装备\n可调整部位或品质筛选',0,180,680,110,30,'#AA8060');
      this.text(p,'品阶',-310,-427,100,50,29);
      this.button(p,(quality<0?'全部':QUALITY_NAMES[quality])+' ▾',-100,-427,285,65,()=>{
        // Anchored select menu opens upward because this control sits at the bottom.
        // A transparent dismiss target blocks clicks through to the inventory beneath it.
        const dropdown=this.nodeAt(layer,'Quality dropdown',0,0,887,1774);dropdown.addComponent(BlockInputEvents);
        dropdown.on(Node.EventType.TOUCH_END,()=>dropdown.destroy());
        const choices=this.panel(dropdown,-100,-214,285,390,'#E9CBA4',18);
        choices.addComponent(BlockInputEvents);choices.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);
        ['全部',...QUALITY_NAMES].forEach((name,i)=>this.button(choices,name,0,160-i*64,273,60,()=>{quality=i-1;dropdown.destroy();draw();},quality===i-1?'#FFCE52':CREAM));
      },'#F4E2CA');
      this.text(p,items.length+'件',290,-427,130,50,29);
      const parts=[-1,0,3,4,5,1,2];
      const art=[[77,376,98,85],[85,550,95,87],[84,725,91,85],[708,375,107,84],[702,550,113,83],[706,727,111,79]];
      parts.forEach((slot,i)=>{
        const tab=this.panel(p,-324+i*108,-555,100,140,part===slot?'#FFCE52':'#F4E2CA',18);
        if(slot<0){const icon=this.nodeAt(tab,'All equipment icon',0,22,64,64),g=icon.addComponent(Graphics);g.fillColor=new Color().fromHEX(INK);
          for(const x of [-27,5])for(const y of [-27,5]){g.roundRect(x,y,22,22,5);g.fill();}
        }else{const [x,y,w,h]=art[slot];const icon=this.cut(x,y,w,h,0,24,72,66,tab);this.round(icon);}
        this.text(tab,slot<0?'全部':EQUIPMENT[slot],0,-41,96,42,27);
        tab.on(Node.EventType.TOUCH_END,()=>{part=slot;draw();});
      });
    };
    draw();
  }
  private equipmentDetail(id:number,picker?:Node,refreshPicker?:()=>void){
    const b=this.model(),g=b.inventory.find(g=>g.id===id);if(!g)return;
    const owner=b.owner(id),current=b.equipment(this.selected)[g.slot];
    const {layer,card}=this.equipmentLayer('装备详情',1180,picker||this.node);if(!picker)this.dialog=layer;
    equipmentHeader(card,this.bagAtlas,g,330);equipmentStats(card,g,200);
    const values=gearStats(g),old=current?gearStats(current):{hp:0,attack:0,defense:0,power:0};
    const difference=(key:'hp'|'attack'|'defense'|'power')=>{const n=values[key]-old[key];return (n>=0?'+':'')+n;};
    this.text(card,owner>=0?'已穿戴：'+HEROES[owner]+' · 卸下后回到背包':'替换变化：生命 '+difference('hp')+' · 攻击 '+difference('attack')+'\n防御 '+difference('defense')+' · 技能效果 '+difference('power'),0,-170,690,100,27);
    this.text(card,owner<0?'穿戴给：'+HEROES[this.selected]:'',0,-252,690,45,27);
    const result=this.text(card,'',0,-350,680,70,25,'#B45B38');
    this.button(card,owner>=0?'卸下':'穿戴',0,-460,360,78,()=>{
      if(this.model().owner(id)!==owner){result.string='装备归属已变化，请关闭后重试';return;}
      const error=this.mutate(b=>b.equip(owner>=0?owner:this.selected,owner>=0?null:id,g.slot));if(error){result.string=error;return;}
      this.render();if(picker){picker.setSiblingIndex(this.node.children.length-1);layer.destroy();refreshPicker?.();}else this.closeEquipment();
    });
  }
  private talentDialog(selected=2){
    const id=this.selected,b=this.model();if(!b.owns(id)){this.info('天赋树','请先招募该英雄');return;}
    this.closeEquipment();const {layer,card}=this.equipmentLayer('英雄天赋',1260);this.dialog=layer;
    this.text(card,HEROES[id]+' · Lv.'+b.heroes[id].level,0,365,680,55,34);
    this.text(card,'可用天赋点 '+b.talentPoints(id),0,305,680,48,29);
    const positions=[[0,200],[-190,40],[190,40],[190,-125]];
    const lines=this.nodeAt(card,'Talent connections',0,0,700,450).addComponent(Graphics);lines.strokeColor=new Color().fromHEX('#D7AE68');lines.lineWidth=5;
    for(const [a,z] of [[0,1],[0,2],[2,3]]){lines.moveTo(positions[a][0],positions[a][1]);lines.lineTo(positions[z][0],positions[z][1]);lines.stroke();}
    TALENTS.forEach((c,j)=>{const [x,y]=positions[j],rank=b.heroes[id].talents[j],n=modalPanel(card,x,y,170,122,selected===j?'#FFD464':'#FBE1C2',22);
      this.text(n,['♥','⚔','✦','◷'][j],-48,15,66,60,46);this.text(n,c.name,22,25,104,48,24);this.text(n,rank+'/'+c.max,22,-23,110,38,25);
      n.on(Node.EventType.TOUCH_END,()=>this.talentDialog(j));
    });
    const c=TALENTS[selected],rank=b.heroes[id].talents[selected];modalSection(card,c.name,-235);
    this.text(card,c.description+'\n消耗 '+c.cost+'点'+(selected===3?' · 需要技能强化1级':''),0,-315,680,90,26);
    this.button(card,'重置天赋',-177,-500,290,78,()=>{const error=this.mutate(m=>m.resetTalents(id));if(error){this.info('天赋重置',error);return;}this.render();this.talentDialog(selected);},'#FFB98D');
    this.button(card,rank===c.max?'已满级':'学习节点',177,-500,290,78,()=>{const error=this.mutate(m=>m.trainTalent(id,selected));if(error){this.info('天赋培养',error);return;}this.render();this.talentDialog(selected);},rank===c.max?'#E2D2B9':'#FFCE52');
  }
  private starDialog(){
    const id=this.selected,p=this.model().starPreview(id);if(!p){this.info('英雄升星','请先招募该英雄');return;}
    this.closeEquipment();const {layer,card}=this.equipmentLayer('英雄升星',1110);this.dialog=layer;
    const max=p.stars===STAR_CONFIG.cap,t=this.heroTextures[id];modalImage(card,t,new Rect(0,0,t.width,t.height),-235,285,160,160);
    this.text(card,HEROES[id],65,320,400,55,35);this.text(card,max?'★★★★★ · 已满星':p.stars+'星 → '+(p.stars+1)+'星',65,255,400,65,37);
    this.text(card,'可用重复份数 '+p.available+(max?'':' / 需要 '+p.cost+'份'),0,160,680,50,29);modalSection(card,'提升预览',80);
    const values=[[p.before.hp,p.after.hp],[p.before.attack,p.after.attack],[p.before.power,p.after.power]];
    values.forEach((v,i)=>modalRow(card,['♥','⚔','✦'][i],['生命','攻击','招牌技能'][i],v[0]+(max?'':' → '+v[1]),5-i*65));
    this.text(card,'保留角色本体，只消耗同名英雄重复份数。\n每星基础生命/攻击+15%，招牌技能效果+25%。\n装备独立叠加；保持生命比例与战斗冷却。',0,-240,680,140,24);
    if(!max)this.button(card,p.available>=p.cost?'升星 · 消耗'+p.cost+'份':'份数不足',0,-425,390,80,()=>{const error=this.mutate(b=>b.starUp(id));if(error){this.info('英雄升星',error);return;}this.render();this.starDialog();},p.available>=p.cost?'#FFCE52':'#E2D2B9');
  }
  private formationPicker(){
    this.closeEquipment();this.dialog=formationModal(this.node,this.model(),this.heroTextures,ids=>this.mutate(b=>b.setFormation(ids)),()=>{this.closeEquipment();this.render();});
  }
  private skillDialog(index:number){
    const id=this.selected,b=this.model(),config=b.stats(id),open=b.unlocked(id,index),passive=index%2===1;
    this.closeEquipment();const {layer,card}=this.equipmentLayer('技能详情',1100);this.dialog=layer;
    if(id===3)modalImage(card,this.bagAtlas,new Rect(405,618,120,85),-235,290,150,150);
    else modalImage(card,this.battleUI,new Rect([28,316,612][id],1413,120,120),-235,290,150,150);
    this.text(card,SKILL_NAMES[id][index],85,320,415,58,35);this.text(card,(passive?'被动':'主动')+' · '+SKILL_LEVELS[index]+'级解锁',85,255,415,45,28);
    const effect=index===1?['防御 +25','主动技能效果 +15%','主动治疗效果 +15%','普攻攻击 +15%'][id]:index===3?'两个主动技能效果 +20%（包含招牌技能升星加成）':index===0?(id===0?'获得护盾 '+config.power:id===2?'治疗生命比例最低的存活队友，最多 '+config.power:'造成伤害 '+config.power):id===2?'治疗生命比例最低的存活队友，最多 '+Math.round(config.power*1.4):'造成伤害 '+Math.round(config.power*1.4)+'，定向攻击'+(id===0?'攻击最高的敌人':'生命比例最低的敌人');
    modalSection(card,'技能效果',155);this.text(card,effect,0,60,680,110,29);
    modalRow(card,'✦','解锁状态',open?'已解锁':'未解锁',-45);
    modalRow(card,'◷','冷却',passive?'自动生效':(index===0?config.cooldown:b.secondCooldown(id))+'秒',-110);
    this.text(card,passive?'解锁后自动生效，无需释放。':'冷却仅在战斗中推进，非战斗期间暂停。\n可手动点击排队释放或开启自动技能。\n每次技能占用一次行动。'+(id===2?'满血不释放。':''),0,-225,680,120,26);
    SKILL_LEVELS.forEach((lv,i)=>{const x=-255+i*170,n=modalPanel(card,x,-400,148,92,b.unlocked(id,i)?'#FFDB7E':'#DDD0BD',18);this.text(n,i%2?'被动':'主动',0,14,135,36,24);this.text(n,b.unlocked(id,i)?'已解锁':lv+'级解锁',0,-23,135,32,22);n.on(Node.EventType.TOUCH_END,()=>this.skillDialog(i));});
  }
  refresh(){this.render();}
  refreshIncome(){
    const state=this.progress(),owned=this.model().owns(this.selected),level=state.levels[this.selected],max=level>=LEVEL_CAP,cost=upgradeCost(level),xp=state.experience[this.selected];
    this.balance.string=String(state.gold);this.experienceLabel.string=owned?'经验 '+xp+' / '+(max?'满级':cost):'经验 —';
    const g=this.experienceFill;g.clear();if(owned&&xp>0){const w=380*(max?1:Math.min(1,xp/cost));g.fillColor=new Color().fromHEX('#FFCB4D');g.roundRect(-190,-8,Math.max(2,w),16,Math.min(8,w/2));g.fill();}
    this.upgradeButton.getComponent(Graphics)!.fillColor=new Color().fromHEX(owned&&!max&&xp>=cost?'#FFCE52':'#E2D2B9');
    const bg=this.upgradeButton.getComponent(Graphics)!;bg.clear();bg.roundRect(-133.5,-32,267,64,32);bg.fill();
  }
  private render(){
    this.content?.destroy();this.content=this.nodeAt(this.node,'Hero content',0,0,887,1774);
    const p=this.content;const owned=this.model().owns(this.selected),name=HEROES[this.selected],config=this.progress().stats[this.selected],level=this.progress().levels[this.selected];
    this.panel(p,0,0,887,1774,'#F8E6CF',0);
    this.sprite(p,this.forest,new Rect(0,0,this.forest.width,this.forest.height),0,439,887,896);
    this.cut(20,17,158,66,-345,837);this.panel(p,-145,837,188,62);this.cut(204,20,52,55,-207,837);this.balance=this.text(p,String(this.progress().gold),-128,837,110,52,35);
    // Portrait tabs are individual click targets with a live selection highlight.
    const tabSources=[[24,140,215,114],[246,142,197,114],[450,141,200,115],[655,142,215,115]];
    tabSources.forEach((r,i)=>{const x=-330+i*220;const tab=this.panel(p,x,680,210,94,i===this.selected?'#FFCE52':CREAM,26);const t=this.heroTextures[i];const face=t?this.sprite(tab,t,new Rect(0,0,t.width,t.height),-52,8,108,108):this.cut(r[0]+5,r[1],108,110,-52,8,103,105,tab);this.round(face);this.text(tab,HEROES[i],48,0,105,55,28);tab.on(Node.EventType.TOUCH_END,()=>{if(this.selected!==i){this.selected=i;this.render();}});if(i===this.selected)this.panel(p,x,620,162,6,'#F3AC21',3);});
    const copies=this.model().recruitment.counts[this.selected];
    this.text(p,owned?name+' · Lv.'+level:name+(copies?' · 已招募':' · 未招募'),0,589,530,65,44);

    this.button(p,this.model().formation.indexOf(this.selected)>=0?'已上阵 · 编队':'上阵 / 编队',-325,589,190,52,()=>this.formationPicker(), '#F4DEB7');
    for(let i=0;i<5;i++)this.cut(owned&&i<this.model().heroes[this.selected].stars?303:425,334,40,40,-122+i*42,535,40,40);
    this.cut(533,324,62,62,120,535).on(Node.EventType.TOUCH_END,()=>this.starDialog());
    const star=this.model().starPreview(this.selected);this.text(p,star?(star.stars===STAR_CONFIG.cap?'已满星':'升星 '+star.available+' / '+star.cost+'份'):'未招募',310,589,220,45,24);
    const roles=[['战士','坦克','输出'],['法师','输出'],['牧师','治疗'],['弓箭手','输出']][this.selected];
    const roleRow=this.nodeAt(p,'Roles',0,478,430,45);roles.forEach((role,i)=>{const x=(i-(roles.length-1)/2)*140;this.cut(role==='坦克'?394:role==='输出'?514:275,393,36,37,x-42,0,32,33,roleRow);this.text(roleRow,role,x+12,0,91,40,28);});roleRow.on(Node.EventType.TOUCH_END,()=>this.info('职业与定位',roles.join(' / ')+'\n职业决定技能特色，定位说明队伍职责。\n可选择至多三位不同英雄上阵，第一位为前排。'));
    const equipmentRegions=[[48,345],[48,518],[48,691],[678,345],[678,518],[678,691]];
    equipmentRegions.forEach((r,i)=>{
      const x=i<3?-315:315,y=465-(i%3)*173;
      const gear=owned?this.model().equipment(this.selected)[i]:null;
      const slot=gearTile(p,this.bagAtlas,gear,i,x,y,152);
      slot.on(Node.EventType.TOUCH_END,()=>{if(!owned){this.info(EQUIPMENT[i],copies?'该英雄已招募，装备与上阵功能待开放。':'尚未招募该英雄。');return;}this.equipmentInfo(i);});
    });
    if(owned){const t=this.heroTextures[this.selected];this.sprite(p,t,new Rect(0,0,t.width,t.height),0,245,495,495);}
    else{const r=tabSources[this.selected];const n=this.cut(r[0]+5,r[1],108,110,0,245,285,290);n.getComponent(Sprite)!.grayscale=!this.model().recruitment.counts[this.selected];this.round(n);this.text(p,this.model().recruitment.counts[this.selected]?'已招募 · 培养/上阵待开放':'未招募',0,62,420,55,26);}
    this.experienceLabel=this.text(p,owned?'经验 '+this.progress().experience[this.selected]+' / —':'经验 —',-270,13,260,44,24);
    this.panel(p,60,13,390,23,'#C4B8A6',12);this.experienceFill=this.nodeAt(p,'Experience fill',60,13,380,16).addComponent(Graphics);
    this.cut(728,850,51,47,310,13).on(Node.EventType.TOUCH_END,()=>this.info('经验重置','每位英雄使用独立经验。\n重置后回到1级并返还已投入经验。\n当前版本暂未开放经验重置。'));
    this.button(p,'一键换装',-143,-46,267,64,()=>{if(!owned){this.info('一键换装',copies?'该英雄已招募，装备功能待开放。':'请先招募该英雄。');return;}const before=owned?this.model().loadouts[this.selected].slice():[];const error=this.mutate(b=>b.autoEquip(this.selected));if(error){this.info('一键换装',error);return;}const changes=this.model().loadouts[this.selected].filter((id,i)=>id!==before[i]).length;this.render();this.info('一键换装',changes?'已更换'+changes+'件装备，属性已生效并保存。':'没有更合适的空闲装备。\n不会取走其他英雄正在穿戴的装备。');});
    this.upgradeButton=this.button(p,owned?(level>=LEVEL_CAP?'已满级':'升级 · '+upgradeCost(level)+'经验'):(copies?'培养待开放':'未招募'),145,-46,267,64,()=>{
      if(!owned){this.info('英雄升级',copies?'该英雄已招募，培养与上阵功能待开放。':'请先招募该英雄。');return;}
      const old=this.progress().stats[this.selected],error=this.onUpgrade(this.selected);
      if(error){this.info('英雄升级',error);return;}
      this.render();const now=this.progress().stats[this.selected];
      this.info(name+'升级成功','等级 '+level+' → '+(level+1)+'\n生命 '+old.hp+' → '+now.hp+'\n攻击 '+old.attack+' → '+now.attack+'\n'+now.skill+'效果 '+old.power+' → '+now.power+'\n已保存，返回冒险立即生效。');
    });
    // One continuous base with two inset rounded panels, matching v6 proportions.
    this.panel(p,0,-418,887,694,'#F8E6CF',0);
    this.panel(p,0,-222,859,265,'#FFF5E7',34);
    this.panel(p,0,-555,859,365,'#FFF5E7',34);
    this.text(p,'技能',-337,-120,130,52,40);
    const skillNames=SKILL_NAMES[this.selected];
    const skillX=[-320,-165,-8,145];
    skillX.forEach((x,i)=>{
      this.panel(p,x,-165,87,30,'#F6D6A6',15);this.text(p,i%2===0?'主动':'被动',x,-165,100,33,24);
      const open=this.model().unlocked(this.selected,i);
      const n=open?(this.selected===3?this.sprite(p,this.bagAtlas,new Rect(405,618,120,85),x,-232,104,104):this.sprite(p,this.battleUI,new Rect([28,316,612][this.selected],1413,120,120),x,-232,104,104)):this.cut(535,1073,111,94,x,-232,112,100);
      n.on(Node.EventType.TOUCH_END,()=>this.skillDialog(i));
      this.text(p,skillNames[i],x,-295,145,42,27);this.text(p,open?'已解锁':SKILL_LEVELS[i]+'级解锁',x,-327,145,32,23);
    });
    this.cut(702,1040,131,132,327,-221,132,132).on(Node.EventType.TOUCH_END,()=>this.talentDialog());
    this.text(p,'天赋树',327,-295,145,42,29);this.text(p,this.model().talentPoints(this.selected)+'点',327,-327,145,32,23);
    this.text(p,'英雄属性',-290,-398,235,52,40);
    const names=[['生命','攻击','防御','移速','暴击率','暴击伤害','连击率'],['破甲率','冷却缩减','治疗加成','护盾加成','普攻伤害','技能伤害','闪避率']];
    const values=[[String(config?.hp||0),String(config?.attack||0),String(owned?this.model().stats(this.selected).defense:0),String(config?.speed||0),'0%','150%','0%'],['0%','0%','0%','0%','0%','0%','0%']];
    names.forEach((column,c)=>column.forEach((label,r)=>{
      const x=c===0?-213:207,y=-451-r*42;
      this.panel(p,x,y,388,36,'#F8E3C9',18);
      this.cut(c===0?59:481,1320+r*42,39,34,x-157,y,34,30);
      const l=this.text(p,label,x-15,y,185,36,26);l.horizontalAlign=Label.HorizontalAlign.LEFT;
      const v=this.text(p,owned?values[c][r]:'—',x+130,y,115,36,26);v.horizontalAlign=Label.HorizontalAlign.RIGHT;
      l.node.on(Node.EventType.TOUCH_END,()=>this.info(label,label==='移速'?'移速决定每轮出手顺序。\n不是场景移动速度，也不增加行动次数。':label==='连击率'?'普攻触发连击的概率。\n当前战斗样例尚未启用连击。':label==='破甲率'?'无视目标防御的比例。\n当前没有破甲装备。防御会减少受到的伤害。':label==='闪避率'?'初期仅对普攻生效。\n当前战斗样例尚未启用闪避。':'生命、攻击、防御包含穿戴装备加成。\n防御直接减少每次敌人攻击伤害，最低1点。\n装备技能效果增加主动技能数值，其余百分比属性暂未启用。'));
    }));
    drawNavigation(p,this.atlas,this.bagAtlas,0,i=>{if(i===1)this.onRecruit();else if(i===2)this.onAdventure();else if(i===3)this.onBag();else if(i===4)this.onDungeon();else if(i!==0)this.info(['英雄','招募','冒险','背包','副本'][i],'此功能尚未开放。');});
    this.refreshIncome();
  }
}
