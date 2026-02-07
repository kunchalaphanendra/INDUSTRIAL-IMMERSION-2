
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
}

// Fixed: Added linkedin, currentStatus, and workExperience to UserRegistration
// Fixed: Made role optional as it's not present in the CheckoutModal form initialization
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



