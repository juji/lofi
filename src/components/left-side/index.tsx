import { component$ } from "@builder.io/qwik";
import styles from './style.module.css'
import { YoutubeFrame } from "../youtube-frame";
import { Settings } from "../settings";

export const LeftSide = component$(() => {

  return <div class={styles.container}>
    <YoutubeFrame />
    <Settings />
  </div>

})