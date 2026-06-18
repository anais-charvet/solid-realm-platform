import instance from '@/lib/utils/axiosInstance';
import { API_ENDPOINTS } from '@/lib/constants/api.constants';
import type { LoginFormData, RegisterDTO } from '@/lib/schemas/auth.schemas';

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
    const response = await instance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await instance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
    return response.data;
  },

  async getMe(): Promise<AuthResponse['user']> {
    const response = await instance.get<AuthResponse['user']>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response.data;
  },
};
