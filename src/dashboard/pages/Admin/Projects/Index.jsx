'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import { Badge, Card, CoverSwatch, EmptyState, Table, buttonClass, iconButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { Link, router } from '@dashboard/lib/inertia';

const statusTone = { live: 'green', 'in progress': 'blue', archived: 'gray' };

export default function ProjectsIndex({ projects }) {
    const remove = (project) => {
        if (window.confirm(`Delete “${project.name}”?`)) {
            router.delete(route('admin.projects.destroy', project.slug), { preserveScroll: true });
        }
    };

    const featuredCount = projects.filter((project) => project.featured).length;

    return (
        <AdminLayout
            title="Projects"
            description={
                projects.length
                    ? `${projects.length} projects · ${featuredCount} featured on the home page`
                    : 'Things you have built.'
            }
            actions={
                <Link href={route('admin.projects.create')} className={buttonClass}>
                    <Icon name="plus" className="h-4 w-4" strokeWidth={2.25} />
                    New project
                </Link>
            }
        >
            {projects.length === 0 ? (
                <EmptyState
                    icon="folder"
                    title="No projects yet"
                    description="Add a project to show it on your portfolio."
                    action={
                        <Link href={route('admin.projects.create')} className={buttonClass}>
                            Add a project
                        </Link>
                    }
                />
            ) : (
                <Card flush>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Stack</th>
                                <th>Status</th>
                                <th className="text-right">Order</th>
                                <th className="text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <div className="flex min-w-[14rem] items-center gap-3">
                                            <CoverSwatch cover={project.cover} />
                                            <div className="min-w-0">
                                                <Link
                                                    href={route('admin.projects.edit', project.slug)}
                                                    className="font-medium text-slate-900 hover:text-violet-700"
                                                >
                                                    {project.name}
                                                </Link>
                                                {project.featured && (
                                                    <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-amber-700">
                                                        <Icon name="star" className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex max-w-xs flex-wrap gap-1">
                                            {project.stack.slice(0, 4).map((item) => (
                                                <span key={item} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                                                    {item}
                                                </span>
                                            ))}
                                            {project.stack.length > 4 && (
                                                <span className="px-1 py-0.5 text-xs text-slate-400">+{project.stack.length - 4}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge tone={statusTone[project.status] ?? 'gray'} dot className="capitalize">
                                            {project.status}
                                        </Badge>
                                    </td>
                                    <td className="text-right text-slate-600 tabular-nums">{project.sort_order}</td>
                                    <td>
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route('admin.projects.edit', project.slug)}
                                                className={iconButtonClass}
                                                aria-label={`Edit ${project.name}`}
                                                title="Edit"
                                            >
                                                <Icon name="pencil" className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                className={`${iconButtonClass} hover:!bg-red-50 hover:!text-red-600`}
                                                onClick={() => remove(project)}
                                                aria-label={`Delete ${project.name}`}
                                                title="Delete"
                                            >
                                                <Icon name="trash" className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}
        </AdminLayout>
    );
}
