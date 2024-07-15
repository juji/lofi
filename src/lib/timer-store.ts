import { 
  createContextId, type QRL, $, 
  noSerialize,
  NoSerialize 
} from "@builder.io/qwik";
import { 
  formatDistanceToNowStrict,
} from "date-fns";

export type TimerStoreType = {

  hours: number | null
  setHours: QRL<(this:TimerStoreType, hours: number) => void>

  videoRunning: boolean
  setVideoRunning: QRL<(this:TimerStoreType, val: boolean) => void>

  _interval: NoSerialize<{ i: ReturnType<typeof setInterval> }> | null
  _start: QRL<(this:TimerStoreType) => void>
  _stop: QRL<(this:TimerStoreType) => void>
  _end: QRL<(this:TimerStoreType) => void>
   
  _onEndListener: NoSerialize<() => void> | null
  onEnd: QRL<(this:TimerStoreType, fn: () => void) => void>
  
  remainingTime: string

  cancel: QRL<(this:TimerStoreType) => void>
  
}

export const TimerContext = createContextId<TimerStoreType>('TimerContext');

export const TimerStore:TimerStoreType = {

  hours: null,

  setHours: $(function(this: TimerStoreType, hours: number){
    
    this._stop()
    this.hours = hours

    if(this.videoRunning){
      this._start()
    }

  }),

  videoRunning: false,
  setVideoRunning: $(function(this:TimerStoreType, val: boolean){
    this.videoRunning = val
    
    if(this.videoRunning && this.hours){
      this._start()
    }
    
  }),

  _interval: null,
  _start: $(function(this: TimerStoreType){

    if(!this.hours){
      console.error("can't start without hours set")
      return;
    }

    const startTime = new Date()
    const endTime = new Date()
    endTime.setHours(endTime.getHours() + this.hours)
    const startTimeMs = startTime.valueOf()
    
    const interval = setInterval(() => {
    
      console.log('interval running')
      const now = new Date().valueOf()

      if(now >= startTimeMs){
        this._end()
      }else{
        this.remainingTime = formatDistanceToNowStrict( endTime )
      }
      
    },500)
    
    this._interval = noSerialize({ i: interval })

  }),

  _stop: $(function(this: TimerStoreType){
    
    if(this._interval?.i){
      clearInterval(this._interval.i)
      this._interval = null
    }
    
  }),

  _end: $(function(this: TimerStoreType){
    
    this._stop()
    this._onEndListener && this._onEndListener()
    
  }),

  _onEndListener: null,
  onEnd: $(function(this:TimerStoreType, fn: () => void) {
    this._onEndListener = noSerialize(fn)
  }),

  remainingTime: '~',


  cancel: $(function(this: TimerStoreType){
    
    this._stop()
    
  }),
    
}