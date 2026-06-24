import type {ReactNode} from 'react';

export function PremiumBadge({children}: {children: ReactNode}) {
  return (
    <span className="premium-chip inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
      {children}
    </span>
  );
}
