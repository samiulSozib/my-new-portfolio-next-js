import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

// One width for the whole site: header, footer, and every page line up with it.
// Long-form text (post bodies) narrows itself inside this container.
export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
