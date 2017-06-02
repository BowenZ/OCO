const fs = require('fs')
const path = require('path')
const request = require('request')

module.exports = function download(src, distDir, fileName, callback) {
  fileName = fileName ? fileName : src.split('/').pop()
  const distFile = path.resolve(distDir, fileName)

  const picStream = fs.createWriteStream(distFile)

  picStream.on('error', function(err) {
    callback(err.message)
  })
  picStream.on('close', function(data) {
    console.log('file stream closed')
    if (this.bytesWritten == 0) {

    }
    callback()
  })

  request(src)
    .on('response', function(response) {
      console.log('response headers: ', response.headers['content-type'])
      if (response.headers['content-type'].split('/')[0] !== 'image') {
        this.abort()
        try{
          picStream.end(function(){
            fs.unlinkSync(distFile)
          })
        }catch(e){
          console.log(e.message)
        }
        callback('src is not a picture')
      }
    })
    .on('error', function(err) {
      this.abort()
      picStream.end(function(){
        fs.unlinkSync(distFile)
        callback(err.code)
      })
    })
    .pipe(picStream)
}
