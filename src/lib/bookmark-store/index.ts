import { $, createContextId, noSerialize, NoSerialize, type QRL } from "@builder.io/qwik";
import type { YoutubeVideo } from "~/lib/search"

export type BookmarkStoreType = {

  cache: {[key: string]: YoutubeVideo}

  init: QRL<(this:BookmarkStoreType) => void> 

  add: QRL<(this:BookmarkStoreType, video: YoutubeVideo) => void>
  addListener: NoSerialize<(video: YoutubeVideo) => void> | null
  onAdd: QRL<(this:BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null) => void>

  remove: QRL<(this:BookmarkStoreType, video: YoutubeVideo) => void>
  removeListener: NoSerialize<(video: YoutubeVideo) => void> | null
  onRemove: QRL<(this:BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null) => void>

  get: QRL<(this:BookmarkStoreType) => YoutubeVideo[]>
  exist: QRL<(this:BookmarkStoreType, video: YoutubeVideo) => boolean>
  
}

export const BookmarkContext = createContextId<BookmarkStoreType>('BookmarkContext');

export const BookmarkStore: BookmarkStoreType = {

  cache: {},

  init: $(async function(this: BookmarkStoreType){
    const data = await this.get()
    data.forEach(video => {
      this.cache[video.id] = video
    })
    this.cache = { ...this.cache }
  }),

  add: $(async function(this: BookmarkStoreType, video: YoutubeVideo){
    const bookmarks = await this.get()
    bookmarks.unshift(video)
    localStorage.setItem('bookmark', JSON.stringify(bookmarks))
    this.cache = {
      [video.id]: video,
      ...this.cache,
    }
    this.addListener && this.addListener(video)
  }),

  addListener: null,
  onAdd: $(function(this: BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null){
    this.addListener = fn ? noSerialize(fn) : null
  }),

  remove: $(async function(this: BookmarkStoreType, video: YoutubeVideo){
    const bookmarks = await this.get()
    
    const index = bookmarks.findIndex(v => v.id === video.id)
    if(index >= 0) bookmarks.splice(index,1)
    localStorage.setItem('bookmark', JSON.stringify(bookmarks))
    this.cache[video.id] && delete this.cache[video.id]
    this.cache = { ...this.cache }
    this.removeListener && this.removeListener(video)
  }),

  removeListener: null,
  onRemove: $(function(this: BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null){
    this.removeListener = fn ? noSerialize(fn) : null
  }),

  get: $(function(this: BookmarkStoreType){
    const b = localStorage.getItem('bookmark')
    return (b ? JSON.parse(b) : []) as YoutubeVideo[]
  }),

  exist: $(function(this: BookmarkStoreType, video: YoutubeVideo){
    return !!this.cache[video.id]
  }),
  
}
