import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {auditLayout} from './ui-layout-audit.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {SAVE_KEY} from '../assets/scripts/LocalSave.ts';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}),errors=[],evidence=[];
const out=resolve(process.env.S6_SCREENSHOTS||'docs/美术参考/第二版/编队修订');await mkdir(out,{recursive:true});
page.on('pageerror',e=>errors.push(String(e)));
const cardSkin=()=>page.locator('.hero-card:not(.locked)').first().evaluate(n=>{const s=getComputedStyle(n);return {background:s.backgroundImage,border:s.borderColor,round:s.borderRadius,padding:s.padding};});
try{
 await page.goto(process.env.S6_URL||'http://127.0.0.1:7456');
 await page.getByRole('button',{name:'阵型',exact:true}).click();
 let checks=0;
 for(const [width,height] of [[360,640],[390,844],[430,764],[430,932],[487,986]]){
  await page.setViewportSize({width,height});
  for(const name of ['守护阵','双锋阵','均衡阵','突击阵']){
   await page.locator('.formation-toolbar>button').click();
   await page.getByRole('button',{name,exact:true}).click();
   await auditLayout(page,name+' preview',{width,height});
   await page.getByRole('button',{name:'使用阵型',exact:true}).click();
   await auditLayout(page,name+' stage',{width,height});
   const geometry=await page.evaluate(()=>{
    const scene=document.querySelector('.formation-scene').getBoundingClientRect();
    const actors=[...document.querySelectorAll('.formation-actor')].map(n=>{const img=n.querySelector('img'),r=img.getBoundingClientRect(),c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,c.width,c.height).data;let last=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>32)last=y+1;const scale=Math.min(r.width/c.width,r.height/c.height);return {foot:r.bottom-(c.height-last)*scale,floor:scene.y+scene.height*.46,actorBottom:n.getBoundingClientRect().bottom};});
    const tags=[...document.querySelectorAll('.roster-grid .deployed')].map(n=>{const r=n.getBoundingClientRect(),p=n.closest('.portrait').getBoundingClientRect(),l=n.closest('.hero-card').querySelector('b').getBoundingClientRect();return {top:r.y,bottom:r.bottom,portraitBottom:p.bottom,levelTop:l.y};});
    return {actors,tags};
   });
   for(const a of geometry.actors){assert.ok(a.foot>a.floor,'opaque feet are on paving, below wall');assert.ok(Math.abs(a.foot-a.actorBottom)<width*.02,'feet meet the contact circle');}
   for(const t of geometry.tags){assert.ok(Math.abs(t.bottom-t.portraitBottom)<width*.01,'deployed ribbon hugs bottom edge');assert.ok(t.bottom<t.levelTop,'deployed ribbon clears level');}
   evidence.push({name,width,height,...geometry});
   if(width===390||width===360)await page.screenshot({path:resolve(out,`${name}-${width}x${height}.png`)});
   checks++;
  }
 }
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.locator('.roster-grid .hero-card.locked').count(),1);
 await page.locator('.roster-grid button').last().click();assert.equal(await page.locator('.roster-grid .deployed').count(),3,'locked hero cannot enter team');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.locator('.v2-nav').getByRole('button',{name:'招募',exact:true}).click();
 await page.evaluate(()=>{window.savedFormationRandom=Math.random;Math.random=()=>.9;});await page.locator('.recruit-bottom .page-actions button').first().click();await page.evaluate(()=>{Math.random=window.savedFormationRandom;delete window.savedFormationRandom;});await page.waitForTimeout(1500);
 const shared=await cardSkin();await page.keyboard.press('Escape');await page.locator('.v2-nav').getByRole('button',{name:'冒险',exact:true}).click();await page.getByRole('button',{name:'阵型',exact:true}).click();
 assert.deepEqual(await cardSkin(),shared,'formation and recruitment use exactly the same card frame');
 await page.locator('.formation-toolbar>button').click();await page.getByRole('button',{name:'守护阵',exact:true}).click();await page.getByRole('button',{name:'使用阵型',exact:true}).click();
 await page.waitForFunction(()=>{const t=document.querySelector('.v2-toast');return !t||getComputedStyle(t).opacity==='0';});await page.screenshot({path:resolve(out,'全部已解锁-390x844.png')});
 await page.locator('.roster-grid button').first().click();assert.equal(await page.locator('.empty-position').count(),1);assert.equal(await page.locator('.deployed').count(),2);
 await page.locator('.roster-grid button').last().click();assert.equal(await page.locator('.empty-position').count(),0);assert.equal(await page.locator('.deployed').count(),3);
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.locator('.v2-nav').waitFor();assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).formation,SAVE_KEY),[1,2,3]);
 assert.deepEqual(errors,[]);await writeFile(resolve(out,'manifest.json'),JSON.stringify({checks,evidence,interactions:['locked hero','actual recruitment','shared card frame','remove/add hero','persist formation'],errors},null,2));
 console.log(`Verified ${checks} formations/viewports, opaque feet on paving, deployed ribbons, shared recruitment cards and saved team replacement.`);
}finally{await browser.close();}
