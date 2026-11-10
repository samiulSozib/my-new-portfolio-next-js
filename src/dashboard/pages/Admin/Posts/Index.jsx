'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import {
    Card,
    CategoryBadge,
    CoverSwatch,
    EmptyState,
    Pagination,
    StatusBadge,
    Table,
    buttonClass,
    iconButtonClass,
} from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { formatDate } from '@dashboard/lib/format';
import { Link, router } from '@dashboard/lib/inertia';

export default function PostsIndex({ posts }) {
    const remove = (post) => {
        if (window.confirm(`Delete “${post.title}”? This cannot be undone.`)) {
            router.delete(route('admin.posts.destroy', post.slug), { preserveScroll: true });
        }
    };

    const newPost = (
        <Link href={route('admin.posts.create')} className={buttonClass}>
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.25} />
            New post
        </Link>
    );

    return (
        <AdminLayout title="Posts" description="Articles about AI, coding and engineering." actions={newPost}>
            {posts.data.length === 0 ? (
                <EmptyState
                    icon="file-text"
                    title="No posts yet"
                    description="Your articles appear on the blog once published."
                    action={
                        <Link href={route('admin.posts.create')} className={buttonClass}>
                            Write the first post
                        </Link>
                    }
                />
            ) : (
                <Card flush>
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div className="flex min-w-[16rem] items-center gap-3">
                                            <CoverSwatch cover={post.cover} />
                                            <div className="min-w-0">
                                                <Link
                                                    href={route('admin.posts.edit', post.slug)}
                                                    className="font-medium text-slate-900 hover:text-violet-700"
                                                >
                                                    {post.title || 'Untitled'}
                                                </Link>
                                                <p className="truncate text-xs text-slate-500">/{post.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <CategoryBadge category={post.category} />
                                    </td>
                                    <td className="whitespace-nowrap text-slate-600 tabular-nums">{formatDate(post.date)}</td>
                                    <td>
                                        <StatusBadge published={post.published} />
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route('admin.posts.edit', post.slug)}
                                                className={iconButtonClass}
                                                aria-label={`Edit ${post.title}`}
                                                title="Edit"
                                            >
                                                <Icon name="pencil" className="h-4 w-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                className={`${iconButtonClass} hover:!bg-red-50 hover:!text-red-600`}
                                                onClick={() => remove(post)}
                                                aria-label={`Delete ${post.title}`}
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
            <Pagination links={posts.links} />
        </AdminLayout>
    );
}
