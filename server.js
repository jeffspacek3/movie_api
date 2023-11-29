
//Directory//

const http = require('http');
fs = require('fs'),
  url = require('url');


//HTTP Module//
http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, 'http://localhost:8080'),
    filePath = '';

    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
  
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
  
    });
  
  }).listen(8080);
  console.log('My test server is running on Port 8080.');


//URL Module//
let addr = request.url;
let q = new URL(addr, 'http://localhost:8080');

//FS System Module//
const fs = require("fs");

fs.readFile('input.txt', (err, data) => {
  if (err) {
    throw err;
  }
  console.log('File content: ' + data.toString());
});




