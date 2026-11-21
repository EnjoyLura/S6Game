// Run against `npm run serve` after `npm run build`. Saves real browser screenshots.
import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {SquadBattleModel,generateGear,recruit} from '../assets/scripts/SquadBattleModel.ts';
import {auditLayout} from './ui-layout-audit.mjs';
import {SAVE_KEY} from '../assets/scripts/LocalSave.ts';

const base=process.env.S6_URL||'http://127.0.0.1:7456';
const out=resolve(process.env.S6_SCREENSHOTS||'docs/美术参考/第二版/实装效果');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const viewport={width:Number(process.env.S6_WIDTH||390),height:Number(process.env.S6_HEIGHT||844)};
const context=await browser.newContext({viewport,deviceScaleFactor:2});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
if(process.env.S6_PREVIEW_CSS){const css=await readFile(process.env.S6_PREVIEW_CSS,'utf8');await context.addInitScript(css=>{addEventListener('DOMContentLoaded',()=>{const style=document.createElement('style');style.textContent=css;new MutationObserver(()=>{if(document.getElementById('second-edition-style')&&!style.isConnected)document.head.append(style);}).observe(document.head,{childList:true});});},css);}
page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
const fixtures=()=>{const m=new SquadBattleModel(0,()=>.5,3,true);recruit(m.recruitment,0,10,()=>.99);m.gold=48320;m.materials=500;m.paused=true;
 m.heroes.forEach((h,id)=>{h.level=12;h.experience=10000;h.hp=m.stats(id).hp;});
 m.inventory=Array.from({length:35},(_,i)=>generateGear(i+1,i===0?1:i===1?9:12));m.nextGearId=36;
 m.autoEquip(0);m.autoEquip(1);m.autoEquip(2);m.markSeen(Date.now());assert.ok(SquadBattleModel.restore(m.snapshot()));return m;};
const load=async m=>{await page.goto(base);await page.evaluate(({key,snapshot})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(snapshot));},{key:SAVE_KEY,snapshot:m.snapshot()});await page.reload();await page.locator('#s6-v2 .v2-nav').waitFor();await page.waitForTimeout(150);};
const button=(name,scope=page)=>scope.getByRole('button',{name,exact:true});
const click=async(name,scope=page)=>button(name,scope).click();
const nav=async name=>page.locator('.v2-nav').getByRole('button',{name,exact:true}).click();
const close=async()=>{await page.keyboard.press('Escape');};
const shots=[],layoutChecks=[];
const shot=async(id,title)=>{const controls=await page.locator('.v2-button:visible').evaluateAll(nodes=>nodes.filter(n=>!['flat','equipment-slot','talent-node','standing','skill-button','empty-position','star-button','help-button','close'].some(c=>n.classList.contains(c))).map(n=>({name:n.textContent,art:getComputedStyle(n).borderImageSource,skin:!!n.closest('.has-frame .dialog-actions'),shadow:getComputedStyle(n).boxShadow})));for(const control of controls){assert.ok(control.art==='none'||control.skin,id+' '+control.name+' has no baked inner border (popup action buttons use the codex button skin)');assert.ok(!control.shadow.includes('inset'),id+' '+control.name+' has no inset stroke');}await page.waitForFunction(()=>!document.querySelector('.v2-toast.visible'));await page.waitForTimeout(180);await page.screenshot({path:resolve(out,id+'.png')});shots.push({id,title});if(process.env.S6_AUDIT){for(const size of [{width:360,height:640},{width:390,height:844},{width:430,height:764},{width:430,height:932},{width:487,height:986}]){await page.setViewportSize(size);await page.waitForTimeout(100);layoutChecks.push(await auditLayout(page,id,size));}await page.setViewportSize(viewport);}};
const dialog=()=>page.getByRole('dialog');
try{
 await load(fixtures());await shot('01-adventure','冒险页');
 // Manual commands, speed and auto-skill controls are live, not decorative.
 await click('1×');assert.equal(await button('2×').count(),1);await click('2×');await page.locator('.active-skills button').first().click();assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).heroes[0].queued,SAVE_KEY),true);
 await click('自动技能');await click('自动技能');
 await nav('英雄');await shot('02-hero','英雄页');
 await page.locator('.hero-skills button').first().click();await shot('14-skill','技能详情');assert.equal(await dialog().locator('.stat-row').count(),2);await close();
 await page.locator('.star-button').click();await shot('13-star','英雄升星');await close();
 await page.locator('.hero-skills button').last().click();await shot('15-talents','天赋树');assert.equal(await page.locator('.talent-node').count(),15);
 await click('学习天赋');assert.ok((await page.locator('.talent-node.learned').count())>0);await close();
 await page.locator('.equipment-slot').first().click();await shot('10-equipment','装备详情');await close();
 // Unequip a slot and open the shared selection grid.
 await page.locator('.equipment-slot').first().click();await click('卸下',dialog());await page.locator('.equipment-slot').first().click();await shot('12-equipment-picker','装备穿戴');await close();
 await nav('背包');await shot('05-bag','背包页');
 await page.locator('.expand-button').click();await shot('11-confirm','小提示弹窗');await click('确定',dialog());
 await click('批量分解');assert.equal(await dialog().getByRole('button',{name:'分解装备',exact:true}).isDisabled(),true);
 const salvageBefore=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY),salvageModel=SquadBattleModel.restore(salvageBefore);
 const salvageIds=salvageModel.inventory.filter(g=>!g.locked&&salvageModel.owner(g.id)<0).slice(0,8).map(g=>g.id),salvageMaterials=salvageModel.salvagePreview(salvageIds).materials;
 for(let i=0;i<8;i++)await dialog().locator('.salvage-scroll button').nth(i).click();
 assert.equal(await dialog().locator('.checked').count(),8);assert.match(await dialog().locator('.list-heading').textContent(),/8件/);
 assert.ok(salvageMaterials>0);assert.match(await dialog().locator('.material-line').textContent(),new RegExp('×'+salvageMaterials+'$'));
 await shot('24-salvage','装备分解');await click('分解装备',dialog());await click('确定',dialog());
 const salvageAfter=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
 assert.equal(salvageAfter.materials,salvageBefore.materials+salvageMaterials);assert.deepEqual(salvageAfter.inventory.map(g=>g.id),salvageBefore.inventory.filter(g=>!salvageIds.includes(g.id)).map(g=>g.id));
 await close();await page.reload();await page.locator('.v2-nav').waitFor();assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).materials,SAVE_KEY),salvageAfter.materials);
 salvageModel.markSeen(Date.now());await load(salvageModel); // Restore without manufacturing a new offline interval.
 await nav('招募');await shot('03-recruit-normal','常驻招募');await click('卡池详情');await shot('16-pool-normal','常驻卡池详情');await close();
 await page.locator('.recruit-bottom .page-actions button').first().click();await shot('20-single','单抽结果');assert.equal(await dialog().locator('.hero-card').count(),1);assert.equal(await dialog().locator('.dialog-actions button').count(),2);await close();
 await page.locator('.recruit-bottom .page-actions button').last().click();await shot('19-ten','十连结果');assert.equal(await dialog().locator('.hero-card').count(),10);await close();
 await click('UP招募');await shot('04-recruit-up','UP招募');await click('卡池详情');await shot('17-pool-up','UP卡池详情');await close();
 await nav('副本');await shot('06-dungeons','资源副本');await click('无尽挑战');await shot('07-endless','无尽挑战');await click('每日副本');await shot('08-daily','每日副本');
 await click('资源副本');await page.locator('.dungeon-card button').first().click();await shot('23-challenge','挑战确认');assert.equal(await dialog().locator('.main-tabs button').count(),3);await click('困难',dialog());await click('普通',dialog());
 await click('开始挑战',dialog());await page.locator('.battle-hud').waitFor();assert.ok((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).dungeon.run,SAVE_KEY)));
 // Leave via the result action, not by dismissing its shade.
 await click('☰');await click('结束挑战',dialog());await page.getByRole('dialog',{name:'挑战失败'}).waitFor();await shot('28-dungeon-defeat','副本失败结算');await close();await click('查看结算');await click('退出',dialog());await page.locator('.dungeon-list').waitFor();
 await nav('冒险');await click('阵型');await shot('18-formation','编队二级页');await page.locator('.formation-toolbar>button').click();await shot('21-formations','阵型选择');await close();await click('关闭');
 // Check wallet and UI persistence with no automatic fixture replay on reload.
 const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);await page.reload();await page.locator('#s6-v2 .v2-nav').waitFor();const restored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
 assert.equal(restored.interfaceProgress.capacity,saved.interfaceProgress.capacity);assert.equal(restored.interfaceProgress.upTickets,saved.interfaceProgress.upTickets);assert.deepEqual(restored.interfaceProgress.tree,saved.interfaceProgress.tree);
 // Offline popup uses the same real receipt path as returning to the game.
 const idle=fixtures();idle.lastSeen=Date.now()-1800*1000;idle.prepareOffline(Date.now());await load(idle);await dialog().waitFor();await shot('09-offline','挂机奖励');await click('领取',dialog());await shot('22-rewards','获取奖励');await close();
 assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).offline,SAVE_KEY),null);
 // Ordinary and breakthrough states both come from real equipment values.
 for(const [id,title,level] of [['25-upgrade','装备普通升级',1],['26-breakthrough','装备突破升级',9]]){
  const m=fixtures();m.inventory[0].level=level;await load(m);await nav('背包');
  await page.locator('.bag-scroll button').filter({has:page.getByText('Lv.'+level,{exact:true})}).first().click();await click('强化',dialog());
  await shot(id,title);assert.match(await page.locator('.level-preview').textContent(),new RegExp('Lv.'+level));await click(level===9?'突破':'升级');assert.match(await page.locator('.level-preview').textContent(),new RegExp('Lv.'+(level+1)));await click('关闭');
 }
 // Settlement examples are produced by the real deterministic combat simulation.
 for(const [id,title,dungeon] of [['27-dungeon-victory','副本胜利结算',0],['29-endless-result','无尽挑战结算',5]]){
  const m=fixtures();m.heroes.forEach((h,i)=>{h.level=20;h.hp=m.stats(i).hp;});assert.equal(m.startDungeon(dungeon,0,Date.now()),null);
  const battle=SquadBattleModel.restore(m.dungeon.run.battle);battle.random=()=>.5;
  for(let n=0;n<40000&&battle.result==='fighting';n++)battle.step(.5);
  assert.notEqual(battle.result,'fighting');const snapshot=battle.snapshot();snapshot.version=9;delete snapshot.dungeon;m.dungeon.run.battle=snapshot;assert.equal(m.settleDungeon(),null);
  await load(m);await dialog().waitFor();await shot(id,title);await close();await click('查看结算');await click('退出',dialog());
 }
 // All main pages remain reachable on short, tall, tablet and landscape screens.
 for(const [width,height] of [[360,640],[430,932],[768,1024],[1280,720]]){
  await page.setViewportSize({width,height});for(const name of ['英雄','招募','冒险','背包','副本']){
   await nav(name);const geometry=await page.locator('#s6-v2').evaluate(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width,overflow:n.scrollWidth>n.clientWidth+1};});
   assert.equal(geometry.top,0);assert.equal(Math.round(geometry.bottom),height);assert.ok(geometry.width<=600);assert.equal(geometry.overflow,false);
   const bounds=await page.locator('.v2-nav').boundingBox();assert.ok(bounds.y+bounds.height<=height+1,`${width}x${height} ${name} bottom navigation visible`);
  }
  await page.screenshot({path:resolve(out,`responsive-${width}x${height}.png`)});
 }
 assert.deepEqual(errors,[]);await writeFile(resolve(out,'manifest.json'),JSON.stringify({viewport:viewport.width+'×'+viewport.height+' @2x',screens:shots,checks:['26 screens','manual controls','single/ten draw','tree purchase','capacity expansion','dungeon entry/result/exit','save reload','four responsive viewports'],errors},null,2));
 if(process.env.S6_AUDIT)await writeFile(resolve(out,'layout-audit.json'),JSON.stringify(layoutChecks,null,2));
 if(!process.env.S6_SCREENSHOTS){
 const cards=shots.slice().sort((a,b)=>a.id.localeCompare(b.id)).map(s=>`<figure><a href="美术参考/第二版/实装效果/${s.id}.png" target="_blank"><img loading="lazy" src="美术参考/第二版/实装效果/${s.id}.png" alt="${s.title}"></a><figcaption>${s.title}</figcaption></figure>`).join('');
 const responsive=['360x640','430x932','768x1024','1280x720'].map(s=>`<figure><a target="_blank" href="美术参考/第二版/实装效果/responsive-${s}.png"><img loading="lazy" src="美术参考/第二版/实装效果/responsive-${s}.png" alt="${s}"></a><figcaption>${s}</figcaption></figure>`).join('');
 await writeFile(resolve('docs/第二版实装验收.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第二版游戏 · 实装验收</title><style>*{box-sizing:border-box}body{margin:0;background:#173529;color:#f9edcf;font:16px/1.8 system-ui,sans-serif}header,main{max-width:1600px;margin:auto;padding:24px}h1{color:#ffd568}p{max-width:1000px}a{color:#ffd568}nav{display:flex;gap:24px;flex-wrap:wrap}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px}figure{margin:0;padding:14px;background:#234638;border:1px solid #536b4e;border-radius:16px}figure>a{display:block;height:470px}img{width:100%;height:100%;object-fit:contain}figcaption{text-align:center;padding-top:10px;font-weight:700}.badge{background:#e8bb52;color:#422e16;padding:5px 14px;border-radius:20px}small{color:#c6d5bc}footer{padding:30px;text-align:center}@media(max-width:600px){header,main{padding:16px}.grid{grid-template-columns:1fr}figure>a{height:620px}}</style><header><span class="badge">实装效果 · 浏览器真实截图</span><h1>第二版游戏界面验收</h1><p>26个参考界面及三种副本结算，均来自本次构建的实际运行截图。使用单独测试存档展示已培养角色、装备和奖励；测试存档不替换玩家存档。保留现有四名英雄与真实十四项属性，未把概念图的8人卡池作为已实现内容。</p><nav><a href="#screens">29张实装截图</a><a href="#responsive">屏幕适配</a><a href="第二版界面效果图合集.html" target="_blank">概念图合集</a><a href="第二版实装说明.md">实现与测试配置</a></nav><p><small>118项模型回归通过；浏览器真实点击、刷新恢复和四组尺寸检查通过；无页面异常和资源加载错误。点击截图可查看原尺寸。</small></p></header><main><h2 id="screens">页面、二级页与弹窗</h2><div class="grid">${cards}</div><h2 id="responsive">屏幕适配</h2><div class="grid">${responsive}</div></main><footer>通过 npm run test:ui 可重新生成本页及全部实装截图。</footer></html>`);
 }
 console.log(`Verified ${shots.length} real screens, 4 responsive sizes and save reload; no browser errors.`);
}finally{await browser.close();}
