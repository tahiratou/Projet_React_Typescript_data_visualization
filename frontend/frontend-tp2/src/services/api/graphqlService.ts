import apiClient, { API_ENDPOINTS } from './apiConfig';
import { Dataset, HarvestConfig } from '../../types/dataset.types';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export const graphqlService = {
  // Query pour récupérer tous les datasets
  getAllDatasets: async (): Promise<Dataset[]> => {
    const query = `
      query {
        allDatasets {
          id
          nameOfDataverse
          identifierOfDataverse
          url
          description
          keywords
          subjects
          authors
          contacts {
            id
            name
            affiliation
          }
          publications {
            id
            citation
            url
          }
          dateInfo {
            createdAt
            updatedAt
            publishedAt
          }
        }
      }
    `;

    const response = await apiClient.post<GraphQLResponse<{ allDatasets: any[] }>>(
      API_ENDPOINTS.graphql,
      { query }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    // Transformer les données GraphQL pour correspondre au format REST
    return response.data.data.allDatasets.map((dataset: any) => ({
      id: dataset.id,
      name_of_dataverse: dataset.nameOfDataverse,
      identifier_of_dataverse: dataset.identifierOfDataverse,
      url: dataset.url,
      description: dataset.description,
      keywords: dataset.keywords,
      subjects: dataset.subjects,
      authors: dataset.authors,
      contacts: dataset.contacts || [],
      publications: dataset.publications || [],
      date_info: dataset.dateInfo ? {
        created_at: dataset.dateInfo.createdAt,
        updated_at: dataset.dateInfo.updatedAt,
        published_at: dataset.dateInfo.publishedAt,
      } : null,
    }));
  },

  // Query pour récupérer un dataset par ID
  getDatasetById: async (id: number): Promise<Dataset | null> => {
    const query = `
      query {
        datasetById(id: ${id}) {
          id
          nameOfDataverse
          identifierOfDataverse
          url
          description
          keywords
          subjects
          authors
          contacts {
            id
            name
            affiliation
          }
          publications {
            id
            citation
            url
          }
          dateInfo {
            createdAt
            updatedAt
            publishedAt
          }
        }
      }
    `;

    const response = await apiClient.post<GraphQLResponse<{ datasetById: any }>>(
      API_ENDPOINTS.graphql,
      { query }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const dataset = response.data.data.datasetById;
    if (!dataset) return null;

    return {
      id: dataset.id,
      name_of_dataverse: dataset.nameOfDataverse,
      identifier_of_dataverse: dataset.identifierOfDataverse,
      url: dataset.url,
      description: dataset.description,
      keywords: dataset.keywords,
      subjects: dataset.subjects,
      authors: dataset.authors,
      contacts: dataset.contacts || [],
      publications: dataset.publications || [],
      date_info: dataset.dateInfo ? {
        created_at: dataset.dateInfo.createdAt,
        updated_at: dataset.dateInfo.updatedAt,
        published_at: dataset.dateInfo.publishedAt,
      } : null,
    };
  },

  // Query pour récupérer les configurations de moissonnage
  getAllHarvests: async (): Promise<HarvestConfig[]> => {
    const query = `
      query {
        allHarvests {
          id
          sourceUrl
          frequency
          filters
          active
        }
      }
    `;

    const response = await apiClient.post<GraphQLResponse<{ allHarvests: any[] }>>(
      API_ENDPOINTS.graphql,
      { query }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.allHarvests.map((harvest: any) => ({
      id: harvest.id,
      source_url: harvest.sourceUrl,
      frequency: harvest.frequency,
      filters: harvest.filters,
      active: harvest.active,
    }));
  },
};
