'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth.schemas';
import { authService } from '@/lib/services/auth.service';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');

      const { passwordConfirm, ...registerData } = data;

      const response = await authService.register(registerData);

      localStorage.setItem('access_token', response.access_token);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className="card-container">
        <div className="text-center">
          <h1 className="heading-primary">Create your account</h1>
          <p className="text-subtitle">Join Solid Realm Platform</p>
        </div>

        <form className="form-spacing" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="alert-error">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          <div className="input-group">
            <div>
              <label className="label-base" htmlFor="email">
                Email address
              </label>
              <input
                autoComplete="off"
                className="input-base"
                id="email"
                placeholder="you@example.com"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label-base" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="off"
                className="input-base"
                id="password"
                placeholder="••••••••"
                type="password"
                {...register('password')}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label-base" htmlFor="passwordConfirm">
                Confirm password
              </label>
              <input
                autoComplete="off"
                className="input-base"
                id="passwordConfirm"
                placeholder="••••••••"
                type="password"
                {...register('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <p className="error-message">{errors.passwordConfirm.message}</p>
              )}
            </div>

            <div>
              <label className="label-base" htmlFor="name">
                Name (optional)
              </label>
              <input
                autoComplete="off"
                className="input-base"
                id="name"
                placeholder="Your name"
                type="text"
                {...register('name')}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>
          </div>

          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <p className="text-muted">
            Already have an account?{' '}
            <a className="link-primary" href="/login">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}