import instance from '@/lib/utils/axiosInstance';
import { API_ENDPOINTS } from '@/lib/constants/api.constants';
import type { Asset, PaginatedAssets } from '@/lib/types/assets.types';

export const assetsService = {
  async getAll(): Promise<PaginatedAssets> {
    const response = await instance.get<PaginatedAssets>(
      API_ENDPOINTS.ASSETS.ALL,
    );
    return response.data;
  },

  async getById(id: string): Promise<Asset> {
    const response = await instance.get<Asset>(
      `${API_ENDPOINTS.ASSETS.ALL}/${id}`,
    );
    return response.data;
  },

  async getMine(): Promise<PaginatedAssets> {
    const response = await instance.get<PaginatedAssets>(
      API_ENDPOINTS.ASSETS.MINE,
    );
    return response.data;
  },
};
