function filterExpensesByYear(year) {
    // Show the month dropdown and hide the year dropdown
    document.getElementById('month-dropdown').style.display = 'block';
    document.getElementById('dropdownMenuButton').innerText = `Year: ${year}`;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchExpenses(); // Fetch expenses when the page is loaded
});

function fetchExpenses() {
    fetch('/allexpense')
        .then(response => response.json())
        .then(data => {
            const expenseList = document.getElementById('expense_list');
            expenseList.innerHTML = ''; 

            // Loop through the fetched data and create rows
            data.forEach((expense, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${expense.expense_name}</td>
                    <td>${expense.expense_amount}</td>
                    <td>${expense.date}</td>
                `;
                expenseList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching expenses:', error));
}

function filterExpensesByMonth(month) {
    const year = document.querySelector("#dropdownMenuButton").innerText.split(": ")[1]; // Get selected year from the dropdown
    fetch(`/expensefilter/${year}/${month}`)
        .then(response => response.json())
        .then(data => {
            const expenseList = document.getElementById('expense_list');
            expenseList.innerHTML = ''; // Clear previous expenses
            if (data.length > 0) {
                data.forEach((expense, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${expense.expense_name}</td>
                        <td>${expense.expense_amount}</td>
                        <td>${expense.date}</td>
                    `;
                    expenseList.appendChild(row);
                });
            } else {
                // If no expenses found, show a message
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4" class="text-center">No expenses found for ${month} ${year}</td>
                `;
                expenseList.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching expenses:', error));
}

document.getElementById('addExpenseButton').addEventListener('click',function (){
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseDate = document.getElementById('expenseDate').value;
    const expenseMonth = document.getElementById('expenseMonth').value;
    const expenseYear = document.getElementById('expenseYear').value;


    const expenseData = {
        expense_name: expenseName,
        expense_amount: parseFloat(expenseAmount),
        expense_date: expenseDate,
        expense_month: parseInt(expenseMonth),
        expense_year: parseInt(expenseYear)
    };

    fetch('/addexpense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Expense added successfully!');
            document.getElementById('expenseForm').reset(); // Clear the form
        } else {
            alert('Failed to add expense: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error adding expense:', error);
        alert('An error occurred. Please try again.');
    });
});
