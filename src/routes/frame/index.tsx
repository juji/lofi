import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { YoutubeVideo } from "~/components/youtube-frame/video";

export default component$(() => {

  const ytid = useSignal('')

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const params = new URLSearchParams(window.location.search.replace(/^\?/,''))
    ytid.value = params.get('id') || ''
  })

  return ytid.value ? <YoutubeVideo id={ytid.value} /> : null

})