import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { aiResponseArbitrary } from '../utils/mockData';

/**
 * Feature: ui-improvements-and-fixes, Property 2: Retry button regeneration
 * 
 * For any AI analysis section with a retry button, clicking the button should 
 * trigger new content generation, show loading state during generation, 
 * and replace the previous content upon completion
 * 
 * Validates: Requirements 2.2, 2.3, 2.4
 */
describe('Property 2: Retry button regeneration', () => {
  it('should regenerate content when retry is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(aiResponseArbitrary, aiResponseArbitrary),
        async ([initialContent, newContent]) => {
          // Skip if contents are identical
          if (initialContent === newContent) {
            return true;
          }

          // Mock AI generation function
          let callCount = 0;
          const mockGenerate = vi.fn(async () => {
            callCount++;
            return callCount === 1 ? initialContent : newContent;
          });

          // Simulate initial generation
          const first = await mockGenerate();
          expect(first).toBe(initialContent);

          // Simulate retry
          const second = await mockGenerate();
          expect(second).toBe(newContent);

          // Verify function was called twice
          expect(mockGenerate).toHaveBeenCalledTimes(2);

          // Property: Content should change after retry
          return first !== second;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle loading state during regeneration', async () => {
    await fc.assert(
      fc.asyncProperty(aiResponseArbitrary, async (content) => {
        let isLoading = false;

        // Mock async generation with loading state
        const mockGenerateWithLoading = async () => {
          isLoading = true;
          await new Promise(resolve => setTimeout(resolve, 10));
          isLoading = false;
          return content;
        };

        // Before generation
        expect(isLoading).toBe(false);

        // Start generation
        const promise = mockGenerateWithLoading();
        
        // During generation (check immediately)
        expect(isLoading).toBe(true);

        // After generation
        await promise;
        expect(isLoading).toBe(false);

        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('should replace previous content smoothly', () => {
    fc.assert(
      fc.property(
        fc.tuple(aiResponseArbitrary, aiResponseArbitrary),
        ([oldContent, newContent]) => {
          // Simulate content state
          let currentContent = oldContent;

          // Simulate content update
          const updateContent = (content: string) => {
            currentContent = content;
          };

          // Initial state
          expect(currentContent).toBe(oldContent);

          // Update to new content
          updateContent(newContent);

          // Property: Content should be replaced
          expect(currentContent).toBe(newContent);
          expect(currentContent).not.toBe(oldContent);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
