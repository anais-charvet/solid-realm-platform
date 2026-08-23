'use client';

import { useEffect, useState } from 'react';
import { Asset, AssetType } from '@/lib/types/assets.types';
import { assetsService } from '@/lib/services/assets.service';
import AssetFilters from '@/components/AssetFilters';
import AssetGrid from '@/components/AssetGrid';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedType, setSelectedType] = useState<AssetType | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await assetsService.getAll(selectedType);
        setAssets(data.items);
      } catch {
        setError('Unable to load the catalog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getAssets();
  }, [selectedType]);

  if (loading) {
    return (
      <main className="page-container">
        <p className="text-subtitle">Loading...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="mt-8">
        <AssetFilters selected={selectedType} onSelect={setSelectedType} />
      </div>

      <div className="mt-8">
        {error ? (
          <p className="text-subtitle">{error}</p>
        ) : (
          <AssetGrid assets={assets} />
        )}
      </div>
    </main>
  );
}
