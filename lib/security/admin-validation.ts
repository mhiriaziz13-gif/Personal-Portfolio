import { cleanLongText, cleanString, cleanUrl, jsonObject, numberOrder, stringArray, uuid } from './validation';

export function profilePayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: 1,
    name: cleanString(data.name, 120),
    location: cleanString(data.location, 120),
    email: cleanString(data.email, 254),
    linkedin_url: cleanUrl(data.linkedIn, 500),
    headline: cleanString(data.headline, 180),
    homepage_title: cleanString(data.homepageTitle, 180),
    tagline: cleanString(data.tagline, 180),
    availability: cleanString(data.availability, 180),
    summary: cleanLongText(data.summary, 1200),
    about_heading: cleanString(data.aboutHeading, 220),
    about_body: cleanLongText(data.aboutBody, 1200),
    long_term_objective: cleanLongText(data.longTermObjective, 1200),
    target_countries: stringArray(data.targetCountries, 12, 80),
    portrait_url: cleanUrl(data.portraitUrl, 800),
  };
}

export function projectPayload(value: unknown) {
  const data = jsonObject(value) || {};
  const cover = cleanString(data.cover, 40, false) || 'automation';
  if (!['automation', 'journey', 'architecture'].includes(cover)) throw new Error('Invalid cover type.');
  const beforeAfter = jsonObject(data.beforeAfter);
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      slug: cleanString(data.slug, 100).toLowerCase(),
      title: cleanString(data.title, 180),
      industry: cleanString(data.industry, 120),
      challenge: cleanLongText(data.challenge, 1800),
      impact: cleanLongText(data.impact, 900),
      contributions: stringArray(data.contributions, 12, 320),
      business_value: stringArray(data.businessValue, 12, 320),
      workflow: stringArray(data.workflow, 12, 180),
      tools: stringArray(data.tools, 30, 80),
      cover,
      cover_image_url: data.coverImageUrl ? cleanUrl(data.coverImageUrl, 800, false) : null,
      confidentiality: data.confidentiality ? cleanLongText(data.confidentiality, 700, false) : null,
      before_after: beforeAfter ? { before: stringArray(beforeAfter.before, 12, 180), after: stringArray(beforeAfter.after, 12, 180) } : null,
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function experiencePayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      organisation: cleanString(data.organisation, 180),
      role: cleanString(data.role, 180),
      date_label: cleanString(data.dates, 120),
      location: cleanString(data.location, 160),
      summary: cleanLongText(data.summary, 900),
      responsibilities: stringArray(data.responsibilities, 12, 320),
      tools: stringArray(data.tools, 30, 80),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function valueCardPayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      kicker: cleanString(data.kicker, 12),
      title: cleanString(data.title, 120),
      body: cleanLongText(data.body, 500),
      detail: cleanLongText(data.detail, 900),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function skillPayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      title: cleanString(data.title, 120),
      items: stringArray(data.items, 60, 80),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function educationPayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      title: cleanString(data.title, 180),
      organisation: cleanString(data.organisation, 180),
      date_label: cleanString(data.date, 120),
      detail: cleanString(data.detail, 220, false),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function certificationPayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      title: cleanString(data.title, 180),
      issuer: cleanString(data.issuer, 120, false),
      detail: cleanLongText(data.detail, 600, false),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}

export function resumePayload(value: unknown) {
  const data = jsonObject(value) || {};
  return {
    id: typeof data.id === 'string' && data.id ? uuid(data.id) : undefined,
    payload: {
      title: cleanString(data.title, 160),
      language: cleanString(data.language, 80),
      intended_use: cleanString(data.use, 160),
      description: cleanLongText(data.description, 500),
      pdf_url: cleanUrl(data.pdf, 800),
      docx_url: cleanUrl(data.docx, 800),
      pdf_size: cleanString(data.pdfSize, 40, false),
      docx_size: cleanString(data.docxSize, 40, false),
      sort_order: numberOrder(data.sortOrder),
      is_published: true,
    },
  };
}
