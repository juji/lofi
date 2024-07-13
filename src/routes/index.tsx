import { 
  $, component$, useStore, 
  useContextProvider, useVisibleTask$ 
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { YoutubeFrame } from "~/components/youtube-frame";
import { Search } from "~/components/search";
import { VideoContext, VideoStoreType } from "~/lib/video-store";

export default component$(() => {

  const videoStore = useStore<VideoStoreType>({
    id: '',
    change: $(function(this: VideoStoreType, s: string){
      this.id = s
      localStorage.setItem('video', s)
    })
  })

  useVisibleTask$(() => {
    const s = localStorage.getItem('video')
    if(s) videoStore.change(s)
    else videoStore.change('jfKfPfyJRdk')
  },{ strategy: 'document-ready' })

  useContextProvider(VideoContext, videoStore)

  return (
    <div class="app">
      <YoutubeFrame />
      <Search />
    </div>
  );
});

export const head: DocumentHead = {
  title: "LoFi",
  meta: [
    {
      name: "description",
      content: "Just Minimal LoFi Browser",
    },
  ],
};
