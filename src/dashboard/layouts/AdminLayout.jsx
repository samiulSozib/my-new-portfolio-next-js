import { route, routeMatches } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import { Avatar } from '@dashboard/components/Admin/ui';
import { Link, router, usePage } from '@dashboard/lib/inertia';
import { useEffect, useState } from 'react';

const navigation = [
    {
        heading: 'Overview',
        items: [{ label: 'Dashboard', route: 'admin.dashboard', match: 'admin.dashboard', icon: 'dashboard' }],
    },
    {
        heading: 'Content',
        items: [
            { label: 'Posts', route: 'admin.posts.index', match: 'admin.posts.*', icon: 'file-text' },
            { label: 'Projects', route: 'admin.projects.index', match: 'admin.projects.*', icon: 'folder' },
        ],
    },
    {
        heading: 'Profile',
        items: [
            { label: 'About & skills', route: 'admin.about.edit', match: 'admin.about.*', icon: 'user' },
            { label: 'Experience', route: 'admin.experience.index', match: 'admin.experience.*', icon: 'briefcase' },
            { label: 'Resume & photo', route: 'admin.resume.edit', match: 'admin.resume.*', icon: 'download' },
        ],
    },
    {
        heading: 'Audience',
        items: [{ label: 'Subscribers', route: 'admin.subscribers.index', match: 'admin.subscribers.*', icon: 'mail' }],
    },
    {
        heading: 'Settings',
        items: [
            { label: 'Site settings', route: 'admin.site.edit', match: 'admin.site.*', icon: 'settings' },
            { label: 'Account', route: 'profile.edit', match: 'profile.*', icon: 'users' },
        ],
    },
];

function NavItem({ item, onNavigate }) {
    const { url } = usePage();
    const active = routeMatches(item.match, url);

    return (
        <Link
            href={route(item.route)}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ' +
                (active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100')
            }
        >
            {active && (
                <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400" aria-hidden="true" />
            )}
            <Icon
                name={item.icon}
                className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-violet-300' : 'text-slate-500 group-hover:text-slate-300'}`}
            />
            {item.label}
        </Link>
    );
}

function Sidebar({ onNavigate, onClose }) {
    const { auth, publicSiteUrl, siteName } = usePage().props;

    return (
        <div className="relative flex h-full flex-col overflow-hidden bg-slate-950 text-slate-300">
            {/* Soft brand glow behind the logo block */}
            <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-10 right-[-4rem] h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" aria-hidden="true" />

            <div className="relative flex items-center justify-between gap-3 px-5 pt-5 pb-6">
                <Link href={route('admin.dashboard')} onClick={onNavigate} className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-900/40">
                        <Icon name="sparkles" className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{siteName}</span>
                        <span className="block text-xs text-slate-400">Dashboard</span>
                    </span>
                </Link>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                        <Icon name="x" className="h-5 w-5" />
                    </button>
                )}
            </div>

            <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 pb-6" aria-label="Dashboard">
                {navigation.map((group) => (
                    <div key={group.heading}>
                        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{group.heading}</p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItem key={item.route} item={item} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="relative space-y-3 border-t border-white/[0.06] p-3">
                {publicSiteUrl && (
                    <a
                        href={publicSiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-white/[0.06]"
                    >
                        <span className="flex items-center gap-2">
                            <Icon name="globe" className="h-4 w-4 text-cyan-300" />
                            View site
                        </span>
                        <Icon name="arrow-up-right" className="h-4 w-4 text-slate-400" />
                    </a>
                )}
                <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                    <Avatar name={auth.user.name} size="h-9 w-9" className="!ring-slate-800" />
                    <Link href={route('profile.edit')} onClick={onNavigate} className="min-w-0 flex-1 hover:opacity-90">
                        <span className="block truncate text-sm font-medium text-white">{auth.user.name}</span>
                        <span className="block truncate text-xs text-slate-400">{auth.user.email}</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.post(route('logout'))}
                        aria-label="Log out"
                        title="Log out"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <Icon name="log-out" className="h-[18px] w-[18px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Toast({ message }) {
    const [visible, setVisible] = useState(Boolean(message));

    useEffect(() => {
        setVisible(Boolean(message));
        if (!message) return undefined;
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!visible || !message) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4 sm:justify-end sm:px-6">
            <div
                role="status"
                aria-live="polite"
                className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-xl shadow-slate-900/10"
            >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <p className="flex-1 pt-1 text-sm font-medium text-slate-800">{message}</p>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    aria-label="Dismiss notification"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                    <Icon name="x" className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export default function AdminLayout({ title, description, actions, children }) {
    const { flash } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
                        <Toast message={flash?.success} />

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
                <Sidebar />
            </aside>

            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Close navigation"
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="relative h-full w-72 max-w-[85vw] animate-toast-in shadow-2xl">
                        <Sidebar onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
                <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                                onClick={() => setMenuOpen(true)}
                                aria-label="Open navigation"
                                aria-expanded={menuOpen}
                            >
                                <Icon name="menu" className="h-5 w-5" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h1>
                                {description && <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">{description}</p>}
                            </div>
                        </div>
                        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
            </div>
        </div>
    );
}
