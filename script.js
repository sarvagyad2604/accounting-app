let balance = 0;
let weeklyTransactions = [];

// Load transactions from local storage
if (localStorage.getItem('transactions')) {
  weeklyTransactions = JSON.parse(localStorage.getItem('transactions'));
  updateWeeklyTransactionsTable();
}

function addGivenDebt() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (description.trim() === '' || isNaN(amount)) {
    alert('Please enter valid description and amount.');
    return;
  }

  const transaction = {
    description: `Given Debt: ${description}`, // Prefix the description with "Given Debt: "
    amount: -Math.abs(amount) // Given debts are negative
  };

  weeklyTransactions.push(transaction);
  updateLocalStorage();
  updateWeeklyTransactionsTable();

  balance -= Math.abs(amount);
  document.getElementById('balance').textContent = `Balance: ₹${balance.toFixed(2)}`;

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function addSpend() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (description.trim() === '' || isNaN(amount)) {
    alert('Please enter valid description and amount.');
    return;
  }

  const transaction = {
    description: description,
    amount: -Math.abs(amount) // Spending is negative
  };

  weeklyTransactions.push(transaction);
  updateLocalStorage();
  updateWeeklyTransactionsTable();

  balance -= Math.abs(amount);
  document.getElementById('balance').textContent = `Balance: ₹${balance.toFixed(2)}`;

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function addReceived() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (description.trim() === '' || isNaN(amount)) {
    alert('Please enter valid description and amount.');
    return;
  }

  const transaction = {
    description: description,
    amount: Math.abs(amount) // Received amounts are positive
  };

  weeklyTransactions.push(transaction);
  updateLocalStorage();
  updateWeeklyTransactionsTable();

  balance += Math.abs(amount);
  document.getElementById('balance').textContent = `Balance: ₹${balance.toFixed(2)}`;

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function showHistory() {
  const receivedTransactions = weeklyTransactions.filter(transaction => transaction.amount > 0);
  const spentTransactions = weeklyTransactions.filter(transaction => transaction.amount < 0);
  const givenDebts = weeklyTransactions.filter(transaction => transaction.amount < 0 && transaction.description.startsWith("Given Debt:"));
  const expenses = weeklyTransactions.filter(transaction => transaction.amount < 0 && !transaction.description.startsWith("Given Debt:"));

  let historyMessage = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Transaction History</title><style>body {background-color: #f4f4f4;padding: 20px;} .container {max-width: 600px;margin: 0 auto;;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);padding: 20px;margin-bottom: 20px;} h1 {color: #333;text-align: center;} table {border-collapse: collapse;width: 100%;margin-bottom: 20px;} th, td {padding: 8px;text-align: left;border-bottom: 1px solid #ddd;} th {background-color: #f2f2f2;} .total {font-weight: bold;}</style></head><body><div class="container"><h1>Transaction History</h1>';

  // Received Transactions Table
  historyMessage += '<div class="container"><h2>Received <span class="total" style="color:green;">Total: ₹' + calculateTotal(receivedTransactions) + '</span></h2><table><thead><tr><th>Description</th><th>Amount (₹)</th></tr></thead><tbody>';
  receivedTransactions.forEach(transaction => {
    historyMessage += `<tr><td>${transaction.description}</td><td>${transaction.amount}</td></tr>`;
  });
  historyMessage += '</tbody></table></div>';

  // Spent Transactions Table
  historyMessage += '<div class="container"><h2>Spent <span class="total" style="color:red;">Total: ₹' + calculateTotal(expenses) + '</span></h2><table><thead><tr><th>Description</th><th>Amount (₹)</th></tr></thead><tbody>';
  expenses.forEach(transaction => {
    historyMessage += `<tr><td>${transaction.description}</td><td>${Math.abs(transaction.amount)}</td></tr>`;
  });
  historyMessage += '</tbody></table></div>';

  // Given Debt Transactions Table
  historyMessage += '<div class="container"><h2>Given Debt <span class="total" style="color:red;">Total: ₹' + calculateTotal(givenDebts) + '</span></h2><table><thead><tr><th>Description</th><th>Amount (₹)</th></tr></thead><tbody>';
  givenDebts.forEach(transaction => {
    historyMessage += `<tr><td>${transaction.description}</td><td>${Math.abs(transaction.amount)}</td></tr>`;
  });
  historyMessage += '</tbody></table></div>';

  historyMessage += '</div></body></html>';

  const newWindow = window.open();
  newWindow.document.write(historyMessage);
}

function calculateTotal(transactions) {
  let total = 0;
  transactions.forEach(transaction => {
    total += transaction.amount;
  });
  return total.toFixed(2);
}

function clearTransactions() {
  if (confirm('Are you sure you want to clear all transactions?')) {
    weeklyTransactions = [];
    updateLocalStorage();
    updateWeeklyTransactionsTable();
    balance = 0;
    document.getElementById('balance').textContent = `Balance: ₹${balance.toFixed(2)}`;
  }
}

function updateWeeklyTransactionsTable() {
  const tableBody = document.querySelector('#weeklyTransactions tbody');
  tableBody.innerHTML = '';

  weeklyTransactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.description}</td>
      <td>${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(weeklyTransactions));
}
