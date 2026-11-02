const FEATURES = [
  { title: "Schnelle Lieferung", desc: "Expressversand innerhalb von 24–48 h" },
  { title: "Zertifizierte Qualität", desc: "Mitglied im DDV, zertifizierter Performance-Partner" },
  { title: "Garantierte Preise", desc: "Transparente Kalkulation, keine versteckten Kosten" },
  { title: "Persönlicher Service", desc: "Beratung von Mo.–Fr. 08:00–17:00 Uhr" },
];

export function FeaturesStrip() {
  return (
    <section className="bg-white border-t border-[#dcdcdc] mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col items-start gap-2 border-l-2 border-[#822660] pl-4">
            <h3 className="font-semibold text-[#2b2b2b]">{f.title}</h3>
            <p className="text-sm text-[#666666] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}