let countdownInterval;
let isPaused = false;
let remainingTime = 0;
let initialTime = 0;
let colorChangeInterval;

const darkColors = [
    '#040414',
    '#020113',
    '#0d0414',
    '#041005',
    '#0a0a1b'
];

let currentColorIndex = 0;

function changeBackgroundColor() {
    if (!isPaused && remainingTime > 0) {
        currentColorIndex = (currentColorIndex + 1) % darkColors.length;
        document.body.style.background = darkColors[currentColorIndex];
    }
}

// **Fix: Properly reset before starting a new countdown**
function setPreset(minutes) {
    resetCountdown(); // Reset previous countdown
    document.getElementById("days").value = "0";
    document.getElementById("hours").value = "0";
    document.getElementById("minutes").value = minutes.toString();
    document.getElementById("seconds").value = "0";
    startCountdown();
}

function startCountdown() {
    // **Fix: Ensure only one countdown runs at a time**
    clearInterval(countdownInterval);
    clearInterval(colorChangeInterval);

    let days = parseInt(document.getElementById("days").value) || 0;
    let hours = parseInt(document.getElementById("hours").value) || 0;
    let minutes = parseInt(document.getElementById("minutes").value) || 0;
    let seconds = parseInt(document.getElementById("seconds").value) || 0;

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        alert("Please set a time value greater than 0");
        return;
    }

    remainingTime = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
    initialTime = remainingTime;

    colorChangeInterval = setInterval(changeBackgroundColor, 5000);
    isPaused = false;
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

function pauseCountdown() {
    isPaused = true;
    clearInterval(countdownInterval);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    clearInterval(colorChangeInterval);
    isPaused = false;
    remainingTime = 0;
    initialTime = 0;

    document.body.style.background = darkColors[0];
    currentColorIndex = 0;

    document.getElementById("days").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("minutes").value = "";
    document.getElementById("seconds").value = "";

    updateDisplay(0, 0, 0, 0);
    updateAllProgress(0);
}

function updateTimer() {
    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        clearInterval(colorChangeInterval);
        showNotification();
        updateDisplay(0, 0, 0, 0);
        updateAllProgress(0);
        document.body.style.background = darkColors[0];
        return;
    }

    let d = Math.floor(remainingTime / 86400);
    let h = Math.floor((remainingTime % 86400) / 3600);
    let m = Math.floor((remainingTime % 3600) / 60);
    let s = remainingTime % 60;

    updateDisplay(d, h, m, s);

    let daysProgress = d / (Math.floor(initialTime / 86400) || 1);
    let hoursProgress = h / 24;
    let minutesProgress = m / 60;
    let secondsProgress = s / 60;

    updateProgress("days-circle", daysProgress);
    updateProgress("hours-circle", hoursProgress);
    updateProgress("minutes-circle", minutesProgress);
    updateProgress("seconds-circle", secondsProgress);

    remainingTime--;
}

function updateDisplay(d, h, m, s) {
    document.getElementById("days-display").innerHTML = d.toString().padStart(2, '0');
    document.getElementById("hours-display").innerHTML = h.toString().padStart(2, '0');
    document.getElementById("minutes-display").innerHTML = m.toString().padStart(2, '0');
    document.getElementById("seconds-display").innerHTML = s.toString().padStart(2, '0');
}

function updateProgress(circleId, progress) {
    const circle = document.getElementById(circleId);
    const offset = 339 - (339 * progress);
    circle.style.strokeDashoffset = offset;
}

function updateAllProgress(value) {
    updateProgress("days-circle", 0);
    updateProgress("hours-circle", 0);
    updateProgress("minutes-circle", 0);
    updateProgress("seconds-circle", 0);
}

function showNotification() {
    const notification = document.getElementById("notification");
    notification.classList.add("show");

    // Play sound when time is up
    let alarmSound = new Audio('./Assets/timesup.mp3');
    alarmSound.play();

    setTimeout(() => {
        notification.classList.remove("show");
        // Opens in the new tab
        window.open("https://aquanix1024.vercel.app/", "_blank", 500);
    }, 3000);
}



// **Fix: Validate inputs dynamically**
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        let value = parseInt(this.value) || 0;
        let max = parseInt(this.getAttribute('max'));

        if (max && value > max) {
            this.value = max;
        }
        if (value < 0) {
            this.value = 0;
        }
    });
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
    setTimeout(updateDateTime, 1000);
}
updateDateTime();