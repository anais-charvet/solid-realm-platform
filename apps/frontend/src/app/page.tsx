'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assetsService } from '@/lib/services/assets.service';
import type { Asset } from '@/lib/types/assets.types';

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
    <main>
      <nav className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>

      <h1>Solid Realm Platform</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {assets.map((asset) => (
            <li key={asset.id}>
              <Link href={`/assets/${asset.id}`}>{asset.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
