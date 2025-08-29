import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Defina a interface para as PROPRIEDADES do documento do Usuário
// Esta interface descreve a estrutura dos dados que serão salvos no DB.
export interface IUser {
  username: string;
  password: string; // Senha já hashed
  createdAt: Date;
}

// 2. Defina a interface para os MÉTODOS de instância (seus métodos customizados)
// Este é o método que adicionamos para comparar senhas.
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 3. Crie um tipo combinado para o documento Mongoose (instâncias)
// HydratedDocument<IUser, IUserMethods> indica que a instância do documento
// terá as propriedades de IUser e os métodos de IUserMethods.
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// 4. Crie um tipo para o Modelo estático do Mongoose
// Este tipo é para o próprio 'User' (o objeto que você usa para fazer User.find(), User.create(), etc.)
export type UserModelType = Model<IUser, {}, IUserMethods>;

// 5. Defina o Schema do Mongoose, usando as interfaces para tipagem
const UserSchema: Schema<IUser, UserModelType, IUserMethods> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Garante que o username seja único
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Senhas devem ter no mínimo 6 caracteres
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 6. Middleware para fazer hash da senha antes de salvar
// 'this' aqui é o documento Mongoose que está sendo salvo.
// Explicitamente tipamos 'this' como 'UserDocument' para o TypeScript.
UserSchema.pre('save', async function (next) {
  const user = this as UserDocument; // Tipagem explícita para 'this'

  // Apenas faça hash se a senha foi modificada (ou é nova)
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Gera um salt com custo de 10
    user.password = await bcrypt.hash(user.password, salt); // Faz o hash da senha
    next();
  } catch (err: any) {
    next(err);
  }
});

// 7. Método para comparar a senha fornecida com a senha hashed
// 'this' aqui é o documento do usuário que tem a senha hashed
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument; // Tipagem explícita para 'this'
  return bcrypt.compare(candidatePassword, user.password);
};

// 8. Exporte o Modelo Mongoose
// O Mongoose usará o nome 'User' (no singular) para criar uma coleção no plural ('users') no seu banco de dados MongoDB.
export default mongoose.model<IUser, UserModelType>('User', UserSchema);