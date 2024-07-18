import { $, createContextId, noSerialize, NoSerialize, type QRL } from "@builder.io/qwik";
import type { YoutubeVideo } from "~/lib/search"

export type BookmarkStoreType = {

  cache: {[key: string]: number}
  data: YoutubeVideo[]

  init: QRL<(this:BookmarkStoreType) => void>
  load: QRL<(this:BookmarkStoreType) => void>
  unload: QRL<(this:BookmarkStoreType) => void>

  add: QRL<(this:BookmarkStoreType, video: YoutubeVideo) => void>
  addListener: NoSerialize<(video: YoutubeVideo) => void> | null
  onAdd: QRL<(this:BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null) => void>

  remove: QRL<(this:BookmarkStoreType, video: YoutubeVideo) => void>
  removeListener: NoSerialize<(video: YoutubeVideo) => void> | null
  onRemove: QRL<(this:BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null) => void>
  
}

export const BookmarkContext = createContextId<BookmarkStoreType>('BookmarkContext');

export function get(){
  const b = localStorage.getItem('bookmark')
  return (b ? JSON.parse(b) : []) as YoutubeVideo[]
}

export function set(bookmarks: YoutubeVideo[]){
  localStorage.setItem('bookmark', JSON.stringify(bookmarks))
}

export const BookmarkStore: BookmarkStoreType = {

  cache: {},
  data: [],

  load: $(function(this: BookmarkStoreType){
    this.data = get()
  }),

  unload: $(function(this: BookmarkStoreType){
    this.data = []
  }),

  init: $(function(this: BookmarkStoreType){
    const data = get()
    this.cache = {}
    data.forEach(video => {
      this.cache[video.id] = 1
    })
    this.cache = { ...this.cache }
  }),

  add: $(function(this: BookmarkStoreType, video: YoutubeVideo){
    
    const bookmarks = get()
    bookmarks.unshift(video)
    
    set(bookmarks)
    if(this.data.length) this.data = bookmarks
    
    this.cache = {
      [video.id]: 1,
      ...this.cache,
    }
    this.addListener && this.addListener(video)
    
  }),

  addListener: null,
  onAdd: $(function(this: BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null){
    this.addListener = fn ? noSerialize(fn) : null
  }),

  remove: $(function(this: BookmarkStoreType, video: YoutubeVideo){
    
    const bookmarks = get()
    const index = bookmarks.findIndex(v => v.id === video.id)
    if(index >= 0) bookmarks.splice(index,1)
    
    set(bookmarks)
    if(this.data.length) this.data = bookmarks

    this.cache[video.id] && delete this.cache[video.id]
    this.cache = { ...this.cache }
    this.removeListener && this.removeListener(video)

  }),

  removeListener: null,
  onRemove: $(function(this: BookmarkStoreType, fn: ((video: YoutubeVideo) => void) | null){
    this.removeListener = fn ? noSerialize(fn) : null
  }),
  
}
