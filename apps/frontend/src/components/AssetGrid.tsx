import { Asset } from '@/lib/types/assets.types';
import AssetCard from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
}

export default function AssetGrid({ assets }: AssetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
