import Icon from '@dashboard/components/Admin/Icon';
import { initials } from '@dashboard/lib/format';
import { Link } from '@dashboard/lib/inertia';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2';

export const inputClass =
    'mt-1 block w-full rounded-lg border-slate-300 bg-white text-sm text-slate-900 shadow-xs placeholder:text-slate-400 transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

export const checkboxClass = 'h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500';

export const buttonClass =
    `inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700 active:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const secondaryButtonClass =
    `inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

export const dangerButtonClass =
    `inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

// Square icon-only button; pass an aria-label.
export const iconButtonClass =
    `inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 ${focusRing}`;

export function Card({ title, description, children, actions, icon, className = '', bodyClassName = 'space-y-5 px-5 py-5', flush = false }) {
    return (
        <section className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03] ${flush ? 'overflow-hidden' : ''} ${className}`}>
            {(title || actions || description) && (
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                        {icon && (
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <Icon name={icon} className="h-4 w-4" />
                            </span>
                        )}
                        <div className="min-w-0">
                            {title && <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>}
                            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
                        </div>
                    </div>
                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                </header>
            )}
            <div className={flush ? '' : bodyClassName}>{children}</div>
        </section>
    );
}

export function Field({ label, htmlFor, error, hint, children, className = '' }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            {children}
            {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}

const badgeTones = {
    gray: 'bg-slate-100 text-slate-700 ring-slate-500/15',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    cyan: 'bg-cyan-50 text-cyan-800 ring-cyan-600/20',
    red: 'bg-red-50 text-red-700 ring-red-600/20',
};

const dotTones = {
    gray: 'bg-slate-400',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-sky-500',
    violet: 'bg-violet-500',
    cyan: 'bg-cyan-500',
    red: 'bg-red-500',
};

export function Badge({ tone = 'gray', dot = false, children, className = '' }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTones[tone] ?? badgeTones.gray} ${className}`}
        >
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotTones[tone] ?? dotTones.gray}`} aria-hidden="true" />}
            {children}
        </span>
    );
}

// Post categories share one colour everywhere (badges and the content-mix chart).
export const categoryMeta = {
    ai: { label: 'AI & ML', tone: 'violet', color: '#7c3aed' },
    coding: { label: 'Coding', tone: 'cyan', color: '#0891b2' },
    engineering: { label: 'Engineering', tone: 'amber', color: '#d97706' },
};

export function CategoryBadge({ category, label }) {
    const meta = categoryMeta[category];
    return (
        <Badge tone={meta?.tone ?? 'gray'} dot>
            {label ?? meta?.label ?? category}
        </Badge>
    );
}

export function StatusBadge({ published }) {
    return (
        <Badge tone={published ? 'green' : 'amber'} dot>
            {published ? 'Published' : 'Draft'}
        </Badge>
    );
}

export function Pagination({ links = [] }) {
    if (links.length <= 3) {
        return null;
    }

    const base = 'inline-flex min-w-9 items-center justify-center rounded-lg px-3 py-1.5 text-sm';

    return (
        <nav className="mt-6 flex flex-wrap gap-1" aria-label="Pagination">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${index}-${link.label}`}
                        href={link.url}
                        preserveScroll
                        aria-current={link.active ? 'page' : undefined}
                        className={`${base} ${
                            link.active
                                ? 'bg-violet-600 font-semibold text-white shadow-sm'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${index}-${link.label}`}
                        className={`${base} border border-slate-100 text-slate-400`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}

export function EmptyState({ title, description, icon = 'sparkles', action }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-600">
                <Icon name={icon} className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
            {description && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    );
}

export function Avatar({ src, name = '', size = 'h-10 w-10', className = '' }) {
    if (src) {
        return <img src={src} alt={name} className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`} />;
    }

    return (
        <span
            aria-hidden="true"
            className={`${size} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-semibold text-white ring-2 ring-white ${className}`}
        >
            {initials(name)}
        </span>
    );
}

export function StatCard({ label, value, icon, href, accent = 'violet', children }) {
    const accents = {
        violet: 'bg-violet-50 text-violet-600',
        cyan: 'bg-cyan-50 text-cyan-700',
        amber: 'bg-amber-50 text-amber-700',
        green: 'bg-emerald-50 text-emerald-700',
        slate: 'bg-slate-100 text-slate-700',
    };
    const body = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                {icon && (
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accents[accent] ?? accents.violet}`}>
                        <Icon name={icon} className="h-[18px] w-[18px]" />
                    </span>
                )}
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            {children && <div className="mt-1.5 text-sm text-slate-500">{children}</div>}
        </>
    );
    const classes =
        'group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition';

    return href ? (
        <Link href={href} className={`${classes} hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md ${focusRing}`}>
            {body}
        </Link>
    ) : (
        <div className={classes}>{body}</div>
    );
}

// A table wrapper with consistent header/row styling; pass <thead>/<tbody> as children.
export function Table({ children }) {
    return (
        <div className="relative overflow-x-auto">
            <table className="admin-table min-w-full text-sm">{children}</table>
        </div>
    );
}

export function Callout({ icon = 'info', tone = 'violet', children }) {
    const tones = {
        violet: 'border-violet-200 bg-violet-50/70 text-violet-900',
        cyan: 'border-cyan-200 bg-cyan-50/70 text-cyan-900',
        amber: 'border-amber-200 bg-amber-50 text-amber-900',
    };
    return (
        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${tones[tone] ?? tones.violet}`}>
            <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">{children}</div>
        </div>
    );
}

// Sticky save bar for long forms.
export function FormActions({ children }) {
    return (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur">
            {children}
        </div>
    );
}

// Preview colours for the generated cover artwork names used on the public site.
export const coverGradients = {
    neural: 'from-violet-600 via-fuchsia-500 to-indigo-500',
    circuit: 'from-emerald-500 via-teal-500 to-cyan-600',
    code: 'from-slate-800 via-slate-700 to-violet-700',
    data: 'from-sky-500 via-cyan-500 to-blue-700',
    terminal: 'from-zinc-900 via-zinc-800 to-emerald-700',
    orbit: 'from-indigo-700 via-violet-600 to-cyan-400',
};

export function CoverSwatch({ cover, size = 'h-10 w-10', className = '' }) {
    return (
        <span
            aria-hidden="true"
            title={cover ?? 'No cover'}
            className={`${size} inline-block shrink-0 rounded-lg ${
                cover && coverGradients[cover]
                    ? `bg-gradient-to-br ${coverGradients[cover]}`
                    : 'border border-dashed border-slate-300 bg-slate-50'
            } ${className}`}
        />
    );
}
