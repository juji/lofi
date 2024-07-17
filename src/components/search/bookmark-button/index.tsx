import { $, component$, QRL, useContext, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import styles from './style.module.css'
import { BookmarkContext } from "~/lib/bookmark-store"
import { isServer } from "@builder.io/qwik/build"

const BookmarkIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20ZM17 7C17 6.44772 16.5523 6 16 6H8C7.44772 6 7 6.44772 7 7V17L9.87873 14.1212C11.0503 12.9497 12.9498 12.9497 14.1214 14.1212L17 16.9999V7Z" fill="currentColor" /></svg>

type BookmarkButtonProps = {
  classNames: string
  onClick: QRL<() => void>
}

export const BookmarkButton = component$(({
  classNames, 
  onClick
}: BookmarkButtonProps) => {

  const adding = useSignal(false)
  const removing = useSignal(false)

  const {
    onAdd,
    onRemove
  } = useContext(BookmarkContext)

  useVisibleTask$(() => {
    onAdd(() => {
      adding.value = true
    })

    onRemove(() => {
      removing.value = true
    })
  })

  useTask$(({ track }) => {
    track(() => adding.value)
    if(isServer) return;

    if(adding.value) setTimeout(() => {
      adding.value = false
    },1100)
  })

  useTask$(({ track }) => {
    track(() => removing.value)
    if(isServer) return;

    if(removing.value) setTimeout(() => {
      removing.value = false
    },500)
  })

  return <button 
    class={`${classNames}
    ${styles.bookmarkButton}
    ${adding.value ? styles.adding : ''}
    ${removing.value ? styles.removing : ''}
    `}
    onClick$={$(() => onClick())}>
    <BookmarkIcon />
  </button>

})