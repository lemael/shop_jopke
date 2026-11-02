export function ChoiceGroup({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex flex-col items-center gap-3 w-full">{children}</div>;
}