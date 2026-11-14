import {ModalView,modalIcon,modalButton,modalImage,modalPanel,modalRow,modalSection} from './ModalView';
import {SquadBattleModel} from './SquadBattleModel';
import {recruit,RECRUIT_CONFIG,RECRUIT_HEROES,RecruitResult} from './SquadBattleModel';
import {Node,UITransform,Layers,Graphics,Color,Label,Sprite,SpriteFrame,Texture2D,Rect,BlockInputEvents} from 'cc';
import {drawNavigation} from './GearView';
export class RecruitPage {
 readonly node:Node; private content!:Node; private modal:Node|null=null; private pool=0;
 constructor(parent:Node,private art:Texture2D,private heroAtlas:Texture2D,private bagAtlas:Texture2D,private navigate:(page:'hero'|'adventure'|'bag')=>void,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null,private heroTextures:Texture2D[]){this.node=this.base(parent,'Recruit page',0,0,887,1774);this.render();this.node.active=false;}
 private base(p:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.parent=p;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
 private panel(p:Node,x:number,y:number,w:number,h:number,color='#FFF4E3',r=28){const n=this.base(p,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
 private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=30,color='#704124'){const l=this.base(p,t,x,y,w,h).addComponent(Label);l.string=t;l.fontFamily='Microsoft YaHei';l.fontSize=size;l.lineHeight=size*1.4;l.isBold=true;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
 private button(p:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,active=false){const n=this.panel(p,x,y,w,h,active?'#FFCE52':'#FFF4E3');this.text(n,t,0,0,w-20,h-10,31);n.on(Node.EventType.TOUCH_END,fn);return n;}
 private image(p:Node,r:Rect,x:number,y:number,w:number,h:number){const n=this.base(p,'Recruit illustration',x,y,w,h),f=new SpriteFrame();f.texture=this.art;f.rect=r;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;return n;}
 private close(){this.modal?.destroy();this.modal=null;}
 private card(title:string,height=1100){this.close();const view=new ModalView(this.node,title,height,()=>this.close());this.modal=view.layer;return view.card;}
 private info(title:string,body:string){const p=this.card(title,860);modalIcon(p,4,0,140,90);this.text(p,body,0,-80,680,320,28);}
 private results(rows:RecruitResult[],history=false){
   if(!rows.length){this.info('招募结果','暂无招募记录');return;}
   const p=this.card(history?'招募记录':'招募结果',1160);
   this.text(p,(history?'最近':'本次获得 ')+rows.length+' 名英雄',0,355,680,50,30);
   rows.slice(-10).forEach((r,i)=>{const x=-280+i%5*140,y=205-Math.floor(i/5)*250,n=modalPanel(p,x,y,126,160,['#6DBCE7','#C18BE1','#FFDA68'][r.rarity],18),t=this.heroTextures[r.hero];
     modalImage(n,t,new Rect(0,0,t.width,t.height),0,20,115,115);this.text(n,RECRUIT_HEROES[r.hero],0,-48,122,38,23);
     this.text(p,['稀有','史诗','传说'][r.rarity],x,y-106,130,35,22);this.text(p,r.fresh?'新获得':'重复 +1',x,y-145,134,35,22,r.fresh?'#BB662D':'#906C49');
   });
   this.text(p,'招募券剩余 '+this.model().recruitment.tickets,0,-285,680,45,28);
   if(!history)modalButton(p,'再招募十次 · 10券',0,-450,420,80,()=>this.draw(10));
 }
 private poolDetails(){
   const p=this.card('卡池详情',1210),r=this.model().recruitment,progress=r.pity[this.pool];
   ['常驻池','UP池'].forEach((t,i)=>modalButton(p,t,-170+i*340,350,300,60,()=>{this.pool=i;this.render();this.poolDetails();},i===this.pool?'gold':'peach'));
   this.text(p,this.pool?'本期UP：法师':'常驻池 · 四职业等概率',0,260,680,60,32);
   modalSection(p,'抽取概率',175);['稀有','史诗','传说'].forEach((t,i)=>modalRow(p,'✦',t,['75%','20%','5%'][i],105-i*60));
   modalSection(p,'保底进度',-100);modalRow(p,'✦','史诗保底',progress.epic+' / 10',-167);modalRow(p,'★','传说保底',progress.legend+' / 30',-227);
   this.text(p,(this.pool?'UP池传说必得法师，其他品质法师62.5%。':'常驻四职业等概率。')+'\n两池保底独立，单抽与十连累计本池进度。\n10抽至少史诗，30抽必出传说；出货重置。',0,-365,680,140,24);
 }
 private draw(n:number){const error=this.mutate(b=>recruit(b.recruitment,this.pool,n));if(error){this.info('招募未完成',error);return;}this.render();this.results(this.model().recruitment.last);}
 private hit(p:Node,name:string,x:number,y:number,w:number,h:number,fn:()=>void){const n=this.base(p,name,x,y,w,h);n.on(Node.EventType.TOUCH_END,fn);return n;}
 private render(){this.content?.destroy();const p=this.content=this.base(this.node,'Recruit content',0,0,887,1774),r=this.model().recruitment,progress=r.pity[this.pool];
 // Full reference composition; replace example counters with live UI and use explicit touch targets.
 this.image(p,new Rect(this.pool?901:330,4,544,880),0,0,887,1774);
 this.panel(p,-130,810,240,80);this.text(p,'券 '+r.tickets,-130,810,200,55,30);
 ['常驻招募','限时UP'].forEach((t,i)=>this.hit(p,t,-165+i*360,664,350,100,()=>{if(this.pool!==i){this.pool=i;this.render();}}));
 if(this.pool){this.panel(p,331,465,192,55);this.text(p,'测试UP池',331,465,185,48,24);}
 this.panel(p,28,-225,450,38,'#C3B4A4',18);
 if(progress.legend){const w=450*progress.legend/RECRUIT_CONFIG.legendPity;this.panel(p,28-225+w/2,-225,w,38,'#FFC84A',Math.min(18,w/2));}
 this.text(p,progress.legend+' / '+RECRUIT_CONFIG.legendPity+' · 传说保底',28,-225,450,48,25);
 this.text(p,'累计 '+progress.total+' 次 · 再'+(10-progress.epic)+'次至少史诗',0,-280,800,42,24);
 this.hit(p,'心愿英雄',-240,-334,330,100,()=>this.info('心愿英雄','本轮未启用心愿加成。\nUP池主题英雄：法师。\n可在卡池详情查看测试概率。'));
 this.hit(p,'卡池详情',84,-334,230,100,()=>this.poolDetails());
 this.hit(p,'招募记录',306,-334,210,100,()=>{const rows=r.history.filter(x=>x.pool===this.pool).slice(-10);this.results(rows,true);});
 this.hit(p,'上次结果',337,-224,115,95,()=>this.results(r.last));
 [1,10].forEach((n,i)=>this.hit(p,'招募'+n+'次',-210+i*420,-620,395,130,()=>this.draw(n)));
 this.text(p,'测试配置 · 10抽至少史诗 / 30抽传说',0,-705,810,36,22);
 this.panel(p,0,-800,887,174,'#F8E6CF',0);
 drawNavigation(p,this.heroAtlas,this.bagAtlas,1,i=>{if(i===0)this.navigate('hero');else if(i===2)this.navigate('adventure');else if(i===3)this.navigate('bag');else if(i===4)this.info('副本','此功能尚未开放。');});
 }
}
