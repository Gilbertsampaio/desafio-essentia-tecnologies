# Aplicação de Gerenciamento de Tarefas (Full-Stack)

Este projeto consiste em uma aplicação web completa para gerenciamento de tarefas, com um backend desenvolvido em Node.js (Express e TypeScript) e um frontend em Angular. Ele permite aos usuários criar, visualizar, atualizar e excluir tarefas de forma intuitiva.

## Visão Geral do Projeto
A aplicação é dividida em dois módulos principais:

- **Backend (backend/):** Uma API RESTful que gerencia a lógica de negócios e a persistência de dados no MySQL.
- **Frontend (frontend/):** Uma interface de usuário interativa construída com Angular para interagir com a API do backend.

## Requisitos do Sistema
Para executar este projeto, você precisará ter instalado:

- Node.js (versão LTS recomendada) e NPM (gerenciador de pacotes do Node.js).
- Angular CLI (versão global).
- Git (para controle de versão).
- MySQL Server (para o banco de dados do backend).
- MongoDB (instalado conforme requisito inicial, mas não utilizado na aplicação de tarefas principal).

---

## 1. Backend (API RESTful)
Este módulo é responsável pela lógica de negócio e comunicação com o banco de dados.

### Tecnologias Utilizadas (Backend)
- Node.js
- Express
- TypeScript
- MySQL
- mysql2/promise
- cors
- ts-node-dev

### Configuração do Banco de Dados (MySQL)
1. Instale o MySQL e certifique-se de que o servidor está em execução.
2. Crie o banco de dados executando:

```sql
CREATE DATABASE techx_tasks;
USE techx_tasks;
```

3. Crie a tabela `tasks`:

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Credenciais:** Atualize `backend/src/db.ts` com as credenciais do seu ambiente (usuário, senha, host, porto).

### Instalação e Execução (Backend)
```bash
cd backend
npm install
npm start
```

O servidor estará rodando em `http://localhost:3000`.

### Endpoints da API (Backend)
Base: `http://localhost:3000/api/tasks`

- `POST /api/tasks`  
  Cria uma nova tarefa.  
  Corpo JSON: `{ "title": "Título da Tarefa", "description": "Descrição detalhada (opcional)" }`  
  Resposta: `201 Created` com a tarefa criada.

- `GET /api/tasks`  
  Lista todas as tarefas.  
  Resposta: `200 OK` com um array de tarefas.

- `PUT /api/tasks/:id`  
  Atualiza uma tarefa pelo ID.  
  Corpo JSON: `{ "title": "Novo Título (opcional)", "description": "Nova Descrição (opcional)", "completed": true }`  
  Resposta: `200 OK` com mensagem de sucesso.

- `DELETE /api/tasks/:id`  
  Exclui uma tarefa pelo ID.  
  Resposta: `200 OK` com mensagem de sucesso.

---

## 2. Frontend (Aplicação Angular)
Este módulo fornece a interface de usuário para interagir com a API do backend.

### Tecnologias Utilizadas (Frontend)
- Angular (Componentes autônomos)
- TypeScript
- Angular CLI
- Tailwind CSS
- HttpClient

> **Pré-requisito:** Backend rodando em `http://localhost:3000`.

### Instalação e Execução (Frontend)
```bash
cd frontend
npm install
ng serve --open
```

O app geralmente abrirá em `http://localhost:4200`.

### Funcionalidades (Frontend)
- Visualizar tarefas (ordenadas por data de criação, mais recente primeiro).
- Adicionar tarefa (título e descrição).
- Editar tarefa.
- Marcar como concluída.
- Excluir tarefa.

---

## 🔑 Endpoints da API

### Autenticação

-   `POST /api/auth/register` → Registrar usuário\
-   `POST /api/auth/login` → Login e retorno de JWT

### Tarefas (rotas protegidas com JWT)

-   `POST /api/tasks` → Criar nova tarefa\
-   `GET /api/tasks` → Listar tarefas\
-   `PUT /api/tasks/:id` → Atualizar tarefa\
-   `DELETE /api/tasks/:id` → Excluir tarefa

---

## 🖥️ Funcionalidades Frontend

✅ Autenticação (Login / Registro)\
✅ Proteção de rotas via **AuthGuard**\
✅ CRUD de Tarefas (Adicionar, Listar, Editar, Excluir)\
✅ Marcar tarefas como concluídas

---

### Estrutura do Projeto (Frontend)
- `src/app/app.component.ts` — componente raiz que hospeda o TaskListComponent.
- `src/app/services/task.service.ts` — serviço responsável pela comunicação com a API.
- `src/app/components/task-list/task-list.component.ts` — exibe lista de tarefas e gerencia CRUD.
- `src/app/app.config.ts` — configuração global (HttpClient, Forms, etc.).
- `tailwind.config.js` — configuração do Tailwind CSS.
- `postcss.config.js` — configuração do PostCSS.
- `src/styles.scss` — estilos globais (Tailwind).

---

## 3. Considerações sobre MongoDB
O MongoDB foi incluído nos requisitos de ambiente por demonstração e para possíveis expansões futuras. Atualmente, a persistência principal da aplicação é feita em MySQL.

---

## Desafio Extra: Backend com MongoDB
Este projeto foi expandido com um desafio extra para demonstrar a flexibilidade do backend em utilizar diferentes bancos de dados. Foi implementada uma versão alternativa do backend onde a persistência das tarefas é gerenciada pelo MongoDB, utilizando o Mongoose ODM (Object Data Modeling).

### Tecnologias Adicionais Utilizadas (Backend com MongoDB)
- **MongoDB:** Banco de dados NoSQL baseado em documentos.
- **Mongoose:** Biblioteca para modelagem de dados de objetos para MongoDB no Node.js.

### Configuração e Execução (Backend com MongoDB)
1. Certifique-se de que o **MongoDB Server** está rodando em sua máquina (porta padrão `27017`).
2. O banco de dados será criado automaticamente como `techx_tasks_mongo` quando a aplicação for iniciada e os dados forem inseridos.
3. Navegue até o diretório backend:

```bash
cd backend
```

4. Instale as dependências adicionais:

```bash
npm install mongoose @types/mongoose
```

5. Altere a implementação do banco de dados:
   - O arquivo `backend/src/app.ts` foi modificado para usar operações do **Mongoose** em vez do **mysql2**.
   - Foram criados os arquivos:
     - `backend/src/mongodb.ts` (conexão com o MongoDB)
     - `backend/src/task.model.ts` (Schema/Modelo da Tarefa no Mongoose).

6. Inicie o servidor:

```bash
npm start
```

7. O servidor estará rodando em `http://localhost:3000`. Você verá a mensagem **"Conectado ao banco de dados MongoDB!"**.

> **Observação:** O frontend Angular **não requer modificações**, pois a API RESTful (`http://localhost:3000/api/tasks`) mantém os mesmos endpoints e formato de resposta, garantindo compatibilidade. As tarefas serão agora persistidas no MongoDB em vez do MySQL.

---

## Observações Finais
- Ajuste as variáveis de ambiente e credenciais conforme seu ambiente local.
- Este README descreve a arquitetura e instruções básicas. Para um ambiente de produção, considere configurações adicionais (variáveis de ambiente, conexões seguras, dockerização, backups, etc.).

---

**Desenvolvido por:** Gilbert Sampaio