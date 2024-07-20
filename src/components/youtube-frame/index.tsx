import { 
  component$, useContext, 
  useId, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";
import { PlayOnClickContext } from "~/lib/playonclick-store";
import { TimerContext } from "~/lib/timer-store";
import { VolumeContext } from "~/lib/volume-store";
import { isServer } from "@builder.io/qwik/build";
import { type DataTransferType } from "./data-transfer-type";
import { BookmarkContext } from "~/lib/bookmark-store";

const BookmarkFilled = () => <svg xmlns="http://www.w3.org/2000/svg" 
xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="bookmarkfilled" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,0,0,1)" />
      <stop offset="5%" stop-color="rgba(255,138,138,1)" />
      <stop offset="100%" stop-color="rgba(255,0,0,1)" />
    </linearGradient>
    <linearGradient id="bookmarkfilledhover" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,0,0,1)" />
      <stop offset="5%" stop-color="#ffb4b4" />
      <stop offset="100%" stop-color="rgba(255,0,0,1)" />
    </linearGradient>
    <linearGradient id="bookmarkemptyhover" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffe0e0" />
      <stop offset="5%" stop-color="#ff8787" />
      <stop offset="100%" stop-color="#ffd4d4" />
    </linearGradient>
    <linearGradient id="bookmarkempty" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f0f0f0" />
      <stop offset="5%" stop-color="#9b9b9b" />
      <stop offset="100%" stop-color="#f3f3f3" />
    </linearGradient>
  </defs>
  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3l7 3V5c0-1.1-.9-2-2-2z"></path></svg>

export const YoutubeFrame = component$(() => {

  const iframe = useId()

  const { 
    video,
    loop,
    onPlayListener
  } = useContext(VideoContext)
  
  const { 
    cache,
    add,
    remove
  } = useContext(BookmarkContext)

  const { 
    playOnClick,
  } = useContext(PlayOnClickContext)

  const { 
    onEnd: onTimerEnd, 
    setVideoRunning
  } = useContext(TimerContext)

  const {
    master
  } = useContext(VolumeContext)

  const firstOpen = useSignal(true)
  const paused = useSignal(false)

  useTask$(({ track }) => {

    track(() => master)
    if(isServer) return;

    const frame = document.getElementById(iframe) as HTMLIFrameElement
    frame && frame.contentWindow?.postMessage({
      event: 'mastervol',
      data: master
    } as DataTransferType, window.location.origin)

    
    
  })
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    window.addEventListener(
      "message",
      (event) => {
        
        if(event.origin !== window.location.origin) return;

        const { data } : { data: DataTransferType } = event

        const frame = document.getElementById(iframe) as HTMLIFrameElement
        if(data.event === 'ready'){

          if(playOnClick && !firstOpen.value && !data.data.wasDone) {
            frame.contentWindow?.postMessage( { 
              event: 'play',
              data: {
                masterVolume: master
              } 
            }, window.location.origin)
          }

          else if(data.data.wasDone && loop){
            frame.contentWindow?.postMessage({ 
              event: 'play',
            }, window.location.origin)
          }

          onTimerEnd(() => {
            frame.contentWindow?.postMessage({ event: 'fadeout' }, window.location.origin)
          })

          firstOpen.value = false

        }
        
        if(data.event === 'playing'){
          paused.value = false
          setVideoRunning(true)

          if(video) for(let k in onPlayListener){
            onPlayListener[k] && onPlayListener[k](video, data.data.loop)
          }
        }

        if(data.event ===  'ended'){
          setVideoRunning(false)
        }

        if(data.event ===  'paused'){
          setVideoRunning(false)
          paused.value = true
        }
    
      },
      false,
    );
  }, { strategy: 'document-ready' })

  return video && video.id ? <div class={styles.container}>
    <iframe
      id={iframe}
      src={`/frame/?id=${video.id}`}
      width="100%"
      height="100%"
    />
    <button 
      onClick$={() => cache[video.id] ? remove(video) : add(video)}
      class={`${styles.bookmarkButton} ${cache[video.id] ? styles.on : ''}`}>{
      <BookmarkFilled />
    }</button>
    <a href={`https://www.youtube.com/watch?v=${video.id}`} 
      target="_blank" class={styles.youtubeLogo}></a>
    { video.isLive ? <p class={styles.live}>Live</p> : null }
    { paused.value ? <p class={styles.paused}>Paused</p> : null }
  </div> : null

})
