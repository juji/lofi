import { $, createContextId, NoSerialize, noSerialize, type QRL } from "@builder.io/qwik";
import { lsCheckGet } from "./utils/ls-check-get";
import type { YoutubeVideo } from './search'

export type VideoStoreType = {
  video: YoutubeVideo | null
  change: QRL<(this:VideoStoreType, video:YoutubeVideo, report?: boolean) => void>
  getFromStorage: QRL<(this:VideoStoreType) => YoutubeVideo|null>

  onChangeListener: { [key: string]: NoSerialize<(video: YoutubeVideo) => void> }
  onChange: QRL<(this:VideoStoreType, key: string, fn:(video: YoutubeVideo) => void) => void>

  init: QRL<(this:VideoStoreType) => void>

  loop: boolean
  setLoop: QRL<(this:VideoStoreType, bool: boolean) => void>
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
    }
    return null
  }),
  change: $(function(this: VideoStoreType, video: YoutubeVideo, report = true){
    this.video = video
    this.loop =false
    localStorage.setItem('video', JSON.stringify(video))
    for( let key in this.onChangeListener ){
      if(!report && key === 'history') continue;
      if(this.onChangeListener[key]){
        const listener = this.onChangeListener[key]
        listener && listener(video)
      }
    }
  }),

  onChangeListener: {},
  onChange: $(function(this: VideoStoreType, key: string, fn: (video: YoutubeVideo) => void){
    this.onChangeListener[key] = noSerialize(fn)
  }),

  init: $(function(this: VideoStoreType){

    // load lofi the first time
    // or something else from ls
    const video = lsCheckGet('video',{ check: (d) => d.id && d.channelTitle })
    if(video) this.change(video, false)
    else this.change({
      "id":"jfKfPfyJRdk","type":"video",
      "thumbnail":{
        "thumbnails":[{
          "url":"https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          "width":720,"height":404
        }]
      },
      "title":"lofi hip hop radio 📚 - beats to relax/study to",
      "channelTitle":"Lofi Girl",
      "isLive":true
    })

  }),

  loop: false,
  setLoop: $(function(this:VideoStoreType, bool: boolean){
    this.loop = bool
  })

}