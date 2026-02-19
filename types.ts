
import React from 'react';

// Added BillingType enum for subscription and one-time payments
export enum BillingType {
  MONTHLY = 'monthly',
  ONETIME = 'onetime'
}

// Added InstitutionType enum for program categorization in the UI
export enum InstitutionType {
  SCHOOL = 'school',
  COLLEGE = 'college'
}

// Added DomainKey enum for defining different industrial tracks
export enum DomainKey {
  FASHION = 'fashion',
  BEVERAGE = 'beverage',
  ELECTRONICS = 'electronics',
  GROWTH = 'growth',
  TECH = 'tech'
}

export enum TrackKey {
  SCHOOL_TUITION = 'school_tuition',
  SCHOOL_SKILL = 'school_skill',
  COLLEGE_PROF = 'college_prof',
  COLLEGE_IMMERSION = 'college_immersion'
}

// Added TrackData interface to describe program structures
export interface TrackData {
  title: string;
  duration: string;
  price: number;
  billingType: BillingType;
  description: string;
  idealFor: string;
  features: string[];
}

// Added DomainData interface to describe specific industry domain deliverables
export interface DomainData {
  title: string;
  icon: string;
  description: string;
  outputs: string[];
}

export type CourseStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'DROPOUT' | null;
export type StudentType = 'SCHOOL' | 'COLLEGE';
export type ProgramType = 'school_program' | 'college_program';

export interface UserRegistration {
  fullName: string;
  email: string;
  phone: string;
  institutionName: string; // Captured educational institution
  linkedin?: string;
  currentStatus?: string;
  careerGoals: string;
  studentType?: StudentType;
}

export interface ApplicationRecord extends UserRegistration {
  id: string;
  application_id: string;
  track_key: TrackKey;
  program_type: ProgramType;
  student_type: StudentType;
  course_status: CourseStatus;
  payment_status: string;
  amount_paid: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_at: string;
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
  approval_status: 'pending' | 'approved' | 'rejected'; // Updated from is_approved boolean
  created_at: string;
}

export interface EnrollmentState {
  track: TrackKey | null;
}

export interface EnrollmentRecord {
  id: string;
  track_key: TrackKey;
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








