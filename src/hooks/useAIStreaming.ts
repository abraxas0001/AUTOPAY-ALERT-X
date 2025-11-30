import { useState, useRef, useCallback } from 'react';
import { streamGeminiAPI } from '../api/geminiStreaming';

export type StreamStatus = 'idle' | 'thinking' | 'streaming' | 'complete' | 'error' | 'cancelled';

export interface AIStreamingState {
  text: string;
  status: StreamStatus;
  error: string | null;
  isStreaming: boolean;
  startTime: number | null;
  chunkCount: number;
}

export interface AIStreamingActions {
  startStreaming: (prompt: string, context: string) => void;
  cancelStreaming: () => void;
  reset: () => void;
}

export function useAIStreaming(): [AIStreamingState, AIStreamingActions] {
  const [state, setState] = useState<AIStreamingState>({
    text: '',
    status: 'idle',
    error: null,
    isStreaming: false,
    startTime: null,
    chunkCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startStreaming = useCallback((prompt: string, _context: string) => {
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    // Set thinking state immediately
    setState({
      text: '',
      status: 'thinking',
      error: null,
      isStreaming: true,
      startTime: Date.now(),
      chunkCount: 0,
    });

    // Start streaming
    streamGeminiAPI({
      prompt,
      onChunk: (chunk: string) => {
        setState((prev) => ({
          ...prev,
          text: prev.text + chunk,
          status: prev.status === 'thinking' ? 'streaming' : prev.status,
          chunkCount: prev.chunkCount + 1,
        }));
      },
      onComplete: () => {
        setState((prev) => ({
          ...prev,
          status: 'complete',
          isStreaming: false,
        }));
        abortControllerRef.current = null;
      },
      onError: (error: Error) => {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error.message,
          isStreaming: false,
        }));
        abortControllerRef.current = null;
      },
      signal: abortControllerRef.current.signal,
    });
  }, []);

  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({
        ...prev,
        status: 'cancelled',
        isStreaming: false,
      }));
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({
      text: '',
      status: 'idle',
      error: null,
      isStreaming: false,
      startTime: null,
      chunkCount: 0,
    });
  }, []);

  return [state, { startStreaming, cancelStreaming, reset }];
}
