import { notFound } from "next/navigation";
import { getSelfmailerFamilie } from "@/lib/selfmailer";
import { SelfmailerKonfigurator } from "@/components/SelfmailerKonfigurator";

export default function Page() {
  const familie = getSelfmailerFamilie("mikro");
  if (!familie) notFound();
  return <SelfmailerKonfigurator familie={familie} />;
}
