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
      <span>Autoplay</span>
    </label>
  </div>

})