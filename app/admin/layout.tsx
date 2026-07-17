'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/admin/auth/auth-context';
import AdminSidebar from '@/features/admin/ui/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--admin-bg-dark)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: 'var(--color-gold)' }}></div>
          <p className="mt-4 font-body" style={{ color: 'var(--color-cream-muted)' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--admin-bg-dark)' }}>
      <AdminSidebar />
      <main className="flex-1" style={{ backgroundColor: 'var(--color-black)' }}>
        {children}
      </main>
    </div>
  );
}
