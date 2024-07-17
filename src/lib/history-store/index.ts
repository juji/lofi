import { $, createContextId, type QRL } from "@builder.io/qwik";
import type { YoutubeVideo } from "../search";
import { VideoStoreType } from "../video-store";
import { write, getPage, type YoutubeVideoHistory } from './db'

export type HistoryStoreType = {
  
  videoStore: VideoStoreType | null
  init: QRL<(this:HistoryStoreType, videoStore: VideoStoreType) => void>

  add: QRL<(this:HistoryStoreType, video: YoutubeVideo) => void> 
  get: QRL<(this:HistoryStoreType, lastId?: string) => Promise<YoutubeVideoHistory[]>> 
  
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
  
  add: $(function(this: HistoryStoreType, video: YoutubeVideo){
    write(video)
  }),

  get: $(async function(this: HistoryStoreType, lastId?: string){
    return await getPage(lastId)
  }),

}