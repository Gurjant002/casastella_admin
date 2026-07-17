'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/admin');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="cs-container flex min-h-screen items-center justify-center py-10">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <p className="text-slate-300 font-body">Cargando...</p>
      </div>
    </main>
  );
}
