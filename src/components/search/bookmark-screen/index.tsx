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

export const BookmarkScreen = component$(function(){

  const {
    data
  } = useContext(BookmarkContext)

  const newBookmark = useSignal<YoutubeVideo[]|null>(null)

  return <div class={styles.bookmarks}>
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
            newBookmark.value = bookmarks
          }).catch(e => {
            console.error(e)
            alert(e.toString())
          })
        })}
      >import</button>
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
      >export</button>
    </div>
    {newBookmark.value ? <div class={`${styles.newBookmark}`}>
      <p>
        The file had {newBookmark.value && newBookmark.value.length} numbers of videos. 
        Load them to current bookmark?
      </p>
      <p>
        The window will need to restart.
      </p>
      <div>
        <button 
          onClick$={$(() => newBookmark.value = null)}
          class={styles.newBookmarkCancel}>Cancel</button>
        <button 
          onClick$={$(() => {
            if(!newBookmark.value) return;
            set(newBookmark.value)
            newBookmark.value = null
            setInitAction('bookmark')
            window.location.reload()
          })}
          class={styles.newBookmarkConfirm}>Yes</button>
      </div>
    </div> : null}
    <div class={`${mainStyles.result} ${styles.result}`}>
      {data.map(v => <Thumbnail 
        key={v.id} 
        video={v} 
        bookmark={true}
      />)}  
    </div>
  </div>

})