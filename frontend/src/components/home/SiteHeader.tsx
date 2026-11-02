import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#selfmailer", label: "Selfmailer" },
  { href: "#kuvertiertes-mailing", label: "Kuvertiertes Mailing" },
  { href: "#kartenmailing", label: "Kartenmailing" },
  { href: "/hilfe", label: "Hilfe" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="bg-[#1e1e1e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/jopke-logo.svg" alt="Jopke Dialog Services" width={128} height={32} className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#cccccc]">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="/kontakt"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#822660] hover:bg-[#6b1f50] text-white text-sm font-semibold transition-colors shrink-0"
          >
            Angebot anfragen
          </a>
        </div>
      </div>
    </header>
  );
}