import { notFound } from "next/navigation";
import { getKartenmailingFamilie } from "@/lib/kartenmailing";
import { KartenmailingKonfigurator } from "@/components/KartenmailingKonfigurator";

export default function Page() {
  const familie = getKartenmailingFamilie("post_din_a4");
  if (!familie) notFound();
  return <KartenmailingKonfigurator familie={familie} />;
}
