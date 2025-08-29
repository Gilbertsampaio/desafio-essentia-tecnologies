import express, { Request, Response } from 'express';
import { connectToDatabase } from './db'; // Importa a função de conexão

const app = express();
const port = 3000;

app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor está rodando!');
});

// Inicia o servidor e se conecta ao banco de dados
const startServer = async () => {
  await connectToDatabase(); // Tenta conectar ao banco de dados

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
};

startServer();