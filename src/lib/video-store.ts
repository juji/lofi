import { $, createContextId, type QRL } from "@builder.io/qwik";

import type { YoutubeVideo } from './search'

export type VideoStoreType = {
  video: YoutubeVideo | null
  change: QRL<(this:VideoStoreType, video:YoutubeVideo) => void>
  getFromStorage: QRL<(this:VideoStoreType) => YoutubeVideo|null>
}

export const VideoContext = createContextId<VideoStoreType>('VideoContext');

export const VideoStore: VideoStoreType = {
  video: null,
  getFromStorage: $(function(this: VideoStoreType){
    const video = localStorage.getItem('video')
    if(video){
      try{
        const v = JSON.parse(video)
        if(!v.id || !v.channelTitle) {
          localStorage.removeItem('video') 
        }
        return v
      }catch(e){}
      return null
    }
    return null
  }),
  change: $(function(this: VideoStoreType, video: YoutubeVideo){
    this.video = video
    localStorage.setItem('video', JSON.stringify(video))
  })
}