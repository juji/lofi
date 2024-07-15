import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { YoutubeVideo } from "~/components/youtube-frame/video";


export default component$(() => {

  const ytid = useSignal('')
  useVisibleTask$(() => {
    ytid.value = window.location.search.replace(/\?id=/,'')
  })

  return ytid.value ? <YoutubeVideo id={ytid.value} /> : null

})