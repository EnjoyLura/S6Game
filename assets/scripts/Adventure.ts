import {SecondEditionUI} from './SecondEditionUI';
import {BattleView} from './BattleView';
import {fitScreen} from './ScreenLayout';
import {DungeonPage} from './DungeonPage';
import {ModalView,setModalSkin,modalButton,modalRow,modalSection,modalText} from './ModalView';
import {RecruitPage} from './RecruitPage';
import {gearTile} from './GearView';
import { _decorator, Component, Node, Canvas, UITransform, Camera, Layers, Color, Label, Texture2D, resources, view, ResolutionPolicy, game, Game, profiler, sys } from 'cc';
import { SquadBattleModel, HERO_CONFIG, gearName, DROP_SECONDS, foregroundRewardDelta } from './SquadBattleModel';
import { LocalSave } from './LocalSave';
import { HeroPage } from './HeroPage';
import { BagPage } from './BagPage';
const { ccclass } = _decorator;
@ccclass('Adventure')
export class Adventure extends Component {
  private second:SecondEditionUI|null=null;private secondForest:Texture2D|null=null;
  private screenCamera!:Camera; private root!: Node; private model = new SquadBattleModel(0,Math.random,3,true); private ready = false;
  private battleArt!:Texture2D[]; private shownFormation='';
  private view!:BattleView; private foregroundPaused=false;
  private ui!:Texture2D;private heroTextures:Texture2D[]=[];private monsters!:Texture2D;
  private dungeonPage!:DungeonPage; private recruitPage!:RecruitPage; private heroPage!:HeroPage; private bagPage!:BagPage; private currentPage:'adventure'|'hero'|'bag'|'recruit'|'dungeon'='adventure'; private canvasRoot!:Node;
  private saves!:LocalSave<SquadBattleModel>; private saveClock=0; private background=false;
  private saveProgress=()=>{if(!this.saves)return false;this.dungeonPage?.beforeSave();this.model.refreshDungeon(Date.now());if(!this.background)this.model.markSeen(Date.now());const snapshot=this.model.snapshot();if(this.background)snapshot.paused=this.foregroundPaused;const ok=this.saves.save(snapshot);if(!ok)this.toast(this.saves.error);return ok;};
  private upgradeHero=(i:number)=>{const before=this.model.snapshot();const error=this.model.upgrade(i);if(error)return error;if(!this.saveProgress()){this.model=SquadBattleModel.restore(before)!;return this.saves.error+'，本次升级未扣经验';}return null;};
  private mutateEquipment=(fn:(b:SquadBattleModel)=>string|null)=>{const before=this.model.snapshot();const error=fn(this.model);if(error)return error;if(!this.saveProgress()){this.model=SquadBattleModel.restore(before)!;return this.saves.error+'，本次操作已撤销';}this.view?.resetFeedback();return null;};
  onLoad() {
    this.saves=new LocalSave(sys.localStorage,SquadBattleModel.restore);this.model=this.saves.load()||this.model;this.model.prepareOffline(Date.now());this.saveProgress();
    if(typeof window!=='undefined')window.addEventListener('beforeunload',this.saveProgress);
    profiler.hideStats();
    view.setDesignResolutionSize(887,1774,ResolutionPolicy.FIXED_WIDTH);
    const cameraNode = new Node('UI Camera'); cameraNode.parent = this.node;
    cameraNode.setPosition(443.5,887,1000); const camera=cameraNode.addComponent(Camera);this.screenCamera=camera;
    camera.projection=Camera.ProjectionType.ORTHO; camera.orthoHeight=887;
    camera.clearColor=new Color(31,46,37,255); camera.visibility=Layers.Enum.UI_2D;
    this.root=new Node('Adventure Canvas');this.root.layer=Layers.Enum.UI_2D;this.root.parent=this.node;
    this.root.addComponent(UITransform).setContentSize(887,1774);this.root.setPosition(443.5,887,0);
    const canvas=this.root.addComponent(Canvas);canvas.cameraComponent=camera;
    this.canvasRoot=this.root;
    game.on(Game.EVENT_HIDE,this.hide,this);game.on(Game.EVENT_SHOW,this.show,this);
    Promise.all(['forest','hero-knight','hero-mage','hero-priest','hero-archer','monsters-4','adventure-ui-v5','hero-ui-v6','training-yard','bag-ui-v4','recruit-ui-v1','modal-skin-v1','modal-controls-9','dungeon-ui-v2','v2-backgrounds','v2-controls','v2-icons','v2-navigation','v2-skills','v2-feature-scenes','v2-attribute-icons','v2-hero-marks','v2-popup-marks','v2-popup-buttons','v2-popup-frame','v2-talent-marks'].map(n=>this.texture('art/'+n))).then(([forest,knight,mage,priest,archer,monsters,ui,heroUI,yard,bagUI,recruitUI,modalSkin,modalControls,dungeonUI,v2Backgrounds,v2Controls,v2Icons,v2Adventure,v2Skills,v2Features,v2AttributeIcons,v2HeroMarks,v2PopupMarks,v2PopupButtons,v2PopupFrame,v2TalentMarks])=>{
      setModalSkin(modalSkin,modalControls);
      this.ui=ui;this.heroTextures=[knight,mage,priest,archer];this.monsters=monsters;
      this.battleArt=[forest,heroUI,bagUI];this.rebuildBattle();
      this.heroPage=new HeroPage(this.canvasRoot,heroUI,yard,knight,()=>this.openPage('adventure'),(slot,hero)=>{this.openPage('bag');if(slot!==undefined)this.bagPage.showSlot(slot,hero!);},this.heroTextures,ui,()=>({gold:this.model.gold,experience:this.model.heroes.map(h=>h.experience),levels:this.model.heroes.map(h=>h.level),stats:this.model.heroes.map((_,i)=>this.model.stats(i))}),this.upgradeHero,()=>this.model,this.mutateEquipment,bagUI,()=>this.openPage('recruit'),()=>this.openPage('dungeon'));
      this.bagPage=new BagPage(this.canvasRoot,bagUI,yard,(page)=>this.openPage(page),()=>this.model,this.mutateEquipment,heroUI);
      this.recruitPage=new RecruitPage(this.canvasRoot,recruitUI,heroUI,bagUI,page=>this.openPage(page),()=>this.model,this.mutateEquipment,this.heroTextures);this.dungeonPage=new DungeonPage(this.canvasRoot,dungeonUI,heroUI,bagUI,this.heroTextures,this.monsters,yard,page=>this.openPage(page),()=>this.model,this.mutateEquipment,{forest,ui,nav:heroUI,bag:bagUI,heroes:this.heroTextures,monsters},this.saveProgress);if(typeof document!=='undefined'){
        this.secondForest=v2Backgrounds;this.dungeonPage.externalUI=true;this.dungeonPage.externalForest=v2Backgrounds;this.view.useExternalPresentation(v2Backgrounds);this.screenCamera.clearColor=new Color(0,0,0,0);
        this.second=new SecondEditionUI({model:()=>this.model,mutate:this.mutateEquipment,navigate:p=>this.openPage(p),battle:()=>this.currentPage==='dungeon'&&this.dungeonPage.activeBattle||this.model,speed:()=>this.currentPage==='dungeon'?this.dungeonPage.activeView?.getSpeed()||1:this.view.getSpeed(),setSpeed:()=>{(this.currentPage==='dungeon'?this.dungeonPage.activeView:this.view)?.cycleSpeed();},start:(id,d)=>{const error=this.dungeonPage.startExternal(id,d);if(error)this.second?.toast(error);},resume:()=>this.dungeonPage.resumeExternal(),leave:()=>this.dungeonPage.leaveExternal(),end:()=>this.dungeonPage.endExternal(),retry:()=>{const e=this.dungeonPage.retryExternal();if(e)this.second?.toast(e);},exit:()=>{const e=this.dungeonPage.exitExternal();if(e)this.second?.toast(e);},formation:ids=>this.currentPage==='dungeon'&&this.dungeonPage.activeBattle?this.dungeonPage.formationExternal(ids):this.mutateEquipment(m=>m.setFormation(ids))},{'monsters-4':monsters,'v2-skills':v2Skills,'v2-backgrounds':v2Backgrounds,'v2-controls':v2Controls,'v2-icons':v2Icons,'v2-navigation':v2Adventure,'dungeon-ui-v2':dungeonUI,'hero-knight':knight,'hero-mage':mage,'hero-priest':priest,'hero-archer':archer,'modal-controls-9':modalControls,'v2-feature-scenes':v2Features,'v2-attribute-icons':v2AttributeIcons,'v2-hero-marks':v2HeroMarks,'v2-popup-marks':v2PopupMarks,'v2-popup-buttons':v2PopupButtons,'v2-popup-frame':v2PopupFrame,'v2-talent-marks':v2TalentMarks});
      }if(this.model.dungeon.run)this.openPage('dungeon');this.showOffline();
    }).catch(e=>{console.error(e);modalText(this.canvasRoot,'素材加载失败，请刷新重试',0,0,700,70,34);});
  }
  private rebuildBattle(){
    this.view?.destroy();this.shownFormation=this.model.formation.join();
    this.view=new BattleView(this.canvasRoot,()=>this.model,{forest:this.battleArt[0],ui:this.ui,nav:this.battleArt[1],bag:this.battleArt[2],heroes:this.heroTextures,monsters:this.monsters},{title:'镇外森林',onChange:this.saveProgress,onIncome:()=>this.showOffline(),onFormation:()=>this.openPage('hero'),navigate:i=>this.openPage((['hero','recruit','adventure','bag','dungeon'] as const)[i]),onRestart:index=>this.restart(index)});
    this.root=this.view.root;if(this.second)this.view.useExternalPresentation(this.secondForest||undefined);this.ready=true;if(this.saves.error)this.toast(this.saves.error);
  }
  private texture(path:string):Promise<Texture2D>{return new Promise((resolve,reject)=>resources.load(path+'/texture',Texture2D,(e,t)=>e?reject(e):resolve(t)));}
  private toast(s:string){this.view?.toast(s);}
  private restart(index=this.model.monsterIndex){const previous=this.model;this.model=new SquadBattleModel(index,Math.random,3,true);this.model.inheritIncome(previous);this.model.autoSkill=previous.autoSkill;this.rebuildBattle();this.saveProgress();}
  private openPage(page:'adventure'|'hero'|'bag'|'recruit'|'dungeon'){if(!this.heroPage||!this.bagPage||!this.recruitPage)return;if(this.currentPage==='dungeon')this.dungeonPage.beforeSave();this.currentPage=page;if(page==='dungeon')this.dungeonPage.refresh();if(page==='adventure'&&this.shownFormation!==this.model.formation.join())this.rebuildBattle();this.view.resetFeedback();if(page==='hero')this.heroPage.refresh();if(page==='bag'){this.bagPage.setGold(this.model.gold);this.bagPage.refresh();}this.root.active=page==='adventure';this.heroPage.node.active=page==='hero';this.bagPage.node.active=page==='bag';this.recruitPage.node.active=page==='recruit';this.dungeonPage.node.active=page==='dungeon';if(this.second){this.heroPage.node.active=false;this.bagPage.node.active=false;this.recruitPage.node.active=false;this.second.setPage(page);}}
  update(dt:number){
    if(!this.ready||this.background)return;fitScreen(this.canvasRoot,this.screenCamera);this.model.refreshDungeon(Date.now());const nextId=this.model.nextGearId,oldCount=this.model.inventory.length,oldMaterials=this.model.materials;this.model.settleIdle(foregroundRewardDelta(dt));if(this.model.nextGearId>nextId){const saved=this.saveProgress(),kept=this.model.inventory.length-oldCount,recycled=this.model.nextGearId-nextId-kept;if(this.currentPage==='bag')this.bagPage.refresh();if(this.currentPage==='adventure')this.toast(!saved?this.saves.error:recycled?'自动分解 '+recycled+' 件 · 强化石 +'+(this.model.materials-oldMaterials)+(kept?' · 保留 '+kept+' 件':''):'获得 '+gearName(this.model.inventory[this.model.inventory.length-1])+' · 已进入背包');}this.saveClock+=dt;if(this.saveClock>=1){this.saveClock=0;this.saveProgress();}
    if(this.second){if(!this.second.blocksBattle){if(this.currentPage==='dungeon')this.dungeonPage.update(dt);else if(this.currentPage==='adventure')this.view.update(dt);}this.second.update();return;}
    if(this.currentPage==='dungeon'){this.dungeonPage.update(dt);return;}if(this.currentPage==='recruit')return;if(this.currentPage==='hero'){this.heroPage.refreshIncome();return;}if(this.currentPage==='bag'){this.bagPage.setGold(this.model.gold);return;}
    this.view.update(dt);
  }
  private offlineModal:Node|null=null;
  private showOffline(){
    if(this.second){this.second.update();return;}
    if(!this.ready||!this.canvasRoot||this.offlineModal)return;const r=this.model.offline;if(!r)return;
    const close=()=>{this.offlineModal?.destroy();this.offlineModal=null;};const view=new ModalView(this.canvasRoot,'离线收益',1320,close);this.offlineModal=view.layer;const card=view.card;
    modalRow(card,'◷','离线时长',r.seconds+'秒',395);modalRow(card,'⚑','最高检查点',String(r.checkpoint),333);
    modalRow(card,'●','金币','+'+r.gold,250);
    r.experience.forEach((v,i)=>{if(v)modalRow(card,'✦',HERO_CONFIG[i].name+'经验','+'+v,175-i*62);});
    modalSection(card,'装备 '+r.equipment.length+'件',-110);
    r.equipment.slice(0,5).forEach((g,i)=>gearTile(card,this.battleArt[2],g,g.slot,-280+i*140,-210,125));
    modalText(card,'离线收益上限8小时，按最高进度结算。\n领取时应用自动保留规则，其余装备分解。\n未领取可关闭，点击“收益”再次查看。',0,-350,690,130,25);
    const claim=modalButton(card,'领取收益',0,-530,440,82,()=>{const error=this.mutateEquipment(b=>b.claimOffline());if(error){message.string=error;return;}close();if(this.currentPage==='bag')this.bagPage.refresh();if(this.currentPage==='hero')this.heroPage.refresh();this.toast('离线收益已领取并保存');});
    const message=claim.children[claim.children.length-1].getComponent(Label)!;
  }
  private hide(){if(this.background)return;this.saveProgress();this.foregroundPaused=this.model.paused;this.background=true;this.model.paused=true;}
  private show(){if(!this.background)return;this.background=false;this.model.paused=this.foregroundPaused;this.model.prepareOffline(Date.now());this.saveProgress();this.showOffline();}
  onDestroy(){this.second?.destroy();if(typeof window!=='undefined')window.removeEventListener('beforeunload',this.saveProgress);game.off(Game.EVENT_HIDE,this.hide,this);game.off(Game.EVENT_SHOW,this.show,this);}
}
