'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('access_token'));
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('access_token');
    setLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex gap-6">
        <Link href="/" className="link-primary">
          Home
        </Link>
        <Link href="/assets" className="link-primary">
          Catalog
        </Link>
      </div>
      <div className="flex gap-6">
        {loggedIn ? (
          <>
            <Link href="/dashboard" className="link-primary">
              Dashboard
            </Link>
            <button type="button" className="link-primary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="link-primary">
              Login
            </Link>
            <Link href="/register" className="link-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
