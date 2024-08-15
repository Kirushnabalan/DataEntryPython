let entries = [];

function validateDate(dateText) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateText);
}

function validateDataPoints(dataPoints) {
    return dataPoints.split(',').every(point => !isNaN(point.trim()));
}

function showErrorMessage(inputId, message) {
    const errorSpan = document.getElementById(`${inputId}Error`);
    const inputField = document.getElementById(inputId);
    
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
    inputField.classList.add('error');
}

function clearErrorMessage(inputId) {
    const errorSpan = document.getElementById(`${inputId}Error`);
    const inputField = document.getElementById(inputId);
    
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    inputField.classList.remove('error');
}

function validateInputs(experimentName, date, researcher, dataPoints) {
    let isValid = true;

    if (!experimentName.trim()) {
        showErrorMessage('experimentName', "Experiment Name is required.");
        isValid = false;
    } else {
        clearErrorMessage('experimentName');
    }

    if (!date || !validateDate(date)) {
        showErrorMessage('date', "Invalid Date. Use YYYY-MM-DD format.");
        isValid = false;
    } else {
        clearErrorMessage('date');
    }

    if (!researcher.trim()) {
        showErrorMessage('researcher', "Researcher Name is required.");
        isValid = false;
    } else {
        clearErrorMessage('researcher');
    }

    if (!dataPoints || !validateDataPoints(dataPoints)) {
        showErrorMessage('dataPoints', "Data Points should be numeric and comma-separated.");
        isValid = false;
    } else {
        clearErrorMessage('dataPoints');
    }

    return isValid;
}

function addEntry() {
    const experimentName = document.getElementById('experimentName').value.trim();
    const date = document.getElementById('date').value.trim();
    const researcher = document.getElementById('researcher').value.trim();
    const dataPoints = document.getElementById('dataPoints').value.trim();

    if (!validateInputs(experimentName, date, researcher, dataPoints)) {
        return;
    }

    const entry = {
        experimentName,
        date,
        researcher,
        dataPoints: dataPoints.split(',').map(point => point.trim())
    };

    entries.push(entry);
    updateEntriesList();
    clearInputs();
}

function updateEntriesList(filteredEntries = null) {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';

    const entriesToDisplay = filteredEntries || entries;

    entriesToDisplay.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.experimentName} (${entry.date})`;
        listItem.onclick = () => viewEntry(index);
        entriesList.appendChild(listItem);

        // Apply fade-in effect
        listItem.style.animation = 'fadeIn 0.5s ease-in-out';
    });
}

function applyFilters() {
    const filterExperimentName = document.getElementById('filterExperimentName').value.trim().toLowerCase();
    const filterStartDate = document.getElementById('filterStartDate').value;
    const filterEndDate = document.getElementById('filterEndDate').value;
    const filterResearcher = document.getElementById('filterResearcher').value.trim().toLowerCase();

    const filteredEntries = entries.filter(entry => {
        const experimentNameMatches = entry.experimentName.toLowerCase().includes(filterExperimentName);
        const researcherMatches = entry.researcher.toLowerCase().includes(filterResearcher);

        let dateMatches = true;
        if (filterStartDate) {
            dateMatches = dateMatches && (entry.date >= filterStartDate);
        }
        if (filterEndDate) {
            dateMatches = dateMatches && (entry.date <= filterEndDate);
        }

        return experimentNameMatches && researcherMatches && dateMatches;
    });

    updateEntriesList(filteredEntries);
}

function viewEntry(index) {
    const entry = entries[index];
    const modalContent = `
        <p><strong>Experiment Name:</strong> ${entry.experimentName}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <p><strong>Researcher Name:</strong> ${entry.researcher}</p>
        <p><strong>Data Points:</strong> ${entry.dataPoints.join(', ')}</p>
    `;

    document.getElementById('modalContent').innerHTML = modalContent;
    openModal();
}

function clearInputs() {
    document.getElementById('experimentName').value = '';
    document.getElementById('date').value = '';
    document.getElementById('researcher').value = '';
    document.getElementById('dataPoints').value = '';

    clearErrorMessage('experimentName');
    clearErrorMessage('date');
    clearErrorMessage('researcher');
    clearErrorMessage('dataPoints');
}

function openModal() {
    document.getElementById('modal').style.display = "block";
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

function exportToCSV() {
    if (entries.length === 0) {
        alert("There are no entries to export.");
        return;
    }

    const csvRows = [];
    const headers = ["Experiment Name", "Date", "Researcher Name", "Data Points"];
    csvRows.push(headers.join(','));

    entries.forEach(entry => {
        const row = [
            entry.experimentName,
            entry.date,
            entry.researcher,
            entry.dataPoints.join(', ')
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'research_data.csv');
    a.click();
}
