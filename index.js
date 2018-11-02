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
        io.sockets.emit('username', users[users.length-1].name);
    });

    socket.on('isClicked', function(data){
        
    });

});

class User {
    constructor(name, socketId) {
        this.name = name;
        this.socketId = socketId;
        var score = 0;
        var isReady = false;
        var order = 0;
        // var pattern = [];
    }
}
var randomItem = users[Math.floor(Math.random()*users.length)];
console.log(randomItem);
