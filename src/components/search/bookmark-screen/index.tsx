import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import styles from './style.module.css'
import { BookmarkContext, get, set } from "~/lib/bookmark-store";
import { Thumbnail } from "../thumbnail";
import mainStyles from '../style.module.css'


import { save, open } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { mark, parse } from '~/lib/data-marking'
import { YoutubeVideo } from "~/lib/search";
import { setInitAction } from "~/lib/init-action";

export const openBookmark = async () => {
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Lofi File',
      extensions: ['lofi']
    }]
  });

  if(!selected) return null;

  const content = await readTextFile(selected as string)
  return content
}

export const downloadBookmarks = async (text: string) => {

  const d = new Date().toJSON().replace(/:/g,'-').replace(/\./g,'-')
  const filename = `bookmark-${d}.lofi`

  // @ts-expect-error
  if (window.__TAURI__) {
    const filePath = await save({ defaultPath: filename });
    
    if(filePath)
      await writeTextFile(filePath, text);
    else throw new Error('filepath is falsy')
  } else {
    throw new Error('Tauri is gone')
  }
};

type BookmarkScreenParams = {
  open: boolean
}

export const BookmarkScreen = component$<BookmarkScreenParams>(function({ open }){

  const { data } = useContext(BookmarkContext)

  const importBookmark = useSignal<YoutubeVideo[]|null>(null)

  return <div class={`
    ${styles.bookmarks} 
    ${open ? styles.open : ''} 
    ${importBookmark.value ? styles.openImportDialog : ''}
  `}>
    <div class={styles.header}>
      <h2>Bookmarks</h2>
      <button 
        onClick$={$(() => {
          openBookmark().then(str => {
            if(!str) return;
            const { type, data } = parse(str||'')
            if(type !== 'bookmark') throw new Error('Data is not bookmark')
            const oldBookmarks = get()
            const bookmarks = [
              ...data,
              ...oldBookmarks
            ]
            importBookmark.value = bookmarks
          }).catch(e => {
            console.error(e)
            alert(e.toString())
          })
        })}
      ><span>import</span></button>
      <button 
        onClick$={$(() => {
          try{
            const data = get()
            const d = mark( 'bookmark', data )
            return downloadBookmarks(d)
          }catch(e){
            console.error(e)
            alert((e as Error).toString())
          }
        })}
      ><span>export</span></button>
    </div>
    <div class={`${styles.importBookmark} ${importBookmark.value ? styles.on : ''}`}>
      <p>
        The file had {importBookmark.value && importBookmark.value.length} numbers of videos. 
        Load them to current bookmark?
      </p>
      <p>
        Duplicate bookmark will be left as it is, and the window will need to restart.
      </p>
      <div>
        <button 
          onClick$={$(() => {
            if(!importBookmark.value) return;
            set(importBookmark.value)
            importBookmark.value = null
            setInitAction('bookmark')
            window.location.reload()
          })}
          class={styles.importBookmarkConfirm}>Yes</button>
        <button 
          onClick$={$(() => importBookmark.value = null)}
          class={styles.importBookmarkCancel}>Cancel</button>
      </div>
    </div>
    <div class={styles.resultContainer}>
      <div class={`${mainStyles.result} ${styles.result}`}>
        {data.map(v => <Thumbnail 
          key={v.id} 
          video={v} 
          bookmark={true}
        />)}  
      </div>
    </div>
  </div>

})