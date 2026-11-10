type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-medium text-muted">
      {label}
    </span>
  );
}
