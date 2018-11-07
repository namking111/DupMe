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
var dataTemp = [];
var showdataTemp = "";
var showdata = "";
var score = 0;
var userIndex = 1;
var setlevel = 0;
var hintValue = 1;
var sur = 0;


//Listening for call from server
socket.on('username', function (data) {
    users = data;
    let user = users.find(obj => obj.socketId == socket.id);
    userIndex = user.index;
    console.log(userIndex);
    for (i = 0; i < users.length; i++) {
        if (users[i].index == 1) {
            document.getElementById("playername1").innerHTML = users[i].name;
        } else {
            document.getElementById("playername2").innerHTML = users[i].name;
        }
    }
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
        document.getElementById("allCorrect").style.visibility = 'hidden';        
})

socket.on('resetCopyPattern', function (data) {
    document.getElementById("showdata").innerHTML = copyPattern.toString();
})

socket.on('ready', function (data) {
    users = data.users;
    for (i = 0; i < radioLevel.length; i++) {
        radioLevel[i].disabled = true;
    }
    if (users.length > 1 && (users[0].isReady && users[1].isReady)) {
        show('game', 'welcomePage');
        countDown(10, "status");
        checkTurn();
        if (data.level == "easy") {
            hide();
        }
    }
})

socket.on('surrend', function (data) {
    sur = 1;
    let winner;
    if(data.index == 1){
        winner = users.find(obj => obj.index == 2);
    }else{
        winner = users.find(obj => obj.index == 1);
    }
    document.getElementById("firstp").innerHTML = winner.name;
    document.getElementById("secondp").innerHTML = data.name + " have surrendered";
    alert("Surrender!!");
    show('endingPage', 'game');
})
socket.on('score', function (data) {
    users = data;
    let user1 = users.find(obj => obj.index == 1);
    document.getElementById("textPlayer1Score").innerHTML = user1.name + ' score: ' + user1.score;
    let user2 = users.find(obj => obj.index == 2);
    document.getElementById("textPlayer2Score").innerHTML = user2.name + ' score: ' + user2.score;
});

function winner(){
    if (users[0].score > users[1].score){
        document.getElementById("firstp").innerHTML = users[0].name + ' score: ' + users[0].score;
        document.getElementById("secondp").innerHTML = users[1].name + ' score: ' + users[1].score;
    }  else if (users[1].score > users[0].score){
        document.getElementById("firstp").innerHTML = users[1].name + ' score: ' + users[1].score;
        document.getElementById("secondp").innerHTML = users[0].name + ' score: ' + users[0].score;
    } else {
        document.getElementById("firstp").innerHTML = users[0].name + ' and ' + users[1].name +  ' score: ' + users[1].score;
        document.getElementById("secondp").style.visibility = 'hidden';
        document.getElementById("second").style.visibility = 'hidden';
    }
}

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

socket.on('level', function (data) {
    level = data;
    if (data == 'easy') {
        radioLevel[1].checked = true;
    } else {
        radioLevel[0].checked = true;
    }
})

function countDown(secs, elem) {
    var element = document.getElementById(elem);
    element.innerHTML = '<button type="button" class="btn btn-info">Time : ' + secs + '</button>';
    secs--;
    var timer = window.setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
    showAndHideArray();
    // timerIndex=0  1st player create array
    // timerIndex=1  2st player copy array
    // timerIndex=2  2st player create array
    // timerIndex=3  1st player copy array
    if (secs < 0) {
        document.getElementById("notturn").style.visibility = 'hidden';
        document.getElementById("hint").style.visibility = 'hidden';
        document.getElementById("surrend").style.visibility = 'hidden';
        if (timerIndex == 0 || timerIndex == 2) {
            setTimeout(function () { element.innerHTML = "READY" }, 1000);
            disableAllButton();
        }
        if (timerIndex == 1) {
            setTimeout(function () { element.innerHTML = "READY" }, 1000);
            pattern = [];
            copyPattern = [];
            score = 0;
            socket.emit('resetPattern');
            document.getElementById("showdataTemp").innerHTML = pattern;
            document.getElementById("showdata").innerHTML = copyPattern;
        }
    }
    if (secs < -1) {
        document.getElementById("notturn").style.visibility = 'hidden';
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
            if(sur == 0) {
                winner();
            }
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
            if(sur == 0) {
                winner();
            }
        }
        //ไว้เปลี่ยนหน้า      
    }

}
// function myStopFunction() {
//     for (i = 0; i < 100; i++) {
//         window.clearTimeout(i);
//     }
// }

function showAndHideArray() {
    if (timerIndex == 0 && userIndex == 1) {
        document.getElementById("hint").style.visibility = 'hidden';
        document.getElementById("surrend").style.visibility = 'hidden';
    }
    if (timerIndex == 0 && userIndex == 2) {
        document.getElementById('notturn').style = 'display:visible;';
        document.getElementById("hint").style.visibility = 'hidden';
        document.getElementById("surrend").style.visibility = 'hidden';
        document.getElementById("showdata").style.visibility = 'hidden';
        // document.getElementById("showdataTemp").style = 'display:visible;';
    } else if (timerIndex == 1 && userIndex == 1) {
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style = 'display:visible;';
        document.getElementById("notturn").style = 'display:visible;';
    } else if (timerIndex == 1 && userIndex == 2) {
        document.getElementById("showdataTemp").style.visibility = 'hidden';
        document.getElementById("showdata").style = 'display:visible;';
        document.getElementById("notturn").style.visibility = 'hidden';
        if (hintValue > 0) {
            document.getElementById("hint").style = 'display:visible;';
        }
        document.getElementById("surrend").style = 'display:visible;';
    } else if (timerIndex == 2) {
        if (userIndex == 1) {
            document.getElementById("notturn").style = 'display:visible;';
        }
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style.visibility = 'hidden';
        document.getElementById("hint").style.visibility = 'hidden';
        document.getElementById("surrend").style.visibility = 'hidden';
    } else if (timerIndex == 3 && userIndex == 1) {
        document.getElementById("showdataTemp").style.visibility = 'hidden';
        document.getElementById("showdata").style = 'display:visible;';
        document.getElementById("notturn").style.visibility = 'hidden';
        if (hintValue > 0) {
            document.getElementById("hint").style = 'display:visible;';
        }
        document.getElementById("surrend").style = 'display:visible;';
    } else if (timerIndex == 3 && userIndex == 2) {
        document.getElementById("notturn").style = 'display:visible;';
        document.getElementById("showdataTemp").style = 'display:visible;';
        document.getElementById("showdata").style = 'display:visible;';
    }
}

// var length = dataTemp.length + 1;
var i = 0;  //index

function calculateScore(pattern, copyPattern) {
    if (pattern[copyPattern.length - 1] == copyPattern[copyPattern.length - 1]) {
        score++;
    } else {
        score = 0;
        copyPattern = [];
        socket.emit('resetCopyPattern');
    }
    socket.emit("score", { timerIndex: timerIndex, score: score });
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
    if (lan == "1") {
        alert("ยินดีต้อนรับ " + username.value + " !");
    } else {
        alert("Welcome " + username.value + " !");
    }
}


function switchPlayer() {
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
    socket.emit('ready', { socketId: socket.id, level: level });
    document.getElementById('ready').style.visibility = 'hidden';
    document.getElementById('wait').style = 'display:visible;';
    console.log(level);
}

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
function myFunctionG() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "G", round: statusIndex });
    } else {

    }
}
function myFunctionH() {
    if (isTurn) {
        sound.play();
        socket.emit("pattern", { btn: "H", round: statusIndex });
    } else {

    }
}

function surrend() {
    timerIndex = 3;
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
}
function changeAvatar2() {
    color = document.getElementById("myRadioBlue").value.toString();
}
function changeAvatar3() {
    color = document.getElementById("myRadioPink").value.toString();
}
function changeAvatar4() {
    color = document.getElementById("myRadioGreen").value.toString();
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
var lan = 2;
function changeLanguage() {
    lan = "1";
    document.getElementById("usernameSubmit").value = "ไป";
    document.getElementById("settingb").value = "ตั้งค่า";
    document.getElementById("language1").value = "ไทย";
    document.getElementById("playpausebtn").value = "เพลงประกอบ";
    document.getElementById("backToMenu").value = "กลับหน้าหลัก";
    document.getElementById("setting1").value = "วิธีเล่น";
    document.getElementById("bg").value = "เปลี่ยนสีพื้นหลัง";
    document.getElementById("avatar1").value = "เปลี่ยนตัวละคร";
    document.getElementById("backToSetting").value = "กลับไปหน้าเมนู";
    document.getElementById("white").value = "ขาว";
    document.getElementById("pink").value = "ชมพู";
    document.getElementById("blue").value = "ฟ้า";
    document.getElementById("yellow").value = "เหลือง";
    document.getElementById("backToSetting1").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("backToSetting3").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("backToSetting4").value = "กลับไปหน้าตั้งค่า";
    document.getElementById("resetB").value = "รีเซ็ต";
    document.getElementById("ready").value = "พร้อม";
    document.getElementById("languageP").value = "เปลี่ยนภาษา";
    document.getElementById("gameT").value = "วิธีเล่น";
    document.getElementById("setT").value = "วิธีตั้งค่า";
    document.getElementById("backToHow1").value = "กลับ";
    document.getElementById("backToHow2").value = "กลับ";

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
    document.getElementById("levelText1").innerHTML = "ยาก";
    document.getElementById("levelText2").innerHTML = "ง่าย";
    document.getElementById("color1").innerHTML = " เหลือง";
    document.getElementById("color2").innerHTML = " ฟ้า";
    document.getElementById("color3").innerHTML = " ชมพู";
    document.getElementById("color4").innerHTML = " เขียว";
    document.getElementById("levelText").innerHTML = "ระดับ";
    document.getElementById("notturn").innerHTML = "โปรดรอรอบถัดไป";
    document.getElementById("setHowText").innerHTML = "วิธีตั้งค่า";
    document.getElementById("gameHowText").innerHTML = "วิธีเล่น";
    document.getElementById("l1").innerHTML = " ภาษาไทย";
    document.getElementById("l2").innerHTML = " ภาษาอังกฤษ";
    document.getElementById("wait").innerHTML = "โปรดรอ...";


}
function changeLanguage2() {
    lan = "2";
    document.getElementById("usernameSubmit").value = "Go";
    document.getElementById("settingb").value = "Setting";
    document.getElementById("playpausebtn").value = "Background Music";
    document.getElementById("backToMenu").value = "Back to Menu";
    document.getElementById("setting1").value = "How to play";
    document.getElementById("bg").value = "Change background";
    document.getElementById("avatar1").value = "Change your avatar";
    document.getElementById("backToSetting").value = "Back to menu";
    document.getElementById("white").value = "White";
    document.getElementById("pink").value = "Pink";
    document.getElementById("blue").value = "Blue";
    document.getElementById("yellow").value = "Yellow";
    document.getElementById("backToSetting1").value = "Back to setting";
    document.getElementById("backToSetting3").value = "Back to setting";
    document.getElementById("backToSetting4").value = "Back to setting";
    document.getElementById("resetB").value = "Reset";
    document.getElementById("ready").value = "Ready";
    document.getElementById("languageP").value = "Change Language";
    document.getElementById("gameT").value = "Game Tutorial";
    document.getElementById("setT").value = "Setting Tutorial";
    document.getElementById("backToHow1").value = "Back to How to play";
    document.getElementById("backToHow2").value = "Back to How to play";

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
    document.getElementById("levelText1").innerHTML = "Hard";
    document.getElementById("levelText2").innerHTML = "Easy";
    document.getElementById("color1").innerHTML = " Yellow";
    document.getElementById("color2").innerHTML = " Blue";
    document.getElementById("color3").innerHTML = " Pink";
    document.getElementById("color4").innerHTML = " Green";
    document.getElementById("levelText").innerHTML = "Level";
    document.getElementById("notturn").innerHTML = "Not your turn";
    document.getElementById("setHowText").innerHTML = "setting Tutorial";
    document.getElementById("gameHowText").innerHTML = "Game Tutorial";
    document.getElementById("l1").innerHTML = " Thai";
    document.getElementById("l2").innerHTML = " English";
    document.getElementById("wait").innerHTML = "waiting...";

}

//level tell how hard the game is
var level = "hard";
function hide() {
    level = document.getElementById("easy").value.toString();
    document.getElementById("F").style.display = "none";
    document.getElementById("G").style.display = "none";
    document.getElementById("H").style.display = "none";
}
function showB() {
    level = document.getElementById("hard").value.toString();
    document.getElementById("F").style.display = "inline";
    document.getElementById("G").style.display = "inline";
    document.getElementById("H").style.display = "inline";
}

var radioLevel = document.getElementsByName('radioLevel');
function setLevel() {
    //Hide button -> remain 5 buttons
    if (radioLevel[0].checked) {
        level = "hard";
    } else {
        level = "easy";
    }
    socket.emit('level', level);
}

function hint() {
    var hint = pattern[copyPattern.length];
    if(pattern.length==copyPattern.length){
        document.getElementById("allCorrect").style = 'display:visible;';
        document.getElementById("hint").style.visibility = 'hidden';
        hintValue--;
    }else if (hintValue > 0) {
        if(copyPattern[copyPattern.length-1] != pattern[copyPattern.length-1]){
            hint = pattern[0];
        }
        socket.emit("pattern", { btn: hint, round: 1 });
        hintValue--;
        document.getElementById("hint").style.visibility = 'hidden';
    }
}