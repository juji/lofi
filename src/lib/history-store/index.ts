import { $, createContextId, type QRL, NoSerialize, noSerialize } from "@builder.io/qwik";
import type { YoutubeVideo } from "../search";
import { VideoStoreType } from "../video-store";
import { write, remove, getPage, type YoutubeVideoHistory } from './db'

export type HistoryStoreType = {
  
  init: QRL<(this:HistoryStoreType, videoStore: VideoStoreType) => void>

  addHistory: QRL<(this:HistoryStoreType, video: YoutubeVideo) => void> 
  remove: QRL<(this:HistoryStoreType, item: YoutubeVideoHistory) => Promise<YoutubeVideoHistory|null>>
  get: QRL<(this:HistoryStoreType, lastId?: string) => Promise<YoutubeVideoHistory[]>> 

  onWriteListener: NoSerialize<(data: YoutubeVideoHistory) => void> | null
  onWrite: QRL<(this:HistoryStoreType, fn: (data: YoutubeVideoHistory) => void) => void> 

  index: number
  moveIndex: QRL<(this:HistoryStoreType, num: number) => void> 
  
}

export const HistoryContext = createContextId<HistoryStoreType>('HistoryContext'); 

export const HistoryStore: HistoryStoreType = {

  init: $(async function(this: HistoryStoreType, videoStore: VideoStoreType){
    
    videoStore.onPlay('history', (video:YoutubeVideo, isRepeat: boolean) => {
      console.log('onPlay', video, isRepeat)
      if(!isRepeat) this.addHistory(video)
    })
    
  }),
  
  addHistory: $(async function(this: HistoryStoreType, video: YoutubeVideo){
    console.log('adding', video)
    const data = await write(video)
    this.onWriteListener && this.onWriteListener(data)
  }),
  
  remove: $(async function(this: HistoryStoreType, item: YoutubeVideoHistory){
    const history = await remove(item.key)
    return history
  }),
  
  get: $(async function(this: HistoryStoreType, lastId?: string){
    return await getPage(lastId)
  }),
  
  onWriteListener: null,
  onWrite: $(function(this:HistoryStoreType, fn: (data: YoutubeVideoHistory) => void){
    this.onWriteListener = noSerialize(fn)
  }),
  
  index: 0,
  moveIndex: $(function(this:HistoryStoreType, num: number){
    this.index += num
  })

}