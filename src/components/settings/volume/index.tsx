import { component$ } from "@builder.io/qwik";


export const VolumeSlider = component$(({ value }:{ value: number }) => {



  return <input 

    type="range" min="0" max="100" value={value} />

})