import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/techx_tasks_mongo';

const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao banco de dados MongoDB!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectToMongoDB;