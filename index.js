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
var copyPattern = [];
var randomturn = 0;

function randomIntInRange(min, max) {
    randomturn = (Math.ceil(Math.random() * (max - min) + min));
    return randomturn;
}
console.log('randomturn: ' + randomIntInRange(0, 2));

//listen for conn event
io.on('connection', function (socket) {
    pattern = [];
    user = new User(socket.id);
    users.push(user);
    console.log('someone joins the game');
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
        let user = users.find(obj => obj.socketId == data.socketId);
        user.name = data.username;
        if (users.length == 2) {
            if (randomturn == 1) {
                users[1].isTurn = false; //player 2 ไม่ได้เล่น
                users[1].index = 2;
            } else {
                users[0].isTurn = false; //player 1 ไม่ได้เล่น
                users[0].index = 2;
            }
        }
        console.log(users);
        io.sockets.emit('username', users);
    });

    socket.on('pattern', function (data) {
        if (data.round == 0) {
            pattern.push(data.btn);
            io.sockets.emit('pattern', { pattern: pattern, round: data.round });
        } else {
            copyPattern.push(data.btn);
            io.sockets.emit('pattern', { copyPattern: copyPattern, round: data.round });
        }
    });

    socket.on('resetPattern', function (data) {
        pattern = [];
        copyPattern = [];
    });

    socket.on('resetCopyPattern', function (data) {
        copyPattern = [];
        socket.emit('resetCopyPattern');
    });

    socket.on('ready', function (data) {
        pattern = [];
        let user = users.find(obj => obj.socketId == data);
        user.isReady = true;
        io.sockets.emit('ready', users);
    });

    socket.on('surrend', function (data) {
        io.sockets.emit('surrend', users);
    });

    socket.on('switchPlayer', function (data) {
        users = data;
    });

    socket.on('avatar', function (data) {
        let user = users.find(obj => obj.socketId == data.socketId);
        user.avatar = data.color;
        io.sockets.emit('avatar', users);
    });

    socket.on('motto', function (data) {
        let user = users.find(obj => obj.socketId == data.socketId);
        user.motto = data.motto;
        io.sockets.emit('motto', users);
    });

    socket.on('score', function (data) {
        if (data.timerIndex == 1) {
            let user = users.find(obj => obj.index == 2);
            user.score = data.score;
        } else {
            let user = users.find(obj => obj.index == 1);
            user.score = data.score;
        }
        io.sockets.emit('score', users);
        console.log(users);
    });

    socket.on('level', function (data) {
        io.sockets.emit('level', data);
    })
});

class User {
    constructor(socketId) {
        this.name = "";
        this.socketId = socketId;
        this.score = 0;
        this.isReady = false;
        this.index = 1;
        this.isTurn = true;
        this.avatar = "yellow";
        this.motto = "";
    }
}
