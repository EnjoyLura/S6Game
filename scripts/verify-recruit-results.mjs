import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {SquadBattleModel} from '../assets/scripts/SquadBattleModel.ts';
import {SAVE_KEY} from '../assets/scripts/LocalSave.ts';
import {auditLayout} from './ui-layout-audit.mjs';

const out=resolve(process.env.S6_SCREENSHOTS||'docs/美术参考/第二版/招募结果修订');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:430,height:764},deviceScaleFactor:2});
const errors=[],checks=[];page.on('pageerror',e=>errors.push(String(e)));
const base=process.env.S6_URL||'http://127.0.0.1:7456';
try{
 for(const [id,pool,count,roll] of [['single-new',0,1,.9],['single-duplicate',0,1,.4],['ten',0,10,.9],['up-ten',1,10,.04]]){
  const m=new SquadBattleModel(0,()=>.5,3,true);m.paused=true;m.markSeen(Date.now());
  await page.goto(base);await page.evaluate(({key,data})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(data));},{key:SAVE_KEY,data:m.snapshot()});await page.reload();await page.locator('.v2-nav').waitFor();
  await page.locator('.v2-nav').getByRole('button',{name:'招募',exact:true}).click();
  if(pool)await page.getByRole('button',{name:'UP招募',exact:true}).click();
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
  await page.evaluate(({roll,count,pool})=>{window.savedRecruitRandom=Math.random;let i=0;const sequence=[.02,.1,.12,.4,.5,.6,.5,.9];Math.random=()=>count===10&&!pool?sequence[i++%sequence.length]:roll;},{roll,count,pool});
  await page.locator('.recruit-bottom .page-actions button').nth(count===1?0:1).click();
  await page.evaluate(()=>{Math.random=window.savedRecruitRandom;delete window.savedRecruitRandom;});
  assert.equal(await page.locator('.recruit-rays>i').count(),7);
  assert.equal(await page.locator('.recruit-confetti>i').count(),14);
  assert.equal(await page.locator('.recruit-fx').evaluate(n=>getComputedStyle(n).pointerEvents),'none');
  assert.equal(await page.locator('.result-cards .hero-card').first().evaluate(n=>getComputedStyle(n).animationName),'s6-card-reveal');
  await page.waitForTimeout(1450);
  const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
  assert.equal(after.recruitment.tickets,before.recruitment.tickets-(pool?0:count));
  assert.equal(after.interfaceProgress.upTickets,before.interfaceProgress.upTickets-(pool?count:0));
  assert.equal(after.recruitment.last.length,count);
  assert.equal(await page.locator('.result-title-art[alt="招募结果"]').count(),1,'title uses generated Chinese display lettering');
  assert.equal(await page.locator('.result-cards .card-tag.new').count(),after.recruitment.last.filter(r=>r.fresh).length);
  assert.equal(await page.locator('.ticket-left .up-ticket').count(),pool);
  for(const [width,height] of [[360,640],[390,844],[430,764],[430,932],[487,986]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(100);await auditLayout(page,id,{width,height});
   const r=await page.evaluate(()=>{
    const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const box=s=>rect(document.querySelector(s));
    return {root:box('#s6-v2'),header:box('.results-screen .dialog-head'),sub:box('.result-sub'),grid:box('.result-cards'),ticket:box('.ticket-left'),actions:box('.results-screen .dialog-actions'),hint:box('.outside-hint'),cards:[...document.querySelectorAll('.result-cards .hero-card')].map(n=>({box:rect(n),portrait:rect(n.querySelector('.portrait')),level:rect(n.querySelector('b')),stars:rect(n.querySelector('.star-row')),tag:rect(n.querySelector('.card-tag'))})),buttons:[...document.querySelectorAll('.results-screen .dialog-actions button')].map(rect)};
   });
   assert.equal(r.cards.length,count);
   assert.ok(r.header.bottom<=r.sub.y+1,'header clears description');
   assert.ok(r.sub.bottom<r.cards[0].box.y,'description clears cards');
   for(const c of r.cards){assert.ok(c.box.x>=r.root.x&&c.box.right<=r.root.right,'card inside screen');assert.ok(c.portrait.bottom<=c.level.y+.5&&c.level.bottom<=c.stars.y+.5,'separate portrait, level and stars');assert.ok(c.stars.bottom<c.box.bottom,'stars inside frame');assert.ok(c.tag.x>=r.root.x&&c.tag.right<=r.root.right,'tag stays on screen');assert.ok(c.box.bottom<r.ticket.y,'card clears ticket balance');}
   if(count===10){assert.ok(r.cards.slice(0,5).every(c=>Math.abs(c.box.y-r.cards[0].box.y)<1),'five columns');assert.ok(r.cards[5].box.y>r.cards[0].box.bottom,'two separated rows');}
   assert.ok(r.ticket.bottom<r.actions.y,'balance clears buttons');assert.ok(r.actions.bottom<r.hint.y,'buttons clear hint');assert.ok(r.hint.bottom<=r.root.bottom,'hint visible');
   assert.ok(r.actions.y-Math.max(...r.cards.map(c=>c.box.bottom))<r.root.w*.16,'draw buttons follow cards without a tall empty spacer');
   checks.push({id,width,height,cards:count,headerY:r.header.y,cardY:r.cards[0].box.y,cardHeight:r.cards[0].box.h});
   if(width===390||width===430&&height===764)await page.screenshot({path:resolve(out,`${id}-${width}x${height}.png`)});
  }
  // Repeat draw from the result action: only this pool's balance changes once.
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.result-cards .hero-card').first().evaluate(n=>getComputedStyle(n).animationName),'none');
  await page.locator('.results-screen .dialog-actions button').first().click();
  const repeated=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
  assert.equal(repeated.recruitment.tickets,after.recruitment.tickets-(pool?0:1));
  assert.equal(repeated.interfaceProgress.upTickets,after.interfaceProgress.upTickets-(pool?1:0));
  await page.locator('.outside-hint').click();assert.equal(await page.locator('.results-screen').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.reload();await page.locator('.v2-nav').waitFor();
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).recruitment,SAVE_KEY),repeated.recruitment);
 }
 assert.deepEqual(errors,[]);await writeFile(resolve(out,'manifest.json'),JSON.stringify({checks,errors,interactions:['fresh/duplicate tags','both ticket balances','result repeat draw','outside close','reload persistence']},null,2));
 console.log(`Verified ${checks.length} recruitment result layouts, actual pool costs, NEW/duplicate, repeat draw, dismissal and saved results.`);
}finally{await browser.close();}
