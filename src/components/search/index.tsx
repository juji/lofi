import { 
  component$, $, 
  useContext, 
  useSignal, 
  useVisibleTask$, 
  useStore, 
  type QRL 
} from '@builder.io/qwik'
import { VideoContext } from "~/lib/video-store";
import styles from './style.module.css'
import './search-loader.css'
import { 
  search, nextPage,
  type YoutubeVideo, 
} from '~/lib/search'

import { Loader } from './loader';
import { BookmarkContext } from '~/lib/bookmark-store';
import { BookmarkButton } from './bookmark-button';

import cacheddata from './data'
const BookmarkIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20ZM17 7C17 6.44772 16.5523 6 16 6H8C7.44772 6 7 6.44772 7 7V17L9.87873 14.1212C11.0503 12.9497 12.9498 12.9497 14.1214 14.1212L17 16.9999V7Z" fill="currentColor" /></svg>
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z" fill="currentColor" /></svg>
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" /></svg>
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"></path></svg>

const Thumbnail = component$(({ 
  video,
  bookmark,
  onAddBookmark,
  onRemoveBookmark,
  isBookMarked
}:{ 
  video: YoutubeVideo 
  bookmark?: boolean
  onAddBookmark?: QRL<() => void>
  onRemoveBookmark?: QRL<() => void>
  isBookMarked?: boolean
}) => {

  const { change } = useContext(VideoContext)
  
  return <div class={styles.thumbnail} 
    style={{backgroundImage: `url('${video.thumbnail.thumbnails[0].url}')`}}>
    <button 
      onClick$={() => change(video)}
      class={styles.thumbnailButton}></button>
    { video.isLive ? <span class={styles.isLive}>Live</span> : null}
    { bookmark ? <button
      onClick$={onRemoveBookmark}
      class={`${styles.removeBookmark} ${styles.bookmarkButton}`}
    ><CloseIcon /></button> : <button
      onClick$={onAddBookmark}
      class={isBookMarked ? `${styles.bookmarkButton} ${styles.on}` : styles.bookmarkButton}
    ><BookmarkIcon /></button> }
    
  </div>

})

type YTVidStore = {
  items: YoutubeVideo[]
  nextPage: any|null
  set: QRL<(
    this: YTVidStore,
    par: {
      items: YoutubeVideo[]
      nextPage: any|null
    }
  ) => void>
}

function getVideos( data: YoutubeVideo[] ){
  return data.filter(v => v.type && v.type === 'video')
}

export const Search = component$(() => {

  const data = useStore<YTVidStore>({
    items: [],
    nextPage: null,
    set: $(function (this, data) {
      this.items = data.items
      this.nextPage = data.nextPage
    })
  })

  const {
    cache: bookmarkCache,
    remove: bookmarkRemove,
    add: bookmarkAdd
  } = useContext(BookmarkContext)

  const err = useSignal(false)
  const bookmarkOpen = useSignal(false)
  const loading = useSignal(false)

  const searchYoutube = $(( text: string ) => {

    if(import.meta.env.DEV){

      data.set(cacheddata)

    }else{

      loading.value = true
  
      search(text)
        .then(v => {
  
          const cdata = {
            ...v,
            items: getVideos(v.items)
          }

          data.set( cdata )
          loading.value = false
          err.value = false

        }).catch(e => {
          err.value = true
          loading.value = false
          console.error(e)
        })

    }

  })

  const getNextPage = $(( n: unknown ) => {
    nextPage(n)
      .then(v => {
        data.set({
          items: [ ...data.items, ...getVideos(v.items) ],
          nextPage: v.nextPage
        })
      })
  })

  const textValue = useSignal('lofi') 
  const onSubmit = $((e:SubmitEvent) => {
    
    if(err.value) err.value = false

    const value = (
      (e.target as HTMLFormElement)
      .querySelector('input') as HTMLInputElement
    ).value

    // we want to enable reload
    // like in the browser
    textValue.value = value
    
    if(!value) return;
    searchYoutube(value)
    
  })

  const onReload = $(() => {
    const input = document.querySelector('.searchForm input') as HTMLInputElement
    if(input) input.value = textValue.value
    searchYoutube(textValue.value)
  })
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    const options = {
      root: document.querySelector('body'),
    };
    
    const callback = (entries:IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          if(!data.items.length) {
            searchYoutube(textValue.value)
          }
          else if(data.items.length && data.nextPage){
            getNextPage(data.nextPage)
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(`.${styles.loader}`);
    target && observer.observe(target);
  },{ strategy: 'document-ready' })

  return <div class={styles.component}>
    <div class={styles.topbar}>
      <button
        id="lofiapprefresh" 
        onClick$={$(() => {
          onReload()
        })}
        class={styles.refreshButton}><RefreshIcon /></button>
      <form preventdefault:submit onSubmit$={onSubmit} class="searchForm">
        <div>
          <input 
            tabIndex={0}
            id={'lofiappsearchbar'}
            type="text" value={textValue.value}
            name="search" placeholder="search" />
        </div>
        { loading.value ? <div class={`${styles.searchLoader}`}>
          <div class="search-loader"></div>
        </div> : <button class={styles.search} type="submit">
          <SearchIcon />
        </button>}
      </form>
      <BookmarkButton
        classNames={bookmarkOpen.value ? `${styles.bookmark} ${styles.active}` : styles.bookmark}
        onClick={$(() => {bookmarkOpen.value = !bookmarkOpen.value})}
      />
    </div>
    { bookmarkOpen.value ? (
      <div class={styles.bookmarks}>
      <h2>Bookmarks</h2>
      <div class={styles.result}>
        {(Object.values(bookmarkCache)).map(v => <Thumbnail 
          key={v.id} 
          video={v} 
          bookmark={true}
          onRemoveBookmark={$(() => bookmarkRemove(v))}
        />)}  
      </div>
      </div>
    ) : (
      <div class={styles.result}>
        {data.items.map((v,i) => <Thumbnail 
          key={`${v.id}${i}`} 
          video={v}
          isBookMarked={Boolean(bookmarkCache[v.id])} 
          onAddBookmark={bookmarkCache[v.id] ? 
            $(() => bookmarkRemove(v)) :
            $(() => bookmarkAdd(v))}
        />)}
        <div class={styles.loader}>
          <Loader />
        </div>
      </div> 
    )}

    { err.value ? 
      <p class={styles.error}>Something bad is happening</p> : 
    null }
  </div>

})
