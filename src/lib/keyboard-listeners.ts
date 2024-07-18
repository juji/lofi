

let zoomLevel = 1

export function keyboardListeners(){

  window.addEventListener('keydown', function(e: KeyboardEvent) {

    // refresh the search
    if (e.key === 'f5' && e.ctrlKey) {
      const button = document.querySelector('#lofiapprefresh')
      if(button) (button as HTMLButtonElement).click()
    }

    if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
      const button = document.querySelector('#lofiapprefresh')
      if(button) (button as HTMLButtonElement).click()
    }

    // go to search bar
    if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
      const input = document.querySelector('#lofiappsearchbar')
      if(input) (input as HTMLInputElement).focus()
    }

    // zoom normalize
    if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
      // @ts-expect-error
      document.body.style.zoom = '1'
    }
    
    // zoom in
    if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
      // @ts-expect-error
      if(!document.body.style.zoom){
        // @ts-expect-error
        document.body.style.zoom = (zoomLevel + .1) + ''
      }else{
        // @ts-expect-error
        zoomLevel = Number(document.body.style.zoom)
        // @ts-expect-error
        document.body.style.zoom = (Number(document.body.style.zoom) + .1) + ''
      }
    }

    // zoom out
    if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
      // @ts-expect-error
      if(!document.body.style.zoom){
        // @ts-expect-error
        document.body.style.zoom = (zoomLevel - .1) + ''
      }else{
        // @ts-expect-error
        document.body.style.zoom = (Number(document.body.style.zoom) - .1) + ''
      }
    }
  });

}