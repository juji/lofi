import { $, createContextId, NoSerialize, noSerialize, type QRL } from "@builder.io/qwik";
import { lsCheckGet } from "./utils/ls-check-get";
import type { YoutubeVideo } from './search'

export type VideoStoreType = {
  video: YoutubeVideo | null
  elapsedTime: number
  change: QRL<(this:VideoStoreType, video:YoutubeVideo, report?: boolean, elapsedTime?: number) => void>

  onPlayListener: { [key: string]: NoSerialize<(video: YoutubeVideo, isRepeat: boolean) => void> }
  onPlay: QRL<(this:VideoStoreType, key: string, fn:(video: YoutubeVideo, isRepeat: boolean) => void) => void>

  init: QRL<(this:VideoStoreType) => void>

  loop: boolean
  setLoop: QRL<(this:VideoStoreType, bool: boolean) => void>

  setElapsedTime: QRL<(this:VideoStoreType, num: number) => void>
}

export const VideoContext = createContextId<VideoStoreType>('VideoContext');

export const VideoStore: VideoStoreType = {
  video: null,
  elapsedTime: 0,
  change: $(function(this: VideoStoreType, video: YoutubeVideo, report = true, elapsedTime = 0){
    if(this.video?.id === video.id) return;
    this.video = video
    this.elapsedTime = elapsedTime
    localStorage.setItem('video', JSON.stringify({ video, elapsedTime }))
  }),

  onPlayListener: {},
  onPlay: $(function(this: VideoStoreType, key: string, fn: (video: YoutubeVideo, isRepeat: boolean) => void){
    this.onPlayListener[key] = noSerialize(fn)
  }),

  init: $(function(this: VideoStoreType){

    // load lofi the first time
    // or something else from ls
    const lastData = lsCheckGet('video',{ 
      check: (d) => d.video && typeof d.elapsedTime === 'number' 
    })

    if(lastData) this.change(lastData.video, false, lastData.elapsedTime)
    else this.change({
      "id":"jfKfPfyJRdk",
      "type":"video",
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
  }),

  setElapsedTime: $(function(this:VideoStoreType, elapsedTime: number){
    this.elapsedTime = elapsedTime
    localStorage.setItem('video', JSON.stringify({ 
      video: this.video, 
      elapsedTime 
    }))
  })

}