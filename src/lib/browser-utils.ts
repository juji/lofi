



export function refresh(){
  const button = document.querySelector('#lofiapprefresh')
  if(button) (button as HTMLButtonElement).click()
}

export function saearchBarFocus(){
  const input = document.querySelector('#lofiappsearchbar')
  if(input) (input as HTMLInputElement).focus()
}

let initZoomLevel = 1
export function zoomNormalize(){
  // @ts-ignore
  document.body.style.zoom = '1'
}

export function zoomIn(){
  // @ts-ignore
  if(!document.body.style.zoom){
    // @ts-ignore
    document.body.style.zoom = (initZoomLevel + .1) + ''
  }else{
    // @ts-ignore
    document.body.style.zoom = (Number(document.body.style.zoom) + .1) + ''
  }
}

export function zoomOut(){
  // @ts-ignore
  if(!document.body.style.zoom){
    // @ts-ignore
    document.body.style.zoom = (initZoomLevel - .1) + ''
  }else{
    // @ts-ignore
    document.body.style.zoom = (Number(document.body.style.zoom) - .1) + ''
  }
}
