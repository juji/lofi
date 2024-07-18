import { $, component$, useContext } from "@builder.io/qwik";
import styles from './style.module.css'
import { AutoplayContext } from "~/lib/autoplay-store";

export const Autoplay = component$(() => {

  const { on, off, autoplay } = useContext(AutoplayContext)

  return <div class={styles.container}>
    <label class={styles.label}>
      <input onChange$={$(e => { 
          const elm = e.target as HTMLInputElement
          if(elm.checked) on()
          else off()
        })}
        type="checkbox"
        checked={autoplay}
      />
      <span>
        <span></span>
      </span>
      <span>
        Autoplay
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" 
          viewBox="0 0 24 24" width="24" height="24"><path d="m15.146 12.354-5.792 5.792a.5.5 0 0 1-.854-.353V6.207a.5.5 0 0 1 .854-.353l5.792 5.792a.5.5 0 0 1 0 .708Z"></path></svg>

      </span>
    </label>
  </div>

})