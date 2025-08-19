const form = document.getElementById("formAgendamento");
const listaHorarios = document.getElementById("listaHorarios");
const apiUrl = 'http://localhost:8080/api/agendamentos'; // O endereço do seu back-end

// 1. FUNÇÃO PARA BUSCAR OS DADOS NO BACK-END
async function buscarAgendamentosDoServidor() {
    try {
        const response = await fetch(apiUrl);
        const agendamentos = await response.json();
        atualizarLista(agendamentos); // Passa a lista vinda do servidor para a função de atualizar
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
    }
}

// 2. FUNÇÃO PARA ATUALIZAR A LISTA NA TELA
function atualizarLista(agendamentos) {
    listaHorarios.innerHTML = ""; // Limpa a lista na tela

    if (!agendamentos || agendamentos.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum horário agendado.";
        listaHorarios.appendChild(li);
        return;
    }
    
    // Formata a data e hora para um formato mais amigável
    const formatarData = (dataHora) => {
        const data = new Date(dataHora);
        return data.toLocaleString('pt-BR');
    };

    agendamentos.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = `Cliente: ${a.nomeCliente} | Horário: ${formatarData(a.dataHora)} | Quadra ${a.numeroQuadra}`;
        listaHorarios.appendChild(li);
    });
}

// 3. EVENTO DE SUBMISSÃO DO FORMULÁRIO
form.addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita recarregar a página

    // Pega os valores dos campos do formulário
    const nome = document.getElementById("nome").value;
    const dataHora = document.getElementById("dataHora").value;
    const quadra = document.getElementById("quadra").value;

    // Cria o objeto para enviar ao back-end (os nomes devem ser iguais aos da sua classe Java)
    const agendamentoParaEnviar = { 
        nomeCliente: nome, 
        dataHora: dataHora, 
        numeroQuadra: quadra 
    };

    // Envia o objeto para o back-end usando POST
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agendamentoParaEnviar)
        });

        if (response.ok) {
            buscarAgendamentosDoServidor(); // Atualiza a lista com os novos dados
            form.reset(); // Limpa o formulário
        } else {
            alert("Erro ao salvar agendamento.");
        }
    } catch (error) {
        console.error('Erro ao enviar agendamento:', error);
    }
});

// 4. INICIALIZAÇÃO
// Chama a função para buscar os agendamentos assim que a página carrega
buscarAgendamentosDoServidor();