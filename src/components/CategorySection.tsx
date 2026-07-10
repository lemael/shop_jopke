import type { ProduktKarte } from "@/types/produkt";
import { ProductCard } from "@/components/ProductCard";

export function CategorySection({
  title,
  subtitle,
  products,
  columns,
}: Readonly<{
  title: string;
  subtitle: string;
  products: ProduktKarte[];
  columns: number;
}>) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  return (
    <section className="w-full py-10 border-b border-[#dcdcdc] last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2b2b2b] uppercase tracking-wide">{title}</h2>
          <p className="mt-1 text-sm text-[#666666]">{subtitle}</p>
        </div>
      </div>
      <div className={gridClass}>
        {products.map((p) => (
          <ProductCard key={p.id} name={p.name} format={p.format} pages={p.pages} price={p.price} href={p.href} image={p.image} />
        ))}
      </div>
    </section>
  );
}
