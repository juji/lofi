import { $, component$, type QRL, useContext, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './style.module.css'

import { type YoutubeVideo } from "~/lib/search";
import { type YoutubeVideoHistory } from "~/lib/history-store/db";
import { VideoContext } from "~/lib/video-store";
import { HistoryContext } from "~/lib/history-store";

import { LeftButton, RightButton } from "./history-buttons";

type HistoryItemProps = {
  closeHistory: QRL<() => void>
  onCheckToggle: QRL<() => void>
  onRemove: QRL<(item: YoutubeVideoHistory) => void>
  item: YoutubeVideoHistory
}

const HistoryItem = component$<HistoryItemProps>(({
  closeHistory,
  onCheckToggle,
  onRemove,
  item: v
}) => {

  const isDeleting = useSignal(false)
  const isChecked = useSignal(false)

  const { change } = useContext(VideoContext)

  const onClick = $((video: YoutubeVideo) => {
    change(video)
    closeHistory()
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
      onClick$={$(() => onClick(v.video))}
    >
      <img src={v.video.thumbnail.thumbnails[0].url} 
        width={v.video.thumbnail.thumbnails[0].width} 
        height={v.video.thumbnail.thumbnails[0].height} 
      />
    </button>
    <div class={styles.date}>
      {v.date.toLocaleString()}
      <button class={`${styles.deleteConfirm} ${isDeleting.value ? styles.open : ''}`} 
        onClick$={$(() => onRemove(v))}>
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

  const { get, onWrite, remove } = useContext(HistoryContext)
  const history = useSignal<YoutubeVideoHistory[]>([])
  const lastId = useSignal<string|undefined>(undefined)
  const showNext = useSignal(true)

  const onRemove = $(function(item: YoutubeVideoHistory ){
    remove(item)
    history.value = history.value.filter(v => v.key !== item.key)
  })

  const removeMany = $(() => {

    document.querySelectorAll(
      '#historySelectorList input[value]:checked'
    ).forEach(v => {
      const id = (v as HTMLInputElement).value
      const val = history.value.find(h => h.key === id)
      val && onRemove(val)
    })
    
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    onWrite(( data: YoutubeVideoHistory ) => {

      const clen = history.value.length
      history.value = [
        data,
        ...clen <= 10 ? history.value.slice(0,9) : history.value
      ]

    })

  })

  const loadInitHistory = $(() => {
    get(lastId.value).then(v => {
      history.value = v
      lastId.value = v[v.length-1].key
    }).catch(e => {
      console.error('get history error')
      console.error(e)
    })
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    loadInitHistory()
  })

  useTask$(({ track }) => {

    track(() => isOpen.value)
    track(() => history.value)

    if(!isOpen.value) return;
    if(history.value.length) return;

    loadInitHistory()

  })



  const loadMoreHistory = $(() => {
    get(lastId.value).then(v => {
      
      if(!v.length) {
        showNext.value = false
        return;
      }

      history.value = [
        ...history.value,
        ...v
      ]

      lastId.value = v[v.length-1].key

    }).catch(e => {
      console.error('get history error')
      console.error(e)
    })
  })

  useTask$(({ track, cleanup }) => {

    track(() => !!history.value.length)
    track(() => showNext.value)

    if(!showNext.value) return;
    if(!history.value.length) return;

    const options = {
      root: document.querySelector('body'),
    };
    
    const callback = (entries:IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          loadMoreHistory()
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    setTimeout(() => {
      
      const target = document.querySelector(`div.${styles.loadMore}`);
      if(!target) return;
      observer.observe(target);

    },500)

    cleanup(() => {
      observer.disconnect()
    })

  })

  return <div class={styles.container}>
    <div class={styles.buttons}>
      <LeftButton />
      <button 
        class={`${styles.history} ${isOpen.value ? styles.active : ''}`} 
        onClick$={$(() => isOpen.value = !isOpen.value)}>
        History
      </button>
      <RightButton />
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
            <button onClick$={$(() => removeMany())} class={styles.deleteSelected}>
              Click here to delete ({selectedLength.value})
            </button>
          </div> : <span>
            Items
          </span>}
          
        </div>
        {!history.value.length ? <div class={styles.empty}>
          Start watching to see history...
        </div> : null}
        {history.value.map(v => {

          return <HistoryItem
            key={v.key}
            onRemove={$((item) => onRemove( item ))}
            closeHistory={$(() => {isOpen.value = false})}
            onCheckToggle={$(() => onCheckToggle())}
            item={v}
          />

        })}
        { history.value.length && showNext.value ? <div class={styles.loadMore}>
          <p>Loading...</p>
        </div> : null}
      </div>
    </div>
  </div>

})