'use client';

import { route } from '@dashboard/lib/route';
import BlockEditor from '@dashboard/components/Admin/BlockEditor';
import LocalizedInput from '@dashboard/components/Admin/LocalizedInput';
import Icon from '@dashboard/components/Admin/Icon';
import { Card, CoverSwatch, Field, FormActions, buttonClass, checkboxClass, dangerButtonClass, inputClass, secondaryButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { cleanBlocks, commaToList, linesToList, listToComma, listToLines, slugify } from '@dashboard/lib/forms';
import { Link, router, useForm } from '@dashboard/lib/inertia';
import { useState } from 'react';

const bodyLanguages = [
    { key: 'en', label: 'English' },
    { key: 'bn', label: 'বাংলা' },
];

const empty = { en: '', bn: '' };

export default function ProjectForm({ project, options }) {
    const isNew = !project.id;
    const [slugLocked, setSlugLocked] = useState(!isNew);
    const [bodyLang, setBodyLang] = useState('en');

    const form = useForm({
        slug: project.slug ?? '',
        name: project.name,
        summary: project.summary,
        role: project.role ?? empty,
        period: project.period ?? empty,
        highlights: {
            en: listToLines(project.highlights?.en ?? []),
            bn: listToLines(project.highlights?.bn ?? []),
        },
        content: project.content ?? { en: [], bn: [] },
        stackText: listToComma(project.stack),
        status: project.status,
        cover: project.cover ?? '',
        url: project.url ?? '',
        repo: project.repo ?? '',
        sort_order: project.sort_order ?? 0,
        featured: Boolean(project.featured),
    });

    const { data, errors, processing, setData } = form;

    const setName = (name) => {
        setData((current) => ({
            ...current,
            name,
            slug: slugLocked ? current.slug : slugify(name.en),
        }));
    };

    const submit = (event) => {
        event.preventDefault();

        form.transform(({ stackText, ...rest }) => ({
            ...rest,
            stack: commaToList(stackText),
            cover: rest.cover || null,
            highlights: {
                en: linesToList(rest.highlights.en),
                bn: linesToList(rest.highlights.bn),
            },
            content: {
                en: cleanBlocks(rest.content.en ?? []),
                bn: cleanBlocks(rest.content.bn ?? []),
            },
        }));

        if (isNew) {
            form.post(route('admin.projects.store'));
        } else {
            form.put(route('admin.projects.update', project.slug));
        }
    };

    const remove = () => {
        if (window.confirm('Delete this project?')) {
            router.delete(route('admin.projects.destroy', project.slug));
        }
    };

    return (
        <AdminLayout
            title={isNew ? 'New project' : 'Edit project'}
            description={isNew ? 'Showcase something you built.' : data.name?.en || project.slug}
            actions={
                <Link href={route('admin.projects.index')} className={secondaryButtonClass}>
                    <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
                    Back to projects
                </Link>
            }
        >
            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-6">
                    <Card title="Project">
                        <LocalizedInput label="Name" name="name" value={data.name} onChange={setName} errors={errors} />
                        <LocalizedInput
                            label="Summary"
                            name="summary"
                            value={data.summary}
                            onChange={(summary) => setData('summary', summary)}
                            errors={errors}
                            multiline
                            rows={3}
                        />
                    </Card>

                    <Card title="Project details" description="Shown on the project's own page. Everything here is optional.">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <LocalizedInput
                                label="My role"
                                name="role"
                                value={data.role}
                                onChange={(role) => setData('role', role)}
                                errors={errors}
                                required={false}
                                placeholder="Creator · full-stack"
                            />
                            <LocalizedInput
                                label="Timeline"
                                name="period"
                                value={data.period}
                                onChange={(period) => setData('period', period)}
                                errors={errors}
                                required={false}
                                placeholder="2025 – present"
                            />
                        </div>
                        <LocalizedInput
                            label="Highlights"
                            name="highlights"
                            value={data.highlights}
                            onChange={(highlights) => setData('highlights', highlights)}
                            errors={errors}
                            multiline
                            rows={4}
                            required={false}
                            hint="One per line: key features or results."
                        />
                    </Card>

                    <Card
                        title="Write-up"
                        description="The story of the project: the problem, how you built it, and what you learned."
                        actions={
                            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm" role="group" aria-label="Write-up language">
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
                    </Card>

                    <Card title="Links">
                        <Field label="Project URL" error={errors.url} hint="Optional. Leave blank to hide the link.">
                            <input type="url" className={inputClass} value={data.url} onChange={(event) => setData('url', event.target.value)} />
                        </Field>
                        <Field label="Repository URL" error={errors.repo}>
                            <input type="url" className={inputClass} value={data.repo} onChange={(event) => setData('repo', event.target.value)} />
                        </Field>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Visibility">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition has-[:checked]:border-amber-300 has-[:checked]:bg-amber-50/60">
                            <input
                                type="checkbox"
                                className={`${checkboxClass} mt-0.5`}
                                checked={data.featured}
                                onChange={(event) => setData('featured', event.target.checked)}
                            />
                            <span>
                                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                                    <Icon name="star" className="h-4 w-4 text-amber-500" />
                                    Featured on the home page
                                </span>
                                <span className="block text-xs text-slate-500">Featured projects are listed first across the site.</span>
                            </span>
                        </label>
                        {errors.featured && <p className="text-sm text-red-600">{errors.featured}</p>}
                    </Card>

                    <Card title="Details">
                        <Field label="Slug" error={errors.slug}>
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
                        <Field label="Status" error={errors.status}>
                            <select className={inputClass} value={data.status} onChange={(event) => setData('status', event.target.value)}>
                                {options.statuses.map((status) => (
                                    <option key={status} value={status} className="capitalize">{status}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Stack" htmlFor="stack" error={errors.stack} hint="Separate technologies with commas.">
                            <input id="stack" name="stack" className={inputClass} value={data.stackText} onChange={(event) => setData('stackText', event.target.value)} />
                        </Field>
                        <Field label="Cover" error={errors.cover}>
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
                        <Field label="Display order" error={errors.sort_order} hint="Lower numbers appear first.">
                            <input
                                type="number"
                                min={0}
                                className={inputClass}
                                value={data.sort_order}
                                onChange={(event) => setData('sort_order', event.target.value)}
                            />
                        </Field>
                    </Card>

                    <FormActions>
                        <button type="submit" className={buttonClass} disabled={processing}>
                            <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                            {isNew ? 'Create project' : 'Save changes'}
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
