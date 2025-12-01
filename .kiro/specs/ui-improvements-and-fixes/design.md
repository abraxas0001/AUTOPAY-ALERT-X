# Design Document

## Overview

This design addresses multiple UI/UX improvements and bug fixes for the manga-themed task management application. The improvements focus on enhancing the AI analysis presentation, adding regeneration capabilities, fixing payment deletion logic, implementing Indian localization defaults, and improving top bar text visibility through gradient overlays.

## Architecture

The application follows a single-component architecture with all logic contained in `App.tsx`. The improvements will be implemented as:

1. **AI Analysis Formatting** - Transform existing AI-generated text into structured, concise bullet points
2. **Retry Functionality** - Add interactive button component with icon for regenerating AI content
3. **Payment Deletion Fix** - Correct the subscription renewal logic to properly recalculate due dates
4. **Localization Defaults** - Update initial profile state with Indian regional settings
5. **Top Bar Gradient Overlay** - Apply CSS gradient overlay to improve text contrast

## Components and Interfaces

### 1. AI Analysis Display Component

The AI analysis sections (Daily Briefing and Subscription Analysis) will be enhanced with:

- Structured markdown rendering using `react-markdown` (already installed)
- Bullet point formatting for better readability
- Concise presentation with clear section headers
- Consistent styling across all AI-generated content

### 2. Retry Button Component

A new reusable button component for AI regeneration:

```typescript
interface RetryButtonProps {
  onRetry: () => void;
  loading: boolean;
  className?: string;
}
```

Features:
- Symbolic refresh/retry icon (using `lucide-react` icons)
- Loading state with spinner animation
- Consistent styling with existing `SmartButton` pattern
- Positioned near AI-generated content

### 3. Payment History Management

Enhanced subscription management logic:

```typescript
interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
}

// Enhanced deletion handler
const deleteHistoryItem = async (subId: string, historyId: string) => {
  // Delete payment record
  // Recalculate next billing date based on remaining history
  // Update subscription document
}
```

### 4. Profile Defaults

Updated `UserProfile` initial state:

```typescript
const defaultProfile: UserProfile = {
  name: 'User',
  avatar: currentRotation.avatar || mangaArt.default_avatar,
  currency: '₹',  // Indian Rupee
  language: 'en',
  timezone: 'Asia/Kolkata',  // Indian timezone
  alarmSound: '/music/Piano.mp3'
}
```

### 5. Top Bar Gradient Overlay

CSS-based gradient overlay implementation:

```css
.top-bar-gradient {
  position: relative;
}

.top-bar-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.2) 70%,
    transparent 100%
  );
  z-index: 1;
}
```

## Data Models

### AI Analysis Format

Transform AI responses into structured format:

```typescript
interface AIAnalysisFormat {
  sections: {
    title: string;
    points: string[];
  }[];
}

// Example transformation
const formatAIResponse = (rawText: string): string => {
  // Parse and structure into bullet points
  // Remove verbose language
  // Organize into logical sections
  // Return markdown-formatted string
}
```

### Subscription with Recalculated Dates

```typescript
interface SubscriptionWithHistory extends Subscription {
  history: PaymentHistory[];
  calculateNextBillingDate: () => string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework:

1.1 WHEN the AI Analysis Section displays content THEN the system SHALL format the analysis as concise bullet points
Thoughts: This is about formatting AI-generated text. We can test this by generating random AI responses, formatting them, and checking that the output contains bullet point markers and is shorter than the input.
Testable: yes - property

1.2 WHEN the AI Analysis Section renders THEN the system SHALL organize information into logical categories with clear headings
Thoughts: This is about the structure of the formatted output. We can test that formatted AI responses contain section headers and that content is grouped under those headers.
Testable: yes - property

1.3 WHEN the AI Analysis Section presents data THEN the system SHALL limit verbosity and focus on actionable insights
Thoughts: This is about the quality of the output, which is subjective. We can test that the formatted output is shorter than the input, but "actionable insights" is not easily testable.
Testable: yes - property (length reduction)

1.4 WHEN the AI Analysis Section displays THEN the system SHALL use consistent formatting and spacing for readability
Thoughts: This is about visual consistency. We can test that all formatted outputs follow the same pattern (e.g., all bullet points use the same marker, consistent spacing).
Testable: yes - property

2.1 WHEN the AI Analysis Section is visible THEN the system SHALL display a retry button with a symbolic icon
Thoughts: This is testing that a specific UI element exists when certain conditions are met. We can test this by checking that the retry button is present in the rendered output.
Testable: yes - example

2.2 WHEN a user clicks the retry button THEN the system SHALL generate new AI analysis content
Thoughts: This is about the behavior when a button is clicked. We can test this by simulating a click and verifying that the AI generation function is called.
Testable: yes - property

2.3 WHEN the retry button is clicked THEN the system SHALL provide visual feedback during regeneration
Thoughts: This is about UI state during an async operation. We can test that the button shows a loading state when clicked.
Testable: yes - property

2.4 WHEN new analysis is generated THEN the system SHALL replace the previous content smoothly
Thoughts: This is about the UI update behavior. We can test that the content changes after generation completes.
Testable: yes - property

3.1 WHEN a user clicks the delete button in the Payment Section THEN the system SHALL remove the payment record
Thoughts: This is about data deletion. We can test that after deletion, the payment record no longer exists in the database.
Testable: yes - property

3.2 WHEN a payment is deleted THEN the system SHALL recalculate and update the associated due date
Thoughts: This is the core bug fix. We can test that deleting a payment causes the due date to change according to the subscription cycle.
Testable: yes - property

3.3 WHEN the due date is updated THEN the system SHALL persist the changes to storage
Thoughts: This is about data persistence. We can test that the updated due date is saved to Firestore.
Testable: yes - property

3.4 WHEN deletion completes THEN the system SHALL reflect the updated due date in the UI immediately
Thoughts: This is about UI reactivity. We can test that the displayed due date matches the updated value after deletion.
Testable: yes - property

4.1 WHEN the application initializes THEN the system SHALL set the default currency to Indian Rupees (₹)
Thoughts: This is testing the initial state. We can test that a new user profile has currency set to '₹'.
Testable: yes - example

4.2 WHEN the application initializes THEN the system SHALL set the default location to India
Thoughts: This is testing the initial timezone setting. We can test that a new user profile has timezone set to 'Asia/Kolkata'.
Testable: yes - example

4.3 WHEN displaying dates THEN the system SHALL use the Indian date format (DD/MM/YYYY)
Thoughts: This is about date formatting. We can test that dates are formatted with day before month.
Testable: yes - property

4.4 WHEN displaying currency values THEN the system SHALL format numbers according to Indian numbering conventions
Thoughts: This is about number formatting (lakhs/crores system). We can test that large numbers are formatted with commas in the Indian style.
Testable: yes - property

5.1 WHEN the Top Bar renders THEN the system SHALL apply a dark gradient overlay on the background image
Thoughts: This is testing that a CSS class or style is applied. We can test that the overlay element exists.
Testable: yes - example

5.2 WHEN the overlay is applied THEN the system SHALL ensure it covers the area behind text elements
Thoughts: This is about the positioning and size of the overlay. We can test that the overlay has the correct dimensions.
Testable: yes - example

5.3 WHEN the overlay extends beyond text THEN the system SHALL fade the effect gradually
Thoughts: This is about the gradient having a fade effect. We can test that the gradient CSS includes transparency values that increase.
Testable: yes - example

5.4 WHEN white headings are displayed THEN the system SHALL ensure sufficient contrast for readability
Thoughts: This is about color contrast ratios. We can test that the contrast between white text and the darkened background meets WCAG standards.
Testable: yes - property

5.5 WHILE the overlay is visible THEN the system SHALL maintain the aesthetic quality of the background image
Thoughts: This is subjective - "aesthetic quality" cannot be objectively measured.
Testable: no

### Property Reflection:

Reviewing all testable properties for redundancy:

- Properties 1.1-1.4 all relate to AI formatting and could potentially be combined into a single comprehensive property about AI output formatting
- Properties 2.2-2.4 all relate to retry button behavior and could be combined into one property about retry functionality
- Properties 3.1-3.4 form a logical sequence for payment deletion and should remain separate as they test different aspects
- Properties 4.1-4.2 are initial state examples and should remain separate
- Properties 4.3-4.4 test different formatting concerns and should remain separate
- Properties 5.1-5.3 are all examples testing the same feature and could be combined

After reflection, I'll combine related properties where appropriate in the final property list.

### Correctness Properties:

Property 1: AI analysis formatting consistency
*For any* AI-generated text response, when formatted for display, the output should contain bullet points, be organized into sections with headers, and be shorter than the original input
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

Property 2: Retry button regeneration
*For any* AI analysis section with a retry button, clicking the button should trigger new content generation, show loading state during generation, and replace the previous content upon completion
**Validates: Requirements 2.2, 2.3, 2.4**

Property 3: Payment deletion removes record
*For any* payment history record, when deleted, the record should no longer exist in the database
**Validates: Requirements 3.1**

Property 4: Payment deletion recalculates due date
*For any* subscription with payment history, when a payment is deleted, the next billing date should be recalculated based on the subscription cycle and remaining history
**Validates: Requirements 3.2**

Property 5: Due date updates persist
*For any* subscription with an updated due date, the new date should be saved to Firestore and reflected in the UI immediately
**Validates: Requirements 3.3, 3.4**

Property 6: Date formatting follows Indian convention
*For any* date value displayed in the application, the format should follow DD/MM/YYYY pattern when the locale is set to India
**Validates: Requirements 4.3**

Property 7: Currency formatting follows Indian convention
*For any* currency value displayed in the application, numbers should be formatted with Indian numbering conventions (lakhs/crores) when currency is set to Rupees
**Validates: Requirements 4.4**

Property 8: Text contrast meets accessibility standards
*For any* white text displayed on the top bar, the contrast ratio between the text and the darkened background should meet WCAG AA standards (minimum 4.5:1)
**Validates: Requirements 5.4**

## Error Handling

### AI Generation Failures

- Display user-friendly error messages when AI generation fails
- Preserve previous content if regeneration fails
- Provide retry option on error

### Payment Deletion Failures

- Rollback deletion if due date recalculation fails
- Show error notification to user
- Log errors for debugging

### Localization Fallbacks

- Fall back to default formats if Indian locale is unavailable
- Gracefully handle timezone conversion errors

## Testing Strategy

### Unit Testing

We will use Vitest (already installed) for unit testing:

1. **AI Formatting Tests**
   - Test markdown parsing and bullet point generation
   - Test section header extraction
   - Test text length reduction

2. **Date Calculation Tests**
   - Test due date recalculation for different subscription cycles
   - Test edge cases (end of month, leap years)
   - Test with empty payment history

3. **Localization Tests**
   - Test Indian date formatting
   - Test Indian number formatting
   - Test currency symbol display

### Property-Based Testing

We will use fast-check (already installed) for property-based testing. Each property-based test will run a minimum of 100 iterations.

1. **Property 1: AI analysis formatting consistency**
   - Generate random AI text responses
   - Format each response
   - Verify output contains bullet points, sections, and is shorter
   - **Feature: ui-improvements-and-fixes, Property 1: AI analysis formatting consistency**

2. **Property 2: Retry button regeneration**
   - Generate random initial AI content
   - Simulate retry button click
   - Verify new content is generated and different from original
   - **Feature: ui-improvements-and-fixes, Property 2: Retry button regeneration**

3. **Property 3: Payment deletion removes record**
   - Generate random payment history records
   - Delete each record
   - Verify record no longer exists
   - **Feature: ui-improvements-and-fixes, Property 3: Payment deletion removes record**

4. **Property 4: Payment deletion recalculates due date**
   - Generate random subscriptions with payment history
   - Delete random payment records
   - Verify due date is recalculated correctly based on cycle
   - **Feature: ui-improvements-and-fixes, Property 4: Payment deletion recalculates due date**

5. **Property 5: Due date updates persist**
   - Generate random subscriptions
   - Update due dates
   - Verify updates are saved and reflected in UI
   - **Feature: ui-improvements-and-fixes, Property 5: Due date updates persist**

6. **Property 6: Date formatting follows Indian convention**
   - Generate random dates
   - Format each date with Indian locale
   - Verify format matches DD/MM/YYYY pattern
   - **Feature: ui-improvements-and-fixes, Property 6: Date formatting follows Indian convention**

7. **Property 7: Currency formatting follows Indian convention**
   - Generate random currency values
   - Format with Indian locale
   - Verify comma placement follows Indian numbering system
   - **Feature: ui-improvements-and-fixes, Property 7: Currency formatting follows Indian convention**

8. **Property 8: Text contrast meets accessibility standards**
   - Generate random background colors with gradient overlay
   - Calculate contrast ratio with white text
   - Verify ratio meets WCAG AA standards (≥4.5:1)
   - **Feature: ui-improvements-and-fixes, Property 8: Text contrast meets accessibility standards**

### Integration Testing

- Test complete flow of AI generation → formatting → display → retry
- Test payment deletion → due date recalculation → UI update flow
- Test profile initialization with Indian defaults
- Test top bar rendering with gradient overlay

### Manual Testing

- Visual verification of AI analysis readability
- Visual verification of top bar text contrast
- User interaction testing for retry button
- Cross-browser testing for gradient overlay support
