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
var users = [];
var pattern = [];
//listen for conn event
io.on('connection', function (socket) {
    console.log('someone joins the game', socket.id);
    numUser++;
    console.log('Number of users: ' + numUser);
    socket.on('disconnect', function () {
        for (i = 0; i < users.length; i++) {
            if (users[i].socketId == socket.id) {
                users.splice(i, 1);
            }
        }
        console.log('someone disconnected');
        numUser--;
        console.log('Number of users: ' + numUser);
    });

    socket.on('username', function (data) {
        user = new User(data, socket.id);
        users.push(user);
        if (users.length > 1) {
            users[1].isTurn = false;
            users[1].index = 2;
        }
        console.log(users);
        io.sockets.emit('username', users);
    });

    socket.on('pattern', function (data) {
        pattern.push(data);
        io.sockets.emit('pattern', pattern);
    });

    socket.on('ready', function (data) {
        let user = users.find(obj => obj.socketId == data);
        user.isReady = true;
        io.sockets.emit('updateUsers', users);
    })

    socket.on('switchPlayer', function (data) {
        users = data;
        console.log(users);
    })

});

class User {
    constructor(name, socketId) {
        this.name = name;
        this.socketId = socketId;
        this.score = 0;
        this.isReady = false;
        this.index = 1;
        this.isTurn = true;
    }
}
var randomItem = users[Math.floor(Math.random() * users.length)];
console.log(randomItem);
