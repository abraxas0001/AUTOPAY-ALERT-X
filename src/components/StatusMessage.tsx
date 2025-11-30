import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { StreamStatus } from '../hooks/useAIStreaming';

export type AIContext = 'taskPlanning' | 'subscriptionAnalysis' | 'dailyBriefing';

interface StatusMessageProps {
  status: StreamStatus;
  context: AIContext;
}

const contextMessages: Record<AIContext, string> = {
  taskPlanning: 'Analyzing your task and creating a strategic plan...',
  subscriptionAnalysis: 'Evaluating subscription value and finding alternatives...',
  dailyBriefing: 'Compiling your mission briefing...',
};

export const StatusMessage: React.FC<StatusMessageProps> = ({ status, context }) => {
  if (status === 'idle') return null;

  const getMessage = () => {
    if (status === 'complete') return 'Complete!';
    if (status === 'error') return 'Error occurred';
    if (status === 'cancelled') return 'Cancelled';
    return contextMessages[context];
  };

  const getIcon = () => {
    if (status === 'complete') {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (status === 'thinking' || status === 'streaming') {
      return <Loader2 className="w-4 h-4 animate-spin text-purple-500" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2 text-sm font-mono mb-3 px-3 py-2 bg-black/5 rounded border border-black/10">
      {getIcon()}
      <span className="font-bold uppercase tracking-wider">{getMessage()}</span>
    </div>
  );
};
