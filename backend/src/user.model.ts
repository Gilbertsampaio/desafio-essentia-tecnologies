import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Defina a interface para as PROPRIEDADES do documento do Usu�rio
// Esta interface descreve a estrutura dos dados que ser�o salvos no DB.
export interface IUser {
  username: string;
  password: string; // Senha j� hashed
  createdAt: Date;
}

// 2. Defina a interface para os M�TODOS de inst�ncia (seus m�todos customizados)
// Este � o m�todo que adicionamos para comparar senhas.
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 3. Crie um tipo combinado para o documento Mongoose (inst�ncias)
// HydratedDocument<IUser, IUserMethods> indica que a inst�ncia do documento
// ter� as propriedades de IUser e os m�todos de IUserMethods.
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// 4. Crie um tipo para o Modelo est�tico do Mongoose
// Este tipo � para o pr�prio 'User' (o objeto que voc� usa para fazer User.find(), User.create(), etc.)
export type UserModelType = Model<IUser, {}, IUserMethods>;

// 5. Defina o Schema do Mongoose, usando as interfaces para tipagem
const UserSchema: Schema<IUser, UserModelType, IUserMethods> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Garante que o username seja �nico
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Senhas devem ter no m�nimo 6 caracteres
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 6. Middleware para fazer hash da senha antes de salvar
// 'this' aqui � o documento Mongoose que est� sendo salvo.
// Explicitamente tipamos 'this' como 'UserDocument' para o TypeScript.
UserSchema.pre('save', async function (next) {
  const user = this as UserDocument; // Tipagem expl�cita para 'this'

  // Apenas fa�a hash se a senha foi modificada (ou � nova)
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Gera um salt com custo de 10
    user.password = await bcrypt.hash(user.password, salt); // Faz o hash da senha
    next();
  } catch (err: any) {
    next(err);
  }
});

// 7. M�todo para comparar a senha fornecida com a senha hashed
// 'this' aqui � o documento do usu�rio que tem a senha hashed
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument; // Tipagem expl�cita para 'this'
  return bcrypt.compare(candidatePassword, user.password);
};

// 8. Exporte o Modelo Mongoose
// O Mongoose usar� o nome 'User' (no singular) para criar uma cole��o no plural ('users') no seu banco de dados MongoDB.
export default mongoose.model<IUser, UserModelType>('User', UserSchema);