
import { TrackKey, TrackData, BillingType, DomainKey, DomainData } from './types';

export const TRACKS: Record<TrackKey, TrackData> = {
  [TrackKey.SCHOOL_TUITION]: {
    title: 'School Tuition Program',
    duration: 'Monthly Subscription',
    price: 999,
    billingType: BillingType.MONTHLY,
    description: 'After-school academic support designed to strengthen core foundations.',
    idealFor: 'Schools looking to enhance academic outcomes through structured learning.',
    features: [
      'Academic tuition support',
      'Structured learning modules',
      'Monthly progress monitoring',
      'Reports for schools & parents',
      'Institutional coordination'
    ]
  },
  [TrackKey.SCHOOL_SKILL]: {
    title: 'Skill & Communication Program',
    duration: 'Monthly Subscription',
    price: 1299,
    billingType: BillingType.MONTHLY,
    description: 'Preparing students for the digital world through communication and tech literacy.',
    idealFor: 'Schools aiming to improve digital readiness and student confidence.',
    features: [
      'Digital literacy fundamentals',
      'Spoken English & Communication',
      'Confidence building activities',
      'Teacher briefing sessions',
      'Continuous progress tracking'
    ]
  },
  [TrackKey.COLLEGE_PROF]: {
    title: 'Professional Skills Certification',
    duration: '4 Months',
    price: 9999,
    billingType: BillingType.ONETIME,
    description: 'Core skill development for career readiness and professional foundation.',
    idealFor: 'Colleges seeking structured skill curriculum for their students.',
    features: [
      'Skill development curriculum',
      'Practical projects & assignments',
      'Industry-relevant modules',
      'Professional certificate',
      'Career foundation'
    ]
  },
  [TrackKey.COLLEGE_IMMERSION]: {
    title: 'Industry Immersion Certification',
    duration: '6 + 6 Months',
    price: 14999,
    billingType: BillingType.ONETIME,
    description: 'Comprehensive 1-year journey: 6 months of cross-domain professional training (Fashion, Tech, FMCG, etc.) followed by 6 months of guaranteed work experience.',
    idealFor: 'Students seeking complete industrial exposure across multiple high-growth sectors.',
    features: [
      '6 Months Multi-Domain Training',
      '6 Months Guaranteed Work Experience',
      'Experience with Fashion, Tech & FMCG',
      'Professional Mentorship & Network',
      'Joint Industry Experience Letter'
    ]
  }
};

export const DOMAINS: Record<DomainKey, DomainData> = {
  [DomainKey.FASHION]: {
    title: 'Lifestyle & Fashion',
    icon: '👕',
    description: 'Build brand presence for apparel and luxury lifestyle brands.',
    outputs: ['Campaign Assets', 'Influencer Strategy', 'Engagement Report']
  },
  [DomainKey.BEVERAGE]: {
    title: 'FMCG & Beverages',
    icon: '🥤',
    description: 'Master distribution-led digital growth for food and beverage labels.',
    outputs: ['Market Analysis', 'Visual Strategy', 'Consumer Feedback']
  },
  [DomainKey.ELECTRONICS]: {
    title: 'Consumer Electronics',
    icon: '🔌',
    description: 'Execute technical product launches for hardware and gadget startups.',
    outputs: ['Tech Specs Copy', 'Tutorial Assets', 'Support Roadmap']
  },
  [DomainKey.GROWTH]: {
    title: 'B2B Growth',
    icon: '📈',
    description: 'High-level lead generation and professional networking for agencies.',
    outputs: ['Pipeline Report', 'Client Persona', 'Growth Funnel']
  },
  [DomainKey.TECH]: {
    title: 'SaaS & Tech',
    icon: '💻',
    description: 'Drive user acquisition for software products and platform services.',
    outputs: ['User Flow Design', 'SaaS Onboarding', 'DevRel Assets']
  }
};

export const ENROLLMENT_STEPS = [
  'Profile Review',
  'Skill Assessment',
  'Multi-Domain Intro',
  'Slot Reservation',
  'Execution Start'
];

export const PARTNERS = [
  'Visionary Media', 'TechFlow Inc.', 'GrowthHackers', 'BrandPulse', 'NextGen Creative', 'Alpha Agency', 'SocialScale'
];

export const CORE_AREAS = [
  'Academic Excellence',
  'Digital Literacy',
  'Communication Skills',
  'Industry Execution',
  'Professional Ethics'
];

export const FAQS = [
  {
    question: "How do institutions partner with us?",
    answer: "Schools and Colleges can submit an enquiry via the 'Partner With Us' section. Our institutional coordination team will then reach out to customize the rollout."
  },
  {
    question: "Is the Industry Immersion certificate verified?",
    answer: "Yes. Certificates are jointly issued by our organization and the respective partner brands, providing verifiable proof of work experience."
  },
  {
    question: "Can individual students join directly?",
    answer: "While we prioritize institutional partnerships, individual students can apply via the 'Student Application' path if their college is not yet a partner."
  }
];



