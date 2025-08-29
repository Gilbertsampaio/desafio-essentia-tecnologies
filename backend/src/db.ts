import mysql from 'mysql2/promise';

// Configurações do banco de dados (substitua com suas credenciais)
const dbConfig = {
  host: 'localhost',
  user: 'root', // Ou o usuário que você criou
  password: '1611@sampaioGGG',
  database: 'techx_tasks', // Vamos criar este banco de dados
};

const pool = mysql.createPool(dbConfig);

export async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado ao banco de dados MySQL!');
    connection.release(); // Libera a conexão de volta para o pool
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

export default pool;