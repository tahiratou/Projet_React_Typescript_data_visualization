// src/services/api/apiConfig.ts

import axios from 'axios';

// ✅ VITE utilise import.meta.env (pas process.env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Debug : afficher l'URL utilisée
console.log('🔧 [API Config] Base URL:', API_BASE_URL);
console.log('🔧 [API Config] Mode:', import.meta.env.MODE);

// Vérifier que l'URL est correcte en production
if (import.meta.env.PROD && API_BASE_URL.includes('127.0.0.1')) {
  console.error('❌ [API Config] ERREUR : Utilise localhost en production !');
  console.error('❌ Vérifiez que VITE_API_URL est configurée sur Vercel');
}

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
// Créer une instance Axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes (important pour Render free tier)
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Debug : afficher chaque requête
    console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ [API] Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Erreur réseau (backend inaccessible)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('🚫 [API] Network error - Backend unreachable');
      console.error('🚫 URL tentée:', error.config?.url);
      
      // Message utilisateur personnalisé
      error.userMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez dans quelques instants.';
    }
    
    // Timeout (backend trop lent)
    else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ [API] Request timeout');
      error.userMessage = 'Le serveur met trop de temps à répondre. Veuillez patienter et réessayer.';
    }
    
    // 401 Unauthorized (token expiré)
    else if (error.response?.status === 401) {
      console.warn('⚠️ [API] 401 Unauthorized - Token expired');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    
    // 403 Forbidden
    else if (error.response?.status === 403) {
      console.error('🚫 [API] 403 Forbidden');
      error.userMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    }
    
    // 404 Not Found
    else if (error.response?.status === 404) {
      console.error('🚫 [API] 404 Not Found');
      error.userMessage = 'Ressource introuvable.';
    }
    
    // 500 Internal Server Error
    else if (error.response?.status === 500) {
      console.error('💥 [API] 500 Internal Server Error');
      error.userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }
    
    // Autres erreurs
    else {
      console.error(`❌ [API] ${error.response?.status || 'Error'}:`, error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;