function formatMoney(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function getTotalExpenses() {

    const data = getData();

    return data.expenses.reduce(
        (total, expense) =>
            total + expense.value,
        0
    );

}


function renderDashboard() {

    const data = getData();

    const salary = data.salary;

    const expenses = getTotalExpenses();

    const balance =
        salary - expenses;

    const percentage =
        salary > 0
            ? ((expenses / salary) * 100)
            : 0;


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <section class="summary">

            <div class="card">

                <div class="card-top">

                    <span>Salário</span>

                    <div class="card-icon">
                        R$
                    </div>

                </div>

                <h2>
                    ${formatMoney(salary)}
                </h2>

                <p>
                    Salário mensal
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>Gastos</span>

                    <div class="card-icon">
                        ↓
                    </div>

                </div>

                <h2>
                    ${formatMoney(expenses)}
                </h2>

                <p>
                    ${percentage.toFixed(1)}% do salário
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>Disponível</span>

                    <div class="card-icon">
                        ✓
                    </div>

                </div>

                <h2>
                    ${formatMoney(balance)}
                </h2>

                <p class="positive">
                    ${Math.max(0, 100 - percentage).toFixed(1)}% disponível
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>Economia</span>

                    <div class="card-icon">
                        %
                    </div>

                </div>

                <h2>
                    ${Math.max(0, 100 - percentage).toFixed(1)}%
                </h2>

                <p>
                    do salário restante
                </p>

            </div>

        </section>


        <section class="dashboard-grid">

            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h3>
                            Distribuição dos gastos
                        </h3>

                        <p>
                            Onde seu dinheiro está sendo utilizado
                        </p>

                    </div>

                </div>

                <div class="chart-container">

                    <canvas id="expenseChart"></canvas>

                </div>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h3>
                            Últimos gastos
                        </h3>

                        <p>
                            Despesas recentes
                        </p>

                    </div>

                </div>

                <div class="expenses-list">

                    ${
                        data.expenses.length === 0

                        ?

                        `<p style="color:#999;font-size:11px;">
                            Nenhum gasto cadastrado.
                        </p>`

                        :

                        data.expenses
                            .slice(-5)
                            .reverse()
                            .map(expense => `

                                <div class="expense-row">

                                    <div class="expense-info">

                                        <div class="expense-icon">
                                            $
                                        </div>

                                        <div>

                                            <div class="expense-name">
                                                ${expense.name}
                                            </div>

                                            <div class="expense-category">
                                                ${expense.category}
                                            </div>

                                        </div>

                                    </div>

                                    <div class="expense-value">
                                        ${formatMoney(expense.value)}
                                    </div>

                                </div>

                            `)
                            .join("")

                    }

                </div>

            </div>

        </section>

    `;


    createExpenseChart();

}