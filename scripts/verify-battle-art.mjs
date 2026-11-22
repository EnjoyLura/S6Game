// Verify actual Cocos nodes, including monster replacement after a wave change.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {SAVE_KEY} from '../assets/scripts/LocalSave.ts';

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
 const verifyTools=async dungeon=>{
  const state=await page.evaluate(async ({dungeon,key})=>{
   const cc=await System.import('cc'),a=cc.director.getScene().getComponentsInChildren(cc.Component).find(c=>c.__classname__==='Adventure');
   const battle=dungeon?a.dungeonPage.activeBattle:a.model,view=dungeon?a.dungeonPage.activeView:a.view;
   battle.paused=true;
   const hero=battle.heroes[battle.formation[0]];
   hero.shield=view.feedback.shields[0]+17;hero.cooldown=2.3;
   a.second.lastUpdate=0;a.second.update();
   const read=()=>Array.from(document.querySelectorAll('.checkpoint,.turn-order,.turn-current,[data-shield] span,[data-cooldown]'));
   const nodes=read(),values=nodes.map(n=>[n.textContent,n.className,n.getAttribute('aria-valuenow')]);
   const auto=document.querySelector('[data-auto-skill]'),speed=document.querySelector('[data-battle-speed]');
   const previous=battle.autoSkill,previousSpeed=view.getSpeed(),feedback=JSON.stringify(view.feedback.shields);
   auto.click();
   const saved=JSON.parse(localStorage.getItem(key));
   const stored=(dungeon?saved.dungeon.run.battle:saved).autoSkill;
   const turned=auto.getAttribute('aria-pressed')===String(!previous)&&battle.autoSkill!==previous&&stored!==previous&&stored===battle.autoSkill;
   auto.click();speed.click();
   const spedUp=view.getSpeed()!==previousSpeed&&speed.textContent===view.getSpeed()+'×';
   speed.click();
   const after=read();
   return {turned,spedUp,shield:nodes.some(n=>n.parentElement.matches('[data-shield]')&&n.textContent===String(hero.shield)),
    stable:after.length===nodes.length&&nodes.every((n,i)=>n===after[i]&&JSON.stringify(values[i])===JSON.stringify([n.textContent,n.className,n.getAttribute('aria-valuenow')])),
    feedback:feedback===JSON.stringify(view.feedback.shields)};
  },{dungeon,key:SAVE_KEY});
  assert.deepEqual(state,{turned:true,spedUp:true,shield:true,stable:true,feedback:true},'controls preserve the HUD and battle feedback');
 };
 await verifyTools(false);
 await page.setViewportSize({width:577,height:1000});
 await page.waitForFunction(()=>!document.documentElement.classList.contains('s6-loading'));
 const switches=await page.evaluate(async()=>{
  const backdrop=document.querySelector('#s6-backdrop'),canvas=document.querySelector('#GameCanvas'),ui=document.querySelector('#s6-v2');
  const alpha=(canvas.getContext('webgl2')||canvas.getContext('webgl')).getContextAttributes().alpha;
  const nav=label=>Array.from(ui.querySelectorAll('.v2-nav button')).find(b=>b.textContent===label).click();
  const results=[],art=getComputedStyle(backdrop).backgroundImage;
  for(let i=0;i<32;i++){
   nav(['英雄','招募','背包','副本'][i%4]);
   await new Promise(requestAnimationFrame);
   nav('冒险');
   const checkpoint=ui.querySelector('.checkpoint'),bar=ui.querySelector('.skill-bar');
   results.push(getComputedStyle(backdrop).backgroundImage===art&&checkpoint.hasAttribute('aria-valuenow')&&
    Math.abs(backdrop.getBoundingClientRect().bottom-bar.getBoundingClientRect().top)<1);
   await new Promise(requestAnimationFrame);
  }
  nav('副本');
  const geometry=[ui,canvas,backdrop].map(node=>[node.getBoundingClientRect().left,node.getBoundingClientRect().width]);
  nav('冒险');
  return {alpha,geometry,results};
 });
 assert.equal(switches.alpha,true,'WebGL clears to transparent over the persistent forest');
 assert.deepEqual(switches.geometry,Array.from({length:3},()=>[0,577]),'UI, forest and canvas fill the portrait viewport');
 assert.ok(switches.results.every(Boolean),'forest and checkpoint are ready in the same task on every rapid return');
 // Simulate a frame with no Cocos battle output. The underlying forest must still paint.
 await page.evaluate(async()=>{
  const cc=await System.import('cc');
  cc.director.getScene().getComponentsInChildren(cc.Component).find(c=>c.__classname__==='Adventure').view.root.active=false;
  await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
 });
 const screen=await page.screenshot();
 const sky=await page.evaluate(async base64=>{
  const backdrop=document.querySelector('#s6-backdrop');
  const image=new Image(),forest=new Image();
  image.src='data:image/png;base64,'+base64;
  forest.src=getComputedStyle(backdrop).backgroundImage.slice(5,-2);
  await Promise.all([image.decode(),forest.decode()]);
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const context=canvas.getContext('2d');context.drawImage(image,0,0);
  const samples=[45,255,486],y=228;
  const pixels=()=>samples.map(x=>Array.from(context.getImageData(x,y,1,1).data));
  const actual=pixels();
  context.drawImage(forest,0,0,canvas.width,backdrop.getBoundingClientRect().height);
  return {actual,expected:pixels()};
 },screen.toString('base64'));
 assert.ok(sky.actual.every((pixel,i)=>pixel.every((channel,j)=>Math.abs(channel-sky.expected[i][j])<20)),JSON.stringify(sky));
 await page.getByRole('navigation').getByRole('button',{name:'副本'}).click();
 await page.locator('.dungeon-card button').first().click();
 await page.getByRole('button',{name:'开始挑战'}).click();
 await verifyTools(true);
 await page.getByRole('navigation').getByRole('button',{name:'冒险'}).click();
 await page.setViewportSize({width:1024,height:800});
 const desktop=await page.evaluate(()=>({
  gutter:document.querySelector('#s6-v2').getBoundingClientRect().left,
  color:getComputedStyle(document.body).backgroundColor
 }));
 assert.deepEqual(desktop,{gutter:287,color:'rgb(255, 236, 215)'},'desktop keeps a centered portrait game with cream gutters');
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
 console.log('Verified 32 rapid page returns, HUD continuity in both battle modes, portrait edges, desktop gutters, forest without Cocos battle output, and wave replacement and shadows at four sizes.');
}finally{await browser.close();}
