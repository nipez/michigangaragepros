import Link from "next/link";

/** Renders markdown-style [label](/path/) links inside prose. */
export function LinkedText({
  text,
  className = "font-semibold text-michigan-blue hover:underline",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (match) {
          return (
            <Link key={`${match[2]}-${i}`} href={match[2]} className={className}>
              {match[1]}
            </Link>
          );
        }
        return <span key={`t-${i}`}>{part}</span>;
      })}
    </>
  );
}
