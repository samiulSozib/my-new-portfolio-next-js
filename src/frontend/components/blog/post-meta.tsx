import { formatDate } from "@frontend/lib/format";
import type { Lang } from "@frontend/lib/i18n/config";

type PostMetaProps = {
  date: string;
  readTime: string;
  lang: Lang;
};

// `date` is an ISO string; it is formatted in the page's language.
export function PostMeta({ date, readTime, lang }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <time dateTime={date}>{formatDate(date, lang)}</time>
      <span aria-hidden="true">·</span>
      <span>{readTime}</span>
    </div>
  );
}
