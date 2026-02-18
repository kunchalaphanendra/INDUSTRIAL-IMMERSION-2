
import React from 'react';

export enum TrackKey {
  SCHOOL_TUITION = 'school_tuition',
  SCHOOL_SKILL = 'school_skill',
  COLLEGE_PROF = 'college_prof',
  COLLEGE_IMMERSION = 'college_immersion'
}

export enum InstitutionType {
  SCHOOL = 'school',
  COLLEGE = 'college'
}

export enum BillingType {
  MONTHLY = 'monthly',
  ONETIME = 'one-time'
}

export enum DomainKey {
  FASHION = 'fashion',
  BEVERAGE = 'beverage',
  ELECTRONICS = 'electronics',
  GROWTH = 'growth',
  TECH = 'tech'
}

export type CourseStatus = 'pending' | 'ongoing' | 'completed' | 'dropout';
export type ProgramType = 'school_program' | 'college_program';

export interface TrackData {
  title: string;
  duration: string;
  price: number;
  billingType: BillingType;
  description: string;
  features: string[];
  idealFor: string;
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
  isAdmin?: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  course: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  currentStatus?: string;
  workExperience?: string;
  institutionName?: string;
  role?: 'Student' | 'School' | 'College' | 'Parent';
  careerGoals: string;
  selectedTrack?: TrackKey;
  selectedDomain?: DomainKey;
}

export interface ApplicationRecord extends UserRegistration {
  id: string;
  application_id: string;
  track_key: TrackKey;
  program_type: ProgramType;
  course_status: CourseStatus;
  payment_status: string;
  // Added amount_paid to resolve property missing errors in admin components
  amount_paid: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_at: string;
}

export interface EnrollmentState {
  track: TrackKey | null;
  domain?: DomainKey | null;
}

export interface EnrollmentRecord {
  id: string;
  track_key: TrackKey;
  domain_key?: DomainKey;
  created_at: string;
  payment_status: string;
  progress: number;
}

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}



