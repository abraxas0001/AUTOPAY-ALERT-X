import * as fc from 'fast-check';
import type { Subscription, PaymentHistory, Priority } from '../../types';

/**
 * Fast-check arbitraries for generating test data
 */

export const priorityArbitrary = fc.constantFrom<Priority>('high', 'medium', 'low');

export const cycleArbitrary = fc.constantFrom<Subscription['cycle']>(
  'monthly',
  'yearly',
  'quarterly',
  'biannual',
  'custom'
);

export const dateStringArbitrary = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
  .map(date => date.toISOString().split('T')[0]);

export const subscriptionArbitrary: fc.Arbitrary<Subscription> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 3, maxLength: 20 }),
  cost: fc.double({ min: 1, max: 10000, noNaN: true }),
  currency: fc.constantFrom('$', '€', '¥', '₹', '£'),
  cycle: cycleArbitrary,
  customDays: fc.option(fc.integer({ min: 1, max: 365 }), { nil: undefined }),
  nextBillingDate: dateStringArbitrary,
  category: fc.constantFrom('Entertainment', 'Productivity', 'Utilities', 'Gaming'),
  description: fc.option(fc.lorem({ maxCount: 3 }), { nil: undefined }),
  priority: priorityArbitrary,
});

export const paymentHistoryArbitrary: fc.Arbitrary<PaymentHistory> = fc.record({
  id: fc.uuid(),
  date: dateStringArbitrary,
  amount: fc.double({ min: 1, max: 10000, noNaN: true }),
  currency: fc.constantFrom('$', '€', '¥', '₹', '£'),
});

export const aiResponseArbitrary = fc.lorem({ maxCount: 10, mode: 'sentences' });

/**
 * Generate a subscription with payment history
 */
export const subscriptionWithHistoryArbitrary = fc
  .tuple(subscriptionArbitrary, fc.array(paymentHistoryArbitrary, { minLength: 0, maxLength: 10 }))
  .map(([sub, history]) => ({
    subscription: sub,
    history: history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }));

/**
 * Generate RGB color values
 */
export const rgbColorArbitrary = fc.record({
  r: fc.integer({ min: 0, max: 255 }),
  g: fc.integer({ min: 0, max: 255 }),
  b: fc.integer({ min: 0, max: 255 }),
});
