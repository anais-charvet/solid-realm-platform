'use client';

import { assetsService } from '@/lib/services/assets.service';
import { useEffect, useState } from 'react';
import type { Asset } from '@/lib/types/assets.types';

export default function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAssetDetail = async () => {
      try {
        const data = await assetsService.getById(params.id);
        setAsset(data);
      } catch {
        setError('Asset not found');
      } finally {
        setLoading(false);
      }
    };
    getAssetDetail();
  }, [params.id]);

  if (loading) {
    return <main>Loading...</main>;
  }

  if (error || !asset) {
    return <main>{error || 'Asset not found'}</main>;
  }

  return (
    <main>
      <h1>{asset.title}</h1>
      <p>{asset.type}</p>
      {asset.fileUrl &&
        (asset.type === 'AUDIO' ? (
          <audio src={asset.fileUrl} controls></audio>
        ) : (
          <video src={asset.fileUrl} controls></video>
        ))}

      {asset.price !== null && <p>{asset.price} €</p>}
    </main>
  );
}
