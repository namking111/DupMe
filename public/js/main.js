//Make socket connection
var socket = io();
// console.log("Helooooo")

//Get object from html
function getUsername() {
    var username = document.getElementById('username');
    socket.emit("username", username.value);
}

