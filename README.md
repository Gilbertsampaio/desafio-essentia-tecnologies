# Aplica??o de Gerenciamento de Tarefas (Full-Stack)

Este projeto consiste em uma aplica??o web completa para gerenciamento de tarefas, com um backend desenvolvido em Node.js (Express e TypeScript) e um frontend em Angular. Ele permite aos usu?rios criar, visualizar, atualizar e excluir tarefas de forma intuitiva.

## Vis?o Geral do Projeto
A aplica??o ? dividida em dois m?dulos principais:

- **Backend (backend/):** Uma API RESTful que gerencia a l?gica de neg?cios e a persist?ncia de dados no MySQL.
- **Frontend (frontend/):** Uma interface de usu?rio interativa constru?da com Angular para interagir com a API do backend.

## Requisitos do Sistema
Para executar este projeto, voc? precisar? ter instalado:

- Node.js (vers?o LTS recomendada) e NPM (gerenciador de pacotes do Node.js).
- Angular CLI (vers?o global).
- Git (para controle de vers?o).
- MySQL Server (para o banco de dados do backend).
- MongoDB (instalado conforme requisito inicial, mas n?o utilizado na aplica??o de tarefas principal).

---

## 1. Backend (API RESTful)
Este m?dulo ? respons?vel pela l?gica de neg?cio e comunica??o com o banco de dados.

### Tecnologias Utilizadas (Backend)
- Node.js
- Express
- TypeScript
- MySQL
- mysql2/promise
- cors
- ts-node-dev

### Configura??o do Banco de Dados (MySQL)
1. Instale o MySQL e certifique-se de que o servidor est? em execu??o.
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

> **Credenciais:** Atualize `backend/src/db.ts` com as credenciais do seu ambiente (usu?rio, senha, host, porto).

### Instala??o e Execu??o (Backend)
```bash
cd backend
npm install
npm start
```

O servidor estar? rodando em `http://localhost:3000`.

### Endpoints da API (Backend)
Base: `http://localhost:3000/api/tasks`

- `POST /api/tasks`  
  Cria uma nova tarefa.  
  Corpo JSON: `{ "title": "T?tulo da Tarefa", "description": "Descri??o detalhada (opcional)" }`  
  Resposta: `201 Created` com a tarefa criada.

- `GET /api/tasks`  
  Lista todas as tarefas.  
  Resposta: `200 OK` com um array de tarefas.

- `PUT /api/tasks/:id`  
  Atualiza uma tarefa pelo ID.  
  Corpo JSON: `{ "title": "Novo T?tulo (opcional)", "description": "Nova Descri??o (opcional)", "completed": true }`  
  Resposta: `200 OK` com mensagem de sucesso.

- `DELETE /api/tasks/:id`  
  Exclui uma tarefa pelo ID.  
  Resposta: `200 OK` com mensagem de sucesso.

---

## 2. Frontend (Aplica??o Angular)
Este m?dulo fornece a interface de usu?rio para interagir com a API do backend.

### Tecnologias Utilizadas (Frontend)
- Angular (Componentes aut?nomos)
- TypeScript
- Angular CLI
- Tailwind CSS
- HttpClient

> **Pr?-requisito:** Backend rodando em `http://localhost:3000`.

### Instala??o e Execu??o (Frontend)
```bash
cd frontend
npm install
ng serve --open
```

O app geralmente abrir? em `http://localhost:4200`.

### Funcionalidades (Frontend)
- Visualizar tarefas (ordenadas por data de cria??o, mais recente primeiro).
- Adicionar tarefa (t?tulo e descri??o).
- Editar tarefa.
- Marcar como conclu?da.
- Excluir tarefa.

---

## ?? Endpoints da API

### Autentica??o

-   `POST /api/auth/register` ? Registrar usu?rio\
-   `POST /api/auth/login` ? Login e retorno de JWT

### Tarefas (rotas protegidas com JWT)

-   `POST /api/tasks` ? Criar nova tarefa\
-   `GET /api/tasks` ? Listar tarefas\
-   `PUT /api/tasks/:id` ? Atualizar tarefa\
-   `DELETE /api/tasks/:id` ? Excluir tarefa

---

## ??? Funcionalidades Frontend

? Autentica??o (Login / Registro)\
? Prote??o de rotas via **AuthGuard**\
? CRUD de Tarefas (Adicionar, Listar, Editar, Excluir)\
? Marcar tarefas como conclu?das

---

### Estrutura do Projeto (Frontend)
- `src/app/app.component.ts` ? componente raiz que hospeda o TaskListComponent.
- `src/app/services/task.service.ts` ? servi?o respons?vel pela comunica??o com a API.
- `src/app/components/task-list/task-list.component.ts` ? exibe lista de tarefas e gerencia CRUD.
- `src/app/app.config.ts` ? configura??o global (HttpClient, Forms, etc.).
- `tailwind.config.js` ? configura??o do Tailwind CSS.
- `postcss.config.js` ? configura??o do PostCSS.
- `src/styles.scss` ? estilos globais (Tailwind).

---

## 3. Considera??es sobre MongoDB
O MongoDB foi inclu?do nos requisitos de ambiente por demonstra??o e para poss?veis expans?es futuras. Atualmente, a persist?ncia principal da aplica??o ? feita em MySQL.

---

## Desafio Extra: Backend com MongoDB
Este projeto foi expandido com um desafio extra para demonstrar a flexibilidade do backend em utilizar diferentes bancos de dados. Foi implementada uma vers?o alternativa do backend onde a persist?ncia das tarefas ? gerenciada pelo MongoDB, utilizando o Mongoose ODM (Object Data Modeling).

### Tecnologias Adicionais Utilizadas (Backend com MongoDB)
- **MongoDB:** Banco de dados NoSQL baseado em documentos.
- **Mongoose:** Biblioteca para modelagem de dados de objetos para MongoDB no Node.js.

### Configura??o e Execu??o (Backend com MongoDB)
1. Certifique-se de que o **MongoDB Server** est? rodando em sua m?quina (porta padr?o `27017`).
2. O banco de dados ser? criado automaticamente como `techx_tasks_mongo` quando a aplica??o for iniciada e os dados forem inseridos.
3. Navegue at? o diret?rio backend:

```bash
cd backend
```

4. Instale as depend?ncias adicionais:

```bash
npm install mongoose @types/mongoose
```

5. Altere a implementa??o do banco de dados:
   - O arquivo `backend/src/app.ts` foi modificado para usar opera??es do **Mongoose** em vez do **mysql2**.
   - Foram criados os arquivos:
     - `backend/src/mongodb.ts` (conex?o com o MongoDB)
     - `backend/src/task.model.ts` (Schema/Modelo da Tarefa no Mongoose).

6. Inicie o servidor:

```bash
npm start
```

7. O servidor estar? rodando em `http://localhost:3000`. Voc? ver? a mensagem **"Conectado ao banco de dados MongoDB!"**.

> **Observa??o:** O frontend Angular **n?o requer modifica??es**, pois a API RESTful (`http://localhost:3000/api/tasks`) mant?m os mesmos endpoints e formato de resposta, garantindo compatibilidade. As tarefas ser?o agora persistidas no MongoDB em vez do MySQL.

---

## Observa??es Finais
- Ajuste as vari?veis de ambiente e credenciais conforme seu ambiente local.
- Este README descreve a arquitetura e instru??es b?sicas. Para um ambiente de produ??o, considere configura??es adicionais (vari?veis de ambiente, conex?es seguras, dockeriza??o, backups, etc.).

---

**Desenvolvido por:** Gilbert Sampaio