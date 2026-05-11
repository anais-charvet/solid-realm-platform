'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schemas';
import { authService } from '@/lib/services/auth.service';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');

      const response = await authService.login(data);
      
      localStorage.setItem('access_token', response.access_token);
      
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className="card-container">
        <div className="text-center">
          <h1 className="heading-primary">
            Sign in to your account
          </h1>
          <p className="text-subtitle">
            Welcome back to Solid Realm
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form-spacing">
          {error && (
            <div className="alert-error">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          <div className="input-group">
            <div>
              <label htmlFor="email" className="label-base">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="off"
                className="input-base"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label-base">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="off"
                className="input-base"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-muted">
            Don't have an account?{' '}
            <a href="/register" className="link-primary">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}