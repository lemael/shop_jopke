const USPS = [
  "Expressversand möglich",
  "Zertifizierte Druckqualität",
  "Persönlicher Kundenservice",
  "Faire Preise ohne versteckte Kosten",
];

export function TopInfoBar() {
  return (
    <div className="bg-[#2b2b2b] text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-6 sm:justify-between">
        {USPS.map((text) => (
          <span key={text}>✓ {text}</span>
        ))}
      </div>
    </div>
  );
}