
import { YoutubeVideo } from "~/lib/search"

export function getBookmarks(){

  const b = localStorage.getItem('bookmark')
  const ret = (b ? JSON.parse(b) : []) as YoutubeVideo[]
  return ret 

}

export function addBookmark( video: YoutubeVideo ){

  const b = localStorage.getItem('bookmark')
  const data = (b ? JSON.parse(b) : []) as YoutubeVideo[]
  data.push(video)
  localStorage.setItem('bookmark', JSON.stringify(data))

}

export function removeBookmark( video: YoutubeVideo ){

  const b = localStorage.getItem('bookmark')
  const data = (b ? JSON.parse(b) : []) as YoutubeVideo[]
  const index = data.findIndex(v => v.id === video.id)
  if(index) data.splice(index,1)
  localStorage.setItem('bookmark', JSON.stringify(data))

}
