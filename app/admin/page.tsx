'use client';

import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const modules = [
    {
      title: 'Gestión de Platos',
      description: 'Crear, editar, eliminar y activar/desactivar platos del menú',
      icon: '🍽️',
      href: '/admin/platos',
      color: 'from-orange-600 to-red-600',
    },
    {
      title: 'Horarios',
      description: 'Configurar horarios de atención del restaurante',
      icon: '⏰',
      href: '/admin/horarios',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Categorías',
      description: 'Gestionar categorías de platos',
      icon: '📋',
      href: '/admin/categorias',
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-5xl mb-2" style={{ color: 'var(--color-gold)' }}>Dashboard</h1>
        <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>Administra tu carta digital de Casa Stella</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.href} href={module.href}>
            <Card className="h-full transition-all hover:shadow-lg border" style={{ 
              backgroundColor: 'var(--admin-bg-card)', 
              borderColor: 'var(--admin-border)',
            }}>
              <CardHeader className="flex gap-3">
                <span className="text-4xl">{module.icon}</span>
                <div className="flex flex-col">
                  <p className="font-display text-xl" style={{ color: 'var(--color-gold)' }}>{module.title}</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="font-body" style={{ color: 'var(--color-cream-muted)' }}>{module.description}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
