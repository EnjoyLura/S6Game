import {Node,UITransform,Sprite,Graphics,view,Color,Camera} from 'cc';
const original=new WeakMap<Node,{x:number;y:number;height:number;width:number;scaleX:number;scaleY:number;applied?:number}>();
const battleLayouts=new WeakMap<Node,{key:string;hud:Element;scale:number;y:number}>();
type WebLayout={hud:HTMLElement|null;battle:Node|null;height:number;dirty:boolean;observer:ResizeObserver;style:MutationObserver};
const webLayouts=new WeakMap<Node,WebLayout>();

function needsWebLayout(canvas:Node,height:number,battle:Node|null){
 let layout=webLayouts.get(canvas);
 if(!layout){
  const markDirty=()=>{layout!.dirty=true;};
  layout={hud:null,battle:null,height:0,dirty:true,observer:new ResizeObserver(markDirty),style:new MutationObserver(markDirty)};
  const root=document.getElementById('s6-v2');
  if(root)layout.style.observe(root,{attributes:true,attributeFilter:['style','class']});
  webLayouts.set(canvas,layout);
 }
 const hud=document.querySelector<HTMLElement>('.battle-hud');
 if(layout.hud!==hud){
  layout.observer.disconnect();
  if(hud){
   layout.observer.observe(hud);
   hud.querySelectorAll('.stage-heading,.turn-order,.field-actions,.skill-bar').forEach(element=>layout!.observer.observe(element));
  }
  layout.hud=hud;
  layout.dirty=true;
 }
 if(!layout.dirty&&layout.height===height&&layout.battle===battle)return false;
 layout.dirty=false;
 layout.height=height;
 layout.battle=battle;
 return true;
}

export function releaseScreenLayout(canvas:Node){
 const layout=webLayouts.get(canvas);
 layout?.observer.disconnect();
 layout?.style.disconnect();
 webLayouts.delete(canvas);
}

// Preserve icon/label geometry; distribute their anchors over the real visible height.
export function fitScreen(canvas:Node,camera:Camera,webBattle?:Node|null){
 const height=view.getVisibleSize().height;
 if(webBattle!==undefined&&!needsWebLayout(canvas,height,webBattle))return;
 canvas.setPosition(443.5,height/2,0);canvas.getComponent(UITransform)!.setContentSize(887,height);
 camera.node.setPosition(443.5,height/2,1000);camera.orthoHeight=height/2;
 // Read each DOM rail once. Its geometry can change at the same visible height
 // (safe-area inset, stylesheet or a new battle HUD), so height alone is not a key.
 const hud=typeof document!=='undefined'?document.querySelector<HTMLElement>('.battle-hud'):null;
 const frame=hud?.getBoundingClientRect(),order=hud?.querySelector('.turn-order')?.getBoundingClientRect(),
  actions=hud?.querySelector('.field-actions')?.getBoundingClientRect(),bar=hud?.querySelector('.skill-bar')?.getBoundingClientRect();
 const field=frame&&order&&actions&&bar&&frame.height>0?{frame,order,actions,bar,ratio:height/frame.height,key:[height,frame.width,frame.height,bar.top,order.bottom,actions.top].join(':')}:null;
 const containers:Node[]=[];
 for(const page of canvas.children){
   if(page.getChildByName('Modal card')){fitModal(page,height);continue;}
   if(page.name==='Adventure page')containers.push(page);
   else for(const content of page.children){if(content.getChildByName('Modal card'))fitModal(content,height);else if(/content|Dungeon battle/i.test(content.name))containers.push(content);}
 }
 for(const p of containers)for(const n of p.children){
  if(n.getChildByName('Modal card')){fitModal(n,height);continue;}
  const u=n.getComponent(UITransform);if(!u)continue;
  if(n.name==='Battle actors'){
    let shrink=Math.min(1,Math.max(.65,1+(height-1774)/1100)),y=Math.max(0,(1774-height)*.6);
    // Fit the formation onto the grass, not into the empty sky between HUD rails.
    if(hud&&field){
      let layout=battleLayouts.get(n);
      if(!layout||layout.key!==field.key||layout.hud!==hud){
          const {frame,order,actions,bar,ratio}=field,fieldBottom=bar.top;
          const top=order.bottom+frame.width*.025,bottom=actions.top-frame.width*.025;
          // Lowest health label sits above field actions. The back-row feet must
          // clear the 42%-high horizon in the standalone forest texture.
          const ground=frame.top+(fieldBottom-frame.top)*.42;
          // Fit the real 400..-310 actor span; do not reserve a second empty strip
          // above it. A separate ground constraint keeps the rear row on the grass.
          shrink=Math.min(1.08,(bottom-top)*ratio/710,(bottom-ground-frame.width*.035)*ratio/470);
          const minimumY=height/2-(bottom-frame.top)*ratio+310*shrink;
          const maximumY=height/2-(ground+frame.width*.035-frame.top)*ratio-160*shrink;
          y=Math.min(minimumY,maximumY);
          layout={key:field.key,hud,scale:shrink,y};battleLayouts.set(n,layout);
          // Expose rendered layout evidence for browser geometry verification.
          (hud as HTMLElement).dataset.battleLayout=JSON.stringify({scale:shrink,fieldBottom:fieldBottom-frame.top,horizon:ground-frame.top,backFeet:(height/2-y-160*shrink)/ratio,lowestLabel:(height/2-y+310*shrink)/ratio,actionsTop:bottom-frame.top});
      }
      if(layout){shrink=layout.scale;y=layout.y;}
    }
    n.setScale(shrink,shrink,1);n.setPosition(0,y,0);continue;
  }
  if(!original.has(n))original.set(n,{x:n.position.x,y:n.position.y,height:u.height,width:u.width,scaleX:n.scale.x,scaleY:n.scale.y});
  const o=original.get(n)!;
  if(n.name==='Forest'){
    const forestHeight=field?(field.bar.top-field.frame.top)*field.ratio:height-554;
    n.setScale(1,forestHeight/o.height,1);n.setPosition(0,height/2-forestHeight/2,0);continue;
  }
  if(o.applied===height)continue;o.applied=height;
  // Combat feedback owns its moving sprites and must not be repositioned by layout.
  if((p.name==='Adventure page'||p.name==='Dungeon battle')&&(n.name==='Combat effects'||n.getComponent(Sprite)&&/^(骑士|法师|牧师|弓箭手|Monster |Empty slot)/.test(n.name)||(n.name==='Health'||/^(heart|shield)$/.test(n.name))&&o.y>-333))continue;
  n.setScale(o.scaleX,o.scaleY,n.scale.z);
  const delta=(height-1774)/2;
  const compact=p.name!=='Adventure page'&&p.name!=='Dungeon content'&&p.name!=='Dungeon battle';
  if(compact&&height<1774&&n.name!=='Navigation'&&o.width<880){const scale=height/1774;n.setPosition(o.x*scale,o.y*scale,n.position.z);n.setScale(o.scaleX*scale,o.scaleY*scale,1);continue;}
  const battle=p.name==='Adventure page'||p.name==='Dungeon battle';
  const bottom=n.name==='Navigation'||battle&&(o.y<-333||['Formation','离开','Battle notice','查看结算'].indexOf(n.name)>=0)||p.name==='Dungeon content'&&o.y<=-680;
  const top=(p.name==='Adventure page'||p.name==='Dungeon battle')?300:580;
  const y=o.y>=top?o.y+delta:bottom?o.y-delta:o.y;n.setPosition(o.x,y,n.position.z);
  if(o.width>=880&&o.height>=1770){
    n.setScale(n.scale.x,o.scaleY*height/1774,n.scale.z);
  }else if(n.getComponent(Sprite)&&o.width>=880){n.setScale(n.scale.x,o.scaleY*height/1774,n.scale.z);}
  else if(n.name==='Dungeon vertical scroll'){u.setContentSize(o.width,o.height+height-1774);const content=n.children[0];if(content){const scrollHeight=u.height;const contentHeight=content.getComponent(UITransform)!.height;content.setPosition(content.position.x,scrollHeight/2-contentHeight/2,0);}}
 }
}
const modalHeights=new WeakMap<Node,number>();
function fitModal(layer:Node,height:number){
 if(modalHeights.get(layer)===height)return;modalHeights.set(layer,height);
 layer.getComponent(UITransform)?.setContentSize(887,height);const g=layer.getComponent(Graphics);if(g){
   // Keep generated geometry intact; put a separate full-height shade behind the card.
   let shade=layer.getChildByName('Responsive shade');if(!shade){shade=new Node('Responsive shade');shade.parent=layer;shade.layer=layer.layer;shade.setSiblingIndex(0);const graphics=shade.addComponent(Graphics);graphics.fillColor=new Color(31,23,13,175);graphics.rect(-443.5,-887,887,1774);graphics.fill();g.enabled=false;}
   shade.setScale(1,height/1774,1);
 }
 const card=layer.children.find(n=>n.name==='Modal card');if(card){const h=card.getComponent(UITransform)!.height;const scale=Math.min(1,(height-110)/h);card.setScale(scale,scale,1);const hint=layer.children.find(n=>n.name.indexOf('点击空白处关闭')>=0);if(hint)hint.setPosition(0,-h*scale/2-42);}
}
