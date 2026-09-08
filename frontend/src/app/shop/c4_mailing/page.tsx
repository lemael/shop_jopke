import { notFound } from "next/navigation";
import { getMailingFamilie } from "@/lib/mailing";
import { KuvertiertesMailingKonfiguratorUI } from "@/components/KuvertiertesMailingKonfigurator";

export default function Page() {
  const familie = getMailingFamilie("c4_mailing");
  if (!familie) notFound();
  return <KuvertiertesMailingKonfiguratorUI familie={familie}/>;
}
