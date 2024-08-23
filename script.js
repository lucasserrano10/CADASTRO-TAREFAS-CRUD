const btnAdicionar = document.querySelector('#adicionar')
const btnLimparTudo = document.querySelector('#limpar')
const listaAtividades = document.querySelector('#listaAtividades')
const listaAtividadesConcluidas = document.querySelector('#listaAtividadesConcluidas')

const atividades = []

document.addEventListener('DOMContentLoaded', ()=>{
    carregarTarefas()
})

btnLimparTudo.addEventListener('click',(e) =>{
    e.preventDefault()
    limparTudo()
})

function limparTudo(){
    localStorage.clear()
    listaAtividades.innerHTML = ''
    listaAtividadesConcluidas.innerHTML = ''
}

btnAdicionar.addEventListener('click', (e)=>{
    e.preventDefault()
    adicionarTarefa()
})

function adicionarTarefa() {
    let titulo = prompt('Insira o título da tarefa ->');
    let descricao = prompt('Insira a descrição da tarefa ->');
    let prioridade = prompt('Insira a Prioridade [ALTA,MÉDIA,BAIXA] ->');
    let status = 'PENDENTE';

    const index = Date.now(); // Usando timestamp como identificador único

    const novaTarefa = {
        id: index,
        titulo: titulo,
        descricao: descricao,
        prioridade: prioridade,
        status: status,
    };

    atividades.push(novaTarefa);
    localStorage.setItem(`TAREFA${index}`, JSON.stringify(novaTarefa));
    inserirTela(novaTarefa, index);
}


function carregarTarefas() {
    listaAtividades.innerHTML = '';
    listaAtividadesConcluidas.innerHTML = '';
    atividades.length = 0; // Limpar o array de atividades

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('TAREFA')) {
            const tarefa = JSON.parse(localStorage.getItem(key));
            atividades.push(tarefa); // Adiciona a tarefa ao array de atividades
            const index = key.replace('TAREFA', ''); // Extrai o índice da chave
            inserirTela(tarefa, index); // Passa o índice para a função inserirTela
        }
    }
}

function marcarConcluida(button) {
    const index = button.getAttribute('data-id'); // Recuperar o identificador da tarefa
    const li = button.parentElement; // Seleciona o item da lista

    button.remove()
    
    // Recuperar a tarefa do localStorage
    const tarefa = JSON.parse(localStorage.getItem(`TAREFA${index}`));
    
    if (!tarefa) return; // Verifica se a tarefa existe

    // Atualizar o status da tarefa para 'CONCLUÍDA'
    tarefa.status = 'CONCLUÍDA';

    // Atualizar a tarefa no localStorage
    localStorage.setItem(`TAREFA${index}`, JSON.stringify(tarefa));

    // Remover o item da lista de pendentes
    listaAtividades.removeChild(li);

    // Adicionar o item à lista de concluídas
    inserirTela(tarefa, index);
}

function editarNome(button) {
    const index = button.getAttribute('data-id'); // Recuperar o identificador da tarefa
    const li = button.parentElement; // Seleciona o item da lista

    // Recuperar a tarefa do localStorage
    const tarefa = JSON.parse(localStorage.getItem(`TAREFA${index}`));

    // Pedir novo título ao usuário
    const novoTitulo = prompt('Insira o novo título da tarefa ->', tarefa.titulo);

    if (novoTitulo !== null && novoTitulo.trim() !== '') {
        // Atualizar o título da tarefa
        tarefa.titulo = novoTitulo;

        // Atualizar o localStorage
        localStorage.setItem(`TAREFA${index}`, JSON.stringify(tarefa));

        // Atualizar a interface
        li.querySelector('h2').innerText = `Título: ${novoTitulo}`;
    }
}

function apagarSomenteUm(button) {
    const index = button.getAttribute('data-id'); // Recuperar o identificador da tarefa
    const li = button.parentElement; // Seleciona o item da lista

    // Remove o item da interface
    li.remove();
    
    // Remove o item do localStorage
    localStorage.removeItem(`TAREFA${index}`);

    // Atualiza o array de atividades
    const tarefaIndex = atividades.findIndex(tarefa => tarefa.id === parseInt(index)); // Encontra o índice da tarefa
    if (tarefaIndex !== -1) {
        atividades.splice(tarefaIndex, 1); // Remove a tarefa do array
    }
}


function inserirTela(tarefa, index) {
    const li = document.createElement('li');
    li.innerHTML = `<h2>Título: ${tarefa.titulo}</h2>
                    <p>Descrição: ${tarefa.descricao}</p>
                    <p>Prioridade: ${tarefa.prioridade}</p>
                    <p>Status: ${tarefa.status}</p>
                    <button class="btn" data-id="${index}" onClick='marcarConcluida(this)'>Marcar como Concluída</button>
                    <button class="btn" data-id="${index}" onClick='editarNome(this)'>Editar</button>
                    <button class="btn" data-id="${index}" onClick='apagarSomenteUm(this)'>Apagar</button>`;
    
    if (tarefa.status === 'PENDENTE') {
        listaAtividades.appendChild(li);
    } else if (tarefa.status === 'CONCLUÍDA') {
        listaAtividadesConcluidas.appendChild(li);
    }
}