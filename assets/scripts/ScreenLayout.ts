import {Node,UITransform,Sprite,Graphics,view,Color,Camera} from 'cc';
const original=new WeakMap<Node,{x:number;y:number;height:number;width:number;scaleX:number;scaleY:number;applied?:number}>();
// Preserve icon/label geometry; distribute their anchors over the real visible height.
export function fitScreen(canvas:Node,camera:Camera){
 const height=view.getVisibleSize().height;
 canvas.setPosition(443.5,height/2,0);canvas.getComponent(UITransform)!.setContentSize(887,height);
 camera.node.setPosition(443.5,height/2,1000);camera.orthoHeight=height/2;
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
    const shrink=Math.min(1,Math.max(.65,1+(height-1774)/1100));
    n.setScale(shrink,shrink,1);n.setPosition(0,Math.max(0,(1774-height)*.6),0);continue;
  }
  if(!original.has(n))original.set(n,{x:n.position.x,y:n.position.y,height:u.height,width:u.width,scaleX:n.scale.x,scaleY:n.scale.y});
  const o=original.get(n)!;if(o.applied===height)continue;o.applied=height;
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
  if(n.name==='Forest'){
    const extension=typeof document!=='undefined'&&document.getElementById('s6-v2')?100:0;const forestHeight=height/2+333+delta+extension;n.setScale(1,forestHeight/o.height,1);n.setPosition(0,(height/2-333-delta-extension)/2,0);
  }else if(o.width>=880&&o.height>=1770){
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
