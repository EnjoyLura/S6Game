import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {auditLayout} from './ui-layout-audit.mjs';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
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
   checks++;
  }
 }
 assert.deepEqual(errors,[]);
 console.log(`Verified ${checks} formation/viewport combinations: all four previews, names, rate labels and stage characters stay separate.`);
}finally{await browser.close();}
