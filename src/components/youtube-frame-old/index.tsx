import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { VideoContext } from "~/lib/video-store";
import styles from './style.module.css'
import { AutoplayContext } from "~/lib/autoplay-store";

type YtProps = {
  id: string
  params: string
}


const FrameComponent = component$<YtProps>(({ id, params }) => {
  
  const { 
    autoplay, 
  } = useContext(AutoplayContext)

  
  useTask$(({ track, cleanup }) => {

    
    track(() => id)
    track(() => YT)
    if(!id) return;
    if(typeof YT === 'undefined') return;
    
    let player: any = null


    const inter = setInterval(() => {

      console.log('inter')
      if(typeof YT === 'undefined') return;
      if(typeof YT.Player === 'undefined') return;

      player = new YT.Player('ytplayer', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

      
      function onPlayerStateChange(event: any){
        if(event.data === YT.PlayerState.PAUSED){
          // pausing()
        }
        
        if(event.data === YT.PlayerState.PLAYING){
          // playing(id)
          console.log('player.getVolume', player.getVolume)
        }
    
        if(event.data === YT.PlayerState.ENDED){
          // stopping()
        }
      }
  
      function onPlayerReady(){
        console.log('player ready')
        player.setVolume(100)
        if(autoplay) player.playVideo()
      }

      console.log('video changed, setting up fadeout')
      console.log(player)

      clearInterval(inter)

    },300)

    cleanup(() => {
      console.log('video changed, cleaning up')
      player.destroy()
    })

  })

  return <div class={styles.container}>
    <iframe
    id='ytplayer'
    src={`https://www.youtube.com/embed/${id}?${params}`} 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>
  </div>

})

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)

  // https://developers.google.com/youtube/player_parameters
  const params = new URLSearchParams({
    autoplay: '0',
    enablejsapi: '1',
    controls: '0',
    fs: '0',
    iv_load_policy: '3',
  }).toString()

  return id ? <FrameComponent 
    params={params}
    id={id} 
  /> : null

})