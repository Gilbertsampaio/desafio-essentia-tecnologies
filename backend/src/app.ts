import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor está rodando!');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});