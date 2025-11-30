import React from 'react';
import { AIStreamingState } from '../hooks/useAIStreaming';
import { StatusMessage, AIContext } from './StatusMessage';
import { StreamingText } from './StreamingText';
import { CancelButton } from './CancelButton';

interface AIStreamingDisplayProps {
  state: AIStreamingState;
  context: AIContext;
  onCancel: () => void;
}

export const AIStreamingDisplay: React.FC<AIStreamingDisplayProps> = ({
  state,
  context,
  onCancel,
}) => {
  const showCancelButton = state.status === 'thinking' || state.status === 'streaming';
  const showTypingIndicator = state.status === 'streaming';

  return (
    <div className="space-y-3">
      <StatusMessage status={state.status} context={context} />
      
      <StreamingText
        text={state.text}
        isStreaming={state.isStreaming}
        showTypingIndicator={showTypingIndicator}
      />

      {state.error && (
        <div className="p-3 bg-red-50 border-2 border-red-500 rounded text-red-700 font-mono text-sm">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <CancelButton onClick={onCancel} visible={showCancelButton} />
      </div>
    </div>
  );
};
