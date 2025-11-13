import React from 'react';
import ReactMarkdown from 'react-markdown';

const htmlEntityMap: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": "\"",
  "&#34;": "\"",
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
  "&nbsp;": " ",
};

function decodeHtmlEntities(value: string): string {
  if (!value) {
    return '';
  }

  return value.replace(/&(?:lt|gt|amp|quot|#34|#39|#x27|#x2F|nbsp);/g, (entity) => {
    return htmlEntityMap[entity] ?? entity;
  });
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const decodedContent = React.useMemo(() => decodeHtmlEntities(content), [content]);

  // Check if content contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(decodedContent);
  
  if (hasHtmlTags) {
    // If content has HTML tags, render as HTML
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: decodedContent }}
      />
    );
  } else {
    // If content is plain text or markdown, use ReactMarkdown
    return (
      <div className={className}>
        <ReactMarkdown 
          components={{
            p: ({children}) => <p className="mb-2">{children}</p>,
            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
          }}
        >
          {decodedContent}
        </ReactMarkdown>
      </div>
    );
  }
}













