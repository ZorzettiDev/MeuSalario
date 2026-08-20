function setupGoals() {

    const form =
        document.getElementById(
            "goalForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "goalName"
                ).value.trim();


            const target =
                Number(
                    document.getElementById(
                        "goalTarget"
                    ).value
                );


            const current =
                Number(
                    document.getElementById(
                        "goalCurrent"
                    ).value
                ) || 0;


            const months =
                Number(
                    document.getElementById(
                        "goalMonths"
                    ).value
                );


            if (
                !name ||
                target <= 0 ||
                current < 0 ||
                months <= 0
            ) {

                alert(
                    "Preencha todos os campos corretamente."
                );

                return;

            }


            if (current > target) {

                alert(
                    "O valor já guardado não pode ser maior que a meta."
                );

                return;

            }


            const data = getData();


            if (!data.goals) {

                data.goals = [];

            }


            data.goals.push({

                id: Date.now(),

                name: name,

                target: target,

                current: current,

                months: months,

                createdAt:
                    new Date().toISOString()

            });


            saveData(data);


            closeGoalModal();


            renderGoals();

        }
    );


    document
        .getElementById(
            "goalTarget"
        )
        ?.addEventListener(
            "input",
            updateGoalCalculation
        );


    document
        .getElementById(
            "goalCurrent"
        )
        ?.addEventListener(
            "input",
            updateGoalCalculation
        );


    document
        .getElementById(
            "goalMonths"
        )
        ?.addEventListener(
            "input",
            updateGoalCalculation
        );


    document
        .getElementById(
            "closeGoalModal"
        )
        ?.addEventListener(
            "click",
            closeGoalModal
        );


    document
        .getElementById(
            "cancelGoal"
        )
        ?.addEventListener(
            "click",
            closeGoalModal
        );

}


/* =========================================
   MODAL
========================================= */

function openGoalModal() {

    document
        .getElementById(
            "goalModal"
        )
        ?.classList.remove(
            "hidden"
        );

    document
        .getElementById(
            "goalForm"
        )
        ?.reset();

    updateGoalCalculation();

}


function closeGoalModal() {

    document
        .getElementById(
            "goalModal"
        )
        ?.classList.add(
            "hidden"
        );

}


/* =========================================
   CÁLCULO DA META
========================================= */

function updateGoalCalculation() {

    const target =
        Number(
            document.getElementById(
                "goalTarget"
            )?.value
        ) || 0;


    const current =
        Number(
            document.getElementById(
                "goalCurrent"
            )?.value
        ) || 0;


    const months =
        Number(
            document.getElementById(
                "goalMonths"
            )?.value
        ) || 0;


    const remaining =
        Math.max(
            target - current,
            0
        );


    const monthly =
        months > 0
            ? remaining / months
            : 0;


    const result =
        document.getElementById(
            "goalMonthlyAmount"
        );


    if (result) {

        result.textContent =
            formatMoney(monthly);

    }

}


/* =========================================
   ADICIONAR DINHEIRO
========================================= */

function addGoalMoney(id) {

    const value =
        Number(
            prompt(
                "Digite o valor que deseja adicionar:"
            )
        );


    if (
        !value ||
        value <= 0
    ) return;


    const data = getData();


    const goal =
        data.goals.find(
            item =>
                item.id === id
        );


    if (!goal) return;


    goal.current =
        Math.min(
            goal.current + value,
            goal.target
        );


    saveData(data);


    renderGoals();

}


/* =========================================
   EXCLUIR
========================================= */

function deleteGoal(id) {

    if (
        !confirm(
            "Deseja excluir esta meta?"
        )
    ) return;


    const data = getData();


    data.goals =
        data.goals.filter(
            goal =>
                goal.id !== id
        );


    saveData(data);


    renderGoals();

}


/* =========================================
   RENDERIZAR
========================================= */

function renderGoals() {

    const data = getData();


    if (!data.goals) {

        data.goals = [];

        saveData(data);

    }


    const goals =
        data.goals;


    const total =
        goals.reduce(
            (sum, goal) =>
                sum + goal.target,
            0
        );


    const saved =
        goals.reduce(
            (sum, goal) =>
                sum + goal.current,
            0
        );


    const remaining =
        Math.max(
            total - saved,
            0
        );


    const completed =
        goals.filter(
            goal =>
                goal.current >= goal.target
        ).length;


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <section class="summary">

            <div class="card">

                <div class="card-top">
                    <span>Total das metas</span>
                    <div class="card-icon">◎</div>
                </div>

                <h2>
                    ${formatMoney(total)}
                </h2>

                <p>
                    Valor planejado
                </p>

            </div>


            <div class="card">

                <div class="card-top">
                    <span>Já guardado</span>
                    <div class="card-icon">↑</div>
                </div>

                <h2 class="positive">
                    ${formatMoney(saved)}
                </h2>

                <p>
                    Total destinado às metas
                </p>

            </div>


            <div class="card">

                <div class="card-top">
                    <span>Falta guardar</span>
                    <div class="card-icon">R$</div>
                </div>

                <h2>
                    ${formatMoney(remaining)}
                </h2>

                <p>
                    Para completar todas
                </p>

            </div>


            <div class="card">

                <div class="card-top">
                    <span>Concluídas</span>
                    <div class="card-icon">✓</div>
                </div>

                <h2>
                    ${completed}
                </h2>

                <p>
                    De ${goals.length} metas
                </p>

            </div>

        </section>


        <div class="page-card goals-container">

            <div class="panel-header">

                <div>

                    <h2>
                        Minhas metas
                    </h2>

                    <p>
                        Organize seus objetivos financeiros.
                    </p>

                </div>


                <button
                    class="primary-button"
                    onclick="openGoalModal()"
                >
                    + Nova meta
                </button>

            </div>


            ${
                goals.length === 0

                ?

                `

                <div class="empty-investments">

                    <div class="empty-icon">
                        +
                    </div>

                    <h3>
                        Nenhuma meta criada
                    </h3>

                    <p>
                        Crie uma meta para começar
                        a organizar seus objetivos.
                    </p>

                    <button
                        class="primary-button"
                        onclick="openGoalModal()"
                    >
                        Criar primeira meta
                    </button>

                </div>

                `

                :

                `

                <div class="goals-list">

                    ${goals.map(goal => {

                        const percentage =
                            Math.min(
                                (
                                    goal.current /
                                    goal.target
                                ) * 100,
                                100
                            );


                        const falta =
                            Math.max(
                                goal.target -
                                goal.current,
                                0
                            );


                        const mensal =
                            goal.months > 0
                                ? falta /
                                  goal.months
                                : 0;


                        return `

                        <div class="goal-card">

                            <div class="goal-header">

                                <div>

                                    <h3>
                                        ${goal.name}
                                    </h3>

                                    <span>
                                        ${
                                            percentage >= 100
                                                ? "Meta concluída 🎉"
                                                : `${goal.months} meses`
                                        }
                                    </span>

                                </div>


                                <strong>
                                    ${formatMoney(
                                        goal.target
                                    )}
                                </strong>

                            </div>


                            <div class="goal-progress">

                                <div
                                    class="goal-progress-bar"
                                    style="width:${percentage}%"
                                ></div>

                            </div>


                            <div class="goal-values">

                                <span>
                                    ${formatMoney(
                                        goal.current
                                    )}
                                    de
                                    ${formatMoney(
                                        goal.target
                                    )}
                                </span>

                                <strong>
                                    ${percentage.toFixed(0)}%
                                </strong>

                            </div>


                            <div class="goal-details">

                                <div>

                                    <span>
                                        Falta
                                    </span>

                                    <strong>
                                        ${formatMoney(falta)}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Guardar por mês
                                    </span>

                                    <strong>
                                        ${formatMoney(mensal)}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Prazo
                                    </span>

                                    <strong>
                                        ${goal.months}
                                        ${
                                            goal.months === 1
                                                ? "mês"
                                                : "meses"
                                        }
                                    </strong>

                                </div>


                                <button
                                    class="goal-add-button"
                                    onclick="addGoalMoney(${goal.id})"
                                >
                                    + Adicionar dinheiro
                                </button>


                                <button
                                    class="delete-button"
                                    onclick="deleteGoal(${goal.id})"
                                >
                                    Excluir
                                </button>

                            </div>

                        </div>

                        `;

                    }).join("")}

                </div>

                `
            }

        </div>

    `;

}