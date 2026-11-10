// Display helpers shared by the dashboard pages.

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Parses 'YYYY-MM-DD' (or an ISO string) without timezone drift for plain dates.
export function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).slice(0, 10));
    if (match && String(value).length <= 10) {
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, { withYear = true } = {}) {
    const date = parseDate(value);
    if (!date) return '—';
    const base = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    return withYear ? `${base}, ${date.getFullYear()}` : base;
}

export function formatMonthYear(value) {
    const date = parseDate(value);
    return date ? `${monthNames[date.getMonth()]} ${date.getFullYear()}` : '—';
}

export function formatRange(start, end) {
    return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : 'Present'}`;
}

// "2 yrs 7 mos", counting the start month inclusively like LinkedIn does.
export function formatDuration(start, end) {
    const from = parseDate(start);
    const to = end ? parseDate(end) : new Date();
    if (!from || !to) return '';
    const months = Math.max(1, (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1);
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts = [];
    if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
    if (rest) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`);
    return parts.join(' ');
}

export function formatBytes(bytes = 0) {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(value = 0) {
    return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard' }).format(value);
}

export function initials(name = '') {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('') || '?'
    );
}

export function greeting(date = new Date()) {
    const hour = date.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

export function relativeTime(value) {
    const date = parseDate(value);
    if (!date) return '';
    const days = Math.round((Date.now() - date.getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    return formatDate(date);
}
