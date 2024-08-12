// utils/users.ts
import { User } from '../types/user';

let users: User[] = [
  { username: 'galvarez', password: 'Ga43133995', name: 'Gastón Álvarez', isAdmin: true },
  { username: 'egaray', password: 'password456', name: 'Evelin Garay', isAdmin: true },
  { username: 'Ttulatraes', password: 'Tula.995', name: 'Carrizo Tula', isAdmin: true },
];

// Mapa para almacenar la relación entre tokens y usuarios
const tokenToUser: Map<string, User> = new Map();

export const getUsers = (): User[] => users;

export const addUser = (newUser: User): void => {
  users.push(newUser);
};

export const findUser = (username: string, password: string): User | undefined => {
  return users.find(u => u.username === username && u.password === password);
};

export const findUserByToken = (token: string): User | undefined => {
  return tokenToUser.get(token);
};

export const setUserToken = (user: User, token: string): void => {
  tokenToUser.set(token, user);
};

export const removeUserToken = (token: string): void => {
  tokenToUser.delete(token);
};

// Función para generar un token simple (en producción, usa una biblioteca más segura)
export const generateToken = (): string => {
  return Math.random().toString(36).substr(2);
};