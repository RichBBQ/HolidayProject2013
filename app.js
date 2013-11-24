var app = require('express').createServer();
var port = process.env.VCAP_APP_PORT || 3000;

app.get('/', function(req, res) {
    res.send('Hello from <a href="http://appfog.com">AppFog.com</a>');
//    res.sendfile('./views/demo.html');
});
app.listen(port);
console.log("Application started on port: " + port);
