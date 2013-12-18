/**
 * Created by RichBB on 12/11/13.
 */
// Setting up Mongodb
var mongo;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
}
else {
    mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"db"
    }
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);
var mongodb = require('mongodb');
var ipCollection;
mongodb.connect(mongourl, function(err, conn) {
    conn.collection('ips', function (err, coll) {
        ipCollection = coll;
    });
});

var playerCollection;
mongodb.connect(mongourl, function(err, conn) {
    conn.collection('player', function (err, coll) {
        playerCollection = coll;
    });
});

// Private helper functions
function calculateAndInsertAggregatedAttrs(playersData) {
    for (var p in playersData) {
        // sanity check
        if (!playersData.hasOwnProperty(p)) {
            continue;
        }
        var player = playersData[p];
        var level = parseInt(player['level']);
        var basePow = parseInt(player['pow'])
        var baseHp = parseInt(player['hp']);
        var baseAgi = parseInt(player['agi']);
        var bonusPow = parseInt(player['bpow']);
        var bonusHp = parseInt(player['bhp']);
        var bonusAgi = parseInt(player['bagi']);

        // Level effects (20% increase per level)
        basePow = basePow + Math.round((basePow * (level - 1) * 2) / 10);
        baseHp = baseHp + Math.round((baseHp * (level - 1) * 2) / 10);
        baseAgi = baseAgi + Math.round((baseAgi * (level - 1) * 2) / 10);

        // Aggregated attributes
        var aggrPow = basePow + bonusPow;
        var aggrHp = baseHp + bonusHp;
        var aggrAgi = baseAgi + bonusAgi;

        // Stuff data back
        player['pow'] = basePow;
        player['hp'] = baseHp;
        player['agi'] = baseAgi;
        player['bpow'] = bonusPow;
        player['bhp'] = bonusHp;
        player['bagi'] = bonusAgi;

        player['aggrPow'] = aggrPow;
        player['aggrHp'] = aggrHp;
        player['aggrAgi'] = aggrAgi;

        player['bR'] = parseInt(player['bR']);
        player['bB'] = parseInt(player['bB']);
        player['bY'] = parseInt(player['bY']);
        player['bG'] = parseInt(player['bG']);
        player['bL'] = parseInt(player['bL']);
    }
}

// Assumes calculateAndInsertAggregatedAttrs has already been called
function applyMonsterTypeBonusForPlayers(playersData, monsterData) {
    var bonusType = 'b'; // bonus prefix
    // For now we will only have one monster... so this is okay...
    for (var m in monsterData) {
        if (monsterData[m]['monsterType']) {
            bonusType += monsterData[m]['monsterType'].toUpperCase();
        }
        else {
            // monster doesn't have a type. No go... just return, nothing to see here.
            return;
        }
    }

    for (var p in playersData) {
        var playerData = playersData[p];
        if (playerData[bonusType] != undefined && playerData[bonusType] > 0) {
            playerData['aggrPow'] = Math.round( (playerData['aggrPow'] * (100 + playerData[bonusType])) / 100);
            playerData['aggrHp'] = Math.round( (playerData['aggrHp'] * (100 + playerData[bonusType])) / 100);
            playerData['aggrAgi'] = Math.round( (playerData['aggrAgi'] * (100 + playerData[bonusType])) / 100);
        }
    }
}

module.exports = {
    testInsertIp: function(req, res) {
        object_to_insert = { 'ip': req.connection.remoteAddress, 'ts': new Date() };
        ipCollection.insert( object_to_insert, {safe:true}, function(err){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(JSON.stringify(object_to_insert));
            res.end('\n');
        });
    },
    resetPlayerCollection: function(){
        playerCollection.drop();
    },
    deletePlayer: function(toDelete) {
        playerCollection.remove(toDelete, {safe: true}, function(err){
            if (err) {
                console.log("fail to delete player data for: " + toDelete);
            }
            else {
                console.log("deleted: " + toDelete);
            }
        });
    },
    insertPlayer: function(playerData) {
        playerCollection.insert(playerData, {safe:true}, function(err){
            if (err) {
                console.log("fail to insert player data for: " + playerData);
            }
            else {
                console.log("inserted " + JSON.stringify(playerData));
            }
        });
    },
    getAllPlayerDataAsString: function(callback) {
        playerCollection.find({},{},function(err, cursor) {
            var returnString = "";
            cursor.toArray(function(err, items) {
                for (var i = 0; i < items.length; i++) {
                    var playerDataAsString = JSON.stringify(items[i]);
                    returnString += playerDataAsString + "\n";
                }
                callback(returnString);
            });
        });
    },
    getPlayerData: function(queryData, callback) {
        var toQuery = [];
        // push in players
        for (var i = 1; i <= 5; i++) {
            var playerName = queryData['p' + i];
            if (playerName) {
                toQuery.push(playerName);
            }
        }
        // push in monsters
        for (var i = 1; i <= 1; i++) {
            var monsterName = queryData['m' + i];
            if (monsterName){
                toQuery.push(monsterName);
            }
        }
        var playerDataJson = {};
        var monsterDataJson = {};
        if (toQuery.length > 0) {
            playerCollection.find({playerName: {$in: toQuery}}, {}, function(err, cursor){
                cursor.toArray(function(tooArrayErr, items){
                    for (var i = 0; i < items.length; i++){
                        var actorData = items[i];
                        if (actorData.actorType == "p") {
                            playerDataJson[actorData.playerName] = actorData;
                        }
                        else {
                            monsterDataJson[actorData.playerName] = actorData;
                        }
                    }
                    calculateAndInsertAggregatedAttrs(playerDataJson);
                    calculateAndInsertAggregatedAttrs(monsterDataJson);
                    applyMonsterTypeBonusForPlayers(playerDataJson, monsterDataJson);
                    callback(playerDataJson, monsterDataJson);
                });
            });
        }
        else { // Nothing to query
            callback(playerDataJson, monsterDataJson);
        }
    }
}

