import { User } from '../types';
import { INITIAL_CLIENTS, INITIAL_PROJECTS } from '../constants';

const USERS_KEY = 'app_users';
const SESSION_KEY = 'app_session';

// A simple hashing function for demonstration purposes.
// In a real app, use a library like bcrypt.
// This synchronous version is used to avoid issues with the Web Crypto API (crypto.subtle)
// which is only available in secure contexts (HTTPS or localhost).
const simpleSyncHash = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString(36);
};


const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const users = getUsers();
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const passwordHash = simpleSyncHash(password);
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Initialize with starter data for the new user
  localStorage.setItem(`clients_${email}`, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(`projects_${email}`, JSON.stringify(INITIAL_PROJECTS));

  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const passwordHash = simpleSyncHash(password);
  if (user.passwordHash !== passwordHash) {
    throw new Error('Invalid email or password.');
  }
  
  // Use sessionStorage for session-only persistence
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return user;
};

export const logout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const sessionJson = sessionStorage.getItem(SESSION_KEY);
  return sessionJson ? JSON.parse(sessionJson) : null;
};
