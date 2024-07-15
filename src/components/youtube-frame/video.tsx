import { component$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import type { DataTransferType } from "./data-transfer-type";

type Video = {
  play: () => void
  pause: () => void
  setVolume: (n: number) => void
  getVolume: () => number
  addEventListener: ( key: string, f: () => void ) => void
}

export const YoutubeVideo = component$<{id: string }>(({ id }) => {

  useVisibleTask$(() => {

    const videoElement = document.querySelector('youtube-video') as Video|null

    if(!videoElement) {
      console.error('video gone')
      return;
    }

    let volume = 100
    let masterVolume = 100
    let downVolumeInterval: ReturnType<typeof setInterval>|null = null
    let upVolumeInterval: ReturnType<typeof setInterval>|null = null

    videoElement.addEventListener('loadstart', function () {
      window.top?.postMessage({ event: 'ready' }, window.location.origin)
    })

    videoElement.addEventListener('playing', function () {
      
      // fadein sound
      downVolumeInterval && clearInterval(downVolumeInterval)
      downVolumeInterval = null
      upVolumeInterval = setInterval(() => {
  
        if(volume >= 100) {
          volume = 100
          videoElement.setVolume(volume * masterVolume / 100)
          upVolumeInterval && clearInterval(upVolumeInterval)
          upVolumeInterval = null

        } else {

          volume = Math.min(100, volume + (volume * 0.5))
          videoElement.setVolume(volume)

        }

      },500)

      window.top?.postMessage({ event: 'playing' }, window.location.origin)
    });
    
    videoElement.addEventListener('pause', function () {
      window.top?.postMessage({ event: 'paused' }, window.location.origin)
    });
    
    videoElement.addEventListener('ended', function () {
      window.top?.postMessage({ event: 'ended' }, window.location.origin)
    });

    window.addEventListener(
      "message",
      (event) => {

        if(event.origin !== window.location.origin) return;

        const { data:transfer } : {
          data: DataTransferType
        } = event

        if(transfer.event === 'mastervol'){
          if(typeof transfer.data === 'number') masterVolume = transfer.data
          videoElement.setVolume(volume * masterVolume / 100)
        }

        if(transfer.event === 'play'){

          if(typeof transfer.data.masterVolume === 'number') 
            masterVolume = transfer.data.masterVolume

          videoElement.play()
          videoElement.setVolume(volume * masterVolume / 100)
        }

        if(transfer.event === 'fadeout'){
          
          // fadeout sound
          upVolumeInterval && clearTimeout(upVolumeInterval)
          upVolumeInterval = null
          downVolumeInterval = setInterval(() => {
    
            if(volume <= 2) {

              videoElement.pause()
              downVolumeInterval && clearInterval(downVolumeInterval)
              downVolumeInterval = null

            } else {

              volume = volume - (volume*0.1)
              videoElement.setVolume(volume)

            }
    
          },500)
        }
    
        // …
      },
      false,
    );

  })

  return id ? <div class={styles.container}>
    <script
      type="module"
      // src="/node_modules/@juji/youtube-video-js/dist/youtube-video.js"
      src="/youtube-video.js"
    ></script>
    <youtube-video
      width="100%"
      height="100%"
      src={`https://www.youtube.com/watch?v=${id}`}
    />
  </div> : null

})