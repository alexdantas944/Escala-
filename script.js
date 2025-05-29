// Inicializa o banco de dados IndexedDB
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

// Função para cadastrar usuários
function cadastrarUsuario(cpf, senha, nome, escala) {
    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    store.add({ cpf, senha, nome, escala });
    alert("Usuário cadastrado com sucesso!");
}

// Função de login
function login() {
    let cpf = document.getElementById("cpf").value;
    let senha = document.getElementById("senha").value;

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

// Atualiza o painel de folga
function atualizarPainel(usuario) {
    let listaFolga = document.getElementById("listaFolga");
    listaFolga.innerHTML = `<li>${usuario.nome} está de folga</li>`;
}

// Exemplo de cadastro inicial (remova isso e substitua com um formulário real)
setTimeout(() => {
    cadastrarUsuario("12345678900", "123456", "João", ["Seg", "Ter", "Qua", "Qui", "Sex", "Folga"]);
    cadastrarUsuario("98765432100", "987654", "Maria", ["Qua", "Qui", "Sex", "Sáb", "Dom", "Folga"]);
}, 1000);
