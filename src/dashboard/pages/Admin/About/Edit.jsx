'use client';

import { route } from '@dashboard/lib/route';
import LocalizedInput from '@dashboard/components/Admin/LocalizedInput';
import Icon from '@dashboard/components/Admin/Icon';
import { Callout, Card, Field, FormActions, buttonClass, iconButtonClass, inputClass, secondaryButtonClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { commaToList, linesToList, listToComma, listToLines } from '@dashboard/lib/forms';
import { Link, useForm } from '@dashboard/lib/inertia';

const empty = { en: '', bn: '' };

// Moves an item up or down, or returns the list unchanged when the move is off the end.
function moved(list, index, direction) {
    const target = index + direction;
    if (target < 0 || target >= list.length) return list;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
}

// A list of editable items with add, remove, and reorder controls.
function Repeater({ title, description, icon, items, onChange, createItem, addLabel, itemLabel, children }) {
    return (
        <Card
            title={title}
            description={description}
            icon={icon}
            actions={
                <button type="button" className={secondaryButtonClass} onClick={() => onChange([...items, createItem()])}>
                    <Icon name="plus" className="h-4 w-4" />
                    {addLabel}
                </button>
            }
        >
            {items.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">Nothing here yet.</p>
            )}
            {items.map((item, index) => (
                <div key={index} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            {itemLabel} {index + 1}
                        </span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                className={iconButtonClass}
                                onClick={() => onChange(moved(items, index, -1))}
                                disabled={index === 0}
                                aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
                            >
                                <Icon name="arrow-up" className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className={iconButtonClass}
                                onClick={() => onChange(moved(items, index, 1))}
                                disabled={index === items.length - 1}
                                aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
                            >
                                <Icon name="arrow-down" className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className={`${iconButtonClass} hover:!bg-red-50 hover:!text-red-600`}
                                onClick={() => onChange(items.filter((_, i) => i !== index))}
                                aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                            >
                                <Icon name="trash" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {children(item, (next) => onChange(items.map((current, i) => (i === index ? next : current))), index)}
                </div>
            ))}
        </Card>
    );
}

// Older data stored education as one object; the form always edits a list.
const toEducationList = (education) => {
    if (Array.isArray(education)) return education;
    if (education && typeof education === 'object' && (education.degree || education.school)) return [education];
    return [];
};

export default function AboutEdit({ profile }) {
    const form = useForm({
        role: profile.role ?? empty,
        location: profile.location ?? empty,
        languages: profile.languages ?? empty,
        yearsInSoftware: profile.yearsInSoftware ?? 0,
        story: {
            en: listToLines(profile.story?.en ?? []),
            bn: listToLines(profile.story?.bn ?? []),
        },
        skills: (profile.skills ?? []).map((skill) => ({ name: skill.name, items: listToComma(skill.items) })),
        principles: profile.principles ?? [],
        education: toEducationList(profile.education).map((item) => ({
            degree: item.degree ?? { ...empty },
            school: item.school ?? { ...empty },
            period: item.period ?? { ...empty },
        })),
    });

    const { data, errors, processing, setData } = form;

    const submit = (event) => {
        event.preventDefault();

        form.transform((values) => ({
            ...values,
            story: {
                en: linesToList(values.story.en),
                bn: linesToList(values.story.bn),
            },
            skills: values.skills.map((skill) => ({
                name: skill.name,
                items: commaToList(skill.items),
            })),
        }));
        form.put(route('admin.about.update'));
    };

    const newSkill = () => ({ name: { ...empty }, items: '' });
    const newPrinciple = () => ({ title: { ...empty }, body: { ...empty } });
    const newEducation = () => ({ degree: { ...empty }, school: { ...empty }, period: { ...empty } });

    return (
        <AdminLayout title="About & skills" description="Your story, skills, principles and education on the About page.">
            <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
                <Card title="Profile basics" icon="user">
                    <LocalizedInput label="Role" name="role" value={data.role} onChange={(v) => setData('role', v)} errors={errors} />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <LocalizedInput label="Location" name="location" value={data.location} onChange={(v) => setData('location', v)} errors={errors} />
                        <Field label="Years in software" error={errors.yearsInSoftware}>
                            <input
                                type="number"
                                min={0}
                                className={inputClass}
                                value={data.yearsInSoftware}
                                onChange={(e) => setData('yearsInSoftware', e.target.value)}
                            />
                        </Field>
                    </div>
                    <LocalizedInput label="Languages" name="languages" value={data.languages} onChange={(v) => setData('languages', v)} errors={errors} />
                </Card>

                <Card title="Story" description="One paragraph per line." icon="file-text">
                    <LocalizedInput
                        label="Story"
                        name="story"
                        value={data.story}
                        onChange={(v) => setData('story', v)}
                        errors={errors}
                        multiline
                        rows={6}
                    />
                </Card>

                <Callout icon="briefcase">
                    Work history now lives in its own section, with dates, highlights and tech stack per role.{' '}
                    <Link href={route('admin.experience.index')} className="font-semibold underline underline-offset-2 hover:text-violet-700">
                        Manage experience →
                    </Link>
                </Callout>


                <Repeater
                    title="Skills"
                    icon="sparkles"
                    itemLabel="Group"
                    items={data.skills}
                    onChange={(list) => setData('skills', list)}
                    createItem={newSkill}
                    addLabel="Add skill group"
                >
                    {(skill, update, index) => (
                        <>
                            <LocalizedInput label="Group name" name={`skills.${index}.name`} value={skill.name} onChange={(v) => update({ ...skill, name: v })} errors={errors} />
                            <Field label="Items" error={errors[`skills.${index}.items`]} hint="Separate items with commas.">
                                <input className={inputClass} value={skill.items} onChange={(e) => update({ ...skill, items: e.target.value })} />
                            </Field>
                        </>
                    )}
                </Repeater>

                <Repeater
                    title="Principles"
                    icon="check-circle"
                    itemLabel="Principle"
                    items={data.principles}
                    onChange={(list) => setData('principles', list)}
                    createItem={newPrinciple}
                    addLabel="Add principle"
                >
                    {(principle, update, index) => (
                        <>
                            <LocalizedInput label="Title" name={`principles.${index}.title`} value={principle.title} onChange={(v) => update({ ...principle, title: v })} errors={errors} />
                            <LocalizedInput label="Body" name={`principles.${index}.body`} value={principle.body} onChange={(v) => update({ ...principle, body: v })} errors={errors} multiline rows={2} />
                        </>
                    )}
                </Repeater>

                <Repeater
                    title="Education"
                    icon="calendar"
                    itemLabel="Entry"
                    items={data.education}
                    onChange={(list) => setData('education', list)}
                    createItem={newEducation}
                    addLabel="Add education"
                >
                    {(item, update, index) => (
                        <>
                            <LocalizedInput label="Degree" name={`education.${index}.degree`} value={item.degree} onChange={(v) => update({ ...item, degree: v })} errors={errors} />
                            <LocalizedInput label="School" name={`education.${index}.school`} value={item.school} onChange={(v) => update({ ...item, school: v })} errors={errors} />
                            <LocalizedInput label="Period" name={`education.${index}.period`} value={item.period} onChange={(v) => update({ ...item, period: v })} errors={errors} placeholder="2012 – 2016" />
                        </>
                    )}
                </Repeater>

                <FormActions>
                    <button type="submit" className={buttonClass} disabled={processing}>
                        <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                        Save About page
                    </button>
                </FormActions>
            </form>
        </AdminLayout>
    );
}
