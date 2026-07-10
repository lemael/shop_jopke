import { notFound } from "next/navigation";
import { getMailingFamilie } from "@/lib/mailing";
import { KuvertiertesMailingKonfigurator } from "@/components/KuvertiertesMailingKonfigurator";

export default function Page() {
  const familie = getMailingFamilie("c4_mailing");
  if (!familie) notFound();
  return <KuvertiertesMailingKonfigurator familie={familie} />;
}
