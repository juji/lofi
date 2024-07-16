import { 
  createContextId, type QRL, $, 
  noSerialize,
  NoSerialize 
} from "@builder.io/qwik";

export type VolumeStoreType = {

  master: number
  setMaster: QRL<(this:VolumeStoreType, master: number) => void>
  
}

export const VolumeContext = createContextId<VolumeStoreType>('VolumeContext');

export const VolumeStore:VolumeStoreType = {

  master: 100,

  setMaster: $(function( val: number ){
    this.master = val
  }),
    
}