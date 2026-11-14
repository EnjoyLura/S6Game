import { Node, UITransform, Graphics, Label, Color, Texture2D, SpriteFrame, Sprite, Rect, Layers, BlockInputEvents, Mask, ScrollView } from 'cc';
import { HERO_CONFIG, upgradeCost, LEVEL_CAP, SquadBattleModel, gearName, gearDescription, gearStats, QUALITY_NAMES } from './SquadBattleModel';

import {gearTile} from './GearView';

const INK='#704124', CREAM='#FFF5E5';
const HEROES=['骑士','法师','牧师','弓箭手'];
const EQUIPMENT=['武器','戒指','项链','头盔','衣服','鞋子'];
// Three heroes are available for the squad prototype; the archer remains locked.
export class HeroPage {
  readonly node:Node;
  private selected=0; private balance!:Label; private experienceLabel!:Label; private experienceFill!:Graphics; private upgradeButton!:Node;
  private content!:Node;
  private dialog:Node|null=null;
  constructor(parent:Node,private atlas:Texture2D,private forest:Texture2D,private actors:Texture2D,private onAdventure:()=>void,private onBag:(slot?:number,hero?:number)=>void,private heroTextures:Texture2D[],private battleUI:Texture2D,private progress:()=>{gold:number;experience:number[];levels:number[];stats:typeof HERO_CONFIG},private onUpgrade:(i:number)=>string|null,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null,private bagAtlas:Texture2D){
    this.node=this.nodeAt(parent,'Hero page',0,0,887,1774);this.render();this.node.active=false;
  }
  private nodeAt(parent:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.layer=Layers.Enum.UI_2D;n.parent=parent;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
  private panel(parent:Node,x:number,y:number,w:number,h:number,color=CREAM,r=25){const n=this.nodeAt(parent,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
  private text(parent:Node,text:string,x:number,y:number,w:number,h:number,size=28,color=INK){const n=this.nodeAt(parent,text,x,y,w,h),l=n.addComponent(Label);l.string=text;l.fontFamily='Microsoft YaHei';l.isBold=true;l.fontSize=size;l.lineHeight=size*1.4;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
  private sprite(parent:Node,t:Texture2D,rect:Rect,x:number,y:number,w:number,h:number){const n=this.nodeAt(parent,'Artwork',x,y,w,h),f=new SpriteFrame();f.texture=t;f.rect=rect;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;n.getComponent(UITransform)!.setContentSize(w,h);return n;}
  private cut(sx:number,sy:number,sw:number,sh:number,x:number,y:number,w=sw,h=sh,parent=this.content){return this.sprite(parent,this.atlas,new Rect(sx,sy,sw,sh),x,y,w,h);}
  private button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,color='#FFCE52'){const n=this.panel(parent,x,y,w,h,color,h/2);this.text(n,text,0,0,w-18,h-6,30);n.on(Node.EventType.TOUCH_END,fn);return n;}
  private round(n:Node){const u=n.getComponent(UITransform)!;const h=this.nodeAt(n.parent!, 'Portrait mask',n.position.x,n.position.y,u.width,u.height);h.addComponent(Mask).type=Mask.Type.GRAPHICS_ELLIPSE;n.parent=h;n.setPosition(0,0);}
  private info(title:string,body:string){
    this.dialog?.destroy();
    const layer=this.nodeAt(this.node,'Detail modal',0,0,887,1774);layer.addComponent(BlockInputEvents);this.dialog=layer;
    const shade=layer.addComponent(Graphics);shade.fillColor=new Color(40,26,11,140);shade.rect(-444,-887,888,1774);shade.fill();
    this.panel(layer,0,15,710,585,'#DDB88C',36);const card=this.panel(layer,0,25,690,575,CREAM,32);
    this.text(card,title,0,218,580,65,39);this.text(card,body,0,20,590,310,28);
    this.button(card,'知道了',0,-210,300,70,()=>{layer.destroy();this.dialog=null;});
  }
  private closeEquipment(){this.dialog?.destroy();this.dialog=null;}
  private equipmentLayer(title:string,height:number,parent=this.node){
    const layer=this.nodeAt(parent,title,0,0,887,1774);layer.addComponent(BlockInputEvents);
    const shade=layer.addComponent(Graphics);shade.fillColor=new Color(40,26,11,170);shade.rect(-444,-887,888,1774);shade.fill();
    layer.on(Node.EventType.TOUCH_END,()=>{if(layer===this.dialog)this.closeEquipment();else layer.destroy();});
    const card=this.panel(layer,0,0,820,height,CREAM,32);card.addComponent(BlockInputEvents);card.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);
    this.text(card,title,0,height/2-60,650,65,39);
    this.button(card,'×',350,height/2-60,65,65,()=>{if(layer===this.dialog)this.closeEquipment();else layer.destroy();},'#F1D6AF');
    return {layer,card};
  }
  private equipmentInfo(slot:number){
    const g=this.model().equipment(this.selected)[slot];this.closeEquipment();
    if(g)this.equipmentDetail(g.id);else this.equipmentPicker(slot);
  }
  private equipmentPicker(initialSlot:number){
    let part=initialSlot,quality=-1,source=0;
    const {layer,card}=this.equipmentLayer('装备选择',1370);this.dialog=layer;
    let body:Node|null=null;
    const draw=()=>{
      body?.destroy();body=this.nodeAt(card,'Equipment picker content',0,-20,780,1180);const p=body!,b=this.model();
      ['背包','英雄'].forEach((name,i)=>this.button(p,name,-190+i*380,525,350,76,()=>{source=i;draw();},source===i?'#FFCE52':'#F4E2CA'));
      this.text(p,source===0?HEROES[this.selected]+' · 选择背包中的空闲装备':'英雄已穿戴装备 · 卸下后可分配',0,445,720,50,27);
      const items=b.inventory.filter(g=>(source===0?b.owner(g.id)<0:b.owner(g.id)>=0)&&(part<0||g.slot===part)&&(quality<0||g.quality===quality)).slice().sort((a,b)=>b.quality-a.quality||b.level-a.level||b.id-a.id);
      const viewport=this.nodeAt(p,'Equipment selection scroll',0,20,750,770);viewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;
      const list=this.nodeAt(viewport,'Equipment choices',0,385,750,Math.max(770,Math.ceil(items.length/5)*150+20));list.getComponent(UITransform)!.setAnchorPoint(.5,1);
      const scroll=viewport.addComponent(ScrollView);scroll.content=list;scroll.horizontal=false;scroll.vertical=true;scroll.cancelInnerEvents=true;
      items.forEach((g,i)=>{const owner=b.owner(g.id),n=gearTile(list,this.bagAtlas,g,g.slot,-300+i%5*150,-80-Math.floor(i/5)*150,138,owner>=0?HEROES[owner]:'');n.on(Node.EventType.TOUCH_END,()=>this.equipmentDetail(g.id,layer,draw));});
      if(!items.length)this.text(viewport,'没有符合条件的装备\n可调整部位或品质筛选',0,180,680,110,30,'#AA8060');
      this.text(p,'品阶',-310,-427,100,50,29);
      this.button(p,(quality<0?'全部':QUALITY_NAMES[quality])+' ▾',-100,-427,285,65,()=>{
        const {layer:filter,card:choices}=this.equipmentLayer('品质筛选',680,layer);
        ['全部',...QUALITY_NAMES].forEach((name,i)=>this.button(choices,name,0,225-i*78,570,62,()=>{quality=i-1;filter.destroy();draw();},quality===i-1?'#FFCE52':'#F4E2CA'));
      },'#F4E2CA');
      this.text(p,items.length+'件',290,-427,130,50,29);
      const parts=[-1,0,3,4,5,1,2];
      parts.forEach((slot,i)=>this.button(p,slot<0?'全部':EQUIPMENT[slot],-324+i*108,-535,100,90,()=>{part=slot;draw();},part===slot?'#FFCE52':'#F4E2CA'));
    };
    draw();this.text(layer,'点击空白处关闭',0,-760,650,50,27,'#FFF5E5');
  }
  private equipmentDetail(id:number,picker?:Node,refreshPicker?:()=>void){
    const b=this.model(),g=b.inventory.find(g=>g.id===id);if(!g)return;
    const owner=b.owner(id),current=b.equipment(this.selected)[g.slot];
    const {layer,card}=this.equipmentLayer('装备详情',920,picker||this.node);if(!picker)this.dialog=layer;
    gearTile(card,this.bagAtlas,g,g.slot,0,265,146,owner>=0?HEROES[owner]:'');
    this.text(card,gearName(g)+' · Lv.'+g.level,0,155,730,55,32);
    this.text(card,gearDescription(g),0,80,730,90,28);
    this.text(card,owner>=0?'已穿戴：'+HEROES[owner]: '穿戴给：'+HEROES[this.selected],0,7,700,50,28);
    if(owner<0){const values=gearStats(g),old=current?gearStats(current):{hp:0,attack:0,defense:0,power:0};
      const difference=(key:'hp'|'attack'|'defense'|'power')=>{const n=values[key]-old[key];return (n>=0?'+':'')+n;};
      this.text(card,'替换变化：生命 '+difference('hp')+' · 攻击 '+difference('attack')+'\n防御 '+difference('defense')+' · 技能效果 '+difference('power'),0,-85,730,110,27);
    }else this.text(card,'卸下后装备回到背包，可重新穿戴。',0,-85,730,90,27);
    const result=this.text(card,'',0,-200,710,85,27,'#B45B38');
    this.button(card,picker?'返回列表':'关闭',-185,-332,290,72,()=>{if(picker)layer.destroy();else this.closeEquipment();},'#F4E2CA');
    this.button(card,owner>=0?'卸下':'穿上',180,-332,290,72,()=>{
      const liveOwner=this.model().owner(id);
      if(liveOwner!==owner){result.string='装备归属已变化，请关闭后重试';return;}
      const error=this.mutate(b=>b.equip(owner>=0?owner:this.selected,owner>=0?null:id,g.slot));
      if(error){result.string=error;return;}
      this.render();
      if(picker){picker.setSiblingIndex(this.node.children.length-1);layer.destroy();refreshPicker?.();}else this.closeEquipment();
    });
  }
  refresh(){this.render();}
  refreshIncome(){
    const state=this.progress(),owned=this.selected<3,level=state.levels[this.selected],max=level>=LEVEL_CAP,cost=upgradeCost(level),xp=state.experience[this.selected];
    this.balance.string=String(state.gold);this.experienceLabel.string=owned?'经验 '+xp+' / '+(max?'满级':cost):'经验 —';
    const g=this.experienceFill;g.clear();if(owned&&xp>0){const w=380*(max?1:Math.min(1,xp/cost));g.fillColor=new Color().fromHEX('#FFCB4D');g.roundRect(-190,-8,Math.max(2,w),16,Math.min(8,w/2));g.fill();}
    this.upgradeButton.getComponent(Graphics)!.fillColor=new Color().fromHEX(owned&&!max&&xp>=cost?'#FFCE52':'#E2D2B9');
    const bg=this.upgradeButton.getComponent(Graphics)!;bg.clear();bg.roundRect(-133.5,-32,267,64,32);bg.fill();
  }
  private render(){
    this.content?.destroy();this.content=this.nodeAt(this.node,'Hero content',0,0,887,1774);
    const p=this.content;const owned=this.selected<3,name=HEROES[this.selected],config=this.progress().stats[this.selected],level=this.progress().levels[this.selected];
    this.panel(p,0,0,887,1774,'#F8E6CF',0);
    this.sprite(p,this.forest,new Rect(0,0,this.forest.width,this.forest.height),0,439,887,896);
    this.cut(20,17,158,66,-345,837);this.panel(p,-145,837,188,62);this.cut(204,20,52,55,-207,837);this.balance=this.text(p,String(this.progress().gold),-128,837,110,52,35);
    // Portrait tabs are individual click targets with a live selection highlight.
    const tabSources=[[24,140,215,114],[246,142,197,114],[450,141,200,115],[655,142,215,115]];
    tabSources.forEach((r,i)=>{const x=-330+i*220;const tab=this.panel(p,x,680,210,94,i===this.selected?'#FFCE52':CREAM,26);const t=this.heroTextures[i];const face=t?this.sprite(tab,t,new Rect(0,0,t.width,t.height),-52,8,108,108):this.cut(r[0]+5,r[1],108,110,-52,8,103,105,tab);this.round(face);this.text(tab,HEROES[i],48,0,105,55,28);tab.on(Node.EventType.TOUCH_END,()=>{if(this.selected!==i){this.selected=i;this.render();}});if(i===this.selected)this.panel(p,x,620,162,6,'#F3AC21',3);});
    this.text(p,owned?name+' · Lv.'+level:name+' · 未招募',0,589,530,65,44);
    for(let i=0;i<5;i++)this.cut(owned&&i===0?303:425,334,40,40,-122+i*42,535,40,40);
    this.cut(533,324,62,62,120,535).on(Node.EventType.TOUCH_END,()=>this.info('升星',owned?'升星可提高属性并强化招牌技能。\n当前为1星展示，尚无英雄碎片。\n升星成本与验证范围待定。':'获得该英雄后可查看升星。'));
    const roles=[['战士','坦克','输出'],['法师','输出'],['牧师','治疗'],['弓箭手','输出']][this.selected];
    const roleRow=this.nodeAt(p,'Roles',0,478,430,45);roles.forEach((role,i)=>{const x=(i-(roles.length-1)/2)*140;this.cut(role==='坦克'?394:role==='输出'?514:275,393,36,37,x-42,0,32,33,roleRow);this.text(roleRow,role,x+12,0,91,40,28);});roleRow.on(Node.EventType.TOUCH_END,()=>this.info('职业与定位',roles.join(' / ')+'\n职业决定技能特色，定位说明队伍职责。\n骑士、法师、牧师共同参与冒险战斗。'));
    const equipmentRegions=[[48,345],[48,518],[48,691],[678,345],[678,518],[678,691]];
    equipmentRegions.forEach((r,i)=>{
      const x=i<3?-315:315,y=465-(i%3)*173;
      const gear=owned?this.model().equipment(this.selected)[i]:null;
      const slot=gearTile(p,this.bagAtlas,gear,i,x,y,152);
      slot.on(Node.EventType.TOUCH_END,()=>{if(!owned){this.info(EQUIPMENT[i],'尚未招募该英雄。');return;}this.equipmentInfo(i);});
    });
    if(owned){const t=this.heroTextures[this.selected];this.sprite(p,t,new Rect(0,0,t.width,t.height),0,245,495,495);}
    else{const r=tabSources[this.selected];const n=this.cut(r[0]+5,r[1],108,110,0,245,285,290);n.getComponent(Sprite)!.grayscale=true;this.round(n);this.text(p,'未招募',0,62,300,55,34);}
    this.experienceLabel=this.text(p,owned?'经验 '+this.progress().experience[this.selected]+' / —':'经验 —',-270,13,260,44,24);
    this.panel(p,60,13,390,23,'#C4B8A6',12);this.experienceFill=this.nodeAt(p,'Experience fill',60,13,380,16).addComponent(Graphics);
    this.cut(728,850,51,47,310,13).on(Node.EventType.TOUCH_END,()=>this.info('经验重置','每位英雄使用独立经验。\n重置后回到1级并返还已投入经验。\n当前版本暂未开放经验重置。'));
    this.button(p,'一键换装',-143,-46,267,64,()=>{const before=owned?this.model().loadouts[this.selected].slice():[];const error=this.mutate(b=>b.autoEquip(this.selected));if(error){this.info('一键换装',error);return;}const changes=this.model().loadouts[this.selected].filter((id,i)=>id!==before[i]).length;this.render();this.info('一键换装',changes?'已更换'+changes+'件装备，属性已生效并保存。':'没有更合适的空闲装备。\n不会取走其他英雄正在穿戴的装备。');});
    this.upgradeButton=this.button(p,owned?(level>=LEVEL_CAP?'已满级':'升级 · '+upgradeCost(level)+'经验'):'未招募',145,-46,267,64,()=>{
      if(!owned){this.info('英雄升级','请先招募该英雄。');return;}
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
    const skillNames=[['守护姿态','坚韧','盾击','不屈'],['火焰','被动技能','主动技能','被动技能'],['治愈','被动技能','主动技能','被动技能'],['招牌技能','被动技能','主动技能','被动技能']][this.selected];
    const skillX=[-320,-165,-8,145];
    skillX.forEach((x,i)=>{
      this.panel(p,x,-165,87,30,'#F6D6A6',15);this.text(p,i%2===0?'主动':'被动',x,-165,100,33,24);
      const open=owned&&i===0;
      const n=open?this.sprite(p,this.battleUI,new Rect([28,316,612][this.selected],1413,120,120),x,-232,104,104):this.cut(535,1073,111,94,x,-232,112,100);
      n.on(Node.EventType.TOUCH_END,()=>this.info(skillNames[i],open?'主动技能 · 随英雄等级成长\n'+(this.selected===0?'产生'+config.power+'点护盾':this.selected===1?'造成'+config.power+'点伤害':'为存活且血量比例最低的队友恢复至多'+config.power+'生命，满血时不释放')+'\n冷却'+config.cooldown+'秒，仅战斗中推进。\n可自动释放或手动排队，占用一次行动。':'按英雄等级依次解锁：\n主动 → 被动 → 主动 → 被动。\n具体解锁等级尚待确定。'));
      this.text(p,skillNames[i],x,-295,145,42,27);this.text(p,open?'随英雄成长':'等级解锁',x,-327,145,32,23);
    });
    this.cut(702,1040,131,132,327,-221,132,132).on(Node.EventType.TOUCH_END,()=>this.info('天赋树','可用天赋点：0\n等级成长可获得天赋点。\n属性、技能伤害与机制分支。\n具体节点与点数规则尚未配置。\n天赋重置入口将放在此弹窗内。'));
    this.text(p,'天赋树',327,-295,145,42,29);this.text(p,'0点',327,-327,145,32,23);
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
    const nav=[[10,1648,177,120],[190,1648,170,120],[362,1648,169,120],[534,1648,170,120],[707,1648,170,120]];
    nav.forEach((r,i)=>this.cut(r[0],r[1],r[2],r[3],-348+i*174,-820,170,120).on(Node.EventType.TOUCH_END,()=>{if(i===2)this.onAdventure();else if(i===3)this.onBag();else if(i!==0)this.info(['英雄','招募','冒险','背包','副本'][i],'此功能尚未开放。\n当前可以查看英雄与体验冒险战斗。');}));
    this.refreshIncome();
  }
}
