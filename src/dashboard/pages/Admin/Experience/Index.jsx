'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import { Badge, Card, EmptyState, buttonClass, iconButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { formatDuration, formatRange } from '@dashboard/lib/format';
import { Link, router } from '@dashboard/lib/inertia';

const typeLabel = (type = '') => type.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase());

export default function ExperienceIndex({ experiences = [] }) {
    const remove = (experience) => {
        if (window.confirm(`Delete “${experience.role}” at ${experience.company}?`)) {
            router.delete(route('admin.experience.destroy', experience.id), { preserveScroll: true });
        }
    };

    const addButton = (label = 'Add role') => (
        <Link href={route('admin.experience.create')} className={buttonClass}>
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.25} />
            {label}
        </Link>
    );

    return (
        <AdminLayout
            title="Experience"
            description="Your work history as shown on the site. Current roles come first."
            actions={experiences.length > 0 && addButton()}
        >
            {experiences.length === 0 ? (
                <EmptyState
                    icon="briefcase"
                    title="No work experience yet"
                    description="Add the roles you have held so visitors can follow your career."
                    action={addButton('Add your first role')}
                />
            ) : (
                <Card className="mx-auto max-w-4xl" bodyClassName="px-5 py-6 sm:px-6">
                    <ol className="relative">
                        {experiences.map((experience, index) => {
                            const current = !experience.end_date;
                            const last = index === experiences.length - 1;

                            return (
                                <li key={experience.id} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5">
                                    {/* Rail and node */}
                                    <div className="relative flex w-10 shrink-0 justify-center">
                                        {!last && <span className="absolute top-10 bottom-[-0.25rem] w-px bg-slate-200" aria-hidden="true" />}
                                        <span
                                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
                                                current
                                                    ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-600/25'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                            aria-hidden="true"
                                        >
                                            {experience.company?.[0]?.toUpperCase() ?? '•'}
                                        </span>
                                    </div>

                                    <div className="group min-w-0 flex-1 rounded-xl border border-transparent p-3 -m-3 transition hover:border-slate-200 hover:bg-slate-50/60">
                                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">{experience.role}</h3>
                                                    {current && (
                                                        <Badge tone="green" dot>
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-sm text-slate-600">
                                                    {experience.company}
                                                    {experience.employment_type && (
                                                        <span className="text-slate-400"> · {typeLabel(experience.employment_type)}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Link
                                                    href={route('admin.experience.edit', experience.id)}
                                                    className={iconButtonClass}
                                                    aria-label={`Edit ${experience.role} at ${experience.company}`}
                                                    title="Edit"
                                                >
                                                    <Icon name="pencil" className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className={`${iconButtonClass} hover:!bg-red-50 hover:!text-red-600`}
                                                    onClick={() => remove(experience)}
                                                    aria-label={`Delete ${experience.role} at ${experience.company}`}
                                                    title="Delete"
                                                >
                                                    <Icon name="trash" className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Icon name="calendar" className="h-4 w-4" />
                                                {formatRange(experience.start_date, experience.end_date)}
                                                <span className="text-slate-400">· {formatDuration(experience.start_date, experience.end_date)}</span>
                                            </span>
                                            {experience.location && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Icon name="map-pin" className="h-4 w-4" />
                                                    {experience.location}
                                                </span>
                                            )}
                                        </div>

                                        {experience.stack?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {experience.stack.map((item) => (
                                                    <span
                                                        key={item}
                                                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </Card>
            )}
        </AdminLayout>
    );
}
