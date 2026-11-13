import { Node, UITransform, Graphics, Label, Color, Texture2D, SpriteFrame, Sprite, Rect, Layers, BlockInputEvents, ScrollView, Mask, Vec2 } from 'cc';

import {SquadBattleModel,HERO_CONFIG,gearName,gearDescription,DROP_SECONDS} from './SquadBattleModel';
import {gearTile} from './GearView';

const INK='#704124',CREAM='#FFF3E2';
const PARTS=['全部','武器','戒指','项链','头盔','衣服','鞋子'];
export class BagPage {
  readonly node:Node;
  private content!:Node;private modal:Node|null=null;private category=0;private part=0;
  private sort=0;private lockedOnly=false;private scroll!:ScrollView;private thumb!:Node;
  private savedOffsets=[0,0,0];private targetHero=0;
  refresh(){this.save();this.render();if(this.modal)this.modal.setSiblingIndex(this.node.children.length-1);}
  showSlot(slot:number,hero:number){this.targetHero=hero;this.category=0;this.part=slot+1;this.savedOffsets[0]=0;this.render();}
  constructor(parent:Node,private atlas:Texture2D,private yard:Texture2D,private navigate:(page:'hero'|'adventure')=>void,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null){this.node=this.base(parent,'Bag page',0,0,887,1774);this.render();this.node.active=false;}
  private base(parent:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.parent=parent;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
  private panel(parent:Node,x:number,y:number,w:number,h:number,color=CREAM,r=24){const n=this.base(parent,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
  private text(parent:Node,t:string,x:number,y:number,w:number,h:number,size=28,color=INK){const l=this.base(parent,t,x,y,w,h).addComponent(Label);l.string=t;l.fontFamily='Microsoft YaHei';l.isBold=true;l.fontSize=size;l.lineHeight=size*1.4;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
  private image(parent:Node,t:Texture2D,r:Rect,x:number,y:number,w:number,h:number){const n=this.base(parent,'UI image',x,y,w,h),f=new SpriteFrame();f.texture=t;f.rect=r;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;n.getComponent(UITransform)!.setContentSize(w,h);return n;}
  private cut(sx:number,sy:number,sw:number,sh:number,x:number,y:number,w=sw,h=sh,parent=this.content){return this.image(parent,this.atlas,new Rect(sx,sy,sw,sh),x,y,w,h);}
  private button(parent:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,active=false){this.panel(parent,x,y-4,w,h,active?'#E9A63A':'#E5C6A4',h/2);const n=this.panel(parent,x,y,w,h,active?'#FFDA54':CREAM,h/2);this.text(n,t,0,0,w-12,h-6,30);n.on(Node.EventType.TOUCH_END,fn);return n;}
  private detail(title:string,body:string){this.modal?.destroy();const m=this.base(this.node,'Bag detail',0,0,887,1774);this.modal=m;m.addComponent(BlockInputEvents);const g=m.addComponent(Graphics);g.fillColor=new Color(35,24,12,150);g.rect(-444,-887,888,1774);g.fill();const p=this.panel(m,0,0,710,530);this.text(p,title,0,185,610,70,38);this.text(p,body,0,15,600,250,28);this.button(p,'知道了',0,-190,280,65,()=>{m.destroy();this.modal=null;},true);}
  private equipmentDetail(id:number){
    const b=this.model(),g=b.inventory.find(g=>g.id===id);if(!g)return;
    this.modal?.destroy();const m=this.base(this.node,'Equipment detail',0,0,887,1774);this.modal=m;m.addComponent(BlockInputEvents);const shade=m.addComponent(Graphics);shade.fillColor=new Color(35,24,12,165);shade.rect(-444,-887,888,1774);shade.fill();
    const p=this.panel(m,0,0,790,920);this.text(p,gearName(g)+' · Lv.'+g.level,0,392,690,60,37);
    gearTile(p,this.atlas,g,g.slot,0,265,146);
    this.text(p,gearDescription(g),0,148,710,65,28);
    const owner=b.owner(id);this.text(p,owner>=0?'穿戴中：'+HERO_CONFIG[owner].name:'未穿戴 · 可分配给任意已拥有英雄',0,94,710,50,26);
    HERO_CONFIG.forEach((h,i)=>this.button(p,h.name,-242+i*242,15,214,62,()=>{this.targetHero=i;this.equipmentDetail(id);},this.targetHero===i));
    const current=b.equipment(this.targetHero)[g.slot];
    this.text(p,'当前：'+(current?gearName(current)+' Lv.'+current.level:'空槽位'),0,-58,700,48,27);
    const diff=(key:'hp'|'attack'|'defense'|'power')=>{const d=g[key]-(current?.[key]||0);return (d>=0?'+':'')+d;};
    this.text(p,'替换变化：生命 '+diff('hp')+'   攻击 '+diff('attack')+'\n防御 '+diff('defense')+'   技能效果 '+diff('power'),0,-137,700,105,28);
    const run=(fn:(b:SquadBattleModel)=>string|null)=>{const error=this.mutate(fn);if(error){this.detail('装备操作',error);return;}this.refresh();this.equipmentDetail(id);};
    this.button(p,g.locked?'解锁装备':'锁定装备',-177,-254,290,66,()=>run(b=>b.toggleLock(id)));
    this.button(p,owner===this.targetHero?'卸下':'穿戴给'+HERO_CONFIG[this.targetHero].name,166,-254,332,66,()=>run(b=>b.equip(this.targetHero,owner===this.targetHero?null:id,g.slot)),true);
    this.button(p,'关闭',0,-372,300,66,()=>{m.destroy();this.modal=null;});
  }
  private save(){if(this.scroll)this.savedOffsets[this.category]=this.scroll.getScrollOffset().y;}
  private changeTab(i:number){if(i===this.category)return;this.save();this.category=i;this.render();}
  private gold=0; private goldLabel!:Label;
  setGold(value:number){this.gold=value;if(this.goldLabel)this.goldLabel.string=String(value);}
  private render(){
    this.content?.destroy();this.content=this.base(this.node,'Bag content',0,0,887,1774);const p=this.content;
    this.panel(p,0,0,887,1774,'#F9E4CF',0);
    this.image(p,this.yard,new Rect(0,0,this.yard.width,this.yard.height*.38),0,790,887,194);
    this.cut(20,16,155,65,-345,837);this.panel(p,-140,837,185,62);this.cut(201,19,56,56,-205,837,54,54);this.goldLabel=this.text(p,String(this.gold),-125,837,105,50,35);
    ['装备','材料','道具'].forEach((name,i)=>this.button(p,name,-292+i*292,687,282,76,()=>this.changeTab(i),this.category===i));
    if(this.category===0)PARTS.forEach((name,i)=>this.button(p,name,-354+i*118,595,110,55,()=>{this.part=i;this.savedOffsets[0]=0;this.render();},this.part===i));
    else this.text(p,this.category===1?'培养与打造材料':'可使用的道具',0,595,650,55,29,'#AA8060');
    this.button(p,this.lockedOnly&&this.category===0?'仅锁定':'筛选',-284,511,216,62,()=>{if(this.category!==0){this.detail('筛选','当前分类暂无物品。');return;}this.lockedOnly=!this.lockedOnly;this.savedOffsets[0]=0;this.render();},this.lockedOnly&&this.category===0);
    this.button(p,['品质排序','品质 ↓','品质 ↑'][this.sort],278,511,232,62,()=>{this.sort=this.sort===1?2:1;this.savedOffsets[this.category]=0;this.render();});
    this.panel(p,0,-45,853,1038,'#FFF2E3',30);
    const viewport=this.base(p,'Vertical inventory',-8,-42,800,1000);viewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;
    const list=this.base(viewport,'Items',0,500,800,1130);list.getComponent(UITransform)!.setAnchorPoint(.5,1);
    this.scroll=viewport.addComponent(ScrollView);this.scroll.content=list;this.scroll.horizontal=false;this.scroll.vertical=true;this.scroll.inertia=true;this.scroll.elastic=true;this.scroll.cancelInnerEvents=true;
    const model=this.model();let items=this.category===0?model.inventory.filter(g=>(this.part===0||g.slot===this.part-1)&&(!this.lockedOnly||g.locked)):[];
    if(this.sort)items=items.slice().sort((a,b)=>(b.quality-a.quality)*(this.sort===1?1:-1)||b.level-a.level||b.id-a.id);
    else items=items.slice().reverse();
    const count=Math.max(35,Math.ceil((items.length+5)/5)*5);
    const contentHeight=Math.ceil(count/5)*158+20;list.getComponent(UITransform)!.setContentSize(800,contentHeight);
    for(let slot=0;slot<count;slot++){
      const x=-316+(slot%5)*158,y=-83-Math.floor(slot/5)*158,item=items[slot];
      if(!item){this.panel(list,x,y,146,146,'#C9BBAB',19);continue;}
      const owner=model.owner(item.id),tile=gearTile(list,this.atlas,item,item.slot,x,y,146,owner>=0?HERO_CONFIG[owner].name:'');
      tile.on(Node.EventType.TOUCH_END,()=>this.equipmentDetail(item.id));
    }
    if(items.length===0)this.text(viewport,this.category===0?'没有符合条件的装备':this.category===1?'暂无材料':'暂无道具',0,360,640,58,32);
    const rail=this.panel(p,414,-42,8,990,'#F4DFC7',4);this.thumb=this.panel(rail,0,0,8,140,'#F3B64D',4);
    const update=()=>{const max=Math.max(1,contentHeight-1000);const t=Math.max(0,Math.min(1,this.scroll.getScrollOffset().y/max));this.thumb.setPosition(0,425-t*850);};
    viewport.on(ScrollView.EventType.SCROLLING,update);this.scroll.scrollToOffset(new Vec2(0,Math.min(this.savedOffsets[this.category],Math.max(0,contentHeight-1000))),0);update();
    this.text(p,'共'+items.length+'件',-303,-621,230,55,33);this.text(p,this.category===0?'挂机每'+DROP_SECONDS+'秒掉落':'暂无物品',-303,-663,230,35,22,'#AA8060');
    this.button(p,'保留规则',-10,-628,240,70,()=>this.detail('保留规则','可按属性与套装保留装备。\n自动分解规则暂未接入。\n装备可手动锁定，锁定不影响穿戴。'));
    this.button(p,'批量分解',280,-628,285,70,()=>this.detail('批量分解','当前版本暂未开放分解。\n装备会保留，不会自动销毁。\n正式分解将排除锁定和穿戴物品。'),true);
    const nav=[[15,1494,182,130],[205,1494,181,130],[393,1494,175,130],[575,1494,182,130],[765,1494,177,130]];
    nav.forEach((r,i)=>this.cut(r[0],r[1],r[2],r[3],-348+i*174,-806,170,130).on(Node.EventType.TOUCH_END,()=>{this.save();if(i===0)this.navigate('hero');else if(i===2)this.navigate('adventure');else if(i!==3)this.detail(i===1?'招募':'副本','此功能尚未开放。');}));
  }
}
