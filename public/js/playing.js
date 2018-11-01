//Make socket connection
var socket = io();

var username = {};
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

    if (secs < 0) {
        clearTimeout(timer);
        element.innerHTML = '<p>Time up!</p>';
        show('endingPage', 'game');
        //ไว้เปลี่ยนหน้า      
    }
    secs--;
    var timer = setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
}
function myStopFunction() {
    clearTimeout(timer);
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);
}


gameEnd();
function gameEnd() {
    window.onload = function () {
        var fiveMinutes = 10,
            display = document.querySelector('#time');
        // startTimer(fiveMinutes, display);
    };
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
            document.getElementById("showScore").innerHTML = "";
            alert("You Made It !! Your score is "+ score);
           show('endingPage', 'game'); 
           myStopFunction();
        return score;
        }
    } else {
        alert("Game Over Your score is "+ score);
        show('endingPage', 'game');
        myStopFunction();

    }
    i++;
    return score;
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

//save value into array
var data = [];
function myFunctionA() {
    data.push("A");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    socket.emit("isClicked", "A");
    document.getElementById("showScore").innerHTML = score;

}

function myFunctionB() {
    data.push("B");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionC() {
    data.push("C");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionD() {
    data.push("D");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}
function myFunctionE() {
    data.push("E");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);
    document.getElementById("showScore").innerHTML = score;

}



