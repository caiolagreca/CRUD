'use strict'

const openModal = () => document.querySelector('#modal').classList.add('active');

const closeModal = () => {
    document.querySelector('#modal').classList.remove('active');
    clearFiedls();
}

// CRUD - Create, Read, Update, Delete

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));

// Create
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
}

// Read
const readClient = () => getLocalStorage();

// Update
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

// Delete
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

//Interação com o layout
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value
        }
        const index = document.querySelector('#nome').dataset.index
        if (index == 'new') {
            createClient(client);
            closeModal();
            updateTable();
        } else{
            updateClient(index, client);
            updateTable();
            closeModal();
        }
        
    }
}

// Verificando se os campos são válidos
const isValidFields = () => {
    return document.querySelector('#form').reportValidity();
}

// Limpando os campos
const clearFiedls = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '');
}

// Criando novas linhas na tabela
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" data-action='edit-${index}'>editar</button>
            <button type="button" class="button red" data-action='delete-${index}'>excluir</button>
        </td>
    `
    document.querySelector('tbody').appendChild(newRow);
}

// Removendo linha da tabela
const clearTable = () => {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

// Atualizando tabela
const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

// Guardando valores dos campos preenchidos pelo usuário
const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome;
    document.querySelector('#email').value = client.email;
    document.querySelector('#celular').value = client.celular;
    document.querySelector('#cidade').value = client.cidade;
    document.querySelector('#nome').dataset.index = client.index;
}

// Editando cadastro
const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    openModal();
}

// Atribuindo funcionalidade aos botões "editar" e "excluir"
const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.dataset.action.split('-');

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index];
            const response = confirm(`Deseja excluir o cliente ${client.nome}?`);
            if (response) {
                deleteClient(index);
                updateTable();
            }
        }
    }
}

updateTable();

// Eventos
document.querySelector('#cadastrarCliente').addEventListener('click', openModal);
document.querySelector('#modalClose').addEventListener('click', closeModal);
document.querySelector('#cancelar').addEventListener('click', closeModal);
document.querySelector('#salvar').addEventListener('click', saveClient);
document.querySelector('tbody').addEventListener('click', editDelete);
