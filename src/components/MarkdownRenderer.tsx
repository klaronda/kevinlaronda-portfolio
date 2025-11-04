import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Check if content contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(content);
  
  if (hasHtmlTags) {
    // If content has HTML tags, render as HTML
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
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
          {content}
        </ReactMarkdown>
      </div>
    );
  }
}






