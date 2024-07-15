import { component$, useContext, useSignal, $, useTask$, useId } from "@builder.io/qwik";
import styles from './style.module.css'
import { TimerInput } from "./input";
import { TimerContext } from "~/lib/timer-store";

export const Timer = component$(() => {

  const { 
    setHours, 
    hours, 
    remainingTime,
    cancel
  } = useContext(TimerContext)

  const previouslyValued = useSignal(false)
  const running = remainingTime !== '~'

  return <div 
    class={styles.container}>
    <h3>
      Timer
      <span>auto pause</span>
    </h3>

    <p>Turn Off Sound in</p>

    <div class={`${styles.hourinput} ${previouslyValued.value ? styles.previouslyValued : ''}`}>
      <TimerInput 
        onChange={$((n) => setHours(n))}
        value={hours||0}
      />
    </div>

    <div class={`${styles.timetilloff} ${running ? styles.on : ''}`}>
      <h4>Countdown:</h4>
      <span>{remainingTime}</span>
      <button onClick$={$(() => cancel())}>cancel</button>
    </div>
  </div>

})