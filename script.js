let db;
const request = indexedDB.open("EscalaDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("usuarios", { keyPath: "cpf" });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error("Erro ao abrir IndexedDB:", event.target.error);
};

// Cadastro de usuário
function cadastrarUsuario() {
    let nome = document.getElementById("cadastroNome").value;
    let cpf = document.getElementById("cadastroCPF").value;
    let senha = document.getElementById("cadastroSenha").value;

    if (!nome || !cpf || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    store.add({ cpf, senha, nome, escala: ["Seg", "Ter", "Qua", "Qui", "Sex", "Folga"] });

    alert("Usuário cadastrado com sucesso!");
}

// Login
function login() {
    let cpf = document.getElementById("loginCPF").value;
    let senha = document.getElementById("loginSenha").value;

    const transaction = db.transaction(["usuarios"], "readonly");
    const store = transaction.objectStore("usuarios");
    const request = store.get(cpf);

    request.onsuccess = function(event) {
        const usuario = event.target.result;
        if (usuario && usuario.senha === senha) {
            alert(`Bem-vindo, ${usuario.nome}! Sua escala é: ${usuario.escala.join(", ")}`);
            atualizarPainel(usuario);
        } else {
            alert("CPF ou senha inválidos!");
        }
    };
}

// Atualiza painel de folga
function atualizarPainel(usuario) {
    let listaFolga = document.getElementById("listaFolga");
    listaFolga.innerHTML = `<li>${usuario.nome} está de folga</li>`;
}
