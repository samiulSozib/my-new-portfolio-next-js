import { Field, inputClass } from '@dashboard/components/Admin/ui';

const languages = [
    { key: 'en', label: 'English' },
    { key: 'bn', label: 'বাংলা' },
];

// Two side-by-side fields for one bilingual value, stored as { en, bn }.
// Errors are keyed the way Laravel reports them, for example "title.en".
export default function LocalizedInput({
    label,
    name,
    value,
    onChange,
    errors = {},
    multiline = false,
    rows = 3,
    hint,
    required = true,
    placeholder,
}) {
    const current = value ?? { en: '', bn: '' };

    return (
        <Field label={label} hint={hint} className="space-y-1">
            <div className="grid gap-4 sm:grid-cols-2">
                {languages.map(({ key, label: languageLabel }) => {
                    const fieldName = `${name}.${key}`;
                    const common = {
                        id: fieldName,
                        name: fieldName,
                        value: current[key] ?? '',
                        required: required && key === 'en',
                        placeholder,
                        className: inputClass,
                        onChange: (event) => onChange({ ...current, [key]: event.target.value }),
                    };

                    return (
                        <div key={key}>
                            <label htmlFor={fieldName} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                {languageLabel}
                            </label>
                            {multiline ? (
                                <textarea rows={rows} {...common} />
                            ) : (
                                <input type="text" {...common} />
                            )}
                            {errors[fieldName] && (
                                <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Field>
    );
}
