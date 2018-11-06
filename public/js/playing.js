//Make socket connection
var socket = io();
//users store User object which contains user information
var users = [];
//pattern store pattern of clicked buttons
var pattern = [];
var copyPattern = [];
//isTurn is a boolean indicate whether it's his/her turn
var isTurn;
var sound = document.getElementById("buttonsound");

var statusIndex = 0;
var timerIndex = 0;
var data = [];
var dataTemp = [];
var showdataTemp = "";
var showdata = "";
var score = 0;
var userIndex = 1;
var setlevel=0;


//Listening for call from server
socket.on('username', function (data) {
    users = data;
    let user = users.find(obj => obj.socketId == socket.id);
    userIndex = user.index;
    console.log(userIndex);
    for (i = 0; i < users.length; i++) {
        if (users[i].index == 1) {
            document.getElementById("playername1").innerHTML = users[i].name;
            document.getElementById("player1").innerHTML = users[i].name;
        } else {
            document.getElementById("playername2").innerHTML = users[i].name;
            document.getElementById("player2").innerHTML = users[i].name;
        }
    }
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

    // div.innerHTML += "<div style='font-size:40px ;color:#ff8080; width: 10em; text-align: center; margin: 5px auto;'>Player name: " + data[data.length - 1].name + "</div>";
});

socket.on('motto', function (data) {
    users = data;
    for (i = 0; i < users.length; i++) {
        if (users[i].index == 1) {
            document.getElementById("playername1Motto").innerHTML = "<span style='color: black; font-size: 15pt; font-style:italic'>'" + users[i].motto + "'</span>";
        } else {
            document.getElementById("playername2Motto").innerHTML = "<span style='color: black; font-size: 15pt; font-style:italic'>'" + users[i].motto + "'</span>";
        }
    }
});

socket.on('pattern', function (data) {
    //console.log(pattern + " data: " + data);

    if (data.round == 0) {
        pattern = data.pattern;
        showdataTemp = pattern.toString();
        document.getElementById("showdataTemp").innerHTML = showdataTemp;
    } else if (data.round == 1) {
        copyPattern = data.copyPattern;
        showdata = copyPattern.toString();
        document.getElementById("showdata").innerHTML = showdata;
        score = calculateScore(pattern, copyPattern);
    }
})

socket.on('resetCopyPattern', function(data){
    console.log("reset on front");
    copyPattern = [];
    document.getElementById("showdata").innerHTML = "";
})


socket.on('ready', function (data) {
    users = data;
    if (users.length > 1 && (users[0].isReady && users[1].isReady)) {
        show('game', 'welcomePage');
        countDown(10, "status");
        checkTurn();
    }
})

socket.on('surrend', function (data){
    alert("Surrender!!");
    show('endingPage', 'game');
})

socket.on('avatar', function (data) {
    users = data;
    for (i = 0; i < users.length; i++) {
        if (users[i].index == 1) {
            if (users[i].avatar == "yellow") {
                document.getElementById("pic1").src = "img/alien3.jpeg";
                document.getElementById("pic11").src = "img/alien3.jpeg";
            } else if (users[i].avatar == "blue") {
                document.getElementById("pic1").src = "img/alien7.jpeg";
                document.getElementById("pic11").src = "img/alien7.jpeg";
            }
            else if (users[i].avatar == "pink") {
                document.getElementById("pic1").src = "img/alien8.jpeg";
                document.getElementById("pic11").src = "img/alien8.jpeg";
            }
            else if (users[i].avatar == "green") {
                document.getElementById("pic1").src = "img/alien4.jpeg";
                document.getElementById("pic11").src = "img/alien4.jpeg";
            }

        } else {
            if (users[i].avatar == "yellow") {
                document.getElementById("pic2").src = "img/alien3.jpeg";
                document.getElementById("pic22").src = "img/alien3.jpeg";
            } else if (users[i].avatar == "blue") {
                document.getElementById("pic2").src = "img/alien7.jpeg";
                document.getElementById("pic22").src = "img/alien7.jpeg";
            }
            else if (users[i].avatar == "pink") {
                document.getElementById("pic2").src = "img/alien8.jpeg";
                document.getElementById("pic22").src = "img/alien8.jpeg";
            }
            else if (users[i].avatar == "green") {
                document.getElementById("pic2").src = "img/alien4.jpeg";
                document.getElementById("pic22").src = "img/alien4.jpeg";
            }
        }
    }

})

function countDown(secs, elem) {
    var element = document.getElementById(elem);
    element.innerHTML = '<button type="button" class="btn btn-info">Time : ' + secs + '</button>';
    secs--;
    var timer = window.setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
    showAndHideArray();
    // statusIndex=0  1st player create array
    // statusIndex=1  2st player copy array
    // statusIndex=2  2st player create array
    // statusIndex=3  1st player copy array
    if (secs < 0) {
        if (timerIndex == 0 || timerIndex == 2) {
            setTimeout(function () { element.innerHTML = "READY" }, 1000);
            disableAllButton();

        }
        if (timerIndex == 1) {
            setTimeout(function () { element.innerHTML = "READY" }, 1000);
            pattern = [];
            copyPattern = [];
            socket.emit('resetPattern');
            document.getElementById("showdataTemp").innerHTML = pattern;
            document.getElementById("showdata").innerHTML = copyPattern;
        }
    }
    if (secs < -1) {
        if (timerIndex == 0 || timerIndex == 2) {
            setTimeout(function () { element.innerHTML = "SET" }, 1000);
        }
        if (timerIndex == 1) {
            setTimeout(function () { element.innerHTML = "SET" }, 1000);
            disableAllButton();
        }
        if (timerIndex == 3) {
            pattern = [];
            copyPattern = [];
            socket.emit('resetPattern');
            clearTimeout(timer);
            element.innerHTML = '<p>Time up!</p>';
            show('endingPage', 'game');
        }
    }
    if (secs < -2) {
        switchPlayer();
        if (timerIndex == 0 || timerIndex == 2) {
            setTimeout(function () { element.innerHTML = "COPY" }, 1000);
            disableAllButton();
        }
        if (timerIndex == 1) {
            setTimeout(function () { element.innerHTML = "PLAY" }, 1000);
            disableAllButton();
        }
    }
    if (secs < -3) {
        if (timerIndex == 0) {
            statusIndex = 1;
            timerIndex = 1;
            enableAllButton();
            clearTimeout(timer);
            countDown(21, "status");
        } else if (timerIndex == 1) {
            statusIndex = 0;
            timerIndex = 2;
            enableAllButton();
            clearTimeout(timer);
            countDown(11, "status");
        } else if (timerIndex == 2) {
            statusIndex = 1;
            timerIndex = 3;
            enableAllButton();
            switchBack();
            clearTimeout(timer);
            countDown(21, "status");
        } else {
            // after 2nd player played
            clearTimeout(timer);
            element.innerHTML = '<p>Time up!</p>';
            show('endingPage', 'game');
        }
        //ไว้เปลี่ยนหน้า      
    }

}
function myStopFunction() {
    for (i = 0; i < 100; i++) {
        window.clearTimeout(i);
        // document.getElementById("player1").innerHTML = users[0].name;
        // document.getElementById("player2").innerHTML = users[1].name;
    }
}

function showAndHideArray() {
    if (timerIndex == 0) {
        // document.getElementById("showdata").style.visibility = 'hidden';
        // document.getElementById("showdataTemp").style = 'display:visible;';
    } else if (timerIndex == 1 && userIndex == 1) {
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style = 'display:visible;';
    } else if (timerIndex == 1 && userIndex == 2) {
        document.getElementById("showdataTemp").style.visibility = 'hidden';
        document.getElementById("showdata").style = 'display:visible;';
    } else if (timerIndex == 2) {
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style.visibility = 'hidden';
    } else if (timerIndex == 3 && userIndex == 1) {
        document.getElementById("showdataTemp").style.visibility = 'hidden';
        document.getElementById("showdata").style = 'display:visible;';
    } else if (timerIndex == 3 && userIndex == 2) {
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style = 'display:visible;';
    }
}

function gameStart() {
    // start 1st 10 second
    var queryString = "?" + name;
    dataTemp = [];
    showdataTemp = "";
    score = 0;
    i = 0;
    pattern = [];
    data = [];
    pattern.length = 0;
    data.length = 0;
    dataTemp.length = 0;
    showdata = "";
    timerIndex = 0;
    statusIndex = 0;
    document.getElementById("showdata").innerHTML = showdata;
    document.getElementById("showScore").innerHTML = score;
    show('game', 'welcomePage');
    countDown(10, "status");

}
//array name data
//check with new data player clicking

// var score = 0;
// var length = dataTemp.length + 1;
var i = 0;  //index

function calculateScore(pattern, copyPattern) {
    if(pattern[copyPattern.length-1]==copyPattern[copyPattern.length-1]){
        score++;
    }else{
        score = 0;
        socket.emit('resetCopyPattern');
    }
    
    return score;
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
    socket.emit("username", { socketId: socket.id, username: username.value });
    if(lan =="1"){
        alert("ยินดีต้อนรับ " + username.value + " !");
    }else{
        alert("Welcome " + username.value + " !");
}
    }
    

function switchPlayer() {
    console.log("Hello from switch");
    let user1 = users.find(obj => obj.index == 1);
    user1.isTurn = false;
    let user2 = users.find(obj => obj.index == 2);
    user2.isTurn = true;
    checkTurn();
    socket.emit("switchPlayer", users);
}
function switchBack() {
    let user1 = users.find(obj => obj.index == 1);
    user1.isTurn = true;
    let user2 = users.find(obj => obj.index == 2);
    user2.isTurn = false;
    checkTurn();
    socket.emit("switchBack", users);
}

function playSound() {
    buttonsound.play();
}
function changeBG() {
    document.body.style.backgroundColor = "white";
}
function changeBG1() {
    document.body.style.backgroundColor = "#FFA8A2";
}
function changeBG2() {
    document.body.style.backgroundColor = "powderblue";
}
function changeBG3() {
    document.body.style.backgroundColor = "#FCE476";
}

function setReady() {
    socket.emit('ready', socket.id);
    document.getElementById('ready').style.visibility = 'hidden';
    document.getElementById('wait').style = 'display:visible;';
}

function setlevele(){
    socket.emit('easy',socket.id);
    alert("You choose EASY!");
    setlevel = 0; // easy = 0
}

function setlevelh(){
    socket.emit('easy',socket.id);
    alert("You choose HARD!");
    setlevel = 1; // hard = 1
}
//save value into array
var data = [];
//Check whether it his/her turn
function checkTurn() {
    user = users.find(obj => obj.socketId == socket.id);
    isTurn = user.isTurn;
    if (isTurn) {
        enableAllButton();
    } else {
        disableAllButton();
    }
}

function enableAllButton() {
    document.getElementById('A').disabled = false;
    document.getElementById('B').disabled = false;
    document.getElementById('C').disabled = false;
    document.getElementById('D').disabled = false;
    document.getElementById('E').disabled = false;
    document.getElementById('F').disabled = false;
}

function disableAllButton() {
    document.getElementById('A').disabled = true;
    document.getElementById('B').disabled = true;
    document.getElementById('C').disabled = true;
    document.getElementById('D').disabled = true;
    document.getElementById('E').disabled = true;
    document.getElementById('F').disabled = true;
}

function myFunctionA() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "A", round: statusIndex });
    } else {

    }
}

function myFunctionB() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "B", round: statusIndex });
    } else {

    }
}
function myFunctionC() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "C", round: statusIndex });
    } else {

    }
}
function myFunctionD() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "D", round: statusIndex });
    } else {

    }
}
function myFunctionE() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "E", round: statusIndex });
    } else {

    }
}
function myFunctionF() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "F", round: statusIndex });
    } else {

    }
}

function playAgain() {
    show('welcomePage', 'endingPage');
    dataTemp = [];
    showdataTemp = "";
    score = 0;
    i = 0;
    pattern = [];
    data = [];
    showdata = "";
    timerIndex = 0;
    statusIndex = 0;
    document.getElementById("showdata").innerHTML = showdata;
    document.getElementById("showScore").innerHTML = score;
    gameStart();
    console.log(showdataTemp)
}

function surrend(){
    socket.emit('surrend', socket.id);
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
var color;
function changeAvatar() {
    color = document.getElementById("myRadioYellow").value.toString();
    // if (users.length == 1) {
    //     document.getElementById("pic1").src = "img/alien3.jpeg";
    //     document.getElementById("pic11").src = "img/alien3.jpeg";
    // }
    // else {
    //     document.getElementById("pic2").src = "img/alien3.jpeg";
    //     document.getElementById("pic22").src = "img/alien3.jpeg";

    // }

}
function changeAvatar2() {
    color = document.getElementById("myRadioBlue").value.toString();
    // if (users.length == 1) {
    //     document.getElementById("pic1").src = "img/alien7.jpeg";
    //     document.getElementById("pic11").src = "img/alien7.jpeg";
    // }
    // else {
    //     document.getElementById("pic2").src = "img/alien7.jpeg";
    //     document.getElementById("pic22").src = "img/alien7.jpeg";

    // }

}
function changeAvatar3() {
    color = document.getElementById("myRadioPink").value.toString();
    // if (users.length == 1) {
    //     document.getElementById("pic1").src = "img/alien8.jpeg";
    //     document.getElementById("pic11").src = "img/alien8.jpeg";
    // }
    // else {
    //     document.getElementById("pic2").src = "img/alien8.jpeg";
    //     document.getElementById("pic22").src = "img/alien8.jpeg";

    // }

}
function changeAvatar4() {
    color = document.getElementById("myRadioGreen").value.toString();
    // if (users.length == 1) {
    //     document.getElementById("pic1").src = "img/alien4.jpeg";
    //     document.getElementById("pic11").src = "img/alien4.jpeg";
    // }
    // else {
    //     document.getElementById("pic2").src = "img/alien4.jpeg";
    //     document.getElementById("pic22").src = "img/alien4.jpeg";

    // }

}
function getMotto() {
    motto = document.getElementById('motto');
    socket.emit("motto", { socketId: socket.id, motto: motto.value });
}
function setAvatar(color) {
    socket.emit('avatar', { socketId: socket.id, color: color });
}

function color() {
    alert(color);
}
var lan=2;
function changeLanguage(){
    lan = document.getElementById("language1").value;
    document.getElementById("usernameSubmit").value = "ไป";
    document.getElementById("settingb").value = "ตั้งค่า";
    document.getElementById("language1").value = "ไทย";
    document.getElementById("playpausebtn").value = "เพลงประกอบ";
    document.getElementById("backToMenu").value = "กลับหน้าหลัก";
    document.getElementById("setting1").value = "วิธีเล่น";
    document.getElementById("bg").value = "เปลี่ยนสีพื้นหลัง";
    document.getElementById("avatar1").value = "เปลี่ยนตัวละคร";
    document.getElementById("backToSetting").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("white").value = "ขาว";
    document.getElementById("pink").value = "ชมพู";
    document.getElementById("blue").value = "ฟ้า";
    document.getElementById("yellow").value = "เหลือง";
    document.getElementById("backToSetting1").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("backToSetting3").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("backToSetting4").value = "กลับไปหน้าตั้งค่า";
   // document.getElementById("readyB").value = "พร้อม";
    document.getElementById("resetB").value = "รีเซ็ต";
    document.getElementById("ready").value = "พร้อม";
    document.getElementById("languageP").value = "เปลี่ยนภาษา";

    document.getElementById("firstDupMe").innerHTML = "ดุ๊บมี";
    document.getElementById("mottoText").innerHTML = "โปรดใส่ข้อความเพื่อข่มขวัญศัตรู";
    document.getElementById("nameText").innerHTML = "โปรดใส่ชื่อเล่นของคุณ";
    document.getElementById("settingText").innerHTML = "ตั้งค่า";
    document.getElementById("howText").innerHTML = "วิธีเล่น";
    document.getElementById("bgText").innerHTML = "เปลี่ยนสีพื้นหลัง";
    document.getElementById("avatarText").innerHTML = "เปลี่ยนตัวละคร";
    document.getElementById("playerText").innerHTML = "ผู้เล่น";
    document.getElementById("lastDupMe").innerHTML = "ดุ๊บมี";
    document.getElementById("scoreText").innerHTML = "ตารางคะแนน";
    document.getElementById("languageText").innerHTML = "เปลี่ยนภาษา";
}
function changeLanguage2(){
    lan = document.getElementById("language2").value;
    document.getElementById("usernameSubmit").value = "Go";
    document.getElementById("settingb").value = "Setting";
    document.getElementById("playpausebtn").value = "Background Music";
    document.getElementById("backToMenu").value = "Back to Menu";
    document.getElementById("setting1").value = "How to play";
    document.getElementById("bg").value = "Change background";
    document.getElementById("avatar1").value = "Change your avatar";
    document.getElementById("backToSetting").value = "Back to setting";
    document.getElementById("white").value = "White";
    document.getElementById("pink").value = "Pink";
    document.getElementById("blue").value = "Blue";
    document.getElementById("yellow").value = "Yellow";
    document.getElementById("backToSetting1").value = "Back to setting";
    document.getElementById("backToSetting3").value = "Back to setting";
    document.getElementById("backToSetting4").value = "Back to setting";
    //document.getElementById("readyB").value = "Ready";
    document.getElementById("resetB").value = "Reset";
    document.getElementById("ready").value = "Ready";
    document.getElementById("languageP").value = "Change Language";

    document.getElementById("firstDupMe").innerHTML = "Dup Me";
    document.getElementById("mottoText").innerHTML = "Please enter your motto.";
    document.getElementById("nameText").innerHTML = "Please enter your nickname.";
    document.getElementById("settingText").innerHTML = "Setting";
    document.getElementById("howText").innerHTML = "How to play";
    document.getElementById("bgText").innerHTML = "Change Background Color";
    document.getElementById("avatarText").innerHTML = "Change your avatar";
    document.getElementById("playerText").innerHTML = "Player";
    document.getElementById("lastDupMe").innerHTML = "Dup Me";
    document.getElementById("scoreText").innerHTML = "Scoreboard";
    document.getElementById("languageText").innerHTML = "Change Language";
}