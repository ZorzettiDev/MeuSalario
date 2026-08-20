function setupSalary() {

    const form =
        document.getElementById("salarySetupForm");

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const salary =
            Number(
                document.getElementById("initialSalary").value
            );

        if (salary <= 0) {

            alert("Digite um salário válido.");

            return;

        }

        const data = getData();

        data.salary = salary;

        data.salaryHistory.push({

            value: salary,

            date: new Date().toISOString()

        });

        saveData(data);

        showApplication();

        loadPage("dashboard");

    });

}


function changeSalary() {

    const data = getData();

    const newSalary =
        Number(
            prompt(
                "Digite o novo salário:",
                data.salary
            )
        );

    if (!newSalary || newSalary <= 0) {

        return;

    }

    data.salary = newSalary;

    data.salaryHistory.push({

        value: newSalary,

        date: new Date().toISOString()

    });

    saveData(data);

    loadPage("salary");

}