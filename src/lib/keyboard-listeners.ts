




export function keyboardListeners(){

  window.addEventListener('keydown', function(e: KeyboardEvent) {
    if (e.key === '+' && (e.metaKey || e.ctrlKey)) {
      console.log('plus')
    }

    if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
      console.log('minus')
    }
  });

}