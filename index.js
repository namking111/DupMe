var express = require('express');
var socket = require('socket.io');

//App seetup
var app = express();
var server = app.listen(4000, function () {
    console.log('listening to requests on port 4000');
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

var numUser = 0;
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
});

//player object;
var Player = function(id, name){
	var self = {
		id: id,
		name: name,
		score: 0,
		timer: null,
	}

	return self;
}