// Verify actual Cocos nodes, including monster replacement after a wave change.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto(process.env.S6_URL||'http://127.0.0.1:7456');await page.locator('.battle-hud').waitFor();
 const shared=await page.evaluate(async()=>{
  const cc=await System.import('cc'),a=cc.director.getScene().getComponentsInChildren(cc.Component).find(c=>c.__classname__==='Adventure'),v=a.view,m=a.model;
  m.paused=true;m.heroes[m.formation[0]].shield=88;v.resetFeedback();a.second.lastUpdate=0;a.second.update();
  const source=n=>{const frame=n.getComponent(cc.Sprite)?.spriteFrame;return (frame?._original?._texture||frame?.texture)?.image?.data.src;};
  const heart=document.querySelector('[data-resource="heart"]').src,shield=document.querySelector('[data-resource="shield"]').src;
  const checkpoints=[];for(const wave of [1,4,7,10,11]){m.wave=wave;a.second.lastUpdate=0;a.second.update();const p=document.querySelector('.checkpoint');checkpoints.push({wave,value:+p.getAttribute('aria-valuenow'),passed:p.querySelectorAll('.passed').length,next:document.querySelector('[data-live="checkpoint"]').textContent});}m.wave=1;
  return {heart:v.heartIcons.every(n=>source(n)===heart),shield:v.shieldIcons.every(n=>source(n)===shield),checkpoints};
 });
 assert.ok(shared.heart&&shared.shield,'Cocos and DOM use identical status textures');
 assert.deepEqual(shared.checkpoints.map(x=>x.value),[0,3,6,9,0]);
 assert.deepEqual(shared.checkpoints.map(x=>x.passed),[1,2,4,5,1]);
 assert.ok(shared.checkpoints.every(x=>x.next.includes(x.wave<=10?'第10波':'第20波')),'checkpoint label agrees with progress');
 const lifecycle=await page.evaluate(async()=>{
  const cc=await System.import('cc'),adventure=cc.director.getScene().getComponentsInChildren(cc.Component).find(c=>c.__classname__==='Adventure'),v=adventure.view,m=adventure.model;
  m.heroes.forEach((h,id)=>{h.level=50;h.hp=m.stats(id).hp;});m.paused=false;m.autoSkill=true;v.resetFeedback();
  const records=[];
  const record=()=>records.push({wave:m.wave,kinds:m.enemies.map(e=>e.kind),offsets:v.contactShadows.slice(3).map(s=>s.offset),aligned:v.contactShadows.every((s,i)=>{const world=v.units[i].getComponent(cc.UITransform).convertToWorldSpaceAR(new cc.Vec3(0,s.offset-2,0)),local=s.node.parent.getComponent(cc.UITransform).convertToNodeSpaceAR(world);return Math.abs(s.node.position.x-local.x)<.01&&Math.abs(s.node.position.y-local.y-2)<.01;})});
  v.update(.001);record();let wave=m.wave;
  for(let n=0;n<4000&&m.wave<6;n++){
   v.update(.25);
   if(m.wave!==wave){wave=m.wave;v.update(.001);record();}
  }
  m.paused=true;m.heroes[m.formation[0]].hp=0;v.resetFeedback();v.sync();
  const hiddenOnDeath=!v.contactShadows[0].node.active;
  m.heroes[m.formation[0]].hp=m.stats(m.formation[0]).hp;v.resetFeedback();v.sync();
  return {records,hiddenOnDeath,visibleAfterReset:v.contactShadows[0].node.active};
 });
 assert.ok(lifecycle.records.length>=5,'advanced through five monster replacements');
 assert.equal(new Set(lifecycle.records.flatMap(r=>r.kinds)).size,4,'all four monster artworks exercised');
 assert.ok(lifecycle.records.every(r=>r.aligned),'shadows follow actual sprite positions');
 assert.ok(lifecycle.hiddenOnDeath&&lifecycle.visibleAfterReset,'shadow visibility follows death and reset');
 for(const [width,height] of [[360,640],[390,844],[430,764],[430,932]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);
  const feet=await page.evaluate(async()=>{
   const cc=await System.import('cc'),a=cc.director.getScene().getComponentsInChildren(cc.Component).find(c=>c.__classname__==='Adventure'),v=a.view,hud=document.querySelector('.battle-hud'),frame=hud.getBoundingClientRect(),layout=JSON.parse(hud.dataset.battleLayout),visible=cc.view.getVisibleSize().height;
   return v.units.map((unit,i)=>{
    const sprite=unit.getComponent(cc.Sprite),r=sprite.spriteFrame.rect,canvas=document.createElement('canvas');canvas.width=r.width;canvas.height=r.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(sprite.spriteFrame.texture.image.data,r.x,r.y,r.width,r.height,0,0,r.width,r.height);
    const pixels=ctx.getImageData(0,0,r.width,r.height).data;let bottom=0;
    for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++)if(pixels[(y*r.width+x)*4+3]>32)bottom=y+1;
    const localFoot=unit.getComponent(cc.UITransform).height*(.5-bottom/r.height),worldFoot=unit.worldPosition.y+localFoot*unit.worldScale.y,shadow=v.contactShadows[i].node;
    return {screenY:(visible-worldFoot)*frame.height/visible,horizon:layout.horizon,shadowGap:Math.abs(worldFoot-shadow.worldPosition.y)/unit.worldScale.y};
   });
  });
  for(const f of feet){assert.ok(f.screenY>f.horizon,`${width}×${height}: actual opaque foot on grass`);assert.ok(Math.abs(f.shadowGap-2)<.1,`${width}×${height}: contact shadow at actual foot after monster replacement`);}
 }
 assert.deepEqual(errors,[]);
 console.log('Verified five wave replacements, four monster artworks, moving/dead/reset shadows and actual feet at four sizes; no page errors.');
}finally{await browser.close();}
