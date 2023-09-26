// Obtém referências para elementos HTML
const inputValue = document.querySelector("input");
const addButton = document.querySelector("#addUser");
const screenErroDiv = document.querySelector("#screenErro");
const paragraphElement = screenErroDiv.querySelector("p");
const btnRemoveList = document.querySelector("#removeList");
const tbody = document.querySelector("tbody");

// Array para armazenar os usuários
let listUsers = [];

// Função para criar uma linha na tabela com um botão "Remover"
function createTableRow(user) {
  const row = document.createElement("tr");
  row.id = `user-${user.login}`;

  row.innerHTML = `
    <td id="user">
      <img src="https://github.com/${user.login}.png" alt="Foto do usuário no GitHub" />
      <div>
        <h2>${user.name}</h2>
        <p>/${user.login}</p>
      </div>
    </td>
    <td>${user.public_repos}</td>
    <td>${user.followers}</td>
    <td><button class="remove-button">Remover</button></td>
  `;

  // Adiciona um evento de clique ao botão "Remover" da linha
  const removeButton = row.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    removeUser(user);
  });

  return row;
}

// Função para remover um usuário da tabela e da lista
function removeUser(user) {
  // Remove o usuário da lista
  listUsers = listUsers.filter((u) => u.login !== user.login);

  // Remove o usuário da tabela
  const rowToRemove = document.querySelector(`#user-${user.login}`);
  if (rowToRemove) {
    rowToRemove.remove();
  }
}

// Função para adicionar um usuário à lista e à tabela
function addUserToList(user) {
  listUsers.push(user);
  const row = createTableRow(user);
  tbody.appendChild(row);
}

// Função para limpar a tabela e redefinir a lista de usuários
function resetTableAndList() {
  tbody.innerHTML = "";
  listUsers = [];
}

// Função para lidar com erros e exibir uma mensagem de erro
function showError(message) {
  paragraphElement.textContent = message;
  screenErroDiv.classList.add("open");
}

// Função para buscar um usuário no GitHub
async function fetchUser(username) {
  const endpoint = `https://api.github.com/users/${username}`;
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Erro ao fazer a requisição");
    }

    const data = await response.json();
    const userObj = {
      login: data.login,
      name: data.name,
      public_repos: data.public_repos,
      followers: data.followers,
    };

    if (listUsers.some((listValue) => listValue.login === userObj.login)) {
      showError("Não é permitido adicionar dois usuários iguais!");
    } else {
      screenErroDiv.classList.remove("open");
      addUserToList(userObj);
    }
  } catch (error) {
    console.error(error);
    showError("Não foi possivel encontrar esse usuário no GitHub");
  }
}

// Evento de clique no botão "Adicionar"
function handleAddClick() {
  if (inputValue.value === "") {
    showError("O campo de input está vazio. Digite um nome de usuário do GitHub.");
    return; // Impede que a função continue se o input estiver vazio
  }
  fetchUser(inputValue.value);
}

addButton.addEventListener("click", handleAddClick);

// Evento de clique no botão "Remover Lista"
function handleRemoveListClick() {
  resetTableAndList();
}

btnRemoveList.addEventListener("click", handleRemoveListClick);

