import ReactMarkdown from "react-markdown";

// Renders text Niamh writes in Supabase (lists, **bold**, [links](...)).
export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`portal-prose ${className}`}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
