type Props = Readonly<{
  title: string;
  active?: boolean;
  onClick: () => void;
  suffix?: string;
  subtitle?: string;
}>;

export function ChoiceButton({ title, active = false, onClick, suffix, subtitle }: Props) {
  return (
    <button type="button" onClick={onClick} data-active={active} className="btn-choice">
      <span>{title}</span>
      {suffix && (
        <span className={`text-xs font-normal ${active ? "text-jopke-red-light" : "text-jopke-text-subtle"}`}>
          {suffix}
        </span>
      )}
      {subtitle && <span className={`text-xs ${active ? "text-[#f0cce3]" : "text-[#888888]"}`}>{subtitle}</span>}
    </button>
  );
}