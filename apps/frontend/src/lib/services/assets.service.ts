import instance from '@/lib/utils/axiosInstance';
import { API_ENDPOINTS } from '@/lib/constants/api.constants';
import type {
  Asset,
  AssetType,
  CreateAssetPayload,
  PaginatedAssets,
} from '@/lib/types/assets.types';

export const assetsService = {
  async getAll(type?: AssetType): Promise<PaginatedAssets> {
    const response = await instance.get<PaginatedAssets>(
      API_ENDPOINTS.ASSETS.ALL,
      { params: type ? { type } : {} },
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

  async getUploadUrl(
    contentType: string,
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    const response = await instance.post(API_ENDPOINTS.ASSETS.UPLOAD, {
      contentType,
    });
    return response.data;
  },

  async uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    if (!response.ok) {
      throw new Error('Upload to storage failed');
    }
  },

  async createAsset(data: CreateAssetPayload): Promise<Asset> {
    const response = await instance.post(API_ENDPOINTS.ASSETS.ALL, data);
    return response.data;
  },

  async publish(id: string): Promise<Asset> {
    const response = await instance.post<Asset>(
      `${API_ENDPOINTS.ASSETS.ALL}/${id}/publish`,
    );
    return response.data;
  },

  async unpublish(id: string): Promise<Asset> {
    const response = await instance.post<Asset>(
      `${API_ENDPOINTS.ASSETS.ALL}/${id}/unpublish`,
    );
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await instance.delete(`${API_ENDPOINTS.ASSETS.ALL}/${id}`);
  },
};
