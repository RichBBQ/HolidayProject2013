var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var port = process.env.VCAP_APP_PORT || 3000;

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/resource", express.static(__dirname + '/resource'));

app.get('/', function(req, res) {
    var demoFilePath = '/views/demo.html';
    res.sendfile(demoFilePath, {root: __dirname});
});

server.listen(port);
console.log("Application started on port: " + port);
