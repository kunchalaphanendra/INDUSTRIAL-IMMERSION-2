
import { TrackKey, TrackData, DomainKey, DomainData } from './types';

export const TRACKS: Record<TrackKey, TrackData> = {
  [TrackKey.EXECUTION]: {
    title: 'Execution Certificate',
    duration: '6 Weeks',
    price: 30000,
    description: 'Intensive industrial training focused on core execution deliverables.',
    features: [
      'Industrial Skill Onboarding',
      'Portfolio Verification',
      'Live Mentor Supervision',
      'Official Execution Certificate'
    ]
  },
  [TrackKey.INDUSTRIAL_EXP]: {
    title: 'Industrial Experience Certificate',
    duration: '8–12 Weeks',
    price: 50000,
    description: 'Full immersion as a functional owner inside a live operating brand.',
    features: [
      'Everything in Execution Track',
      'Live Brand Asset Ownership',
      'Direct Founder Access',
      'Verified Experience Letter',
      'Personal Recommendations'
    ]
  }
};

export const DOMAINS: Record<DomainKey, DomainData> = {
  [DomainKey.FASHION]: {
    title: 'Fashion & Apparel Ops',
    icon: '👕',
    description: 'Manage lifecycle for premium clothing brands.',
    outputs: ['Vendor Onboarding', 'Catalog Management', 'Fulfillment Systems']
  },
  [DomainKey.BEVERAGE]: {
    title: 'Beverage Brand Ops',
    icon: '🥤',
    description: 'Execute growth for F&B and wellness labels.',
    outputs: ['SKU Strategy', 'B2B Sales Workflows', 'Distribution Mapping']
  },
  [DomainKey.ELECTRONICS]: {
    title: 'Electronics & Wearables',
    icon: '⌚',
    description: 'Work inside consumer tech and wearable startups.',
    outputs: ['Tech Specs Documentation', 'Launch Campaigns', 'Post-Sales Support']
  },
  [DomainKey.GROWTH]: {
    title: 'Growth & Social Agencies',
    icon: '🚀',
    description: 'Scale impact for social-first digital services.',
    outputs: ['Influencer Seeding', 'Ad Ops Management', 'Viral Loops']
  },
  [DomainKey.TECH]: {
    title: 'Tech Product Operations',
    icon: '💻',
    description: 'Internal operations for SaaS and software platforms.',
    outputs: ['User Onboarding', 'Feature Ops', 'Churn Analytics']
  }
};

export const INDUSTRIES = [
  'Fashion & Apparel', 'Food & Beverages', 'Consumer Electronics', 'SaaS & Tech', 'Growth Agencies'
];

export const WORK_ITEMS = [
  { title: 'Brand Storefronts (Live)', icon: '🏪' },
  { title: 'Product Launch Campaigns', icon: '🚀' },
  { title: 'Vendor & Supply Docs', icon: '📝' },
  { title: 'Growth Systems', icon: '📈' },
  { title: 'Sales Dashboards', icon: '📊' },
  { title: 'Operations Playbooks', icon: '📖' }
];

export const ENROLLMENT_STEPS = [
  'Apply',
  'Screening',
  'Domain Selection',
  'Fee Payment',
  'Onboarding'
];

export const FAQS = [
  {
    question: "Will I work on real revenue-generating brands?",
    answer: "Yes. Every student is assigned to a live operational brand within their chosen domain. You produce assets for active businesses, not classroom simulations."
  },
  {
    question: "Who owns the work I produce?",
    answer: "The partner brands own the intellectual property, but you receive full credit and a verifiable proof-of-work portfolio linking your identity to those results."
  },
  {
    question: "Can I continue with brands after the program?",
    answer: "Top performers are frequently absorbed into partner brands as full-time employees or high-tier consultants based on their industrial output score."
  },
  {
    question: "Is there a stipend involved?",
    answer: "This is a training-first immersion program. However, high-performing candidates in the Experience Track may be eligible for performance-based rewards or paid extensions."
  }
];

export const PARTNERS = [
  'Visionary Media', 'TechFlow Inc.', 'GrowthHackers', 'BrandPulse', 'NextGen Creative', 'Alpha Agency', 'SocialScale'
];

// Added missing CORE_AREAS constant used by syllabus modal
export const CORE_AREAS = [
  'Industrial Operations',
  'Functional Execution',
  'Brand Management',
  'Market Outreach',
  'Product Analytics'
];

