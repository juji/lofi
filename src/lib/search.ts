import { GetListByKeyword, NextPage } from './youtube-search-api'

export type YoutubeVideo = {
  channelTitle: string
  id: string
  isLive: boolean
  thumbnail: {
    thumbnails:{
      url: string,
      width: number, 
      height: number
    }[]
  }
  title: string
  type: string
}

export type SearchResult = {
  items: YoutubeVideo[],
  nextPage: unknown
}

function useMaxRes(items: YoutubeVideo[]){
  return items.map((v: YoutubeVideo) => ({
    ...v,
    thumbnail: {
      thumbnails: v.thumbnail.thumbnails.map(t => {
        let image = t.url.replace(/\?.+$/,'').split('/')
        image[image.length-1] = 'maxresdefault.jpg'
        return {
          ...t,
          url: image.join('/')
        }
      })
    }
  }))
}

export async function search( text: string ) : Promise<SearchResult>{
  
  const data = await GetListByKeyword(text)
  return data
  // return {
  //   ...data,
  //   items: useMaxRes(data.items)
  // }

}

export async function nextPage( next: unknown ){
  const data = await NextPage(next)
  return data
  // return {
  //   ...data,
  //   items: useMaxRes(data.items)
  // }
}