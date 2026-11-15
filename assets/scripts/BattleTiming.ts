/** Battle time only: callers settle idle income using the unscaled wall clock. */
export function battleDelta(frame:number,paused:boolean,speed:number){
  if(paused||!Number.isFinite(frame)||frame<=0)return 0;
  return Math.min(frame,.1)*(speed===2?2:1);
}
