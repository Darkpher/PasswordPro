const levels = ["E3", "E2", "E1", "D3", "D2", "D1", "C3", "C2", "C1", "B3", "B2", "B1", "A3", "A2", "A1"];
let currentLevelIndex = 0;
let currentPassword = "";
let userName = "";

document.getElementById("start-button").addEventListener("click", function() {
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
    
    document.getElementById("welcome-screen").style.display = "none"; // ซ่อน welcome screen
    document.getElementById("rules-screen").style.display = "block";  // แสดง rules screen
}

function showGame() {
    console.log("Switching from Rules Screen to Game Screen");

    document.getElementById("rules-screen").style.display = "none"; // ซ่อน rules screen
    document.getElementById("game-screen").style.display = "block";  // แสดง game screen

    document.getElementById("user-greeting").textContent = `Welcome, ${userName}! Let's begin.`;
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
    let [length, chars] = levelConfig[level];
    return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function checkPassword() {
    const userInput = document.getElementById("user-input").value;

    if (userInput === currentPassword) {
        document.getElementById("message").textContent = "✅ Correct! Moving to next level";
        currentLevelIndex++;

        if (currentLevelIndex < levels.length) {
            setTimeout(() => {
                startLevel();
                updateProgress();  // ✅ Make sure to update progress bar
                document.getElementById("user-input").value = ""; // ✅ Clear input box
            }, );
        } else {
            document.getElementById("message").textContent = "🎉 Congratulations! You've completed all levels! You are now PasswordPro ,Keep practicing regularly to reduce the risk of Alzheimer's and maintain your memory.";
            updateProgress(); // Ensure progress bar reaches 100%
        }
    } else {
        document.getElementById("message").textContent = "❌ Incorrect! Restarting from Level E3.";
        currentLevelIndex = 0;
        setTimeout(() => {
            currentLevelIndex = 0;
            document.getElementById("message").textContent = "";  // ✅ Clear message after restart
            startLevel();
            updateProgress();
        }, 2000);
    }
}

// Add event listener for Enter key press
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkPassword(); // Call the checkPassword function when Enter is pressed
    }
});

// Function to start the next level
function startLevel() {
    document.getElementById("message").textContent = ""; // ✅ Reset success/fail message
    document.getElementById("user-input").value = ""; // ✅ Clear input field
    document.getElementById("level-text").textContent = "Level: " + levels[currentLevelIndex];
    currentPassword = generatePassword(levels[currentLevelIndex]);
    document.getElementById("password-display").textContent = currentPassword;

    // Disable input field while the password is visible
    document.getElementById("user-input").disabled = true;

    // Display the password for 5 seconds before hiding it
    setTimeout(() => {
        document.getElementById("password-display").textContent = "******"; // Hide password
        document.getElementById("user-input").disabled = false; // Enable input field
    }, 7000); // Show password for 15 seconds
}

function updateProgress() {
    let progress = (currentLevelIndex / (levels.length - 1)) * 100; // Only full at last level
    if (currentLevelIndex === levels.length) {
        progress = 100; // Ensure full bar only after last level is completed
    }
    document.getElementById("progress-bar").style.width = progress + "%";
}
