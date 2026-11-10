'use client';

import { route } from '@dashboard/lib/route';
import LocalizedInput from '@dashboard/components/Admin/LocalizedInput';
import Icon from '@dashboard/components/Admin/Icon';
import { Card, Field, FormActions, buttonClass, inputClass } from '@dashboard/components/Admin/ui';
import AdminLayout from '@dashboard/layouts/AdminLayout';
import { linesToList, listToLines } from '@dashboard/lib/forms';
import { useForm } from '@dashboard/lib/inertia';

export default function SiteEdit({ site }) {
    const form = useForm({
        name: site.name ?? { en: '', bn: '' },
        title: site.title ?? { en: '', bn: '' },
        description: site.description ?? { en: '', bn: '' },
        intro: site.intro ?? { en: '', bn: '' },
        about: site.about ?? { en: '', bn: '' },
        availability: { en: site.availability?.en ?? '', bn: site.availability?.bn ?? '' },
        interests: {
            en: listToLines(site.interests?.en ?? []),
            bn: listToLines(site.interests?.bn ?? []),
        },
        email: site.email ?? '',
        social: {
            github: site.social?.github ?? '',
            linkedin: site.social?.linkedin ?? '',
            x: site.social?.x ?? '',
        },
        year: site.year ?? new Date().getFullYear(),
    });

    const { data, errors, processing, setData } = form;

    const submit = (event) => {
        event.preventDefault();

        form.transform((values) => ({
            ...values,
            interests: {
                en: linesToList(values.interests.en),
                bn: linesToList(values.interests.bn),
            },
        }));
        form.put(route('admin.site.update'));
    };

    return (
        <AdminLayout title="Site settings" description="Identity, home page copy and contact links for the public site.">
            <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
                <Card title="Identity" description="Shown in the header, footer, page titles and search previews." icon="globe">
                    <LocalizedInput label="Name" name="name" value={data.name} onChange={(v) => setData('name', v)} errors={errors} />
                    <LocalizedInput label="Page title" name="title" value={data.title} onChange={(v) => setData('title', v)} errors={errors} />
                    <LocalizedInput
                        label="Description"
                        name="description"
                        value={data.description}
                        onChange={(v) => setData('description', v)}
                        errors={errors}
                        multiline
                        rows={2}
                        hint="Used by search engines and link previews."
                    />
                </Card>

                <Card title="Home page" description="The hero section visitors see first." icon="home">
                    <LocalizedInput label="Intro" name="intro" value={data.intro} onChange={(v) => setData('intro', v)} errors={errors} multiline rows={3} />
                    <LocalizedInput label="About line" name="about" value={data.about} onChange={(v) => setData('about', v)} errors={errors} multiline rows={3} />
                    <LocalizedInput
                        label="Availability"
                        name="availability"
                        value={data.availability}
                        onChange={(v) => setData('availability', v)}
                        errors={errors}
                        required={false}
                        placeholder="Open to new opportunities"
                        hint="Shown as a status badge in the hero. Leave empty to hide the badge."
                    />
                    <LocalizedInput
                        label="Focus areas"
                        name="interests"
                        value={data.interests}
                        onChange={(v) => setData('interests', v)}
                        errors={errors}
                        multiline
                        rows={4}
                        hint="Focus areas (one per line, shown in the hero animation)."
                    />
                </Card>

                <Card title="Contact and links" description="Leave a link empty to hide it everywhere." icon="link">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Email" error={errors.email}>
                            <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </Field>
                        <Field label="Copyright year" error={errors.year}>
                            <input type="number" className={inputClass} value={data.year} onChange={(e) => setData('year', e.target.value)} />
                        </Field>
                        {['github', 'linkedin', 'x'].map((network) => (
                            <Field key={network} label={network === 'x' ? 'X (Twitter)' : network[0].toUpperCase() + network.slice(1)} error={errors[`social.${network}`]}>
                                <input
                                    type="url"
                                    className={inputClass}
                                    value={data.social[network]}
                                    onChange={(e) => setData('social', { ...data.social, [network]: e.target.value })}
                                />
                            </Field>
                        ))}
                    </div>
                </Card>

                <FormActions>
                    <button type="submit" className={buttonClass} disabled={processing}>
                        <Icon name="check" className="h-4 w-4" strokeWidth={2.25} />
                        Save site settings
                    </button>
                </FormActions>
            </form>
        </AdminLayout>
    );
}
