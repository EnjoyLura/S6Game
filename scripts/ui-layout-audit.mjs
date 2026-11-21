import assert from 'node:assert/strict';

/** Visual geometry checks supplement, rather than replace, reference image review. */
export async function auditLayout(page,id,viewport){
 const report=await page.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
  const visible=n=>n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0;
  const dialog=document.querySelector('.v2-dialog');
  return {
   root:rect(document.querySelector('#s6-v2')),
   dialog:dialog?{box:rect(dialog),body:rect(dialog.querySelector('.dialog-body')),head:rect(dialog.querySelector('.dialog-head')),actions:dialog.querySelector('.dialog-actions')?rect(dialog.querySelector('.dialog-actions')):null,overflow:dialog.querySelector('.dialog-body').scrollWidth>dialog.querySelector('.dialog-body').clientWidth+1}:null,
   actions:[...document.querySelectorAll('.dialog-actions button')].filter(visible).map(n=>({name:n.textContent,box:rect(n),children:[...n.children].map(rect)})),
   mini:[...document.querySelectorAll('.formation-mini')].map(n=>({box:rect(n),children:[...n.children].map(rect)})),
   scrollers:[...document.querySelectorAll('.reward-scroll,.equipment-scroll')].map(n=>{
    const grid=n.querySelector('.five-grid'),tiles=[...grid.children].filter(c=>!c.classList.contains('empty-message')),s=getComputedStyle(n),gap=parseFloat(getComputedStyle(grid).rowGap)||0;
    return {name:n.className,box:rect(n),tiles:tiles.map(rect),gap,padding:parseFloat(s.paddingTop)+parseFloat(s.paddingBottom)+parseFloat(s.borderTopWidth)+parseFloat(s.borderBottomWidth),rows:n.classList.contains('salvage-scroll')?3.5:n.classList.contains('equipment-scroll')?4:2.5};
   }),
   skills:[...document.querySelectorAll('.hero-skills button')].map(n=>({box:rect(n),parent:rect(n.closest('.skills-card'))})),
   hero:document.querySelector('.hero-figure')?{box:rect(document.querySelector('.hero-figure')),stage:rect(document.querySelector('.hero-stage')),identity:rect(document.querySelector('.hero-identity')),action:rect(document.querySelector('.formation-link'))}:null,
   brokenImages:[...document.images].filter(n=>visible(n)&&(!n.complete||!n.naturalWidth)).map(n=>n.alt||n.className),
   resources:[...document.querySelectorAll('img[data-resource]')].filter(visible).map(n=>({kind:n.dataset.resource,src:n.currentSrc,filter:getComputedStyle(n).filter})),
   rewardArt:[...document.querySelectorAll('.reward>.resource-art')].filter(visible).map(n=>({image:rect(n),tile:rect(n.parentElement)})),
   battle:document.querySelector('.battle-hud')?.dataset.battleLayout?{...JSON.parse(document.querySelector('.battle-hud').dataset.battleLayout),tray:rect(document.querySelector('.skill-bar')),frame:rect(document.querySelector('.battle-hud'))}:null,
  };
 });
 const tag=`${id} ${viewport.width}×${viewport.height}`;
 assert.deepEqual(report.brokenImages,[],tag+' loaded artwork');
 for(const kind of new Set(report.resources.map(r=>r.kind))){
  const same=report.resources.filter(r=>r.kind===kind);
  assert.equal(new Set(same.map(r=>r.src)).size,1,tag+' shared '+kind+' artwork');
  assert.equal(new Set(same.map(r=>r.filter)).size,1,tag+' shared '+kind+' color');
 }
 // Store compact evidence, not the full data-URL atlas contents in every row.
 report.resources=report.resources.map(({kind,filter})=>({kind,filter}));
 for(const r of report.rewardArt)assert.ok(r.image.w>=r.tile.w*.7&&r.image.h>=r.tile.h*.7,tag+' reward art fills its tile');
 if(report.battle){const b=report.battle;
  assert.ok(b.backFeet>b.horizon+1,tag+' back-row feet below forest horizon');
  assert.ok(b.lowestLabel<=b.actionsTop+1,tag+' bottom health labels clear field actions');
  assert.ok(Math.abs(b.fieldBottom-(b.tray.y-b.frame.y))<1,tag+' forest stops at information tray');
  assert.ok((b.frame.h-b.fieldBottom)/b.frame.h>=.3,tag+' information and navigation occupy at least 30%');
 }
 if(report.dialog){const d=report.dialog,r=report.root;
  assert.ok(d.box.x>=r.x-1&&d.box.right<=r.right+1,tag+' dialog horizontal bounds');
  assert.ok(d.box.y>=r.y-1&&d.box.bottom<=r.bottom+1,tag+' dialog vertical bounds');
  assert.equal(d.overflow,false,tag+' dialog has no horizontal scroll');
  if(d.actions)assert.ok(d.body.bottom<=d.actions.y+1&&d.actions.bottom<=d.box.bottom+1,tag+' content/action separation');
 }
 for(const a of report.actions)for(const c of a.children)assert.ok(c.y>=a.box.y-1&&c.bottom<=a.box.bottom+1&&c.x>=a.box.x-1&&c.right<=a.box.right+1,tag+' '+a.name+' action label inside button');
 for(const m of report.mini)for(const c of m.children)assert.ok(c.x>=m.box.x-1&&c.right<=m.box.right+1&&c.y>=m.box.y-1&&c.bottom<=m.box.bottom+1,tag+' formation miniature bounded');
 for(const s of report.scrollers){
  if(!s.tiles.length)continue;
  for(const t of s.tiles)assert.ok(Math.abs(t.w-t.h)<1,tag+' square list tiles');
  const expected=s.tiles[0].w*s.rows+s.gap*(Math.ceil(s.rows)-1)+s.padding;
  assert.ok(Math.abs(s.box.h-expected)<1.5,tag+' '+s.name+' exact visible row count');
 }
 for(const s of report.skills)assert.ok(s.box.y>=s.parent.y&&s.box.bottom<=s.parent.bottom,tag+' skill text stays in card');
 if(report.hero){const h=report.hero;assert.ok(h.box.h>=report.root.w*.25,tag+' hero is not compressed');assert.ok(h.box.y>=h.identity.bottom-1&&h.box.bottom<=h.action.y+1,tag+' hero clear of identity and formation button');}
 return {id,viewport,...report};
}
