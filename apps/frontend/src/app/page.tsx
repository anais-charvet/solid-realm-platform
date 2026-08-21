'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assetsService } from '@/lib/services/assets.service';
import type { Asset } from '@/lib/types/assets.types';
import AssetGrid from '@/components/AssetGrid';

export default function Home() {
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

  return (
    <main className="page-container">
      <nav className="flex justify-end gap-6">
        <Link href="/login" className="link-primary">
          Login
        </Link>
        <Link href="/register" className="link-primary">
          Register
        </Link>
      </nav>

      <h1 className="heading-display mt-12 text-center">Solid Realm</h1>

      <div className="mt-12">
        {loading ? (
          <p className="text-subtitle">Loading...</p>
        ) : (
          <AssetGrid assets={assets} />
        )}
      </div>
    </main>
  );
}
