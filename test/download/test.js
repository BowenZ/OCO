const Bagpipe = require('bagpipe')
const download = require('./download.js')

const IMG_BAIDU = 'https://www.baidu.com/img/bd_logo1.png'
const IMG_GOOGLE = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
const IMG_MICROSOFT = 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1hdz4?ver=69a2'
const IMG_BIG = 'https://www.invisionapp.com/subsystems/do_ui_kit/assets/img/hero-desktop.jpg'
const SVG_URL = 'https://babeljs.io/images/logo.svg'
const ERROR_URL = 'https://www.baidu.com'
const DIST_DIR = './images/'

download(IMG_BAIDU, DIST_DIR, null, function(err){
  if(err){
    console.log('++++download error: ', err, '++++')
  }else{
    console.log(`=====download finished====`)
  }
})

var bp = new Bagpipe(10, {
  refuse: false,
  timeout: 10000
})

for(let i = 0; i < 100; i++){
  bp.push(download, IMG_BIG, DIST_DIR, `img${i}.jpg`, function(err){
    if(err){
      console.log('++++download error: ', err, '++++')
    }else{
      console.log(`=====download finished====`)
    }
  })
}