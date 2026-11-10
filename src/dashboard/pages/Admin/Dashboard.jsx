'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import {
    Avatar,
    Card,
    CategoryBadge,
    StatCard,
    StatusBadge,
    categoryMeta,
    secondaryButtonClass,
} from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { formatDate, formatDuration, formatMonthYear, formatNumber, greeting, relativeTime } from '@dashboard/lib/format';
import { Link, usePage } from '@dashboard/lib/inertia';
import { useEffect, useState } from 'react';

const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

function QuickAction({ href, icon, children, external = false }) {
    const className =
        'inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

    return external ? (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
            <Icon name={icon} className="h-4 w-4" />
            {children}
        </a>
    ) : (
        <Link href={href} className={className}>
            <Icon name={icon} className="h-4 w-4" />
            {children}
        </Link>
    );
}

function WelcomeBanner({ photoUrl, stats }) {
    const { auth, publicSiteUrl } = usePage().props;
    // The date and greeting use the visitor's clock, so they are filled in after hydration.
    const [now, setNow] = useState(null);
    useEffect(() => setNow(new Date()), []);
    const today = now ? now.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '\u00a0';
    const firstName = auth.user.name.split(' ')[0];

    return (
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-5 py-6 text-white shadow-lg shadow-slate-900/10 sm:px-8 sm:py-8">
            <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-violet-600/40 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" aria-hidden="true" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <Avatar src={photoUrl} name={auth.user.name} size="h-14 w-14 sm:h-16 sm:w-16" className="!ring-white/20 text-lg" />
                    <div className="min-w-0">
                        <p className="text-sm text-slate-400">{today}</p>
                        <h2 className="mt-0.5 text-xl font-semibold tracking-tight sm:text-2xl">
                            {now ? greeting(now) : 'Welcome back'}, {firstName}
                        </h2>
                        <p className="mt-1 text-sm text-slate-300">
                            {stats.drafts > 0
                                ? `You have ${plural(stats.drafts, 'draft')} waiting to be published.`
                                : 'Everything is published. Time to write something new?'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route('admin.posts.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <Icon name="plus" className="h-4 w-4" strokeWidth={2.25} />
                        New post
                    </Link>
                    <QuickAction href={route('admin.projects.create')} icon="folder">Add project</QuickAction>
                    <QuickAction href={route('admin.experience.create')} icon="briefcase">Add role</QuickAction>
                    <QuickAction href={route('admin.resume.edit')} icon="upload">Upload CV</QuickAction>
                    {publicSiteUrl && (
                        <QuickAction href={publicSiteUrl} icon="external-link" external>
                            View site
                        </QuickAction>
                    )}
                </div>
            </div>
        </section>
    );
}

// Rounds the axis top up to a clean number so ticks read 0 / 2 / 4 …
function niceMax(value) {
    if (value <= 4) return 4;
    const step = Math.pow(10, Math.floor(Math.log10(value)));
    const scaled = Math.ceil(value / step);
    const nice = [1, 2, 2.5, 5, 10].find((n) => n >= scaled) ?? 10;
    return nice * step;
}

function PublishingChart({ data }) {
    const [active, setActive] = useState(null);
    const [view, setView] = useState('chart');
    const max = niceMax(Math.max(0, ...data.map((d) => d.count)));
    const ticks = [0, max / 4, max / 2, (max * 3) / 4, max].map((t) => Math.round(t * 10) / 10);
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const peak = data.reduce((best, d) => (d.count > 0 && d.count >= (best?.count ?? 0) ? d : best), null);
    const latestIndex = data.length - 1;

    return (
        <Card
            title="Publishing activity"
            description={`${plural(total, 'post')} published in the last 12 months`}
            icon="chart"
            actions={
                <div className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-medium" role="group" aria-label="View">
                    {['chart', 'table'].map((option) => (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={view === option}
                            onClick={() => setView(option)}
                            className={`rounded-md px-2.5 py-1 capitalize transition ${view === option ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            }
        >
            {view === 'table' ? (
                <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-sm">
                        <caption className="sr-only">Published posts per month</caption>
                        <thead>
                            <tr className="text-left text-xs text-slate-500 uppercase">
                                <th className="py-2 font-semibold">Month</th>
                                <th className="py-2 text-right font-semibold">Posts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 tabular-nums">
                            {data.map((d) => (
                                <tr key={d.month}>
                                    <td className="py-2 text-slate-700">{formatMonthYear(`${d.month}-01`)}</td>
                                    <td className="py-2 text-right font-medium text-slate-900">{d.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <figure>
                    <figcaption className="sr-only">
                        Column chart of published posts per month over the last 12 months. Use the table view for exact values.
                    </figcaption>
                    <div className="flex h-56 gap-2 sm:gap-3">
                        {/* Y axis ticks */}
                        <div className="relative w-6 shrink-0 text-right text-[11px] text-slate-400 tabular-nums" aria-hidden="true">
                            {ticks.map((tick) => (
                                <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(tick / max) * 100}%` }}>
                                    {Number.isInteger(tick) ? tick : ''}
                                </span>
                            ))}
                        </div>
                        <div className="relative flex-1">
                            {/* Hairline grid */}
                            {ticks.map((tick) => (
                                <div
                                    key={tick}
                                    className={`absolute inset-x-0 h-px ${tick === 0 ? 'bg-slate-300' : 'bg-slate-100'}`}
                                    style={{ bottom: `${(tick / max) * 100}%` }}
                                    aria-hidden="true"
                                />
                            ))}
                            <ul className="relative flex h-full items-end">
                                {data.map((d, index) => {
                                    const height = (d.count / max) * 100;
                                    const isActive = active === index;
                                    const label = `${formatMonthYear(`${d.month}-01`)}: ${plural(d.count, 'post')}`;

                                    return (
                                        <li key={d.month} className="relative flex h-full min-w-0 flex-1 justify-center px-px sm:px-0">
                                            <button
                                                type="button"
                                                aria-label={label}
                                                onPointerEnter={() => setActive(index)}
                                                onPointerLeave={() => setActive(null)}
                                                onFocus={() => setActive(index)}
                                                onBlur={() => setActive(null)}
                                                className="group flex h-full w-full cursor-default items-end justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                                            >
                                                <span
                                                    className={`block w-full max-w-6 rounded-t transition-colors ${
                                                        d.count === 0
                                                            ? 'bg-transparent'
                                                            : isActive
                                                              ? 'bg-violet-500'
                                                              : index === latestIndex
                                                                ? 'bg-violet-600'
                                                                : 'bg-violet-600/80'
                                                    }`}
                                                    style={{ height: d.count ? `max(${height}%, 4px)` : 0 }}
                                                />
                                            </button>
                                            {peak && peak.month === d.month && !isActive && (
                                                <span
                                                    className="pointer-events-none absolute text-xs font-semibold text-slate-700 tabular-nums"
                                                    style={{ bottom: `calc(${height}% + 4px)` }}
                                                    aria-hidden="true"
                                                >
                                                    {d.count}
                                                </span>
                                            )}
                                            {isActive && (
                                                <div
                                                    role="tooltip"
                                                    className="pointer-events-none absolute z-10 -translate-y-2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center whitespace-nowrap text-white shadow-lg"
                                                    style={{ bottom: `${Math.min(height, 82)}%` }}
                                                >
                                                    <span className="block text-sm font-semibold tabular-nums">{plural(d.count, 'post')}</span>
                                                    <span className="block text-[11px] text-slate-300">{formatMonthYear(`${d.month}-01`)}</span>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-2 flex gap-2 pl-8 sm:gap-3 sm:pl-9" aria-hidden="true">
                        {data.map((d, index) => (
                            <span
                                key={d.month}
                                className={`min-w-0 flex-1 text-center text-[11px] ${index === latestIndex ? 'font-semibold text-slate-700' : 'text-slate-400'} ${index % 2 ? 'max-sm:invisible' : ''}`}
                            >
                                {d.label}
                            </span>
                        ))}
                    </div>
                </figure>
            )}
        </Card>
    );
}

function ContentMix({ data }) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const max = Math.max(1, ...data.map((d) => d.count));

    return (
        <Card title="Content mix" description="Published posts by category" icon="file-text">
            {total === 0 ? (
                <p className="text-sm text-slate-500">Publish a post to see how your writing splits across topics.</p>
            ) : (
                <>
                    {/* Proportion strip; each segment is separated by a 2px surface gap */}
                    <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
                        {data
                            .filter((d) => d.count > 0)
                            .map((d) => (
                                <span
                                    key={d.category}
                                    style={{ flexGrow: d.count, background: categoryMeta[d.category]?.color ?? '#64748b' }}
                                />
                            ))}
                    </div>
                    <ul className="space-y-4">
                        {data.map((d) => {
                            const percent = Math.round((d.count / total) * 100);
                            return (
                                <li key={d.category}>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex items-center gap-2 font-medium text-slate-700">
                                            <span
                                                className="h-2.5 w-2.5 rounded-sm"
                                                style={{ background: categoryMeta[d.category]?.color ?? '#64748b' }}
                                                aria-hidden="true"
                                            />
                                            {d.label}
                                        </span>
                                        <span className="text-slate-500 tabular-nums">
                                            <span className="font-semibold text-slate-900">{d.count}</span> · {percent}%
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-slate-100" aria-hidden="true">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${(d.count / max) * 100}%`,
                                                background: categoryMeta[d.category]?.color ?? '#64748b',
                                            }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </Card>
    );
}

function ProgressRing({ value }) {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90" aria-hidden="true">
                <defs>
                    <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <circle cx="36" cy="36" r={radius} fill="none" stroke="#ede9fe" strokeWidth="7" />
                <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    fill="none"
                    stroke="url(#ring-gradient)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - value / 100)}
                    className="transition-[stroke-dashoffset] duration-700"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-900">{value}%</span>
        </div>
    );
}

function Completeness({ checklist }) {
    const done = checklist.filter((item) => item.done).length;
    const percent = checklist.length ? Math.round((done / checklist.length) * 100) : 100;

    return (
        <Card title="Profile completeness" icon="check-circle">
            <div className="flex items-center gap-4" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Profile completeness">
                <ProgressRing value={percent} />
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {done} of {checklist.length} done
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {percent === 100 ? 'Your profile is complete. Nice work.' : 'Finish these so visitors and recruiters get the full picture.'}
                    </p>
                </div>
            </div>
            <ul className="-mx-2 space-y-0.5">
                {checklist.map((item) => (
                    <li key={item.label}>
                        {item.done ? (
                            <span className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-slate-400">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                                </span>
                                <span className="line-through decoration-slate-300">{item.label}</span>
                                <span className="sr-only">(done)</span>
                            </span>
                        ) : (
                            <Link
                                href={route(item.route)}
                                className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                            >
                                <span className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300 group-hover:border-violet-400" aria-hidden="true" />
                                <span className="flex-1">{item.label}</span>
                                <Icon name="chevron-right" className="h-4 w-4 text-slate-300 group-hover:text-violet-500" />
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function CurrentRoleCard({ currentRole }) {
    return (
        <Card title="Current role" icon="briefcase">
            {currentRole ? (
                <div>
                    <p className="text-base font-semibold text-slate-900">{currentRole.role}</p>
                    <p className="text-sm text-slate-600">{currentRole.company}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                            <Icon name="calendar" className="h-4 w-4" />
                            Since {formatMonthYear(currentRole.start_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Icon name="clock" className="h-4 w-4" />
                            {formatDuration(currentRole.start_date)}
                        </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Link href={route('admin.experience.edit', currentRole.id)} className={secondaryButtonClass}>
                            <Icon name="pencil" className="h-4 w-4" />
                            Edit
                        </Link>
                        <Link href={route('admin.experience.index')} className={secondaryButtonClass}>
                            All roles
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-slate-500">No current role yet. Add where you work so the site shows it.</p>
                    <Link href={route('admin.experience.create')} className={`${secondaryButtonClass} mt-4`}>
                        <Icon name="plus" className="h-4 w-4" />
                        Add a role
                    </Link>
                </div>
            )}
        </Card>
    );
}

function CvCard({ cv }) {
    return (
        <Card title="CV" icon="file">
            {cv ? (
                <div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">PDF</span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{cv.name}</p>
                            <p className="text-sm text-slate-500" suppressHydrationWarning>Updated {relativeTime(cv.uploaded_at)}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                        <span className="text-2xl font-semibold text-slate-900">{formatNumber(cv.downloads)}</span> downloads
                    </p>
                    <Link href={route('admin.resume.edit')} className={`${secondaryButtonClass} mt-4`}>
                        Manage CV
                        <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-slate-500">Upload a PDF so visitors can download your CV from the site.</p>
                    <Link href={route('admin.resume.edit')} className={`${secondaryButtonClass} mt-4`}>
                        <Icon name="upload" className="h-4 w-4" />
                        Upload CV
                    </Link>
                </div>
            )}
        </Card>
    );
}

export default function Dashboard({
    stats,
    postsByMonth = [],
    postsByCategory = [],
    recentPosts = [],
    recentSubscribers = [],
    currentRole,
    cv,
    photoUrl,
    checklist = [],
}) {
    return (
        <AdminLayout title="Dashboard" description="An overview of your writing, work and audience.">
            <div className="space-y-6">
                <WelcomeBanner photoUrl={photoUrl} stats={stats} />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard label="Published posts" value={formatNumber(stats.publishedPosts)} icon="file-text" href={route('admin.posts.index')}>
                        {plural(stats.drafts, 'draft')}
                        {stats.postsThisMonth > 0 && <span className="font-medium text-emerald-600"> · +{stats.postsThisMonth} this month</span>}
                    </StatCard>
                    <StatCard label="Projects" value={formatNumber(stats.projects)} icon="folder" accent="cyan" href={route('admin.projects.index')}>
                        {stats.liveProjects} live · {stats.featuredProjects} featured
                    </StatCard>
                    <StatCard label="Experience" value={`${stats.yearsExperience} yrs`} icon="briefcase" accent="amber" href={route('admin.experience.index')}>
                        {plural(stats.roles, 'role')} on record
                    </StatCard>
                    <StatCard label="Subscribers" value={formatNumber(stats.subscribers)} icon="mail" accent="green" href={route('admin.subscribers.index')}>
                        {stats.subscribersThisMonth > 0 ? (
                            <span className="font-medium text-emerald-600">+{stats.subscribersThisMonth} this month</span>
                        ) : (
                            'No new signups this month'
                        )}
                    </StatCard>
                    <StatCard label="CV downloads" value={formatNumber(stats.cvDownloads)} icon="download" accent="slate" href={route('admin.resume.edit')}>
                        {cv ? 'Lifetime, across uploads' : 'No CV uploaded yet'}
                    </StatCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="min-w-0 xl:col-span-2">
                        <PublishingChart data={postsByMonth} />
                    </div>
                    <ContentMix data={postsByCategory} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    <Completeness checklist={checklist} />
                    <CurrentRoleCard currentRole={currentRole} />
                    <CvCard cv={cv} />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <Card
                        className="xl:col-span-2"
                        title="Recent posts"
                        description="Most recently edited"
                        icon="file-text"
                        flush
                        actions={
                            <Link href={route('admin.posts.index')} className={secondaryButtonClass}>
                                All posts
                            </Link>
                        }
                    >
                        {recentPosts.length === 0 ? (
                            <p className="px-5 py-5 text-sm text-slate-500">No posts yet.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recentPosts.map((post) => (
                                    <li key={post.id}>
                                        <Link
                                            href={route('admin.posts.edit', post.slug)}
                                            className="flex flex-col gap-2 px-5 py-3.5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">{post.title || 'Untitled'}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">{formatDate(post.date)}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <CategoryBadge category={post.category} />
                                                <StatusBadge published={post.published} />
                                                <Icon name="pencil" className="hidden h-4 w-4 text-slate-300 sm:block" />
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card
                        title="Latest subscribers"
                        icon="users"
                        flush
                        actions={
                            <Link href={route('admin.subscribers.index')} className={secondaryButtonClass}>
                                View all
                            </Link>
                        }
                    >
                        {recentSubscribers.length === 0 ? (
                            <p className="px-5 py-5 text-sm text-slate-500">No subscribers yet. Newsletter signups from the site appear here.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {recentSubscribers.map((subscriber) => (
                                    <li key={subscriber.id} className="flex items-center gap-3 px-5 py-3">
                                        <Avatar name={subscriber.email} size="h-8 w-8" className="!ring-0 text-xs" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">{subscriber.email}</p>
                                            <p className="text-xs text-slate-500" suppressHydrationWarning>{relativeTime(subscriber.created_at)}</p>
                                        </div>
                                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 uppercase">
                                            {subscriber.lang}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
