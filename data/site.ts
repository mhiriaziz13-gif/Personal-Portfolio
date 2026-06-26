import type { Education, Profile, SkillCluster, ValueCard } from '@/lib/cms-types';

export const person: Profile = {
  name: 'Ahmed Aziz Mhiri',
  location: 'Sousse, Tunisia',
  email: 'mhiriaziz13@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  headline: 'Data-Driven Marketing & Commercial Analytics | Business Intelligence, Automation & Digital Growth',
  homepageTitle: 'Data-Driven Marketing · Commercial Analytics · Business Intelligence',
  tagline: 'Turning Data into Commercial Growth',
  availability: 'Available for Europe-based opportunities from Summer 2027.',
  summary: 'Master’s student in Big Data Analytics & E-Commerce at IHEC Carthage, with a Business Intelligence background. Ahmed works at the intersection of data, digital marketing and commercial performance - translating operational, customer and marketing signals into clearer decisions, stronger customer journeys and more reliable business processes.',
  aboutHeading: 'Data is most valuable when it improves how a business serves customers and makes decisions.',
  aboutBody: 'Ahmed’s interests sit at the intersection of data, digital marketing and commercial performance. Across professional and academic projects, he has worked on business process automation, web platforms, marketing operations, analytics dashboards and AI-enabled applications.',
  longTermObjective: 'His long-term objective is to help organisations use data not only to report what happened, but to improve acquisition, conversion, customer experience and revenue performance.',
  targetCountries: ['Serbia', 'Croatia', 'Hungary', 'Italy', 'Spain'],
  portraitUrl: '/images/ahmed-portrait.png',
};

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
];

export const valueCards: ValueCard[] = [
  { kicker: '01', title: 'Marketing Analytics', body: 'Turning customer, campaign and operational signals into clearer decisions.', detail: 'A business-oriented lens for customer insight, campaign learning and more useful marketing actions.' },
  { kicker: '02', title: 'Commercial Analytics', body: 'Connecting data to conversion, revenue, profitability and customer journeys.', detail: 'Commercial performance becomes easier to prioritise when operational data and customer touchpoints are connected.' },
  { kicker: '03', title: 'Business Intelligence', body: 'Structured reporting, KPI analysis, dashboards and decision support.', detail: 'Clear, dependable reporting for teams that need to understand performance gaps and act on them.' },
  { kicker: '04', title: 'Automation', body: 'Reliable workflows that reduce manual work and improve traceability.', detail: 'Business rules, structured outputs and repeatable controls designed for operational reliability.' },
];

export const skillClusters: SkillCluster[] = [
  { title: 'Data & Business Intelligence', items: ['Data Analysis', 'Marketing Analytics', 'Commercial Analytics', 'Business Intelligence', 'KPI Analysis', 'Data Visualization', 'Financial Reporting', 'Excel'] },
  { title: 'Digital Marketing & Customer Growth', items: ['Digital Marketing', 'Customer Insights', 'Customer Journey', 'Local SEO', 'Email Marketing', 'Paid Social', 'Social Media Strategy', 'E-Commerce'] },
  { title: 'Automation & Technology', items: ['UiPath', 'Process Automation', 'Business Rules Automation', 'JSON', 'HTML Reporting', 'Angular', 'Spring Boot', 'REST APIs', 'RAG'] },
  { title: 'Professional Strengths', items: ['Commercial Thinking', 'Problem Solving', 'Cross-Functional Collaboration', 'Process Improvement', 'Structured Communication'] },
];

export const education: Education[] = [
  { title: 'Master’s Degree - Big Data Analytics & E-Commerce', organisation: 'IHEC Carthage', date: 'October 2025 - June 2027', detail: 'Expected graduation: June 2027' },
  { title: 'Bachelor’s Degree - Business Intelligence', organisation: 'IHEC Carthage', date: 'January 2021 - June 2025', detail: '' },
];

export const certification = 'Fundamentals of Digital Marketing - Google';
