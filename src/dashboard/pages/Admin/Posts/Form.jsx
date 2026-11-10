'use client';

import { route } from '@dashboard/lib/route';
import BlockEditor from '@dashboard/components/Admin/BlockEditor';
import LocalizedInput from '@dashboard/components/Admin/LocalizedInput';
import Icon from '@dashboard/components/Admin/Icon';
import { Card, CoverSwatch, Field, FormActions, buttonClass, checkboxClass, dangerButtonClass, inputClass, secondaryButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { cleanBlocks, commaToList, listToComma, slugify } from '@dashboard/lib/forms';
import { Link, router, useForm } from '@dashboard/lib/inertia';
import { useState } from 'react';

const bodyLanguages = [
    { key: 'en', label: 'English body' },
    { key: 'bn', label: 'বাংলা বডি' },
];

export default function PostForm({ post, options }) {
    const isNew = !post.id;
    const [bodyLang, setBodyLang] = useState('en');
    const [slugLocked, setSlugLocked] = useState(!isNew);

    const form = useForm({
        slug: post.slug ?? '',
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        tagsText: listToComma(post.tags),
        cover: post.cover ?? '',
        published: post.published,
        content: post.content,
    });

    const { data, errors, processing, setData } = form;

    const setTitle = (title) => {
        setData((current) => ({
            ...current,
            title,
            slug: slugLocked ? current.slug : slugify(title.en),
        }));
    };

    const submit = (event) => {
        event.preventDefault();

        form.transform(({ tagsText, ...rest }) => ({
            ...rest,
            tags: commaToList(tagsText),
            cover: rest.cover || null,
            content: {
                en: cleanBlocks(rest.content.en),
                bn: cleanBlocks(rest.content.bn),
            },
        }));

        if (isNew) {
            form.post(route('admin.posts.store'));
        } else {
            form.put(route('admin.posts.update', post.slug));
        }
    };

    const remove = () => {
        if (window.confirm('Delete this post? This cannot be undone.')) {
            router.delete(route('admin.posts.destroy', post.slug));
        }
    };

    return (
        <AdminLayout
            title={isNew ? 'New post' : 'Edit post'}
            description={isNew ? 'Draft a new article for the blog.' : data.title?.en || post.slug}
            actions={
                <Link href={route('admin.posts.index')} className={secondaryButtonClass}>
                    <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
                    Back to posts
                </Link>
            }
        >
            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-6">
                    <Card title="Title and summary">
                        <LocalizedInput
                            label="Title"
                            name="title"
                            value={data.title}
                            onChange={setTitle}
                            errors={errors}
                        />
                        <LocalizedInput
                            label="Excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            onChange={(excerpt) => setData('excerpt', excerpt)}
                            errors={errors}
                            multiline
                            rows={2}
                            hint="Shown on listings and in search results."
                        />
                    </Card>

                    <Card
                        title="Article body"
                        description="Blocks appear in order on the post page. Write each language separately."
                        actions={
                            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm" role="group" aria-label="Body language">
                                {bodyLanguages.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setBodyLang(key)}
                                        aria-pressed={bodyLang === key}
                                        className={`rounded-md px-3 py-1 font-medium transition ${bodyLang === key ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <BlockEditor
                            key={bodyLang}
                            prefix={`content.${bodyLang}`}
                            blocks={data.content[bodyLang] ?? []}
                            blockTypes={options.blockTypes}
                            errors={errors}
                            onChange={(blocks) => setData('content', { ...data.content, [bodyLang]: blocks })}
                        />
                        {errors[`content.${bodyLang}`] && (
                            <p className="text-sm text-red-600">{errors[`content.${bodyLang}`]}</p>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Publishing">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition has-[:checked]:border-emerald-300 has-[:checked]:bg-emerald-50/60">
                            <input
                                type="checkbox"
                                className={`${checkboxClass} mt-0.5`}
                                checked={data.published}
                                onChange={(event) => setData('published', event.target.checked)}
                            />
                            <span>
                                <span className="block text-sm font-medium text-slate-900">Published</span>
                                <span className="block text-xs text-slate-500">Drafts are hidden from the site, feed and sitemap.</span>
                            </span>
                        </label>

                        <Field label="Slug" error={errors.slug} hint="Used in the URL. Changing it breaks existing links.">
                            <input
                                id="slug"
                                name="slug"
                                className={inputClass}
                                value={data.slug}
                                onFocus={() => setSlugLocked(true)}
                                onChange={(event) => setData('slug', event.target.value)}
                                required
                            />
                        </Field>

                        <Field label="Date" error={errors.date}>
                            <input
                                type="date"
                                className={inputClass}
                                value={data.date}
                                onChange={(event) => setData('date', event.target.value)}
                                required
                            />
                        </Field>

                        <Field label="Category" error={errors.category}>
                            <select
                                className={inputClass}
                                value={data.category}
                                onChange={(event) => setData('category', event.target.value)}
                            >
                                {options.categories.map((category) => (
                                    <option key={category} value={category}>
                                        {options.categoryLabels?.[category] ?? category}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Cover" error={errors.cover} hint="Generated artwork shown on cards and the post header.">
                            <div className="mt-2 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Cover">
                                {['', ...options.covers].map((cover) => (
                                    <button
                                        key={cover || 'none'}
                                        type="button"
                                        role="radio"
                                        aria-checked={data.cover === cover}
                                        onClick={() => setData('cover', cover)}
                                        className={`flex flex-col items-center gap-1 rounded-lg p-1 text-[11px] capitalize transition ${
                                            data.cover === cover ? 'bg-violet-50 font-semibold text-violet-700 ring-2 ring-violet-500' : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <CoverSwatch cover={cover || null} size="h-9 w-full" />
                                        {cover || 'None'}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <Field label="Tags" error={errors.tags} hint="Separate tags with commas.">
                            <input
                                className={inputClass}
                                value={data.tagsText}
                                onChange={(event) => setData('tagsText', event.target.value)}
                            />
                        </Field>
                    </Card>


                    <FormActions>
                        <button type="submit" className={buttonClass} disabled={processing}>
                            <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                            {isNew ? 'Create post' : 'Save changes'}
                        </button>
                        {!isNew && (
                            <button type="button" className={dangerButtonClass} onClick={remove}>
                                <Icon name="trash" className="h-4 w-4" />
                                Delete
                            </button>
                        )}
                    </FormActions>
                </div>
            </form>
        </AdminLayout>
    );
}
