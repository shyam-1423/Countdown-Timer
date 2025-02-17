let countdownInterval; // Variable to store the countdown interval
let isPaused = false;  // Flag to check if the countdown is paused
let remainingTime = 0; // Variable to store the remaining time in seconds
let initialTime = 0;   // Store the initial time for reference
let colorChangeInterval; // Interval to change the background color periodically

// Array of dark colors to change the background
const darkColors = [
    '#040414',
    '#020113',
    '#0d0414',
    '#041005',
    '#0a0a1b'
];

let currentColorIndex = 0; // Index to track the current color for background

// Function to change the background color at regular intervals
function changeBackgroundColor() {
    if (!isPaused && remainingTime > 0) {
        // Cycle through dark colors
        currentColorIndex = (currentColorIndex + 1) % darkColors.length;
        document.body.style.background = darkColors[currentColorIndex];
    }
}

// Function to set the countdown preset time (in minutes)
function setPreset(minutes) {
    resetCountdown(); // Reset the previous countdown settings
    document.getElementById("days").value = "0"; // Reset days field
    document.getElementById("hours").value = "0"; // Reset hours field
    document.getElementById("minutes").value = minutes.toString(); // Set preset minutes
    document.getElementById("seconds").value = "0"; // Reset seconds field
    startCountdown(); // Start the countdown
}

// Function to start the countdown timer
function startCountdown() {
    // **Fix: Ensure only one countdown runs at a time**
    clearInterval(countdownInterval); // Clear any existing countdown interval
    clearInterval(colorChangeInterval); // Clear color change interval

    // Get values from input fields and convert to integers
    let days = parseInt(document.getElementById("days").value) || 0;
    let hours = parseInt(document.getElementById("hours").value) || 0;
    let minutes = parseInt(document.getElementById("minutes").value) || 0;
    let seconds = parseInt(document.getElementById("seconds").value) || 0;

    // Check if any time is set
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        alert("Please set a time value greater than 0");
        return;
    }

    // Convert the time to seconds
    remainingTime = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
    initialTime = remainingTime; // Store initial time for progress calculation

    // Start the background color change every 5 seconds
    colorChangeInterval = setInterval(changeBackgroundColor, 5000);
    isPaused = false; // Set paused to false
    updateTimer(); // Update the timer display
    countdownInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

// Function to pause the countdown
function pauseCountdown() {
    isPaused = true; // Set paused to true
    clearInterval(countdownInterval); // Stop the countdown interval
}

// Function to reset the countdown
function resetCountdown() {
    clearInterval(countdownInterval); // Clear countdown interval
    clearInterval(colorChangeInterval); // Clear color change interval
    isPaused = false; // Reset pause flag
    remainingTime = 0; // Reset remaining time
    initialTime = 0; // Reset initial time

    // Reset background color
    document.body.style.background = darkColors[0];
    currentColorIndex = 0; // Reset background color index

    // Reset all input fields
    document.getElementById("days").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("minutes").value = "";
    document.getElementById("seconds").value = "";

    // Reset the display and progress circles
    updateDisplay(0, 0, 0, 0);
    updateAllProgress(0);
}

// Function to update the timer display
function updateTimer() {
    if (remainingTime <= 0) {
        // If the countdown reaches 0, stop the intervals and show notification
        clearInterval(countdownInterval);
        clearInterval(colorChangeInterval);
        showNotification();
        updateDisplay(0, 0, 0, 0);
        updateAllProgress(0);
        document.body.style.background = darkColors[0];
        return;
    }

    // Calculate remaining days, hours, minutes, and seconds
    let d = Math.floor(remainingTime / 86400);
    let h = Math.floor((remainingTime % 86400) / 3600);
    let m = Math.floor((remainingTime % 3600) / 60);
    let s = remainingTime % 60;

    // Update the timer display
    updateDisplay(d, h, m, s);

    // Calculate progress for each unit of time
    let daysProgress = d / (Math.floor(initialTime / 86400) || 1);
    let hoursProgress = h / 24;
    let minutesProgress = m / 60;
    let secondsProgress = s / 60;

    // Update progress circles
    updateProgress("days-circle", daysProgress);
    updateProgress("hours-circle", hoursProgress);
    updateProgress("minutes-circle", minutesProgress);
    updateProgress("seconds-circle", secondsProgress);

    // Decrement the remaining time by 1 second
    remainingTime--;
}

// Function to update the displayed values for days, hours, minutes, and seconds
function updateDisplay(d, h, m, s) {
    document.getElementById("days-display").innerHTML = d.toString().padStart(2, '0');
    document.getElementById("hours-display").innerHTML = h.toString().padStart(2, '0');
    document.getElementById("minutes-display").innerHTML = m.toString().padStart(2, '0');
    document.getElementById("seconds-display").innerHTML = s.toString().padStart(2, '0');
}

// Function to update the progress circles (visual representation of the time)
function updateProgress(circleId, progress) {
    const circle = document.getElementById(circleId);
    const offset = 339 - (339 * progress); // Calculate stroke offset based on progress
    circle.style.strokeDashoffset = offset; // Apply the offset to the stroke
}

// Function to reset all progress circles to zero
function updateAllProgress(value) {
    updateProgress("days-circle", 0);
    updateProgress("hours-circle", 0);
    updateProgress("minutes-circle", 0);
    updateProgress("seconds-circle", 0);
}

// Function to show the notification when the countdown reaches zero
function showNotification() {
    const notification = document.getElementById("notification");
    notification.classList.add("show"); // Show the notification

    // Play sound when time is up
    let alarmSound = new Audio('./Assets/timesup.mp3');
    alarmSound.play();

    // After 3 seconds, remove the notification and open a new link
    setTimeout(() => {
        notification.classList.remove("show");
        window.open("https://aquanix1024.vercel.app/", "_blank", 500);
    }, 3000);
}

// Event listener to validate input fields for time (prevents negative values and values exceeding max)
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

// Function to update the current date and time display
function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
    setTimeout(updateDateTime, 1000); // Update every second
}

// Initialize the date and time display
updateDateTime();
