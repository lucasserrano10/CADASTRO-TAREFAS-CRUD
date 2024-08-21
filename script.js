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

function adicionarTarefa(){
    let titulo = prompt('Insira o título da tarefa ->')
    let descricao = prompt('Insira a descrição da tarefa ->')
    let prioridade = prompt('Insira a Prioridade [ALTA,MÉDIA,BAIXA] ->')
    let status = 'PENDENTE'

    const novaTarefa = {
        titulo: titulo,
        descricao: descricao,
        prioridade: prioridade,
        status: status,
    }

    atividades.push(novaTarefa)
    localStorage.setItem(`TAREFA${atividades.length - 1}`, JSON.stringify(novaTarefa))
    inserirTela(novaTarefa)
}


function carregarTarefas() {
    listaAtividades.innerHTML = ''
    listaAtividadesConcluidas.innerHTML = ''

    for (let i = 0; i < localStorage.length; i++) {
        const tarefa = JSON.parse(localStorage.getItem(`TAREFA${i}`))
        if (tarefa) {
            atividades.push(tarefa)
            inserirTela(tarefa)
        }
    }
}

function inserirTela(tarefa) {
    const li = document.createElement('li')
    li.innerHTML = `<h1>Título: ${tarefa.titulo}</h1> 
                    <p>Descrição: ${tarefa.descricao}</p>
                    <p>Prioridade: ${tarefa.prioridade}</p>
                    <p>Status: ${tarefa.status}</p>`

    if (tarefa.status === 'PENDENTE') {
        listaAtividades.appendChild(li)
    } else if (tarefa.status === 'CONCLUÍDA') {
        listaAtividadesConcluidas.appendChild(li)
    }
}