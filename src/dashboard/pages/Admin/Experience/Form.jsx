'use client';

import { route } from '@dashboard/lib/route';
import Icon from '@dashboard/components/Admin/Icon';
import LocalizedInput from '@dashboard/components/Admin/LocalizedInput';
import {
    Card,
    Field,
    FormActions,
    buttonClass,
    checkboxClass,
    dangerButtonClass,
    inputClass,
    secondaryButtonClass,
} from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { commaToList, linesToList, listToComma, listToLines } from '@dashboard/lib/forms';
import { formatDuration } from '@dashboard/lib/format';
import { Link, router, useForm } from '@dashboard/lib/inertia';

const empty = { en: '', bn: '' };
const typeLabel = (type = '') => type.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase());

// Collects per-line errors such as "highlights.en.0" into one message per language.
function highlightErrors(errors) {
    const collected = {};
    Object.entries(errors).forEach(([key, message]) => {
        const match = /^highlights\.(en|bn)(\.\d+)?$/.exec(key);
        if (match && !collected[`highlights.${match[1]}`]) {
            collected[`highlights.${match[1]}`] = match[2] ? `Line ${Number(match[2].slice(1)) + 1}: ${message}` : message;
        }
    });
    return collected;
}

export default function ExperienceForm({ experience, options }) {
    const isNew = !experience.id;

    const form = useForm({
        company: experience.company ?? '',
        company_url: experience.company_url ?? '',
        role: experience.role ?? empty,
        employment_type: experience.employment_type ?? options.employmentTypes[0],
        location: experience.location ?? empty,
        start_date: experience.start_date ?? '',
        end_date: experience.end_date ?? '',
        current: Boolean(experience.current),
        summary: experience.summary ?? empty,
        highlights: {
            en: listToLines(experience.highlights?.en ?? []),
            bn: listToLines(experience.highlights?.bn ?? []),
        },
        stackText: listToComma(experience.stack ?? []),
    });

    const { data, errors, processing, setData } = form;

    const submit = (event) => {
        event.preventDefault();

        form.transform(({ stackText, ...rest }) => ({
            ...rest,
            end_date: rest.current ? null : rest.end_date || null,
            highlights: {
                en: linesToList(rest.highlights.en),
                bn: linesToList(rest.highlights.bn),
            },
            stack: commaToList(stackText),
        }));

        if (isNew) {
            form.post(route('admin.experience.store'));
        } else {
            form.put(route('admin.experience.update', experience.id));
        }
    };

    const remove = () => {
        if (window.confirm('Delete this role?')) {
            router.delete(route('admin.experience.destroy', experience.id));
        }
    };

    const duration = data.start_date ? formatDuration(data.start_date, data.current ? null : data.end_date || null) : '';
    const stackPreview = commaToList(data.stackText);

    return (
        <AdminLayout
            title={isNew ? 'Add role' : 'Edit role'}
            description={isNew ? 'A position in your work history.' : `${data.role?.en || 'Role'} at ${data.company}`}
            actions={
                <Link href={route('admin.experience.index')} className={secondaryButtonClass}>
                    <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
                    Back to experience
                </Link>
            }
        >
            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-6">
                    <Card title="Role" icon="briefcase">
                        <LocalizedInput
                            label="Job title"
                            name="role"
                            value={data.role}
                            onChange={(role) => setData('role', role)}
                            errors={errors}
                            placeholder="Senior Software Engineer"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Company" htmlFor="company" error={errors.company}>
                                <input
                                    id="company"
                                    name="company"
                                    className={inputClass}
                                    value={data.company}
                                    onChange={(event) => setData('company', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field label="Company website" htmlFor="company_url" error={errors.company_url} hint="Optional.">
                                <input
                                    id="company_url"
                                    name="company_url"
                                    type="url"
                                    placeholder="https://"
                                    className={inputClass}
                                    value={data.company_url}
                                    onChange={(event) => setData('company_url', event.target.value)}
                                />
                            </Field>
                        </div>
                        <LocalizedInput
                            label="Location"
                            name="location"
                            value={data.location}
                            onChange={(location) => setData('location', location)}
                            errors={errors}
                            required={false}
                            placeholder="Dhaka, Bangladesh · Remote"
                            hint="Optional."
                        />
                    </Card>

                    <Card title="What you did" icon="file-text">
                        <LocalizedInput
                            label="Summary"
                            name="summary"
                            value={data.summary}
                            onChange={(summary) => setData('summary', summary)}
                            errors={errors}
                            multiline
                            rows={3}
                            hint="One or two sentences about the role and team."
                        />
                        <LocalizedInput
                            label="Highlights"
                            name="highlights"
                            value={data.highlights}
                            onChange={(highlights) => setData('highlights', highlights)}
                            errors={{ ...errors, ...highlightErrors(errors) }}
                            multiline
                            rows={5}
                            required={false}
                            hint="One achievement per line. Empty lines are removed when you save."
                        />
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Dates & type" icon="calendar">
                        <Field label="Employment type" htmlFor="employment_type" error={errors.employment_type}>
                            <select
                                id="employment_type"
                                className={inputClass}
                                value={data.employment_type}
                                onChange={(event) => setData('employment_type', event.target.value)}
                            >
                                {options.employmentTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {typeLabel(type)}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Start date" htmlFor="start_date" error={errors.start_date}>
                            <input
                                id="start_date"
                                type="date"
                                className={inputClass}
                                value={data.start_date}
                                onChange={(event) => setData('start_date', event.target.value)}
                                required
                            />
                        </Field>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-800 transition has-[:checked]:border-emerald-300 has-[:checked]:bg-emerald-50/60">
                            <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={data.current}
                                onChange={(event) => setData('current', event.target.checked)}
                            />
                            I currently work here
                        </label>
                        {errors.current && <p className="text-sm text-red-600">{errors.current}</p>}
                        {!data.current && (
                            <Field label="End date" htmlFor="end_date" error={errors.end_date}>
                                <input
                                    id="end_date"
                                    type="date"
                                    className={inputClass}
                                    min={data.start_date || undefined}
                                    value={data.end_date}
                                    onChange={(event) => setData('end_date', event.target.value)}
                                    required
                                />
                            </Field>
                        )}
                        {duration && (
                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Icon name="clock" className="h-3.5 w-3.5" />
                                {duration}
                                {data.current ? ' so far' : ''}
                            </p>
                        )}
                    </Card>

                    <Card title="Stack" icon="sparkles">
                        <Field label="Technologies" htmlFor="stack" error={errors.stack} hint="Separate technologies with commas.">
                            <input
                                id="stack"
                                name="stack"
                                className={inputClass}
                                value={data.stackText}
                                placeholder="Laravel, React, PostgreSQL"
                                onChange={(event) => setData('stackText', event.target.value)}
                            />
                        </Field>
                        {stackPreview.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {stackPreview.map((item) => (
                                    <span key={item} className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card>

                    <FormActions>
                        <button type="submit" className={buttonClass} disabled={processing}>
                            <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                            {isNew ? 'Add role' : 'Save changes'}
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
