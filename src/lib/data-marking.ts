

export function mark( type: string, data: unknown ){
  return JSON.stringify({
    lofi: true,
    v: 0,
    type,
    data
  })
}

export function parse( str: string ){

  const d = JSON.parse(str)

  if(!d.lofi) throw new Error('Unknown data')
  if(typeof d.v === 'undefined') throw new Error('Unknown data version')
  if(!d.type) throw new Error('Unknown data type')
  if(!d.data) throw new Error('Unknown data content')
  
  return {
    type: d.type,
    data: d.data
  }
}