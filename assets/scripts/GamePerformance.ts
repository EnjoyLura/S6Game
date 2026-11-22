type Metric = 'frame'|'click'|'handler'|'battle'|'hud';
type Sample = {time:number;ms:number;screen:string;action?:string};
const limit = 2400;

class Samples {
 private cursor=0;
 private values:Sample[]=[];
 add(value:Sample){
  this.values[this.cursor]=value;
  this.cursor=(this.cursor+1)%limit;
 }
 read(){return this.values.length<limit?this.values.slice():this.values.slice(this.cursor).concat(this.values.slice(0,this.cursor));}
}

/** Session-only profiler. When off, there is no RAF loop or sample allocation. */
export class GamePerformance {
 enabled=false;
 private buffer=this.newBuffer();
 private generation=0;
 private request=0;
 private lastFrame=0;
 private lastDisplay=0;
 private started=0;
 private overlay:HTMLElement|null=null;

 constructor(private screen:()=>string){}

 private newBuffer(){return {frame:new Samples(),click:new Samples(),handler:new Samples(),battle:new Samples(),hud:new Samples()};}

 record(metric:Metric,ms:number,screen=this.screen(),action?:string){
  if(this.enabled&&Number.isFinite(ms)&&ms>=0)this.buffer[metric].add({time:performance.now()-this.started,ms,screen,action});
 }

 measureClick(event:MouseEvent,button:HTMLElement,action:()=>void){
  if(!this.enabled){action();return;}
  const label=(button.getAttribute('aria-label')||button.textContent||'按钮').trim().slice(0,60);
  const before=performance.now(), generation=this.generation;
  action();
  const screen=this.screen();
  this.record('handler',performance.now()-before,screen,label);
  requestAnimationFrame(()=>requestAnimationFrame(time=>{
   if(generation===this.generation&&!document.hidden)this.record('click',time-event.timeStamp,screen,label);
  }));
 }

 toggle(){
  if(this.enabled){this.stop();return;}
  this.enabled=true;
  this.buffer=this.newBuffer();
  this.started=performance.now();
  this.lastDisplay=0;
  this.overlay=document.createElement('output');
  this.overlay.className='s6-performance-overlay';
  this.overlay.setAttribute('aria-hidden','true');
  this.overlay.textContent='正在采样…';
  document.body.appendChild(this.overlay);
  document.addEventListener('visibilitychange',this.resetFrame);
  this.request=requestAnimationFrame(this.frame);
 }

 stop(){
  this.enabled=false;
  this.generation++;
  this.lastFrame=0;
  cancelAnimationFrame(this.request);
  document.removeEventListener('visibilitychange',this.resetFrame);
  this.overlay?.remove();
  this.overlay=null;
 }

 get hasSamples(){return this.buffer.frame.read().length>0||this.buffer.handler.read().length>0;}
 private resetFrame=()=>{this.lastFrame=0;};

 private frame=(time:number)=>{
  if(document.hidden){this.lastFrame=0;}
  else {
   if(this.lastFrame)this.record('frame',time-this.lastFrame);
   this.lastFrame=time;
   if(time-this.lastDisplay>=1000){
    this.lastDisplay=time;
    const frames=this.buffer.frame.read().filter(sample=>sample.time>=time-this.started-1000).map(sample=>sample.ms).sort((a,b)=>a-b);
    const lastClick=this.buffer.click.read().slice(-1)[0]?.ms;
    const p95=frames[Math.ceil(frames.length*.95)-1];
    if(this.overlay&&frames.length)this.overlay.textContent=`${frames.length} FPS · 帧 P95 ${p95.toFixed(1)} ms${lastClick===undefined?'':` · 点击 ${lastClick.toFixed(0)} ms`}`;
   }
  }
  this.request=requestAnimationFrame(this.frame);
 };

 export(){
  const {frame,click,handler,battle,hud}=this.buffer;
  const samples={frame:frame.read(),click:click.read(),handler:handler.read(),battle:battle.read(),hud:hud.read()};
  const report={viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},samples};
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;link.download='s6-performance.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
}
