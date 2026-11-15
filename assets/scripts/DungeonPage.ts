import {formationModal} from './FormationModal';
import {Node,Label,Texture2D,Rect,Mask,ScrollView} from 'cc';
import {SquadBattleModel,DUNGEON_CONFIG,DUNGEONS,DIFFICULTIES,dungeonReward,generateGear,HERO_CONFIG} from './SquadBattleModel';
import {ModalView,modalNode,modalText,modalPanel,modalImage,modalButton,modalSection,modalRow} from './ModalView';
import {drawNavigation,gearTile} from './GearView';
import {BattleView,BattleArt} from './BattleView';
type Page='hero'|'recruit'|'adventure'|'bag'|'dungeon';
export class DungeonPage{
 readonly node:Node;private content:Node|null=null;private modal:Node|null=null;private tab=0;private difficulty=0;private selected=0;
 private stamina!:Label;private recovery!:Label;private remaining!:Label;private gold!:Label;private message:Label|null=null;
 private battle:SquadBattleModel|null=null;private fightLayer:Node|null=null;private view:BattleView|null=null;private clock=0;private finishing=false;private finishDelay=0;private mutating=false;private choosingFormation=false;
 constructor(parent:Node,private art:Texture2D,private nav:Texture2D,private bag:Texture2D,private portraits:Texture2D[],private monsters:Texture2D,private yard:Texture2D,private navigate:(page:Page)=>void,private model:()=>SquadBattleModel,private mutate:(fn:(b:SquadBattleModel)=>string|null)=>string|null,private battleArt:BattleArt,private save:()=>boolean){this.node=modalNode(parent,'Dungeon page',0,0,887,1774);this.render();this.node.active=false;}
 private transact(fn:(b:SquadBattleModel)=>string|null){this.mutating=true;try{return this.mutate(fn);}finally{this.mutating=false;}}
 private image(p:Node,t:Texture2D,r:Rect,x:number,y:number,w:number,h:number){return modalImage(p,t,r,x,y,w,h);}
 private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=28){return modalText(p,t,x,y,w,h,size);}
 private scene(p:Node,id:number,x:number,y:number,w:number,h:number){const index=id<4?id:id===4?3:2;return this.image(p,this.art,new Rect(38,[280,590,898,1190][index],390,260),x,y,w,h);}
 private close(){this.modal?.destroy();this.modal=null;this.message=null;}
 refresh(){this.close();this.render();if(this.model().dungeon.run)this.resume();}
 private info(title:string,body:string){this.close();const v=new ModalView(this.node,title,820,()=>this.close());this.modal=v.layer;this.text(v.card,body,0,-15,680,300,30);}
 private render(){
 this.content?.destroy();const p=this.content=modalNode(this.node,'Dungeon content',0,0,887,1774);
 modalPanel(p,0,0,887,1774,'#FBE6D0',0);this.image(p,this.yard,new Rect(0,0,this.yard.width,250),0,812,887,150);
 modalPanel(p,-350,831,160,65,'#FFF4DF',32);this.text(p,'副本',-350,831,150,60,42);
 modalPanel(p,-117,831,260,65,'#FFF4DF',32);this.gold=this.text(p,'● '+this.model().gold,-117,831,240,60,30);
 modalPanel(p,-310,749,240,55,'#FFF5E4',26);this.stamina=this.text(p,'ϟ 120/120',-310,749,235,54,31);this.recovery=this.text(p,'',-23,749,320,54,26);
 ['资源副本','无尽挑战','每日副本'].forEach((t,i)=>modalButton(p,t,-290+i*290,662,280,82,()=>{this.tab=i;this.render();},i===this.tab?'gold':'peach'));
 this.remaining=this.text(p,'',0,594,800,40,24);
 const viewport=modalNode(p,'Dungeon vertical scroll',0,-54,850,1230);viewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;
 const ids=this.tab===0?[0,1,2,3]:this.tab===1?[5]:[4];const h=Math.max(1230,ids.length*288+20),content=modalNode(viewport,'Dungeon cards',0,615-h/2,840,h);
 const scroll=viewport.addComponent(ScrollView);scroll.content=content;scroll.horizontal=false;scroll.vertical=true;scroll.inertia=true;
 ids.forEach((id,i)=>{const y=h/2-148-i*288,card=modalPanel(content,0,y,824,272,'#FFF0DF',30);this.scene(card,id,-218,0,360,252);
 const cfg=DUNGEONS[id];const name=cfg.name+(id===5?' · 最佳'+(this.model().dungeon.floor-1)+'关':'');this.text(card,name,175,91,420,56,36);this.text(card,cfg.drop,175,40,420,40,26);
 this.rewardIcons(card,id,0,135,-15,72);
 this.text(card,'ϟ 消耗体力',66,-108,210,45,25);modalButton(card,'查看',286,-96,180,58,()=>this.challenge(id));
 });
 this.text(p,'点击副本选择难度',0,-709,800,40,26);drawNavigation(p,this.nav,this.bag,4,i=>this.navigate((['hero','recruit','adventure','bag','dungeon'] as Page[])[i]));this.sync();
 if(this.model().dungeon.run){modalButton(p,this.model().dungeon.run!.receipt?'查看战斗结算':'继续进行中的挑战',0,-709,500,56,()=>this.resume());}
 }
 private rewardIcons(p:Node,id:number,difficulty:number,x:number,y:number,size=100){
 const reward=dungeonReward(id,difficulty,1),items=id===0?['金币']:id===1?['经验']:id===2?['强化石']:id===3?['装备']:['金币','经验','强化石'];
 items.forEach((name,i)=>{const xx=x+(i-(items.length-1)/2)*(size+28);if(name==='装备'){[0,1,3].forEach((slot,j)=>{const g=generateGear(j+1,reward.level);g.slot=slot;g.quality=[3,2,1][j];gearTile(p,this.bag,g,slot,xx+(j-1)*(size+12),y,size);});}else{
 const rect=name==='金币'?new Rect(465,382,110,75):name==='经验'?new Rect(465,698,110,75):new Rect(465,1000,110,75);modalPanel(p,xx,y,size,size,'#61BCE8',14);this.image(p,this.art,rect,xx,y+6,size,size*.7);
 const v=name==='金币'?reward.gold:name==='经验'?reward.experience:reward.materials;this.text(p,'×'+v,xx,y-size/2-17,size+40,34,22);
 }});
 }
 private challenge(id:number){
 if(this.model().dungeon.run){this.resume();return;}this.selected=id;this.close();const v=new ModalView(this.node,'副本挑战',1420,()=>this.close());this.modal=v.layer;const p=v.card,d=this.model().dungeon;
 this.scene(p,id,-210,397,270,174);this.text(p,DUNGEONS[id].name,135,452,430,58,39);this.text(p,id===4?'每日副本 · 10波小怪＋Boss':id===5?'无限关卡 · 全队阵亡结束':'10波小怪＋Boss波',135,394,430,50,28);
 this.text(p,id===4?'今日剩余挑战 '+(2-d.dailyUsed)+'/2':'挑战失败不返还消耗',135,340,430,46,25);
 modalSection(p,'选择难度',248);DIFFICULTIES.forEach((name,i)=>modalButton(p,name,-230+i*230,169,210,64,()=>{this.difficulty=i;this.challenge(id);},i===this.difficulty?'gold':'peach'));
 modalRow(p,'⚑','推荐等级','Lv.'+[1,8,15][this.difficulty],83);modalSection(p,id===5?'每通关1关奖励':'胜利奖励预览',-4);this.rewardIcons(p,id,this.difficulty,0,-105,100);
 modalSection(p,'出战队伍',-227);this.model().formation.forEach((hero,i)=>{const x=(i-(this.model().formation.length-1)/2)*180,t=this.portraits[hero];modalPanel(p,x,-326,140,145,'#F8DCB9',20);this.image(p,t,new Rect(0,0,t.width,t.height),x,-310,136,136);this.text(p,'Lv.'+this.model().heroes[hero].level,x,-406,160,38,25);});
 const energy=this.text(p,'ϟ 当前体力 '+d.stamina+'/120 · 每6分钟恢复1点',0,-468,690,44,25);
 const cost=DUNGEON_CONFIG.costs[this.difficulty];modalButton(p,'开始挑战 · ϟ '+cost,0,-584,480,87,()=>{const error=this.transact(b=>b.startDungeon(id,this.difficulty,Date.now()));if(error){energy.string=error;return;}this.close();this.resume();});
 this.message=energy;
 }
 private resume(){
 const r=this.model().dungeon.run;if(!r)return;this.close();this.battle=SquadBattleModel.restore(r.battle);if(!this.battle){this.info('挑战异常','无法恢复战斗，请结束本次挑战');return;}
 this.buildFight();this.finishing=false;this.finishDelay=0;
 if(r.receipt)this.resultDialog();else if(this.battle.result!=='fighting')this.end(false);
 }
 private buildFight(){
 const r=this.model().dungeon.run!;this.view?.destroy();this.view=new BattleView(this.node,()=>this.battle!,this.battleArt,{title:DUNGEONS[r.id].name,dungeon:true,subtitle:()=>DIFFICULTIES[r.difficulty]+(r.id===5?' · 无尽挑战':''),onChange:()=>{this.persistBattle();this.save();},onFormation:()=>this.formation(),navigate:i=>{if(this.battle?.result!=='fighting'){this.resultDialog();return;}this.leave();this.navigate((['hero','recruit','adventure','bag','dungeon'] as Page[])[i]);},onLeave:()=>this.leave(),onEnd:()=>this.end(true)});this.fightLayer=this.view.root;
 }
 private formation(){
 if(!this.battle)return;if(this.battle.result!=='fighting'){this.resultDialog();return;}this.close();
 this.choosingFormation=true;
 this.modal=formationModal(this.fightLayer!,this.battle,this.portraits,ids=>{
   const draft=SquadBattleModel.restore(this.battle!.snapshot())!,error=draft.setBattleFormation(ids);if(error)return error;
   const snapshot:any=draft.snapshot();snapshot.version=9;delete snapshot.dungeon;
   const failure=this.transact(b=>{if(!b.dungeon.run||b.dungeon.run.receipt)return '挑战已结束';b.dungeon.run.battle=snapshot;return null;});
   if(failure)return failure;this.battle=draft;this.view!.refreshFormation();return null;
 },()=>{this.choosingFormation=false;this.close();if(this.battle){this.persistBattle();this.save();}},true);
 }
 private leave(){if(this.battle?.result!=='fighting'){this.resultDialog();return;}this.persistBattle();if(!this.save()){this.view?.toast('保存失败，暂不离开');return;}this.close();this.view?.destroy();this.view=null;this.fightLayer=null;this.battle=null;this.render();}
 private persistBattle(){if(this.battle&&this.model().dungeon.run){const s:any=this.battle.snapshot();s.version=9;delete s.dungeon;this.model().dungeon.run!.battle=s;}}
 private end(stop:boolean){
 if(!this.battle)return;if(this.model().dungeon.run?.receipt){this.resultDialog();return;}
 if(stop&&this.battle.result==='fighting'){this.battle.result='defeat';this.battle.paused=false;}
 this.persistBattle();const error=this.transact(b=>b.settleDungeon());
 if(error){this.view?.toast(error+'，点击结束挑战可重试');this.finishing=false;return;}
 this.finishing=true;this.resultDialog();
 }
 private resultDialog(){
 const r=this.model().dungeon.run,b=this.battle;if(!r||!b)return;
 if(!r.receipt){if(b.result!=='fighting')this.end(false);return;}
 this.close();const win=b.result==='victory',reward=r.receipt,reason=b.party.every(h=>h.hp<=0)?'全队阵亡':'主动结束';
 const v=new ModalView(this.fightLayer!,r.id===5?'无尽结算':win?'挑战胜利':'挑战失败',1480,()=>this.close());this.modal=v.layer;const p=v.card;
 this.text(p,DUNGEONS[r.id].name+' · '+DIFFICULTIES[r.difficulty],0,510,690,58,38);
 this.text(p,(win?'全部波次已完成':reason)+' · 已通关 '+reward.cleared+(r.id===5?' 关':' / '+(DUNGEON_CONFIG.mobWaves+1)+' 波'),0,446,700,48,27);
 this.text(p,'用时 '+Math.floor(b.elapsed)+'秒 · 击败 '+b.kills+' 只 · 行动 '+b.actions+'次',0,390,700,44,25);
 modalSection(p,'实际获得 · 已保存',318);
 modalRow(p,'●','金币','+'+reward.gold,248);modalRow(p,'✦','每位已拥有英雄经验','+'+reward.experience,184);modalRow(p,'◆','强化材料','+'+reward.materials,120);
 modalRow(p,'▣','装备入包 / 自动分解',reward.gear+'件 / '+reward.salvaged+'件',56);
 modalSection(p,'战斗统计',-20);this.text(p,'英雄                 输出伤害            治疗量',0,-85,700,45,25);
 const heroes=b.heroes.map((h,id)=>({h,id})).filter(x=>b.formation.indexOf(x.id)>=0||x.h.damage>0||x.h.healing>0);
 heroes.forEach(({h,id},i)=>{const y=-145-i*58;this.text(p,HERO_CONFIG[id].name,-230,y,190,43,28);this.text(p,String(h.damage),22,y,230,43,27);this.text(p,String(h.healing),240,y,185,43,27);});
 this.text(p,'总输出 '+b.damage+' · 总治疗 '+b.heroes.reduce((n,h)=>n+h.healing,0)+' · 总承伤 '+b.received,0,-395,700,45,25);
 const message=this.text(p,'再次挑战重新消耗体力，每日副本计入当日次数。',0,-457,700,60,24);
 modalButton(p,'退出',-175,-610,300,80,()=>{const error=this.transact(m=>m.exitDungeon());if(error){message.string=error;return;}this.close();this.view?.destroy();this.view=null;this.fightLayer=null;this.battle=null;this.finishing=false;this.render();},'peach');
 modalButton(p,'再次挑战',175,-610,300,80,()=>{const error=this.transact(m=>m.retryDungeon(Date.now()));if(error){message.string=error;return;}this.resume();});
 }
 private sync(){const d=this.model().dungeon;this.stamina.string='ϟ '+d.stamina+'/120';this.gold.string='● '+this.model().gold;const seconds=Math.max(0,Math.ceil((d.anchor+DUNGEON_CONFIG.recoverMs-d.clock)/1000));this.recovery.string=d.stamina===120?'体力已满':'下次恢复 '+('0'+Math.floor(seconds/60)).slice(-2)+':'+('0'+(seconds%60)).slice(-2);this.remaining.string=this.tab===2?'今日剩余挑战 '+(2-d.dailyUsed)+'/2 · 本地零点重置':this.tab===1?'最佳通关 '+(d.floor-1)+' 关 · 入场扣体力，阵亡结算':'体力随时间恢复 · 挑战前选择难度';}
 update(dt:number){this.sync();if(!this.battle||!this.fightLayer||this.finishing||this.choosingFormation)return;this.view?.update(dt);this.clock+=dt;if(this.clock>=1){this.clock=0;this.persistBattle();}if(this.battle.result!=='fighting'){this.finishDelay+=Math.min(dt,.1);if(this.finishDelay>=.6)this.end(false);}}
 beforeSave(){if(!this.mutating)this.persistBattle();}
}
