import { $, component$, useContext } from "@builder.io/qwik";
import styles from './style.module.css'
import { VolumeContext } from "~/lib/volume-store";

export const Volume = component$(() => {

  const { setMaster } = useContext(VolumeContext)

  return <div class={styles.container}>
    <input 
    type="range" 
    min="0" 
    max="100"
    onInput$={$((e) => {
      const val = (e.target as HTMLInputElement)?.value
      setMaster(Number(val)||0)
    })}
    value={100} />
  </div>

})