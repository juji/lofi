import { 
  component$, $, 
  useContext, 
  useSignal, 
  useVisibleTask$, 
  useStore, 
  type QRL 
} from '@builder.io/qwik'
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
import { Thumbnail } from './thumbnail';
import { BookmarkScreen } from './bookmark-screen';

const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z" fill="currentColor" /></svg>
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"></path></svg>

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

async function doSearch(text: string){
  if(import.meta.env.DEV){
    return cacheddata
  }else{
    return search(text)
      .then(v => {
        return {
          ...v,
          items: getVideos(v.items)
        }
      })
  }
}

async function doNext(data: any){
  if(import.meta.env.DEV){
    return cacheddata
  }else{
    return nextPage(data)
      .then(v => {
        return {
          ...v,
          items: getVideos(v.items)
        }
      })
  }
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

    loading.value = true
    doSearch(text).then(v => {
      data.set( v )
      loading.value = false
      err.value = false
    }).catch(e => {
      err.value = true
      loading.value = false
      console.error(e)
    })

    const results = document.querySelector(`.${styles.result}`)
    if(results) (results as HTMLDivElement).scrollTo({
      top:0,
      left:0,
      behavior: 'smooth'
    })

  })

  const getNextPage = $(() => {
    doNext(data.nextPage)
      .then(v => {
        data.set({
          items: [ ...data.items, ...v.items ],
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
            getNextPage()
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
        open={!!bookmarkOpen.value}
        classNames={bookmarkOpen.value ? `${styles.bookmark} ${styles.active}` : styles.bookmark}
        onClick={$(() => {bookmarkOpen.value = !bookmarkOpen.value})}
      />
    </div>
    <div class={styles.content}>
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
      <BookmarkScreen open={bookmarkOpen.value} />
    </div>

    { err.value ? 
      <p class={styles.error}>Something bad is happening</p> : 
    null }
  </div>

})
