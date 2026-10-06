const GRAPHQL_ENDPOINT = "https://testing-graphql.onrender.com/graphql";

const QUERY_ALUNOS = `
  query {
    students {
      id
      name
      email
      course {
        id
        name
        credits
      }
    }
  }
`;

const QUERY_CURSOS = `
  query {
    courses {
      id
      name
      credits
      students {
        id
        name
      }
    }
  }
`;

const QUERY_PROFESSORES = `
  query {
    teachers {
      id
      name
      courses {
        id
        name
      }
    }
  }
`;

async function executarGraphQL(query) {
  const resposta = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}: ${resposta.statusText}`);
  }

  const resultado = await resposta.json();

  // GraphQL pode retornar errors mesmo com status HTTP 200.
  if (resultado.errors?.length) {
    console.error("Erros retornados pelo GraphQL:", resultado.errors);
    throw new Error(resultado.errors.map((erro) => erro.message).join("; "));
  }
  if (!resultado.data) {
    throw new Error("A resposta não contém resultado.data.");
  }
  return resultado.data;
}

function mostrarMensagem(container, texto, erro = false) {
  const mensagem = document.createElement("p");
  mensagem.className = erro ? "mensagem erro" : "mensagem";
  mensagem.textContent = texto;
  container.replaceChildren(mensagem);
}

// textContent exibe os dados como texto, sem interpretar HTML da API.
function criarCard(nome) {
  const card = document.createElement("article");
  card.className = "card";
  const titulo = document.createElement("h3");
  titulo.textContent = nome ?? "Nome não informado";
  card.append(titulo);
  return card;
}

function adicionarCampo(card, rotulo, valor) {
  const paragrafo = document.createElement("p");
  const destaque = document.createElement("strong");
  destaque.textContent = `${rotulo}: `;
  paragrafo.append(destaque, document.createTextNode(String(valor)));
  card.append(paragrafo);
}

function adicionarLista(card, itens, mensagemVazia) {
  if (!itens?.length) {
    const mensagem = document.createElement("p");
    mensagem.textContent = mensagemVazia;
    card.append(mensagem);
    return;
  }
  const lista = document.createElement("ul");
  for (const item of itens) {
    const elemento = document.createElement("li");
    elemento.textContent = item.name ?? "Nome não informado";
    lista.append(elemento);
  }
  card.append(lista);
}

async function carregarAlunos() {
  const container = document.getElementById("alunos");
  const botao = document.getElementById("atualizar-alunos");
  botao.disabled = true;
  container.setAttribute("aria-busy", "true");
  mostrarMensagem(container, "Carregando...");
  try {
    const dados = await executarGraphQL(QUERY_ALUNOS);
    if (!Array.isArray(dados.students)) throw new Error("Lista students inválida.");
    container.replaceChildren();
    for (const aluno of dados.students) {
      const card = criarCard(aluno.name);
      adicionarCampo(card, "E-mail", aluno.email ?? "Não informado");
      adicionarCampo(card, "Curso", aluno.course?.name ?? "Sem curso associado");
      container.append(card);
    }
    if (!dados.students.length) mostrarMensagem(container, "Nenhum aluno encontrado.");
  } catch (erro) {
    console.error("Falha ao carregar alunos:", erro);
    mostrarMensagem(container, "Não foi possível carregar os alunos. Verifique sua conexão e clique em Atualizar alunos para tentar novamente.", true);
  } finally {
    botao.disabled = false;
    container.setAttribute("aria-busy", "false");
  }
}

async function carregarCursos() {
  const container = document.getElementById("cursos");
  const botao = document.getElementById("atualizar-cursos");
  botao.disabled = true;
  container.setAttribute("aria-busy", "true");
  mostrarMensagem(container, "Carregando...");
  try {
    const dados = await executarGraphQL(QUERY_CURSOS);
    if (!Array.isArray(dados.courses)) throw new Error("Lista courses inválida.");
    container.replaceChildren();
    for (const curso of dados.courses) {
      const card = criarCard(curso.name);
      adicionarCampo(card, "Créditos", curso.credits ?? "Não informado");
      adicionarCampo(card, "Alunos", "");
      adicionarLista(card, curso.students, "Nenhum aluno neste curso.");
      container.append(card);
    }
    if (!dados.courses.length) mostrarMensagem(container, "Nenhum curso encontrado.");
  } catch (erro) {
    console.error("Falha ao carregar cursos:", erro);
    mostrarMensagem(container, "Não foi possível carregar os cursos. Verifique sua conexão e clique em Atualizar cursos para tentar novamente.", true);
  } finally {
    botao.disabled = false;
    container.setAttribute("aria-busy", "false");
  }
}

async function carregarProfessores() {
  const container = document.getElementById("professores");
  const botao = document.getElementById("atualizar-professores");
  botao.disabled = true;
  container.setAttribute("aria-busy", "true");
  mostrarMensagem(container, "Carregando...");
  try {
    const dados = await executarGraphQL(QUERY_PROFESSORES);
    if (!Array.isArray(dados.teachers)) throw new Error("Lista teachers inválida.");
    container.replaceChildren();
    for (const professor of dados.teachers) {
      const card = criarCard(professor.name);
      adicionarCampo(card, "Cursos / matérias", "");
      adicionarLista(card, professor.courses, "Nenhum curso associado a este professor.");
      container.append(card);
    }
    if (!dados.teachers.length) mostrarMensagem(container, "Nenhum professor encontrado.");
  } catch (erro) {
    console.error("Falha ao carregar professores:", erro);
    mostrarMensagem(container, "Não foi possível carregar os professores. Verifique sua conexão e clique em Atualizar professores para tentar novamente.", true);
  } finally {
    botao.disabled = false;
    container.setAttribute("aria-busy", "false");
  }
}

document.getElementById("atualizar-alunos").addEventListener("click", carregarAlunos);
document.getElementById("atualizar-cursos").addEventListener("click", carregarCursos);
document.getElementById("atualizar-professores").addEventListener("click", carregarProfessores);

// Cada seção carrega de forma independente das outras.
carregarAlunos();
carregarCursos();
carregarProfessores();
