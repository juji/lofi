import { component$, useContext } from "@builder.io/qwik";
import styles from './style.module.css'
import { History } from "../history";
import { YoutubeFrame } from "../youtube-frame";
import { Settings } from "../settings";

export const LeftSide = component$(() => {

  return <div class={styles.container}>
    <History />
    <YoutubeFrame />
    <Settings />
  </div>

})