let countdownInterval = null;
let colorChangeInterval = null;
let isPaused = false;
let remainingTime = 0;    // Time in milliseconds
let startTime = 0;        // When countdown started
let pauseTime = 0;        // When countdown was paused
let initialTime = 0;      // Initial total time for progress calculations

const darkColors = [
    '#040414',
    '#020113',
    '#0d0414',
    '#041005',
    '#0a0a1b'
];
let currentColorIndex = 0;

// Function to change background color
function changeBackgroundColor() {
    if (!isPaused && remainingTime > 0) {
        currentColorIndex = (currentColorIndex + 1) % darkColors.length;
        document.body.style.backgroundColor = darkColors[currentColorIndex];
    }
}

// Set preset time
function setPreset(minutes) {
    resetCountdown();
    document.getElementById("days").value = "0";
    document.getElementById("hours").value = "0";
    document.getElementById("minutes").value = minutes.toString();
    document.getElementById("seconds").value = "0";
    startCountdown();
}

// Start or resume countdown
function startCountdown() {
    const days = parseInt(document.getElementById("days").value) || 0;
    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;

    // If starting fresh (not resuming from pause)
    if (!isPaused && remainingTime === 0) {
        remainingTime = (days * 86400000) + (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
        initialTime = remainingTime;

        if (remainingTime <= 0) {
            alert("Please set a time value greater than 0");
            return;
        }
    }

    // Clear existing intervals
    if (countdownInterval) clearInterval(countdownInterval);
    if (colorChangeInterval) clearInterval(colorChangeInterval);

    startTime = Date.now() - (pauseTime ? (pauseTime - startTime) : 0);
    isPaused = false;

    countdownInterval = setInterval(updateTimer, 50);
    colorChangeInterval = setInterval(changeBackgroundColor, 5000);
    updateTimer(); // Immediate update
}

// Pause countdown
function pauseCountdown() {
    if (!isPaused && remainingTime > 0) {
        isPaused = true;
        pauseTime = Date.now();
        clearInterval(countdownInterval);
        clearInterval(colorChangeInterval);
    }
}

// Reset countdown
function resetCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (colorChangeInterval) clearInterval(colorChangeInterval);

    isPaused = false;
    remainingTime = 0;
    startTime = 0;
    pauseTime = 0;
    initialTime = 0;
    currentColorIndex = 0;

    document.body.style.backgroundColor = darkColors[0];

    document.getElementById("days").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("minutes").value = "";
    document.getElementById("seconds").value = "";

    updateDisplay(0, 0, 0, 0);
    updateAllProgress(0);
}

// Update timer display
function updateTimer() {
    if (isPaused) return;

    remainingTime = Math.max(0, startTime + initialTime - Date.now());

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        clearInterval(colorChangeInterval);
        showNotification();
        resetCountdown();
        return;
    }

    const d = Math.floor(remainingTime / 86400000);
    const h = Math.floor((remainingTime % 86400000) / 3600000);
    const m = Math.floor((remainingTime % 3600000) / 60000);
    const s = Math.floor((remainingTime % 60000) / 1000);

    updateDisplay(d, h, m, s);

    // Update progress circles
    updateProgress("days-circle", initialTime ? (1 - (remainingTime / initialTime)) : 0);
    updateProgress("hours-circle", h / 24);
    updateProgress("minutes-circle", m / 60);
    updateProgress("seconds-circle", (remainingTime % 60000) / 60000);
}

// Update display values
function updateDisplay(d, h, m, s) {
    const daysDisplay = document.getElementById("days-display");
    const hoursDisplay = document.getElementById("hours-display");
    const minutesDisplay = document.getElementById("minutes-display");
    const secondsDisplay = document.getElementById("seconds-display");

    if (daysDisplay) daysDisplay.innerHTML = d.toString().padStart(2, '0');
    if (hoursDisplay) hoursDisplay.innerHTML = h.toString().padStart(2, '0');
    if (minutesDisplay) minutesDisplay.innerHTML = m.toString().padStart(2, '0');
    if (secondsDisplay) secondsDisplay.innerHTML = s.toString().padStart(2, '0');
}

// Update progress circle
function updateProgress(circleId, progress) {
    const circle = document.getElementById(circleId);
    if (circle) {
        const offset = 339 - (339 * Math.min(Math.max(progress, 0), 1));
        circle.style.strokeDashoffset = offset;
    }
}

// Reset all progress circles
function updateAllProgress(value) {
    updateProgress("days-circle", value);
    updateProgress("hours-circle", value);
    updateProgress("minutes-circle", value);
    updateProgress("seconds-circle", value);
}

// Show completion notification
function showNotification() {
    const notification = document.getElementById("notification");
    if (notification) {
        notification.classList.add("show");

        const alarmSound = new Audio('./Assets/timesup.mp3');
        alarmSound.play();

        setTimeout(() => {
            notification.classList.remove("show");
            window.open("https://aquanix1024.vercel.app/", "_blank");
        }, 3000);
    }
}

// Input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        let value = parseInt(this.value) || 0;
        const max = parseInt(this.getAttribute('max')) || Infinity;

        if (value > max) this.value = max;
        if (value < 0) this.value = 0;
    });
});

// Update current date/time
function updateDateTime() {
    const datetime = document.getElementById('datetime');
    if (datetime) {
        datetime.textContent = new Date().toLocaleString();
    }
    setTimeout(updateDateTime, 1000);
}

updateDateTime();