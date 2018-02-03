var express = require('express')
var serveIndex = require('serve-index');
var app = express()
 
app.get('/', function (req, res) {
  res.send({name: "danny", key: 1});
})
 
app.listen(8080)

console.log(__dirname);
app.use('/camera', serveIndex('/share/images'));
app.use('/camera', express.static('/share/images'));
app.use('/socket.io', express.static('node_modules/socket.io-client/dist'));
app.use(express.static('public'));