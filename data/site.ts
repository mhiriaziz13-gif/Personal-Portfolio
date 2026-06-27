import type { Education, Profile, SkillCluster, ValueCard } from '@/lib/cms-types';

export const person: Profile = {
  name: 'Ahmed Aziz Mhiri',
  location: 'Sousse, Tunisia',
  email: 'mhiriaziz13@gmail.com',
  linkedIn: 'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  headline: 'Marketing Data Analysis | Business Intelligence | Automation | Digital Marketing',
  homepageTitle: 'Marketing analytics, business intelligence and automation for clearer operations',
  tagline: 'Helping teams understand customers, processes and commercial performance',
  availability: 'Available for Europe-based opportunities from Summer 2027.',
  summary: 'Ahmed Aziz Mhiri is a Business Intelligence graduate and Big Data Analytics and E-Commerce master\'s student. He works across data, automation, marketing and business operations, with a focus on clearer processes, smoother customer journeys and better-informed commercial decisions.',
  aboutHeading: 'I am building my career around data, marketing, operations and automation.',
  aboutBody: 'My background is in Business Intelligence, and I am completing a master\'s degree in Big Data Analytics and E-Commerce at IHEC Carthage. I enjoy work that turns operational detail into useful reporting, connects marketing activity with customer behaviour, and makes business processes easier to follow.',
  longTermObjective: 'I am interested in roles where analysis, automation and commercial context meet: marketing data analysis, business intelligence, revenue operations, CRM or process automation. From Summer 2027, I am available for Europe-based opportunities.',
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
  { kicker: '01', title: 'Marketing Analytics', body: 'Reading campaign, customer and journey signals so marketing choices are easier to prioritise.', detail: 'Ahmed looks at how people discover, compare, book, buy or return, then connects those signals to practical questions about visibility, friction and follow-up.' },
  { kicker: '02', title: 'Commercial Analytics', body: 'Connecting operational data with revenue logic, offers and customer behaviour.', detail: 'Commercial analysis is useful when teams can see how activity, pricing conditions, customer needs and operational constraints affect the next decision.' },
  { kicker: '03', title: 'Business Intelligence', body: 'Structuring KPIs, reporting flows and dashboards around decisions teams actually make.', detail: 'Clear reporting helps teams compare performance, spot gaps and work from a shared view of the facts instead of scattered files or disconnected updates.' },
  { kicker: '04', title: 'Automation', body: 'Building repeatable workflows that reduce manual checks and leave a clearer review trail.', detail: 'Automation is strongest when business rules are understandable, outputs can be reviewed, and people can trace how a result was produced.' },
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
