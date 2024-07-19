import type { YoutubeVideo } from "../search"
import { videoToObject } from "../utils/video-to-object"
import { 
  differenceInDays, 
  // differenceInMinutes
} from "date-fns";

const dbName = 'history'
const version = 3
const storeName = `videos.v${version}`
const pageSize = 10

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
      console.error('indexedDB error', event)
      j(new Error('open indexedDB failed'))
    };

  })

}

export async function write(video: YoutubeVideo): Promise<YoutubeVideoHistory>{
  
  const db = await store()

  return new Promise((r,j) => {

    try{

      const transaction = db.transaction(storeName, 'readwrite')
      let objectStore = transaction.objectStore(storeName);

      const date = new Date()
      const data = {
        key: date.toISOString(),
        date,
        video: videoToObject(video)
      } as YoutubeVideoHistory
      
      const add = objectStore.add(data)
      
      add.onsuccess = function(e) {
        r(data)
        db.close()
      };
    
      add.onerror = function(e){
        console.error('error adding', video)
        console.error('error:', e)
        j(e)
        db.close()
      }

    }catch(e){
      console.error('error while adding', video)
      console.error('error:', e)
      j(e)
      db.close()
    }
  
  })

}

export async function remove(key: string): Promise<YoutubeVideoHistory|null>{
  const db = await store()
  const transaction = db.transaction(storeName, "readonly");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.openCursor( null, 'prev');

  let data:YoutubeVideoHistory|null = null;

  return new Promise((r,j) => {

    request.onsuccess = (event) => {
  
      const cursor = request.result;
      if(!cursor) {
        db.close()
        return r(data)
      }
      
      if(cursor.key === key){
        data = cursor.value
        db.close()
        return r(data)
      }else{
        cursor.continue(key)
      }
      
    }

    request.onerror = (e) => {
      j(e)
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
      if(!cursor) {
        db.close()
        return r(data)
      }

      if(data.length === pageSize){
        db.close()
        return r(data)
      }

      if(!lastKey){
        data.push(cursor.value as YoutubeVideoHistory)
        cursor.continue();
      }

      else if(
        lastKey && cursor.key !== lastKey && jumpedToKey
      ){
        data.push(cursor.value as YoutubeVideoHistory)
        cursor.continue();
      }

      else if(
        lastKey && cursor.key !== lastKey
      ){
        cursor.continue(lastKey);
      }

      else if(
        lastKey && cursor.key === lastKey
      ){
        jumpedToKey = true
        cursor.continue();
      }

      else {
        db.close()
        return j(new Error('don\'t know what happened'))
      }
    };

    request.onerror = (e) => {
      j(e)
    }

  })


}


// maintaining data
// will remove data from one year ago
export async function maintainHistory(): Promise<number>{

  const db = await store()
  const transaction = db.transaction(storeName, "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.openCursor( null, 'next');

  const today = new Date()
  let numOfDelete = 0
  const numberOfDay = 365
  return new Promise((r,j) => {

    request.onsuccess = (event) => {

      const cursor = request.result;
      
      if(!cursor) {
        db.close()
        return r(numOfDelete);
      }
      
      // const diff = differenceInMinutes(
      //   today,
      //   cursor.value.date
      // )

      const diff = differenceInDays(
        today,
        cursor.value.date,
      )

      if(diff < numberOfDay){
        db.close()
        return r(numOfDelete);
      }

      if(diff >= numberOfDay){
        cursor.delete()
        numOfDelete++;
        cursor.continue();
      }
      
    };

    request.onerror = (e) => {
      j(e)
    }

  })


}