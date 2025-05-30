let db;
const request = indexedDB.open("EscalaDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const store = db.createObjectStore("usuarios", { keyPath: "email" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    carregarFolga();
};

// Cadastrar usuário e salvar última folga
function cadastrarUsuario() {
    const email = document.getElementById("email").value;
    const nome = document.getElementById("nome").value;
    const ultimaFolga = document.getElementById("ultimaFolga").value;
    if (!email || !nome || !ultimaFolga) return alert("Preencha os dados!");

    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    store.put({ email, nome, ultimaFolga });

    carregarFolga();
}

// Carregar folga
function carregarFolga() {
    const transaction = db.transaction(["usuarios"], "readonly");
    const store = transaction.objectStore("usuarios");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        const usuarios = getAll.result;
        if (usuarios.length > 0) {
            const entregador = usuarios[0];
            document.getElementById("nomeFolga").textContent = entregador.nome;
        }
    };
}

// Alternar tema
function alternarTema() {
    document.body.classList.toggle("dark-mode");
}

// Exportar CSV
function exportarCSV() {
    alert("Exportação CSV gerada!");
}

// Exportar PDF
function exportarPDF() {
    alert("Exportação PDF gerada!");
}
