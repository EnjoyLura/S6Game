import assert from 'node:assert/strict';

/** Visual geometry checks supplement, rather than replace, reference image review. */
export async function auditLayout(page,id,viewport){
 const report=await page.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
  const visible=n=>n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0;
  const dialog=document.querySelector('.v2-dialog');
  return {
   root:rect(document.querySelector('#s6-v2')),
   plaques:[...document.querySelectorAll('.plate')].filter(visible).map(n=>({box:rect(n),ratio:Number(getComputedStyle(document.querySelector('#s6-v2')).getPropertyValue('--title-aspect'))})),
   sprouts:[...document.querySelectorAll('.talent-sprout')].map(n=>{const r=rect(n),p=document.querySelector('path.branch[data-branch="'+n.dataset.branch+'"]'),length=p.getTotalLength(),matrix=p.getScreenCTM();let gap=Infinity;for(let i=0;i<=250;i++){const point=p.getPointAtLength(length*i/250).matrixTransform(matrix);gap=Math.min(gap,Math.hypot(point.x-r.x-r.w/2,point.y-r.bottom));}return {gap,ratio:r.w/r.h,natural:n.naturalWidth/n.naturalHeight};}),
   cooldowns:[...document.querySelectorAll('[data-cooldown]')].map(n=>({label:rect(n),art:rect(n.parentElement.querySelector('img,.locked-skill-icon'))})),
   party:[...document.querySelectorAll('.party-card')].map(n=>({box:rect(n),tray:rect(n.closest('.skill-bar')),header:rect(n.querySelector('header')),info:rect(n.querySelector('header>div')),skills:rect(n.querySelector('.active-skills'))})),
   standing:[...document.querySelectorAll('.standing')].map(n=>({box:rect(n),title:rect(n.closest('.formation-scene').querySelector('.title-plaque')),scene:rect(n.closest('.formation-scene'))})),
   pity:[...document.querySelectorAll('.pity-panel')].map(n=>{const box=rect(n),text=rect(n.querySelector('small')),track=rect(n.querySelector('.exp-track'));return {above:text.y-track.bottom,below:box.bottom-text.bottom-parseFloat(getComputedStyle(n).borderBottomWidth)};}),
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
   battle:document.querySelector('.battle-hud')?.dataset.battleLayout?{...JSON.parse(document.querySelector('.battle-hud').dataset.battleLayout),tray:rect(document.querySelector('.skill-bar')),frame:rect(document.querySelector('.battle-hud')),nav:rect(document.querySelector('.battle-hud>.v2-nav')),tags:[...document.querySelectorAll('.party-tags i')].map(n=>parseFloat(getComputedStyle(n).fontSize))}:null,
  };
 });
 const tag=`${id} ${viewport.width}×${viewport.height}`;
 const separated=(a,b)=>a.right<=b.x+.5||b.right<=a.x+.5||a.bottom<=b.y+.5||b.bottom<=a.y+.5;
 assert.deepEqual(report.brokenImages,[],tag+' loaded artwork');
 for(const p of report.plaques)assert.ok(Math.abs(p.box.w/p.box.h-p.ratio)<.02,tag+' title artwork preserves aspect ratio');
 for(const s of report.sprouts){assert.ok(s.gap<.6,tag+' sprout stem touches branch');assert.ok(Math.abs(s.ratio-s.natural)<.02,tag+' sprout is not squeezed');}
 for(const c of report.cooldowns)assert.ok(Math.abs(c.label.x+c.label.w/2-c.art.x-c.art.w/2)<.5&&Math.abs(c.label.y+c.label.h/2-c.art.y-c.art.h/2)<.5,tag+' cooldown centered on icon');
 for(const p of report.party){assert.ok(p.info.bottom<=p.header.bottom+.5,tag+' health and shield fit the header');assert.ok(p.skills.y-p.info.bottom>=report.root.w*.01&&p.skills.y-p.info.bottom<=report.root.w*.035,tag+' information and skills have compact non-overlapping spacing');assert.ok(p.skills.bottom<=p.tray.bottom-.5&&p.box.bottom<=p.tray.bottom,tag+' entire party content fits its tray');}
 for(const s of report.standing)assert.ok(s.box.y>=s.title.bottom+1&&s.box.bottom<=s.scene.bottom,tag+' formation character clears title and toolbar');
 for(let i=0;i<report.standing.length;i++)for(let j=i+1;j<report.standing.length;j++)assert.ok(separated(report.standing[i].box,report.standing[j].box),tag+' formation name and rate labels do not overlap');
 for(const p of report.pity)assert.ok(Math.abs(p.above-p.below)<1,tag+' pity description equal vertical padding');
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
  assert.ok(Math.abs(b.nav.bottom-b.frame.bottom)<.5,tag+' navigation covers bottom safe area');
  assert.ok(b.tags.every(size=>size>=report.root.w*.028),tag+' readable party level and role');
 }
 if(report.dialog){const d=report.dialog,r=report.root;
  assert.ok(d.box.x>=r.x-1&&d.box.right<=r.right+1,tag+' dialog horizontal bounds');
  assert.ok(d.box.y>=r.y-1&&d.box.bottom<=r.bottom+1,tag+' dialog vertical bounds');
  assert.equal(d.overflow,false,tag+' dialog has no horizontal scroll');
  if(d.actions)assert.ok(d.body.bottom<=d.actions.y+1&&d.actions.bottom<=d.box.bottom+1,tag+' content/action separation');
 }
 for(const a of report.actions)for(const c of a.children)assert.ok(c.y>=a.box.y-1&&c.bottom<=a.box.bottom+1&&c.x>=a.box.x-1&&c.right<=a.box.right+1,tag+' '+a.name+' action label inside button');
 for(const m of report.mini)for(const c of m.children)assert.ok(c.x>=m.box.x-1&&c.right<=m.box.right+1&&c.y>=m.box.y-1&&c.bottom<=m.box.bottom+1,tag+' formation miniature bounded');
 for(const m of report.mini)for(let i=0;i<m.children.length;i++)for(let j=i+1;j<m.children.length;j++)assert.ok(separated(m.children[i],m.children[j]),tag+' miniature rate labels do not overlap');
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
