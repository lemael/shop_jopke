export function OptionTile({ active, onClick, title, subtitle }: Readonly<{ active: boolean; onClick: () => void; title: string; subtitle?: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 w-full sm:w-auto min-w-35 p-4 border text-left transition-colors cursor-pointer ${
        active ? "bg-[#822660] border-[#822660] text-white" : "bg-white border-[#dcdcdc] text-[#333333] hover:border-[#822660]"
      }`}
    >
      <span className="font-semibold text-sm">{title}</span>
      {subtitle && <span className={`text-xs ${active ? "text-[#f0cce3]" : "text-[#888888]"}`}>{subtitle}</span>}
    </button>
  );
}

export function StepHeader({ step, title, helpTab }: Readonly<{ step: number; title: string; helpTab?: string }>) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 flex items-center justify-center bg-[#822660] text-white font-bold text-sm shrink-0">{step}</span>
        <h2 className="text-lg font-bold text-[#2b2b2b] uppercase tracking-wide">{title}</h2>
      </div>
      {helpTab && (
        <a
          href={`/hilfe#${helpTab}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Hilfe zu diesem Schritt"
          aria-label="Hilfe zu diesem Schritt"
          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#dcdcdc] text-[#822660] font-bold text-sm hover:border-[#822660] hover:bg-[#822660] hover:text-white transition-colors shrink-0"
        >
          ?
        </a>
      )}
    </div>
  );
}
