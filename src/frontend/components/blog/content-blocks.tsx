import type { ContentBlock } from "@frontend/lib/types";

type ContentBlocksProps = {
  blocks: ContentBlock[];
};

// Renders the structured article body. Every block type is handled here, so
// adding a new type in lib/types.ts means adding a case below.
export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <div className="flex flex-col gap-6 text-lg leading-8 text-muted">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;

          case "heading":
            if (block.level === 2) {
              return (
                <h2
                  key={index}
                  className="mt-4 text-2xl font-semibold tracking-tight text-foreground"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                key={index}
                className="mt-2 text-xl font-semibold tracking-tight text-foreground"
              >
                {block.text}
              </h3>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-foreground pl-5 italic text-muted"
              >
                <p>{block.text}</p>
                {block.source && (
                  <footer className="mt-2 text-sm not-italic text-muted">
                    — {block.source}
                  </footer>
                )}
              </blockquote>
            );

          case "list":
            return (
              <ul key={index} className="flex list-disc flex-col gap-2 pl-6">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );

          case "code":
            return (
              <figure key={index} className="overflow-hidden rounded-xl border border-border">
                <figcaption className="border-b border-border bg-surface px-4 py-2 font-mono text-xs text-muted">
                  {block.language}
                </figcaption>
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-foreground">
                  <code>{block.code}</code>
                </pre>
              </figure>
            );

          case "callout":
            return (
              <aside
                key={index}
                className="rounded-xl bg-surface p-5 text-base leading-7 text-muted"
              >
                {block.text}
              </aside>
            );
        }
      })}
    </div>
  );
}
