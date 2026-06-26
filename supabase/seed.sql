-- Run this AFTER schema.sql. It inserts the initial portfolio content.

insert into public.site_profile (id, name, location, email, linkedin_url, headline, homepage_title, tagline, availability, summary, about_heading, about_body, long_term_objective, target_countries, portrait_url)
values (
  1,
  'Ahmed Aziz Mhiri',
  'Sousse, Tunisia',
  'mhiriaziz13@gmail.com',
  'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  'Marketing Analytics | Commercial Analytics | Business Intelligence | Automation',
  'Data-driven marketing, commercial analytics and business intelligence',
  'Turning operational and customer data into clearer business decisions',
  'Available for Europe-based opportunities from Summer 2027.',
  'Master''s student in Big Data Analytics and E-Commerce at IHEC Carthage, with a Business Intelligence background. Ahmed works across data, digital marketing and commercial operations, helping translate customer, campaign and process signals into clearer decisions and more reliable workflows.',
  'I work where data, marketing activity and operations meet commercial decisions.',
  'Ahmed is interested in practical analytics work: understanding how customers move through a journey, how operations create friction, how marketing actions perform, and how automation can make business processes easier to trust and repeat.',
  'His goal is to help teams use data not only to describe performance, but to improve acquisition, conversion, customer experience, reporting quality and operational reliability.',
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
('01', 'Marketing Analytics', 'Reading customer, campaign and journey signals so marketing decisions become easier to prioritise.', 'Ahmed connects campaign activity, audience behaviour and customer touchpoints to practical questions: what is working, where friction appears, and which next action is worth testing.', 1),
('02', 'Commercial Analytics', 'Linking operational and customer data to conversion, revenue logic and business priorities.', 'Commercial analysis becomes more useful when teams can see how activity, offers, customer needs and operational constraints affect the next decision.', 2),
('03', 'Business Intelligence', 'Structuring KPIs, reporting flows and dashboards so teams can read performance with confidence.', 'Clear reporting helps teams understand performance gaps, compare priorities and act with a shared view of the facts.', 3),
('04', 'Automation', 'Designing repeatable workflows that reduce manual checks and improve traceability.', 'Automation work is strongest when business rules are clear, outputs are reviewable, and teams can trust the process behind the result.', 4);

delete from public.projects;
insert into public.projects (slug, title, industry, challenge, impact, contributions, business_value, workflow, tools, cover, confidentiality, before_after, sort_order) values
(
'rpa-invoice-control-booking-reconciliation',
'RPA for Invoice Control and Booking Reconciliation',
'Tourism Operations',
'Invoice control and booking reconciliation required repeated manual checks across invoices, vouchers, reservations, stay dates, board types, discounts, supplements and commercial conditions.',
'Designed a repeatable validation workflow to make financial checks easier to review, trace and adapt across hotel and agency configurations.',
'["Designed and expanded a UiPath workflow for invoice validation and booking reconciliation.", "Connected invoice data with booking, voucher and stay-related information.", "Automated business-rule checks covering room rates, board types, discounts, supplements and special offers.", "Generated structured JSON outputs and HTML review reports for audit and operational follow-up.", "Adapted the workflow to multiple agency processes and hotel configurations."]'::jsonb,
'["Reduced dependence on repeated manual checking.", "Improved the consistency of validation steps.", "Made exceptions easier to trace and review.", "Created repeatable controls for finance and operations teams.", "Kept sensitive invoice, booking and commercial-rule data out of the public case study."]'::jsonb,
'["Invoice Data", "Booking and Voucher Matching", "Business Rule Validation", "Rates, Discounts and Supplements", "Structured JSON Output", "HTML Review Report"]'::jsonb,
'["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb,
'automation',
'This case study excludes real client data, invoice amounts, internal commercial rules, customer information and booking records.',
null, 1
),
(
'data-driven-digital-transformation-barbershop',
'Data-Driven Digital Transformation for a Men''s Barbershop',
'Local Services / Digital Marketing',
'A men''s barbershop in France needed stronger local visibility, a smoother booking journey and more structured digital customer communication.',
'Helped connect local discovery, online booking and customer communication into a clearer digital journey.',
'["Built and managed a tailored website with an online booking system.", "Created an activity-monitoring interface for booking and customer interaction follow-up.", "Supported local visibility through local SEO and a stronger digital presence.", "Developed Instagram and TikTok content initiatives to improve engagement and brand visibility.", "Supported email marketing, paid social activity, online reviews and customer communication.", "Facilitated a partnership with Planity to streamline booking operations and improve the customer journey."]'::jsonb,
'["Clearer online presence for local discovery.", "More structured booking experience.", "Better-organised customer communication touchpoints.", "Improved visibility of activity and booking signals.", "A more connected path from discovery to repeat visits."]'::jsonb,
'["Discovery", "Local SEO and Social Media", "Website", "Online Booking", "Customer Communication", "Reviews and Repeat Visits"]'::jsonb,
'["Website and Booking Systems", "Local SEO", "Instagram", "TikTok", "Email Marketing", "Paid Social", "Planity"]'::jsonb,
'journey', null,
'{"before": ["Limited digital visibility.", "Less structured booking experience.", "Fragmented online communication."], "after": ["Website and online booking.", "Improved local visibility.", "Stronger social presence.", "More structured customer touchpoints.", "Easier activity monitoring."]}'::jsonb, 2
),
(
'ai-ready-e-learning-platform',
'AI-Supported E-Learning Platform',
'Enterprise Software / Learning',
'Employees needed a secure and scalable learning platform that could support multilingual training, knowledge access, real-time interaction and internal productivity.',
'Contributed to a secure learning environment with structured training workflows, productivity features and RAG-enabled knowledge access.',
'["Developed learning-platform features including course enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management.", "Added productivity features including notes, task management and a collaborative whiteboard."]'::jsonb,
'["More structured learning workflows for internal users.", "Multilingual training support.", "Knowledge retrieval from controlled internal resources.", "Real-time interaction and productivity features.", "Security-conscious AI integration."]'::jsonb,
'["Users", "Angular Interface", "Spring Cloud Microservices", "Keycloak / Kafka / Data Services", "Ollama + LLaMA 3.2 + RAG Knowledge Retrieval", "Monitoring, Security and Deployment Tooling"]'::jsonb,
'["Angular", "Angular Material", "Spring Boot", "Spring Cloud", "Keycloak", "Kafka", "Docker", "Jenkins", "SonarQube", "Prometheus", "Grafana", "Zipkin", "OWASP ZAP", "Ollama", "RAG"]'::jsonb,
'architecture', null, null, 3
);

delete from public.experiences;
insert into public.experiences (organisation, role, date_label, location, summary, responsibilities, tools, sort_order) values
('Sunshine Vacances France', 'Head of IT Services | Process Automation and Business Systems', 'July 2025 - Present', 'Sousse, Tunisia', 'Working on IT, automation and business-process improvements for tourism operations, with a focus on data reliability, traceability and reviewable controls.', '["Designed and expanded an RPA workflow for invoice validation and reconciliation across invoices, vouchers, reservations and stay-related data.", "Automated checks for commercial rules including room rates, board types, discounts, supplements and special offers.", "Structured controls to improve traceability, reduce repeated manual checks and support financial review.", "Generated structured JSON outputs and HTML reports for audit, review and operational follow-up.", "Adapted workflow logic to multiple agency processes and hotel configurations."]'::jsonb, '["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb, 1),
('Maison Salina', 'Commercial and Digital Marketing Manager', 'April 2025 - September 2025', 'Sousse, Tunisia', 'Supported commercial and digital initiatives for a long-established home-furnishing business, with attention to visibility, customer engagement and growth priorities.', '["Developed digital marketing initiatives aligned with commercial objectives and brand positioning.", "Contributed to a more structured digital presence and clearer commercial communication.", "Identified and supported strategic collaborations to expand reach and create business opportunities.", "Helped strengthen brand awareness through consistent online positioning and customer-facing content.", "Supported the monitoring of commercial priorities and digital actions for business development."]'::jsonb, '[]'::jsonb, 2),
('Confidential Client - Men''s Barbershop, France', 'Digital Marketing and Automation Consultant', 'February 2025 - July 2025', 'Noisy-le-Grand, Ile-de-France, France', 'Worked on a digital transformation project focused on local visibility, booking experience and customer communication for a service business.', '["Built and managed a tailored website with online booking and activity monitoring.", "Supported local visibility, customer communication, social content and booking-process improvements.", "Facilitated a Planity partnership to streamline booking operations and improve the customer journey."]'::jsonb, '[]'::jsonb, 3),
('VERMEG for Banking and Insurance Software', 'AI and Full-Stack Development Intern', 'February 2025 - May 2025', 'Tunis, Tunisia', 'Contributed to a secure, scalable and multilingual e-learning platform for employee training and internal knowledge management.', '["Developed learning-platform features including enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management."]'::jsonb, '[]'::jsonb, 4),
('El Mouradi Hotels - El Mouradi Kantaoui Club', 'Management Controller', 'July 2024 - September 2024', 'Sousse, Tunisia', 'Supported hotel performance analysis, budgeting and management reporting.', '["Analysed occupancy, operational costs and revenue-related KPIs.", "Contributed to annual budget preparation, variance analysis and financial reporting for management.", "Supported the identification of cost-control opportunities in procurement, inventory and operations."]'::jsonb, '[]'::jsonb, 5),
('Arabsoft', 'Full-Stack Development Intern', 'June 2024 - August 2024', 'Tunis, Tunisia', 'Built a web application for managing books, users and borrowing operations.', '["Designed a responsive Angular user interface.", "Built a Spring Boot backend and REST APIs with relational data management.", "Implemented creation, update, deletion, search and real-time borrowing tracking."]'::jsonb, '[]'::jsonb, 6),
('El Mouradi Hotels - El Mouradi Palace', 'Management Control Intern', 'June 2023 - September 2023', 'Sousse, Tunisia', 'Contributed to monitoring hotel performance, expenses and budget variances.', '["Analysed expenses, operational indicators and budget variances to identify performance gaps.", "Contributed to financial reports and supported cost-control initiatives.", "Participated in the monitoring of hotel KPIs and corrective actions."]'::jsonb, '[]'::jsonb, 7);

delete from public.skill_clusters;
insert into public.skill_clusters (title, items, sort_order) values
('Data and Business Intelligence', '["Data Analysis", "Marketing Analytics", "Commercial Analytics", "Business Intelligence", "KPI Analysis", "Data Visualization", "Financial Reporting", "Excel"]'::jsonb, 1),
('Digital Marketing and Customer Growth', '["Digital Marketing", "Customer Insights", "Customer Journey", "Local SEO", "Email Marketing", "Paid Social", "Social Media Strategy", "E-Commerce"]'::jsonb, 2),
('Automation and Technology', '["UiPath", "Process Automation", "Business Rules Automation", "JSON", "HTML Reporting", "Angular", "Spring Boot", "REST APIs", "RAG"]'::jsonb, 3),
('Professional Strengths', '["Commercial Thinking", "Problem Solving", "Cross-Functional Collaboration", "Process Improvement", "Structured Communication"]'::jsonb, 4);

delete from public.education;
insert into public.education (title, organisation, date_label, detail, sort_order) values
('Master''s Degree - Big Data Analytics and E-Commerce', 'IHEC Carthage', 'October 2025 - June 2027', 'Expected graduation: June 2027', 1),
('Bachelor''s Degree - Business Intelligence', 'IHEC Carthage', 'January 2021 - June 2025', '', 2);

delete from public.certifications;
insert into public.certifications (title, issuer, detail, sort_order) values
('Fundamentals of Digital Marketing', 'Google', '', 1);

delete from public.resumes;
insert into public.resumes (title, language, intended_use, description, pdf_url, docx_url, pdf_size, docx_size, sort_order) values
('English Professional CV', 'English', 'European analytics roles', 'Best starting point for recruiters reviewing roles in Marketing Analytics, Commercial Analytics, Business Intelligence, Digital Growth, Automation or Revenue Operations.', '/cv/Ahmed_Aziz_Mhiri_CV_English.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_English.docx', '53 KB', '39 KB', 1),
('French Professional CV', 'French', 'French-language applications', 'French-language version for recruiters and organisations that prefer applications in French.', '/cv/Ahmed_Aziz_Mhiri_CV_French.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_French.docx', '55 KB', '40 KB', 2),
('ATS CV', 'English', 'Online application systems', 'A one-column, machine-readable version with standard headings and role-relevant keywords for applicant tracking systems.', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.docx', '49 KB', '39 KB', 3),
('Canadian Market CV', 'English', 'Canada-focused applications', 'A Canada-focused version that highlights transferable skills, projects, business value and relocation availability without claiming work authorisation.', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.docx', '52 KB', '39 KB', 4);