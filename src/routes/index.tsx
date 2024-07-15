import { 
  $, component$, useStore, 
  useContextProvider, useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeftSide } from "~/components/left-side";
import { Search } from "~/components/search";
import { VideoContext, VideoStoreType, VideoStore } from "~/lib/video-store";
import { AutoplayContext, AutoplayStoreType, AutoPlayStore } from "~/lib/autoplay-store";
import { PlayerContext, PlayerStoreType, PlayerStore } from "~/lib/player-store";
// import { appWindow, LogicalSize } from '@tauri-apps/api/window';

export default component$(() => {

  //
  const videoStore = useStore<VideoStoreType>(VideoStore)
  useContextProvider(VideoContext, videoStore)

  // useVisibleTask$(async () => {
  //   await appWindow.setMinSize(new LogicalSize(700, 510));
  // })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    
    // load lofi the first time
    // or something else from ls
    const s = localStorage.getItem('video')
    if(s) videoStore.change(s)
    else videoStore.change('jfKfPfyJRdk')

  },{ strategy: 'document-ready' })

  //
  const autoplayStore = useStore<AutoplayStoreType>(AutoPlayStore)
  useContextProvider(AutoplayContext, autoplayStore)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    // setting outplay to be on
    // for the first time

    // add a timeout to prevent video 
    // from from playing for the first time
    // the app opens
    setTimeout(() => {

      const a = localStorage.getItem('autoplay')
      if(a && a === '0') autoplayStore.off()
      else autoplayStore.on()

    },1000)

  },{ strategy: 'document-ready' })

  //
  const playerStore = useStore<PlayerStoreType>(PlayerStore)
  useContextProvider(PlayerContext, playerStore)

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
