const listaTarefas = document.querySelector('.tarefas');
const btnAddTarefa = document.querySelector('.add-tarefa');
const inputTarefa = document.querySelector('.input-nova-tarefa');
const barraPesquisa = document.getElementById('barra-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');
const themeButton = document.getElementById('theme-button');
const themePopup = document.getElementById('theme-popup');

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

function criaEditar(li) {
    const botaoEditar = document.createElement('button');
    botaoEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
    botaoEditar.setAttribute('class', 'editar');
    botaoEditar.setAttribute('title', 'Editar tarefa');
    
    botaoEditar.style.marginLeft = '8px'; 
    
    li.appendChild(botaoEditar);
}

function criaTarefa(textInput, completada = false) {
    const li = criaLi();
    li.innerHTML += textInput;
    listaTarefas.appendChild(li);
    limpaInput();
    criaApagar(li);
    criaRiscar(li);
    criaEditar(li);
    
    if (completada) {
        li.classList.add('riscada');
    }
    
    salvarTarefas();
    return li;
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
    } else if (el.closest('.editar')) {
        const li = el.closest('li');
        const span = document.createElement('span');
        span.contentEditable = 'true';
        span.style.borderBottom = '1px dashed #ccc';
        span.style.padding = '0 2px';
        
        let taskText = li.innerText;

        taskText = taskText.replace(/^.*?[\s]*/, '').trim();
        
        span.textContent = taskText;
        
        li.innerHTML = '';
        li.appendChild(span);
        
        criaApagar(li);
        criaRiscar(li);
        criaEditar(li);
        
        span.focus();
        
        const salvarEdicao = function() {
            const novoTexto = span.textContent.trim();
            if (novoTexto) {

                li.innerHTML = '';
                li.innerHTML += '<i class="fa-solid fa-angles-right" style="margin-right: 8px;"></i> ';
                li.innerHTML += novoTexto;
            
                criaApagar(li);
                criaRiscar(li);
                criaEditar(li);
                
                salvarTarefas();
            } else {
                li.remove();
                salvarTarefas();
            }
        };
        
        span.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) { // Enter
                salvarEdicao();
            }
        });
        
        span.addEventListener('blur', function() {
            salvarEdicao();
        });
    }
})

function salvarTarefas() {
    const liTarefas = listaTarefas.querySelectorAll('li');
    const listaSalvarTarefas = []

    for (let task of liTarefas) {
        let taskTexto = task.innerText;
        taskTexto = taskTexto.replace(/^.*?[\s]*/, '').trim();
        const completada = task.classList.contains('riscada');
        listaSalvarTarefas.push({texto: taskTexto, completada: completada});
    }

    const tarefasJSON = JSON.stringify(listaSalvarTarefas);
    localStorage.setItem('tarefas', tarefasJSON);
}

function addTarefasSalvas() {
    const tarefas = localStorage.getItem('tarefas');
    if (!tarefas) return; 
    
    const listaDeTarefasSalvas = JSON.parse(tarefas);
 
    for (let tarefaObj of listaDeTarefasSalvas) {
        const li = criaTarefa(tarefaObj.texto);
        if (tarefaObj.completada) {
            li.classList.add('riscada');
        }
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

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('selectedTheme', theme);
}

themeButton.addEventListener('click', function(e) {
    e.stopPropagation(); 
    themePopup.classList.toggle('show');
});

themePopup.addEventListener('click', function(e) {
    if (e.target.classList.contains('theme-option')) {
        const theme = e.target.getAttribute('data-theme');
        applyTheme(theme);
        themePopup.classList.remove('show');
    }
});

document.addEventListener('click', function(e) {
    if (!themePopup.contains(e.target) && !themeButton.contains(e.target)) {
        themePopup.classList.remove('show');
    }
});

themePopup.addEventListener('click', function(e) {
    e.stopPropagation();
});

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

addTarefasSalvas();
