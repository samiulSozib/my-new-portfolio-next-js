// Helpers that turn the friendlier text fields in the admin into the arrays the API stores.

export const linesToList = (text = '') =>
    text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

export const listToLines = (list = []) => list.join('\n');

export const commaToList = (text = '') =>
    text
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

export const listToComma = (list = []) => list.join(', ');

// Drops empty list items and trims text before the blocks are saved.
export const cleanBlocks = (blocks = []) =>
    blocks.map((block) =>
        block.type === 'list'
            ? { ...block, items: block.items.map((item) => item.trim()).filter(Boolean) }
            : block,
    );

export const slugify = (text = '') =>
    text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
