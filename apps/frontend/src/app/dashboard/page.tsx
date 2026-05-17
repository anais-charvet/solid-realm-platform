'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const userData = await authService.getMe(token);
      setUser(userData);

    } catch (error) {
      localStorage.removeItem('access_token');
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

         <button className="btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}