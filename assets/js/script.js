const API_KEY = "Mrs741ToeiPD2lTv5UtNhin3DIg";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function displayException(data) {
    let heading = "An Exception Occurred"
    let error_number = `<div>Error number: <span> ${data.error_no}</span></div>`;
    let error_code = `<div>The API returned status code<span class="bold"> ${data.status_code}</span></div>`;
    let error_text = `<div>Error text: <span>${data.error}</span></div>`

    let inner = error_code;
    inner += error_number;
    inner += error_text;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = inner;

    resultsModal.show();
}

function proccessOptions(form) {
    let optArray = [];

    for(let entry of form.entries()){
        if(entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options");
    form.append("options", optArray.join());

    return form;
}


async function postForm(e) {

    const form = proccessOptions(new FormData(document.getElementById("checksform")));

    for (let entry of form.entries()) {
        console.log(entry);
    }

    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                    "Authorization": API_KEY,
                                },
                                body: form,

    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data)
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    
    let heading = `JShint results for ${data.file}`;

    if(data.total_errors === 0) {
        results = `<div class="no_errors">No errors reportd!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

async function getStatus(e) {
    const queryString  = `${API_URL}?api_key=${API_KEY}`;
    console.log(`URL: ${queryString}`);

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data)
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let heading = "API Key Status";
    let results = "<div>Your Key is valid until</div>";
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}