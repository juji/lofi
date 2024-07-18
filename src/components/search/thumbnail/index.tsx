import { $, component$, QRL, useContext } from "@builder.io/qwik"
import { YoutubeVideo } from "~/lib/search"
import { VideoContext } from "~/lib/video-store"
import styles from './style.module.css'
import { BookmarkContext } from "~/lib/bookmark-store"

const BookmarkIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20ZM17 7C17 6.44772 16.5523 6 16 6H8C7.44772 6 7 6.44772 7 7V17L9.87873 14.1212C11.0503 12.9497 12.9498 12.9497 14.1214 14.1212L17 16.9999V7Z" fill="currentColor" /></svg>
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" /></svg>

export const Thumbnail = component$((
{ 
  video,
  bookmark,
  onAddBookmark,
  isBookMarked
}:{ 
  video: YoutubeVideo 
  bookmark?: boolean
  onAddBookmark?: QRL<() => void>
  isBookMarked?: boolean
}
) => {

  const { change } = useContext(VideoContext)
  const { remove } = useContext(BookmarkContext)
  
  return <div class={styles.thumbnail} 
    style={{backgroundImage: `url('${video.thumbnail.thumbnails[0].url}')`}}>
    <button 
      onClick$={() => change(video)}
      class={styles.thumbnailButton}></button>
    { video.isLive ? <span class={styles.isLive}>Live</span> : null}
    { bookmark ? <button
      onClick$={$(() => remove(video))}
      class={`${styles.removeBookmark} ${styles.bookmarkButton}`}
    ><CloseIcon /></button> : <button
      onClick$={onAddBookmark}
      class={isBookMarked ? `${styles.bookmarkButton} ${styles.on}` : styles.bookmarkButton}
    ><BookmarkIcon /></button> }
    
  </div>

})