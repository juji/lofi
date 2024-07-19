import { component$, type QRL } from "@builder.io/qwik";
import styles from './style.module.css'

type TopbarMenuProps = {
  isOpen: boolean,
  onToggle: QRL<() => void>
  // onPrev: QRL<() => void>
  // onNext: QRL<() => void>
}

// const LeftIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z" fill="currentColor" /></svg>
// const RightIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z" fill="currentColor" /></svg>

export const TopbarMenu = component$<TopbarMenuProps>(({
  isOpen,
  onToggle,
  // onPrev,
  // onNext
}) => {
  
  return <div class={styles.container}>
    <div>
      <button 
        class={`${styles.history} ${isOpen ? styles.active : ''}`} 
        onClick$={onToggle}>
        {isOpen ? 'Close History' : 'History'}
      </button>
    </div>
    {/* <div>
      <button 
        class={`${styles.prev}`} 
        onClick$={onPrev}>
          <LeftIcon />
      </button>
    </div>
    <div>
      <button 
        class={`${styles.next}`} 
        onClick$={onNext}>
          <RightIcon />
      </button>
    </div> */}
  </div>
  
})