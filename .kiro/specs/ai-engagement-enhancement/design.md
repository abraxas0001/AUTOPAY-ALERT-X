# Design Document

## Overview

This design enhances the Gemini API integration to provide real-time streaming responses with visual feedback, contextual status messages, and improved user engagement. The current implementation uses a simple request-response pattern with a loading spinner. This design introduces streaming capabilities, progressive text rendering, cancellation support, and markdown formatting to create a more interactive and responsive AI experience.

## Architecture

### Current Architecture
- Single `callGeminiAPI` function that makes synchronous fetch requests
- Returns complete response text after full generation
- No intermediate feedback during processing
- No cancellation mechanism

### Proposed Architecture
- **Streaming API Client**: New function `streamGeminiAPI` that uses the Gemini streaming endpoint
- **Response State Manager**: React state management for streaming text, status, and UI states
- **UI Feedback Components**: Reusable components for status messages, typing indicators, and progress feedback
- **Markdown Renderer**: Integration of a markdown parsing library for formatted output
- **Cancellation Controller**: AbortController integration for request cancellation

### Component Hierarchy
```
App
├── AI Interaction Modals (Task/Sub/Briefing)
│   ├── AIStreamingDisplay (new)
│   │   ├── StatusMessage (new)
│   │   ├── StreamingText (new)
│   │   ├── TypingIndicator (new)
│   │   └── CancelButton (new)
│   └── MarkdownRenderer (new)
```

## Components and Interfaces

### 1. Streaming API Client

**Function: `streamGeminiAPI`**
```typescript
interface StreamOptions {
  prompt: string;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

async function streamGeminiAPI(options: StreamOptions): Promise<void>
```

**Responsibilities:**
- Connect to Gemini API streaming endpoint
- Parse Server-Sent Events (SSE) or streaming JSON responses
- Call `onChunk` callback for each text fragment
- Handle errors and completion states
- Support cancellation via AbortSignal

### 2. AI State Manager Hook

**Hook: `useAIStreaming`**
```typescript
interface AIStreamingState {
  text: string;
  status: 'idle' | 'thinking' | 'streaming' | 'complete' | 'error';
  error: string | null;
  isStreaming: boolean;
}

interface AIStreamingActions {
  startStreaming: (prompt: string, context: string) => void;
  cancelStreaming: () => void;
  reset: () => void;
}

function useAIStreaming(): [AIStreamingState, AIStreamingActions]
```

**Responsibilities:**
- Manage streaming state (text accumulation, status, errors)
- Provide actions for starting, cancelling, and resetting streams
- Handle AbortController lifecycle
- Trigger status transitions

### 3. UI Components

**Component: `AIStreamingDisplay`**
```typescript
interface AIStreamingDisplayProps {
  state: AIStreamingState;
  contextMessage: string;
  onCancel: () => void;
}
```

**Component: `StatusMessage`**
- Displays contextual messages based on AI action type
- Shows animated indicators during processing
- Transitions to completion message

**Component: `StreamingText`**
- Renders accumulated text with typing indicator
- Auto-scrolls to keep latest content visible
- Applies markdown formatting

**Component: `TypingIndicator`**
- Animated cursor or ellipsis at text end
- Only visible during streaming state
- Smooth CSS animations

**Component: `CancelButton`**
- Visible only during thinking/streaming states
- Triggers cancellation via AbortController
- Styled to match app theme

### 4. Markdown Renderer

**Library: `react-markdown`**
- Lightweight markdown parsing and rendering
- Support for lists, emphasis, code blocks
- Custom styling to match app aesthetic

## Data Models

### Streaming State
```typescript
interface StreamingState {
  text: string;              // Accumulated response text
  status: StreamStatus;      // Current processing status
  error: string | null;      // Error message if failed
  startTime: number | null;  // Timestamp when streaming started
  chunkCount: number;        // Number of chunks received
}

type StreamStatus = 
  | 'idle'      // No active request
  | 'thinking'  // Request sent, waiting for first chunk
  | 'streaming' // Receiving chunks
  | 'complete'  // Successfully finished
  | 'error'     // Failed with error
  | 'cancelled' // User cancelled
```

### Context Messages
```typescript
interface ContextMessages {
  taskPlanning: string;
  subscriptionAnalysis: string;
  dailyBriefing: string;
}

const contextMessages: ContextMessages = {
  taskPlanning: "Analyzing your task and creating a strategic plan...",
  subscriptionAnalysis: "Evaluating subscription value and finding alternatives...",
  dailyBriefing: "Compiling your mission briefing..."
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Streaming text accumulation
*For any* sequence of text chunks received from the AI Service, appending them in order should produce the complete response without loss or duplication
**Validates: Requirements 1.2**

### Property 2: State transition completeness
*For any* streaming session that completes successfully, the final state should be 'complete' and user interaction should be enabled
**Validates: Requirements 1.3**

### Property 3: Partial response preservation on error
*For any* streaming session that fails or is interrupted, all text chunks received before the failure should remain visible in the UI
**Validates: Requirements 1.4**

### Property 4: Processing indicator visibility
*For any* AI request in 'thinking' or 'streaming' state, animated indicators should be visible in the UI
**Validates: Requirements 2.4**

### Property 5: Status completion transition
*For any* AI request that completes, the status should transition from 'streaming' to 'complete'
**Validates: Requirements 2.5**

### Property 6: Typing indicator presence during streaming
*For any* active streaming session, a typing indicator should be visible at the end of the accumulated text
**Validates: Requirements 3.1**

### Property 7: Auto-scroll during streaming
*For any* new text chunk that arrives during streaming, if the user is near the bottom of the scroll area, the view should auto-scroll to show the new content
**Validates: Requirements 3.3**

### Property 8: Typing indicator removal on completion
*For any* streaming session that reaches 'complete' or 'error' state, the typing indicator should be removed
**Validates: Requirements 3.4**

### Property 9: Immediate thinking state transition
*For any* AI action triggered by the user, the state should transition to 'thinking' within 100 milliseconds
**Validates: Requirements 4.1**

### Property 10: State transition on first chunk
*For any* streaming session, when the first chunk arrives, the state should transition from 'thinking' to 'streaming'
**Validates: Requirements 4.3**

### Property 11: Timeout indicator display
*For any* AI request where no response arrives within 5 seconds, a "still processing" indicator should appear
**Validates: Requirements 4.4**

### Property 12: Cancel button visibility
*For any* AI request in 'thinking' or 'streaming' state, a cancel button should be visible
**Validates: Requirements 5.1**

### Property 13: Request abortion on cancel
*For any* active streaming request, clicking cancel should abort the underlying fetch request
**Validates: Requirements 5.2**

### Property 14: Partial content retention on cancel
*For any* cancelled streaming session, all text accumulated before cancellation should remain visible
**Validates: Requirements 5.3**

### Property 15: UI reset after cancellation
*For any* cancelled request, the UI should return to 'idle' state and allow new requests
**Validates: Requirements 5.4**

### Property 16: Markdown rendering correctness
*For any* valid markdown text returned by the AI Service, the rendered output should contain properly formatted HTML elements (lists, emphasis, code blocks)
**Validates: Requirements 6.1**

## Error Handling

### Network Errors
- Display error message in the streaming display area
- Preserve any partial response received
- Allow user to retry or cancel
- Log error details for debugging

### API Errors
- Parse error responses from Gemini API
- Display user-friendly error messages
- Handle rate limiting with appropriate messaging
- Provide fallback to non-streaming mode if streaming fails

### Cancellation
- Clean up AbortController and event listeners
- Preserve partial response
- Reset UI to allow new requests
- No error state for user-initiated cancellation

### Timeout Handling
- Show "still processing" indicator after 5 seconds
- Continue waiting for response (don't auto-cancel)
- Allow user to manually cancel if desired

## Testing Strategy

### Unit Tests
- Test `streamGeminiAPI` function with mocked fetch responses
- Test `useAIStreaming` hook state transitions
- Test markdown rendering with various input formats
- Test AbortController integration
- Test status message selection logic

### Property-Based Tests
- Use `fast-check` library for JavaScript/TypeScript property testing
- Configure each property test to run minimum 100 iterations
- Each property test must reference its corresponding design property
- Tag format: `**Feature: ai-engagement-enhancement, Property {number}: {property_text}**`

### Integration Tests
- Test complete streaming flow from button click to completion
- Test cancellation at various points in streaming
- Test error scenarios (network failure, API errors)
- Test UI updates during streaming

### Manual Testing
- Verify smooth animations and visual feedback
- Test on different network speeds
- Verify markdown rendering quality
- Test accessibility (keyboard navigation, screen readers)

## Implementation Notes

### Gemini API Streaming
The Gemini API supports streaming via the `streamGenerateContent` endpoint:
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=API_KEY
```

Response format: Server-Sent Events (SSE) or newline-delimited JSON

### Performance Considerations
- Debounce text updates if chunks arrive very rapidly (every 50ms max)
- Use React.memo for StreamingText component to prevent unnecessary re-renders
- Implement virtual scrolling if responses become very long
- Clean up event listeners and abort controllers on unmount

### Accessibility
- Announce status changes to screen readers using ARIA live regions
- Ensure cancel button is keyboard accessible
- Provide text alternatives for visual indicators
- Maintain focus management during state transitions

### Styling
- Match existing manga/anime theme
- Use existing color palette and typography
- Animate typing indicator with CSS keyframes
- Ensure responsive design for mobile devices

## Dependencies

### New Dependencies
- `react-markdown`: ^9.0.0 - Markdown rendering
- `remark-gfm`: ^4.0.0 - GitHub Flavored Markdown support

### No Additional Dependencies Needed
- AbortController: Native browser API
- Server-Sent Events: Native fetch API support
- CSS Animations: Native CSS

## Migration Strategy

### Phase 1: Add Streaming Infrastructure
- Implement `streamGeminiAPI` function
- Create `useAIStreaming` hook
- Add streaming state management

### Phase 2: Update UI Components
- Create `AIStreamingDisplay` component
- Add status messages and indicators
- Implement cancel functionality

### Phase 3: Add Markdown Support
- Integrate `react-markdown`
- Style markdown output
- Test with various formats

### Phase 4: Replace Existing Calls
- Update `handleAiPlan` to use streaming
- Update `handleAiSubAnalysis` to use streaming
- Update `handleDailyBriefing` to use streaming
- Keep fallback to non-streaming if needed

### Backward Compatibility
- Keep existing `callGeminiAPI` function as fallback
- Gracefully degrade to non-streaming if streaming fails
- No breaking changes to existing functionality
