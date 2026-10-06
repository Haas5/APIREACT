# Consumo de API GraphQL

## Identificação

Nome: [SEU NOME]  
Turma: 3ª série B  
Disciplina: Desenvolvimento de Sistemas

## Objetivo

Demonstrar o consumo de uma API GraphQL somente leitura, exibindo alunos, cursos e professores com seus relacionamentos. O projeto inclui carregamento, tratamento de erros e uma interface responsiva. Não utiliza mutations.

## Tecnologias

- HTML para estruturar a página.
- CSS para organizar e adaptar os cards ao tamanho da tela.
- JavaScript puro para consultar a API e renderizar os dados.
- Fetch API nativa com async/await, sem bibliotecas, frameworks ou instalação de dependências.

## O que é GraphQL?

GraphQL é uma linguagem de consulta para APIs. O cliente especifica os campos que deseja receber, incluindo relacionamentos aninhados. Neste projeto, uma query solicita alunos e o curso de cada aluno, por exemplo. As consultas leem dados; mutations seriam operações de alteração e não são utilizadas aqui.

## Endpoint e requisição

Endpoint: `https://testing-graphql.onrender.com/graphql`

Todas as consultas utilizam `POST`, o header `Content-Type: application/json` e um corpo criado com `JSON.stringify({ query })`. A função `executarGraphQL` verifica `resposta.ok`, converte a resposta com `resposta.json()`, verifica `resultado.errors` e retorna `resultado.data`.

Cada função de carregamento usa `try/catch/finally`: mostra `Carregando...`, renderiza os resultados ou apresenta um erro amigável e libera o botão para uma nova tentativa. Detalhes dos erros são registrados no console. Erros GraphQL podem existir mesmo quando o HTTP retorna 200.

## Como executar

1. Abra esta pasta no Visual Studio Code.
2. Com a extensão Live Server instalada, clique com o botão direito em `index.html` e selecione **Open with Live Server**.
3. Aguarde o carregamento das três seções no navegador.

Também é possível abrir `index.html` diretamente no navegador, desde que a política de CORS da API permita essa origem. Prefira Live Server. É necessário acesso à internet e disponibilidade da API; os dados não são locais. Se houver erro, confira o console e tente novamente pelo botão da seção. CORS é controlado pelo servidor da API.

## Consultas implementadas

### 1. Alunos

```graphql
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
```

Exibe nome, e-mail e nome do curso. Quando `course` é nulo, mostra **Sem curso associado**.

### 2. Cursos

```graphql
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
```

Exibe nome do curso, créditos e nomes dos alunos. Sem alunos, mostra **Nenhum aluno neste curso.**

### 3. Professores

```graphql
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
```

Exibe nome do professor e seus cursos/matérias. Sem cursos, mostra **Nenhum curso associado a este professor.** As três seções também tratam listas principais vazias.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura das seções Alunos, Cursos e Professores |
| `style.css` | Cores, tipografia, cards e layout responsivo |
| `script.js` | Queries, requisições, renderização e tratamento de estados |
| `README.md` | Identificação, explicação e instruções do trabalho |

## Como testar e apresentar

1. Abra a página e confirme os campos descritos acima nas três seções.
2. Pressione F12 e abra **Network / Rede**. Recarregue a página e filtre por `graphql`: devem aparecer três requisições POST (o navegador também pode fazer requisições OPTIONS de CORS).
3. Confira em cada POST o header `Content-Type: application/json`, o payload com `query` e a resposta com `data.students`, `data.courses` ou `data.teachers`. Compare os dados com os cards exibidos.
4. Ative uma conexão lenta nas ferramentas de desenvolvimento e clique em Atualizar para observar **Carregando...**.
5. Selecione **Offline** em Network e atualize cada seção para verificar a mensagem amigável e os detalhes no Console. Volte a **No throttling / Sem limitação** e atualize novamente.
6. Para simular um erro GraphQL, altere temporariamente `email` para `campoInexistente` na query de alunos em `script.js`, salve e recarregue a página. A seção Alunos deve mostrar erro, e o console deve registrar os detalhes. Restaure `email` e salve antes de entregar.
7. Reduza a largura da janela ou use a simulação de celular para conferir a leitura dos cards.

Antes de entregar, substitua `[SEU NOME]` na seção Identificação pelo seu nome. Mantenha os quatro arquivos juntos.
