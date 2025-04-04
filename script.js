const levels = ["E3", "E2", "E1", "D3", "D2", "D1", "C3", "C2", "C1", "B3", "B2", "B1", "A3", "A2", "A1"];
let currentLevelIndex = 0;
let currentPassword = "";
let userName = "";
let passwordDisplayTime = 2000; // Time in milliseconds to display the password
let startTime;
let hintsUsed = 0;
let attempts = 0;
let correctAttempts = 0;

// Add timer variables
let timerInterval;
let timeLeft;
let timerDisplay = document.getElementById('timer');

// Add a global variable to track popup state
let isPopupVisible = false;

// Reset form fields when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Reset input fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("gender").selectedIndex = 0;

    // Make sure only the landing page is visible
    document.getElementById("landing-page").style.display = "flex";
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("rules-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "none";
    
    // Add event listener for hint button
    document.getElementById('hint-btn').addEventListener('click', function() {
        showHint();
    });
    
    // Add event listener for restart button
    document.getElementById('restart-btn').addEventListener('click', function() {
        restartGame();
    });
});

document.getElementById("start-button").addEventListener("click", function() {
    console.log("Start button clicked");
    // Hide the landing page
    document.getElementById("landing-page").style.display = "none";
    // Show the welcome screen
    document.getElementById("welcome-screen").style.display = "block";
});

// Function to start the game after entering details
function startGame() {
    userName = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    
    if (!userName || !age || !gender) {
        alert("Please fill in all fields!");
        return;
    }
    
    console.log("Switching from Welcome Screen to Rules Screen");
    
    // Hide welcome screen
    document.getElementById("welcome-screen").style.display = "none";
    
    // Show rules screen
    const rulesScreen = document.getElementById("rules-screen");
    rulesScreen.style.display = "block";
    
    // Log for debugging
    console.log("Rules screen should now be visible");
}

function showGame() {
    // Set a fixed timer duration
    setTimerDuration(15);
    
    // Hide rules screen
    document.getElementById('rules-screen').style.display = 'none';
    
    // Show game screen
    document.getElementById('game-screen').style.display = 'block';
    
    // Set user greeting
    document.getElementById('user-greeting').textContent = `Welcome, ${userName}! Let's begin.`;
    
    // Start the game
    startLevel();
}

function generatePassword(level) {
    const levelConfig = {
        "E3": [4, "0123456789"], "E2": [6, "0123456789"], "E1": [8, "0123456789"],
        "D3": [4, "abcdefghijklmnopqrstuvwxyz"], "D2": [6, "abcdefghijklmnopqrstuvwxyz"], "D1": [8, "abcdefghijklmnopqrstuvwxyz"],
        "C3": [4, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"], "C2": [6, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"], "C1": [8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"],
        "B3": [4, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"], "B2": [6, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"], "B1": [8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"],
        "A3": [4, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"], "A2": [6, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"], "A1": [8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"]
    };
    let [length, chars] = levelConfig[levels[level]];
    return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Function to start the timer
function startTimer(seconds) {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Set initial time
    timeLeft = seconds;
    timerDisplay.textContent = timeLeft;
    timerDisplay.classList.remove('warning');
    timerDisplay.style.display = 'block'; // Ensure timer is visible
    
    // Start countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        // Add warning class when time is running low (less than 5 seconds)
        if (timeLeft <= 5) {
            timerDisplay.classList.add('warning');
            playSound('warning');
        }
        
        // When timer reaches zero
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Handle time's up - but don't disable input
            document.getElementById('message').textContent = "Time's up! Enter the password.";
            document.getElementById('message').classList.add('incorrect');
            playSound('error');
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// Modify the startLevel function to disable input while password is visible
function startLevel() {
    // Reset message and input
    document.getElementById('message').textContent = '';
    document.getElementById('message').classList.remove('correct', 'incorrect');
    document.getElementById('user-input').value = '';
    
    // Disable input and submit button while password is visible
    document.getElementById('user-input').disabled = true;
    document.querySelector('button[onclick="checkPassword()"]').disabled = true;
    
    // Update level display
    document.getElementById('level-badge').textContent = `Level: ${levels[currentLevelIndex]}`;
    document.getElementById('level-text').textContent = `Level: ${levels[currentLevelIndex]}`;
    
    // Generate new password
    currentPassword = generatePassword(currentLevelIndex);
    
    // Display password
    document.getElementById('password-display').textContent = currentPassword;
    
    // Start timer with the display time (2 seconds by default)
    startTimer(passwordDisplayTime / 1000);
    
    // Start timer for tracking time taken
    startTime = Date.now();
    
    // Hide password after display time - use the same duration as the timer
    setTimeout(() => {
        document.getElementById('password-display').textContent = '******';
        // Enable input and submit button after password is hidden
        document.getElementById('user-input').disabled = false;
        document.querySelector('button[onclick="checkPassword()"]').disabled = false;
        document.getElementById('user-input').focus();
    }, passwordDisplayTime);
}

// Modify the checkPassword function to stop the timer when checking
function checkPassword() {
    // Stop the timer when checking password
    stopTimer();
    
    const userInput = document.getElementById('user-input').value;
    
    if (userInput === currentPassword) {
        // Correct password
        document.getElementById('message').textContent = 'Correct!';
        document.getElementById('message').classList.add('correct');
        document.getElementById('message').classList.remove('incorrect');
        
        isPopupVisible = true;
        
        // Add success animation
        document.getElementById('password-display').classList.add('success-animation');
        setTimeout(() => {
            document.getElementById('password-display').classList.remove('success-animation');
        }, 500);
        
        // Create confetti effect
        createConfetti();
        
        // Add ripple effect to the game screen
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        document.getElementById('game-screen').appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 1000);
        
        // Calculate time taken
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        
        // Store the current level before incrementing
        const completedLevel = levels[currentLevelIndex];
        
        // Check if this is the A1 level (final level)
        if (completedLevel === 'A1') {
            // Show special completion popup for A1
            showA1CompletionPopup(timeTaken);
        } else {
            // Show regular level popup for other levels
            showLevelPopup(timeTaken, completedLevel);
        }
        
        // Increment level
        currentLevelIndex++;
        
        // Update progress bar
        updateProgress();
        
        // Check if game is complete
        if (currentLevelIndex >= levels.length) {
            // Show game over popup after a short delay
            setTimeout(() => {
                showGameOverPopup();
            }, 1500);
        }
    } else {
        // Incorrect password
        document.getElementById('message').textContent = 'Incorrect! Try again.';
        document.getElementById('message').classList.add('incorrect');
        document.getElementById('message').classList.remove('correct');
        
        // Add shake animation
        document.getElementById('user-input').classList.add('shake-animation');
        setTimeout(() => {
            document.getElementById('user-input').classList.remove('shake-animation');
        }, 500);
        
        // Play error sound
        playSound('error');
        
        // Clear input for retry
        document.getElementById('user-input').value = '';
        
        // Re-enable the button after a short delay
        setTimeout(() => {
            document.querySelector('button[onclick="checkPassword()"]').disabled = false;
        }, 500);
    }
}

// Modify the Enter key event listener to use the global popup state
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // Only check password if no popup is visible
        if (!isPopupVisible) {
            checkPassword();
        }
    }
});

// Modify the showLevelPopup function to set the popup state
function showLevelPopup(timeTaken, completedLevel) {
    // Calculate accuracy
    const accuracy = Math.round((correctAttempts / attempts) * 100);
    
    // Update popup content with the completed level
    document.getElementById("level-info").textContent = `You completed Level ${completedLevel}!`;
    document.getElementById("level-description").textContent = getLevelDescription(currentLevelIndex);
    document.getElementById("time-taken").textContent = `${timeTaken}s`;
    document.getElementById("accuracy").textContent = `${accuracy}%`;
    
    // Show popup
    const levelPopup = document.getElementById("level-popup");
    levelPopup.classList.remove("hidden");
    
    // Set popup state to visible
    isPopupVisible = true;
}

// Get level description
function getLevelDescription(level) {
    const descriptions = [
        "Great start! You're getting familiar with the game.",
        "You're making progress! Keep going.",
        "You're improving! Your memory is getting stronger.",
        "Impressive! You're handling more complex passwords.",
        "Excellent! You're mastering the basics.",
        "Outstanding! You're ready for more challenges.",
        "Amazing! You're handling advanced patterns.",
        "Brilliant! Your memory skills are impressive.",
        "Fantastic! You're approaching expert level.",
        "Incredible! You're handling complex sequences.",
        "Remarkable! You're almost at the top.",
        "Extraordinary! You're among the best.",
        "Unbelievable! You've reached the highest level!",
        "Legendary! You've mastered the game!",
        "Perfect! You're a PasswordPro now!"
    ];
    
    return descriptions[Math.min(level, descriptions.length - 1)];
}

// Modify the closeLevelPopup function to reset the popup state
function closeLevelPopup() {
    // Hide the popup
    const levelPopup = document.getElementById("level-popup");
    levelPopup.classList.add("hidden");
    
    // Reset popup state
    isPopupVisible = false;
    
    // Check if game is complete
    if (currentLevelIndex >= levels.length) {
        // Show game over popup
        showGameOverPopup();
    } else {
        // Start next level
        startLevel();
    }
}

function updateProgress() {
    let progress = (currentLevelIndex / (levels.length - 1)) * 100; // Only full at last level
    if (currentLevelIndex === levels.length) {
        progress = 100; // Ensure full bar only after last level is completed
    }
    document.getElementById("progress-bar").style.width = progress + "%";
}

// Modify the showHint function to set the popup state
function showHint() {
    // Generate a hint based on the current password
    let hintText = "";
    
    if (currentPassword.length > 0) {
        // Show first character type
        const firstChar = currentPassword.charAt(0);
        if (/[0-9]/.test(firstChar)) {
            hintText = "The first character is a number.";
        } else if (/[a-z]/.test(firstChar)) {
            hintText = "The first character is a lowercase letter.";
        } else if (/[A-Z]/.test(firstChar)) {
            hintText = "The first character is an uppercase letter.";
        } else {
            hintText = "The first character is a special character.";
        }
        
        // Add length hint
        hintText += ` The password is ${currentPassword.length} characters long.`;
    } else {
        hintText = "Generate a new password first.";
    }
    
    // Update hint text
    document.getElementById("hint-text").textContent = hintText;
    
    // Show hint popup
    document.getElementById("hint-popup").classList.remove("hidden");
    
    // Set popup state to visible
    isPopupVisible = true;
}

// Modify the closeHintPopup function to reset the popup state
function closeHintPopup() {
    document.getElementById("hint-popup").classList.add("hidden");
    
    // Reset popup state
    isPopupVisible = false;
}

// Modify the restartGame function to reset the timer
function restartGame() {
    // Reset game variables
    currentLevelIndex = 0;
    attempts = 0;
    correctAttempts = 0;
    
    // Stop any running timer
    stopTimer();
    
    // Hide all popups
    document.getElementById('level-popup').classList.add('hidden');
    document.getElementById('hint-popup').classList.add('hidden');
    document.getElementById('game-over-popup').classList.add('hidden');
    
    // Start new game
    startLevel();
    updateProgress();
}

// Add a function to set custom timer duration
function setTimerDuration(seconds) {
    passwordDisplayTime = seconds * 1000;
    // If game is in progress, restart with new timer duration
    if (document.getElementById('game-screen').style.display !== 'none') {
        startLevel();
    }
}

// Modify the showGameOverPopup function to set the popup state
function showGameOverPopup() {
    // Calculate total time
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    
    // Get the last completed level
    const lastCompletedLevel = levels[levels.length - 1];
    
    // Update popup content
    document.getElementById("final-level").textContent = `Level: ${lastCompletedLevel}`;
    document.getElementById("total-time").textContent = `${totalTime}s`;
    
    // Show popup
    document.getElementById("game-over-popup").classList.remove("hidden");
    
    // Set popup state to visible
    isPopupVisible = true;
    
    // Create confetti effect
    createConfetti();
    
    // Play game over sound
    playSound("gameover");
    
    // Add success animation to the game screen
    document.getElementById("game-screen").classList.add("success-animation");
    setTimeout(() => {
        document.getElementById("game-screen").classList.remove("success-animation");
    }, 1000);
    
    // Create fireworks effect
    createFireworks();
}

// Create confetti effect
function createConfetti() {
    const confettiCount = 100; // Increased from 50 to 100
    const colors = ["#ff3366", "#f8f8ff", "#1a1a3a", "#2a2a4a", "#ffcc00", "#00ccff", "#ff00ff", "#00ff00"];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        
        // Random size between 5 and 15 pixels (increased max size)
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random position at the top of the screen
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = "0";
        
        // Random animation delay
        confetti.style.animationDelay = `${Math.random() * 1}s`;
        
        // Add to body
        document.body.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
    
    // Play success sound
    playSound("success");
}

// Add sound effects
function playSound(type) {
    const audio = new Audio();
    
    switch(type) {
        case "success":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/success-1-6297.wav";
            break;
        case "error":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/error-1-6296.wav";
            break;
        case "click":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/click-1-6295.wav";
            break;
        case "levelup":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/level-up-1-6294.wav";
            break;
        case "gameover":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/game-over-1-6293.wav";
            break;
        case "warning":
            audio.src = "https://assets.mixkit.co/active_storage/sfx/2018/warning-1-6292.wav";
            break;
    }
    
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Modify the showA1CompletionPopup function to set the popup state
function showA1CompletionPopup(timeTaken) {
    // Calculate accuracy
    const accuracy = Math.round((correctAttempts / attempts) * 100);
    
    // Update popup content with special message
    document.getElementById("level-info").textContent = "Congratulations! You have passed the final level 🎉";
    document.getElementById("level-description").textContent = "You are PasswordPro! Keep practicing regularly to reduce the risk of Alzheimer's and maintain your memory.";
    document.getElementById("time-taken").textContent = `${timeTaken}s`;
    document.getElementById("accuracy").textContent = `${accuracy}%`;
    
    // Show popup
    document.getElementById("level-popup").classList.remove("hidden");
    
    // Set popup state to visible
    isPopupVisible = true;
    
    // Create extra special effects
    createFireworks();
    playSound("levelup");
    
    // Add extra confetti
    setTimeout(() => {
        createConfetti();
    }, 500);
}
