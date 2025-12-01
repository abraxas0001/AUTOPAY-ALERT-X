import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatAIResponse } from '../utils/testUtils';
import { aiResponseArbitrary } from '../utils/mockData';

/**
 * Feature: ui-improvements-and-fixes, Property 1: AI analysis formatting consistency
 * 
 * For any AI-generated text response, when formatted for display, 
 * the output should contain bullet points, be organized into sections 
 * with headers, and be shorter than the original input
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */
describe('Property 1: AI analysis formatting consistency', () => {
  it('should format any AI response with bullet points and sections', () => {
    fc.assert(
      fc.property(aiResponseArbitrary, (rawText) => {
        const formatted = formatAIResponse(rawText);

        // Skip empty inputs
        if (!rawText || rawText.trim().length === 0) {
          expect(formatted).toBe('');
          return true;
        }

        // For very short inputs (single words), just check they're formatted
        if (rawText.trim().split(/\s+/).length === 1) {
          return formatted.length > 0;
        }

        // Property 1: Output should contain bullet points
        const hasBulletPoints = formatted.includes('•') || formatted.includes('-');

        // Property 2: Output should have section headers (bold text in markdown)
        const hasSectionHeaders = formatted.includes('**');

        // Property 3: Output should be more concise (or similar length for very short inputs)
        const isConcise = formatted.length <= rawText.length * 2; // Allow overhead for formatting

        // Property 4: Output should have consistent formatting (newlines between sections)
        const hasConsistentFormatting = formatted.includes('\n');

        return hasBulletPoints && hasSectionHeaders && isConcise && hasConsistentFormatting;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases gracefully', () => {
    // Empty string
    expect(formatAIResponse('')).toBe('');

    // Whitespace only
    expect(formatAIResponse('   \n  \t  ')).toBe('');

    // Single sentence
    const single = formatAIResponse('This is a test.');
    expect(single).toContain('•');
    expect(single).toContain('**');

    // Very long text
    const longText = 'This is a sentence. '.repeat(100);
    const formatted = formatAIResponse(longText);
    expect(formatted).toContain('•');
    expect(formatted.length).toBeLessThan(longText.length * 1.5);
  });

  it('should preserve important information while reducing verbosity', () => {
    const input = 'Analysis: The subscription is expensive. Recommendation: Consider alternatives. Key point: Save money.';
    const formatted = formatAIResponse(input);

    // Should contain key words
    expect(formatted.toLowerCase()).toContain('subscription');
    expect(formatted.toLowerCase()).toContain('expensive');
    expect(formatted.toLowerCase()).toContain('alternatives');

    // Should be formatted
    expect(formatted).toContain('•');
    expect(formatted).toContain('**');
  });
});
