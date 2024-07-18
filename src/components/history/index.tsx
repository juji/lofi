import { $, component$, QRL, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'

import data from './data.json'
import { YoutubeVideo } from "~/lib/search";
import { YoutubeVideoHistory } from "~/lib/history-store/db";
import { VideoContext } from "~/lib/video-store";

const history = (data.items as YoutubeVideo[]).map(v => {

  return {
    video: v as YoutubeVideo,
    key: new Date().toISOString(),
    date: new Date()
  } as YoutubeVideoHistory

})

type HistoryItemProps = {
  closeHistory: QRL<() => void>
  onCheckToggle: QRL<() => void>
  item: YoutubeVideoHistory
}

const HistoryItem = component$<HistoryItemProps>(({
  closeHistory,
  onCheckToggle,
  item: v
}) => {

  const isDeleting = useSignal(false)
  const isChecked = useSignal(false)

  const { change } = useContext(VideoContext)

  // const onClick = $((video: YoutubeVideo) => {
  //   change(video)
  // })

  const onDelete = $((video: YoutubeVideo) => {
    // change(video)
    // closeHistory()
  })
  

  return <div key={v.key} class={styles.historyItem}>
  <span>
    <input type="checkbox" value={v.key} 
      checked={isChecked.value}
      onChange$={$((e) => { 
        isChecked.value = (e.target as HTMLInputElement).checked
        onCheckToggle() 
      })}
    />
  </span>
  <div>
    <button class={styles.imageButton} 
      onClick$={$(() => change(v.video))}
    >
      <img src={v.video.thumbnail.thumbnails[0].url} 
        width={v.video.thumbnail.thumbnails[0].width} 
        height={v.video.thumbnail.thumbnails[0].height} 
      />
    </button>
    <div class={styles.date}>
      {v.date.toLocaleString()}
      <button class={`${styles.deleteConfirm} ${isDeleting.value ? styles.open : ''}`} 
        onClick$={$(() => onDelete(v.video))}>
        <span>Click here to remove</span>
      </button>
    </div>
    <button class={styles.deleteButton} onClick$={$(() => isDeleting.value = !isDeleting.value)}>
      { isDeleting.value ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )}
    </button>
  </div>
</div>

})

export const History = component$(() => {

  const isOpen = useSignal(false)
  const multiChecked = useSignal(false)
  const selectedLength = useSignal(0)
  const {
    onChange: onVideoChange
  } = useContext(VideoContext)

  const onCheckToggle = $(() => {
    setTimeout(() => {
      selectedLength.value = document.querySelectorAll(
        '#historySelectorList input[value]:checked'
      ).length
      multiChecked.value = 
        document.querySelectorAll(
          '#historySelectorList input[value]:checked'
        ).length ? true : false
    },200)
  })

  useVisibleTask$(() => {

    onVideoChange('history-list', (video:YoutubeVideo) => {
      isOpen.value = false
    })
    
  })


  const loadMoreHistory = $(() => {

  })

  return <div class={styles.container}>
    <div class={styles.buttons}>
      <button class={styles.prev}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z" fill="currentColor" /></svg>
      </button>
      <button 
        class={`${styles.history} ${isOpen.value ? styles.active : ''}`} 
        onClick$={$(() => isOpen.value = !isOpen.value)}>
        History
      </button>
      <button class={styles.next}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z" fill="currentColor" /></svg>
      </button>
    </div>
    <div 
      id="historySelectorList"
      class={`${styles.list} ${isOpen.value ? styles.open : ''}`}>
      <div class={styles.content}>
        <div class={styles.historyTopBar}>
          <span>
            <input type="checkbox" onChange$={$((e) => {
              const checked = (e.target as HTMLInputElement).checked
              multiChecked.value = checked
              selectedLength.value = document.querySelectorAll(
                '#historySelectorList input[value]'
              ).length
              setTimeout(() => {
                document.querySelectorAll(
                  '#historySelectorList input'
                ).forEach(v => {
                  (v as HTMLInputElement).checked = checked
                })
              },100)
            })} />
          </span>
          { multiChecked.value ? <div>
            <button class={styles.deleteSelected}>
              Click here to delete ({selectedLength.value})
            </button>
          </div> : <span>
            Items
          </span>}
          
        </div>
        {!history.length ? <div class={styles.empty}>
          Start watching to see history...
        </div> : null}
        {history.map(v => {

          return <HistoryItem 
            closeHistory={$(() => {isOpen.value = false})}
            onCheckToggle={$(() => onCheckToggle())}
            item={v}
          />

        })}
        { history.length ? <div class={styles.loadMore}>
          <button onClick$={$(() => loadMoreHistory())}>Load More</button>
        </div> : null}
      </div>
    </div>
  </div>

})