import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectToMongoDB from './mongodb';
import Task, { ITask } from './task.model';
import User, { UserDocument } from './user.model';

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Use o middleware CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor está rodando (com MongoDB e JWT)!');
});

// --- MIDDLEWARE DE AUTENTICAÇÃO JWT ---
// Estender o objeto Request para incluir user (opcional, mas boa prática)
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string };
    }
  }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Espera formato 'Bearer TOKEN'

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Token inválido ou expirado
      }
      req.user = user as { id: string; username: string }; // Anexa os dados do usuário ao objeto Request
      next();
    });
  } else {
    res.sendStatus(401); // Nenhuma autorização fornecida
  }
};

// --- ROTAS DE AUTENTICAÇÃO ---

// 1. Registro de Usuário
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Nome de usuário já existe.' });
    }

    const newUser: UserDocument = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao registrar usuário.' });
  }
});

// 2. Login de Usuário
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao fazer login.' });
  }
});


// --- Rotas da API para Tarefas (CRUD com MongoDB) ---
// Agora, estas rotas serão PROTEGIDAS pelo middleware JWT
// Para testar, você precisará enviar um token JWT válido no cabeçalho Authorization

// 1. Criar uma nova tarefa (PROTEGIDA)
app.post('/api/tasks', authenticateJWT, async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }
  try {
    const newTask = new Task({
      title,
      description: description || undefined,
      completed: false,
      createdAt: new Date()
    });
    const savedTask = await newTask.save();
    res.status(201).json({
      id: savedTask._id,
      title: savedTask.title,
      description: savedTask.description,
      completed: savedTask.completed,
      created_at: savedTask.createdAt
    });
  } catch (error) {
    console.error('Erro ao criar a tarefa (MongoDB):', error);
    res.status(500).json({ error: 'Erro ao criar a tarefa.' });
  }
});

// 2. Listar todas as tarefas (PROTEGIDA)
app.get('/api/tasks', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    const mappedTasks = tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      created_at: task.createdAt
    }));
    res.json(mappedTasks);
  } catch (error) {
    console.error('Erro ao listar as tarefas (MongoDB):', error);
    res.status(500).json({ error: 'Erro ao listar as tarefas.' });
  }
});

// 3. Atualizar uma tarefa (PROTEGIDA)
app.put('/api/tasks/:id', authenticateJWT, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ error: 'Nenhum campo para atualização fornecido.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { title, description, completed } },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar a tarefa (MongoDB):', error);
    res.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
  }
});

// 4. Deletar uma tarefa (PROTEGIDA)
app.delete('/api/tasks/:id', authenticateJWT, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json({ message: 'Tarefa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar a tarefa (MongoDB):', error);
    res.status(500).json({ error: 'Erro ao deletar a tarefa.' });
  }
});

// Inicia o servidor e se conecta ao MongoDB
const startServer = async () => {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
};

startServer();
