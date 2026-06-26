import type { Project } from '@/lib/cms-types';
export type { Project } from '@/lib/cms-types';

export const projects: Project[] = [
  {
    slug: 'rpa-invoice-control-booking-reconciliation',
    title: 'RPA for Invoice Control and Booking Reconciliation',
    industry: 'Tourism Operations',
    challenge: 'Invoice control and booking reconciliation required repeated manual checks across invoices, vouchers, reservations, stay dates, board types, discounts, supplements and commercial conditions.',
    impact: 'Designed a repeatable validation workflow to make financial checks easier to review, trace and adapt across hotel and agency configurations.',
    contributions: [
      'Designed and expanded a UiPath workflow for invoice validation and booking reconciliation.',
      'Connected invoice data with booking, voucher and stay-related information.',
      'Automated business-rule checks covering room rates, board types, discounts, supplements and special offers.',
      'Generated structured JSON outputs and HTML review reports for audit and operational follow-up.',
      'Adapted the workflow to multiple agency processes and hotel configurations.',
    ],
    businessValue: [
      'Reduced dependence on repeated manual checking.',
      'Improved the consistency of validation steps.',
      'Made exceptions easier to trace and review.',
      'Created repeatable controls for finance and operations teams.',
      'Kept sensitive invoice, booking and commercial-rule data out of the public case study.',
    ],
    workflow: ['Invoice Data', 'Booking and Voucher Matching', 'Business Rule Validation', 'Rates, Discounts and Supplements', 'Structured JSON Output', 'HTML Review Report'],
    tools: ['UiPath', 'Business Rules Automation', 'JSON', 'HTML Reporting', 'Process Analysis'],
    cover: 'automation',
    confidentiality: 'This case study excludes real client data, invoice amounts, internal commercial rules, customer information and booking records.',
  },
  {
    slug: 'data-driven-digital-transformation-barbershop',
    title: "Data-Driven Digital Transformation for a Men's Barbershop",
    industry: 'Local Services / Digital Marketing',
    challenge: "A men's barbershop in France needed stronger local visibility, a smoother booking journey and more structured digital customer communication.",
    impact: 'Helped connect local discovery, online booking and customer communication into a clearer digital journey.',
    contributions: [
      'Built and managed a tailored website with an online booking system.',
      'Created an activity-monitoring interface for booking and customer interaction follow-up.',
      'Supported local visibility through local SEO and a stronger digital presence.',
      'Developed Instagram and TikTok content initiatives to improve engagement and brand visibility.',
      'Supported email marketing, paid social activity, online reviews and customer communication.',
      'Facilitated a partnership with Planity to streamline booking operations and improve the customer journey.',
    ],
    businessValue: [
      'Clearer online presence for local discovery.',
      'More structured booking experience.',
      'Better-organised customer communication touchpoints.',
      'Improved visibility of activity and booking signals.',
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
    challenge: 'Employees needed a secure and scalable learning platform that could support multilingual training, knowledge access, real-time interaction and internal productivity.',
    impact: 'Contributed to a secure learning environment with structured training workflows, productivity features and RAG-enabled knowledge access.',
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
      'Knowledge retrieval from controlled internal resources.',
      'Real-time interaction and productivity features.',
      'Security-conscious AI integration.',
    ],
    workflow: ['Users', 'Angular Interface', 'Spring Cloud Microservices', 'Keycloak / Kafka / Data Services', 'Ollama + LLaMA 3.2 + RAG Knowledge Retrieval', 'Monitoring, Security and Deployment Tooling'],
    tools: ['Angular', 'Angular Material', 'Spring Boot', 'Spring Cloud', 'Keycloak', 'Kafka', 'Docker', 'Jenkins', 'SonarQube', 'Prometheus', 'Grafana', 'Zipkin', 'OWASP ZAP', 'Ollama', 'RAG'],
    cover: 'architecture',
  },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }