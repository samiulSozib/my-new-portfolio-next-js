import { inputClass, secondaryButtonClass, dangerButtonClass } from '@dashboard/components/Admin/ui';

const typeLabels = {
    paragraph: 'Paragraph',
    heading: 'Heading',
    quote: 'Quote',
    list: 'Bulleted list',
    code: 'Code',
    callout: 'Callout',
};

// The fields a block needs when it is created or switched to a new type.
function blockFor(type, previous) {
    const text = previous?.text ?? '';

    switch (type) {
        case 'heading':
            return { type, level: 2, text };
        case 'quote':
            return { type, text, source: previous?.source ?? '' };
        case 'list':
            return { type, items: previous?.items ?? [''] };
        case 'code':
            return { type, language: previous?.language ?? 'ts', code: previous?.code ?? '' };
        default:
            return { type, text };
    }
}

// Edits one language's article body as a list of typed blocks. The server checks each block
// against its type, so errors are keyed like "content.en.2.text".
export default function BlockEditor({ blocks, onChange, errors = {}, prefix, blockTypes = Object.keys(typeLabels) }) {
    const replace = (index, next) => onChange(blocks.map((block, i) => (i === index ? next : block)));
    const move = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= blocks.length) return;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };
    const remove = (index) => onChange(blocks.filter((_, i) => i !== index));
    const add = (type = 'paragraph') => onChange([...blocks, blockFor(type)]);

    return (
        <div className="space-y-4">
            {blocks.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    No content yet. Add a block below.
                </p>
            )}

            {blocks.map((block, index) => {
                const error = (field) => errors[`${prefix}.${index}.${field}`];

                return (
                    <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                            <select
                                aria-label="Block type"
                                value={block.type}
                                onChange={(event) =>
                                    replace(index, blockFor(event.target.value, block))
                                }
                                className="rounded-lg border-slate-300 py-1 text-sm focus:border-violet-500 focus:ring-violet-500"
                            >
                                {blockTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {typeLabels[type] ?? type}
                                    </option>
                                ))}
                            </select>
                            <div className="ms-auto flex gap-2">
                                <button type="button" className={secondaryButtonClass} onClick={() => move(index, -1)} disabled={index === 0}>
                                    ↑
                                </button>
                                <button type="button" className={secondaryButtonClass} onClick={() => move(index, 1)} disabled={index === blocks.length - 1}>
                                    ↓
                                </button>
                                <button type="button" className={dangerButtonClass} onClick={() => remove(index)}>
                                    Remove
                                </button>
                            </div>
                        </div>

                        {block.type === 'heading' && (
                            <div className="mb-2 flex items-center gap-2 text-sm">
                                <span className="text-slate-600">Level</span>
                                <select
                                    value={block.level}
                                    onChange={(event) => replace(index, { ...block, level: Number(event.target.value) })}
                                    className="rounded-lg border-slate-300 py-1 text-sm focus:border-violet-500 focus:ring-violet-500"
                                >
                                    <option value={2}>Section (H2)</option>
                                    <option value={3}>Subsection (H3)</option>
                                </select>
                            </div>
                        )}

                        {block.type === 'list' ? (
                            <>
                                <textarea
                                    aria-label="List items, one per line"
                                    rows={4}
                                    className={inputClass}
                                    value={block.items.join('\n')}
                                    onChange={(event) => replace(index, { ...block, items: event.target.value.split('\n') })}
                                    placeholder="One item per line"
                                />
                                <p className="mt-1 text-xs text-slate-500">Empty lines are removed when you save.</p>
                            </>
                        ) : block.type === 'code' ? (
                            <div className="space-y-2">
                                <input
                                    aria-label="Language"
                                    className="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500"
                                    value={block.language}
                                    placeholder="Language, e.g. ts, bash"
                                    onChange={(event) => replace(index, { ...block, language: event.target.value })}
                                />
                                <textarea
                                    aria-label="Code"
                                    rows={6}
                                    className={`${inputClass} font-mono`}
                                    value={block.code}
                                    onChange={(event) => replace(index, { ...block, code: event.target.value })}
                                />
                            </div>
                        ) : (
                            <textarea
                                aria-label={typeLabels[block.type]}
                                rows={block.type === 'heading' ? 1 : 3}
                                className={inputClass}
                                value={block.text ?? ''}
                                onChange={(event) => replace(index, { ...block, text: event.target.value })}
                            />
                        )}

                        {block.type === 'quote' && (
                            <input
                                aria-label="Quote source"
                                className={`${inputClass} mt-2`}
                                value={block.source ?? ''}
                                placeholder="Source (optional)"
                                onChange={(event) => replace(index, { ...block, source: event.target.value })}
                            />
                        )}

                        {['text', 'items', 'code', 'language', 'level'].map((field) =>
                            error(field) ? (
                                <p key={field} className="mt-2 text-sm text-red-600">
                                    {error(field)}
                                </p>
                            ) : null,
                        )}
                    </div>
                );
            })}

            <div className="flex flex-wrap gap-2">
                {blockTypes.map((type) => (
                    <button key={type} type="button" className={secondaryButtonClass} onClick={() => add(type)}>
                        + {typeLabels[type] ?? type}
                    </button>
                ))}
            </div>
        </div>
    );
}
