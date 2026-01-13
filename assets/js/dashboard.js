document.addEventListener('DOMContentLoaded', () => {
    // STATE MANAGEMENT
    let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
    let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

    //  SELECTORS
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
    const useSafetyCheckbox = document.getElementById('expense-type-income');

    // INITIAL LOAD
    bufferRange.value = localStorage.getItem('bufferPct') || 10;
    savingsRange.value = localStorage.getItem('savingsPct') || 5;

    function lockBudgetUI() {
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

    function unlockBudgetUI() {
        budgetInput.disabled = false;
        updateBudgetBtn.disabled = false;
        updateBudgetBtn.style.cursor = 'pointer';
        updateBudgetBtn.style.opacity = '1';
        updateBudgetBtn.textContent = 'Update Budget';
        budgetInput.value = '';
        budgetInput.style.color = '';
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
        
        // Final math: Available = Total Income - Reserved Sums - Logged Expenses
        const available = (totalIncome - reservedBuffer - reservedSavings) - totalExpenses;

        reservedDisplay.textContent = `$${reservedBuffer.toFixed(2)}`;
        savingsDisplay.textContent = `$${reservedSavings.toFixed(2)}`;
        availableDisplay.textContent = `$${available.toFixed(2)}`;
        availableDisplay.style.color = available < 0 ? "#e74c3c" : "#2ecc71";
        
        saveData();
        renderHistory();
        colorSlider(bufferRange);
        colorSlider(savingsRange);
    }

    function colorSlider(slider) {
        const val = slider.value;
        const percentage = (val - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #ff4d4d ${percentage}%, #334155 ${percentage}%)`;
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
            if (totalIncome <= 0) {
                totalIncome = 0;
                unlockBudgetUI();
            }
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
            btn.onclick = (e) => {
                const idx = e.target.getAttribute('data-index');
                deleteTransaction(idx);
            };
        });
    }

    // --- LISTENERS ---

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset everything?')) {
            localStorage.clear();
            totalIncome = 0;
            totalExpenses = 0;
            transactionHistory = [];
            unlockBudgetUI();
            updateUI();
        }
    });

    updateBudgetBtn.addEventListener('click', () => {
        const val = parseFloat(budgetInput.value) || 0;
        if (val > 0) {
            totalIncome = val;
            addTransaction('income', 'Initial Budget', val);
            lockBudgetUI();
            updateUI();
        }
    });

    addMoneyBtn.addEventListener('click', () => {
        const val = parseFloat(addMoneyInput.value) || 0;
        if (val > 0) {
            totalIncome += val;
            addTransaction('income', 'Extra Income', val);
            lockBudgetUI(); 
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
        const useSafety = useSafetyCheckbox.checked;

        if (val > 0) {
            if (useSafety) {
                const bPct = parseFloat(bufferRange.value) || 0;
                const sPct = parseFloat(savingsRange.value) || 0;
                
                let currentBufferVal = totalIncome * (bPct / 100);
                let currentSavingsVal = totalIncome * (sPct / 100);
                let remainingToCover = val;

                // Drain Buffer
                if (currentBufferVal >= remainingToCover) {
                    currentBufferVal -= remainingToCover;
                    remainingToCover = 0;
                } else {
                    remainingToCover -= currentBufferVal;
                    currentBufferVal = 0;
                }

                //  Drain Savings
                if (remainingToCover > 0) {
                    if (currentSavingsVal >= remainingToCover) {
                        currentSavingsVal -= remainingToCover;
                        remainingToCover = 0;
                    } else {
                        remainingToCover -= currentSavingsVal;
                        currentSavingsVal = 0;
                    }
                }

                if (remainingToCover > 0) {
                    totalExpenses += remainingToCover;
                }

                const totalTakenFromPools = val - remainingToCover;
                totalIncome -= totalTakenFromPools;
                
                if (totalIncome > 0) {
                    bufferRange.value = (currentBufferVal / totalIncome) * 100;
                    savingsRange.value = (currentSavingsVal / totalIncome) * 100;
                } else {
                    totalIncome = 0;
                    bufferRange.value = 0;
                    savingsRange.value = 0;
                    unlockBudgetUI();
                }

                addTransaction('expense', `${name} (Safety Fund)`, val);
            } else {
                totalExpenses += val;
                addTransaction('expense', name, val);
            }

            expNameInput.value = '';
            expAmountInput.value = '';
            useSafetyCheckbox.checked = false;
            updateUI();
        }
    });

    bufferRange.addEventListener('input', updateUI);
    savingsRange.addEventListener('input', updateUI);

    updateUI();
    lockBudgetUI();
});