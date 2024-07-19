import { $, component$, useContext } from "@builder.io/qwik";
import styles from './style.module.css'
import { VideoContext } from "~/lib/video-store";

export const Loop = component$(() => {

  const { loop, setLoop } = useContext(VideoContext)

  return <div class={styles.container}>
    <label class={styles.label}>
      <input onChange$={$(e => { 
          const elm = e.target as HTMLInputElement
          setLoop(!!elm.checked)
        })}
        type="checkbox"
        checked={loop}
      />
      <span>
        <span></span>
      </span>
      <span>
        Loop
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
        width="24" height="24" fill="currentColor">
          <path d="M3.38 8A9.502 9.502 0 0 1 12 2.5a9.502 9.502 0 0 1 9.215 7.182.75.75 0 1 0 1.456-.364C21.473 4.539 17.15 1 12 1a10.995 10.995 0 0 0-9.5 5.452V4.75a.75.75 0 0 0-1.5 0V8.5a1 1 0 0 0 1 1h3.75a.75.75 0 0 0 0-1.5H3.38Zm-.595 6.318a.75.75 0 0 0-1.455.364C2.527 19.461 6.85 23 12 23c4.052 0 7.592-2.191 9.5-5.451v1.701a.75.75 0 0 0 1.5 0V15.5a1 1 0 0 0-1-1h-3.75a.75.75 0 0 0 0 1.5h2.37A9.502 9.502 0 0 1 12 21.5c-4.446 0-8.181-3.055-9.215-7.182Z"></path></svg>
      </span>
    </label>
  </div>

})