let expenseChart = null;


function createExpenseChart() {

    const canvas =
        document.getElementById("expenseChart");

    if (!canvas) {

        return;

    }

    const data = getData();

    const categories = {};

    data.expenses.forEach(expense => {

        if (!categories[expense.category]) {

            categories[expense.category] = 0;

        }

        categories[expense.category] += expense.value;

    });


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart = new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(categories),

                datasets: [

                    {

                        data:
                            Object.values(categories),

                        borderWidth: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "72%",

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }
    );

}