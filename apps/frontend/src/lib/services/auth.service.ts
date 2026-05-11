import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api.constants';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schemas';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  async getMe(token: string): Promise<AuthResponse['user']> {
    const response = await axios.get<AuthResponse['user']>(
      API_ENDPOINTS.AUTH.ME,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
