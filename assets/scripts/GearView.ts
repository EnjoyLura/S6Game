import {Node,UITransform,Layers,Graphics,Color,Label,Sprite,SpriteFrame,Texture2D,Rect} from 'cc';
import {Gear,GEAR_ART,EQUIPMENT_PARTS} from './SquadBattleModel';
export const GEAR_COLORS=['#B8B6B3','#79C443','#54BBEF','#BD78DD','#FFD34D'];
export function gearTile(parent:Node,atlas:Texture2D,gear:Gear|null,slot:number,x:number,y:number,size=146,owner=''){
 const n=new Node('Gear '+(gear?.id??'empty'));n.parent=parent;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(size,size);
 const box=(x:number,y:number,w:number,h:number,color:string)=>{const q=new Node('Tile background');q.parent=n;q.layer=Layers.Enum.UI_2D;q.setPosition(x,y);q.addComponent(UITransform).setContentSize(w,h);const g=q.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,Math.min(14,h/2));g.fill();};
 const text=(s:string,x:number,y:number,w:number,font:number,color='#FFFFFF')=>{const q=new Node(s);q.parent=n;q.layer=Layers.Enum.UI_2D;q.setPosition(x,y);q.addComponent(UITransform).setContentSize(w,34);const l=q.addComponent(Label);l.string=s;l.fontFamily='Microsoft YaHei';l.fontSize=font;l.isBold=true;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;l.enableOutline=true;l.outlineColor=new Color().fromHEX('#775337');l.outlineWidth=1.5;};
 if(!gear){box(0,0,size,size,'#C9BBAB');text(EQUIPMENT_PARTS[slot],0,0,size,26);return n;}
 const color=GEAR_COLORS[gear.quality];box(0,0,size,size,color);
 const exact=GEAR_ART.findIndex(a=>a[0]===gear.slot&&a[1]===gear.quality),index=exact>=0?exact:GEAR_ART.findIndex(a=>a[0]===gear.slot),row=Math.floor(index/5),col=index%5;
 const pic=new Node('Equipment artwork');pic.parent=n;pic.layer=Layers.Enum.UI_2D;pic.addComponent(UITransform).setContentSize(size-4,size-4);const f=new SpriteFrame();f.texture=atlas;f.rect=new Rect([50,225,398,570,742][col],[432,595,752,907][row],[162,160,158,158,162][col],row===0?146:row===1?139:row===2?140:134);const sp=pic.addComponent(Sprite);sp.sizeMode=Sprite.SizeMode.CUSTOM;sp.spriteFrame=f;
 // Replace baked concept-image badges with actual inventory state.
 box(0,-size/2+19,size-6,36,color);text('Lv.'+gear.level+(gear.enhancement?' +'+gear.enhancement:''),0,-size/2+19,size-12,25);
 box(size/2-22,size/2-21,38,38,color);if(gear.locked)text('锁',size/2-22,size/2-21,35,23);
 if(owner){box(-size/2+36,size/2-17,68,30,'#FFF0CF');text(owner,-size/2+36,size/2-17,64,21,'#704124');}
 return n;
}

// Reuse existing full navigation buttons, keeping one layout and active state.
export function drawNavigation(parent:Node,atlas:Texture2D,bagAtlas:Texture2D,selected:number,onSelect:(i:number)=>void){
 const root=new Node('Navigation');root.parent=parent;root.layer=Layers.Enum.UI_2D;root.addComponent(UITransform).setContentSize(887,150);root.setPosition(0,-812);
 const labels=['英雄','招募','冒险','背包','副本'];
 const regions=[[10,1648,177,120],[190,1648,170,120],[362,1648,169,120],[534,1648,170,120],[707,1648,170,120]];
 labels.forEach((name,i)=>{const n=new Node('Nav '+name);n.parent=root;n.layer=Layers.Enum.UI_2D;n.setPosition(-348+i*174,0);n.addComponent(UITransform).setContentSize(170,130);
 const f=new SpriteFrame();const r=i===0&&selected!==0?[15,1494,182,130]:regions[i];f.texture=i===0&&selected!==0?bagAtlas:atlas;f.rect=new Rect(r[0],r[1],r[2],r[3]);const sp=n.addComponent(Sprite);sp.sizeMode=Sprite.SizeMode.CUSTOM;sp.spriteFrame=f;
 if(i===selected&&i!==0)sp.color=new Color(255,211,114,255);
 n.on(Node.EventType.TOUCH_END,()=>onSelect(i));});return root;
}
