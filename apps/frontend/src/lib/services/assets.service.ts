import instance from '@/lib/utils/axiosInstance';
import { API_ENDPOINTS } from '@/lib/constants/api.constants';
import type { PaginatedAssets } from '@/lib/types/assets.types';

export const assetsService = {
  async getAll(): Promise<PaginatedAssets> {
    const response = await instance.get<PaginatedAssets>(API_ENDPOINTS.ASSETS);
    return response.data;
  },
};
