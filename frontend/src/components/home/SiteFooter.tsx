const PRODUCT_LINKS = [
  { href: "#selfmailer", label: "Selfmailer" },
  { href: "#kuvertiertes-mailing", label: "Kuvertiertes Mailing" },
  { href: "#kartenmailing", label: "Kartenmailing" },
];

const COMPANY_LINKS = [
  { href: "/hilfe", label: "Hilfe" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
];

function FooterLinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-2 text-xs">
      <span className="text-white font-semibold uppercase tracking-wide">{title}</span>
      {links.map((l) => (
        <a key={l.href} href={l.href} className="hover:text-white">{l.label}</a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1e1e1e] text-[#999999] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <span className="text-white font-bold text-base">MailingOnline</span>
          <address className="mt-3 text-xs not-italic leading-6">
            Jopke Dialog Services<br />
            Am Mondschein 23a<br />
            59557 Lippstadt<br />
            <a href="tel:+4929412868980" className="hover:text-white">+49 2941 2868 980</a><br />
            <a href="mailto:info@jopke.de" className="hover:text-white">info@jopke.de</a>
          </address>
          <p className="mt-3 text-xs">
            Mo.–Fr. 08:00–17:00 Uhr<br />
            Nur für gewerbliche Kunden.<br />
            Alle Preise zzgl. MwSt.
          </p>
        </div>
        <FooterLinkColumn title="Produkte" links={PRODUCT_LINKS} />
        <FooterLinkColumn title="Unternehmen" links={COMPANY_LINKS} />
      </div>
      <div className="border-t border-[#333333] text-center py-4 text-xs">
        © {new Date().getFullYear()} MailingOnline · powered by Jopke Dialog Services
      </div>
    </footer>
  );
}