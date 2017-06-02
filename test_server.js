var http = require('http')
var url = require('url')
var mock = require('./mock.js')

function getRandomStatus() {
  let rdm = Math.random()
  if (rdm > 0.6)
    return 'error'
  return 'loading'
}

http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname
  res.writeHead('200', {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': 'GET,POST',
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
  if (pathname == '/auditJob/findList.do') {
    res.write(JSON.stringify(mock.findList))
  } else if (pathname == '/auditJob/getDetail.do') {
    res.write(JSON.stringify(mock.getDetail))
  } else if (pathname == '/autidMethodInstance/getExecuteMethods.do') {
    let data = mock.getExecuteMethods
    data.data[0].children[0].status = getRandomStatus()
    res.write(JSON.stringify(data))
  } else if (pathname == '/auditJob/saveJob.do') {
    res.write(JSON.stringify(mock.saveJob))
  } else if (pathname == '/auditJob/addJob.do') {
    res.write(JSON.stringify(mock.addJob))
  } else if (pathname == '/auditJob/deleteById.do') {
    res.write(JSON.stringify(mock.deleteById))
  } else if (pathname == '/auditJob/renameJob.do') {
    res.write(JSON.stringify(mock.renameJob))
  } else if (pathname == '/auditResult/exportResult.do') {
    res.write(JSON.stringify(mock.exportResult))
  } else if (pathname == '/auditMethodModel/findMethods.do') {
    res.write(JSON.stringify(mock.findMethods))
  } else if (pathname == '/autidMethodInstance/getExecuteSingleMethod.do') {
    let data = mock.getExecuteSingleMethod
    data.data[0].children[0].status = getRandomStatus()
    res.write(JSON.stringify(data))
  } else if (pathname == '/auditMethodModel/downLoadTemplate.do') {
    res.write(JSON.stringify(mock.downLoadTemplate))
  } else if (pathname == '/auditMethodModel/uploadExternaldatasource.do') {
    res.write(JSON.stringify(mock.uploadExternaldatasource))
  } else if (pathname == '/auditJob/saveSingleMehtodJob.do') {
    res.write(JSON.stringify(mock.saveSingleMehtodJob))
  } else if (pathname == '/auditJob/isCanExecute.do') {
    res.write(JSON.stringify(mock.isCanExecute))
  } else if (pathname == '/auditDocument/uploadDocument.do') {
    res.write(JSON.stringify(mock.uploadDocument))
  } else if (pathname == '/auditDocument/deleteDocuments.do') {
    res.write(JSON.stringify(mock.deleteDocuments))
  } else if (pathname == '/auditDocument/downloadDocuments.do') {
    res.write(JSON.stringify(mock.downloadDocuments))
  } else if (pathname == '/sysUser/login.do') {
    res.write(JSON.stringify(mock.login))
  } else if (pathname == '/auditMethodModel/findBasicMethod.do') {
    res.write(JSON.stringify(mock.findBasicMethod))
  } else if (pathname == '/autidMethodInstance/getExecuteBasicMethod.do') {
    res.write(JSON.stringify(mock.getExecuteBasicMethod))
  }
  // 模型维护
  else if (pathname == '/auditCategory/getAllTree.do') {
    res.write(JSON.stringify(mock.getAllTree))
  } else if (pathname == '/auditCategory/add.do') {
    res.write(JSON.stringify(mock.addAuditCategory))
  } else if (pathname == '/auditCategory/update.do') {
    res.write(JSON.stringify(mock.updateAuditCategory))
  } else if (pathname == '/auditCategory/delete.do') {
    res.write(JSON.stringify(mock.deleteAuditCategory))
  }

  else if (pathname == '/auditItem/add.do') {
    res.write(JSON.stringify(mock.addAuditItem))
  }else if (pathname == '/auditItem/update.do') {
    res.write(JSON.stringify(mock.updateAuditItem))
  }else if (pathname == '/auditItem/delete.do') {
    res.write(JSON.stringify(mock.deleteAuditItem))
  }

  else if (pathname == '/auditMethodModel/add.do') {
    res.write(JSON.stringify(mock.addAuditMethodModel))
  }else if (pathname == '/auditMethodModel/update.do') {
    res.write(JSON.stringify(mock.updateAuditMethodModel))
  }else if (pathname == '/auditMethodModel/delete.do') {
    res.write(JSON.stringify(mock.deleteAuditMethodModel))
  }

  res.end()
}).listen(3000)
