import type { Education, Profile, SkillCluster, ValueCard } from '@/lib/cms-types';

export const person: Profile = {
  name: 'Ahmed Aziz Mhiri',
  location: 'Sousse, Tunisia',
  email: 'mhiriaziz13@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  headline: 'Marketing Analytics | Commercial Analytics | Business Intelligence | Automation',
  homepageTitle: 'Data-driven marketing, commercial analytics and business intelligence',
  tagline: 'Turning operational and customer data into clearer business decisions',
  availability: 'Available for Europe-based opportunities from Summer 2027.',
  summary: 'Master\'s student in Big Data Analytics and E-Commerce at IHEC Carthage, with a Business Intelligence background. Ahmed works across data, digital marketing and commercial operations, helping translate customer, campaign and process signals into clearer decisions and more reliable workflows.',
  aboutHeading: 'I work where data, marketing activity and operations meet commercial decisions.',
  aboutBody: 'Ahmed is interested in practical analytics work: understanding how customers move through a journey, how operations create friction, how marketing actions perform, and how automation can make business processes easier to trust and repeat.',
  longTermObjective: 'His goal is to help teams use data not only to describe performance, but to improve acquisition, conversion, customer experience, reporting quality and operational reliability.',
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
  { kicker: '01', title: 'Marketing Analytics', body: 'Reading customer, campaign and journey signals so marketing decisions become easier to prioritise.', detail: 'Ahmed connects campaign activity, audience behaviour and customer touchpoints to practical questions: what is working, where friction appears, and which next action is worth testing.' },
  { kicker: '02', title: 'Commercial Analytics', body: 'Linking operational and customer data to conversion, revenue logic and business priorities.', detail: 'Commercial analysis becomes more useful when teams can see how activity, offers, customer needs and operational constraints affect the next decision.' },
  { kicker: '03', title: 'Business Intelligence', body: 'Structuring KPIs, reporting flows and dashboards so teams can read performance with confidence.', detail: 'Clear reporting helps teams understand performance gaps, compare priorities and act with a shared view of the facts.' },
  { kicker: '04', title: 'Automation', body: 'Designing repeatable workflows that reduce manual checks and improve traceability.', detail: 'Automation work is strongest when business rules are clear, outputs are reviewable, and teams can trust the process behind the result.' },
];

export const skillClusters: SkillCluster[] = [
  { title: 'Data and Business Intelligence', items: ['Data Analysis', 'Marketing Analytics', 'Commercial Analytics', 'Business Intelligence', 'KPI Analysis', 'Data Visualization', 'Financial Reporting', 'Excel'] },
  { title: 'Digital Marketing and Customer Growth', items: ['Digital Marketing', 'Customer Insights', 'Customer Journey', 'Local SEO', 'Email Marketing', 'Paid Social', 'Social Media Strategy', 'E-Commerce'] },
  { title: 'Automation and Technology', items: ['UiPath', 'Process Automation', 'Business Rules Automation', 'JSON', 'HTML Reporting', 'Angular', 'Spring Boot', 'REST APIs', 'RAG'] },
  { title: 'Professional Strengths', items: ['Commercial Thinking', 'Problem Solving', 'Cross-Functional Collaboration', 'Process Improvement', 'Structured Communication'] },
];

export const education: Education[] = [
  { title: 'Master\'s Degree - Big Data Analytics and E-Commerce', organisation: 'IHEC Carthage', date: 'October 2025 - June 2027', detail: 'Expected graduation: June 2027' },
  { title: 'Bachelor\'s Degree - Business Intelligence', organisation: 'IHEC Carthage', date: 'January 2021 - June 2025', detail: '' },
];

export const certification = 'Fundamentals of Digital Marketing - Google';