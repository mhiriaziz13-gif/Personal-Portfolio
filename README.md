# \# Ahmed Aziz Mhiri — Portfolio CMS

# 

# A professional portfolio platform designed to present projects, experience, skills, CVs, and professional positioning in \*\*Data-Driven Marketing, Commercial Analytics, Business Intelligence, Automation, and Digital Growth\*\*.

# 

# The platform combines a public-facing portfolio with a secure content management area, allowing content to be updated without modifying the source code.

# 

# \## Profile

# 

# \*\*Ahmed Aziz Mhiri\*\*

# Sousse, Tunisia

# Available for Europe-based opportunities from Summer 2027.

# 

# \* LinkedIn: \[ahmed-aziz-mhiri](https://www.linkedin.com/in/ahmed-aziz-mhiri/)

# \* Email: \[mhiriaziz13@gmail.com](mailto:mhiriaziz13@gmail.com)

# 

# \## Screenshots

# 

# \### Homepage

# 

# !\[Homepage of Ahmed Aziz Mhiri portfolio](./screenshots/home.png)

# 

# \### Projects

# 

# !\[Projects page](./screenshots/projects.png)

# 

# \### Administration Login

# 

# !\[Administration login page](./screenshots/admin-login.png)

# 

# \### Resume and CV Download Centre

# 

# !\[Resume and CV download centre](./screenshots/cv-centre.png)

# 

# \## Main Features

# 

# \* Responsive professional portfolio for desktop, tablet, and mobile.

# \* Public pages for profile, projects, experience, skills, education, CVs, and contact.

# \* Individual project case studies with business context, contributions, tools, and outcomes.

# \* Secure administration area for managing portfolio content.

# \* Create, edit, publish, unpublish, and delete projects.

# \* Manage professional experience, skills, education, certifications, and profile information.

# \* Upload and replace portrait images, project covers, CV files, and documents.

# \* Download centre for English, French, ATS, and Canadian CV versions.

# \* Contact form connected to an administrative inbox.

# \* SEO-ready structure with metadata, sitemap, robots file, Open Graph data, and JSON-LD.

# \* Accessible interface designed with keyboard navigation, visible focus states, contrast, and reduced-motion support.

# 

# \## Technology Stack

# 

# \* Next.js

# \* TypeScript

# \* Supabase

# 

# &#x20; \* PostgreSQL database

# &#x20; \* Authentication

# &#x20; \* Row Level Security

# &#x20; \* File storage

# \* Vercel or Netlify deployment

# \* GitHub for source control and deployment workflow

# 

# \## Local Installation

# 

# \### Prerequisites

# 

# \* Node.js 20.9 or newer

# \* npm

# \* Supabase project

# 

# \### Install the project

# 

# ```bash

# git clone https://github.com/YOUR-GITHUB-USERNAME/ahmed-aziz-mhiri-portfolio.git

# cd ahmed-aziz-mhiri-portfolio

# npm install

# ```

# 

# \### Configure environment variables

# 

# Create a `.env.local` file at the root of the project.

# 

# ```env

# NEXT\_PUBLIC\_SUPABASE\_URL=

# NEXT\_PUBLIC\_SUPABASE\_PUBLISHABLE\_KEY=

# SUPABASE\_SERVICE\_ROLE\_KEY=

# ```

# 

# Never publish `.env.local` or any Supabase secret key on GitHub.

# 

# \### Start locally

# 

# ```bash

# npm run dev

# ```

# 

# Open:

# 

# ```text

# http://localhost:3000

# ```

# 

# The administration area is available at:

# 

# ```text

# http://localhost:3000/admin/login

# ```

# 

# \## Supabase Setup

# 

# Before using the administration area:

# 

# 1\. Create a Supabase project.

# 2\. Run `supabase/schema.sql` in the Supabase SQL Editor.

# 3\. Run `supabase/seed.sql` if initial content is needed.

# 4\. Create the administrator account.

# 5\. Run `supabase/create-admin.sql` to authorise the account.

# 6\. Add the Supabase environment variables to `.env.local`.

# 

# Only accounts registered in the `admins` table can edit portfolio content.

# 

# \## Content Management

# 

# The administration area allows the owner to manage:

# 

# \* Profile information

# \* Portrait image

# \* Projects and case studies

# \* Work experience

# \* Skills

# \* Education

# \* Certifications

# \* CV files

# \* Contact messages

# \* Media files

# 

# Portfolio visitors only see published content.

# 

# \## Deployment

# 

# \### Vercel

# 

# 1\. Push the repository to GitHub.

# 2\. Import the repository in Vercel.

# 3\. Add the Supabase environment variables in Vercel Project Settings.

# 4\. Deploy.

# 

# \### Netlify

# 

# 1\. Push the repository to GitHub.

# 2\. Import the repository in Netlify.

# 3\. Add the Supabase environment variables in Site Configuration.

# 4\. Deploy using the Next.js runtime.

# 

# This project requires a dynamic Next.js deployment. Do not deploy it as a static `out` export because the CMS, authentication, and contact features require server-side capabilities.

# 

# \## Security Notes

# 

# \* Never commit `.env.local`.

# \* Never expose `SUPABASE\_SERVICE\_ROLE\_KEY` in client-side code.

# \* Keep Supabase Row Level Security enabled.

# \* Only approved administrators should have content-editing permissions.

# \* Review contact messages and uploaded files regularly.

# 

# \## Repository Structure

# 

# ```text

# app/          Public pages, admin routes, and server logic

# components/   Reusable interface components

# lib/          Supabase and utility functions

# public/       Static files, images, and downloadable CVs

# screenshots/  Portfolio screenshots used in this README

# supabase/     Database schema, seed data, and admin SQL scripts

# docs/         Setup and deployment documentation

# ```

# 

# \## Professional Positioning

# 

# Ahmed Aziz Mhiri uses data, automation, and digital marketing to improve commercial performance, customer journeys, operational reliability, and business decisions.

# 

# \## License

# 

# This repository contains a personal professional portfolio. Reuse, reproduction, or redistribution of its content, visual identity, CVs, and project materials requires permission from the owner.



