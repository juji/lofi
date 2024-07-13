import { component$, useContext } from "@builder.io/qwik";
import { VideoContext } from "~/lib/video-store";
import styles from './style.module.css'

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)

  return id ? <div class={styles.container}>
    <iframe
    src={`https://www.youtube.com/embed/${id}`} 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" allowFullscreen></iframe>
  </div> : null

})