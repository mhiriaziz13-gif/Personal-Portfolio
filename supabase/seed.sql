-- Run this AFTER schema.sql. It preserves the original portfolio content in Supabase.

insert into public.site_profile (id, name, location, email, linkedin_url, headline, homepage_title, tagline, availability, summary, about_heading, about_body, long_term_objective, target_countries, portrait_url)
values (
  1,
  'Ahmed Aziz Mhiri',
  'Sousse, Tunisia',
  'mhiriaziz13@gmail.com',
  'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  'Data-Driven Marketing & Commercial Analytics | Business Intelligence, Automation & Digital Growth',
  'Data-Driven Marketing · Commercial Analytics · Business Intelligence',
  'Turning Data into Commercial Growth',
  'Available for Europe-based opportunities from Summer 2027.',
  'Master’s student in Big Data Analytics & E-Commerce at IHEC Carthage, with a Business Intelligence background. Ahmed works at the intersection of data, digital marketing and commercial performance - translating operational, customer and marketing signals into clearer decisions, stronger customer journeys and more reliable business processes.',
  'Data is most valuable when it improves how a business serves customers and makes decisions.',
  'Ahmed’s interests sit at the intersection of data, digital marketing and commercial performance. Across professional and academic projects, he has worked on business process automation, web platforms, marketing operations, analytics dashboards and AI-enabled applications.',
  'His long-term objective is to help organisations use data not only to report what happened, but to improve acquisition, conversion, customer experience and revenue performance.',
  '["Serbia", "Croatia", "Hungary", "Italy", "Spain"]'::jsonb,
  '/images/ahmed-portrait.png'
)
on conflict (id) do update set
  name = excluded.name, location = excluded.location, email = excluded.email, linkedin_url = excluded.linkedin_url,
  headline = excluded.headline, homepage_title = excluded.homepage_title, tagline = excluded.tagline,
  availability = excluded.availability, summary = excluded.summary, about_heading = excluded.about_heading,
  about_body = excluded.about_body, long_term_objective = excluded.long_term_objective,
  target_countries = excluded.target_countries, portrait_url = excluded.portrait_url;

delete from public.value_cards;
insert into public.value_cards (kicker, title, body, detail, sort_order) values
('01', 'Marketing Analytics', 'Turning customer, campaign and operational signals into clearer decisions.', 'A business-oriented lens for customer insight, campaign learning and more useful marketing actions.', 1),
('02', 'Commercial Analytics', 'Connecting data to conversion, revenue, profitability and customer journeys.', 'Commercial performance becomes easier to prioritise when operational data and customer touchpoints are connected.', 2),
('03', 'Business Intelligence', 'Structured reporting, KPI analysis, dashboards and decision support.', 'Clear, dependable reporting for teams that need to understand performance gaps and act on them.', 3),
('04', 'Automation', 'Reliable workflows that reduce manual work and improve traceability.', 'Business rules, structured outputs and repeatable controls designed for operational reliability.', 4);

delete from public.projects;
insert into public.projects (slug, title, industry, challenge, impact, contributions, business_value, workflow, tools, cover, confidentiality, before_after, sort_order) values
(
'rpa-invoice-control-booking-reconciliation',
'RPA for Invoice Control & Booking Reconciliation',
'Tourism Operations',
'Invoice control and reconciliation required repeated manual checks across invoices, vouchers, reservations, stay dates, board types, discounts, supplements and commercial conditions.',
'Designed repeatable controls to reduce manual verification and improve reliability, traceability and audit readiness.',
'["Designed and expanded a UiPath-based workflow for invoice validation and reconciliation.", "Connected invoice data with booking, voucher and stay-related information.", "Automated business rules covering room rates, board types, discounts, supplements and special offers.", "Generated structured JSON outputs and HTML reports to support review, audit and operational follow-up.", "Adapted the workflow to multiple agency processes and hotel configurations."]'::jsonb,
'["Reduced reliance on manual verification.", "Improved data reliability.", "Improved auditability and traceability.", "Created more repeatable operational controls.", "Adaptable to multiple agency processes and hotel configurations."]'::jsonb,
'["Invoice Data", "Booking & Voucher Matching", "Business Rules Validation", "Rates, Discounts & Supplements", "Structured JSON Output", "HTML Report for Audit and Review"]'::jsonb,
'["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb,
'automation',
'The case study intentionally excludes real client data, invoice amounts, internal commercial rules, customer information and booking records.',
null, 1
),
(
'data-driven-digital-transformation-barbershop',
'Data-Driven Digital Transformation for a Men’s Barbershop',
'Local Services / Digital Marketing',
'A men’s barbershop in France needed stronger online visibility, a smoother booking journey and more structured digital customer communication.',
'Created a more connected local discovery, booking and customer-communication journey.',
'["Built and managed a tailored website with an online booking system.", "Implemented an administrative dashboard for booking and activity monitoring.", "Improved local visibility through local SEO and a stronger digital presence.", "Developed Instagram and TikTok content initiatives to improve engagement and brand visibility.", "Supported email marketing, paid social activity, online reviews and digital customer communication.", "Facilitated a partnership with Planity to streamline booking operations and improve the customer journey."]'::jsonb,
'["Website and online booking.", "Improved local visibility.", "Stronger social presence.", "More structured customer touchpoints.", "Easier activity monitoring."]'::jsonb,
'["Discovery", "Local SEO / Social Media", "Website", "Online Booking", "Customer Communication", "Reviews / Repeat Visits"]'::jsonb,
'["Website & Booking Systems", "Local SEO", "Instagram", "TikTok", "Email Marketing", "Paid Social", "Planity"]'::jsonb,
'journey', null,
'{"before": ["Limited digital visibility.", "Less structured booking experience.", "Fragmented online communication."], "after": ["Website and online booking.", "Improved local visibility.", "Stronger social presence.", "More structured customer touchpoints.", "Easier activity monitoring."]}'::jsonb, 2
),
(
'ai-ready-e-learning-platform',
'AI-Ready E-Learning Platform',
'Enterprise Software / Learning',
'Employees needed a secure and scalable learning platform that could support multilingual training, knowledge access, real-time interaction and internal productivity.',
'Contributed to a secure, scalable learning environment with RAG-enabled knowledge access and operational productivity features.',
'["Developed key learning-platform features including course enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented security measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management.", "Added productivity features including notes, task management and a collaborative whiteboard."]'::jsonb,
'["Secure and scalable learning workflows.", "Multilingual training support.", "Knowledge retrieval for internal users.", "Real-time interaction and productivity features.", "Security-focused AI integration."]'::jsonb,
'["Users", "Angular Interface", "Spring Cloud Microservices", "Keycloak / Kafka / Data Services", "Ollama + LLaMA 3.2 + RAG Knowledge Retrieval", "Monitoring, Security and Deployment Tooling"]'::jsonb,
'["Angular", "Angular Material", "Spring Boot", "Spring Cloud", "Keycloak", "Kafka", "Docker", "Jenkins", "SonarQube", "Prometheus", "Grafana", "Zipkin", "OWASP ZAP", "Ollama", "RAG"]'::jsonb,
'architecture', null, null, 3
);

delete from public.experiences;
insert into public.experiences (organisation, role, date_label, location, summary, responsibilities, tools, sort_order) values
('Sunshine Vacances France', 'Head of IT Services | Process Automation & Business Systems', 'July 2025 - Present', 'Sousse, Tunisia', 'Leading IT and business-process improvement initiatives for tourism operations, with a focus on automation, data reliability and auditability.', '["Designed and expanded an RPA workflow for invoice validation and reconciliation across invoices, vouchers, reservations and stay-related data.", "Automated commercial rules, including room rates, board types, discounts, supplements and special offers.", "Structured automated controls to improve traceability, reduce manual verification and support more reliable financial operations.", "Generated structured JSON outputs and HTML reports to support audit, review and operational follow-up.", "Adapted the workflow to multiple agency processes and hotel configurations."]'::jsonb, '["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb, 1),
('Maison Salina', 'Commercial & Digital Marketing Manager', 'April 2025 - September 2025', 'Sousse, Tunisia', 'Led commercial and digital initiatives for a long-established home-furnishing business, supporting visibility, customer engagement and growth.', '["Developed and implemented digital marketing initiatives aligned with commercial objectives and brand positioning.", "Contributed to the structuring of the company’s digital presence and commercial communication.", "Identified and supported strategic collaborations to expand reach and create business opportunities.", "Helped strengthen brand awareness through more consistent online positioning and customer-facing content.", "Contributed to the monitoring of commercial priorities and digital actions to support business development."]'::jsonb, '[]'::jsonb, 2),
('Confidential Client - Men’s Barbershop, France', 'Digital Marketing & Automation Consultant', 'February 2025 - July 2025', 'Noisy-le-Grand, Île-de-France, France', 'Led a digital transformation project focused on online visibility, booking experience and digital customer communication.', '["Built and managed a tailored website with online booking and activity monitoring.", "Supported local visibility, customer communication, social content and booking-process improvements.", "Facilitated a partnership with Planity to streamline booking operations and improve the customer journey."]'::jsonb, '[]'::jsonb, 3),
('VERMEG for Banking & Insurance Software', 'AI & Full-Stack Development Intern', 'February 2025 - May 2025', 'Tunis, Tunisia', 'Contributed to the design and development of a secure, scalable and multilingual e-learning platform for employee training and internal knowledge management.', '["Developed key learning-platform features including enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management."]'::jsonb, '[]'::jsonb, 4),
('El Mouradi Hotels - El Mouradi Kantaoui Club', 'Management Controller', 'July 2024 - September 2024', 'Sousse, Tunisia', 'Supported hotel performance analysis, budgeting and management reporting.', '["Analysed occupancy, operational costs and revenue-related KPIs.", "Contributed to annual budget preparation, variance analysis and financial reporting for management.", "Supported the identification of cost-control opportunities in procurement, inventory and operations."]'::jsonb, '[]'::jsonb, 5),
('Arabsoft', 'Full-Stack Development Intern', 'June 2024 - August 2024', 'Tunis, Tunisia', 'Built a web application for managing books, users and borrowing operations.', '["Designed a responsive Angular user interface.", "Built a Spring Boot backend and REST APIs with relational data management.", "Implemented creation, update, deletion, search and real-time borrowing tracking."]'::jsonb, '[]'::jsonb, 6),
('El Mouradi Hotels - El Mouradi Palace', 'Management Control Intern', 'June 2023 - September 2023', 'Sousse, Tunisia', 'Contributed to monitoring hotel performance, expenses and budget variances.', '["Analysed expenses, operational indicators and budget variances to identify performance gaps.", "Contributed to financial reports and supported cost-control initiatives.", "Participated in the monitoring of hotel KPIs and corrective actions."]'::jsonb, '[]'::jsonb, 7);

delete from public.skill_clusters;
insert into public.skill_clusters (title, items, sort_order) values
('Data & Business Intelligence', '["Data Analysis", "Marketing Analytics", "Commercial Analytics", "Business Intelligence", "KPI Analysis", "Data Visualization", "Financial Reporting", "Excel"]'::jsonb, 1),
('Digital Marketing & Customer Growth', '["Digital Marketing", "Customer Insights", "Customer Journey", "Local SEO", "Email Marketing", "Paid Social", "Social Media Strategy", "E-Commerce"]'::jsonb, 2),
('Automation & Technology', '["UiPath", "Process Automation", "Business Rules Automation", "JSON", "HTML Reporting", "Angular", "Spring Boot", "REST APIs", "RAG"]'::jsonb, 3),
('Professional Strengths', '["Commercial Thinking", "Problem Solving", "Cross-Functional Collaboration", "Process Improvement", "Structured Communication"]'::jsonb, 4);

delete from public.education;
insert into public.education (title, organisation, date_label, detail, sort_order) values
('Master’s Degree - Big Data Analytics & E-Commerce', 'IHEC Carthage', 'October 2025 - June 2027', 'Expected graduation: June 2027', 1),
('Bachelor’s Degree - Business Intelligence', 'IHEC Carthage', 'January 2021 - June 2025', '', 2);

delete from public.certifications;
insert into public.certifications (title, issuer, detail, sort_order) values
('Fundamentals of Digital Marketing', 'Google', '', 1);

delete from public.resumes;
insert into public.resumes (title, language, intended_use, description, pdf_url, docx_url, pdf_size, docx_size, sort_order) values
('English Professional CV', 'English', 'Europe-focused applications', 'A concise professional CV for Marketing Analytics, Commercial Analytics, Business Intelligence, Digital Growth, Automation and Revenue Operations roles.', '/cv/Ahmed_Aziz_Mhiri_CV_English.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_English.docx', '53 KB', '39 KB', 1),
('CV Professionnel Français', 'Français', 'Candidatures francophones', 'Une version rédigée pour des recruteurs francophones, orientée analytique marketing, analyse commerciale, business intelligence et transformation digitale.', '/cv/Ahmed_Aziz_Mhiri_CV_Français.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_Français.docx', '55 KB', '40 KB', 2),
('ATS CV', 'English', 'Online application systems', 'A strict one-column, machine-readable version with standard headings and role-relevant keywords for applicant tracking systems.', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.docx', '49 KB', '39 KB', 3),
('Canadian Market CV', 'English', 'Canada-focused applications', 'A Canadian-market version that prioritises transferable skills, projects, business value and relocation availability without claiming work authorisation.', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.docx', '52 KB', '39 KB', 4);
