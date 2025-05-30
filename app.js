if (!('indexedDB' in window)) {
    alert("Seu navegador não suporta IndexedDB.");
}

let db;
const request = indexedDB.open("scheduleDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const store = db.createObjectStore("schedules", {keyPath: "id"});
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadLastOffDate();
};

request.onerror = function(event) {
    console.error("Erro ao abrir IndexedDB:", event);
};

function loadLastOffDate() {
    const transaction = db.transaction(["schedules"], "readonly");
    const store = transaction.objectStore("schedules");
    const getRequest = store.get("lastOff");

    getRequest.onsuccess = function(event) {
        if (event.target.result) {
            document.getElementById("lastOffDate").value = event.target.result.date;
        } else {
            document.getElementById("lastOffDate").value = ""; // Caso não haja dados
        }
    };
}

document.getElementById("generateSchedule").addEventListener("click", function() {
    const lastOffDate = new Date(document.getElementById("lastOffDate").value);
    if (!lastOffDate) {
        alert("Por favor, insira uma data válida.");
        return;
    }

    // Save the last off date in IndexedDB
    const transaction = db.transaction(["schedules"], "readwrite");
    const store = transaction.objectStore("schedules");
    const scheduleData = {id: "lastOff", date: lastOffDate.toISOString().split('T')[0]};
    store.put(scheduleData);

    // Generate schedule based on the last off date
    let scheduleHtml = "<h2>Escala de Trabalho:</h2><ul>";
    for (let i = 0; i < 30; i++) {
        const workDate = new Date(lastOffDate);
        workDate.setDate(workDate.getDate() + i);
        const dayName = workDate.toLocaleDateString('pt-BR', { weekday: 'long' });

        // Alterna entre dias de trabalho e folga
        if (i % 6 === 5) {
            scheduleHtml += `<li>${workDate.toISOString().split('T')[0]} - Folga (${dayName})</li>`;
        } else {
            scheduleHtml += `<li>${workDate.toISOString().split('T')[0]} - Trabalho (${dayName})</li>`;
        }
    }
    scheduleHtml += "</ul>";
    document.getElementById("schedule").innerHTML = scheduleHtml;
});

// A função para registrar o Service Worker, para permitir que o PWA funcione offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
