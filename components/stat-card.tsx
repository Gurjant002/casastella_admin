import type {StatItem} from '@/lib/dashboard-data';

export function StatCard({item}: {item: StatItem}) {
  return (
    <article className="cs-panel cs-panel-strong cs-panel-hover p-5 shadow-none">
      <p className="cs-kicker">{item.label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="font-display text-4xl leading-none text-cs-cream md:text-5xl">{item.value}</span>
        <span className="border border-[rgba(201,168,76,0.22)] px-3 py-1 text-xs tracking-[0.22em] text-cs-gold">{item.delta}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-cs-cream-muted">{item.note}</p>
    </article>
  );
}
