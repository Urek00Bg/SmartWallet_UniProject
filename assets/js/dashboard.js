document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from localStorage
    let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
    let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

    // Selectors
    const budgetInput = document.getElementById('budget-amount');
    const updateBudgetBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(1)');
    const immediateExpInput = document.getElementById('immediate-expense');
    const logImmediateBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(2)');
    const addMoneyInput = document.getElementById('add-more-money');
    const addMoneyBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(3)');
    const resetBtn = document.getElementById('reset-btn');
    const bufferRange = document.getElementById('buffer-range');
    const bufferPctDisplay = document.getElementById('buffer-pct');
    const savingsRange = document.getElementById('savings-range');
    const savingsPctDisplay = document.getElementById('savings-pct');
    const reservedDisplay = document.getElementById('reserved-sum');
    const savingsDisplay = document.getElementById('savings-sum');
    const availableDisplay = document.getElementById('available-sum');
    const expNameInput = document.getElementById('expense-name');
    const expAmountInput = document.getElementById('expense-amount');
    const logExpBtn = document.querySelector('.inputs_log-expense button');

    // Load saved slider positions
    bufferRange.value = localStorage.getItem('bufferPct') || 10;
    savingsRange.value = localStorage.getItem('savingsPct') || 5;

    function lockBudgetInput() {
        if (totalIncome > 0) {
            budgetInput.disabled = true;
            updateBudgetBtn.disabled = true;
            updateBudgetBtn.style.cursor = 'not-allowed';
            updateBudgetBtn.style.opacity = '0.6';
            updateBudgetBtn.textContent = 'Budget Set';
            budgetInput.value = totalIncome.toFixed(2);
            budgetInput.style.color = '#6b7280';
        }
    }

    function unlockBudgetInput() {
        budgetInput.disabled = false;
        updateBudgetBtn.disabled = false;
        updateBudgetBtn.style.cursor = 'pointer';
        updateBudgetBtn.style.opacity = '1';
        updateBudgetBtn.textContent = 'Update Budget';
        budgetInput.value = '';
        budgetInput.style.color = ''; // Resets to default CSS
    }

    function saveData() {
        localStorage.setItem('totalIncome', totalIncome);
        localStorage.setItem('totalExpenses', totalExpenses);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
        localStorage.setItem('bufferPct', bufferRange.value);
        localStorage.setItem('savingsPct', savingsRange.value);
    }

    function updateUI() {
        const bPct = parseFloat(bufferRange.value) || 0;
        const sPct = parseFloat(savingsRange.value) || 0;
        bufferPctDisplay.textContent = bPct;
        savingsPctDisplay.textContent = sPct;

        const reservedBuffer = totalIncome * (bPct / 100);
        const reservedSavings = totalIncome * (sPct / 100);
        const available = (totalIncome - reservedBuffer - reservedSavings) - totalExpenses;

        reservedDisplay.textContent = `$${reservedBuffer.toFixed(2)}`;
        savingsDisplay.textContent = `$${reservedSavings.toFixed(2)}`;
        availableDisplay.textContent = `$${available.toFixed(2)}`;
        availableDisplay.style.color = available < 0 ? "#e74c3c" : "#2ecc71";
        
        saveData();
        renderHistory();
    }

    function addTransaction(type, name, amount) {
        const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        transactionHistory.unshift({ type, name, amount, date });
        updateUI();
    }

    function deleteTransaction(index) {
        const item = transactionHistory[index];
        if (item.type === 'income') {
            totalIncome -= item.amount;
            // If deleting the last income/initial budget, unlock the input
            if (totalIncome <= 0) unlockBudgetInput();
        } else {
            totalExpenses -= item.amount;
        }
        transactionHistory.splice(index, 1);
        updateUI();
    }

    function renderHistory() {
        const list = document.getElementById('transaction-list');
        list.innerHTML = ''; 
        transactionHistory.forEach((item, index) => {
            const row = document.createElement('div');
            row.classList.add('history-row', item.type); 
            const prefix = item.type === 'income' ? '+' : '-';
            
            row.innerHTML = `
                <div>${index + 1}</div>
                <div>${item.date}</div>
                <div>${item.name}</div>
                <div class="${item.type}-color">${prefix}$${Math.abs(item.amount).toFixed(2)}</div>
                <div><button class="delete-btn" data-index="${index}">Delete</button></div>
            `;
            list.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteTransaction(index);
            });
        });
    }

    // --- Event Listeners ---

    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data?')) {
            totalIncome = 0;
            totalExpenses = 0;
            transactionHistory = [];
            unlockBudgetInput(); // Unlock UI
            updateUI();
        }
    });

    updateBudgetBtn.addEventListener('click', () => {
        const val = parseFloat(budgetInput.value) || 0;
        if (val > 0) {
            totalIncome = val; // Set base income
            addTransaction('income', 'Initial Budget', val);
            lockBudgetInput(); // Lock UI immediately
            updateUI();
        }
    });

    addMoneyBtn.addEventListener('click', () => {
        const val = parseFloat(addMoneyInput.value) || 0;
        if (val > 0) {
            totalIncome += val;
            addTransaction('income', 'Extra Income', val);
            // Ensure UI stays locked if income exists
            lockBudgetInput(); 
            updateUI();
        }
    });

    logImmediateBtn.addEventListener('click', () => {
        const val = parseFloat(immediateExpInput.value) || 0;
        if (val > 0) {
            totalExpenses += val;
            addTransaction('expense', 'Fixed Expense', val);
            immediateExpInput.value = '';
        }
    });

    logExpBtn.addEventListener('click', () => {
        const name = expNameInput.value || 'General Expense';
        const val = parseFloat(expAmountInput.value) || 0;
        if (val > 0) {
            totalExpenses += val;
            addTransaction('expense', name, val);
            expNameInput.value = '';
            expAmountInput.value = '';
        }
    });

    bufferRange.addEventListener('input', updateUI);
    savingsRange.addEventListener('input', updateUI);

    // Initial Load Logic
    updateUI();
    lockBudgetInput(); // Check on load if we need to lock the input
});