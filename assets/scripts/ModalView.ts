import {Node,UITransform,Layers,Graphics,Color,Label,Sprite,SpriteFrame,Texture2D,Rect,BlockInputEvents} from 'cc';

export const MODAL_INK='#704124';
let skin:Texture2D|null=null;
let controls:Texture2D|null=null;
const CONTROL_RECTS=[[48,156,348,142],[452,156,349,142],[856,156,350,142],[84,496,262,267],[491,495,263,269],[910,494,236,262],[103,883,236,276],[495,904,259,252],[896,899,263,269]];
const cards=new WeakSet<Node>();
const regions=new WeakMap<Node,{content:Node;actions:Node;actionTop:number}>();
export function setModalSkin(texture:Texture2D,atlas:Texture2D){skin=texture;controls=atlas;}
export function modalIcon(parent:Node,index:number,x:number,y:number,size=54){
  if(!controls)return modalText(parent,['','','','×','i','▣','♧','★','◷'][index],x,y,size,size,size*.7).node;
  const r=CONTROL_RECTS[index];return modalImage(parent,controls,new Rect(...r as [number,number,number,number]),x,y,size*r[2]/Math.max(r[2],r[3]),size*r[3]/Math.max(r[2],r[3]));
}
export function modalNode(parent:Node,name:string,x:number,y:number,w:number,h:number){
  parent=regions.get(parent)?.content||parent;
  const n=new Node(name);n.parent=parent;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;
}
export function modalPanel(parent:Node,x:number,y:number,w:number,h:number,color='#FBE3C6',radius=20){
  const n=modalNode(parent,'Modal panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,Math.min(radius,w/2,h/2));g.fill();return n;
}
export function modalText(parent:Node,text:string,x:number,y:number,w:number,h:number,size=28,color=MODAL_INK){
  const n=modalNode(parent,text,x,y,w,h),l=n.addComponent(Label);l.string=text;l.fontFamily='Microsoft YaHei';l.isBold=true;l.fontSize=size;l.lineHeight=size*1.4;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;
}
export function modalImage(parent:Node,texture:Texture2D,rect:Rect,x:number,y:number,w:number,h:number){
  const n=modalNode(parent,'Modal artwork',x,y,w,h),f=new SpriteFrame();f.texture=texture;f.rect=rect;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;return n;
}
export function inModal(parent:Node){for(let n:Node|null=parent;n;n=n.parent)if(cards.has(n))return true;return false;}
export function modalButton(parent:Node,text:string,x:number,y:number,w:number,h:number,run:()=>void,tone:'gold'|'peach'|'muted'='gold'){
  const region=regions.get(parent);if(region)parent=y<region.actionTop?region.actions:region.content;
  const n=modalNode(parent,'Action '+text,x,y,w,h);
  n.name='Action '+text;n.setPosition(x,y);
  const colors=tone==='gold'?['#FFBE32','#FFD34D','#FFE576']:tone==='peach'?['#F29B6E','#FFB98D','#FFD1A9']:['#DECFB7','#E9DCC8','#F2E6D4'];
  if(controls){
    const r=CONTROL_RECTS[tone==='gold'?0:tone==='peach'?1:2],k=h/r[3],art=modalNode(n,'Nine-sliced button',0,0,w/k,r[3]);art.setScale(k,k,1);
    const f=new SpriteFrame();f.texture=controls;f.rect=new Rect(...r as [number,number,number,number]);f.insetLeft=74;f.insetRight=74;f.insetTop=60;f.insetBottom=60;
    const s=art.addComponent(Sprite);s.type=Sprite.Type.SLICED;s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;
  }else{modalPanel(n,0,4,w,h-4,colors[0],h/2);modalPanel(n,0,8,w-6,h-12,colors[1],h/2);modalPanel(n,0,h*.23,w-25,h*.26,colors[2],h/4);}
  modalText(n,text,0,5,w-24,h-6,29);n.on(Node.EventType.TOUCH_END,(event:any)=>{event.propagationStopped=true;run();});return n;
}
export function modalSection(parent:Node,title:string,y:number,width=690){
  const n=modalPanel(parent,-width/2+130,y,260,48,'#FBD8A5',24);modalText(n,'❧ '+title,0,0,245,44,28);return n;
}
export function modalRow(parent:Node,icon:string,name:string,value:string,y:number,width=690){
  const n=modalPanel(parent,0,y,width,51,'#FBE1C2',25);
  if(icon==='◷'||icon==='★')modalIcon(n,icon==='◷'?8:7,-width/2+39,0,35);else modalText(n,icon,-width/2+39,0,54,46,31,'#AA713F');
  const label=modalText(n,name,-width/2+210,0,270,46,28);label.horizontalAlign=Label.HorizontalAlign.LEFT;
  const v=modalText(n,value,width/2-133,0,235,46,29);v.horizontalAlign=Label.HorizontalAlign.RIGHT;return n;
}
export function modalSelect(parent:Node,label:string,x:number,y:number,width:number,options:string[],selected:number,onSelect:(index:number)=>void){
  return modalButton(parent,label+' ▾',x,y,width,60,()=>{
    const overlay=modalNode(parent,'Anchored dropdown',0,0,887,1774);overlay.parent=parent;overlay.setSiblingIndex(parent.children.length-1);overlay.addComponent(BlockInputEvents);
    overlay.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;overlay.destroy();});
    const height=options.length*58+12,centerY=y>0?y-36-height/2:y+36+height/2;
    const menu=modalPanel(overlay,x,centerY,width,height,'#EED3AC',18);menu.addComponent(BlockInputEvents);menu.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);
    options.forEach((option,i)=>modalButton(menu,option,0,height/2-35-i*58,width-12,54,()=>{overlay.destroy();onSelect(i);},i===selected?'gold':'muted'));
  },'peach');
}

/** All dialogs share the same scalable skin, regions and input boundary.
 * Content/actions use card-local coordinates so feature code owns only its data and handlers.
 * Nested dialogs consume input independently; dismissing them never dismisses their parent.
 */
export class ModalView {
  readonly layer:Node;readonly card:Node;readonly content:Node;readonly actions:Node;
  constructor(parent:Node,title:string,readonly height:number,onClose:()=>void,readonly width=820){
    const layer=this.layer=modalNode(parent,'Modal '+title,0,0,887,1774);layer.addComponent(BlockInputEvents);
    const shade=layer.addComponent(Graphics);shade.fillColor=new Color(31,23,13,175);shade.rect(-443.5,-887,887,1774);shade.fill();
    layer.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;onClose();});
    const card=this.card=modalNode(layer,'Modal card',0,0,width,height);cards.add(card);card.addComponent(BlockInputEvents);
    card.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);
    if(skin){
      const f=new SpriteFrame();f.texture=skin;f.rect=new Rect(16,80,skin.width-32,skin.height-128);
      // Fixed decorative caps, stretch only the blank center and straight edges.
      f.insetLeft=110;f.insetRight=110;f.insetTop=245;f.insetBottom=300;
      const s=card.addComponent(Sprite);s.type=Sprite.Type.SLICED;s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;
    }else modalPanel(card,0,0,width,height,'#FFF2DB',40);
    this.content=modalNode(card,'Modal content region',0,0,width-100,height-400);
    this.actions=modalNode(card,'Modal button region',0,0,width-100,height);
    modalText(card,title,-8,height/2-120,width-300,72,40);
    const close=modalNode(card,'Close modal',width/2-78,height/2-158,96,96);close.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;onClose();});
    // Atlas artwork overlays the skin close mark; all dialogs use one large hit target.
    if(controls)modalIcon(close,3,0,0,91);
    else if(!skin){modalPanel(close,0,0,78,78,'#F5A343',39);modalText(close,'×',0,0,70,70,46,'#FFFFFF');}
    modalText(layer,'❧  点击空白处关闭  ❧',0,-height/2-48,740,45,25,'#FFF0D5');
    regions.set(card,{content:this.content,actions:this.actions,actionTop:-height/2+220});
  }
}
