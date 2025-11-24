// Global Game State
let secretNumber;
let playerName = '';
let attempts = 0;

// DOM Element References
// Note: These must be retrieved only after the DOM is fully loaded.
let dynamicContentEl;
let messageBoxEl;
let newGameBtn;

/**
 * Initializes DOM element references and starts the game flow.
 */
function initializeDom() {
    dynamicContentEl = document.getElementById('dynamic-content');
    messageBoxEl = document.getElementById('message-box');
    newGameBtn = document.getElementById('new-game-btn');
    showNameInput();
}

// Utility Functions

/**
 * Updates the message box with dynamic content and applies the fade-in animation.
 * @param {string} message - The message to display.
 * @param {string} classes - Optional Tailwind classes for styling (e.g., 'text-red-500').
 */
function displayMessage(message, classes = 'text-white') {
    // Re-trigger the fade animation by removing and re-adding the class
    messageBoxEl.classList.remove('message-fade');
    void messageBoxEl.offsetWidth; // Force reflow
    messageBoxEl.classList.add('message-fade');
    
    // Reset existing text color classes and base styles
    messageBoxEl.className = 'min-h-[6rem] bg-gray-700 p-4 rounded-xl text-center text-lg font-semibold border border-gray-600 flex items-center justify-center message-fade';
    
    // Apply new message and custom classes
    messageBoxEl.innerHTML = message;
    messageBoxEl.classList.add(...classes.split(' '));
}

// Game Flow Functions

/**
 * Clears the dynamic content and displays the name input form.
 */
function showNameInput() {
    newGameBtn.classList.add('hidden');
    dynamicContentEl.innerHTML = `
        <div class="space-y-6 p-4">
            <h2 class="text-2xl font-bold text-gray-200">Player's Name</h2>
            <input type="text" id="name-input" placeholder="Your name (e.g., Minato)"
                   class="w-full p-3 rounded-xl bg-gray-700 text-purple-300 border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                   maxlength="29" onkeyup="if(event.key === 'Enter') handleNameSubmit()">
            <button id="name-submit-btn" onclick="handleNameSubmit()"
                    class="button-pulse w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition duration-150 shadow-md shadow-green-900/50">
                Start Game
            </button>
            
    document.getElementById('name-input').focus();
}

/**
 * Handles the submission of the player's name and starts the game.
 */
function handleNameSubmit() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput ? nameInput.value.trim() : '';

    if (name) {
        playerName = name.substring(0, 29); // Limit name length
        initGame();
    } else {
        displayMessage('Please enter a valid name to proceed.', 'text-red-400');
    }
}

/**
 * Initializes or resets the game state.
 * @param {boolean} isReset - If true, resets the attempts and generates a new number.
 */
function initGame(isReset = false) {
    // Generate a random number between 1 and 100
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    displayGameInterface();

    if (isReset) {
        displayMessage(`A new secret number is set! HEY ${playerName.toUpperCase()}! Enter your first guess.`);
    } else {
        displayMessage(`HEY ${playerName.toUpperCase()}! welcome TO ~> GUESS THE SECRET NUMBER. Enter a number from 1-100.`);
    }

    newGameBtn.classList.add('hidden');
}

/**
 * Displays the main game interface with the guess input field.
 */
function displayGameInterface() {
    dynamicContentEl.innerHTML = `
        <div class="space-y-6 p-4">
            <h2 class="text-2xl font-bold text-gray-200">Current Guess (Attempt: <span id="attempt-count">${attempts}</span>)</h2>
            <input type="number" id="guess-input" placeholder="Enter a number ~>"
                   class="w-full p-3 rounded-xl bg-gray-700 text-purple-300 border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                   min="1" max="100" onkeyup="if(event.key === 'Enter') handleGuess()">
            <button onclick="handleGuess()"
                    class="button-pulse w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-150 shadow-md shadow-purple-900/50">
                Submit Guess
            </button>
        </div>
    `;
    document.getElementById('guess-input').focus();
}

/**
 * Handles the player's number guess, providing feedback.
 */
function handleGuess() {
    const guessInput = document.getElementById('guess-input');
    
    // Check if input element exists (game interface is active)
    if (!guessInput) {
        console.error("Guess input element not found.");
        return;
    }

    const guess = parseInt(guessInput.value.trim());

    // Increment attempt count only if input is valid
    attempts++;
    const attemptCountEl = document.getElementById('attempt-count');
    if (attemptCountEl) attemptCountEl.textContent = attempts;
    
    // 1. Validate if input is a number
    if (isNaN(guess)) {
        displayMessage("INVALID INPUT! Please enter a number.", 'text-yellow-400');
        guessInput.value = '';
        attempts--; // Revert attempt count for invalid input
        if (attemptCountEl) attemptCountEl.textContent = attempts;
        return;
    }

    // 2. Check range (1-100)
    if (guess < 1 || guess > 100) {
        displayMessage("Enter a number from the range (1-100).", 'text-yellow-400');
    } 
    // 3. Check if guess is too low
    else if (guess < secretNumber) {
        displayMessage("Too low! Aim higher.", 'text-blue-400');
    } 
    // 4. Check if guess is too high
    else if (guess > secretNumber) {
        displayMessage("Too high! Ground yourself.", 'text-red-400');
    } 
    // 5. Win condition
    else {
        displayMessage(`⭐ YOU GOT IT RIGHT, ${playerName.toUpperCase()}! ⭐ The secret number was ${secretNumber}. You found it in ${attempts} attempt(s)! Catch you later!`, 'text-green-400 font-extrabold text-xl');
        
        // Disable input and show new game button
        guessInput.disabled = true;
        guessInput.placeholder = 'Game Over';
        newGameBtn.classList.remove('hidden');
    }

    // Clear input field for next guess unless they won
    if (guess !== secretNumber) {
        guessInput.value = '';
        guessInput.focus();
    }
}

// --- Start Application on Window Load ---
window.onload = initializeDom;


