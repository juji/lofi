
import { 
  zoomIn,
  zoomNormalize,
  zoomOut,
  refresh,
  saearchBarFocus 
} from "./browser-utils";

export function keyboardListeners(){

  window.addEventListener('keydown', function(e: KeyboardEvent) {

    if (e.key === 'r' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
      window.location.reload()
    }

    if (e.key === 'f5' && e.ctrlKey) {
      refresh()
    }

    if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
      refresh()
    }

    if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
      saearchBarFocus()
    }

    if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
      zoomNormalize()
    }

    if (e.key === '+' && (e.metaKey || e.ctrlKey)) {
      zoomIn()
    }
    
    if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
      zoomIn()
    }

    if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
      zoomOut()
    }
  });

}