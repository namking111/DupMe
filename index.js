var express = require('express');
var socket = require('socket.io');

//App seetup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening to requests on port 4000');
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

//listen for conn event
io.on('connection', function(socket){
    console.log('made socket connection')
});