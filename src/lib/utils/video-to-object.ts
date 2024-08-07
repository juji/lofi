import { YoutubeVideo } from "../search";

export function videoToObject(video: YoutubeVideo): YoutubeVideo{

  return {
    channelTitle: video.channelTitle,
    id: video.id,
    isLive: video.isLive,
    thumbnail: {
      thumbnails: video.thumbnail.thumbnails.map(v => ({
        url: v.url,
        width: v.width,
        height: v.height,
      }))
    },
    title: video.title,
    type: video.type
  }

}