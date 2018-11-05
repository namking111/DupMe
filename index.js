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
//var min = maxusernumber;
//var max = minusernumber;
//var randomItem = 0;
//users[Math.floor(Math.random() * users.length)];

function randomIntInRange(min, max){
    return (Math.ceil(Math.random()*(max - min)+min));
  }
  
function getRandomInt(max) {
   // return Math.floor( (Math.random() * Math.floor(max)) +1 );
    return Math.floor( Math.random() * Math.floor(max) );
  }

//listen for conn event
io.on('connection', function (socket) {
    pattern = [];
    console.log('someone joins the game', socket.id);
    numUser++;
    console.log('Number of users: ' + numUser);

    if(users.length <= 2){
        console.log('range: ' + randomIntInRange(0, 1) );  
    }else{
        console.log('getRanMax: '+getRandomInt(users.length));
    }
    
    //console.log(getRandomInt(3));
    // expected output: 0, 1 or 2

   // randomItem = users[(Math.random() * users.length)+1];
   // randomItem = Math.floor(Math.random() * Math.floor(users));
    //console.log('The first randomized player : '+ randomItem);

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
        pattern=[];
        let user = users.find(obj => obj.socketId == data);
        user.isReady = true;
        io.sockets.emit('ready', users);
    });

    socket.on('switchPlayer', function (data) {
        users = data;
        console.log(users);
    });

    socket.on('avatar', function (data){
        console.log("Hello avatar from server");
        let user = users.find(obj => obj.socketId == data.socketId);
        user.avatar = data.value;
        io.sockets.emit('avatar', users);
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
        this.avatar;
    }
}
