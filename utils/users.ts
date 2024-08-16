import { User } from '../types/user';

let users: User[] = [
  { username: 'galvarez', password: 'Ga43133995', name: 'Gastón Álvarez', isAdmin: true },
  { username: 'egaray', password: 'password456', name: 'Evelin Garay', isAdmin: true },
  { username: 'Ttulatraes', password: 'Tula.995', name: 'Carrizo Tula', isAdmin: true },
  { username: 'ffalco', password: 'franco123', name: 'Franco Gabriel Álvarez Falco', isAdmin: false },
  { username: 'karanda', password: 'karen123', name: 'Karen Tamara Aranda', isAdmin: false },
  { username: 'jbritos', password: 'jeremias123', name: 'Jeremias Ariel Britos Flores', isAdmin: false },
  { username: 'lbrocal', password: 'lautaro123', name: 'Lautaro Iván Brocal', isAdmin: false },
  { username: 'acasas', password: 'antonella123', name: 'Antonella Casas', isAdmin: false },
  { username: 'kchavez', password: 'yamila123', name: 'Karen Yamila Chávez', isAdmin: false },
  { username: 'mgomez', password: 'macarena123', name: 'Macarena Gómez', isAdmin: false },
  { username: 'mheil', password: 'matias123', name: 'Matías Auca Heil', isAdmin: false },
  { username: 'iiriarte', password: 'ismael123', name: 'Ismael Agustín Andrés Iriarte', isAdmin: false },
  { username: 'mjuncos', password: 'milagros123', name: 'Milagros Anahí Juncos', isAdmin: false },
  { username: 'lmacagno', password: 'leonardo123', name: 'Leonardo Nicolás Macagno', isAdmin: false },
  { username: 'vmartinez', password: 'victoria123', name: 'Victoria Martínez', isAdmin: false },
  { username: 'mmena', password: 'mauricio123', name: 'Mauricio Emanuel Mena Lerda', isAdmin: false },
  { username: 'mmontenegro', password: 'marcos123', name: 'Marcos Joel Montenegro', isAdmin: false },
  { username: 'ymontenegro', password: 'yohana123', name: 'Yohana Vanessa Ruth Montenegro', isAdmin: false },
  { username: 'apoccetti', password: 'aldana123', name: 'Aldana Belén Poccetti', isAdmin: false },
  { username: 'arodriguez', password: 'angel123', name: 'Ángel Javier Rodríguez', isAdmin: false },
  { username: 'asuarez', password: 'agustin123', name: 'Agustín Ezequiel Suárez Pedernera', isAdmin: false },
  { username: 'mveyga', password: 'maria123', name: 'María Abigael Veyga Hanigian', isAdmin: false },
  { username: 'pvijarra', password: 'pablo123', name: 'Pablo Sebastián Vijarra', isAdmin: false },
];

// Mapa para almacenar la relación entre tokens y usuarios
const tokenToUser: Map<string, User> = new Map();

export const getUsers = (): User[] => users;

export const findUser = (username: string, password: string): User | undefined => {
  return users.find(u => u.username === username && u.password === password);
};

export const setUserToken = (user: User, token: string): void => {
  tokenToUser.set(token, user);
};

export const findUserByToken = (token: string): User | undefined => {
  return tokenToUser.get(token);
};

export const removeUserToken = (token: string): void => {
  tokenToUser.delete(token);
};

export const generateToken = (): string => {
  return Math.random().toString(36).substr(2);
};

export const updateUserProfilePicture = async (username: string, profilePicturePath: string): Promise<User> => {
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = { ...users[userIndex], profilePicture: profilePicturePath };
  users[userIndex] = updatedUser;

  // Actualizar el mapa tokenToUser
  for (const [token, user] of tokenToUser.entries()) {
    if (user.username === username) {
      tokenToUser.set(token, updatedUser);
      break;
    }
  }

  return updatedUser;
};

export const updateUser = (updatedUser: User): User => {
  const index = users.findIndex(u => u.username === updatedUser.username);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index] = updatedUser;
  return updatedUser;
};

export const createUser = (newUser: User): User => {
  if (users.some(u => u.username === newUser.username)) {
    throw new Error('Username already exists');
  }
  users.push(newUser);
  return newUser;
};

export const deleteUser = (username: string): void => {
  const index = users.findIndex(u => u.username === username);
  if (index === -1) {
    throw new Error('User not found');
  }
  users.splice(index, 1);
};