import type { ProduktKarte } from "@/types/produkt";

export function ProductCard({
  name,
  format,
  pages,
  price,
  href,
  image,
}: Readonly<Omit<ProduktKarte, "id">>) {
  return (
    <div className="group flex flex-col bg-white border border-[#dcdcdc] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image area */}
      <div className="flex items-center justify-center h-44 bg-[#f4f4f4] border-b border-[#dcdcdc] overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-contain p-4" />
        ) : (
          <svg
            className="w-14 h-14 text-[#822660] opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-[#2b2b2b] text-sm leading-snug group-hover:text-[#822660] transition-colors">
          {name}
        </h3>
        <p className="text-xs text-[#666666]">{format}</p>
        <p className="text-xs text-[#888888]">{pages}</p>
        <p className="text-sm font-bold text-[#822660] mt-auto pt-2">{price}</p>
        {href ? (
          <a
            href={href}
            className="mt-1 block w-full py-2 px-4 bg-[#822660] hover:bg-[#6b1f50] active:bg-[#5a1a42] text-white text-sm font-semibold transition-colors text-center"
          >
            Konfigurieren
          </a>
        ) : (
          <button className="mt-1 w-full py-2 px-4 bg-[#822660] hover:bg-[#6b1f50] active:bg-[#5a1a42] text-white text-sm font-semibold transition-colors cursor-pointer">
            Konfigurieren
          </button>
        )}
      </div>
    </div>
  );
}
