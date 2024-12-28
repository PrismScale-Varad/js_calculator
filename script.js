let currentExpression = '';
let currentResult = '0';

function updateExpression(value) {
    currentExpression = value;
    calculateResult();
}

function appendValue(value) {
    currentExpression += value;
    updateDisplay();
    calculateResult();
}

function clearDisplay() {
    currentExpression = '';
    currentResult = '0';
    updateDisplay();
    document.getElementById('expression').value = '';
}

function calculateResult() {
    try {
        let expr = currentExpression.replace(/%/g, '*0.01*');
        currentResult = eval(expr).toString();
    } catch (error) {
        currentResult = 'Error';
    }
    updateDisplay();
}

function saveResult() {
    const entry = `${currentExpression} = ${currentResult}`;
    addHistory(entry);
}

function updateDisplay() {
    document.getElementById('result').textContent = currentResult;
    document.getElementById('expression').value = currentExpression;
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
    calculateResult();
}

// Add calculation result to history
function addHistory(entry) {
    // Retrieve existing history from localStorage, or initialize it as an empty array
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Add the new entry to the history array
    history.unshift(entry);  // Add to the start (newest entries first)

    // Save the updated history back to localStorage
    localStorage.setItem('history', JSON.stringify(history));

    // Update the history UI
    displayHistory()
}
            
function displayHistory() {
        const historyContainer = document.getElementById('history');
        historyContainer.innerHTML = ''; // Clear current history display
    
        // Retrieve history from localStorage
        let history = JSON.parse(localStorage.getItem('history')) || [];
    
        // Loop through the history array and create buttons
        history.forEach(entry => {
            const historyButton = document.createElement('button');
            historyButton.classList.add('text-right', 'w-full', 'text-xl', 'bg-gray-800', 'p-2', 'rounded-md');
            historyButton.textContent = entry;
            historyButton.onclick = function() {
                currentExpression = entry.split(' = ')[0];
                currentResult = entry.split(' = ')[1];
                updateDisplay();
            };
            historyContainer.appendChild(historyButton); // Add to the bottom of the history
        });
}
    
    // Call displayHistory() on page load to populate history
window.onload = displayHistory;
