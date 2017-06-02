const http = require('http')

function simpleStringify(object) {
  var simpleObject = {};
  for (var prop in object) {
    if (!object.hasOwnProperty(prop)) {
      continue;
    }
    if (typeof(object[prop]) == 'object') {
      continue;
    }
    if (typeof(object[prop]) == 'function') {
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); // returns cleaned up JSON
};

http.createServer((req, res) => {
  console.log(req.body)
  res.writeHeader(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': 'GET,POST',
    'Content-Type': 'text/html'
  });
  res.write('<pre>' + simpleStringify(req) + '</pre>')
  res.end('<h1>Hello</h1>')
}).listen(3000)
