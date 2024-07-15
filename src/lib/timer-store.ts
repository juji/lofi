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

  running: boolean
  remainingTime: string
  ended: boolean

  dateEnd: Date | null

  interval: NoSerialize<{ i: ReturnType<typeof setInterval> }> | null
  clearInterval: QRL<(this:TimerStoreType) => void>
  runInterval: QRL<(this:TimerStoreType) => void>

  setHours: QRL<(this:TimerStoreType, hours: number) => void>

  start: QRL<(this:TimerStoreType) => void>
  stop: QRL<(this:TimerStoreType) => void>
  _end: QRL<(this:TimerStoreType) => void>

  onEndListener: NoSerialize<() => void> | null
  onEnd: QRL<(this:TimerStoreType, fn: () => void) => void>

}

export const TimerContext = createContextId<TimerStoreType>('TimerContext');


function millisecondsToHours( ms: number ){
  return Math.ceil(
    ms / 1000 / 60 / 60
  )
}

export const TimerStore:TimerStoreType = {

  hours: null,

  running: false,
  remainingTime: '~',
  ended: false,

  dateEnd: null,

  setHours: $(function(this: TimerStoreType, hours: number){
    console.log('setting hours', hours)
    this.hours = hours
    if(this.running) {
      this.clearInterval()
      this.runInterval()
    }
  }),

  interval: null,
  clearInterval: $(function(this: TimerStoreType){
    if(this.interval && this.interval.i) {
      console.log('clear interval')
      clearInterval(this.interval.i)
      this.interval = null
    }
  }),
  runInterval: $(function(this: TimerStoreType){

    if(!this.hours) {
      console.log('Hours not set')
      return;
    }

    const date = new Date()
    
    // date.setHours( date.getHours() + this.hours )
    date.setSeconds( date.getSeconds() + 10 )

    this.dateEnd = date

    console.log('run Interval')

    const interval = setInterval(() => {

      console.log('interval running')

      // not happening
      if(!this.dateEnd) return this._end()

      if(new Date().valueOf() >= this.dateEnd?.valueOf()){
        this._end()
      }else{
        this.hours = millisecondsToHours( date.valueOf() - new Date().valueOf() )
        this.remainingTime = formatDistanceToNowStrict(date)
      }

    },500)

    this.interval = noSerialize({ i: interval })

  }),

  start: $(function(this: TimerStoreType){

    this.ended = false
    this.running = true

    this.runInterval()

  }),

  stop: $(function(this: TimerStoreType){

    this.clearInterval()

    this.hours = null
    this.running = false
    this.remainingTime = '~'

  }),

  _end: $(function(this: TimerStoreType){
    
    this.stop()
    this.ended = true
    this.onEndListener && this.onEndListener()

  }),

  onEndListener: null,
  onEnd: $(function(this:TimerStoreType, fn: () => void) {
    this.onEndListener = noSerialize(fn)
  })

}