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

export async function search( text: string ) : Promise<SearchResult>{
  
  const data = await GetListByKeyword(text)
  return data

}

export async function nextPage( next: unknown ){
  
  const data = await NextPage(next)
  return data
  
}