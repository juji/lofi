import { createContextId, type QRL } from "@builder.io/qwik";

export type VideoStoreType = {
  id: string
  change: QRL<(this:VideoStoreType, s:string) => void>
}

export const VideoContext = createContextId<VideoStoreType>('VideoContext');