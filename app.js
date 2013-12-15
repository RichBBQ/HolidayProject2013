// Initialize application
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var port = process.env.VCAP_APP_PORT || 3000;
var db = require('./js/db.js');

// Setting up handlebars
var hbs = require('hbs');
// Enbale {{json data}} syntax on the template side
hbs.registerHelper('json', function(context){
    return JSON.stringify(context);
});
// Enable {{isEqual v1 v2}} syntax on the template side
hbs.registerHelper('isEqual', function(v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
app.set('view engine', 'html');
app.set('views', __dirname + '/views'); // telling handlebar where default views dir is
app.engine('html', hbs.__express);

// Static Contents
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/resource", express.static(__dirname + '/resource'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
    var demoFilePath = '/views/demo.html';
    res.sendfile(demoFilePath, {root: __dirname});
});

app.get('/testInsertIp', function(req, res) {
    db.testInsertIp(req, res);
});

app.get('/testQuery', function(req, res) {
    console.log(req.query);
    var renderParam = {
        title: "HBS title",
        head: "HBS head",
        queryData: req.query,
        layout: 'testQuery.html'
    };
    res.render('testQuery', renderParam);
});

// [App Groups] Data modification
app.get('/insertPlayer', function(req, res){
    var insertPlayerForm = '/views/insertPlayerForm.html';
    res.sendfile(insertPlayerForm, {root: __dirname});
});
app.get('/insertMonster', function(req, res){
    var insertMonsterForm = '/views/insertMonsterForm.html';
    res.sendfile(insertMonsterForm, {root: __dirname});

});
app.get('/deletePlayer', function(req, res){
    var insertPlayerForm = '/views/deletePlayerForm.html';
    res.sendfile(insertPlayerForm, {root: __dirname});
});
app.post('/insertActor', function(req, res) {
    console.log("insert player request received for: ");
    console.log(req.body);
    db.insertPlayer(req.body);
    res.writeHead(301, {Location: '/listAll'});
    res.end();
});
app.post('/deleteActor', function(req, res) {
    db.deletePlayer(req.body);
    res.writeHead(301, {Location: '/listAll'});
    res.end();
});
app.get('/listAll', function(req, res) {
    var dumpPlayerData = function(playerData){
        res.writeHead(200);
        res.end(playerData);
    }
    db.getAllPlayerDataAsString(dumpPlayerData);
});
app.get('/resetAll', function(req, res){
    db.resetPlayerCollection();
    res.end('Too late... everything is gone...');
});

// [App Group] Pipeline Pages
app.get('/enterTeams', function(req, res){
    var enterTeamsPage = '/views/enterTeams.html';
    res.sendfile(enterTeamsPage, {root: __dirname});
});
app.get('/battleSplash', function(req, res){
    var renderBattleSplash = function(playerData, monsterData) {
        var renderParam = {
            playerData: playerData,
            monsterData: monsterData,
            layout: 'battleSplash.html'
        };
        res.render('battleSplash', renderParam);
    }
    db.getPlayerData(req.query, renderBattleSplash)
});
app.get('/fightMonster', function(req, res){
    var renderFightMonster = function(playerData, monsterData) {
        var renderParam = {
            playerData: playerData,
            monsterData: monsterData,
            layout: 'fightMonster.html'
        };
        res.render('fightMonster', renderParam);
    }
    db.getPlayerData(req.query, renderFightMonster);
});

server.listen(port);
console.log("Application started on port: " + port);
