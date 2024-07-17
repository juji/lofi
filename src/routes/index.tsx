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
import { BookmarkContext, BookmarkStoreType, BookmarkStore } from "~/lib/bookmark-store";
import { HistoryContext, HistoryStoreType, HistoryStore } from "~/lib/history-store";

import { appWindow, LogicalSize } from '@tauri-apps/api/window';

export default component$(() => {

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    await appWindow.setMinSize(new LogicalSize(700, 670));
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
  useVisibleTask$(async () => {

    historyStore.init( videoStore )
    videoStore.init()
    autoplayStore.init()
    bookmarkStore.init()

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
