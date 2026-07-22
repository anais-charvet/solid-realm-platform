export type AssetType = 'AUDIO' | 'VIDEO';
export type AssetStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Asset {
  artist: string | null;
  createdAt: string;
  creatorId: string;
  description: string | null;
  genre: string[] | null;
  id: string;
  label: string | null;
  price: number | null;
  publishedAt: string | null;
  status: AssetStatus;
  style: string[] | null;
  technicalSpecs: Record<string, unknown> | null;
  title: string | null;
  type: AssetType;
}

export interface PaginatedAssets {
  items: Asset[];
  total: number;
  page: number;
  limit: number;
}
