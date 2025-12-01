# Implementation Plan

- [x] 1. Set up testing infrastructure and utilities


  - Create test utilities for AI response formatting
  - Set up mock data generators for subscriptions and payment history
  - Configure Vitest and fast-check for the project
  - _Requirements: All (testing foundation)_

- [x] 1.1 Write property test for AI formatting


  - **Property 1: AI analysis formatting consistency**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 2. Implement AI analysis formatting and display improvements


  - Create `formatAIResponse` utility function to parse and structure AI text into bullet points
  - Update Daily Briefing section to use formatted markdown rendering
  - Update Subscription Analysis section to use formatted markdown rendering
  - Apply consistent styling for AI-generated content sections
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Add retry button component for AI regeneration

  - Create `RetryButton` component with refresh icon from lucide-react
  - Add retry button to Daily Briefing section
  - Add retry button to Subscription Analysis section
  - Implement loading state and visual feedback during regeneration
  - Wire up retry handlers to regenerate AI content
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3.1 Write property test for retry functionality


  - **Property 2: Retry button regeneration**
  - **Validates: Requirements 2.2, 2.3, 2.4**

- [x] 4. Fix payment deletion bug and due date recalculation


  - Update `deleteHistoryItem` function to recalculate next billing date
  - Implement logic to determine new due date based on subscription cycle and remaining history
  - Update subscription document in Firestore with new due date
  - Ensure UI reflects updated due date immediately after deletion
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4.1 Write property test for payment deletion


  - **Property 3: Payment deletion removes record**
  - **Validates: Requirements 3.1**

- [x] 4.2 Write property test for due date recalculation

  - **Property 4: Payment deletion recalculates due date**
  - **Validates: Requirements 3.2**

- [x] 4.3 Write property test for due date persistence

  - **Property 5: Due date updates persist**
  - **Validates: Requirements 3.3, 3.4**

- [x] 5. Implement Indian localization defaults


  - Update initial `profile` state to set currency to '₹' (Indian Rupees)
  - Update initial `profile` state to set timezone to 'Asia/Kolkata'
  - Create date formatting utility for DD/MM/YYYY format
  - Create currency formatting utility for Indian numbering conventions (lakhs/crores)
  - Apply Indian date format throughout the application
  - Apply Indian currency formatting throughout the application
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5.1 Write property test for Indian date formatting

  - **Property 6: Date formatting follows Indian convention**
  - **Validates: Requirements 4.3**

- [x] 5.2 Write property test for Indian currency formatting

  - **Property 7: Currency formatting follows Indian convention**
  - **Validates: Requirements 4.4**

- [x] 6. Add gradient overlay to top bar for text visibility


  - Create CSS gradient overlay for top bar background image
  - Position gradient to cover area behind white text headings
  - Implement fade effect that gradually transitions to transparent
  - Apply gradient overlay to top bar component
  - Test text contrast across different background images
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6.1 Write property test for text contrast

  - **Property 8: Text contrast meets accessibility standards**
  - **Validates: Requirements 5.4**

- [x] 7. Final integration and polish


  - Test complete AI generation → formatting → display → retry flow
  - Test payment deletion → due date recalculation → UI update flow
  - Verify Indian localization defaults work correctly for new users
  - Verify top bar text is readable across all tabs and background images
  - Perform cross-browser testing for gradient overlay
  - _Requirements: All_

- [x] 8. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.
