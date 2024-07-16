import { 
  createContextId, type QRL, $, 
  noSerialize,
  NoSerialize 
} from "@builder.io/qwik";
import { 
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from "date-fns";

export type TimerStoreType = {

  hours: number
  started: boolean

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

  hours: 0,
  started: false,

  setHours: $(async function(this: TimerStoreType, hours: number){

    await this._stop()
    this.hours = hours

    if(this.videoRunning){
      this._start()
    }

  }),

  videoRunning: false,
  setVideoRunning: $(function(this:TimerStoreType, val: boolean){
    this.videoRunning = val
    
    if(this.videoRunning && this.hours && !this.started){
      this._start()
    }
    
  }),

  _interval: null,
  _start: $(function(this: TimerStoreType){

    if(!this.hours){
      console.error("can't start without hours set")
      return;
    }

    if(!this.hours){
      console.error('hours not set')
      return;
    }

    const endTime = new Date()
    endTime.setHours( endTime.getHours() + this.hours )
    // endTime.setSeconds( endTime.getSeconds() + 15 )
    const endTimeMs = endTime.valueOf()
    
    const interval = setInterval(() => {
    
      const now = new Date().valueOf()

      if(now >= endTimeMs){
        this._end()
      }else{
        const gap = endTimeMs - now
        const hours = millisecondsToHours( gap )
        const hoursMs = hours * 60 * 60 * 1000
        const minutes = millisecondsToMinutes( gap - hoursMs )
        const minutesMs = minutes * 60 * 1000
        const seconds = millisecondsToSeconds( gap - hoursMs - minutesMs )
        this.remainingTime = `${hours}:${minutes}:${seconds}`
      }
      
    },500)
    
    this._interval = noSerialize({ i: interval })

  }),

  _stop: $(function(this: TimerStoreType){
    
    if(this._interval?.i){
      clearInterval(this._interval.i)
      this._interval = null
    }

    this.remainingTime = '~'
    this.hours = 0
    this.started = false
    
  }),

  _end: $(function(this: TimerStoreType){
    
    this._stop()
    
    this.videoRunning && 
    this._onEndListener && 
    this._onEndListener()
    
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