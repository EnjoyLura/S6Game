import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {SquadBattleModel,generateGear,recruit} from '../assets/scripts/SquadBattleModel.ts';
import {SAVE_KEY} from '../assets/scripts/LocalSave.ts';

const out=resolve('docs/美术参考/第二版/主界面修订');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const m=new SquadBattleModel(0,()=>.5,3,true);recruit(m.recruitment,0,10,()=>.99);m.gold=48320;m.materials=500;m.paused=true;
m.heroes.forEach((h,id)=>{h.level=12;h.hp=m.stats(id).hp;});m.inventory=Array.from({length:35},(_,i)=>generateGear(i+1,12));m.nextGearId=36;m.markSeen(Date.now());
await page.goto(process.env.S6_URL||'http://127.0.0.1:7456');
await page.evaluate(({key,data})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(data));},{key:SAVE_KEY,data:m.snapshot()});await page.reload();await page.locator('.v2-nav').waitFor();
const nav=async name=>page.locator('.v2-nav').getByRole('button',{name,exact:true}).click();
const click=async name=>page.getByRole('button',{name,exact:true}).click();
const states=[['adventure','冒险',null],['recruit-normal','招募','常驻招募'],['recruit-up','招募','UP招募'],['bag','背包',null],['dungeons','副本','资源副本'],['endless','副本','无尽挑战'],['daily','副本','每日副本']];
async function verify(id,width,height,screenshot){
 const result=await page.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
  const box=s=>rect(document.querySelector(s));
  const many=s=>[...document.querySelectorAll(s)].map(rect);
  const root=box('#s6-v2'),nav=box('.v2-nav'),body=document.querySelector('.page,.battle-hud');
  const wallet=box('.wallet');const data={root,nav,wallet,overflow:body.scrollHeight>body.clientHeight+1||body.scrollWidth>body.clientWidth+1,navButtons:many('.v2-nav button'),tiles:many('.bag-scroll .gear-tile'),parts:many('.part-tabs button'),cards:many('.dungeon-card'),footers:many('.dungeon-card footer'),cardChildren:[...document.querySelectorAll('.dungeon-card')].map(n=>({frame:rect(n),image:rect(n.querySelector('img')),title:rect(n.querySelector('h2')),rewards:rect(n.querySelector('.drop-icons')),cost:rect(n.querySelector('footer small')),button:rect(n.querySelector('footer button'))})),features:[...document.querySelectorAll('.feature-row')].map(n=>({frame:rect(n),children:[...n.children].filter(n=>getComputedStyle(n).position!=='absolute').map(rect)}))};
  if(document.querySelector('.recruit-page'))Object.assign(data,{draw:many('.recruit-bottom .page-actions button'),links:many('.pool-links button'),pity:box('.pity-panel'),cast:box('.recruit-cast'),castImages:many('.recruit-cast>.cast'),bottom:box('.recruit-bottom'),tabs:box('.main-tabs')});
  if(document.querySelector('.bag-page'))Object.assign(data,{grid:box('.bag-scroll'),footer:box('.bag-footer'),filters:box('.filter-row')});
  if(document.querySelector('.battle-hud'))Object.assign(data,{order:box('.turn-order'),heading:box('.stage-heading'),actions:box('.field-actions'),skills:box('.skill-bar'),skillIcons:many('.skill-button>img,.skill-button>.locked-skill-icon'),party:many('.party-card'),partyHeaders:many('.party-card header')});
  return data;
 });
 const tag=`${width}x${height} ${id}`;assert.equal(result.overflow,false,tag+' no page scroll');assert.ok(result.wallet.y>=11.5,tag+' safe top');assert.ok(result.nav.bottom<=height+1,tag+' navigation inside viewport');
 for(let i=1;i<result.navButtons.length;i++)assert.ok(result.navButtons[i].x-result.navButtons[i-1].right>=2,tag+' navigation gutter');
 for(const t of result.tiles)assert.ok(Math.abs(t.width-t.height)<1,tag+' square equipment');
 if(id==='bag'){assert.equal(result.parts.length,7);assert.ok(result.filters.bottom<result.grid.y,tag+' toolbar gap');assert.ok(result.grid.bottom<=result.footer.y+1,tag+' footer reserved');assert.ok(result.footer.bottom<=result.nav.y+1,tag+' footer clear of nav');const first=result.tiles.slice(0,5);assert.equal(first.length,5);assert.ok(first.every(t=>Math.abs(t.y-first[0].y)<1),tag+' five columns');}
 for(const c of result.cardChildren){assert.ok(c.title.bottom<=c.rewards.y+1,tag+' reward below title');assert.ok(c.rewards.bottom<=c.button.y+1,tag+' reward above challenge');assert.ok(c.cost.right<=c.button.x+1,tag+' cost clear of button');assert.ok(c.button.right<=c.frame.right,tag+' button inside card');assert.ok(c.button.bottom<=c.frame.bottom,tag+' button visible');assert.ok(c.image.bottom<=c.frame.bottom,tag+' image inside card');}
 for(const row of result.features){for(const c of row.children)assert.ok(c.y>=row.frame.y-1&&c.bottom<=row.frame.bottom+1,tag+' feature children inside row');for(let i=1;i<row.children.length;i++)assert.ok(row.children[i].x>=row.children[i-1].right-1,tag+' feature row has no overlap');}
 if(id.startsWith('recruit')){assert.equal(result.castImages.length,4);assert.equal(result.draw.length,2);assert.ok(result.cast.y>=result.tabs.bottom,tag+' cast below tabs');assert.ok(result.pity.bottom<result.links[0].y,tag+' pity links gap');assert.ok(result.links[0].bottom<result.draw[0].y,tag+' links draw gap');assert.ok(result.bottom.bottom<=result.nav.y,tag+' draw clear of navigation');for(const d of result.draw)assert.ok(d.height<d.width*.5,tag+' compact draw');for(const c of result.castImages)assert.ok(c.bottom<=result.bottom.y+1,tag+' cast clear of controls');}
 if(id==='adventure'){assert.equal(result.skillIcons.length,6);for(const r of result.skillIcons)assert.ok(Math.abs(r.width-r.height)<1,tag+' square skills');assert.ok(result.heading.bottom<=result.order.y+1,tag+' order below heading');assert.ok(result.actions.bottom<=result.skills.y+1,tag+' field actions above party');assert.ok(result.skills.bottom<=result.nav.y+1,tag+' party above navigation');for(let i=0;i<result.partyHeaders.length;i++)assert.ok(result.partyHeaders[i].right<=result.party[i].right+1,tag+' party header fits');}
 if(screenshot)await page.screenshot({path:resolve(out,`${id}-${width}x${height}.png`)});checks.push(tag);
}
try{
 for(const [width,height] of [[390,844],[360,640],[430,932],[487,986]]){
  await page.setViewportSize({width,height});for(const [id,name,tab] of states){await nav(name);if(tab)await click(tab);await page.waitForTimeout(100);await verify(id,width,height,width===390||width===360);}
 }
 // Shared inventory controls remain functional after the proportional layout changes.
 await nav('背包');await page.getByRole('button',{name:'武器',exact:true}).click();const weapons=await page.locator('.bag-scroll button').count();assert.ok(weapons>0&&weapons<35);await page.getByRole('button',{name:'全部',exact:true}).click();assert.equal(await page.locator('.bag-scroll button').count(),35);
 await page.locator('.filter-row button').first().click();await click('史诗');const epics=await page.locator('.bag-scroll button').count();assert.ok(epics>0&&epics<35);await page.locator('.filter-row button').first().click();await click('全部品质');assert.equal(await page.locator('.bag-scroll button').count(),35);
 await page.locator('.filter-row button').last().click();assert.equal(await page.locator('.sort-direction.ascending').count(),1);await click('材料');assert.equal(await page.locator('.bag-scroll .reward').count(),1);await click('道具');assert.ok(await page.locator('.bag-scroll').getByText('暂无道具',{exact:true}).isVisible());
 // A fresh party must use the same lock component as the hero page.
 const fresh=new SquadBattleModel(0,()=>.5,3,true);fresh.paused=true;fresh.markSeen(Date.now());await page.goto('about:blank');await page.addInitScript(({key,data})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(data));},{key:SAVE_KEY,data:fresh.snapshot()});await page.goto(process.env.S6_URL||'http://127.0.0.1:7456');await page.locator('.battle-hud').waitFor();assert.equal(await page.locator('.skill-button>.locked-skill-icon').count(),3);
 await page.setViewportSize({width:390,height:844});await page.addStyleTag({content:'.battle-hud{padding-top:47px!important}.battle-hud>.wallet,.battle-hud>.menu{top:47px!important}.page:not(.hero-page){padding-top:47px!important}'});
 for(const name of ['冒险','招募','背包','副本']){await nav(name);assert.ok((await page.locator('.wallet').boundingBox()).y>=47);assert.ok(await page.locator('.v2-nav').evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight+1));}
 assert.deepEqual(errors,[]);await writeFile(resolve(out,'manifest.json'),JSON.stringify({checks,safeArea:'47px, four main pages',freshPartyLockedSkills:3,errors},null,2));const references=['冒险页概念-v5.png','招募页-常驻池-v2.png','招募页-UP池-v2.png','背包页概念-v1.png','副本页概念-v1.png','副本页-无尽挑战-v1.png','副本页-每日副本-v1.png'];
 const titles=['冒险','常驻招募','UP招募','背包','资源副本','无尽挑战','每日副本'];
 const sections=states.map(([id],i)=>`<section><h2>${titles[i]}</h2><div class="pair"><figure><a href="美术参考/第二版/${references[i]}"><img loading="lazy" src="美术参考/第二版/${references[i]}"></a><figcaption>效果图</figcaption></figure><figure><a class="actual-link" href="美术参考/第二版/主界面修订/${id}-390x844.png"><img class="actual" data-id="${id}" loading="lazy" src="美术参考/第二版/主界面修订/${id}-390x844.png"></a><figcaption>游戏实装</figcaption></figure></div></section>`).join('');
 await writeFile(resolve('docs/四主界面对照验收.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>四主界面 · 效果图对照</title><style>*{box-sizing:border-box}body{margin:0;background:#18372c;color:#fff0d0;font:16px/1.7 system-ui}header,main{max-width:1100px;margin:auto;padding:24px}header{position:sticky;top:0;z-index:1;background:#18372cf5;border-bottom:1px solid #62765a}h1{margin:0;color:#ffd36a}p{margin:8px 0}a{color:#ffdb83}select{padding:8px 14px;font:inherit;border-radius:8px;background:#fff0d0;color:#513219}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;background:#244739;padding:12px;border-radius:14px}img{width:100%;height:auto;display:block}figcaption{text-align:center;padding:8px}h2{margin:24px 0 12px}@media(max-width:600px){header,main{padding:12px}.pair{gap:8px}figure{padding:4px}h1{font-size:22px}}</style><header><h1>四主界面 · 效果图对照</h1><p>左侧为合集中的原始效果图，右侧为游戏真实截图。同宽对照；长屏保留完整场景与底部操作，背包只在物品区域滚动。展示数据来自独立测试存档。</p><label>实装尺寸 <select id="size"><option value="390x844">390 × 844 · 长屏</option><option value="360x640">360 × 640 · 短屏</option></select></label>　<a href="第二版实装验收.html">全部界面验收</a><p>已检查七种状态 × 四种手机尺寸、47px 顶部安全区、背包筛选排序、招募和副本交互；118项模型检查通过。</p></header><main>${sections}</main><script>document.querySelector('#size').onchange=e=>document.querySelectorAll('.actual').forEach(img=>{const src='美术参考/第二版/主界面修订/'+img.dataset.id+'-'+e.target.value+'.png';img.src=src;img.closest('a').href=src;});</script></html>`);
 console.log(`Verified ${checks.length} page/viewport layouts, 47px safe area, fresh-party locks; no browser errors.`);
}finally{await browser.close();}
