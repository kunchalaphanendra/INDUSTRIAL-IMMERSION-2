
export enum TrackKey {
  EXECUTION = 'Execution Certificate Track',
  INDUSTRIAL_EXP = 'Industrial Experience Certificate Track'
}

export enum DomainKey {
  FASHION = 'fashion',
  BEVERAGE = 'beverage',
  ELECTRONICS = 'electronics',
  GROWTH = 'growth',
  TECH = 'tech'
}

export interface TrackData {
  title: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
}

export interface DomainData {
  title: string;
  icon: string;
  description: string;
  outputs: string[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  currentStatus: 'Student' | 'Fresher' | 'Professional' | 'Entrepreneur';
  workExperience?: string;
  careerGoals: string;
  selectedDomain?: DomainKey;
  paymentId?: string;
  orderId?: string;
  signature?: string;
}

export interface EnrollmentState {
  track: TrackKey | null;
  domain?: DomainKey | null;
  userData?: UserRegistration;
}

export interface EnrollmentRecord {
  id: string;
  track_key: TrackKey;
  created_at: string;
  payment_status: string;
  progress: number;
}

// Added missing types for CourseCard compatibility
export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface CourseData {
  title: string;
  description: string;
  outcomes: string[];
}

export type SpecializationKey = string;


