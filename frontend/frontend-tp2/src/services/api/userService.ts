import apiClient  from './apiConfig';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  is_staff: boolean;
}

export interface UpdateProfileData {
  email?: string;
  current_password?: string;
  new_password?: string;
}

export const userService = {
  // Récupérer le profil
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/api/users/profile/');
    return response.data;
  },

  
  // Mettre à jour le profil
  updateProfile: async (data: UpdateProfileData): Promise<{ message: string }> => {
    const response = await apiClient.put('/api/users/profile/', data);
    return response.data;
  },
};