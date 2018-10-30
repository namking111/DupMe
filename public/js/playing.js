//Make socket connection
var socket = io();

/*var player = Math.floor(Math.random() * 2) + 1;
console.log(player);
if (player == 1) {
    startGameFirst();
} else {
    waitToPlay();
}


//play for 10 sec
//wait for 20 sec
function startGameFirst() {
    countDown(10, "status");
}
*/

//play for 10 sec
//wait for 20 sec
//function waitToPlay() {
//}

function countDown(secs, elem) {
    var element = document.getElementById(elem);
    element.innerHTML = '<button type="button" class="btn btn-info">Time : ' + secs + '</button>';

    if (secs < 1) {
        clearTimeout(timer);
        element.innerHTML = '<p>Time up!</p>';
        show('endingPage', 'game');
       // window.location.href = "ending.html" + queryString;
        //window.location = "ending.html";
        //ไว้เปลี่ยนหน้า      
    }
    secs--;
    var timer = setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
}

// function startTimer(duration, display) {
//     //timer chage page
//     var timer = duration, minutes, seconds;
//     var end = setInterval(function () {
//         minutes = parseInt(timer / 60, 10)
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         //display.textContent = minutes + ":" + seconds;

//         if (--timer < 0) {
            
//             //window.location = "ending.html";
//             //window.location.href = "ending.html" + queryString;
//             show('endingPage', 'game');
//             clearInterval(end);
//         }
//     }, 1000);
// }

gameEnd();
function gameEnd() {
    window.onload = function () {
        var fiveMinutes = 10,
            display = document.querySelector('#time');
        startTimer(fiveMinutes, display);
    };
}






//array name data
//check with new data player clicking
var dataTemp = ["A", "B", "C", "D", "E", "A", "B"];

var showdataTemp = dataTemp.toString();
document.getElementById("showdataTemp").innerHTML = showdataTemp;

var score = 0;
var i = 0;  //index

function calculateScore(data) {
    if (dataTemp[i] == data[i]) {
        score = score + 1;
    } else {
        alert("Game Over");
        show('endingPage', 'game');
        // document.getElementById("A").disabled = true;
        // document.getElementById("B").disabled = true;
        // document.getElementById("C").disabled = true;
        // document.getElementById("D").disabled = true;
        // document.getElementById("E").disabled = true;
    }
    i++;
    return score;
}
// calculateScore(dataTemp,score);
// document.getElementById("showScore").innerHTML = score;



//save value into array
var data = [];
function myFunctionA() {
    data.push("A");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
    score = calculateScore(data);


}
function getUsername() {
    var username = document.getElementById('username');
    var div = document.getElementById('name1');
    div.innerHTML = div.innerHTML + username.value;
    socket.emit("username", username.value);
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

