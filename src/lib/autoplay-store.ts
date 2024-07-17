import { $, createContextId, type QRL } from "@builder.io/qwik";

export type AutoplayStoreType = {
  autoplay: boolean
  
  on: QRL<(this:AutoplayStoreType) => void>
  off: QRL<(this:AutoplayStoreType) => void>

  init: QRL<(this:AutoplayStoreType) => void>
}

export const AutoplayContext = createContextId<AutoplayStoreType>('AutoplayContext');

export const AutoPlayStore: AutoplayStoreType = {
  autoplay: false,
  // secondload: false,
  // onFirstLoad: $(function(this: AutoplayStoreType){
  //   this.secondload = true
  // }),
  on: $(function(this: AutoplayStoreType){
    this.autoplay = true
    localStorage.setItem('autoplay', '1')
  }),
  off: $(function(this: AutoplayStoreType){
    this.autoplay = false
    localStorage.setItem('autoplay', '0')
  }),

  init: $(function(this: AutoplayStoreType){

    const a = localStorage.getItem('autoplay')
    if(a && a === '0') this.off()
    else this.on()

  })
}