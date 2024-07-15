import { 
  createContextId, type QRL, $, 
  noSerialize,
  NoSerialize 
} from "@builder.io/qwik";

export type VolumeStoreType = {

  master: number
  setMaster: QRL<(this:VolumeStoreType, master: number) => void>

  _volumeChangeListener: NoSerialize<(val: number) => void> | null
  onVolumeChange: QRL<(this:VolumeStoreType, fn: ( val: number ) => void) => void>
  
}

export const VolumeContext = createContextId<VolumeStoreType>('VolumeContext');

export const VolumeStore:VolumeStoreType = {

  master: 100,

  setMaster: $(function( val: number ){
    this.master = val
    if(this._volumeChangeListener) this._volumeChangeListener(val)
  }),

  _volumeChangeListener: null,

  onVolumeChange: $(function( this:VolumeStoreType, fn: ( val: number ) => void ){
    this._volumeChangeListener = noSerialize(fn)
  })

  
    
}