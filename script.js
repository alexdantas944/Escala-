async function abrirDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("CEP_DB", 1);
        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("historico")) {
                db.createObjectStore("historico", { keyPath: "cep" });
            }
        };
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject("Erro ao abrir IndexedDB:", event.target.error);
    });
}

async function salvarHistoricoIndexedDB(cep, endereco) {
    let db = await abrirDB();
    let transacao = db.transaction("historico", "readwrite");
    let store = transacao.objectStore("historico");
    store.put({ cep, endereco, data: new Date().toLocaleString() });
}

async function exibirHistorico() {
    let db = await abrirDB();
    let transacao = db.transaction("historico", "readonly");
    let store = transacao.objectStore("historico");

    let request = store.getAll();
    request.onsuccess = function() {
        let resultado = request.result;
        let historicoHtml = "<h3>Histórico de Consultas</h3><ul>";

        resultado.forEach(item => {
            historicoHtml += `<li>${item.cep} - ${item.endereco} (${item.data})</li>`;
        });

        historicoHtml += "</ul>";
        document.getElementById("historico").innerHTML = historicoHtml;
    };
}

async function limparHistorico() {
    let db = await abrirDB();
    let transacao = db.transaction("historico", "readwrite");
    let store = transacao.objectStore("historico");
    store.clear();
    document.getElementById("historico").innerHTML = "<p>Histórico limpo!</p>";
}

function alternarModo() {
    document.body.classList.toggle("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    const btnModo = document.createElement("button");
    btnModo.innerText = "Alternar Modo";
    btnModo.classList.add("toggle-mode");
    btnModo.onclick = alternarModo;
    document.body.appendChild(btnModo);
});

function iniciarReconhecimentoVoz() {
    let reconhecimento = new webkitSpeechRecognition() || new SpeechRecognition();
    reconhecimento.lang = "pt-BR";
    reconhecimento.onresult = event => {
        let resultado = event.results[0][0].transcript;
        document.getElementById("cep").value = resultado;
        buscarCep();
    };
    reconhecimento.start();
}

document.addEventListener("DOMContentLoaded", () => {
    const btnVoz = document.createElement("button");
    btnVoz.innerText = "🎤 Falar CEP";
    btnVoz.onclick = iniciarReconhecimentoVoz;
    document.body.appendChild(btnVoz);
});
