import mongoose, { Document, Schema } from 'mongoose';

// 1. Defina a interface para o documento da Tarefa
// Isso ajuda a garantir a tipagem correta no TypeScript
export interface ITask extends Document {
  title: string;
  description?: string; // Opcional
  completed: boolean;
  createdAt: Date; // Usaremos 'createdAt' para consistência com Mongoose/MongoDB
}

// 2. Defina o Schema do Mongoose
const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false }, // ou simplesmente 'String'
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// 3. Exporte o Modelo Mongoose
// O Mongoose criará automaticamente uma coleção chamada 'tasks' no MongoDB
export default mongoose.model<ITask>('Task', TaskSchema);