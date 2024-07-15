

export type DataTransferType = {
  event: 'playing' | 'ended' | 'paused' | 'ready' | 'play' | 'fadeout' | 'mastervol',
  data: any
}