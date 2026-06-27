-- Run this AFTER schema.sql. It inserts the initial portfolio content.

insert into public.site_profile (id, name, location, email, linkedin_url, headline, homepage_title, tagline, availability, summary, about_heading, about_body, long_term_objective, target_countries, portrait_url)
values (
  1,
  'Ahmed Aziz Mhiri',
  'Sousse, Tunisia',
  'mhiriaziz13@gmail.com',
  'https://www.linkedin.com/in/ahmed-aziz-mhiri/',
  'Marketing Data Analysis | Business Intelligence | Automation | Digital Marketing',
  'Marketing analytics, business intelligence and automation for clearer operations',
  'Helping teams understand customers, processes and commercial performance',
  'Available for Europe-based opportunities from Summer 2027.',
  'Ahmed Aziz Mhiri is a Business Intelligence graduate and Big Data Analytics and E-Commerce master''s student. He works across data, automation, marketing and business operations, with a focus on clearer processes, smoother customer journeys and better-informed commercial decisions.',
  'I am building my career around data, marketing, operations and automation.',
  'My background is in Business Intelligence, and I am completing a master''s degree in Big Data Analytics and E-Commerce at IHEC Carthage. I enjoy work that turns operational detail into useful reporting, connects marketing activity with customer behaviour, and makes business processes easier to follow.',
  'I am interested in roles where analysis, automation and commercial context meet: marketing data analysis, business intelligence, revenue operations, CRM or process automation. From Summer 2027, I am available for Europe-based opportunities.',
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
('01', 'Marketing Analytics', 'Reading campaign, customer and journey signals so marketing choices are easier to prioritise.', 'Ahmed looks at how people discover, compare, book, buy or return, then connects those signals to practical questions about visibility, friction and follow-up.', 1),
('02', 'Commercial Analytics', 'Connecting operational data with revenue logic, offers and customer behaviour.', 'Commercial analysis is useful when teams can see how activity, pricing conditions, customer needs and operational constraints affect the next decision.', 2),
('03', 'Business Intelligence', 'Structuring KPIs, reporting flows and dashboards around decisions teams actually make.', 'Clear reporting helps teams compare performance, spot gaps and work from a shared view of the facts instead of scattered files or disconnected updates.', 3),
('04', 'Automation', 'Building repeatable workflows that reduce manual checks and leave a clearer review trail.', 'Automation is strongest when business rules are understandable, outputs can be reviewed, and people can trace how a result was produced.', 4);

delete from public.projects;
insert into public.projects (slug, title, industry, challenge, impact, contributions, business_value, workflow, tools, cover, confidentiality, before_after, sort_order) values
(
'rpa-invoice-control-booking-reconciliation',
'RPA for Invoice Control & Booking Reconciliation',
'Tourism Operations',
'This project focused on an RPA workflow for tourism invoice control. The workflow brings together invoice, booking, voucher and stay-related information, then checks it against room rates, board types, discounts, supplements and special offers before producing reviewable outputs.',
'The workflow reduces repetitive checking and gives finance and operations teams structured JSON outputs and HTML reports for review, audit and operational follow-up.',
'["Worked on a UiPath workflow for invoice validation and booking reconciliation.", "Matched invoice lines with booking, voucher and stay-related information.", "Converted commercial validation rules into reviewable checks for room rates, board types, discounts, supplements and special offers.", "Produced structured JSON outputs and HTML reports to support review, audit and operational follow-up.", "Helped adapt the workflow to different agency processes and hotel configurations."]'::jsonb,
'["Less time spent on repeated manual comparisons.", "More consistent validation steps before human review.", "Easier tracing of exceptions and mismatches.", "Structured outputs that support audit and follow-up.", "Sensitive invoices, rates, booking details, customer data and internal rules remain private."]'::jsonb,
'["Invoice and booking inputs", "Voucher and stay matching", "Commercial validation checks", "Rate, board, discount and supplement review", "Structured JSON output", "HTML report for review"]'::jsonb,
'["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb,
'automation',
'This public summary excludes real invoices, customer data, hotel rates, booking details, invoice amounts and internal commercial rules.',
null, 1
),
(
'data-driven-digital-transformation-barbershop',
'Digital Journey & Booking Improvements for a Men''s Barbershop',
'Local Services / Digital Marketing',
'A men''s barbershop in France needed easier local discovery, a smoother booking journey and more consistent customer communication across web, social and booking channels.',
'The work gave the business a clearer path from local search and social discovery to booking, reviews and repeat contact.',
'["Built and managed a website connected to online booking.", "Created an activity-monitoring interface for booking and customer interaction follow-up.", "Worked on local SEO, social content and a more consistent digital presence.", "Supported email marketing, paid social activity, online reviews and customer communication.", "Facilitated a Planity partnership to make booking easier for the business and its customers."]'::jsonb,
'["Clearer online presence for local discovery.", "More structured booking experience for customers.", "Better-organised communication before and after appointments.", "More visibility into booking and customer activity.", "A more connected path from discovery to repeat visits."]'::jsonb,
'["Discovery", "Local SEO and Social Media", "Website", "Online Booking", "Customer Communication", "Reviews and Repeat Visits"]'::jsonb,
'["Website and Booking Systems", "Local SEO", "Instagram", "TikTok", "Email Marketing", "Paid Social", "Planity"]'::jsonb,
'journey', null,
'{"before": ["Limited digital visibility.", "Less structured booking experience.", "Fragmented online communication."], "after": ["Website and online booking.", "Improved local visibility.", "Stronger social presence.", "More structured customer touchpoints.", "Easier activity monitoring."]}'::jsonb, 2
),
(
'ai-ready-e-learning-platform',
'AI-Supported E-Learning Platform',
'Enterprise Software / Learning',
'This internal learning platform project needed to support training workflows, multilingual access, controlled knowledge retrieval, real-time interaction and productivity features.',
'The project contributed to a structured learning environment with course management, dashboards, notifications and RAG-enabled access to approved knowledge sources.',
'["Developed learning-platform features including course enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture designed for scalability, monitoring and secure user management.", "Added productivity features including notes, task management and a collaborative whiteboard."]'::jsonb,
'["More structured learning workflows for internal users.", "Multilingual training support.", "Knowledge retrieval from controlled resources.", "Real-time interaction and productivity features.", "Security-conscious AI integration."]'::jsonb,
'["Users", "Angular Interface", "Spring Cloud Microservices", "Keycloak / Kafka / Data Services", "Ollama + LLaMA 3.2 + RAG Knowledge Retrieval", "Monitoring, Security and Deployment Tooling"]'::jsonb,
'["Angular", "Angular Material", "Spring Boot", "Spring Cloud", "Keycloak", "Kafka", "Docker", "Jenkins", "SonarQube", "Prometheus", "Grafana", "Zipkin", "OWASP ZAP", "Ollama", "RAG"]'::jsonb,
'architecture', null, null, 3
);

delete from public.experiences;
insert into public.experiences (organisation, role, date_label, location, summary, responsibilities, tools, sort_order) values
('Sunshine Vacances France', 'Head of IT Services | Process Automation and Business Systems', 'July 2025 - Present', 'Sousse, Tunisia', 'Working on IT services and process automation for tourism operations, especially invoice validation, booking reconciliation and reviewable reporting.', '["Worked on an RPA workflow for invoice validation and reconciliation across invoices, vouchers, reservations and stay-related data.", "Built checks for commercial rules covering room rates, board types, discounts, supplements and special offers.", "Structured outputs to make exceptions easier to review, trace and follow up.", "Generated JSON outputs and HTML reports for audit, review and operational follow-up.", "Helped adapt workflow logic to different agency processes and hotel configurations."]'::jsonb, '["UiPath", "Business Rules Automation", "JSON", "HTML Reporting", "Process Analysis"]'::jsonb, 1),
('Maison Salina', 'Commercial and Digital Marketing Manager', 'April 2025 - September 2025', 'Sousse, Tunisia', 'Worked on commercial and digital marketing actions for a long-established home-furnishing business, with attention to visibility, customer engagement and growth priorities.', '["Developed digital marketing actions aligned with commercial objectives and brand positioning.", "Contributed to a clearer digital presence and more consistent customer-facing communication.", "Identified and supported collaborations that could expand reach and create business opportunities.", "Helped strengthen brand awareness through online positioning and content.", "Supported follow-up on commercial priorities and digital actions for business development."]'::jsonb, '[]'::jsonb, 2),
('Confidential Client - Men''s Barbershop, France', 'Digital Marketing and Automation Consultant', 'February 2025 - July 2025', 'Noisy-le-Grand, Ile-de-France, France', 'Supported a local-service digital project focused on discovery, booking and customer communication.', '["Built and managed a website with online booking and activity monitoring.", "Worked on local visibility, customer communication, social content and booking-process improvements.", "Facilitated a Planity partnership to make appointment booking easier for the business and its customers."]'::jsonb, '[]'::jsonb, 3),
('VERMEG for Banking and Insurance Software', 'AI and Full-Stack Development Intern', 'February 2025 - May 2025', 'Tunis, Tunisia', 'Contributed to an internal e-learning platform for employee training, knowledge access and productivity.', '["Developed features for enrolment, progress tracking, dashboards, internal event booking and real-time notifications.", "Integrated a locally deployed LLaMA 3.2-based assistant through Ollama, enhanced with RAG capabilities for PDF and CSV knowledge retrieval.", "Implemented measures to reduce risks related to prompt injection, malicious files and unsafe links.", "Contributed to a microservices-based architecture with secure user management, monitoring and deployment tooling."]'::jsonb, '[]'::jsonb, 4),
('El Mouradi Hotels - El Mouradi Kantaoui Club', 'Management Controller', 'July 2024 - September 2024', 'Sousse, Tunisia', 'Supported hotel performance analysis, budgeting and management reporting.', '["Analysed occupancy, operational costs and revenue-related KPIs.", "Contributed to annual budget preparation, variance analysis and management reporting.", "Supported cost-control follow-up across procurement, inventory and operations."]'::jsonb, '[]'::jsonb, 5),
('Arabsoft', 'Full-Stack Development Intern', 'June 2024 - August 2024', 'Tunis, Tunisia', 'Built a web application for managing books, users and borrowing operations.', '["Designed a responsive Angular interface.", "Built a Spring Boot backend with REST APIs and relational data management.", "Implemented create, update, delete, search and borrowing-tracking features."]'::jsonb, '[]'::jsonb, 6),
('El Mouradi Hotels - El Mouradi Palace', 'Management Control Intern', 'June 2023 - September 2023', 'Sousse, Tunisia', 'Contributed to monitoring hotel performance, expenses and budget variances.', '["Analysed expenses, operational indicators and budget variances.", "Contributed to financial reports and cost-control follow-up.", "Participated in hotel KPI monitoring and corrective-action review."]'::jsonb, '[]'::jsonb, 7);

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
('English Professional CV', 'English', 'European analytics roles', 'Concise English CV for analytics, business intelligence, automation and digital marketing roles.', '/cv/Ahmed_Aziz_Mhiri_CV_English.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_English.docx', '56 KB', '40 KB', 1),
('CV Professionnel Français', 'French', 'French-language applications', 'French CV for French-language applications and recruiters.', '/cv/Ahmed_Aziz_Mhiri_CV_Francais.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_Francais.docx', '56 KB', '40 KB', 2),
('ATS CV', 'English', 'Online application systems', 'Simple one-column version for online screening systems.', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_ATS.docx', '72 KB', '39 KB', 3),
('Canadian Market CV', 'English', 'Canada-focused applications', 'Version adapted for Canada-focused applications.', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.pdf', '/cv/Ahmed_Aziz_Mhiri_CV_Canada.docx', '57 KB', '40 KB', 4);
