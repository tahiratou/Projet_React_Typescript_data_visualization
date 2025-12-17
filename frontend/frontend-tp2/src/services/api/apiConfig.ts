import axios from 'axios';

// URL de base de l'API Django
export const API_BASE_URL =  import.meta.env.VITE_API_URL;

// Configuration des endpoints
export const API_ENDPOINTS = {
  // Authentification
  auth: {
    login: '/api/users/login/',
    register: '/api/users/inscription/',
  },
  // Datasets (REST API)
  datasets: {
    list: '/api/donnees/datasets/',
    detail: (id: number) => `/api/donnees/datasets/${id}/`,
  },
  // GraphQL
  graphql: '/api/graphql/',
  // Stats
  stats: '/api/datasets/admin/recup_donnee/dataset/stats/',
};

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
