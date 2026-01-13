document.addEventListener('DOMContentLoaded', () => {
    // Държавни променливи
    let currentBudget = 0;

    // Елементи от DOM
    const budgetInput = document.getElementById('budget-amount');
    const updateBudgetBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(1)');
    const immediateExpInput = document.getElementById('immediate-expense');
    const logImmediateBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(2)');
    const addMoneyInput = document.getElementById('add-more-money');
    const addMoneyBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(3)');

    const bufferRange = document.getElementById('buffer-range');
    const bufferPctDisplay = document.getElementById('buffer-pct');
    const reservedDisplay = document.getElementById('reserved-sum');
    const availableDisplay = document.getElementById('available-sum');

    const expNameInput = document.getElementById('expense-name');
    const expAmountInput = document.getElementById('expense-amount');
    const logExpBtn = document.querySelector('.inputs_log-expense button');

    // Функция за преизчисляване на буферите
    function updateUI() {
        const pct = bufferRange.value;
        bufferPctDisplay.textContent = pct;

        const reserved = currentBudget * (pct / 100);
        const available = currentBudget - reserved;

        reservedDisplay.textContent = `$${reserved.toFixed(2)}`;
        availableDisplay.textContent = `$${available.toFixed(2)}`;
    }

    // 1. Задаване на основен бюджет
    updateBudgetBtn.addEventListener('click', () => {
        const val = parseFloat(budgetInput.value) || 0;
        currentBudget = val;
        addTransactionToHistory('income', 'Initial Budget Set', val);
        updateUI();
        budgetInput.value = '';
    });

    // 2. Логване на спешен разход (Наем/Сметки)
    logImmediateBtn.addEventListener('click', () => {
        const val = parseFloat(immediateExpInput.value) || 0;
        if (val > 0) {
            currentBudget -= val;
            addTransactionToHistory('expense', 'Fixed Expense', val);
            updateUI();
            immediateExpInput.value = '';
        }
    });

    // 3. Добавяне на допълнителни пари
    addMoneyBtn.addEventListener('click', () => {
        const val = parseFloat(addMoneyInput.value) || 0;
        if (val > 0) {
            currentBudget += val;
            addTransactionToHistory('income', 'Extra Income', val);
            updateUI();
            addMoneyInput.value = '';
        }
    });

    // 4. Логване на ежедневен разход (от третата кутия)
    logExpBtn.addEventListener('click', () => {
        const name = expNameInput.value || 'General Expense';
        const val = parseFloat(expAmountInput.value) || 0;
        if (val > 0) {
            currentBudget -= val;
            addTransactionToHistory('expense', name, val);
            updateUI();
            expNameInput.value = '';
            expAmountInput.value = '';
        }
    });

    // 5. Слайдър за буфер
    bufferRange.addEventListener('input', updateUI);
});

// Твоята функция (запазена и леко коригирана за визуални цели)
function addTransactionToHistory(type, name, amount) {
    const list = document.getElementById('transaction-list');
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    
    const row = document.createElement('div');
    row.classList.add('history-row', type); 

    const prefix = type === 'income' ? '+' : '-';
    
    row.innerHTML = `
        <div>${date}</div>
        <div>${name}</div>
        <div class="${type}-color">${prefix}$${Math.abs(amount).toFixed(2)}</div>
    `;

    list.insertBefore(row, list.firstChild);
}