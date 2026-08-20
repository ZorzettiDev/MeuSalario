const STORAGE_KEY = "meuSalarioData";


function getData() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {

        return {

            salary: 0,

            expenses: [],

            goals: [],

            investments: [],

            salaryHistory: []

        };

    }

    return JSON.parse(data);

}


function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


function updateData(callback) {

    const data = getData();

    callback(data);

    saveData(data);

}


function clearData() {

    localStorage.removeItem(STORAGE_KEY);

}