/**
 * Type definitions for the application
 */

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  cycle: 'monthly' | 'yearly' | 'quarterly' | 'biannual' | 'custom';
  customDays?: number;
  nextBillingDate: string;
  category: string;
  description?: string;
  priority: Priority;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: any;
  dueDate?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  currency: string;
  language: 'en' | 'jp' | 'es' | 'fr';
  timezone: string;
  alarmSound: string;
}
