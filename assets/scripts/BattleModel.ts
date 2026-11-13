// Prototype values only; simulation time advances only while fighting.
export const CONFIG = { knightHp: 1980, slimeHp: 940, knightAttack: 128, slimeAttack: 105, actionSeconds: 1.25, skillCooldown: 8, shield: 220 };
export type Hit = { actor: 'knight' | 'slime'; damage: number; blocked: number; skill: boolean };
export class BattleModel {
  hp = CONFIG.knightHp;
  enemyHp = CONFIG.slimeHp;
  shield = 0;
  cooldown = 0;
  elapsed = 0;
  actions = 0;
  damage = 0;
  received = 0;
  autoSkill = true;
  paused = false;
  queued = false;
  result: 'fighting' | 'victory' | 'defeat' = 'fighting';
  private timer = 0;
  requestSkill() {
    if (this.result !== 'fighting' || this.cooldown > 0 || this.queued) return false;
    this.queued = true; return true;
  }
  step(dt: number): Hit[] {
    if (this.paused || this.result !== 'fighting' || dt <= 0) return [];
    const hits: Hit[] = [];
    // Fixed substeps keep cooldown/turn behavior stable at different frame rates.
    while (dt > 0 && this.result === 'fighting') {
      const delta = Math.min(dt, CONFIG.actionSeconds - this.timer);
      this.timer += delta; this.elapsed += delta;
      this.cooldown = Math.max(0, this.cooldown - delta); dt -= delta;
      if (this.timer + 1e-8 < CONFIG.actionSeconds) break;
      this.timer = 0;
      const actor = this.actions++ % 2 === 0 ? 'knight' : 'slime';
      let damage = 0, blocked = 0, skill = false;
      if (actor === 'knight') {
        if (this.cooldown <= 0 && (this.autoSkill || this.queued)) {
          skill = true; this.queued = false; this.shield = CONFIG.shield; this.cooldown = CONFIG.skillCooldown;
        } else { damage = Math.min(this.enemyHp, CONFIG.knightAttack); this.enemyHp -= damage; this.damage += damage; }
      } else {
        blocked = Math.min(this.shield, CONFIG.slimeAttack); this.shield -= blocked;
        damage = Math.min(this.hp, CONFIG.slimeAttack - blocked); this.hp -= damage; this.received += damage;
      }
      hits.push({ actor, damage, blocked, skill });
      if (this.enemyHp <= 0) this.result = 'victory';
      else if (this.hp <= 0) this.result = 'defeat';
    }
    return hits;
  }
}
