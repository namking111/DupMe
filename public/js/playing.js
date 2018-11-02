//Make socket connection
var socket = io();
//users store User object which contains user information
var users = [];
//pattern store pattern of clicked buttons
var pattern = [];
var sound = document.getElementById("buttonsound");


// function setReadyGo() {
// 	setState--;
// 	document.getElementById("seconds").setState = timeleft;
// 	if (timeleft > 0) {
// 		setTimeout(setReadyGo, 300);
// 	}
// };

// setTimeout(setReadyGo, 300);

//Listening for call from server
socket.on('username', function (data) {
    var div = document.getElementById('name1');
    users = data;
    document.getElementById("playername2").innerHTML= users[1].name ;
    document.getElementById("playername1").innerHTML= users[0].name ;
    document.getElementById("player1").innerHTML= users[0].name ;
    document.getElementById("player2").innerHTML= users[1].name;
    
    // if (users.length%2==0) {
    //    document.getElementById("playername2").innerHTML= data[users.length-1].name ;
    // }else{
    //     document.getElementById("playername1").innerHTML= data[users.length-1].name ;
    
    // }
    // if (users.length%2==0) {
    //     document.getElementById("player1").innerHTML= users[users.length-1].name ;
    //  }else{
    //      document.getElementById("player2").innerHTML= users[users.length-1].name ;
     
    //  }
        
        
    
    //div.innerHTML += "<div style='font-size:40px ;color:#ff8080; width: 10em; text-align: center; margin: 5px auto;'>Player name: " + data[data.length - 1].name + "</div>";
    console.log('From client' + users[users.length - 1].name);
})

socket.on('pattern', function (data) {
    pattern = data;
    var showdata = pattern.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(pattern);
    document.getElementById("showScore").innerHTML = score;
})

function countDown(secs, elem) {
    var element = document.getElementById(elem);
    element.innerHTML = '<button type="button" class="btn btn-info">Time : ' + secs + '</button>';
    secs--;
    var timer = window.setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);

    if (secs < -1) {
        clearTimeout(timer);
        element.innerHTML = '<p>Time up!</p>';
        show('endingPage', 'game');
        //ไว้เปลี่ยนหน้า      
    }

}
function myStopFunction() {
    for (i = 0; i < 100; i++) {
        window.clearTimeout(i);
        document.getElementById("player1").innerHTML= users[0].name;
        document.getElementById("player2").innerHTML= users[1].name;

    }
}

//array name data
//check with new data player clicking
var dataTemp = ["A", "B", "C", "D", "E", "A", "B"];

var showdataTemp = dataTemp.toString();
document.getElementById("showdataTemp").innerHTML = showdataTemp;

var score = 0;
var length = dataTemp.length + 1;
var i = 0;  //index

function calculateScore(data) {

    if (i < length) {
        if (objectsAreSame(data, dataTemp)) {
            score = score + 1;
            if (i == length - 1) {
                alert("You Made It !! Your score is " + score);
                show('endingPage', 'game');
                myStopFunction();
                return score;
            }
        } else {
            var sound1 = document.getElementById("wrong");
            sound1.play();
            alert("Game Over Your score is " + score);
            show('endingPage', 'game');
            myStopFunction();
        }
        i++;
        return score;
    }
}

function objectsAreSame(x, y) {
    var objectsAreSame = true;
    for (var i in x) {
        if (x[i] !== y[i]) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
}
function getUsername() {
    username = document.getElementById('username');
    var div = document.getElementById('name1');
    socket.emit("username", username.value);
    alert("hello " + username.value + "!");
    // div.innerHTML += "<div style='font-size:40px ;color:#ff8080; width: 10em; text-align: center; margin: 5px auto;'>Player name: " + users[users.length - 1].name + "</div>";
    //send name to the ending page
    
}
function playSound() {
    buttonsound.play();
}
//save value into array
var data = [];
function myFunctionA() {
    sound.play();
    // data.push("A");
    socket.emit("pattern", "A");
    console.log(pattern);
    // var showdata = pattern.toString();
    // document.getElementById("showdata").innerHTML = showdata;
    // score = calculateScore(pattern);
    // document.getElementById("showScore").innerHTML = score;
}

function myFunctionB() {
    sound.play();
    socket.emit("pattern", "B");
}
function myFunctionC() {
    sound.play();
    socket.emit("pattern", "C");
}
function myFunctionD() {
    sound.play();
    socket.emit("pattern", "D");
}
function myFunctionE() {
    sound.play();
    socket.emit("pattern", "E");
}


function playAgain() {
    show('welcomePage', 'endingPage');
    data = [];
    score = 0;
    i = 1;

}   


// function mute(){
//     var audio = new Audio('sound/song.mp3');
//     audio.play();
//     audio.muted = true;
// }

var playbtn, mutebtn, seek_bar;
function initAudioPlayer() {
    audio = document.getElementById("audio");
    //audio.src = "sound/song.mp3";
    audio.loop = true;
    audio.play();
    audio.autoplay = true;
    // Set object references
    playbtn = document.getElementById("playpausebtn");
    //mutebtn = document.getElementById("mutebtn");
    // Add Event Handling
    playbtn.addEventListener("click", playPause);
    //mutebtn.addEventListener("click", mute);
    // Functions
    function playPause() {
        if (audio.paused) {
            audio.play();
            // playbtn.style.background = "url(images/pause.png) no-repeat";
        } else {
            audio.pause();
            //playbtn.style.background = "url(images/play.png) no-repeat";
        }
    }
    // function mute(){
    //     if(audio.muted){
    //         audio.muted = false;
    //         //mutebtn.style.background = "url(images/speaker.png) no-repeat";
    //     } else {
    //         audio.muted = true;
    //        //mutebtn.style.background = "url(images/speaker_muted.png) no-repeat";
    //     }
    // }
}
window.addEventListener("load", initAudioPlayer);

function reset() {                
    location.reload();
}
