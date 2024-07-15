import { $, component$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'

type Video = {
  play: () => void
  pause: () => void
  setVolume: (n: number) => void
  addEventListener: ( key: string, f: () => void ) => void
}

export const YoutubeVideo = component$<{id: string }>(({ id }) => {

  useVisibleTask$(() => {

    const videoElement = document.querySelector('youtube-video') as Video|null

    if(!videoElement) {
      console.error('video gone')
      return;
    }

    videoElement.addEventListener('loadstart', function () {
      window.top?.postMessage('ready', window.location.origin)
    })

    window.addEventListener(
      "message",
      (event) => {

        if(event.origin !== window.location.origin) return;
        console.log(event.data)
    
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