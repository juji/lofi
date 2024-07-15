import { $, component$, noSerialize, useContext, useId, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";
import { AutoplayContext } from "~/lib/autoplay-store";
import { TimerContext } from "~/lib/timer-store";
import { VolumeContext } from "~/lib/volume-store";

import { DataTransferType } from "./data-transfer-type";

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

  const {
    master,
    onVolumeChange
  } = useContext(VolumeContext)

  const firstOpen = useSignal(true)
  const paused = useSignal(false)
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    onVolumeChange((vol: number) => {
      console.log('on vol change')
      const frame = document.getElementById(iframe) as HTMLIFrameElement
      frame.contentWindow?.postMessage({
        event: 'mastervol',
        data: vol
      } as DataTransferType, window.location.origin)
    })

    window.addEventListener(
      "message",
      (event) => {
        
        if(event.origin !== window.location.origin) return;

        const { data } : { data: DataTransferType } = event

        const frame = document.getElementById(iframe) as HTMLIFrameElement
        if(data.event === 'ready'){
          
          if(autoplay && !firstOpen.value) {
            frame.contentWindow?.postMessage( { 
              event: 'play',
              data: {
                masterVolume: master
              } 
            }, window.location.origin)
          }

          onTimerEnd(() => {
            frame.contentWindow?.postMessage({ event: 'fadeout' }, window.location.origin)
          })

          firstOpen.value = false

        }
        
        if(data.event === 'playing'){
          console.log('pause')
          paused.value = false
          setVideoRunning(true)
        }

        if(data.event ===  'ended'){
          console.log('ended')
          setVideoRunning(false)
        }

        if(data.event ===  'paused'){
          console.log('paused')
          setVideoRunning(false)
          paused.value = true
        }
    
      },
      false,
    );
  }, { strategy: 'document-ready' })

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
