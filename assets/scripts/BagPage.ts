import { Node, UITransform, Graphics, Label, Color, Texture2D, SpriteFrame, Sprite, Rect, Layers, BlockInputEvents, ScrollView, Mask, Vec2 } from 'cc';

import {SquadBattleModel,HERO_CONFIG,gearName,gearDescription,DROP_SECONDS,gearStats,enhanceCost,ENHANCE_CAP,RetentionRules,QUALITY_NAMES,investedMaterials} from './SquadBattleModel';
import {gearTile} from './GearView';

const INK='#704124',CREAM='#FFF3E2';
const PARTS=['全部','武器','戒指','项链','头盔','衣服','鞋子'];
export class BagPage {
  readonly node:Node;
  private content!:Node;private modal:Node|null=null;private category=0;private part=0;
  private sort=0;private lockedOnly=false;private scroll!:ScrollView;private thumb!:Node;
  private savedOffsets=[0,0,0];private targetHero=0;private batch=false;private selected=new Set<number>();private batchIds:number[]=[];
  refresh(){this.save();this.render();if(this.modal)this.modal.setSiblingIndex(this.node.children.length-1);}
  showSlot(slot:number,hero:number){this.batch=false;this.selected.clear();this.lockedOnly=false;this.targetHero=hero;this.category=0;this.part=slot+1;this.savedOffsets[0]=0;this.render();}
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
    const diff=(key:'hp'|'attack'|'defense'|'power')=>{const d=gearStats(g)[key]-(current?gearStats(current)[key]:0);return (d>=0?'+':'')+d;};
    this.text(p,'替换变化：生命 '+diff('hp')+'   攻击 '+diff('attack')+'\n防御 '+diff('defense')+'   技能效果 '+diff('power'),0,-137,700,105,28);
    const run=(fn:(b:SquadBattleModel)=>string|null)=>{const error=this.mutate(fn);if(error){this.detail('装备操作',error);return;}this.refresh();this.equipmentDetail(id);};
    this.button(p,g.locked?'解锁装备':'锁定装备',-177,-254,290,66,()=>run(b=>b.toggleLock(id)));
    this.button(p,owner===this.targetHero?'卸下':'穿戴给'+HERO_CONFIG[this.targetHero].name,166,-254,332,66,()=>run(b=>b.equip(this.targetHero,owner===this.targetHero?null:id,g.slot)),true);
    const capped=(g.enhancement||0)>=ENHANCE_CAP;
    this.text(p,'强化石 '+b.materials+' · 当前 +'+(g.enhancement||0)+' / +'+ENHANCE_CAP,0,-326,710,45,26);
    this.button(p,capped?'已满级':'强化 · '+enhanceCost(g)+'石',-145,-392,350,65,()=>this.enhancementDetail(id),!capped);
    this.button(p,'关闭',235,-392,180,65,()=>{m.destroy();this.modal=null;});
  }
  private modalCard(title:string,height=900){
    this.modal?.destroy();const m=this.base(this.node,title,0,0,887,1774);this.modal=m;m.addComponent(BlockInputEvents);const shade=m.addComponent(Graphics);shade.fillColor=new Color(35,24,12,165);shade.rect(-444,-887,888,1774);shade.fill();
    const p=this.panel(m,0,0,790,height);this.text(p,title,0,height/2-65,710,65,38);return p;
  }
  private closeModal(){this.modal?.destroy();this.modal=null;}
  private enhancementDetail(id:number){
    const b=this.model(),g=b.inventory.find(g=>g.id===id);if(!g)return;
    const p=this.modalCard('装备强化',800),level=g.enhancement||0,capped=level>=ENHANCE_CAP;
    this.text(p,gearName(g)+' · Lv.'+g.level,0,255,690,50,30);
    const before=gearStats(g),after=gearStats({...g,enhancement:Math.min(ENHANCE_CAP,level+1)});
    this.text(p,['生命','攻击','防御','技能效果'].map((name,i)=>{const key=['hp','attack','defense','power'][i];return name+'  '+before[key]+' → '+after[key];}).join('\n'),0,85,650,200,31);
    this.text(p,capped?'已达到 +'+ENHANCE_CAP:'+'+level+' → +'+(level+1)+' · 消耗 '+enhanceCost(g)+' 强化石',0,-80,700,50,30);
    this.text(p,'持有 '+b.materials+' 强化石\n每级提升基础词条10%，穿戴中也可强化',0,-155,690,85,25);
    this.button(p,'返回',-185,-295,260,70,()=>this.equipmentDetail(id));
    this.button(p,capped?'已满级':'确认强化',170,-295,300,70,()=>{const error=this.mutate(b=>b.enhance(id));if(error){this.detail('强化未完成',error);return;}this.refresh();this.enhancementDetail(id);},!capped);
  }
  private rulesDetail(draft:RetentionRules=this.model().rules){
    const r={...draft,attributes:draft.attributes.slice()},p=this.modalCard('自动保留规则',1020);
    this.text(p,'满足任一条件就保留，其余新掉落自动分解',0,360,710,55,26);
    this.button(p,r.enabled?'自动分解：开启':'自动分解：关闭',0,280,620,65,()=>{r.enabled=!r.enabled;this.rulesDetail(r);},r.enabled);
    this.button(p,'品质：'+(r.minQuality===5?'不按品质保留':QUALITY_NAMES[r.minQuality]+'及以上'),0,185,620,65,()=>{r.minQuality=(r.minQuality+1)%6;this.rulesDetail(r);});
    this.button(p,'装备等级：'+(r.minLevel?r.minLevel+'级及以上':'不按等级保留'),0,90,620,65,()=>{const levels=[0,5,10,20,50,100];r.minLevel=levels[(levels.indexOf(r.minLevel)+1)%levels.length];this.rulesDetail(r);});
    this.text(p,'含指定属性就保留（可多选）',0,5,650,45,27);
    (['hp','attack','defense','power'] as const).forEach((key,i)=>this.button(p,(r.attributes.indexOf(key)>=0?'✓ ':'')+['生命','攻击','防御','技能效果'][i],i%2?170:-170,-70-Math.floor(i/2)*80,300,60,()=>{const index=r.attributes.indexOf(key);if(index>=0)r.attributes.splice(index,1);else r.attributes.push(key);this.rulesDetail(r);},r.attributes.indexOf(key)>=0));
    this.text(p,'锁定、已穿戴、已强化：始终自动保留\n保存规则只影响新掉落，不分解已有装备',0,-255,710,90,26);
    this.button(p,'取消',-180,-405,270,70,()=>this.closeModal());
    this.button(p,'保存规则',170,-405,300,70,()=>{const error=this.mutate(b=>b.setRules(r));if(error){this.detail('规则未保存',error);return;}this.refresh();this.detail('规则已保存',r.enabled?'新掉落将按规则保留或分解。\n已有装备不会自动处理。':'自动分解已关闭。\n新掉落全部进入背包。');},true);
  }
  private confirmSalvage(){
    const ids=Array.from(this.selected),preview=this.model().salvagePreview(ids);if(preview.error){this.detail('无法分解',preview.error);return;}
    const p=this.modalCard('确认批量分解',870);
    this.text(p,'已选择 '+ids.length+' 件装备',0,278,700,55,34);
    this.text(p,preview.items.slice(0,4).map(g=>gearName(g)+' Lv.'+g.level).join('\n')+(ids.length>4?'\n另有 '+(ids.length-4)+' 件':''),0,132,690,205,27);
    const refund=preview.items.reduce((n,g)=>n+investedMaterials(g),0);
    this.text(p,'获得 '+preview.materials+' 强化石'+(refund?'\n含强化投入返还 '+refund:'')+'\n分解后装备消失，锁定和穿戴装备不可分解',0,-80,700,150,28);
    this.button(p,'取消',-180,-305,270,70,()=>this.closeModal());
    this.button(p,'确认分解',170,-305,300,70,()=>{const error=this.mutate(b=>b.salvage(ids));if(error){this.detail('分解未完成',error);return;}this.batch=false;this.selected.clear();this.refresh();this.detail('分解完成','分解 '+ids.length+' 件装备\n获得 '+preview.materials+' 强化石\n已保存');},true);
  }
  private filteredItems(){const b=this.model();return b.inventory.filter(g=>(!this.batch||this.batchIds.indexOf(g.id)>=0)&&(this.part===0||g.slot===this.part-1)&&(!this.lockedOnly||g.locked));}
  private save(){if(this.scroll)this.savedOffsets[this.category]=this.scroll.getScrollOffset().y;}
  private changeTab(i:number){if(i===this.category)return;this.save();this.batch=false;this.selected.clear();this.category=i;this.render();}
  private gold=0; private goldLabel!:Label;
  setGold(value:number){this.gold=value;if(this.goldLabel)this.goldLabel.string=String(value);}
  private render(){
    this.content?.destroy();this.content=this.base(this.node,'Bag content',0,0,887,1774);const p=this.content;
    this.panel(p,0,0,887,1774,'#F9E4CF',0);
    this.image(p,this.yard,new Rect(0,0,this.yard.width,this.yard.height*.38),0,790,887,194);
    this.cut(20,16,155,65,-345,837);this.panel(p,-140,837,185,62);this.cut(201,19,56,56,-205,837,54,54);this.goldLabel=this.text(p,String(this.gold),-125,837,105,50,35);
    ['装备','材料','道具'].forEach((name,i)=>this.button(p,name,-292+i*292,687,282,76,()=>this.changeTab(i),this.category===i));
    if(this.category===0)PARTS.forEach((name,i)=>this.button(p,name,-354+i*118,595,110,55,()=>{this.part=i;this.selected.clear();this.savedOffsets[0]=0;this.render();},this.part===i));
    else this.text(p,this.category===1?'培养与打造材料':'可使用的道具',0,595,650,55,29,'#AA8060');
    this.button(p,this.batch?'取消分解':this.lockedOnly&&this.category===0?'仅锁定':'筛选',-284,511,216,62,()=>{if(this.batch){this.batch=false;this.selected.clear();this.render();return;}if(this.category!==0){this.detail('筛选','强化石自动堆叠，无需筛选。');return;}this.lockedOnly=!this.lockedOnly;this.savedOffsets[0]=0;this.render();},this.lockedOnly&&this.category===0);
    this.button(p,['品质排序','品质 ↓','品质 ↑'][this.sort],278,511,232,62,()=>{this.sort=this.sort===1?2:1;this.savedOffsets[this.category]=0;this.render();});
    this.panel(p,0,-45,853,1038,'#FFF2E3',30);
    const viewport=this.base(p,'Vertical inventory',-8,-42,800,1000);viewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;
    const list=this.base(viewport,'Items',0,500,800,1130);list.getComponent(UITransform)!.setAnchorPoint(.5,1);
    this.scroll=viewport.addComponent(ScrollView);this.scroll.content=list;this.scroll.horizontal=false;this.scroll.vertical=true;this.scroll.inertia=true;this.scroll.elastic=true;this.scroll.cancelInnerEvents=true;
    const model=this.model();let items=this.category===0?this.filteredItems():[];
    if(this.sort)items=items.slice().sort((a,b)=>(b.quality-a.quality)*(this.sort===1?1:-1)||b.level-a.level||b.id-a.id);
    else items=items.slice().reverse();
    const count=Math.max(35,Math.ceil((items.length+5)/5)*5);
    const contentHeight=Math.ceil(count/5)*158+20;list.getComponent(UITransform)!.setContentSize(800,contentHeight);
    for(let slot=0;slot<count;slot++){
      const x=-316+(slot%5)*158,y=-83-Math.floor(slot/5)*158,item=items[slot];
      if(!item){if(this.category===1&&slot===0){const tile=this.panel(list,x,y,146,146,'#54BBEF',19);this.text(tile,'◆',0,15,130,80,64,'#E0F7FF');this.text(tile,String(model.materials),0,-48,135,35,26);tile.on(Node.EventType.TOUCH_END,()=>this.detail('强化石','持有 '+this.model().materials+'\n分解装备获得，用于装备详情中的强化。'));}else this.panel(list,x,y,146,146,'#C9BBAB',19);continue;}
      const owner=model.owner(item.id),tile=gearTile(list,this.atlas,item,item.slot,x,y,146,owner>=0?HERO_CONFIG[owner].name:'');
      if(this.batch&&this.selected.has(item.id)){const check=this.panel(tile,-45,-43,46,40,'#FFDA54',12);this.text(check,'✓',0,0,42,38,30);}
      tile.on(Node.EventType.TOUCH_END,()=>{if(!this.batch){this.equipmentDetail(item.id);return;}if(item.locked||model.owner(item.id)>=0){this.detail('不可分解','锁定和已穿戴装备不能分解。');return;}if(this.selected.has(item.id))this.selected.delete(item.id);else this.selected.add(item.id);this.refresh();});
    }
    if(items.length===0&&this.category!==1)this.text(viewport,this.category===0?'没有符合条件的装备':this.category===1?'暂无材料':'暂无道具',0,360,640,58,32);
    const rail=this.panel(p,414,-42,8,990,'#F4DFC7',4);this.thumb=this.panel(rail,0,0,8,140,'#F3B64D',4);
    const update=()=>{const max=Math.max(1,contentHeight-1000);const t=Math.max(0,Math.min(1,this.scroll.getScrollOffset().y/max));this.thumb.setPosition(0,425-t*850);};
    viewport.on(ScrollView.EventType.SCROLLING,update);this.scroll.scrollToOffset(new Vec2(0,Math.min(this.savedOffsets[this.category],Math.max(0,contentHeight-1000))),0);update();
    this.text(p,this.category===1?'强化石 '+model.materials:this.batch?'已选 '+this.selected.size+' 件':'共'+items.length+'件',-303,-621,230,55,30);
    this.text(p,this.batch?'预计 '+model.salvagePreview(Array.from(this.selected)).materials+' 强化石':this.category===0?'自动分解：'+(model.rules.enabled?'开启':'关闭'):this.category===1?'分解获得 · 强化消耗':'暂无物品',-303,-663,230,35,22,'#AA8060');
    this.button(p,this.batch?'按规则选':'保留规则',-10,-628,240,70,()=>{if(this.batch){this.selected=new Set(this.filteredItems().filter(g=>!model.retained(g)).map(g=>g.id));this.refresh();}else this.rulesDetail();});
    this.button(p,this.batch?'分解 '+this.selected.size+' 件':'批量分解',280,-628,285,70,()=>{if(this.batch){this.confirmSalvage();return;}this.category=0;this.batchIds=model.inventory.map(g=>g.id);this.batch=true;this.selected.clear();this.savedOffsets[0]=0;this.render();},true);
    const nav=[[15,1494,182,130],[205,1494,181,130],[393,1494,175,130],[575,1494,182,130],[765,1494,177,130]];
    nav.forEach((r,i)=>this.cut(r[0],r[1],r[2],r[3],-348+i*174,-806,170,130).on(Node.EventType.TOUCH_END,()=>{this.save();if(i===0)this.navigate('hero');else if(i===2)this.navigate('adventure');else if(i!==3)this.detail(i===1?'招募':'副本','此功能尚未开放。');}));
  }
}
