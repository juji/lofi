import { GetListByKeyword, NextPage } from './utils/youtube-search-api'

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

function limitDataKey( data:YoutubeVideo[] ){
  return data.map(v => {

    const { channelTitle, id, isLive, thumbnail, title, type } = v
    return { channelTitle, id, isLive, thumbnail, title, type }

  })
}

export async function search( text: string ) : Promise<SearchResult>{
  
  const data = await GetListByKeyword(text)
  return {
    items: limitDataKey(data.items),
    nextPage: data.nextPage
  }

}

export async function nextPage( next: unknown ): Promise<SearchResult>{
  
  const data = await NextPage(next)
  return {
    items: limitDataKey(data.items),
    nextPage: data.nextPage
  }
  
}