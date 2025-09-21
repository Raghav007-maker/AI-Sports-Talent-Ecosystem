import { User, Role } from '../types';
import { MOCK_USERS } from '../constants';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: Role;
}

// Simulates a network request
export const login = (credentials: LoginCredentials): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
      );
      // Check if user exists and if the role matches the one they are logging in with
      if (user && user.role === credentials.role) {
        // In a real app, you would not send the password back
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword as User);
      } else {
        resolve(null); // Resolve null if user not found, password mismatch, or role mismatch
      }
    }, 500); // Simulate network delay
  });
};