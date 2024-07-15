import { 
  createContextId, type QRL, $, 
  NoSerialize 
} from "@builder.io/qwik";

export type PlayerStoreType = {

  videoId: string
  paused: boolean
  
  playing: QRL<(this:PlayerStoreType, videoId: string) => void>
  stopping: QRL<(this:PlayerStoreType) => void>
  pausing: QRL<(this:PlayerStoreType) => void>

}

export const PlayerContext = createContextId<PlayerStoreType>('PlayerContext');
export const PlayerStore:PlayerStoreType = {

  videoId: '',
  paused: false,

  playing: $(function(this:PlayerStoreType, videoId: string){
    this.videoId = videoId
    this.paused = false
  }),
  stopping: $(function(this:PlayerStoreType){
    this.videoId = ''
    this.paused = false
  }),
  pausing: $(function(this:PlayerStoreType){
    this.videoId = ''
    this.paused = true
  }),

}