import express, { Request, Response } from 'express';
// Importa o pool de conexões do banco de dados (corrigido: pool, não connectToDatabase)
import pool, { connectToDatabase } from './db'; 

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para processar JSON

// Rota de teste inicial
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor está rodando!');
});

// --- Rotas da API para Tarefas (CRUD) ---

// 1. Criar uma nova tarefa
app.post('/api/tasks', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    // Retorna a tarefa criada com um ID gerado pelo banco e status inicial
    res.status(201).json({ id: (result as any).insertId, title, description, completed: false, created_at: new Date() });
  } catch (error) {
    console.error('Erro ao criar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar a tarefa.' });
  }
});

// 2. Listar todas as tarefas
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC'); // Ordena por data de criação
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar as tarefas:', error);
    res.status(500).json({ error: 'Erro ao listar as tarefas.' });
  }
});

// 3. Atualizar uma tarefa
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Verifica se pelo menos um campo para atualização foi fornecido
  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ error: 'Nenhum campo para atualização fornecido.' });
  }

  // Constrói a query de forma dinâmica para permitir atualizações parciais
  const fields: string[] = [];
  const values: any[] = [];

  if (title !== undefined) {
    fields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (completed !== undefined) {
    fields.push('completed = ?');
    values.push(completed);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido para atualização fornecido.' });
  }

  values.push(id); // Adiciona o ID para a cláusula WHERE

  try {
    const [result] = await pool.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
  }
});

// 4. Deletar uma tarefa
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar a tarefa.' });
  }
});

// Inicia o servidor e se conecta ao banco de dados
const startServer = async () => {
  await connectToDatabase(); // Tenta conectar ao banco de dados

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
};

startServer();