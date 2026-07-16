type AdminMetricsStripProps = {
  categories: number;
  products: number;
  openingHours?: number;
};

export function AdminMetricsStrip({categories, products, openingHours}: AdminMetricsStripProps) {
  return (
    <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-cs-gold">
      <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">{categories} categorías</span>
      <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">{products} productos</span>
      {typeof openingHours === 'number' ? (
        <span className="border border-[rgba(201,168,76,0.2)] px-3 py-1">{openingHours} horarios</span>
      ) : null}
    </div>
  );
}
