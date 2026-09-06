import { notFound } from "next/navigation";
import { getSelfmailerFamilie } from "@/lib/selfmailerPreis";
import { SelfmailerKonfigurator } from "@/components/SelfmailerKonfigurator";

export default function Page() {
  const familie = getSelfmailerFamilie("levi");
  if (!familie) notFound();
  return <SelfmailerKonfigurator familie={familie} />;
}
