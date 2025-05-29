document.addEventListener("DOMContentLoaded", () => {
    const calendario = document.getElementById('calendario');
    const editarFolgaBtn = document.getElementById("editarFolga");

    let ultimaFolga = new Date(2025, 4, 26);
    let cicloTrabalho = 5;
    let cicloFolga = 1;

    for (let i = 0; i < 30; i++) {
        let diaAtual = new Date(ultimaFolga);
        diaAtual.setDate(ultimaFolga.getDate() + (i * (cicloTrabalho + cicloFolga)));

        let diaElemento = document.createElement('div');
        diaElemento.textContent = diaAtual.toLocaleDateString("pt-BR");
        diaElemento.classList.add('dia');

        if (i % 6 === 5) { // Folga a cada 6 dias
            diaElemento.classList.add('folga');
        }

        calendario.appendChild(diaElemento);
    }

    editarFolgaBtn.addEventListener("click", () => {
        let novaFolga = prompt("Digite sua nova data de folga (YYYY-MM-DD):");
        if (novaFolga) {
            ultimaFolga = new Date(novaFolga);
            alert("Folga atualizada! Recarregue a página.");
        }
    });
});
