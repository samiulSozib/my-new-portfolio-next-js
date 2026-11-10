import { initials } from "@frontend/lib/site";

// The profile photo inside a slowly rotating gradient ring. Falls back to initials when no photo is uploaded.
export function Avatar({ name, photoUrl, size = 96 }: { name: string; photoUrl: string | null; size?: number }) {
  return (
    <div className="avatar-ring shrink-0 rounded-full p-[3px]" style={{ width: size, height: size }}>
      <div className="size-full overflow-hidden rounded-full bg-background p-[3px]">
        {photoUrl ? (
          <img src={photoUrl} alt={name} width={size} height={size} className="size-full rounded-full object-cover" />
        ) : (
          <div
            aria-label={name}
            role="img"
            className="flex size-full items-center justify-center rounded-full bg-gradient-accent font-semibold text-accent-foreground"
            style={{ fontSize: size / 3 }}
          >
            {initials(name)}
          </div>
        )}
      </div>
    </div>
  );
}
