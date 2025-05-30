// Abrindo o banco IndexedDB
let db;
const request = indexedDB.open("EscalaDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("config", { keyPath: "id" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    carregarUltimaFolga();
};

// Função para calcular folgas futuras
function atualizarEscala() {
    const ultimaFolgaInput = document.getElementById("ultimaFolga");
    const listaFolgas = document.getElementById("listaFolgas");

    const ultimaFolga = new Date(ultimaFolgaInput.value);
    
    if (!ultimaFolgaInput.value) return;

    listaFolgas.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        ultimaFolga.setDate(ultimaFolga.getDate() + 6);
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = ultimaFolga.toLocaleDateString("pt-BR");
        listaFolgas.appendChild(li);
    }

    salvarUltimaFolga(ultimaFolgaInput.value);
}

// Salvar última folga no IndexedDB
function salvarUltimaFolga(data) {
    const transaction = db.transaction(["config"], "readwrite");
    const store = transaction.objectStore("config");
    store.put({ id: "ultimaFolga", data });
}

// Carregar última folga do IndexedDB
function carregarUltimaFolga() {
    const transaction = db.transaction(["config"], "readonly");
    const store = transaction.objectStore("config");
    const request = store.get("ultimaFolga");

    request.onsuccess = function() {
        if (request.result) {
            document.getElementById("ultimaFolga").value = request.result.data;
            atualizarEscala();
        }
    };
}
