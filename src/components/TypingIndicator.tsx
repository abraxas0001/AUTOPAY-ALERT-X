import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1 ml-1 animate-pulse">
      <span className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
      <span className="w-1 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
    </span>
  );
};
