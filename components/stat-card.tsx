import {Card, CardBody} from '@heroui/react';
import type {StatItem} from '@/lib/dashboard-data';

export function StatCard({item}: {item: StatItem}) {
  return (
    <Card className="premium-card border border-[rgba(201,168,76,0.18)] bg-transparent shadow-none">
      <CardBody className="gap-3 p-5">
        <p className="premium-kicker">{item.label}</p>
        <div className="flex items-end justify-between gap-4">
          <span className="premium-title text-4xl leading-none text-[var(--cream)] md:text-5xl">
            {item.value}
          </span>
          <span className="rounded-full border border-[rgba(201,168,76,0.22)] px-3 py-1 text-xs tracking-[0.22em] text-[var(--gold-hover)]">
            {item.delta}
          </span>
        </div>
        <p className="text-sm leading-6 text-[var(--muted)]">{item.note}</p>
      </CardBody>
    </Card>
  );
}
