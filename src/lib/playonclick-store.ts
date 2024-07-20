import { $, createContextId, type QRL } from "@builder.io/qwik";

export type PlayOnClickStoreType = {
  playOnClick: boolean
  
  on: QRL<(this:PlayOnClickStoreType) => void>
  off: QRL<(this:PlayOnClickStoreType) => void>

  init: QRL<(this:PlayOnClickStoreType) => void>
}

export const PlayOnClickContext = createContextId<PlayOnClickStoreType>('PlayOnClickContext');

export const PlayOnClickStore: PlayOnClickStoreType = {
  playOnClick: false,
  
  on: $(function(this: PlayOnClickStoreType){
    this.playOnClick = true
    localStorage.setItem('playOnClick', '1')
  }),
  off: $(function(this: PlayOnClickStoreType){
    this.playOnClick = false
    localStorage.setItem('playOnClick', '0')
  }),

  init: $(function(this: PlayOnClickStoreType){

    const a = localStorage.getItem('playOnClick')
    if(a && a === '0') this.off()
    else this.on()

  })
}