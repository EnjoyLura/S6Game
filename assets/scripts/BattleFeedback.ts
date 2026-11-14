import {Node,Graphics,Color,UIOpacity,Sprite,UITransform,Layers} from 'cc';
import type {SquadHit} from './SquadBattleModel';
type Motion={kind:'attack'|'hurt'|'death'|'spawn';age:number;life:number;dx:number;dy:number;strong:boolean};
type Effect={node:Node;age:number;life:number;kind:string;x:number;y:number;tx:number;ty:number};
// Presentation-only clock. Never changes combat actions, cooldowns, income or save data.
export class BattleFeedback {
  hp:number[]=[];shields:number[]=[];
  private motions=new Map<number,Motion>();
  private pending:{hit:SquadHit;delay:number}[]=[];
  private effects:Effect[]=[];
  private clock=0;
  constructor(private units:Node[],private positions:number[][],private layer:Node,private impact:(hit:SquadHit)=>void){}
  reset(hp:number[],shields:number[]){
    this.hp=hp.slice();this.shields=shields.slice();this.pending=[];this.motions.clear();this.effects.forEach(f=>f.node.destroy());this.effects=[];
    this.units.forEach((n,i)=>{n.setPosition(this.positions[i][0],this.positions[i][1]);n.setScale(1,1,1);n.angle=0;n.getComponent(Sprite)!.color=Color.WHITE;this.opacity(n).opacity=hp[i]>0?255:0;});
  }
  enter(){for(let i=3;i<this.units.length;i++)this.motions.set(i,{kind:'spawn',age:0,life:.38,dx:150,dy:0,strong:false});}
  play(hit:SquadHit){
    const a=this.positions[hit.actor],b=this.positions[hit.target],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
    this.motions.set(hit.actor,{kind:'attack',age:0,life:.46,dx:dx/length,dy:dy/length,strong:hit.skill});
    const ranged=hit.actor<3&&hit.hero!==0;
    const delay=hit.target===hit.actor ? .18 : ranged ? .30 : .20;
    this.pending.push({hit,delay});
    if(ranged&&hit.damage)this.effect('projectile',a[0]+18,a[1]+10,b[0],b[1]+15,delay,hit.skill?'#FF993E':'#A8DDFF');
  }
  private opacity(n:Node){return n.getComponent(UIOpacity)||n.addComponent(UIOpacity);}
  private effect(kind:string,x:number,y:number,tx=x,ty=y,life=.32,color='#FFE494'){
    if(this.effects.length>=32){this.effects.shift()!.node.destroy();}
    const n=new Node('Combat '+kind);n.layer=Layers.Enum.UI_2D;n.parent=this.layer;n.setPosition(x,y);n.addComponent(UITransform).setContentSize(130,130);
    const g=n.addComponent(Graphics);g.strokeColor=new Color().fromHEX(color);g.fillColor=new Color().fromHEX(color);g.lineWidth=5;
    if(kind==='projectile'){g.moveTo(-24,0);g.lineTo(0,0);g.stroke();g.circle(0,0,11);g.fill();g.fillColor=Color.WHITE;g.circle(2,1,5);g.fill();n.angle=Math.atan2(ty-y,tx-x)*180/Math.PI;}
    else if(kind==='heal'){g.circle(0,0,35);g.stroke();g.rect(-5,-17,10,34);g.rect(-17,-5,34,10);g.fill();}
    else if(kind==='shield'){g.moveTo(-28,25);g.lineTo(0,34);g.lineTo(28,25);g.lineTo(23,-12);g.lineTo(0,-32);g.lineTo(-23,-12);g.close();g.stroke();}
    else{
      g.circle(0,0,kind==='burst'?33:22);g.stroke();
      for(let i=0;i<6;i++){const a=i*Math.PI/3;g.moveTo(Math.cos(a)*29,Math.sin(a)*29);g.lineTo(Math.cos(a)*47,Math.sin(a)*47);g.stroke();}
      g.strokeColor=Color.WHITE;g.lineWidth=kind==='slash'?9:5;g.moveTo(-29,-24);g.lineTo(29,24);g.stroke();g.lineWidth=4;g.moveTo(-14,23);g.lineTo(14,-23);g.stroke();
      g.fillColor=Color.WHITE;g.circle(0,0,8);g.fill();
    }
    this.opacity(n);this.effects.push({node:n,age:0,life,kind,x,y,tx,ty});
  }
  update(dt:number){
    if(dt<=0)return;this.clock+=dt;
    for(const p of this.pending)p.delay-=dt;
    const due=this.pending.filter(p=>p.delay<=0);this.pending=this.pending.filter(p=>p.delay>0);
    for(const {hit:h} of due){
      this.hp[h.target]=h.hpAfter;this.shields[h.target]=h.shieldAfter;
      const p=this.positions[h.target],a=this.positions[h.actor],dx=p[0]-a[0],dy=p[1]-a[1],length=Math.hypot(dx,dy)||1;
      if(h.damage||h.blocked)this.motions.set(h.target,{kind:h.killed||h.hpAfter===0?'death':'hurt',age:0,life:(h.killed||h.hpAfter===0) ? .38 : .32,dx:dx/length,dy:dy/length,strong:h.skill&&h.damage>0});
      this.effect(h.heal?'heal':h.skill&&!h.damage&&h.hero===0||h.blocked&&!h.damage?'shield':h.skill?'burst':h.hero===0?'slash':'hit',p[0],p[1]+14,p[0],p[1]+14,.34,h.heal?'#A4F77D':h.blocked&&!h.damage||h.hero===0&&h.skill&&!h.damage?'#79DDFE':h.skill?'#FFB950':'#FFE5AD');
      this.impact(h);
    }
    this.units.forEach((n,i)=>{
      const base=this.positions[i],m=this.motions.get(i);let x=base[0],y=base[1],sx=1,sy=1,angle=0,alpha=this.hp[i]>0?255:0;
      n.getComponent(Sprite)!.color=Color.WHITE;
      if(m){m.age+=dt;const t=Math.min(1,m.age/m.life);
        if(m.kind==='spawn'){x+=m.dx*Math.pow(1-t,3);alpha=255*t;}
        else if(m.kind==='attack'){
          const push=t<.25?-12*(t/.25):t<.43?-12+46*((t-.25)/.18):t<.54?34:34*(1-(t-.54)/.46);
          x+=push*m.dx;y+=push*m.dy*.4;sx=1+Math.sin(t*Math.PI*2)*.065;sy=2-sx;angle=-m.dx*Math.sin(t*Math.PI)*4;
        }else{
          const kick=t<.15?t/.15:t<.32?1:(1-t)/.68,amount=m.strong?22:12;
          x+=m.dx*amount*kick;y+=m.dy*amount*kick;angle=m.dx*kick*(m.strong?7:4);sx=1+.13*kick;sy=1-.12*kick;
          if(t<.32)n.getComponent(Sprite)!.color=new Color(255,205,175);
          if(m.kind==='death'){alpha=255*(1-t);sx*=1-.18*t;sy*=1-.18*t;y-=18*t;}
        }
        if(t>=1)this.motions.delete(i);
      }else if(alpha){const breath=Math.sin(this.clock*3+i)*.01;sx=i>=3?1-breath:1;sy=1+breath;}
      n.setPosition(x,y);n.setScale(sx,sy,1);n.angle=angle;this.opacity(n).opacity=alpha;
    });
    this.effects=this.effects.filter(f=>{
      f.age+=dt;const t=Math.min(1,f.age/f.life);
      if(f.kind==='projectile'){const e=t*t;f.node.setPosition(f.x+(f.tx-f.x)*e,f.y+(f.ty-f.y)*e);}
      else{const s=.65+Math.min(1,t*3)*.55;f.node.setScale(s,s,1);this.opacity(f.node).opacity=255*(1-t);}
      if(t>=1){f.node.destroy();return false;}return true;
    });
  }
}
