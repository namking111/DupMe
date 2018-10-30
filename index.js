var express = require('express');
var socket = require('socket.io');
var myip = require('quick-local-ip');
var path = require('path');

//App setup
var app = express();
var server = require('http').createServer(app);
server.listen(4000, '0.0.0.0', function () {
    console.log('listening to requests on port 4000');
    console.log('IP address', myip.getLocalIP4())
});

//Static files
app.use(express.static('public'));

//Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

//Socket setup
var io = socket(server);

var numUser = 0;
var username =[];
//listen for conn event
io.on('connection', function (socket) {
    console.log('someone joins the game');
    numUser++;
    console.log('Number of users: ' + numUser);
    socket.on('disconnect', function () {
        console.log('someone disconnected');
        numUser--;
        console.log('Number of users: ' + numUser);
        console.log(username);
    });

    socket.on('username', function(data){
        username.push(data);
    })
    
});


var PLAYER_LIST = {};
//player object;
var Player = function(id, nickname){
	var self = {
		id: id,
		nickname: nickname,
		score: 0,
		timer: null,
	}

	return self;
}
