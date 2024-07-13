import icongen from 'icon-gen'
import { rename } from 'fs/promises'

const sizesName = {
  'favicon32.png': '32x32.png', 
  'favicon128.png': '128x128.png', 
  'favicon256.png': '128x128@2x.png', 
  'favicon30.png': 'Square30x30Logo.png', 
  'favicon44.png': 'Square44x44Logo.png', 
  'favicon50.png': 'StoreLogo.png', 
  'favicon71.png': 'Square71x71Logo.png', 
  'favicon89.png': 'Square107x107Logo.png', 
  'favicon107.png': 'Square89x89Logo.png', 
  'favicon142.png': 'Square142x142Logo.png', 
  'favicon150.png': 'Square150x150Logo.png',
  'favicon284.png': 'Square284x284Logo.png', 
  'favicon310.png': 'Square310x310Logo.png',
  'favicon512.png': 'icon.png',
  'favicon.ico': 'icon.ico',
  'favicon.icns': 'icon.icns',
}


icongen('./icon.png', './icons', { 
  report: true,
  icns: {
    name: 'favicon',
    sizes: [ 1024 ]
  },
  favicon: {
    name: 'favicon',
    pngSizes: [
      32, 128, 256, 30, 44, 50, 
      71, 89, 107, 142, 150,
      284, 310, 512
    ],
    icoSizes: [ 256 ]
  }
})
.then( async (results) => {
  for(let i in sizesName){
    rename(`./icons/${i}`, `../../src-tauri/icons/${sizesName[i]}`)
  }
})
.catch((err) => {
  console.error(err)
})