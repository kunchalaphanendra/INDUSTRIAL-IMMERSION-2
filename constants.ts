
import { TrackKey, TrackData, BillingType, DomainKey, DomainData, FAQCategory } from '@/types';

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
  },
  [TrackKey.INFLUENCER_COHORT]: {
    title: 'Influencer Cohort',
    duration: '3 Months',
    price: 12999,
    billingType: BillingType.ONETIME,
    description: 'Master the art of personal branding and content execution for the creator economy.',
    idealFor: 'Aspiring creators and brand ambassadors seeking industrial exposure.',
    features: [
      'Content strategy & execution',
      'Brand collaboration modules',
      'Audience growth mechanics',
      'Production quality training',
      'Creator network access'
    ]
  },
  [TrackKey.MANAGEMENT_SUITE]: {
    title: 'Management Suite',
    duration: '6 Months',
    price: 19999,
    billingType: BillingType.ONETIME,
    description: 'Advanced operational management and business execution for future leaders.',
    idealFor: 'Graduates looking to enter management roles with practical experience.',
    features: [
      'Operational excellence training',
      'Team leadership execution',
      'Business process mapping',
      'Stakeholder management',
      'Strategic planning projects'
    ]
  },
  [TrackKey.FINANCE_PRO]: {
    title: 'Finance Pro',
    duration: '4 Months',
    price: 15999,
    billingType: BillingType.ONETIME,
    description: 'Practical financial operations and industrial accounting for modern businesses.',
    idealFor: 'Finance students seeking real-world exposure to business accounts.',
    features: [
      'Industrial accounting tasks',
      'Financial reporting & analysis',
      'Taxation & compliance modules',
      'Budgeting & forecasting',
      'FinTech tool proficiency'
    ]
  },
  [TrackKey.CORPORATE_IMMERSION]: {
    title: 'Corporate Immersion',
    duration: '12 Months',
    price: 24999,
    billingType: BillingType.ONETIME,
    description: 'Full-scale corporate embedding with rotational roles across departments.',
    idealFor: 'Professionals seeking a complete transition into corporate environments.',
    features: [
      'Departmental rotations',
      'Corporate culture integration',
      'High-impact project ownership',
      'Executive mentorship',
      'Global business standards'
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

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "General Program",
    items: [
      {
        question: "Is this a job guarantee program?",
        answer: "No. This is not a job guarantee program. It is an industry immersion program where participants work on real business deliverables. Employment depends on individual performance, business needs, and availability of roles."
      },
      {
        question: "Is this a course or training program?",
        answer: "No. This is not a traditional course or classroom-based training. Participants are embedded into live business environments and are evaluated on execution and outcomes."
      },
      {
        question: "What makes this different from internships?",
        answer: "Traditional internships are often observational or limited in responsibility. In this program, participants are assigned real operational tasks that contribute directly to business outcomes."
      },
      {
        question: "Are the projects real or simulated?",
        answer: "All projects are real and live. There are no mock assignments, simulations, or dummy case studies."
      },
      {
        question: "Who provides the projects?",
        answer: "Projects come from: Active brands, Agencies, Product-based companies, and Internal ventures and partner organizations."
      }
    ]
  },
  {
    title: "Execution Certificate",
    items: [
      {
        question: "What is the Execution Certificate?",
        answer: "The Execution Certificate is a short-term, execution-focused program designed to build core operational skills through structured live tasks."
      },
      {
        question: "How long is the program?",
        answer: "Typically 4–6 weeks, depending on the domain and deliverables."
      },
      {
        question: "What kind of work will I do?",
        answer: "Work may include: Business operations, Content or growth execution, Process documentation, Research & implementation, and Live task ownership."
      },
      {
        question: "What will I receive at the end?",
        answer: "You will receive an Execution Certificate, verifiable work outputs, and portfolio-ready deliverables."
      }
    ]
  },
  {
    title: "Industrial Experience Certificate",
    items: [
      {
        question: "What is the Industrial Experience Certificate?",
        answer: "This is an advanced immersion program where participants work directly with live businesses under professional supervision."
      },
      {
        question: "How long is the program?",
        answer: "Typically 8–12 weeks, depending on the industry and project scope."
      },
      {
        question: "Will I receive an experience letter?",
        answer: "Participants who successfully complete the program and meet performance standards receive an Industrial Experience Certificate and, where applicable, a work verification letter."
      }
    ]
  },
  {
    title: "Time Commitment & Format",
    items: [
      {
        question: "How many hours per week are required?",
        answer: "Execution Certificate: 10–15 hours/week. Industrial Experience Certificate: 20–30 hours/week. Actual hours depend on project complexity."
      },
      {
        question: "Is the program remote or on-site?",
        answer: "The program is primarily remote. Some projects may involve optional on-site collaboration where feasible."
      },
      {
        question: "Can I do this alongside college or a job?",
        answer: "Yes, provided you can meet the execution requirements and deadlines."
      }
    ]
  },
  {
    title: "Domain & Placement",
    items: [
      {
        question: "Can I choose the industry or domain?",
        answer: "Participants can express preferences, but final placement depends on: Availability of projects, Skill alignment, and Performance during screening."
      },
      {
        question: "What industries are included?",
        answer: "Fashion & Apparel, Food & Beverages, Consumer Electronics & Wearables, Technology & SaaS, Social Media & Growth Agencies."
      }
    ]
  },
  {
    title: "Payments & Policies",
    items: [
      {
        question: "Is there a refund policy?",
        answer: "Refunds are governed by program-specific terms shared before enrollment."
      },
      {
        question: "Are EMI or bulk options available?",
        answer: "Yes. EMI options may be available for individuals, and bulk pricing applies for institutions."
      }
    ]
  },
  {
    title: "Institutions (Schools & Colleges)",
    items: [
      {
        question: "Do you work directly with schools and colleges?",
        answer: "Yes. We partner with institutions to deliver execution-based industry exposure at scale. The program complements academics by providing practical execution exposure."
      },
      {
        question: "Can colleges run this for entire batches?",
        answer: "Yes. Execution and Industrial Experience Certificates are available under bulk and campus licensing models."
      }
    ]
  }
];

export const FAQS = FAQ_CATEGORIES.flatMap(cat => cat.items);



