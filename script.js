// IndexedDB para armazenar dados
let db;
const request = indexedDB.open("EscalaDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const store = db.createObjectStore("usuarios", { keyPath: "nome" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    carregarFolga();
};

// Cadastrar usuário e salvar última folga
function cadastrarUsuario() {
    const nome = document.getElementById("nome").value;
    const ultimaFolga = document.getElementById("ultimaFolga").value;
    if (!nome || !ultimaFolga) return alert("Preencha os dados!");

    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    store.put({ nome, ultimaFolga });

    carregarFolga();
}

// Carregar a folga e calcular automaticamente as próximas
function carregarFolga() {
    const transaction = db.transaction(["usuarios"], "readonly");
    const store = transaction.objectStore("usuarios");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        const usuarios = getAll.result;
        if (usuarios.length > 0) {
            const entregador = usuarios[0]; // Apenas um exemplo
            document.getElementById("nomeFolga").textContent = entregador.nome;
            
            // Cálculo da próxima folga
            let dataFolga = new Date(entregador.ultimaFolga);
            let proximaFolga = new Date(dataFolga.setDate(dataFolga.getDate() + 6));
            console.log("Próxima folga de", entregador.nome, "será em", proximaFolga.toDateString());
        }
    };
}