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

function buscarCep() {
    let cep = document.getElementById("cep").value.trim();
    if (!cep || cep.length !== 8 || isNaN(cep)) {
        document.getElementById("resultadoCep").innerText = "CEP inválido! Digite 8 números.";
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição!");
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                document.getElementById("resultadoCep").innerText = "CEP não encontrado!";
            } else {
                let endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                document.getElementById("resultadoCep").innerText = `Endereço: ${endereco}`;
                salvarHistoricoIndexedDB(cep, endereco);
            }
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
            document.getElementById("resultadoCep").innerText = "Erro ao buscar CEP. Tente novamente!";
        });
}

function buscarLogradouro() {
    let logradouro = document.getElementById("logradouro").value.trim();
    let uf = "CE";
    let cidade = "Fortaleza";

    if (!logradouro) {
        document.getElementById("resultadoLogradouro").innerText = "Digite um nome de rua válido!";
        return;
    }

    fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`)
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição!");
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                document.getElementById("resultadoLogradouro").innerText = "Endereço não encontrado!";
            } else {
                let cepEncontrado = data[0].cep;
                document.getElementById("resultadoLogradouro").innerText = `CEP encontrado: ${cepEncontrado}`;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar Logradouro:", error);
            document.getElementById("resultadoLogradouro").innerText = "Erro na busca. Tente novamente!";
        });
}

function alternarModo() {
    document.body.classList.toggle("dark-mode");
}

document.getElementById("modoEscuro").addEventListener("click", alternarModo);

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
