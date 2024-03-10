/* Variables DOM */
const buttonPlay = document.getElementById('buttonPlay');
const playIcon = document.getElementById('playIcon');
const buttonReset = document.getElementById('buttonReset');
const timeLeftDOM = document.getElementById('timeLeft');
const labelSessionBreak = document.getElementById('labelSessionBreak');
const sessionLengthDOM = document.getElementById('sessionLength');
const breakLengthDOM = document.getElementById('breakLength');
const sessionDecrement = document.getElementById('sessionDecrement');
const sessionIncrement = document.getElementById('sessionIncrement');
const breakDecrement = document.getElementById('breakDecrement');
const breakIncrement = document.getElementById('breakIncrement');
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];
const totalTimeDOM = document.getElementById('totalTime'); // Added this line

/* Variables */
let timeLeft = parseInt(timeLeftDOM.innerText.split(":")[0]) * 60 + parseInt(timeLeftDOM.innerText.split(":")[1]); // timeLeft in seconds
let playIsClicked = true;
let isSession = true; // Start with session timer
let breakLength = parseInt(breakLengthDOM.innerText) * 60;
let sessionLength = parseInt(sessionLengthDOM.innerText) * 60;
let elapsedSessionTime = 0;
let elapsedBreakTime = 0;
let startTime = 0; // Added this line

let interval;

function convertSeconds(seconds) {
    return {
        minutes: Math.floor(seconds / 60),
        seconds: seconds % 60
    };
}

/* Handle play/pause Button */
buttonPlay.addEventListener('click', () => {
    if (playIsClicked) {
        if (interval) clearInterval(interval);
        startTime = Date.now();
        interval = setInterval(handleTime, 1000);
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        clearInterval(interval);
        let elapsedTime = Date.now() - startTime;
        if (isSession) {
            elapsedSessionTime += Math.floor(elapsedTime / 1000);
        } else {
            elapsedBreakTime += Math.floor(elapsedTime / 1000);
        }
        startTime = 0;
        playIcon.classList.add('fa-play');
        playIcon.classList.remove('fa-pause');
    }
    playIsClicked = !playIsClicked;
});

/* Handle reset button */
buttonReset.addEventListener('click', () => {
    clearInterval(interval);
    playIsClicked = true; // Reset playIsClicked state
    playIcon.classList.add('fa-play');
    playIcon.classList.remove('fa-pause');
    timeLeft = parseInt(sessionLengthDOM.innerText) * 60;
    timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    labelSessionBreak.innerText = "Session";
    elapsedSessionTime = 0; // Reset elapsed session time
    elapsedBreakTime = 0; // Reset elapsed break time
    updateTotalTime(); // Update total time
});

/* Handle length button */
function handleLengthButton(htmlElement, isAddition, isBreakLength) {
    let lengthValue = parseInt(htmlElement.innerText);
    let result = isAddition ? ++lengthValue : --lengthValue;
    result = Math.max(1, result); // Ensure the value doesn't go below 1
    htmlElement.innerText = result;
    if (!playIsClicked) buttonPlay.click(); // Automatically start the timer if it's paused
    return result * 60;
}

sessionDecrement.addEventListener('click', () => {
    sessionLength = handleLengthButton(sessionLengthDOM, false, false);
    updateTotalTime(); // Update total time
    if (isSession) {
        timeLeft = sessionLength;
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    }
});

sessionIncrement.addEventListener('click', () => {
    sessionLength = handleLengthButton(sessionLengthDOM, true, false);
    updateTotalTime(); // Update total time
    if (isSession) {
        timeLeft = sessionLength;
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    }
});

breakDecrement.addEventListener('click', () => {
    breakLength = handleLengthButton(breakLengthDOM, false, true);
    updateTotalTime(); // Update total time
    if (!isSession) {
        timeLeft = breakLength;
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    }
});

breakIncrement.addEventListener('click', () => {
    breakLength = handleLengthButton(breakLengthDOM, true, true);
    updateTotalTime(); // Update total time
    if (!isSession) {
        timeLeft = breakLength;
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    }
});

/* Handle time */
function handleTime() {
    timeLeft--;
    if (timeLeft < 0) {
        clearInterval(interval);
        modal.style.display = "block";
        labelSessionBreak.innerText = isSession ? "Break" : "Session"; // Toggle between "Session" and "Break"
        document.getElementById('beep').currentTime = 0;
        document.getElementById('beep').play();
        if (isSession) {
            elapsedSessionTime += sessionLength;
        } else {
            elapsedBreakTime += breakLength;
        }
        isSession = !isSession;
        timeLeft = isSession ? sessionLength : breakLength;
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
        playIsClicked = true; // Set playIsClicked to true to prevent auto-resume after the modal
        playIcon.classList.add('fa-play');
        playIcon.classList.remove('fa-pause');
        updateTotalTime(); // Update total time
    } else {
        timeLeftDOM.innerText = `${('0' + Math.floor(timeLeft / 60)).slice(-2)}:${('0' + (timeLeft % 60)).slice(-2)}`;
    }
}

/* Update total time */
function updateTotalTime() {
    const totalSeconds = elapsedSessionTime + elapsedBreakTime;
    const totalHours = totalSeconds / 3600; // Convert to hours
    totalTimeDOM.innerText = `Total Time: ${totalHours.toFixed(2)} hours`;
}

/* Close modal */
closeBtn.onclick = function() {
    modal.style.display = "none";
    document.getElementById('beep').pause(); // Pause the alarm sound
    document.getElementById('beep').currentTime = 0; // Reset the alarm sound to the beginning
};
