/** Test configuration for equipment combat affixes. Rates use fractions, 0.05 = 5%. */
export const COMBAT_KEYS=['critChance','critDamage','comboChance','armorPen','cooldownReduction','healingBonus','shieldBonus','basicBonus','skillBonus','dodgeChance'] as const;
export type CombatKey=typeof COMBAT_KEYS[number];
export type CombatAffixes=Partial<Record<CombatKey,number>>;
export type CombatStats=Record<CombatKey,number>;
export const COMBAT_LABELS={critChance:'暴击率',critDamage:'暴击伤害',comboChance:'连击率',armorPen:'破甲率',cooldownReduction:'冷却缩减',healingBonus:'治疗加成',shieldBonus:'护盾加成',basicBonus:'普攻伤害',skillBonus:'技能伤害',dodgeChance:'闪避率'};
export const COMBAT_CONFIG={criticalMultiplier:1.5,rateCap:.75,bonusCap:3,affixPerQuality:.02,armorPerWave:2};
export function validCombatAffixes(value:unknown){return value===undefined||!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>{const v=(value as Record<string,unknown>)[key];return COMBAT_KEYS.indexOf(key as CombatKey)>=0&&typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1;});}
export function combatTotals(items:({combat?:CombatAffixes}|null)[]):CombatStats{
 const result={} as CombatStats;for(const key of COMBAT_KEYS)result[key]=Math.min(['critChance','comboChance','armorPen','cooldownReduction','dodgeChance'].indexOf(key)>=0?COMBAT_CONFIG.rateCap:COMBAT_CONFIG.bonusCap,items.reduce((n,g)=>n+(g?.combat?.[key]||0),0));
 result.critDamage+=COMBAT_CONFIG.criticalMultiplier;return result;
}
export function attackDamage(base:number,armor:number,stats:CombatStats,skill:boolean,random:()=>number){
 const critical=stats.critChance>0&&random()<stats.critChance;
 const combo=!skill&&stats.comboChance>0&&random()<stats.comboChance;
 const damage=Math.max(1,Math.round(base*(1+(skill?stats.skillBonus:stats.basicBonus))*(critical?stats.critDamage:1))-Math.round(armor*(1-stats.armorPen)));
 return {damage:damage*(combo?2:1),critical,combo};
}
