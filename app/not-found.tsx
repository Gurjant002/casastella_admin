'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-black)' }}>
      <div className="text-center">
        <h1 className="font-display text-6xl mb-4" style={{ color: 'var(--color-gold)' }}>
          404
        </h1>
        <p className="font-body text-xl mb-8" style={{ color: 'var(--color-cream)' }}>
          Página no encontrada
        </p>
        <Link href="/">
          <Button style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-black)' }}>
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
