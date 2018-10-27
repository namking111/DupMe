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
countDown(10, "status");
function countDown(secs, elem) {
    var element = document.getElementById(elem);
    element.innerHTML = '<button type="button" class="btn btn-info">Time : ' + secs + '</button>';

    if (secs < 1) {
        clearTimeout(timer);
        element.innerHTML = '<p>Time up!</p>';
        //window.location.href = "ending.html" + queryString;
        //window.location = "ending.html";
        //ไว้เปลี่ยนหน้า      
    }
    secs--;
    var timer = setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
}

function startTimer(duration, display) {
    //timer chage page
    var timer = duration, minutes, seconds;
    var end = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            //window.location = "ending.html";
            window.location.href = "ending.html" + queryString;
            clearInterval(end);
        }
    }, 1000);
}
gameEnd();
function gameEnd() {
    window.onload = function () {
        var fiveMinutes = 10,
            display = document.querySelector('#time');
        startTimer(fiveMinutes, display);
    };
}



//save value into array
var data = [];
function myFunctionA() {
    data.push("A");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
}
function myFunctionB() {
    data.push("B");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
}
function myFunctionC() {
    data.push("C");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
}
function myFunctionD() {
    data.push("D");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
}
function myFunctionE() {
    data.push("E");
    var showdata = data.toString();
    document.getElementById("showdata").innerHTML = showdata;
}