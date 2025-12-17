import apiClient, { API_ENDPOINTS } from './apiConfig';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export const authService = {
  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  },

  // Inscription
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      credentials
    );
    return response.data;
  },

  // Déconnexion (local)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Récupérer le token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};