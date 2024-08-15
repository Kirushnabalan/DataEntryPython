let entries = [];

function validateDate(dateText) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateText);
}

function validateInputs(experimentName, date, researcher, dataPoints) {
    if (!experimentName) {
        alert("Experiment Name is required.");
        return false;
    }
    if (!date || !validateDate(date)) {
        alert("Invalid Date. Use YYYY-MM-DD format.");
        return false;
    }
    if (!researcher) {
        alert("Researcher Name is required.");
        return false;
    }
    if (!dataPoints) {
        alert("Data Points are required.");
        return false;
    }
    return true;
}

function addEntry() {
    const experimentName = document.getElementById('experimentName').value;
    const date = document.getElementById('date').value;
    const researcher = document.getElementById('researcher').value;
    const dataPoints = document.getElementById('dataPoints').value;

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

function updateEntriesList() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';

    entries.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.experimentName} (${entry.date})`;
        listItem.onclick = () => viewEntry(index);
        entriesList.appendChild(listItem);
    });
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
