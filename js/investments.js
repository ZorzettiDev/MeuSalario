let investmentChart = null;


/* =========================================
   MODAL
========================================= */

function setupInvestments() {

    const form =
        document.getElementById(
            "investmentForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const data = getData();


            if (!data.investments) {
                data.investments = [];
            }


            data.investments.push({

                id: Date.now(),

                name:
                    document.getElementById(
                        "investmentName"
                    ).value.trim(),

                type:
                    document.getElementById(
                        "investmentType"
                    ).value,

                value:
                    Number(
                        document.getElementById(
                            "investmentValue"
                        ).value
                    ),

                rate:
                    Number(
                        document.getElementById(
                            "investmentRate"
                        ).value
                    ),

                date:
                    document.getElementById(
                        "investmentDate"
                    ).value

            });


            saveData(data);


            closeInvestmentModal();


            renderInvestments();

        }
    );

}


function openInvestmentModal() {

    document.getElementById(
        "investmentModal"
    )?.classList.remove(
        "hidden"
    );

}


function closeInvestmentModal() {

    document.getElementById(
        "investmentModal"
    )?.classList.add(
        "hidden"
    );

}


/* =========================================
   CÁLCULOS
========================================= */

function investmentMonthlyReturn(
    value,
    rate
) {

    return value *
        (rate / 100);

}


function investmentFutureValue(
    value,
    months,
    rate
) {

    return value *
        Math.pow(
            1 + rate / 100,
            months
        );

}


/* =========================================
   EXCLUIR
========================================= */

function deleteInvestment(id) {

    if (
        !confirm(
            "Deseja excluir este investimento?"
        )
    ) return;


    const data = getData();


    data.investments =
        data.investments.filter(
            investment =>
                investment.id !== id
        );


    saveData(data);


    renderInvestments();

}


/* =========================================
   SIMULADOR
========================================= */

function calculateInvestmentSimulation() {

    const value =
        Number(
            document.getElementById(
                "simulatorValue"
            )?.value
        ) || 0;


    const months =
        Number(
            document.getElementById(
                "simulatorMonths"
            )?.value
        ) || 0;


    const rate =
        Number(
            document.getElementById(
                "simulatorRate"
            )?.value
        ) || 0;


    const finalValue =
        investmentFutureValue(
            value,
            months,
            rate
        );


    const gain =
        finalValue - value;


    document.getElementById(
        "simulationInitial"
    ).textContent =
        formatMoney(value);


    document.getElementById(
        "simulationGain"
    ).textContent =
        formatMoney(gain);


    document.getElementById(
        "simulationFinal"
    ).textContent =
        formatMoney(finalValue);

}


/* =========================================
   RENDER
========================================= */

function renderInvestments() {

    const data = getData();


    if (!data.investments) {

        data.investments = [];

        saveData(data);

    }


    const investments =
        data.investments;


    const total =
        investments.reduce(
            (sum, investment) =>
                sum + investment.value,
            0
        );


    const monthly =
        investments.reduce(
            (sum, investment) =>
                sum +
                investmentMonthlyReturn(
                    investment.value,
                    investment.rate
                ),
            0
        );


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <section class="summary">

            <div class="card">

                <div class="card-top">

                    <span>
                        Patrimônio investido
                    </span>

                    <div class="card-icon">
                        R$
                    </div>

                </div>

                <h2>
                    ${formatMoney(total)}
                </h2>

                <p>
                    Valor total investido
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>
                        Rendimento mensal
                    </span>

                    <div class="card-icon">
                        ↑
                    </div>

                </div>

                <h2 class="positive">
                    ${formatMoney(monthly)}
                </h2>

                <p>
                    Estimativa mensal
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>
                        Rendimento anual
                    </span>

                    <div class="card-icon">
                        %
                    </div>

                </div>

                <h2 class="positive">
                    ${formatMoney(monthly * 12)}
                </h2>

                <p>
                    Estimativa simples
                </p>

            </div>


            <div class="card">

                <div class="card-top">

                    <span>
                        Investimentos
                    </span>

                    <div class="card-icon">
                        #
                    </div>

                </div>

                <h2>
                    ${investments.length}
                </h2>

                <p>
                    Ativos cadastrados
                </p>

            </div>

        </section>


        <section class="dashboard-grid">

            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h3>
                            Distribuição da carteira
                        </h3>

                        <p>
                            Seus investimentos
                        </p>

                    </div>

                </div>


                <div class="chart-container">

                    <canvas
                        id="investmentChart"
                    ></canvas>

                </div>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h3>
                            Resumo
                        </h3>

                        <p>
                            Patrimônio atual
                        </p>

                    </div>

                </div>


                <div class="investment-summary">

                    <div
                        class="investment-summary-item"
                    >

                        <span>
                            Patrimônio
                        </span>

                        <strong>
                            ${formatMoney(total)}
                        </strong>

                    </div>


                    <div
                        class="investment-summary-item"
                    >

                        <span>
                            Rendimento mensal
                        </span>

                        <strong class="positive">
                            ${formatMoney(monthly)}
                        </strong>

                    </div>


                    <div
                        class="investment-summary-item"
                    >

                        <span>
                            Rendimento anual
                        </span>

                        <strong class="positive">
                            ${formatMoney(monthly * 12)}
                        </strong>

                    </div>

                </div>

            </div>

        </section>


        <div class="page-card investment-section">

            <div class="panel-header">

                <div>

                    <h2>
                        Minha carteira
                    </h2>

                    <p>
                        Seus investimentos cadastrados.
                    </p>

                </div>


                <button
                    class="primary-button"
                    onclick="openInvestmentModal()"
                >
                    + Novo investimento
                </button>

            </div>


            ${
                investments.length === 0

                ?

                `

                <div class="empty-investments">

                    <div class="empty-icon">
                        +
                    </div>

                    <h3>
                        Nenhum investimento
                    </h3>

                    <p>
                        Adicione seu primeiro investimento.
                    </p>

                    <button
                        class="primary-button"
                        onclick="openInvestmentModal()"
                    >
                        Adicionar investimento
                    </button>

                </div>

                `

                :

                `

                <div class="investment-list">

                    ${investments.map(
                        investment => `

                        <div
                            class="investment-row"
                        >

                            <div
                                class="investment-main"
                            >

                                <div
                                    class="investment-symbol"
                                >
                                    ${investment.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <strong>
                                        ${investment.name}
                                    </strong>

                                    <span>
                                        ${investment.type}
                                    </span>

                                </div>

                            </div>


                            <div
                                class="investment-data"
                            >

                                <span>
                                    Investido
                                </span>

                                <strong>
                                    ${formatMoney(
                                        investment.value
                                    )}
                                </strong>

                            </div>


                            <div
                                class="investment-data"
                            >

                                <span>
                                    Taxa
                                </span>

                                <strong class="positive">
                                    ${investment.rate.toFixed(2)}%
                                </strong>

                            </div>


                            <div
                                class="investment-data"
                            >

                                <span>
                                    Rendimento/mês
                                </span>

                                <strong class="positive">
                                    ${formatMoney(
                                        investmentMonthlyReturn(
                                            investment.value,
                                            investment.rate
                                        )
                                    )}
                                </strong>

                            </div>


                            <button
                                class="delete-button"
                                onclick="deleteInvestment(
                                    ${investment.id}
                                )"
                            >
                                Excluir
                            </button>

                        </div>

                    `
                    ).join("")}

                </div>

                `
            }

        </div>


        <div class="page-card simulator-card">

            <div class="panel-header">

                <div>

                    <h2>
                        Simulador de investimentos
                    </h2>

                    <p>
                        Simule juros compostos.
                    </p>

                </div>

            </div>


            <div class="simulator-form">

                <div class="form-group">

                    <label>
                        Valor investido
                    </label>

                    <input
                        id="simulatorValue"
                        type="number"
                        value="20000"
                        min="0"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Tempo
                    </label>

                    <input
                        id="simulatorMonths"
                        type="number"
                        value="8"
                        min="1"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Taxa por mês
                    </label>

                    <input
                        id="simulatorRate"
                        type="number"
                        value="1.15"
                        min="0"
                        step="0.01"
                    >

                </div>

            </div>


            <div class="simulation-result">

                <div>

                    <span>
                        Valor inicial
                    </span>

                    <strong
                        id="simulationInitial"
                    >
                        R$ 20.000,00
                    </strong>

                </div>


                <div>

                    <span>
                        Rendimento
                    </span>

                    <strong
                        id="simulationGain"
                        class="positive"
                    >
                        R$ 1.921,53
                    </strong>

                </div>


                <div class="simulation-final">

                    <span>
                        Valor estimado
                    </span>

                    <strong
                        id="simulationFinal"
                    >
                        R$ 21.921,53
                    </strong>

                </div>

            </div>

        </div>

    `;


    document
        .getElementById("simulatorValue")
        ?.addEventListener(
            "input",
            calculateInvestmentSimulation
        );


    document
        .getElementById("simulatorMonths")
        ?.addEventListener(
            "input",
            calculateInvestmentSimulation
        );


    document
        .getElementById("simulatorRate")
        ?.addEventListener(
            "input",
            calculateInvestmentSimulation
        );


    createInvestmentChart();

}


/* =========================================
   GRÁFICO
========================================= */

function createInvestmentChart() {

    const canvas =
        document.getElementById(
            "investmentChart"
        );


    if (!canvas) return;


    const data = getData();


    const types = {};


    data.investments.forEach(
        investment => {

            if (!types[investment.type]) {

                types[investment.type] = 0;

            }

            types[investment.type] +=
                investment.value;

        }
    );


    if (investmentChart) {

        investmentChart.destroy();

    }


    investmentChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        Object.keys(types),

                    datasets: [

                        {

                            data:
                                Object.values(types),

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}