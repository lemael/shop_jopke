
import { notFound } from "next/navigation";
import { getMailingFamilie } from "@/lib/mailing";
import { KuvertiertesMailingKonfiguratorUI } from "@/components/KuvertiertesMailingKonfigurator";

export default function Page() {
  const familie = getMailingFamilie("lang_mailing");
  if (!familie) notFound();
  return <KuvertiertesMailingKonfiguratorUI familie={familie} />;
}
