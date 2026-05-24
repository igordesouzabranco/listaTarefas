const listaTarefas = document.querySelector('.tarefas');
const btnAddTarefa = document.querySelector('.add-tarefa');
const inputTarefa = document.querySelector('.input-nova-tarefa');
const barraPesquisa = document.getElementById('barra-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');
const themeSelect = document.getElementById('theme-select');

function criaLi() {
    const li = document.createElement('li');
    li.innerHTML = '<i class="fa-solid fa-angles-right" style="margin-right: 8px;"></i> ';
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
    const botaoApagar = document.createElement('button');
    botaoApagar.innerHTML = '<i class="fa-solid fa-trash"></i>';
    botaoApagar.setAttribute('class', 'apagar');
    botaoApagar.setAttribute('title', 'Apagar tarefa');
    
    botaoApagar.style.marginLeft = '12px'; 
    
    li.appendChild(botaoApagar);
}

function criaRiscar(li) {
    const botaoRiscar = document.createElement('button');
    botaoRiscar.innerHTML = '<i class="fa-solid fa-strikethrough"></i>';
    botaoRiscar.setAttribute('class', 'riscar');
    botaoRiscar.setAttribute('title', 'Riscar tarefa');
    
    botaoRiscar.style.marginLeft = '12px'; 
    
    li.appendChild(botaoRiscar);
}

function criaTarefa(textInput) {
    const li = criaLi();
    li.innerHTML += textInput;
    listaTarefas.appendChild(li);
    limpaInput();
    criaApagar(li);
    criaRiscar(li);
    salvarTarefas();
}

btnAddTarefa.addEventListener('click', function() {
    if (!inputTarefa.value) return;
    criaTarefa(inputTarefa.value);
})

document.addEventListener('click', function(e) {
    const el = e.target;

    if (el.closest('.apagar')) {
        el.closest('li').remove();
        salvarTarefas();
    } else if (el.closest('.riscar')) {
        el.closest('li').classList.toggle('riscada');
        salvarTarefas();
    }
})

function salvarTarefas() {
    const liTarefas = listaTarefas.querySelectorAll('li');
    const listaSalvarTarefas = []

    for (let task of liTarefas) {
        let taskTexto = task.innerText;
        taskTexto = taskTexto.trim();
        listaSalvarTarefas.push(taskTexto);
    }

    const tarefasJSON = JSON.stringify(listaSalvarTarefas);
    localStorage.setItem('tarefas', tarefasJSON);
}

function addTarefasSalvas() {
    const tarefas = localStorage.getItem('tarefas');
    if (!tarefas) return; 
    
    const listaDeTarefasSalvas = JSON.parse(tarefas);

    for (let tarefa of listaDeTarefasSalvas) {
        criaTarefa(tarefa);
    }
}

function filtrarTarefas() {
    const termoPesquisa = barraPesquisa.value.toLowerCase().trim();
    const tarefas = listaTarefas.querySelectorAll('li');
    
    tarefas.forEach(tarefa => {
        const textoTarefa = tarefa.textContent.toLowerCase();
        if (textoTarefa.includes(termoPesquisa)) {
            tarefa.style.display = 'flex';
        } else {
            tarefa.style.display = 'none';
        }
    });
}

botaoPesquisa.addEventListener('click', filtrarTarefas);
barraPesquisa.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) { // Enter
        filtrarTarefas();
    }
});

barraPesquisa.addEventListener('input', filtrarTarefas);

themeSelect.addEventListener('change', function() {
    document.body.className = this.value;
    localStorage.setItem('selectedTheme', this.value);
});

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = savedTheme;
        themeSelect.value = savedTheme;
    }
});

addTarefasSalvas();
