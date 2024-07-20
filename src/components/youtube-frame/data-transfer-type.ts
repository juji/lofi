

export type DataTransferType = {
  event: 'playing' | 'ended' | 'paused' | 'ready' | 'play' | 
         'fadeout' | 'mastervol' | 'elapsedTime' | 'setElapsedTime',
  data: any
}