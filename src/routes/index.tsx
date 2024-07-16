import { 
  component$, useStore, 
  useContextProvider, useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeftSide } from "~/components/left-side";
import { Search } from "~/components/search";

import { VideoContext, VideoStoreType, VideoStore } from "~/lib/video-store";
import { AutoplayContext, AutoplayStoreType, AutoPlayStore } from "~/lib/autoplay-store";
import { TimerContext, TimerStoreType, TimerStore } from "~/lib/timer-store";
import { VolumeContext, VolumeStoreType, VolumeStore } from "~/lib/volume-store";

import { appWindow, LogicalSize } from '@tauri-apps/api/window';

export default component$(() => {

  //
  const videoStore = useStore<VideoStoreType>(VideoStore)
  useContextProvider(VideoContext, videoStore)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await appWindow.setMinSize(new LogicalSize(700, 610));
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    
    // load lofi the first time
    // or something else from ls
    const video = await videoStore.getFromStorage()
    console.log('video', video)
    if(video) videoStore.change(video)
    else videoStore.change({
      "id":"jfKfPfyJRdk","type":"video",
      "thumbnail":{
        "thumbnails":[{
          "url":"https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg",
          "width":720,"height":404
        }]
      },
      "title":"lofi hip hop radio 📚 - beats to relax/study to",
      "channelTitle":"Lofi Girl",
      "isLive":true
    })

  },{ strategy: 'document-ready' })

  //
  const autoplayStore = useStore<AutoplayStoreType>(AutoPlayStore)
  useContextProvider(AutoplayContext, autoplayStore)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    // setting autoplay
    const a = localStorage.getItem('autoplay')
    if(a && a === '0') autoplayStore.off()
    else autoplayStore.on()

  },{ strategy: 'document-ready' })

  //
  const timerStore = useStore<TimerStoreType>(TimerStore)
  useContextProvider(TimerContext, timerStore)

  //
  const volumeStore = useStore<VolumeStoreType>(VolumeStore)
  useContextProvider(VolumeContext, volumeStore)

  return (
    <div class="app">
      <LeftSide />
      <Search />
    </div>
  );
});

export const head: DocumentHead = {
  title: "LoFi",
  meta: [
    {
      name: "description",
      content: "Just A Minimal LoFi Browser",
    },
  ],
};
