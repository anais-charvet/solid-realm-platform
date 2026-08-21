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
    <main className="page-container">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="heading-primary">{asset.title}</h1>
        <p className="label-base">{asset.type}</p>
        {asset.fileUrl && (
          <div className="relative flex aspect-video w-full items-end justify-center bg-black">
            {asset.type === 'AUDIO' ? (
              <audio
                src={asset.fileUrl}
                controls
                className="w-full px-6 pb-6"
              />
            ) : (
              <video
                src={asset.fileUrl}
                controls
                className="h-full w-full object-contain"
              />
            )}
          </div>
        )}

        {asset.price !== null && (
          <p className="text-subtitle">{asset.price} €</p>
        )}
      </div>
    </main>
  );
}
