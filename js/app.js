document.addEventListener("DOMContentLoaded", function() {

    setupSalary();
    setupExpenses();
    setupGoals();
    setupInvestments();

    initializeApplication();
    setupNavigation();
    setupGlobalButtons();

});

function updateHeaderActions(page) {
    const button = document.getElementById("headerAddExpense");

    if (!button) return;

    if (page === "dashboard") {
        button.style.display = "flex";
    } else {
        button.style.display = "none";
    }
}

function initializeApplication() {

    const data = getData();

    if (!data.salary || data.salary <= 0) {

        document
            .getElementById("setupScreen")
            .classList.remove("hidden");

        document
            .getElementById("app")
            .classList.add("hidden");

        return;

    }

    showApplication();

    loadPage("dashboard");

}


function showApplication() {

    document
        .getElementById("setupScreen")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

}


function setupNavigation() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );


    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                menuItems.forEach(menu => {

                    menu.classList.remove(
                        "active"
                    );

                });

                this.classList.add("active");

                const page =
                    this.dataset.page;

                loadPage(page);

            }
        );

    });

}


function setupGlobalButtons() {

    const button = document.getElementById("headerAddExpense");

    if (!button) return;

    button.addEventListener(
        "click",
        openExpenseModal
    );
}


function loadPage(page) {

    const title = document.getElementById("pageTitle");

    // Controla o botão "Adicionar gasto"
    updateHeaderActions(page);

    switch (page) {

        case "dashboard":
            title.textContent = "Seu financeiro";
            renderDashboard();
            break;

        case "salary":
            title.textContent = "Meu salário";
            renderSalaryPage();
            break;

        case "expenses":
            title.textContent = "Meus gastos";
            renderExpensesPage();
            break;

        case "goals":
            title.textContent = "Minhas metas";
            renderGoals();
            break;

        case "investments":
            title.textContent = "Investimentos";
            renderInvestments();
            break;

        case "settings":
            title.textContent = "Configurações";
            renderSettings();
            break;
    }
}


function renderSalaryPage() {

    const data = getData();

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-card">

            <h2>
                Seu salário mensal
            </h2>

            <p>
                Esse valor é utilizado para calcular
                todo o seu planejamento financeiro.
            </p>

            <div class="big-value">
                ${formatMoney(data.salary)}
            </div>

            <br>

            <button
                class="primary-button"
                onclick="changeSalary()"
            >
                Alterar salário
            </button>

        </div>

    `;

}


function renderExpensesPage() {

    const data = getData();

    const total =
        getTotalExpenses();


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-card">

            <div class="panel-header">

                <div>

                    <h2>
                        Gastos do mês
                    </h2>

                    <p>
                        Total: ${formatMoney(total)}
                    </p>

                </div>

                <div class="panel-header">
                
                <div>
        
                    <h2>
                        Gastos do mês
                   </h2>

                   <p>
                       Total: ${formatMoney(total)}
                   </p>
                </div>
            </div>

            </div>


            ${
                data.expenses.length === 0

                ?

                `<p>
                    Você ainda não cadastrou nenhum gasto.
                </p>`

                :

                `
                <table class="expense-table">

                    <thead>

                        <tr>

                            <th>
                                Nome
                            </th>

                            <th>
                                Categoria
                            </th>

                            <th>
                                Tipo
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Ação
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            data.expenses.map(
                                expense => `

                                <tr>

                                    <td>
                                        ${expense.name}
                                    </td>

                                    <td>
                                        ${expense.category}
                                    </td>

                                    <td>
                                        ${
                                            expense.type === "recurring"
                                                ? "Recorrente"
                                                : "Único"
                                        }
                                    </td>

                                    <td>
                                        ${formatMoney(
                                            expense.value
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            class="delete-button"
                                            onclick="deleteExpense(${expense.id})"
                                        >
                                            Excluir
                                        </button>

                                    </td>

                                </tr>

                            `
                            ).join("")
                        }

                    </tbody>

                </table>
                `

            }

        </div>

    `;

}


function renderSettings() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-card">

            <h2>
                Configurações
            </h2>

            <p>
                Gerencie os dados do seu MeuSalario.
            </p>

            <button
                class="delete-button"
                onclick="resetApplication()"
            >
                Apagar todos os dados
            </button>

        </div>

    `;

}


function resetApplication() {

    const confirmation =
        confirm(
            "Tem certeza? Todos os seus dados serão apagados."
        );


    if (!confirmation) {

        return;

    }


    clearData();

    location.reload();

}