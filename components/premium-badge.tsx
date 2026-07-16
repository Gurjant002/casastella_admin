import type {ReactNode} from 'react';

export function PremiumBadge({children}: {children: ReactNode}) {
  return (
    <span className="inline-flex items-center border border-[rgba(201,168,76,0.24)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
      {children}
    </span>
  );
}
