import type { YoutubeVideo } from "../search"

const dbName = 'history'
const version = 3
const storeName = `videos.v${version}`
const pageSize = 5

export type YoutubeVideoHistory = {
  key: string,
  date: Date,
  video: YoutubeVideo
}

export async function store(): Promise<IDBDatabase>{

  return new Promise((r,j) => {

    const request = indexedDB.open(dbName, version);

    request.onblocked = function() {
      window.alert("Upgrade blocked - Please close other instances of this app.")
    };
    
    request.onupgradeneeded = function(event) {
      const db = request.result;
      db.createObjectStore(storeName, { keyPath: 'key' });

      // maybe export data from prev version?
      try{
        db.deleteObjectStore('videos')
        db.deleteObjectStore('videos.v2')
      }catch(e){}
      
    };
    
    request.onsuccess = function(event) {
      r(request.result)
    };
    
    request.onerror = function(event) {
      console.log('on error', event)
      j(new Error('open indexedDB failed'))
    };

  })

}

export async function write(video: YoutubeVideo){
  
  const db = await store()

  return new Promise((r,j) => {

    try{

      const transaction = db.transaction(storeName, 'readwrite')
      let objectStore = transaction.objectStore(storeName);
      
      const date = new Date()
      const add = objectStore.add({
        key: date.toISOString(),
        date,
        video: video
      } as YoutubeVideoHistory)
      
      add.onsuccess = function(e) {
        r(video)
        db.close()
      };
    
      add.onerror = function(e){
        console.log('error adding', video)
        console.log('error:', e)
        j(e)
        db.close()
      }

    }catch(e){
      console.log('error while adding', video)
      console.log('error:', e)
      j(e)
      db.close()
    }
  
  })

}

export async function getPage(lastKey?: string): Promise<YoutubeVideoHistory[]>{

  const db = await store()
  const transaction = db.transaction(storeName, "readonly");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.openCursor( null, 'prev');

  return new Promise((r,j) => {
    
    let jumpedToKey = false
    const data: YoutubeVideoHistory[] = []

    request.onsuccess = (event) => {

      const cursor = request.result;
      if(!cursor) return j(new Error('cursor gone!'))

      if(data.length === pageSize){
        return r(data)
      }

      if(!lastKey){
        data.push(cursor.value as YoutubeVideoHistory)
        try{ cursor.continue(); }catch(e){ return r(data) }
      }

      else if(
        lastKey && cursor.key !== lastKey
      ){
        try{ cursor.continue(lastKey); }catch(e){ return r(data) }
      }

      else if(
        lastKey && cursor.key === lastKey
      ){
        jumpedToKey = true
        try{ cursor.continue(); }catch(e){ return r(data) }
      }

      else if(
        lastKey && cursor.key !== lastKey && jumpedToKey
      ){
        data.push(cursor.value as YoutubeVideoHistory)
        try{ cursor.continue(); }catch(e){ return r(data) }
      }

      else {
        return j(new Error('don\'t know what heppened'))
      }
    };

    request.onerror = (e) => {
      j(e)
    }

  })


}