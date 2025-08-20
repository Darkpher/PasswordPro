const levels = ["E3", "E2", "E1", "D3", "D2", "D1", "C3", "C2", "C1", "B3", "B2", "B1", "A3", "A2", "A1"];
let currentLevelIndex = 0;
let currentPassword = "";
let userName = "";
let passwordDisplayTime = 15000; // Time in milliseconds to display the password (15 seconds)
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

// High contrast mode state
let isHighContrastMode = false;

// Helper function to hide all pages
function hideAllPages() {
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("rules-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "none";
}

// Reset form fields when page loads
window.addEventListener('DOMContentLoaded', function() {
    // Reset input fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("gender").selectedIndex = 0;

    // Make sure only the landing page is visible
    hideAllPages();
    document.getElementById("landing-page").style.display = "flex";
    
    // Add event listener for hint button
    document.getElementById('hint-btn').addEventListener('click', function() {
        showHint();
    });
    
    // Add event listener for restart button
    document.getElementById('restart-btn').addEventListener('click', function() {
        restartGame();
    });
    
    // Add event listener for high contrast toggle
    document.getElementById('high-contrast-toggle').addEventListener('click', function() {
        toggleHighContrast();
    });
    
    // Check if high contrast mode was previously enabled
    if (localStorage.getItem('highContrastMode') === 'true') {
        enableHighContrast();
    }
    
    console.log("Page loaded - only landing page visible");
});

// Function to toggle high contrast mode
function toggleHighContrast() {
    if (isHighContrastMode) {
        disableHighContrast();
    } else {
        enableHighContrast();
    }
}

// Function to enable high contrast mode
function enableHighContrast() {
    document.body.classList.add('high-contrast');
    isHighContrastMode = true;
    localStorage.setItem('highContrastMode', 'true');
    
    // Update toggle button text
    document.querySelector('.high-contrast-toggle span').textContent = 'Normal Mode';
}

// Function to disable high contrast mode
function disableHighContrast() {
    document.body.classList.remove('high-contrast');
    isHighContrastMode = false;
    localStorage.setItem('highContrastMode', 'false');
    
    // Update toggle button text
    document.querySelector('.high-contrast-toggle span').textContent = 'High Contrast';
}

document.getElementById("start-button").addEventListener("click", function() {
    console.log("Start button clicked");
    // Hide all pages and show welcome screen
    hideAllPages();
    document.getElementById("welcome-screen").style.display = "block";
    
    // Add enter key event listener for name input after welcome screen is shown
    document.getElementById("name").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            startGame();
        }
    });
});

// Function to start the game after entering details
function startGame() {
    userName = document.getElementById("name").value;
    
    if (!userName) {
        alert("Please enter your name!");
        return;
    }
    
    console.log("Switching from Welcome Screen to Rules Screen");
    
    // Hide all pages and show rules screen
    hideAllPages();
    document.getElementById("rules-screen").style.display = "block";
    
    // Log for debugging
    console.log("Rules screen should now be visible");
}

// Function to show welcome screen (missing function)
function showWelcomeScreen() {
    // Hide all pages and show welcome screen
    hideAllPages();
    document.getElementById("welcome-screen").style.display = "block";
    
    // Reset the name input
    document.getElementById("name").value = "";
    
    // Reset game state
    currentLevelIndex = 0;
    currentPassword = "";
    userName = "";
    hintsUsed = 0;
    attempts = 0;
    correctAttempts = 0;
    
    // Stop any running timers
    stopTimer();
    
    console.log("Returned to welcome screen");
}

function showGame() {
    // Set a fixed timer duration
    setTimerDuration(15);
    
    // Hide all pages and show game screen
    hideAllPages();
    document.getElementById('game-screen').style.display = 'block';
    
    // Set user greeting
    document.getElementById('user-greeting').textContent = `Welcome, ${userName}! Let's begin.`;
    
    // Add event listeners for hint and restart buttons
    document.getElementById('hint-btn').addEventListener('click', function() {
        showHint();
    });
    
    document.getElementById('restart-btn').addEventListener('click', function() {
        restartGame();
    });
    
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
    
    // Start timer with 15 seconds display time
    startTimer(15);
    
    // Start timer for tracking time taken
    startTime = Date.now();
    
    // Hide password after 15 seconds
    setTimeout(() => {
        document.getElementById('password-display').textContent = '******';
        // Enable input and submit button after password is hidden
        document.getElementById('user-input').disabled = false;
        document.querySelector('button[onclick="checkPassword()"]').disabled = false;
        document.getElementById('user-input').focus();
    }, 15000);
}

// Modify the checkPassword function to properly handle game completion
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
        
        // Increment level
        currentLevelIndex++;
        
        // Update progress bar
        updateProgress();
        
        // Check if this is the final level (A1)
        if (completedLevel === 'A1') {
            // Show special completion popup for A1
            showA1CompletionPopup(timeTaken);
        } else if (currentLevelIndex >= levels.length) {
            // Show game over popup if we've completed all levels
            setTimeout(() => {
                showGameOverPopup();
            }, 1500);
        } else {
            // Show regular level popup for other levels
            showLevelPopup(timeTaken, completedLevel);
        }
        
        // Increment correct attempts
        correctAttempts++;
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
    
    // Increment total attempts
    attempts++;
}

// Modify the Enter key event listener to properly handle popup state
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        
        // Only check password if no popup is visible and input is not disabled
        if (!isPopupVisible && !this.disabled) {
            checkPassword();
        }
    }
});

// Modify the showLevelPopup function to set the popup state
function showLevelPopup(timeTaken, completedLevel) {
    // Calculate accuracy
const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
    
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

// Modify the closeLevelPopup function to properly handle level transitions
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
    if (isPopupVisible) return; // Don't show hint if a popup is visible
    
    const hintPopup = document.getElementById('hint-popup');
    const hintText = document.getElementById('hint-text');
    
    // Generate a hint based on the current password
    let hint = '';
    if (currentPassword.length > 0) {
        const firstChar = currentPassword[0];
        if (/\d/.test(firstChar)) {
            hint = 'The first character is a number.';
        } else if (/[a-z]/.test(firstChar)) {
            hint = 'The first character is a lowercase letter.';
        } else if (/[A-Z]/.test(firstChar)) {
            hint = 'The first character is an uppercase letter.';
        } else {
            hint = 'The first character is a special symbol.';
        }
    }
    
    hintText.textContent = hint;
    hintPopup.classList.remove('hidden');
}

// Modify the closeHintPopup function to reset the popup state
function closeHintPopup() {
    document.getElementById("hint-popup").classList.add("hidden");
    
    // Reset popup state
    isPopupVisible = false;
}

// Modify the restartGame function to reset the timer
function restartGame() {
    // Reset game state
    currentLevelIndex = 0;
    hintsUsed = 0;
    attempts = 0;
    correctAttempts = 0;
    
    // Clear any existing timers
    stopTimer();
    
    // Reset UI elements
    document.getElementById('message').textContent = '';
    document.getElementById('message').classList.remove('correct', 'incorrect');
    document.getElementById('user-input').value = '';
    
    // Reset progress bar
    document.getElementById("progress-bar").style.width = "0%";
    
    // Start a new game
    startLevel();
    
    console.log("Game restarted");
}

// Add a function to set custom timer duration
function setTimerDuration(seconds) {
    passwordDisplayTime = 15000; // Set to 15 seconds
}

// Modify the showGameOverPopup function to properly transition to password guard
function showGameOverPopup() {
    // Hide game screen
    document.getElementById('game-screen').style.display = 'none';
    
    // Show game over popup
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.classList.remove('hidden');
    
    // Update stats
    document.getElementById('final-level').textContent = `Level: ${levels[currentLevelIndex - 1]}`;
    document.getElementById('total-time').textContent = `${Math.round((Date.now() - startTime) / 1000)}s`;
    
    // Create confetti effect
    createConfetti();
    
    // Set popup state
    isPopupVisible = true;
    
    // Immediately show the password guard reminder
    showPasswordGuardReminder();
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
    // Hide game screen
    document.getElementById('game-screen').style.display = 'none';
    
    // Show completion message
    const gameOverPopup = document.getElementById('game-over-popup');
    gameOverPopup.classList.remove('hidden');
    
    // Update stats
    document.getElementById('final-level').textContent = 'Level: A1';
    document.getElementById('total-time').textContent = `${timeTaken}s`;
    
    // Create confetti effect
    createConfetti();
    
    // Set popup state
    isPopupVisible = true;
    
    // Immediately show the password guard reminder
    showPasswordGuardReminder();
}

// Function to show password guard reminder after game completion
function showPasswordGuardReminder() {
    document.getElementById('game-over-popup').classList.add('hidden');
    document.getElementById('password-guard-popup').classList.remove('hidden');
    
    // Add event listeners to reminder buttons
    const reminderButtons = document.querySelectorAll('.reminder-btn');
    reminderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const days = this.getAttribute('data-days');
            localStorage.setItem('passwordReminderDays', days);
            
            // Show confirmation message
            const message = document.getElementById('reminder-message');
            message.textContent = `We'll remind you to change your password in ${days} days`;
            message.classList.remove('hidden');
            
            // Highlight selected button
            reminderButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Function to generate a strong password
function generateStrongPassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    // Ensure at least one of each character type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)]; // Special
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Function to show password generator
function showPasswordGenerator() {
    document.getElementById('password-guard-popup').classList.add('hidden');
    document.getElementById('password-generator-popup').classList.remove('hidden');
    
    // Add event listener to toggle
    const toggle = document.getElementById('generate-toggle');
    const container = document.getElementById('generated-password-container');
    
    toggle.addEventListener('change', function() {
        if (this.checked) {
            const password = generateStrongPassword();
            document.getElementById('generated-password').textContent = password;
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });
}

// Function to copy generated password
function copyGeneratedPassword() {
    const password = document.getElementById('generated-password').textContent;
    navigator.clipboard.writeText(password).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}

// Function to show security tips
function showSecurityTips() {
    document.getElementById('password-generator-popup').classList.add('hidden');
    document.getElementById('security-tips-popup').classList.remove('hidden');
}

// Function to finish the game
function finishGame() {
    document.getElementById('security-tips-popup').classList.add('hidden');
    
    // Hide all pages and show landing page
    hideAllPages();
    document.getElementById('landing-page').style.display = 'flex';
    
    // Reset game state
    currentLevelIndex = 0;
    currentPassword = "";
    userName = "";
    hintsUsed = 0;
    attempts = 0;
    correctAttempts = 0;
    
    // Stop any running timers
    stopTimer();
    
    console.log("Returned to landing page");
}