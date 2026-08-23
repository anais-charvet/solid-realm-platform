import { Asset } from '@/lib/types/assets.types';
import AssetCard from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  emptyMessage?: string;
}

export default function AssetGrid({
  assets,
  emptyMessage = 'No content yet.',
}: AssetGridProps) {
  if (assets.length === 0) {
    return <p className="text-subtitle">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
