import { 
  component$, useStore, 
  useContextProvider, useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeftSide } from "~/components/left-side";
import { Search } from "~/components/search";

import { VideoContext, type VideoStoreType, VideoStore } from "~/lib/video-store";
import { AutoplayContext, type AutoplayStoreType, AutoPlayStore } from "~/lib/autoplay-store";
import { TimerContext, type TimerStoreType, TimerStore } from "~/lib/timer-store";
import { VolumeContext, type VolumeStoreType, VolumeStore } from "~/lib/volume-store";
import { BookmarkContext, type BookmarkStoreType, BookmarkStore } from "~/lib/bookmark-store";
import { HistoryContext, type HistoryStoreType, HistoryStore } from "~/lib/history-store";

import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { keyboardListeners } from "~/lib/keyboard-listeners";
import { initAction } from "~/lib/init-action";

import { doMaintenance } from "~/lib/maintenance";

export default component$(() => {

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await appWindow.setMinSize(new LogicalSize(700, 730));
    await appWindow.setMaxSize(new LogicalSize(3840, 2180));
  })

  //
  const videoStore = useStore<VideoStoreType>(VideoStore)
  useContextProvider(VideoContext, videoStore)

  //
  const autoplayStore = useStore<AutoplayStoreType>(AutoPlayStore)
  useContextProvider(AutoplayContext, autoplayStore)

  //
  const timerStore = useStore<TimerStoreType>(TimerStore)
  useContextProvider(TimerContext, timerStore)

  //
  const volumeStore = useStore<VolumeStoreType>(VolumeStore)
  useContextProvider(VolumeContext, volumeStore)

  //
  const bookmarkStore = useStore<BookmarkStoreType>(BookmarkStore)
  useContextProvider(BookmarkContext, bookmarkStore)

  //
  const historyStore = useStore<HistoryStoreType>(HistoryStore)
  useContextProvider(HistoryContext, historyStore)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {

    keyboardListeners()
    historyStore.init( videoStore )
    videoStore.init()
    autoplayStore.init()
    bookmarkStore.init()

    initAction()

    doMaintenance()

  },{ strategy: 'document-ready' })

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
