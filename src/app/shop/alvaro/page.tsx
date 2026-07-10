import { notFound } from "next/navigation";
import { getSelfmailerFamilie } from "@/lib/selfmailer";
import { SelfmailerKonfigurator } from "@/components/SelfmailerKonfigurator";

export default function Page() {
  const familie = getSelfmailerFamilie("alvaro");
  if (!familie) notFound();
  return <SelfmailerKonfigurator familie={familie} />;
}
