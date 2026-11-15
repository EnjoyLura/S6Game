import {Node,Texture2D,Rect} from 'cc';
import {SquadBattleModel,HERO_CONFIG} from './SquadBattleModel';
import {ModalView,modalNode,modalPanel,modalText,modalImage,modalSection,modalButton} from './ModalView';
/** Shared draft picker. Closing never applies a draft. */
export function formationModal(parent:Node,model:SquadBattleModel,portraits:Texture2D[],save:(ids:number[])=>string|null,onClose:()=>void,combat=false){
 const v=new ModalView(parent,'队伍编队',1180,onClose);let draft=model.formation.slice();const rows=modalNode(v.card,'Formation draft',0,0,760,900);
 const face=(p:Node,id:number,x:number,y:number,size:number)=>{const t=portraits[id];modalImage(p,t,new Rect(0,0,t.width,t.height),x,y,size,size);};
 const draw=()=>{rows.children.forEach(n=>n.active=false);rows.destroyAllChildren();modalSection(rows,'当前上阵',365);
  for(let slot=0;slot<3;slot++){const id=draft[slot],x=-225+slot*225,n=modalPanel(rows,x,240,200,180,'#FBE1C2',24);
   if(id!==undefined){face(n,id,0,10,145);modalText(n,HERO_CONFIG[id].name,0,-62,180,42,25);n.on(Node.EventType.TOUCH_END,()=>{draft.splice(slot,1);draw();});}
   else modalText(n,'＋',0,0,160,100,60,'#B49770');modalText(rows,slot===0?'前排':'后排',x,128,190,42,25);
  }
  modalSection(rows,'可选英雄',45);
  HERO_CONFIG.forEach((hero,id)=>{const owned=model.owns(id),slot=draft.indexOf(id),x=-265+id*176,n=modalPanel(rows,x,-75,160,145,slot>=0?'#FFDA76':'#FBE1C2',20);
   if(owned)face(n,id,0,10,110);modalText(n,owned?hero.name:'未招募',0,-50,150,38,23);if(slot>=0)modalText(n,'✓',55,48,42,36,27);
   if(combat&&owned&&model.heroes[id].hp===0)modalText(n,'已阵亡',0,48,150,38,23);
   n.on(Node.EventType.TOUCH_END,()=>{if(!owned)return;if(slot>=0)draft.splice(slot,1);else if(draft.length<3)draft.push(id);draw();});
  });
  const hint=modalText(rows,combat?'最多3位不重复英雄，第一位为前排。\n移除后重新选择可调整顺序。\n保留各自生命、冷却和本波敌人，不复活。':'最多上阵3位，同一英雄不能重复。\n满员请先移除一位；第一位为前排。\n保存变更后重新挑战当前波。',0,-260,680,145,26);
  modalButton(rows,'保存阵容',0,-460,390,80,()=>{const error=save(draft);if(error)hint.string=error;else onClose();});
 };draw();return v.layer;
}
