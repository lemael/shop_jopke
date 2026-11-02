import { CategorySection } from "@/components/CategorySection";
import { TopInfoBar } from "@/components/home/TopInfoBar";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesStrip } from "@/components/home/FeaturesStrip";
import { SiteFooter } from "@/components/home/SiteFooter";
import {
  selfmailerProducts,
  kuvertiertesMailingProducts,
  kartenMailingProducts,
} from "@/data/homepageProducts";

const CATEGORIES = [
  { id: "selfmailer", title: "Selfmailer", subtitle: "Ohne Umschlag – direkt adressiert und versandfertig", products: selfmailerProducts, columns: 3 as const },
  { id: "kuvertiertes-mailing", title: "Kuvertiertes Mailing", subtitle: "Klassische Briefe und Mailings mit Umschlag", products: kuvertiertesMailingProducts, columns: 2 as const },
  { id: "kartenmailing", title: "Kartenmailing", subtitle: "Postkarten – einfach, günstig, wirkungsvoll", products: kartenMailingProducts, columns: 3 as const },
];

export default function HomeView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] font-sans">
      <TopInfoBar />
      <SiteHeader />
      <HeroSection />

      <main id="produkte" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {CATEGORIES.map(({ id, ...section }) => (
          <div key={id} id={id} className="scroll-mt-20">
            <CategorySection {...section} />
          </div>
        ))}
      </main>

      <FeaturesStrip />
      <SiteFooter />
    </div>
  );
}