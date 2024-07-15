import { component$, useContext, useId, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";

export const YoutubeFrame = component$(() => {

  const { id } = useContext(VideoContext)
  const iframe = useId()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.addEventListener(
      "message",
      (event) => {

        // const frame = document.getElementById(iframe) as HTMLIFrameElement
        // if(!frame){
        //   return;
        // }
        if(event.origin !== window.location.origin) return;
        console.log(event.origin)
        console.log(event.data)
    
        // …
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
