import { component$, useContext, useSignal, $, useTask$, useId } from "@builder.io/qwik";
import styles from './style.module.css'
import { PlayerContext } from "~/lib/player-store";
import { formatDistanceToNowStrict } from "date-fns";
import { TimerInput } from "./input";

export const Timer = component$(() => {

  const { videoId, fadeOut,  } = useContext(PlayerContext)

  const inputId = useId()
  const hourValue = useSignal<number>(0)
  const stopTime = useSignal<Date|null>(null)
  const msTillStop = useSignal<number|null>(null)
  const timeTillStop = useSignal<string|null>(null)
  const previouslyValued = useSignal(false)
  const countingDown = useSignal<null | ReturnType <typeof setInterval>>(null)

  // on video change
  // we ask the user to set the value
  // if previously set
  useTask$(({ track }) => {
    track(() => videoId)

    if(countingDown.value || previouslyValued.value){
      countingDown.value && clearInterval(countingDown.value)
      countingDown.value = null
      msTillStop.value = null
      timeTillStop.value = null
      stopTime.value = null
      hourValue.value = 0
      previouslyValued.value = true

      const input = document.getElementById(inputId)
      if(input) input.focus()

    }
  })

  // when the user input to turn off sound
  useTask$(({ track }) => {
    track(() => stopTime.value)

    if(stopTime.value === null) return;

    if(videoId && !countingDown.value){
      countingDown.value = setInterval(() => {

        if(!stopTime.value) {
          countingDown.value && clearInterval(countingDown.value)
          countingDown.value = null
          msTillStop.value = null
          timeTillStop.value = null
          stopTime.value = null
          hourValue.value = 0
          return;
        }

        const gap = stopTime.value.valueOf() - new Date().valueOf()
        if(gap > 0){
          
          timeTillStop.value = formatDistanceToNowStrict(stopTime.value)
          msTillStop.value = new Date().valueOf() - stopTime.value.valueOf()

        }else{
          countingDown.value && clearInterval(countingDown.value)
          countingDown.value = null
          msTillStop.value = null
          timeTillStop.value = null
          stopTime.value = null
          hourValue.value = 0
          fadeOut()
        }


      },500)
    }

  })

  const onInput = $((n: number) => {

    if(!n) {

      stopTime.value = null
      hourValue.value = 0

    }else{

      if(previouslyValued.value)
        previouslyValued.value = false

      console.log('input value', n)
      hourValue.value = n
      const d = new Date()
      // d.setHours(d.getHours() + n)
      
      // testing timer is 5 seconds
      d.setSeconds(d.getSeconds() + 5)
      
      console.log('setting stopTime')
      stopTime.value = d

    }
  })

  return <div 
    class={styles.container}>
    <h3>
      Timer
      <span>auto off</span>
    </h3>

    <p>Turn Off Sound in</p>

    <div class={`${styles.hourinput} ${previouslyValued.value ? styles.previouslyValued : ''}`}>
      <TimerInput 
        inputId={inputId}
        onChange={onInput}
        value={hourValue.value}
      />
      {/* <input 
        min="0" 
        type="number" 
        onInput$={onInput}
      /> */}
      {/* <span>Hours</span> */}
    </div>

    <div class={`${styles.timetilloff} ${timeTillStop.value ? styles.on : ''}`}>
      <h4>Countdown:</h4>
      <span>{timeTillStop.value ? timeTillStop.value : '~'}</span>
      <button onClick$={$(() => {
        stopTime.value = null
      })}>stop timer</button>
    </div>
  </div>

})