const listaTarefas = document.querySelector('.tarefas');
const btnAddTarefa = document.querySelector('.add-tarefa');
const inputTarefa = document.querySelector('.input-nova-tarefa');

function criaLi() {
    const li = document.createElement('li');
    return li;
}

inputTarefa.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
        if (!inputTarefa.value) return;
        criaTarefa(inputTarefa.value);
    }
})

function limpaInput() {
    inputTarefa.value = '';
    inputTarefa.focus();
}

function criaApagar(li) {
    li.innerText += ' ';
    const botaoApagar = document.createElement('button');
    botaoApagar.innerText = 'Apagar';
    botaoApagar.setAttribute('class', 'apagar');
    botaoApagar.setAttribute('title', 'Apagar tarefa');
    li.appendChild(botaoApagar);
}

function criaTarefa(textInput) {
    const li = criaLi();
    li.innerText = textInput;
    listaTarefas.appendChild(li);
    limpaInput();
    criaApagar(li);
    salvarTarefas();
}

btnAddTarefa.addEventListener('click', function() {
    if (!inputTarefa.value) return;
    criaTarefa(inputTarefa.value);
})

document.addEventListener('click', function(e) {
    const el = e.target;

    if (el.classList.contains('apagar')) {
        el.parentElement.remove();
        salvarTarefas();
    }
})

function salvarTarefas() {
    const liTarefas = listaTarefas.querySelectorAll('li');
    const listaSalvarTarefas = []

    for (let task of liTarefas) {
        let taskTexto = task.innerText;
        taskTexto = taskTexto.replace('Apagar', '').trim();
        listaSalvarTarefas.push(taskTexto);
    }

    const tarefasJSON = JSON.stringify(listaSalvarTarefas);
    localStorage.setItem('tarefas', tarefasJSON);
}

function addTarefasSalvas() {
    const tarefas = localStorage.getItem('tarefas');
    const listaDeTarefasSalvas = JSON.parse(tarefas);

    for (let tarefa of listaDeTarefasSalvas) {
        criaTarefa(tarefa);
    }
}

addTarefasSalvas();