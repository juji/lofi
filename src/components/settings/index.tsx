import { component$ } from '@builder.io/qwik'
import styles from './style.module.css'
import { Autoplay } from './autoplay'
import { Timer } from './timer'
import { Volume } from './volume'
import { Loop } from './loop'

export const Settings = component$(() => {

  return <div class={styles.container}>
    <div class={styles.top}>
      <h2>Settings</h2>
      <hr />
      <Autoplay />
      <Loop />
      <Timer />
    </div>
    <div class={styles.bottom}>
      <Volume />
    </div>
  </div>

})


