'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { Asset } from '@/lib/types/assets.types';
import { assetsService } from '@/lib/services/assets.service';
import AssetUploadForm from '@/components/AssetUploadForm';

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
      <div className="card-container">
        <div className="text-center">
          <h1 className="heading-primary">Dashboard</h1>
          <p className="text-subtitle">Welcome, {user.email}</p>
        </div>

        <div className="form-spacing">
          <div className="input-group">
            <div>
              <p className="label-base">Email</p>
              <p className="text-base">{user.email}</p>
            </div>

            {user.name && (
              <div>
                <p className="label-base">Name</p>
                <p className="text-base">{user.name}</p>
              </div>
            )}

            <div>
              <p className="label-base">User ID</p>
              <p className="text-base font-mono text-sm">{user.id}</p>
            </div>
          </div>

          <AssetUploadForm />

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

          <button className="btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
