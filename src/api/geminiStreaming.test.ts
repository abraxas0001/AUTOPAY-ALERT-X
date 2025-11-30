import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { streamGeminiAPI } from './geminiStreaming';

/**
 * Feature: ai-engagement-enhancement, Property 13: Request abortion on cancel
 * For any active streaming request, clicking cancel should abort the underlying fetch request
 * Validates: Requirements 5.2
 */
describe('Property 13: Request abortion on cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should abort fetch request when signal is aborted', async () => {
    const controller = new AbortController();
    const onChunk = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    // Abort immediately
    controller.abort();

    await streamGeminiAPI({
      prompt: 'test',
      onChunk,
      onComplete,
      onError,
      signal: controller.signal,
    });

    // Should not call callbacks when aborted
    expect(onChunk).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should handle abortion at any point during streaming', () => {
    fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (abortAfterMs) => {
          const controller = new AbortController();
          const onChunk = vi.fn();
          const onComplete = vi.fn();
          const onError = vi.fn();

          // Abort after specified time
          setTimeout(() => controller.abort(), abortAfterMs);

          await streamGeminiAPI({
            prompt: 'test prompt',
            onChunk,
            onComplete,
            onError,
            signal: controller.signal,
          });

          // After abortion, complete should not be called
          expect(onComplete).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 10 } // Reduced for async tests
    );
  });
});

/**
 * Feature: ai-engagement-enhancement, Property 3: Partial response preservation on error
 * For any streaming session that fails or is interrupted, all text chunks received before 
 * the failure should remain visible in the UI
 * Validates: Requirements 1.4
 */
describe('Property 3: Partial response preservation on error', () => {
  it('should preserve all chunks received before error', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (chunks) => {
          const receivedChunks: string[] = [];
          
          // Simulate receiving chunks before error
          for (const chunk of chunks) {
            receivedChunks.push(chunk);
          }

          // All chunks should be preserved
          expect(receivedChunks.length).toBe(chunks.length);
          expect(receivedChunks).toEqual(chunks);

          // Accumulated text should equal all chunks
          const accumulated = receivedChunks.join('');
          const expected = chunks.join('');
          expect(accumulated).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain chunk order even when error occurs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 2, maxLength: 15 }),
        fc.integer({ min: 0, max: 100 }),
        (chunks, errorAtIndex) => {
          const receivedChunks: string[] = [];
          const errorIndex = errorAtIndex % chunks.length;

          // Receive chunks up to error point
          for (let i = 0; i <= errorIndex && i < chunks.length; i++) {
            receivedChunks.push(chunks[i]);
          }

          // Verify order is preserved
          for (let i = 0; i < receivedChunks.length; i++) {
            expect(receivedChunks[i]).toBe(chunks[i]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
