//Make socket connection
var socket = io();

var username = {};
var sound = document.getElementById("buttonsound");
var alp = "";

//Listening for call from server
socket.on('username', function (data) {
    var div = document.getElementById('name1');
    div.innerHTML += "<div style='font-size:40px ;color:#ff8080; width: 10em; text-align: center; margin: 5px auto;'>Player name: " + data + "</div>";
    console.log('From client' + data);
})

socket.on('sendPattern', function (data) {
    // btnA = document.getElementById("A")
    // btnA.disabled =true;
    document.getElementById("username").value = "Hello from the other side"
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
    for(i=0; i<100; i++)
{
  window.clearTimeout(i);
      
}
}
    




//array name data
//check with new data player clicking
var dataTemp = ["A", "B", "C", "D", "E", "A", "B"];

var showdataTemp = dataTemp.toString();
document.getElementById("showdataTemp").innerHTML = showdataTemp;

var score = 0;
var length = dataTemp.length+1;
var i = 0;  //index

function calculateScore(data) {
    
    if (i < length) {
    if (objectsAreSame(data,dataTemp)) {
        score = score + 1; 
        if(i == length-1) {         
            alert("You Made It !! Your score is "+ score);
           show('endingPage', 'game'); 
           myStopFunction();
        return score;
        }
    } else {
        var sound1 = document.getElementById("wrong");
        sound1.play();
        alert("Game Over Your score is "+ score);
        show('endingPage', 'game');
        myStopFunction();
    }
    i++;
    return score;
    }else {
        alert("You Made It !!");
        show('endingPage', 'game');
        myStopFunction();
    
    }
    // else {
    //     alert("You Made It !!");
    //     show('endingPage', 'game');
    
    // }
} 

function objectsAreSame(x, y) {
    var objectsAreSame = true;
    for(var i in x) {
       if(x[i] !== y[i]) {
          objectsAreSame = false;
          break;
       }
    }
    return objectsAreSame;
 }
 function getUsername() {
    username = document.getElementById('username');
    var div = document.getElementById('name1');
    alert("hello "+username.value+"!");
    div.innerHTML = "<div style='font-size:40px ;color:#ff8080; width: 10em; text-align: center; margin: 5px auto;'>Player name: " + username.value + "</div>";
    socket.emit("username", username.value);
    //send name to the ending page
    document.getElementById("player1").innerHTML= username.value;
    //document.getElementById("player2").innerHTML= username.value;
}
function playSound() {
    buttonsound.play();
}
//save value into array
var data = [];
function myFunctionA() {
    sound.play();
    data.push("A");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    socket.emit("isClicked", "A");
    document.getElementById("showScore").innerHTML = score;

}

function myFunctionB() {
    sound.play();
    data.push("B");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionC() {
    sound.play();
    data.push("C");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionD() {
    sound.play();
    data.push("D");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionE() {
    sound.play();
    data.push("E");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}


function playAgain(){
    show('welcomePage','endingPage');
}   

// function mute(){
//     var audio = new Audio('sound/song.mp3');
//     audio.play();
//     audio.muted = true;
// }

var audio, playbtn, mutebtn, seek_bar;
            function initAudioPlayer(){
                audio = new Audio();
                audio.src = "sound/song.mp3";
                audio.loop = true;
                audio.play();
                // Set object references
                playbtn = document.getElementById("playpausebtn");
                //mutebtn = document.getElementById("mutebtn");
                // Add Event Handling
                playbtn.addEventListener("click",playPause);
                //mutebtn.addEventListener("click", mute);
                // Functions
                function playPause(){
                    if(audio.paused){
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