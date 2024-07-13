import { component$, useContext } from "@builder.io/qwik";
import { VideoContext } from "~/lib/video-store";
import styles from './style.module.css'

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)

  // https://developers.google.com/youtube/player_parameters
  const encoded = new URLSearchParams({
    autoplay: '0',
    controls: '0',
    fs: '0',
    iv_load_policy: '3',
  }).toString()

  return id ? <div class={styles.container}>
    <iframe
    src={`https://www.youtube.com/embed/${id}?${encoded}`} 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>
  </div> : null

})