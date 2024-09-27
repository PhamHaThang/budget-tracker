const formAdd = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function updateStatistics() {
  const updateIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);
  const updateExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  let updateBalance = updateIncome - updateExpense;
  balance.textContent = updateBalance;
  income.textContent = updateIncome;
  expense.textContent = updateExpense;
}

function getItemHTML(id, source, amount, time) {
  return `<li data-id="${id}">
            <p>
                <span>${source}</span>
                <span id="time">${time}</span>
            </p>
            <span>${amount}</span>đ
            <i class="bi bi-trash delete"></i>
        </li>`;
}
function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    // add income
    incomeList.innerHTML += getItemHTML(id, source, amount, time);
  } else {
    // add expense
    expenseList.innerHTML += getItemHTML(id, source, amount, time);
  }
}
function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`,
  };
  transactions.push(transaction);

  addTransactionDOM(transaction.id, source, amount, transaction.time);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
formAdd.addEventListener("submit", (e) => {
  e.preventDefault();
  if (formAdd.source.value.trim() === "" || formAdd.amount.value === "") {
    return alert("Please add proper value!");
  }
  addTransaction(formAdd.source.value.trim(), Number(formAdd.amount.value));
  updateStatistics();
  formAdd.reset();
});
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
incomeList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTransaction(Number(e.target.parentElement.dataset.id));
    updateStatistics();
  }
});
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    deleteTransaction(Number(e.target.parentElement.dataset.id));
    updateStatistics();
  }
});

function getTransactionLocalStorage() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += getItemHTML(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += getItemHTML(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}
function init() {
  getTransactionLocalStorage();
  updateStatistics();
}
init();
