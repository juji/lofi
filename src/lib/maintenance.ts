import { 
  differenceInDays,
  // differenceInMinutes 
} from "date-fns"
import { maintainHistory } from "./history-store/db";

// 12 hours
const maintenancePeriod = 1000 * 60 * 60 * 12

// 1 min
// const maintenancePeriod = 1000 * 60

async function maintain(){

  const lastMaintenance = localStorage.getItem('maintenace')
  
  if(
    
    lastMaintenance &&

    differenceInDays(
      new Date(),
      new Date(lastMaintenance)
    ) < 1

    // differenceInMinutes(
    //   new Date(),
    //   new Date(lastMaintenance)
    // ) < 1

  ) return;

  
  console.log('doing maintenance')
  const num = await maintainHistory()
  console.log('maintainHistory result:', num)

  localStorage.setItem('maintenace', new Date().toISOString())

}


export async function doMaintenance(){

  try{
    await maintain()
  }catch(e){
    console.error('maintenace error')
    console.error(e)
  }

  // 
  setTimeout(() => {
    doMaintenance()
  }, maintenancePeriod)

}