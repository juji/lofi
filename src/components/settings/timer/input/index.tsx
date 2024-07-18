import { $, component$, type QRL } from "@builder.io/qwik";
import styles from './input.module.css'

const PlusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor" /></svg>
const MinusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z" fill="currentColor" /></svg>

export type TimerInputProps = {
  onChange: QRL<(n: number) => void>
  value: number
}

export const TimerInput = component$<TimerInputProps>(({ 
  onChange, 
  value,
}) => {

  return <div class={styles.container}>
    <button onClick$={$(() => value && onChange(Math.max(0,value-1)) )}>
      <MinusIcon />
    </button>
    <div>
      <input type="number" min="0" 
        value={value} 
        onKeyUp$={$((e) => {
          const t = e.target as HTMLInputElement
          onChange(t.valueAsNumber||0)
        })}
      />
      <span>{value <= 1 ? 'hour' : `hours`}</span>
    </div>
    <button onClick$={$(() => onChange(value+1))}>
      <PlusIcon />
    </button>
  </div>

})