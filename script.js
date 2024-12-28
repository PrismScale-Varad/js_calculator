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
        let rawResult = eval(expr); // Evaluate the expression

        if (rawResult.toString().length > 10) {
            // If the result exceeds 10 digits, use scientific notation
            currentResult = rawResult.toExponential(5); // Use 5 digits for precision in scientific notation
        } else {
            // Limit to 10 digits for standard display
            currentResult = parseFloat(rawResult.toPrecision(10)).toString();
        }
    } catch (error) {
        currentResult = 'Error'; // Handle any evaluation errors
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
    

document.getElementById('toggleHistory').addEventListener('click', () => {
    const history = document.getElementById('history');
    if (history.classList.contains('hidden')) {
        history.classList.remove('hidden');
        history.classList.add('flex');
    } else {
        history.classList.add('hidden');
    }
});

// Call displayHistory() on page load to populate history
window.onload = displayHistory;
