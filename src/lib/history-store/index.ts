import { $, createContextId, type QRL, NoSerialize, noSerialize } from "@builder.io/qwik";
import type { YoutubeVideo } from "../search";
import { VideoStoreType } from "../video-store";
import { write, remove, getPage, type YoutubeVideoHistory } from './db'

export type HistoryStoreType = {
  
  videoStore: VideoStoreType | null
  init: QRL<(this:HistoryStoreType, videoStore: VideoStoreType) => void>

  add: QRL<(this:HistoryStoreType, video: YoutubeVideo) => void> 
  remove: QRL<(this:HistoryStoreType, item: YoutubeVideoHistory) => Promise<YoutubeVideoHistory|null>>
  get: QRL<(this:HistoryStoreType, lastId?: string) => Promise<YoutubeVideoHistory[]>> 

  onWriteListener: NoSerialize<(data: YoutubeVideoHistory) => void> | null
  onWrite: QRL<(this:HistoryStoreType, fn: (data: YoutubeVideoHistory) => void) => void> 
  
}

export const HistoryContext = createContextId<HistoryStoreType>('HistoryContext'); 

export const HistoryStore: HistoryStoreType = {

  videoStore: null,
  init: $(async function(this: HistoryStoreType, videoStore: VideoStoreType){

    videoStore.onChange('history', (video:YoutubeVideo) => {
      this.add(video)
    })

    this.videoStore = videoStore

  }),
  
  add: $(async function(this: HistoryStoreType, video: YoutubeVideo){
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
  }) 

}