import {Node,Texture2D} from 'cc';
import {Gear,gearName,gearStats,QUALITY_NAMES,EQUIPMENT_PARTS} from './SquadBattleModel';
import {gearTile} from './GearView';
import {modalText,modalPanel,modalSection,modalRow,modalButton,modalIcon,modalNode} from './ModalView';

export function equipmentHeader(card:Node,atlas:Texture2D,gear:Gear,y:number,onLock?:()=>void){
  gearTile(card,atlas,gear,gear.slot,-235,y,172);
  modalText(card,gearName(gear),83,y+56,420,57,35);
  const q=modalPanel(card,80,y-3,330,48,'#F3D4AD',24);modalText(q,QUALITY_NAMES[gear.quality]+' · '+EQUIPMENT_PARTS[gear.slot],0,0,320,44,27);
  modalText(card,'Lv.'+gear.level+' · 强化 +'+(gear.enhancement||0),80,y-60,380,45,27);
  if(onLock){const lock=modalNode(card,'Toggle equipment lock',318,y-60,72,72);modalIcon(lock,gear.locked?5:6,0,0,58);lock.on(Node.EventType.TOUCH_END,onLock);}
}
export function equipmentStats(card:Node,gear:Gear,sectionY:number){
  modalSection(card,'装备属性',sectionY);const stats=gearStats(gear);
  (['hp','attack','defense','power'] as const).forEach((key,i)=>modalRow(card,['♥','⚔','◈','✦'][i],['生命','攻击','防御','技能效果'][i],'+'+stats[key],sectionY-70-i*60));
}
