// Actual browser: cold/warm boot, art failure, corrupt cache, blocked storage, updates and subpaths.
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base=process.env.S6_URL||'http://127.0.0.1:7456/';
const out=resolve('docs/美术参考/第二版/启动加载');await mkdir(out,{recursive:true});
const manifest=JSON.parse(await readFile('build/web-mobile/art-manifest.json','utf8'));
const held=manifest.files.filter(f=>f.path.startsWith('assets/')).at(-1);
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(String(e)));
await context.addInitScript(()=>{
 window.startupProgress=[];
 new MutationObserver(()=>{const bar=document.getElementById('boot-progress');if(!bar)return;const value=Number(bar.getAttribute('aria-valuenow'));if(window.startupProgress.at(-1)?.value!==value)window.startupProgress.push({value,loaded:window.S6Boot?.stats.loaded,total:window.S6Boot?.stats.total,game:!!document.querySelector('.v2-nav')});}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-valuenow']});
});
const done=async p=>{await p.waitForFunction(()=>!document.querySelector('#s6-boot'),{},{timeout:60000});await p.locator('.v2-nav').waitFor();return p.evaluate(()=>window.S6Boot.stats);};
try{
 let release;const gate=new Promise(r=>release=r);
 await page.route('**/'+held.path+'?*',async route=>{await gate;await route.continue();});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(total=>window.S6Boot?.stats.loaded===total-1,manifest.files.length);
 assert.equal(await page.locator('.v2-nav').count(),0,'cannot enter while ANY art file is pending');
 const p=Number(await page.locator('#boot-progress').getAttribute('aria-valuenow'));assert.ok(p>0&&p<100);
 for(const [width,height] of [[360,640],[390,844],[430,932],[900,700]]){
  await page.setViewportSize({width,height});
  const layout=await page.evaluate(()=>{const sel=s=>document.querySelector(s).getBoundingClientRect();return {title:sel('.boot-title').bottom,party:sel('.boot-party').top,feet:sel('.boot-party').bottom,copy:sel('.boot-bottom').top,bottom:sel('.boot-bottom').bottom,height:innerHeight};});
  assert.ok(layout.title<layout.party&&layout.feet<layout.copy&&layout.bottom<=height,'startup content must not overlap');
  await page.screenshot({path:resolve(out,`加载中-${width}x${height}.png`)});
 }
 release();const cold=await done(page);assert.equal(cold.loaded,cold.total);assert.equal(cold.downloads,cold.total);checks.push({name:'cold-complete',stats:cold});
 const progressSamples=await page.evaluate(()=>window.startupProgress);assert.ok(progressSamples.every((s,i)=>!i||s.value>=progressSamples[i-1].value),'progress is monotonic');
 assert.ok(progressSamples.some(s=>s.value===100&&s.loaded===s.total&&s.game),'100% requires art and game UI');
 assert.equal(await page.locator('#s6-v2 img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).length),0,'visible UI has no missing images');
 await page.unroute('**/'+held.path+'?*');await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:resolve(out,'加载完成-390x844.png')});
 const imageRequests=[];page.on('request',r=>{if(/\.(png|webp)(\?|$)/.test(r.url()))imageRequests.push(r.url());});
 await page.reload({waitUntil:'domcontentloaded'});const warm=await done(page);
 assert.equal(warm.cacheHits,warm.total);assert.equal(warm.downloads,0);assert.equal(imageRequests.length,0,'warm startup must not download art twice');checks.push({name:'warm-no-image-network',stats:warm});
 // Corrupt exactly one entry: only that image should be downloaded again.
 await page.evaluate(async()=>{const name=(await caches.keys()).find(n=>n.startsWith('s6-art-v1:'));const c=await caches.open(name);const keys=await c.keys();await c.put(keys[0],new Response('corrupt'));});
 await page.reload({waitUntil:'domcontentloaded'});const repaired=await done(page);assert.equal(repaired.downloads,1);checks.push({name:'corrupt-cache-repaired',stats:repaired});
 // Changing one content hash invalidates only one image, even with the same path.
 const nextHTML=await readFile('build/web-mobile/index.html','utf8');
 const replacement=Buffer.concat([await readFile(resolve('build/web-mobile',held.path)),Buffer.from('\n')]);
 const changed=structuredClone(manifest);const changedFile=changed.files.find(f=>f.path===held.path);
 Object.assign(changedFile,{bytes:replacement.length,sha256:createHash('sha256').update(replacement).digest('hex')});
 changed.bytes=changed.files.reduce((n,f)=>n+f.bytes,0);changed.version='test-next-release';
 await page.route(base,route=>route.fulfill({contentType:'text/html',body:nextHTML.replace(/(<script id="s6-art-manifest" type="application\/json">)[\s\S]*?(<\/script>)/,'$1'+JSON.stringify(changed)+'$2')}));
 await page.route('**/'+held.path+'?*',route=>route.fulfill({contentType:held.mime,body:replacement}));
 await page.reload({waitUntil:'domcontentloaded'});const updated=await done(page);assert.equal(await page.evaluate(()=>window.S6Boot.version),'test-next-release');assert.equal(updated.downloads,1);checks.push({name:'changed-content-hash',stats:updated});
 await page.unrouteAll();
 // Fresh cache + unavailable art stays on the retry screen, never shows the game.
 const failure=await browser.newContext();const fp=await failure.newPage();let block=true;
 await fp.route('**/'+held.path+'?*',route=>block?route.abort():route.continue());
 await fp.goto(base,{waitUntil:'domcontentloaded'});await fp.locator('#boot-retry').waitFor();assert.equal(await fp.locator('.v2-nav').count(),0);
 await fp.screenshot({path:resolve(out,'加载失败.png')});block=false;
 await fp.getByRole('button',{name:'重新加载'}).click();const retried=await done(fp);assert.equal(retried.loaded,retried.total);checks.push({name:'failure-retry',stats:retried});await failure.close();
 // Private mode / storage disabled falls back to verified network art.
 const noCache=await browser.newContext();await noCache.addInitScript(()=>Object.defineProperty(window,'caches',{value:{open:()=>Promise.reject(new Error('storage disabled'))}}));
 const np=await noCache.newPage();await np.goto(base,{waitUntil:'domcontentloaded'});const fallback=await done(np);assert.equal(fallback.cacheAvailable,false);assert.equal(fallback.downloads,fallback.total);checks.push({name:'storage-unavailable',stats:fallback});await noCache.close();
 const quota=await browser.newContext();await quota.addInitScript(()=>{Cache.prototype.put=()=>Promise.reject(new DOMException('full','QuotaExceededError'));});
 const qp=await quota.newPage();await qp.goto(base,{waitUntil:'domcontentloaded'});const full=await done(qp);assert.equal(full.cacheAvailable,false);assert.equal(full.loaded,full.total);checks.push({name:'storage-full',stats:full});await quota.close();
 // Root entry + release <base>, as produced by GitHub Pages publishing.
 const sub=await browser.newContext();const sp=await sub.newPage();const origin=new URL(base).origin;
 await sp.route(origin+'/test-game/**',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname==='/test-game/')return route.fulfill({contentType:'text/html',body:nextHTML.replace('<head>','<head><base href="./releases/test/">')});
  const relative=url.pathname.replace('/test-game/releases/test/','');
  const response=await route.fetch({url:new URL(relative+url.search,base).href});return route.fulfill({response});
 });
 await sp.goto(origin+'/test-game/',{waitUntil:'domcontentloaded'});const nested=await done(sp);assert.equal(nested.loaded,nested.total);assert.ok(await sp.evaluate(async()=>(await caches.keys()).includes('s6-art-v1:/test-game/')));checks.push({name:'github-pages-release-subpath',stats:nested});await sub.close();
 assert.deepEqual(errors,[]);await writeFile(resolve(out,'manifest.json'),JSON.stringify({checks,progressSamples,errors},null,2));
 console.log('Verified startup: all art gate, 4 sizes, zero warm art requests, cache repair/version changes, failure/retry, storage fallback and release subpaths.');
}finally{await browser.close();}
