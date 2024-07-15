import { component$ } from '@builder.io/qwik'
import styles from './style.module.css'
import { Autoplay } from './autoplay'
import { Timer } from './timer'

export const Settings = component$(() => {

  return <div class={styles.container}>
    <h2>Settings</h2>
    <hr />
    <Autoplay />
    <Timer />

  </div>

})


