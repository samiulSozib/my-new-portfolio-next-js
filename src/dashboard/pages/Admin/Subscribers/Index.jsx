'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import { Avatar, Badge, Card, EmptyState, Pagination, Table, iconButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { formatDate } from '@dashboard/lib/format';
import { router } from '@dashboard/lib/inertia';

export default function SubscribersIndex({ subscribers }) {
    const remove = (subscriber) => {
        if (window.confirm(`Remove ${subscriber.email} from the list?`)) {
            router.delete(route('admin.subscribers.destroy', subscriber.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Subscribers"
            description={subscribers.total ? `${subscribers.total} people signed up through the site.` : 'Newsletter signups from the site.'}
        >
            {subscribers.data.length === 0 ? (
                <EmptyState
                    icon="mail"
                    title="No subscribers yet"
                    description="When visitors sign up for the newsletter on your site, they appear here."
                />
            ) : (
                <Card flush>
                    <Table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Language</th>
                                <th>Source</th>
                                <th>Signed up</th>
                                <th className="text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.data.map((subscriber) => (
                                <tr key={subscriber.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={subscriber.email} size="h-8 w-8" className="!ring-0 text-xs" />
                                            <a href={`mailto:${subscriber.email}`} className="font-medium text-slate-900 hover:text-violet-700">
                                                {subscriber.email}
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge tone={subscriber.lang === 'bn' ? 'cyan' : 'violet'} className="uppercase">
                                            {subscriber.lang}
                                        </Badge>
                                    </td>
                                    <td className="text-slate-600">{subscriber.source ?? '—'}</td>
                                    <td className="whitespace-nowrap text-slate-600 tabular-nums">{formatDate(subscriber.created_at)}</td>
                                    <td>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className={`${iconButtonClass} hover:!bg-red-50 hover:!text-red-600`}
                                                onClick={() => remove(subscriber)}
                                                aria-label={`Remove ${subscriber.email}`}
                                                title="Remove"
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
            <Pagination links={subscribers.links} />
        </AdminLayout>
    );
}
