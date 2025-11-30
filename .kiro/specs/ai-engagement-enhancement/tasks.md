# Implementation Plan

- [x] 1. Install dependencies and set up streaming infrastructure



  - Install `react-markdown` and `remark-gfm` packages
  - Create new file `src/hooks/useAIStreaming.ts` for streaming state management
  - Create new file `src/api/geminiStreaming.ts` for streaming API client
  - _Requirements: 1.1, 1.2_

- [x] 1.1 Write property test for text chunk accumulation


  - **Property 1: Streaming text accumulation**
  - **Validates: Requirements 1.2**

- [x] 2. Implement streaming API client

  - Create `streamGeminiAPI` function with Server-Sent Events support
  - Implement chunk parsing and callback system
  - Add AbortController integration for cancellation
  - Handle API errors and network failures
  - _Requirements: 1.1, 1.2, 1.4, 5.2_

- [x] 2.1 Write property test for request abortion

  - **Property 13: Request abortion on cancel**
  - **Validates: Requirements 5.2**

- [x] 2.2 Write property test for partial response preservation

  - **Property 3: Partial response preservation on error**
  - **Validates: Requirements 1.4**

- [x] 3. Create useAIStreaming hook

  - Implement state management for streaming (text, status, error)
  - Create `startStreaming`, `cancelStreaming`, and `reset` actions
  - Add AbortController lifecycle management
  - Implement status transitions (idle → thinking → streaming → complete)
  - _Requirements: 1.1, 1.3, 4.1, 4.3, 5.1, 5.4_

- [x] 3.1 Write property test for state transitions

  - **Property 2: State transition completeness**
  - **Validates: Requirements 1.3**

- [x] 3.2 Write property test for immediate thinking state

  - **Property 9: Immediate thinking state transition**
  - **Validates: Requirements 4.1**

- [x] 3.3 Write property test for first chunk transition

  - **Property 10: State transition on first chunk**
  - **Validates: Requirements 4.3**

- [x] 3.4 Write property test for UI reset after cancellation

  - **Property 15: UI reset after cancellation**
  - **Validates: Requirements 5.4**

- [x] 4. Create StatusMessage component


  - Create `src/components/StatusMessage.tsx`
  - Implement context message display based on AI action type
  - Add animated indicators for processing state
  - Show completion/error messages
  - Style to match manga theme
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Write unit tests for status message selection

  - Test task planning message display
  - Test subscription analysis message display
  - Test daily briefing message display
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4.2 Write property test for processing indicator visibility

  - **Property 4: Processing indicator visibility**
  - **Validates: Requirements 2.4**

- [x] 5. Create TypingIndicator component

  - Create `src/components/TypingIndicator.tsx`
  - Implement animated cursor/ellipsis effect
  - Add CSS keyframe animations
  - Show only during streaming state
  - _Requirements: 3.1, 3.4_

- [x] 5.1 Write property test for typing indicator presence

  - **Property 6: Typing indicator presence during streaming**
  - **Validates: Requirements 3.1**

- [x] 5.2 Write property test for typing indicator removal

  - **Property 8: Typing indicator removal on completion**
  - **Validates: Requirements 3.4**

- [x] 6. Create StreamingText component with auto-scroll

  - Create `src/components/StreamingText.tsx`
  - Implement text display with accumulated content
  - Add auto-scroll logic to keep latest content visible
  - Integrate TypingIndicator component
  - Add ref management for scroll container
  - _Requirements: 1.1, 3.1, 3.3_

- [x] 6.1 Write property test for auto-scroll behavior

  - **Property 7: Auto-scroll during streaming**
  - **Validates: Requirements 3.3**

- [x] 7. Create CancelButton component

  - Create `src/components/CancelButton.tsx`
  - Show button only during thinking/streaming states
  - Trigger cancellation callback on click
  - Style to match app theme with hover effects
  - _Requirements: 5.1, 5.2_

- [x] 7.1 Write property test for cancel button visibility

  - **Property 12: Cancel button visibility**
  - **Validates: Requirements 5.1**

- [x] 8. Create AIStreamingDisplay container component

  - Create `src/components/AIStreamingDisplay.tsx`
  - Compose StatusMessage, StreamingText, and CancelButton
  - Handle layout and spacing
  - Add error display area
  - Integrate with useAIStreaming hook
  - _Requirements: 1.1, 1.3, 1.4, 2.4, 5.3_

- [x] 8.1 Write property test for partial content retention

  - **Property 14: Partial content retention on cancel**
  - **Validates: Requirements 5.3**

- [x] 9. Implement markdown rendering

  - Integrate `react-markdown` into StreamingText component
  - Configure `remark-gfm` for GitHub Flavored Markdown
  - Style markdown elements (lists, code blocks, emphasis) to match theme
  - Test with various markdown formats
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9.1 Write property test for markdown rendering

  - **Property 16: Markdown rendering correctness**
  - **Validates: Requirements 6.1**

- [x] 10. Add timeout indicator logic

  - Implement 5-second timeout detection in useAIStreaming hook
  - Show "still processing" indicator after timeout
  - Continue waiting for response (don't auto-cancel)
  - _Requirements: 4.4_

- [x] 10.1 Write property test for timeout indicator

  - **Property 11: Timeout indicator display**
  - **Validates: Requirements 4.4**

- [x] 11. Update handleAiPlan to use streaming

  - Replace `callGeminiAPI` with `streamGeminiAPI` in task planning
  - Integrate AIStreamingDisplay component into task modal
  - Pass "taskPlanning" context message
  - Update form state management to work with streaming
  - Add fallback to non-streaming on error
  - _Requirements: 1.1, 2.1_

- [x] 12. Update handleAiSubAnalysis to use streaming

  - Replace `callGeminiAPI` with `streamGeminiAPI` in subscription analysis
  - Integrate AIStreamingDisplay component into subscription modal
  - Pass "subscriptionAnalysis" context message
  - Update form state management to work with streaming
  - Add fallback to non-streaming on error
  - _Requirements: 1.1, 2.2_

- [x] 13. Update handleDailyBriefing to use streaming

  - Replace `callGeminiAPI` with `streamGeminiAPI` in daily briefing
  - Integrate AIStreamingDisplay component into dashboard
  - Pass "dailyBriefing" context message
  - Update briefing state management to work with streaming
  - Add fallback to non-streaming on error
  - _Requirements: 1.1, 2.3_

- [x] 14. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Polish and optimize

  - Add debouncing for rapid chunk updates (50ms)
  - Optimize re-renders with React.memo
  - Test on different network speeds
  - Verify accessibility (ARIA live regions, keyboard navigation)
  - Test responsive design on mobile devices
  - _Requirements: 3.2_

- [x] 15.1 Write integration tests for complete streaming flow

  - Test full flow from button click to completion
  - Test cancellation at various points
  - Test error scenarios

- [x] 16. Final checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.
