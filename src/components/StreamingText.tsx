import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypingIndicator } from './TypingIndicator';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  showTypingIndicator: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({ 
  text, 
  isStreaming, 
  showTypingIndicator 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTextLengthRef = useRef(0);

  // Auto-scroll when new content arrives
  useEffect(() => {
    if (text.length > prevTextLengthRef.current && containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom || isStreaming) {
        container.scrollTop = container.scrollHeight;
      }
    }
    prevTextLengthRef.current = text.length;
  }, [text, isStreaming]);

  return (
    <div
      ref={containerRef}
      className="max-h-96 overflow-y-auto p-4 bg-white/80 rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-sm"
    >
      {text ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="text-gray-400 italic">Waiting for response...</div>
      )}
      {showTypingIndicator && <TypingIndicator />}
    </div>
  );
};
