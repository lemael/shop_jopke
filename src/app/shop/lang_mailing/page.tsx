import { notFound } from "next/navigation";
import { getMailingFamilie } from "@/lib/mailing";
import { KuvertiertesMailingKonfigurator } from "@/components/KuvertiertesMailingKonfigurator";

export default function Page() {
  const familie = getMailingFamilie("lang_mailing");
  if (!familie) notFound();
  return <KuvertiertesMailingKonfigurator familie={familie} />;
}
