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
<<<<<<< HEAD
=======
var users = [];
>>>>>>> afdf0872cc712de0df5a94388eec35101e72a13e
//listen for conn event
io.on('connection', function (socket) {
    console.log('someone joins the game');
    numUser++;
    console.log('Number of users: ' + numUser);
    socket.on('disconnect', function () {
        console.log('someone disconnected');
        numUser--;
        console.log('Number of users: ' + numUser);
    });
<<<<<<< HEAD
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
=======

    socket.on('username', function (data) {
        user = new User(data, socket);
        users.push(user);
        console.log(users[0].name)
    });

    // socket.on('isClicked', function(data){
    //     users[1].socket.emit('sendPattern', data)
    // });

});

class User {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
        var score =0;
    }
}
var randomItem = users[Math.floor(Math.random()*users.length)];
console.log(randomItem);
>>>>>>> afdf0872cc712de0df5a94388eec35101e72a13e
