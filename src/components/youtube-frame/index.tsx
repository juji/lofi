import { $, component$, noSerialize, useContext, useId, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";
import { PlayerContext } from "~/lib/player-store";
import { AutoplayContext } from "~/lib/autoplay-store";
import { TimerContext } from "~/lib/timer-store";

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)
  const iframe = useId()

  const { 
    playing, stopping, pausing,
  } = useContext(PlayerContext)

  const { 
    autoplay, 
  } = useContext(AutoplayContext)

  const { 
    start, onEnd
  } = useContext(TimerContext)

  let firstOpen = useSignal(true)
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.addEventListener(
      "message",
      (event) => {
        
        if(event.origin !== window.location.origin) return;

        const frame = document.getElementById(iframe) as HTMLIFrameElement
        if(event.data === 'ready'){
          
          if(autoplay && !firstOpen.value) {
            start()
            frame.contentWindow?.postMessage('play', window.location.origin)
          }

          onEnd(() => {
            frame.contentWindow?.postMessage('fadeout', window.location.origin)
          })

          firstOpen.value = false

        }
        
        if(event.data.match('playing:')){
          playing(event.data.split(':').pop())
          console.log('playing', event.data)
          if(!autoplay) start()
        }

        if(event.data === 'ended'){
          stopping()
        }

        if(event.data === 'pause'){
          pausing()
        }
    
      },
      false,
    );
  }, { strategy: 'document-idle' })

  return id ? <div class={styles.container}>
    <iframe
      id={iframe}
      src={`/frame/?id=${id}`}
      width="100%"
      height="100%"
    />
  </div> : null

})
