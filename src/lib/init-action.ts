
export function setInitAction(str: string){
  localStorage.setItem('init', str)
}

export function initAction(){

  setTimeout(() => {

    const init = localStorage.getItem('init')

    if(!init) return localStorage.removeItem('init');
  
    if(init === 'bookmark'){
      const btn = document.querySelector('#lofibookmarkbtn') as HTMLButtonElement
      if(btn) btn.click()
    }
  
    localStorage.removeItem('init');

  },500)
}