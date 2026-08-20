function openExpenseModal() {

    document
        .getElementById("expenseModal")
        .classList.remove("hidden");

}


function closeExpenseModal() {

    document
        .getElementById("expenseModal")
        .classList.add("hidden");

}


function setupExpenses() {

    document
        .getElementById("expenseForm")
        .addEventListener(
            "submit",
            function(event) {

                event.preventDefault();

                const name =
                    document.getElementById(
                        "expenseName"
                    ).value.trim();

                const value =
                    Number(
                        document.getElementById(
                            "expenseValue"
                        ).value
                    );

                const category =
                    document.getElementById(
                        "expenseCategory"
                    ).value;

                const type =
                    document.querySelector(
                        'input[name="expenseType"]:checked'
                    ).value;

                const day =
                    Number(
                        document.getElementById(
                            "expenseDay"
                        ).value
                    );

                if (!name || value <= 0) {

                    alert(
                        "Preencha corretamente os campos."
                    );

                    return;

                }

                const data = getData();

                data.expenses.push({

                    id: Date.now(),

                    name,

                    value,

                    category,

                    type,

                    day,

                    date: new Date().toISOString()

                });

                saveData(data);

                closeExpenseModal();

                document
                    .getElementById("expenseForm")
                    .reset();

                loadPage("expenses");

            }
        );


    document
        .getElementById("closeExpenseModal")
        .addEventListener(
            "click",
            closeExpenseModal
        );


    document
        .getElementById("cancelExpense")
        .addEventListener(
            "click",
            closeExpenseModal
        );

}


function deleteExpense(id) {

    const data = getData();

    data.expenses =
        data.expenses.filter(
            expense => expense.id !== id
        );

    saveData(data);

    loadPage("expenses");

}