'use client';

import { useState } from 'react';
import Link from 'next/link';
import { assetsService } from '@/lib/services/assets.service';
import type { Asset } from '@/lib/types/assets.types';

interface DashboardAssetListProps {
  assets: Asset[];
  onChange: (asset: Asset) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export default function DashboardAssetList({
  assets,
  onChange,
  onDelete,
  emptyMessage = 'No uploads yet.',
}: DashboardAssetListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    setError('');
    try {
      await action();
    } catch {
      setError('Action failed. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const toggleStatus = (asset: Asset) =>
    run(asset.id, async () => {
      const updated =
        asset.status === 'PUBLISHED'
          ? await assetsService.unpublish(asset.id)
          : await assetsService.publish(asset.id);
      onChange(updated);
    });

  const remove = (asset: Asset) => {
    if (
      !window.confirm(
        `Delete "${asset.title ?? 'Untitled'}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    run(asset.id, async () => {
      await assetsService.remove(asset.id);
      onDelete(asset.id);
    });
  };

  if (assets.length === 0) {
    return <p className="text-subtitle">{emptyMessage}</p>;
  }

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {assets.map((asset) => {
          const published = asset.status === 'PUBLISHED';
          const busy = busyId === asset.id;
          const noFile = !asset.fileUrl;

          return (
            <li
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b py-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <p>{asset.title ?? 'Untitled'}</p>
                <p className="text-subtitle">
                  {asset.type} · {asset.status}
                  {noFile && ' · no file'}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/assets/${asset.id}`} className="btn-base">
                  View
                </Link>
                <button
                  className="btn-base disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => toggleStatus(asset)}
                  disabled={busy || (!published && noFile)}
                  title={
                    !published && noFile
                      ? 'Attach a file before publishing'
                      : undefined
                  }
                >
                  {published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  className="btn-base disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => remove(asset)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
