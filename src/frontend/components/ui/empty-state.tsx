type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
}
