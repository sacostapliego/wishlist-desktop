import api from './api';
import storage from '../utils/storage';

export const authAPI = {
  register: async (userData: FormData) => {
    const response = await api.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await storage.setItem('auth_token', response.data.access_token);
    return response.data;
  },
  
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    await storage.setItem('auth_token', response.data.access_token);
    return response.data;
  },
  
  logout: async () => {
    await storage.removeItem('auth_token');
  },
};

export default authAPI;