import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'

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
    let downVolumeInterval: ReturnType<typeof setInterval>|null = null
    let upVolumeInterval: ReturnType<typeof setInterval>|null = null

    videoElement.addEventListener('loadstart', function () {
      window.top?.postMessage('ready', window.location.origin)
    })

    videoElement.addEventListener('playing', function () {
      
      downVolumeInterval && clearInterval(downVolumeInterval)
      downVolumeInterval = null
      upVolumeInterval = setInterval(() => {
  
        if(volume >= 100) {
          console.log('done setting volume')
          volume = 100
          videoElement.setVolume(volume)
          upVolumeInterval && clearInterval(upVolumeInterval)
          upVolumeInterval = null

        } else {

          volume = Math.min(100, volume + (volume * 0.5))
          console.log('setting volume', volume)
          videoElement.setVolume(volume)

        }

      },500)

      window.top?.postMessage(`playing:${id}`, window.location.origin)
    });
    
    videoElement.addEventListener('pause', function () {
      window.top?.postMessage('paused', window.location.origin)
    });
    
    videoElement.addEventListener('ended', function () {
      window.top?.postMessage('ended', window.location.origin)
    });

    window.addEventListener(
      "message",
      (event) => {

        if(event.origin !== window.location.origin) return;
        console.log(event.data)

        if(event.data === 'play'){
          videoElement.play()
        }

        if(event.data === 'fadeout'){
          console.log('videoElement', videoElement)
          upVolumeInterval && clearTimeout(upVolumeInterval)
          upVolumeInterval = null
          downVolumeInterval = setInterval(() => {
    
            if(volume <= 2) {
              console.log('pause video')
              videoElement.pause()
              downVolumeInterval && clearInterval(downVolumeInterval)
              downVolumeInterval = null
            } else {
              volume = volume - (volume*0.1)
              console.log('setting volume', volume)
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
      src="/node_modules/@juji/youtube-video-js/dist/youtube-video.js"
    ></script>
    <youtube-video
      width="100%"
      height="100%"
      src={`https://www.youtube.com/watch?v=${id}`}
    />
  </div> : null

})