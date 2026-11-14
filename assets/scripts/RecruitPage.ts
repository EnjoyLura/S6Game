import {SquadBattleModel} from './SquadBattleModel';
import {recruit,RECRUIT_CONFIG,RECRUIT_HEROES,RecruitResult} from './SquadBattleModel';
import {Node,UITransform,Layers,Graphics,Color,Label,Sprite,SpriteFrame,Texture2D,Rect,BlockInputEvents} from 'cc';
import {drawNavigation} from './GearView';
export class RecruitPage {
 readonly node:Node; private content!:Node; private modal:Node|null=null; private pool=0;
 constructor(parent:Node,private art:Texture2D,private heroAtlas:Texture2D,private bagAtlas:Texture2D,private navigate:(page:'hero'|'adventure'|'bag')=>void,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null){this.node=this.base(parent,'Recruit page',0,0,887,1774);this.render();this.node.active=false;}
 private base(p:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.parent=p;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
 private panel(p:Node,x:number,y:number,w:number,h:number,color='#FFF4E3',r=28){const n=this.base(p,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
 private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=30,color='#704124'){const l=this.base(p,t,x,y,w,h).addComponent(Label);l.string=t;l.fontFamily='Microsoft YaHei';l.fontSize=size;l.lineHeight=size*1.4;l.isBold=true;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
 private button(p:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,active=false){const n=this.panel(p,x,y,w,h,active?'#FFCE52':'#FFF4E3');this.text(n,t,0,0,w-20,h-10,31);n.on(Node.EventType.TOUCH_END,fn);return n;}
 private image(p:Node,r:Rect,x:number,y:number,w:number,h:number){const n=this.base(p,'Recruit illustration',x,y,w,h),f=new SpriteFrame();f.texture=this.art;f.rect=r;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;return n;}
 private close(){this.modal?.destroy();this.modal=null;}
 private info(title:string,body:string){this.close();const m=this.base(this.node,'Recruit modal',0,0,887,1774);this.modal=m;m.addComponent(BlockInputEvents);const g=m.addComponent(Graphics);g.fillColor=new Color(35,24,12,165);g.rect(-444,-887,888,1774);g.fill();m.on(Node.EventType.TOUCH_END,()=>this.close());const p=this.panel(m,0,0,790,1000);p.addComponent(BlockInputEvents);p.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);this.text(p,title,-20,425,620,65,38);this.button(p,'×',330,425,65,65,()=>this.close());this.text(p,body,0,-15,680,740,28);this.text(m,'点击空白处关闭',0,-565,700,55,27,'#FFF5E5');}
 private results(rows:RecruitResult[]){this.info('招募结果',rows.length?rows.map(r=>RECRUIT_HEROES[r.hero]+' · '+['稀有','史诗','传说'][r.rarity]+(r.fresh?' · 新英雄':' · 持有份数+1')).join('\n'):'暂无招募记录');}
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
 this.hit(p,'卡池详情',84,-334,230,100,()=>this.info('测试卡池规则','每次1券；十连10券，逐抽累计保底。\n稀有75% / 史诗20% / 传说5%。\n10抽至少史诗，30抽必出传说；出货重置对应计数。\n两池保底独立。常驻四职业等概率。\nUP传说必为法师，其他品质法师62.5%。\n重复英雄累计份数。初始赠送60券，仅一次。'));
 this.hit(p,'招募记录',306,-334,210,100,()=>{const rows=r.history.filter(x=>x.pool===this.pool).slice(-10);this.results(rows);});
 this.hit(p,'上次结果',337,-224,115,95,()=>this.results(r.last));
 [1,10].forEach((n,i)=>this.hit(p,'招募'+n+'次',-210+i*420,-620,395,130,()=>this.draw(n)));
 this.text(p,'测试配置 · 10抽至少史诗 / 30抽传说',0,-705,810,36,22);
 this.panel(p,0,-800,887,174,'#F8E6CF',0);
 drawNavigation(p,this.heroAtlas,this.bagAtlas,1,i=>{if(i===0)this.navigate('hero');else if(i===2)this.navigate('adventure');else if(i===3)this.navigate('bag');else if(i===4)this.info('副本','此功能尚未开放。');});
 }
}
