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
                    <td>
                        <button class ='btn btn-danger btn-sm' onclick='deleteExpense(${expense.id})'>Delete</button>
                    </td>
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
                        <td>
                        <button class ='btn btn-danger btn-sm' onclick='deleteExpense(${expense.id})'>Delete</button>
                        </td>
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

function deleteExpense(expense_id){
    if(confirm('Are you sure you want to delete this')){
        fetch(`/delete_expense/${expense_id}`,{
            method:'DELETE',
        })
        .then(response=>response.json())
        .then(data=>{
            if (data.success){
                alert('Expense deleted successfully');
                fetchExpenses();
            } else {
                alert('Failed to delete expense: '+ data.message);


            }
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
            alert('An error occurred. Please try again.');
        });
    }
}

document.getElementById('totalButton').addEventListener('click', function() {
    const selectedYear = document.getElementById('yearDropdown').value;
    const selectedMonth = document.getElementById('monthDropdown').value;
    fetchTotalExpense(selectedYear, selectedMonth); // Pass selected year and month
});

function fetchTotalExpense(year, month) {
    fetch(`/totalexpense/${year}/${month}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display the total amount returned by Flask
                document.getElementById('totalAmountValue').textContent = data.total.toFixed(2);
            } else {
                alert('Failed to calculate total: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching total expense:', error);
            alert('An error occurred. Please try again.');
        });
}