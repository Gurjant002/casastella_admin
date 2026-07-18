'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { useAuth } from '../auth/auth-context';

const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: '📊',
    href: '/admin',
  },
  {
    label: 'Platos',
    icon: '🍽️',
    href: '/admin/platos',
  },
  {
    label: 'Categorías',
    icon: '📋',
    href: '/admin/categorias',
  },
  {
    label: 'Horarios',
    icon: '⏰',
    href: '/admin/horarios',
  },
  {
    label: 'Contraseña',
    icon: '🔑',
    href: '/admin/contrasena',
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const currentPath = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-64 flex flex-col h-screen sticky top-0 border-r font-body" style={{ backgroundColor: 'var(--admin-bg-dark)', borderColor: 'var(--admin-border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
        <h2 className="font-display text-2xl" style={{ color: 'var(--color-gold)' }}>Casa Stella</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--color-cream-muted)' }}>Administrador</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className="w-full text-left px-4 py-3 rounded-lg transition-colors font-body flex items-center gap-3"
              style={{
                backgroundColor: currentPath === item.href ? 'var(--color-gold)' : 'transparent',
                color: currentPath === item.href ? 'var(--color-black)' : 'var(--color-cream-muted)',
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.href) {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--admin-bg-hover)';
                  (e.target as HTMLElement).style.color = 'var(--color-cream)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.href) {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.color = 'var(--color-cream-muted)';
                }
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
        <Button
          onPress={handleLogout}
          className="w-full font-body font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-cream-muted)',
            border: `1px solid var(--admin-border)`,
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
