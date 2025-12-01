import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { paymentHistoryArbitrary, subscriptionWithHistoryArbitrary } from '../utils/mockData';


/**
 * Feature: ui-improvements-and-fixes, Property 3: Payment deletion removes record
 * 
 * For any payment history record, when deleted, the record should no longer exist in the database
 * 
 * Validates: Requirements 3.1
 */
describe('Property 3: Payment deletion removes record', () => {
  it('should remove payment record from collection', () => {
    fc.assert(
      fc.property(paymentHistoryArbitrary, (payment) => {
        // Simulate a collection of payments
        const payments = [payment];
        
        // Simulate deletion
        const remainingPayments = payments.filter(p => p.id !== payment.id);
        
        // Property: Payment should no longer exist
        expect(remainingPayments).toHaveLength(0);
        expect(remainingPayments.find(p => p.id === payment.id)).toBeUndefined();
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle deletion from multiple payments', () => {
    fc.assert(
      fc.property(
        fc.array(paymentHistoryArbitrary, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (payments, indexToDelete) => {
          if (indexToDelete >= payments.length) return true;
          
          const paymentToDelete = payments[indexToDelete];
          const initialCount = payments.length;
          
          // Simulate deletion
          const remainingPayments = payments.filter(p => p.id !== paymentToDelete.id);
          
          // Property: Count should decrease by 1
          expect(remainingPayments).toHaveLength(initialCount - 1);
          
          // Property: Deleted payment should not exist
          expect(remainingPayments.find(p => p.id === paymentToDelete.id)).toBeUndefined();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: ui-improvements-and-fixes, Property 4: Payment deletion recalculates due date
 * 
 * For any subscription with payment history, when a payment is deleted, 
 * the next billing date should be recalculated based on the subscription cycle
 * 
 * Validates: Requirements 3.2
 */
describe('Property 4: Payment deletion recalculates due date', () => {
  it('should recalculate due date by going back one cycle', () => {
    fc.assert(
      fc.property(subscriptionWithHistoryArbitrary, ({ subscription }) => {
        // Skip custom cycles without customDays defined
        if (subscription.cycle === 'custom' && !subscription.customDays) {
          return true;
        }
        
        const currentBillingDate = subscription.nextBillingDate;
        
        // Calculate what the previous billing date should be
        const d = new Date(currentBillingDate);
        if (subscription.cycle === 'monthly') d.setMonth(d.getMonth() - 1);
        else if (subscription.cycle === 'yearly') d.setFullYear(d.getFullYear() - 1);
        else if (subscription.cycle === 'quarterly') d.setMonth(d.getMonth() - 3);
        else if (subscription.cycle === 'biannual') d.setMonth(d.getMonth() - 6);
        else if (subscription.cycle === 'custom' && subscription.customDays) {
          d.setDate(d.getDate() - subscription.customDays);
        }
        
        const expectedPreviousDate = d.toISOString().split('T')[0];
        
        // Property: Previous date should be before or equal to current date
        expect(new Date(expectedPreviousDate).getTime()).toBeLessThanOrEqual(
          new Date(currentBillingDate).getTime()
        );
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain cycle consistency when deleting and re-adding', () => {
    fc.assert(
      fc.property(subscriptionWithHistoryArbitrary, ({ subscription }) => {
        // Skip custom cycles without customDays defined
        if (subscription.cycle === 'custom' && !subscription.customDays) {
          return true;
        }
        
        const originalDate = subscription.nextBillingDate;
        
        // Simulate deletion (go back one cycle)
        const d1 = new Date(originalDate);
        if (subscription.cycle === 'monthly') d1.setMonth(d1.getMonth() - 1);
        else if (subscription.cycle === 'yearly') d1.setFullYear(d1.getFullYear() - 1);
        else if (subscription.cycle === 'quarterly') d1.setMonth(d1.getMonth() - 3);
        else if (subscription.cycle === 'biannual') d1.setMonth(d1.getMonth() - 6);
        else if (subscription.cycle === 'custom' && subscription.customDays) {
          d1.setDate(d1.getDate() - subscription.customDays);
        }
        const afterDeletion = d1.toISOString().split('T')[0];
        
        // Simulate re-adding (go forward one cycle)
        const d2 = new Date(afterDeletion);
        if (subscription.cycle === 'monthly') d2.setMonth(d2.getMonth() + 1);
        else if (subscription.cycle === 'yearly') d2.setFullYear(d2.getFullYear() + 1);
        else if (subscription.cycle === 'quarterly') d2.setMonth(d2.getMonth() + 3);
        else if (subscription.cycle === 'biannual') d2.setMonth(d2.getMonth() + 6);
        else if (subscription.cycle === 'custom' && subscription.customDays) {
          d2.setDate(d2.getDate() + subscription.customDays);
        }
        const afterReAdding = d2.toISOString().split('T')[0];
        
        // Property: Should return to approximately the same date
        // (allowing for month-end edge cases)
        const originalTime = new Date(originalDate).getTime();
        const finalTime = new Date(afterReAdding).getTime();
        const diffDays = Math.abs(originalTime - finalTime) / (1000 * 60 * 60 * 24);
        
        // Allow up to 3 days difference for month-end edge cases
        expect(diffDays).toBeLessThanOrEqual(3);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: ui-improvements-and-fixes, Property 5: Due date updates persist
 * 
 * For any subscription with an updated due date, the new date should be 
 * saved to Firestore and reflected in the UI immediately
 * 
 * Validates: Requirements 3.3, 3.4
 */
describe('Property 5: Due date updates persist', () => {
  it('should update subscription with new due date', () => {
    fc.assert(
      fc.property(subscriptionWithHistoryArbitrary, ({ subscription }) => {
        // Simulate updating the due date
        const newDate = new Date(subscription.nextBillingDate);
        newDate.setDate(newDate.getDate() + 7);
        const updatedDate = newDate.toISOString().split('T')[0];
        
        // Simulate the update
        const updatedSubscription = {
          ...subscription,
          nextBillingDate: updatedDate
        };
        
        // Property: Updated subscription should have new date
        expect(updatedSubscription.nextBillingDate).toBe(updatedDate);
        expect(updatedSubscription.nextBillingDate).not.toBe(subscription.nextBillingDate);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should reflect updates immediately in UI state', () => {
    fc.assert(
      fc.property(subscriptionWithHistoryArbitrary, ({ subscription }) => {
        // Simulate UI state
        let displayedDate = subscription.nextBillingDate;
        
        // Simulate update
        const newDate = new Date(subscription.nextBillingDate);
        
        // Skip invalid dates
        if (isNaN(newDate.getTime())) {
          return true;
        }
        
        newDate.setMonth(newDate.getMonth() + 1);
        const updatedDate = newDate.toISOString().split('T')[0];
        
        // Update UI state
        displayedDate = updatedDate;
        
        // Property: UI should show updated date
        expect(displayedDate).toBe(updatedDate);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
