



export function lsCheckGet(
  key: string,
  params?: {
    check?: (parsed: any) => boolean
  }
){

  const data = localStorage.getItem(key)
  if(!data) return null

  try{

    const parsed = JSON.parse(data)
    if(params?.check && !params.check(parsed)) 
      throw new Error('LocalStorage data check failed')
    return parsed

  }catch(e){

    console.error(e)
    localStorage.removeItem(key)
    return null

  }

}