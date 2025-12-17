import apiClient, { API_ENDPOINTS } from './apiConfig';
import { Dataset, DatasetFilters } from '../../types/dataset.types';

export const datasetService = {
  // Récupérer tous les datasets avec filtres optionnels
  getAll: async (filters?: DatasetFilters): Promise<Dataset[]> => {
    const response = await apiClient.get<Dataset[]>(
      API_ENDPOINTS.datasets.list,
      { params: filters }
    );
    return response.data;
  },

  // Récupérer un dataset par son ID
  getById: async (id: number): Promise<Dataset> => {
    const response = await apiClient.get<Dataset>(
      API_ENDPOINTS.datasets.detail(id)
    );
    return response.data;
  },

  // Rechercher des datasets
  search: async (searchTerm: string): Promise<Dataset[]> => {
    const response = await apiClient.get<Dataset[]>(
      API_ENDPOINTS.datasets.list,
      { params: { search: searchTerm } }
    );
    return response.data;
  },
};
