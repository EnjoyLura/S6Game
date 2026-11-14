import {Node,UITransform,Layers,Graphics,Color,Label,Sprite,SpriteFrame,Texture2D,Rect,BlockInputEvents} from 'cc';
import {drawNavigation} from './GearView';
export class RecruitPage {
 readonly node:Node; private content!:Node; private modal:Node|null=null; private pool=0;
 constructor(parent:Node,private art:Texture2D,private heroAtlas:Texture2D,private bagAtlas:Texture2D,private navigate:(page:'hero'|'adventure'|'bag')=>void){this.node=this.base(parent,'Recruit page',0,0,887,1774);this.render();this.node.active=false;}
 private base(p:Node,name:string,x:number,y:number,w:number,h:number){const n=new Node(name);n.parent=p;n.layer=Layers.Enum.UI_2D;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(w,h);return n;}
 private panel(p:Node,x:number,y:number,w:number,h:number,color='#FFF4E3',r=28){const n=this.base(p,'Panel',x,y,w,h),g=n.addComponent(Graphics);g.fillColor=new Color().fromHEX(color);g.roundRect(-w/2,-h/2,w,h,r);g.fill();return n;}
 private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=30,color='#704124'){const l=this.base(p,t,x,y,w,h).addComponent(Label);l.string=t;l.fontFamily='Microsoft YaHei';l.fontSize=size;l.lineHeight=size*1.4;l.isBold=true;l.color=new Color().fromHEX(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;}
 private button(p:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,active=false){const n=this.panel(p,x,y,w,h,active?'#FFCE52':'#FFF4E3');this.text(n,t,0,0,w-20,h-10,31);n.on(Node.EventType.TOUCH_END,fn);return n;}
 private image(p:Node,r:Rect,x:number,y:number,w:number,h:number){const n=this.base(p,'Recruit illustration',x,y,w,h),f=new SpriteFrame();f.texture=this.art;f.rect=r;const s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=f;return n;}
 private close(){this.modal?.destroy();this.modal=null;}
 private info(title:string,body:string){this.close();const m=this.base(this.node,'Recruit modal',0,0,887,1774);this.modal=m;m.addComponent(BlockInputEvents);const g=m.addComponent(Graphics);g.fillColor=new Color(35,24,12,165);g.rect(-444,-887,888,1774);g.fill();m.on(Node.EventType.TOUCH_END,()=>this.close());const p=this.panel(m,0,0,790,650);p.addComponent(BlockInputEvents);p.on(Node.EventType.TOUCH_END,(e:any)=>e.propagationStopped=true);this.text(p,title,-20,250,620,65,38);this.button(p,'×',330,250,65,65,()=>this.close());this.text(p,body,0,-15,680,380,29);this.text(m,'点击空白处关闭',0,-390,700,55,27,'#FFF5E5');}
 private render(){this.content?.destroy();const p=this.content=this.base(this.node,'Recruit content',0,0,887,1774);this.panel(p,0,0,887,1774,'#F8E6CF',0);
 this.image(p,new Rect(330,4,544,80),0,822,887,130);
 this.panel(p,-315,820,220,80);this.text(p,'招募',-315,820,210,70,44);
 this.panel(p,-35,820,290,70);this.text(p,'招募券  —',-35,820,270,60,30);
 ['常驻招募','限时UP'].forEach((t,i)=>this.button(p,t,-210+i*420,680,395,86,()=>{if(this.pool!==i){this.pool=i;this.render();}},this.pool===i));
 this.text(p,this.pool?'星光邀约':'冒险伙伴',0,557,800,105,63);
 this.text(p,this.pool?'法师主题 · UP展示':'常驻英雄 · 永久开放',0,470,750,55,32);
 // Only illustration pixels are sampled; counters, navigation and buttons are live nodes.
 this.image(p,new Rect(this.pool?901:330,242,544,287),0,198,887,468);
 this.panel(p,0,-405,855,674);
 this.text(p,'累计招募',-265,-134,250,60,34);this.panel(p,100,-134,430,25,'#C9B9A5',12);this.text(p,'尚未开放',100,-134,400,48,25);
 this.button(p,'♡ 心愿英雄',-248,-253,300,90,()=>this.info('心愿英雄','心愿英雄入口已预留。\n候选英雄、概率提升及保底规则待确认。\n当前不会消耗资源或修改英雄。'));
 this.button(p,'卡池详情',80,-253,220,90,()=>this.info(this.pool?'限时UP · 卡池详情':'常驻招募 · 卡池详情',this.pool?'展示主题：法师\nUP英雄获得概率提升。\n具体概率、开放时间和保底规则尚未配置。\n主题插画不是实际可获得英雄列表。':'常驻池长期开放。\n英雄品质：稀有、史诗、传说。\n具体英雄列表、概率与累计保底规则待确认。'));
 this.button(p,'招募记录',300,-253,200,90,()=>this.info('招募记录','暂无招募记录。\n招募玩法尚未开放。'));
 this.text(p,'英雄品质',0,-350,700,55,28);
 ['稀有','史诗','传说'].forEach((t,i)=>{this.panel(p,-250+i*250,-420,210,60,['#B6D9F4','#DBC0EF','#FFD36C'][i]);this.text(p,t,-250+i*250,-420,200,55,31);});
 [1,10].forEach((n,i)=>this.button(p,'招募'+n+'次\n招募券 ×'+n,-211+i*422,-565,390,120,()=>this.info('招募尚未开放',''+(this.pool?'限时UP':'常驻招募')+' · '+n+'次招募\n概率、保底、招募券来源与消耗规则待确认。\n本次未扣除资源，也未生成招募结果。'),true));
 this.text(p,'招募功能筹备中',0,-680,750,45,25,'#A77C58');
 drawNavigation(p,this.heroAtlas,this.bagAtlas,1,i=>{if(i===0)this.navigate('hero');else if(i===2)this.navigate('adventure');else if(i===3)this.navigate('bag');else if(i===4)this.info('副本','此功能尚未开放。');});
 }
}
