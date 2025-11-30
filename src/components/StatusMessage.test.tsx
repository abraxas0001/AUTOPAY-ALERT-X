import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { StatusMessage, AIContext } from './StatusMessage';
import { StreamStatus } from '../hooks/useAIStreaming';

/**
 * Unit tests for status message selection
 * Validates: Requirements 2.1, 2.2, 2.3
 */
describe('StatusMessage - Unit Tests', () => {
  it('should display task planning message', () => {
    render(<StatusMessage status="thinking" context="taskPlanning" />);
    expect(screen.getByText(/Analyzing your task and creating a strategic plan/i)).toBeInTheDocument();
  });

  it('should display subscription analysis message', () => {
    render(<StatusMessage status="thinking" context="subscriptionAnalysis" />);
    expect(screen.getByText(/Evaluating subscription value and finding alternatives/i)).toBeInTheDocument();
  });

  it('should display daily briefing message', () => {
    render(<StatusMessage status="thinking" context="dailyBriefing" />);
    expect(screen.getByText(/Compiling your mission briefing/i)).toBeInTheDocument();
  });

  it('should display complete message when status is complete', () => {
    render(<StatusMessage status="complete" context="taskPlanning" />);
    expect(screen.getByText(/Complete/i)).toBeInTheDocument();
  });

  it('should display error message when status is error', () => {
    render(<StatusMessage status="error" context="taskPlanning" />);
    expect(screen.getByText(/Error occurred/i)).toBeInTheDocument();
  });

  it('should not render when status is idle', () => {
    const { container } = render(<StatusMessage status="idle" context="taskPlanning" />);
    expect(container.firstChild).toBeNull();
  });
});

/**
 * Feature: ai-engagement-enhancement, Property 4: Processing indicator visibility
 * For any AI request in 'thinking' or 'streaming' state, animated indicators should be visible
 * Validates: Requirements 2.4
 */
describe('Property 4: Processing indicator visibility', () => {
  it('should show animated indicator during thinking or streaming', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<StreamStatus>('thinking', 'streaming'),
        fc.constantFrom<AIContext>('taskPlanning', 'subscriptionAnalysis', 'dailyBriefing'),
        (status, context) => {
          const { container } = render(<StatusMessage status={status} context={context} />);
          
          // Should have an animated element (Loader2 with animate-spin)
          const animatedElement = container.querySelector('.animate-spin');
          expect(animatedElement).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not show animated indicator when complete or error', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<StreamStatus>('complete', 'error', 'cancelled'),
        fc.constantFrom<AIContext>('taskPlanning', 'subscriptionAnalysis', 'dailyBriefing'),
        (status, context) => {
          const { container } = render(<StatusMessage status={status} context={context} />);
          
          // Should not have animated spinner
          const animatedElement = container.querySelector('.animate-spin');
          expect(animatedElement).toBeFalsy();
        }
      ),
      { numRuns: 100 }
    );
  });
});
