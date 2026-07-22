'use client';

import { useEffect, useState } from 'react';
import { Asset } from '@/lib/types/assets.types';
import { assetsService } from '@/lib/services/assets.service';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await assetsService.getAll();
        setAssets(data.items);
      } catch {
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    getAssets();
  }, []);

  if (loading) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>
            <h2>{asset.title}</h2>
            {asset.artist && <p>{asset.artist}</p>}
            {asset.label && <p>{asset.label}</p>}
            {asset.genre && <p>{asset.genre.join(', ')}</p>}
            {asset.style && <p>{asset.style.join(', ')}</p>}
            {asset.description && <p>{asset.description}</p>}
            <p>{asset.type}</p>
            {asset.price !== null && <p>{asset.price} €</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
