import type { Project } from '@/lib/cms-types';
export type { Project } from '@/lib/cms-types';

export const projects: Project[] = [
  {
    slug: 'rpa-invoice-control-booking-reconciliation',
    title: 'RPA for Invoice Control & Booking Reconciliation',
    industry: 'Tourism Operations',
    challenge: 'This project focused on an RPA workflow for tourism invoice control. The workflow brings together invoice, booking, voucher and stay-related information, then checks it against room rates, board types, discounts, supplements and special offers before producing reviewable outputs.',
    impact: 'The workflow reduces repetitive checking and gives finance and operations teams structured JSON outputs and HTML reports for review, audit and operational follow-up.',
    contributions: [
      'Worked on a UiPath workflow for invoice validation and booking reconciliation.',
      'Matched invoice lines with booking, voucher and stay-related information.',
      'Converted commercial validation rules into reviewable checks for room rates, board types, discounts, supplements and special offers.',
      'Produced structured JSON outputs and HTML reports to support review, audit and operational follow-up.',
      'Helped adapt the workflow to different agency processes and hotel configurations.',
    ],
    businessValue: [
      'Less time spent on repeated manual comparisons.',
      'More consistent validation steps before human review.',
      'Easier tracing of exceptions and mismatches.',
      'Structured outputs that support audit and follow-up.',
      'Sensitive invoices, rates, booking details, customer data and internal rules remain private.',
    ],
    workflow: ['Invoice and booking inputs', 'Voucher and stay matching', 'Commercial validation checks', 'Rate, board, discount and supplement review', 'Structured JSON output', 'HTML report for review'],
    tools: ['UiPath', 'Business Rules Automation', 'JSON', 'HTML Reporting', 'Process Analysis'],
    cover: 'automation',
    confidentiality: 'This public summary excludes real invoices, customer data, hotel rates, booking details, invoice amounts and internal commercial rules.',
  },
  {
    slug: 'data-driven-digital-transformation-barbershop',
    title: "Digital Journey & Booking Improvements for a Men's Barbershop",
    industry: 'Local Services / Digital Marketing',
    challenge: "A men's barbershop in France needed easier local discovery, a smoother booking journey and more consistent customer communication across web, social and booking channels.",
    impact: 'The work gave the business a clearer path from local search and social discovery to booking, reviews and repeat contact.',
    contributions: [
      'Built and managed a website connected to online booking.',
      'Created an activity-monitoring interface for booking and customer interaction follow-up.',
      'Worked on local SEO, social content and a more consistent digital presence.',
      'Supported email marketing, paid social activity, online reviews and customer communication.',
      'Facilitated a Planity partnership to make booking easier for the business and its customers.',
    ],
    businessValue: [
      'Clearer online presence for local discovery.',
      'More structured booking experience for customers.',
      'Better-organised communication before and after appointments.',
      'More visibility into booking and customer activity.',
      'A more connected path from discovery to repeat visits.',
    ],
    workflow: ['Discovery', 'Local SEO and Social Media', 'Website', 'Online Booking', 'Customer Communication', 'Reviews and Repeat Visits'],
    tools: ['Website and Booking Systems', 'Local SEO', 'Instagram', 'TikTok', 'Email Marketing', 'Paid Social', 'Planity'],
    cover: 'journey',
    beforeAfter: {
      before: ['Limited digital visibility.', 'Less structured booking experience.', 'Fragmented online communication.'],
      after: ['Website and online booking.', 'Improved local visibility.', 'Stronger social presence.', 'More structured customer touchpoints.', 'Easier activity monitoring.'],
    },
  },
  {
    slug: 'ai-ready-e-learning-platform',
    title: 'AI-Supported E-Learning Platform',
    industry: 'Enterprise Software / Learning',
    challenge: 'This internal learning platform project needed to support training workflows, multilingual access, controlled knowledge retrieval, real-time interaction and productivity features.',
    impact: 'The project contributed to a structured learning environment with course management, dashboards, notifications and RAG-enabled access to approved knowledge sources.',
    contributions: [
      'Developed learning-platform features including course enrolment, progress tracking, dashboards, internal event booking and real-time notifications.',
      'Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.',
      'Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.',
      'Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management.',
      'Added productivity features including notes, task management and a collaborative whiteboard.',
    ],
    businessValue: [
      'More structured learning workflows for internal users.',
      'Multilingual training support.',
      'Knowledge retrieval from controlled resources.',
      'Real-time interaction and productivity features.',
      'Security-conscious AI integration.',
    ],
    workflow: ['Users', 'Angular Interface', 'Spring Cloud Microservices', 'Keycloak / Kafka / Data Services', 'Ollama + LLaMA 3.2 + RAG Knowledge Retrieval', 'Monitoring, Security and Deployment Tooling'],
    tools: ['Angular', 'Angular Material', 'Spring Boot', 'Spring Cloud', 'Keycloak', 'Kafka', 'Docker', 'Jenkins', 'SonarQube', 'Prometheus', 'Grafana', 'Zipkin', 'OWASP ZAP', 'Ollama', 'RAG'],
    cover: 'architecture',
  },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
