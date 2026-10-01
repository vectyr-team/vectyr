import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const FAQMarkdown = ({ content }: { content: string }) => (
  <div
    className="space-y-3
      [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80
      [&_strong]:text-foreground
      [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mt-4
      [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-3
      [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default FAQMarkdown;
