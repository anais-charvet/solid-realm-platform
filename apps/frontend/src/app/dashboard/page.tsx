'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { Asset } from '@/lib/types/assets.types';
import { assetsService } from '@/lib/services/assets.service';
import AssetUploadForm from '@/components/AssetUploadForm';
import Link from 'next/link';
import AssetGrid from '@/components/AssetGrid';

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

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('access_token');

        if (!token) {
          router.push('/login');
          return;
        }

        const userData = await authService.getMe();
        const assetsData = await assetsService.getMine();
        setUser(userData);
        setAssets(assetsData.items);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

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
          <AssetGrid assets={assets} emptyMessage="No uploads yet." />/
        </div>
        <div id="upload" className="mt-16">
          <AssetUploadForm />
        </div>
      </div>
    </main>
  );
}
