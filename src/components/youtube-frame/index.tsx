import { $, component$, noSerialize, useContext, useId, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";
import { AutoplayContext } from "~/lib/autoplay-store";
import { TimerContext } from "~/lib/timer-store";

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)
  const iframe = useId()

  const { 
    autoplay, 
  } = useContext(AutoplayContext)

  const { 
    onEnd: onTimerEnd, 
    setVideoRunning
  } = useContext(TimerContext)

  const firstOpen = useSignal(true)
  const paused = useSignal(false)
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.addEventListener(
      "message",
      (event) => {
        
        if(event.origin !== window.location.origin) return;

        console.log('event.data', event.data)

        const frame = document.getElementById(iframe) as HTMLIFrameElement
        if(event.data === 'ready'){
          
          if(autoplay && !firstOpen.value) {
            frame.contentWindow?.postMessage('play', window.location.origin)
          }

          onTimerEnd(() => {
            frame.contentWindow?.postMessage('fadeout', window.location.origin)
          })

          firstOpen.value = false

        }
        
        if(event.data.match('playing:')){
          console.log('pause')
          paused.value = false
          setVideoRunning(true)
        }

        if(event.data === 'ended'){
          console.log('ended')
          setVideoRunning(false)
        }

        if(event.data === 'paused'){
          console.log('paused')
          setVideoRunning(false)
          paused.value = true
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
    { paused.value ? <p class={styles.paused}>Paused</p> : null }
  </div> : null

})
