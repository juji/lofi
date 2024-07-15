import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from '@builder.io/qwik-city';

import { YoutubeVideo } from "~/components/youtube-frame/video";


export default component$(() => {

  useVisibleTask$(() => {

    
  })

  
  

  const loc = useLocation()
  const id = loc.url.searchParams.get('id')

  return id ? <YoutubeVideo id={id} /> : null

})