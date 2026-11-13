export interface StoragePort {getItem(key:string):string|null;setItem(key:string,value:string):void;}
export const SAVE_KEY='s6game.progress.v1';
export const BACKUP_KEY=SAVE_KEY+'.backup';
// The caller validates the complete game schema before accepting a slot.
export class LocalSave<T> {
  private lastGood:string|null=null;
  error='';private blocked=false;private storage:StoragePort;private decode:(raw:unknown)=>T|null;
  constructor(storage:StoragePort,decode:(raw:unknown)=>T|null){this.storage=storage;this.decode=decode;}
  load():T|null{
    let damaged=false;
    for(const key of [SAVE_KEY,BACKUP_KEY]){
      try{const raw=this.storage.getItem(key);if(raw===null)continue;const value=this.decode(JSON.parse(raw));if(value){this.lastGood=raw;this.error=damaged?'主存档异常，已恢复备份':'';return value;}damaged=true;}
      catch{damaged=true;}
    }
    this.blocked=damaged;this.error=damaged?'存档异常，已保留原文件并停止自动保存':'';return null;
  }
  save(value:unknown):boolean{
    if(this.blocked)return false;
    try{
      if(!this.decode(value))throw new Error('Invalid snapshot');
      const raw=JSON.stringify(value);
      if(this.lastGood)this.storage.setItem(BACKUP_KEY,this.lastGood);
      this.storage.setItem(SAVE_KEY,raw);this.lastGood=raw;this.error='';return true;
    }catch{this.error='本地存档失败，请检查浏览器存储空间或权限';return false;}
  }
}
