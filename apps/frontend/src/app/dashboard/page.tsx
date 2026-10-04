'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { assetsService } from '@/lib/services/assets.service';
import { Asset } from '@/lib/types/assets.types';
import AssetUploadForm from '@/components/AssetUploadForm';
import DashboardAssetList from '@/components/DashboardAssetList';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);

  const router = useRouter();

  const refreshAssets = useCallback(async () => {
    const data = await assetsService.getMine();
    setAssets(data.items);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) {
          router.push('/login');
          return;
        }

        const userData = await authService.getMe();
        setUser(userData);
        await refreshAssets();
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router, refreshAssets]);

  if (loading) {
    return (
      <main className="page-container">
        <div className="text-center">
          <p className="text-subtitle">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const handleChange = (updated: Asset) =>
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const handleDelete = (id: string) =>
    setAssets((prev) => prev.filter((a) => a.id !== id));

  return (
    <main className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-primary">Dashboard</h1>
          <p className="text-subtitle">Welcome, {user.email}</p>
        </div>
        <div className="flex gap-3">
          <a href="#upload" className="btn-base">
            Upload
          </a>
          <button className="btn-base" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="label-base">Your uploads</h2>
        <div className="mt-4">
          <DashboardAssetList
            assets={assets}
            onChange={handleChange}
            onDelete={handleDelete}
            emptyMessage="No uploads yet."
          />
        </div>
        <div id="upload" className="mt-16">
          <AssetUploadForm onCreated={refreshAssets} />
        </div>
      </div>
    </main>
  );
}
