function buscarCep() {
    let cep = document.getElementById("cep").value;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                document.getElementById("resultadoCep").innerText = "CEP não encontrado!";
            } else {
                document.getElementById("resultadoCep").innerText = `Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            }
        })
        .catch(error => console.error("Erro ao buscar CEP:", error));
}

function buscarLogradouro() {
    let logradouro = document.getElementById("logradouro").value;
    let uf = "CE"; 
    let cidade = "Fortaleza";
    
    fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("resultadoLogradouro").innerText = "Endereço não encontrado!";
            } else {
                let cepEncontrado = data[0].cep;
                document.getElementById("resultadoLogradouro").innerText = `CEP encontrado: ${cepEncontrado}`;
            }
        })
        .catch(error => console.error("Erro ao buscar Logradouro:", error));
}
