'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import type { Certification, ContactMessage, Education, Experience, PortfolioContent, Profile, Project, Resume, SkillCluster, ValueCard } from '@/lib/cms-types';
import { createClient } from '@/lib/supabase/client';

type Tab = 'profile' | 'projects' | 'experience' | 'skills' | 'education' | 'cv' | 'messages';
type Notice = { type: 'success' | 'error'; text: string } | null;

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'profile', label: 'Profile & portrait' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills & services' },
  { id: 'education', label: 'Education' },
  { id: 'cv', label: 'CVs' },
  { id: 'messages', label: 'Messages' },
];

function linesToArray(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}
function arrayToLines(value?: string[]) { return (value || []).join('\n'); }
function slugify(value: string) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90); }
function fileName(value: string) { return value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-'); }

export function AdminDashboard({ initialContent, initialMessages, userEmail }: { initialContent: PortfolioContent; initialMessages: ContactMessage[]; userEmail: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [content, setContent] = useState(initialContent);
  const [messages, setMessages] = useState(initialMessages);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  function notify(type: 'success' | 'error', text: string) {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 5000);
  }

  async function uploadFile(file: File, folder: string) {
    const supabase = createClient();
    const path = `${folder}/${Date.now()}-${fileName(file.name)}`;
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined });
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveProfile(next: Profile, portraitFile?: File | null) {
    setBusy(true);
    try {
      const portraitUrl = portraitFile ? await uploadFile(portraitFile, 'portraits') : next.portraitUrl;
      const supabase = createClient();
      const { error } = await supabase.from('site_profile').upsert({ id: 1, name: next.name, location: next.location, email: next.email, linkedin_url: next.linkedIn, headline: next.headline, homepage_title: next.homepageTitle, tagline: next.tagline, availability: next.availability, summary: next.summary, about_heading: next.aboutHeading, about_body: next.aboutBody, long_term_objective: next.longTermObjective, target_countries: next.targetCountries, portrait_url: portraitUrl });
      if (error) throw error;
      setContent((current) => ({ ...current, profile: { ...next, portraitUrl } }));
      notify('success', 'Profile saved. The public site reflects this change immediately.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Unable to save the profile.');
    } finally { setBusy(false); }
  }

  async function saveProject(next: Project, coverFile?: File | null) {
    setBusy(true);
    try {
      const coverImageUrl = coverFile ? await uploadFile(coverFile, 'project-covers') : next.coverImageUrl || null;
      const supabase = createClient();
      const payload = { slug: next.slug, title: next.title, industry: next.industry, challenge: next.challenge, impact: next.impact, contributions: next.contributions, business_value: next.businessValue, workflow: next.workflow, tools: next.tools, cover: next.cover, cover_image_url: coverImageUrl, confidentiality: next.confidentiality || null, before_after: next.beforeAfter || null, sort_order: next.sortOrder || 100, is_published: true };
      const query = next.id ? supabase.from('projects').update(payload).eq('id', next.id) : supabase.from('projects').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string, coverImageUrl };
      setContent((current) => ({ ...current, projects: next.id ? current.projects.map((item) => item.id === next.id ? saved : item) : [...current.projects, saved].sort((a, b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Project updated.' : 'Project added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the project.'); } finally { setBusy(false); }
  }

  async function deleteProject(id: string) {
    if (!window.confirm('Delete this project from the portfolio? This cannot be undone.')) return;
    setBusy(true);
    try {
      const { error } = await createClient().from('projects').delete().eq('id', id);
      if (error) throw error;
      setContent((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id) }));
      notify('success', 'Project deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the project.'); } finally { setBusy(false); }
  }

  async function saveExperience(next: Experience) {
    setBusy(true);
    try {
      const payload = { organisation: next.organisation, role: next.role, date_label: next.dates, location: next.location, summary: next.summary, responsibilities: next.responsibilities, tools: next.tools || [], sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('experiences').update(payload).eq('id', next.id) : supabase.from('experiences').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string };
      setContent((current) => ({ ...current, experiences: next.id ? current.experiences.map((item) => item.id === next.id ? saved : item) : [...current.experiences, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Experience updated.' : 'Experience added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the experience.'); } finally { setBusy(false); }
  }

  async function deleteExperience(id: string) {
    if (!window.confirm('Delete this experience entry?')) return;
    setBusy(true);
    try {
      const { error } = await createClient().from('experiences').delete().eq('id', id);
      if (error) throw error;
      setContent((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== id) }));
      notify('success', 'Experience deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the experience.'); } finally { setBusy(false); }
  }

  async function saveValueCard(next: ValueCard) {
    setBusy(true);
    try {
      const payload = { kicker: next.kicker, title: next.title, body: next.body, detail: next.detail, sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('value_cards').update(payload).eq('id', next.id) : supabase.from('value_cards').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string };
      setContent((current) => ({ ...current, valueCards: next.id ? current.valueCards.map((item) => item.id === next.id ? saved : item) : [...current.valueCards, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Service card updated.' : 'Service card added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the service card.'); } finally { setBusy(false); }
  }

  async function saveSkill(next: SkillCluster) {
    setBusy(true);
    try {
      const payload = { title: next.title, items: next.items, sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('skill_clusters').update(payload).eq('id', next.id) : supabase.from('skill_clusters').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string };
      setContent((current) => ({ ...current, skillClusters: next.id ? current.skillClusters.map((item) => item.id === next.id ? saved : item) : [...current.skillClusters, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Skill cluster updated.' : 'Skill cluster added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the skill cluster.'); } finally { setBusy(false); }
  }

  async function saveEducation(next: Education) {
    setBusy(true);
    try {
      const payload = { title: next.title, organisation: next.organisation, date_label: next.date, detail: next.detail, sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('education').update(payload).eq('id', next.id) : supabase.from('education').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string };
      setContent((current) => ({ ...current, education: next.id ? current.education.map((item) => item.id === next.id ? saved : item) : [...current.education, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Education item updated.' : 'Education item added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save education.'); } finally { setBusy(false); }
  }

  async function saveCertification(next: Certification) {
    setBusy(true);
    try {
      const payload = { title: next.title, issuer: next.issuer, detail: next.detail, sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('certifications').update(payload).eq('id', next.id) : supabase.from('certifications').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string };
      setContent((current) => ({ ...current, certifications: next.id ? current.certifications.map((item) => item.id === next.id ? saved : item) : [...current.certifications, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'Certification updated.' : 'Certification added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save certification.'); } finally { setBusy(false); }
  }

  async function saveResume(next: Resume, pdfFile?: File | null, docxFile?: File | null) {
    setBusy(true);
    try {
      const pdf = pdfFile ? await uploadFile(pdfFile, 'cvs') : next.pdf;
      const docx = docxFile ? await uploadFile(docxFile, 'cvs') : next.docx;
      const payload = { title: next.title, language: next.language, intended_use: next.use, description: next.description, pdf_url: pdf, docx_url: docx, pdf_size: next.pdfSize, docx_size: next.docxSize, sort_order: next.sortOrder || 100, is_published: true };
      const supabase = createClient();
      const query = next.id ? supabase.from('resumes').update(payload).eq('id', next.id) : supabase.from('resumes').insert(payload);
      const { data, error } = await query.select().single();
      if (error) throw error;
      const saved = { ...next, id: data.id as string, pdf, docx };
      setContent((current) => ({ ...current, resumes: next.id ? current.resumes.map((item) => item.id === next.id ? saved : item) : [...current.resumes, saved].sort((a,b) => (a.sortOrder || 100) - (b.sortOrder || 100)) }));
      notify('success', next.id ? 'CV links updated.' : 'CV entry added.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save CV details.'); } finally { setBusy(false); }
  }

  async function deleteItem(table: string, id: string, type: 'valueCards' | 'skillClusters' | 'education' | 'certifications' | 'resumes') {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    try {
      const { error } = await createClient().from(table).delete().eq('id', id);
      if (error) throw error;
      setContent((current) => ({ ...current, [type]: current[type].filter((item) => item.id !== id) }));
      notify('success', 'Item deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the item.'); } finally { setBusy(false); }
  }

  async function markMessage(id: string, isRead: boolean) {
    setBusy(true);
    try {
      const { error } = await createClient().from('contact_messages').update({ is_read: isRead }).eq('id', id);
      if (error) throw error;
      setMessages((current) => current.map((item) => item.id === id ? { ...item, is_read: isRead } : item));
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to update message.'); } finally { setBusy(false); }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm('Delete this message?')) return;
    setBusy(true);
    try {
      const { error } = await createClient().from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages((current) => current.filter((item) => item.id !== id));
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete message.'); } finally { setBusy(false); }
  }

  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign('/admin/login');
  }

  const unreadCount = useMemo(() => messages.filter((message) => !message.is_read).length, [messages]);

  return <div className="admin-shell">
    <header className="admin-header"><div><Link className="admin-brand" href="/">AAM <span>Content Studio</span></Link><p>Private administration for the portfolio</p></div><div className="admin-header-actions"><span className="admin-user">{userEmail}</span><Link className="button button-secondary" href="/" target="_blank">View site</Link><button className="button button-primary" onClick={signOut}>Sign out</button></div></header>
    <div className="admin-layout"><aside className="admin-nav" aria-label="Content sections">{tabs.map((tab) => <button key={tab.id} type="button" className={activeTab === tab.id ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab(tab.id)}>{tab.label}{tab.id === 'messages' && unreadCount > 0 && <span>{unreadCount}</span>}</button>)}</aside><main className="admin-main">{notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}{busy && <div className="admin-busy" aria-live="polite">Saving…</div>}
      {activeTab === 'profile' && <ProfileEditor profile={content.profile} onSave={saveProfile} busy={busy} />}
      {activeTab === 'projects' && <ProjectManager items={content.projects} onSave={saveProject} onDelete={deleteProject} busy={busy} />}
      {activeTab === 'experience' && <ExperienceManager items={content.experiences} onSave={saveExperience} onDelete={deleteExperience} busy={busy} />}
      {activeTab === 'skills' && <SkillsManager values={content.valueCards} skills={content.skillClusters} onSaveValue={saveValueCard} onSaveSkill={saveSkill} onDelete={deleteItem} busy={busy} />}
      {activeTab === 'education' && <EducationManager education={content.education} certifications={content.certifications} onSaveEducation={saveEducation} onSaveCertification={saveCertification} onDelete={deleteItem} busy={busy} />}
      {activeTab === 'cv' && <ResumeManager items={content.resumes} onSave={saveResume} onDelete={deleteItem} busy={busy} />}
      {activeTab === 'messages' && <MessagesManager messages={messages} onMark={markMessage} onDelete={deleteMessage} busy={busy} />}
    </main></div>
  </div>;
}

function AdminSection({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <section className="admin-section"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="admin-intro">{intro}</p>{children}</section>;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) { return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) { return <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />; }
function TextArea({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) { return <textarea rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />; }
function FormActions({ onCancel, submitLabel, busy }: { onCancel?: () => void; submitLabel: string; busy: boolean }) { return <div className="admin-form-actions">{onCancel && <button type="button" className="button button-secondary" onClick={onCancel} disabled={busy}>Cancel</button>}<button type="submit" className="button button-primary" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button></div>; }

function ProfileEditor({ profile, onSave, busy }: { profile: Profile; onSave: (profile: Profile, portrait?: File | null) => Promise<void>; busy: boolean }) {
  const [draft, setDraft] = useState(profile);
  const [portrait, setPortrait] = useState<File | null>(null);
  function set<K extends keyof Profile>(key: K, value: Profile[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  return <AdminSection eyebrow="Profile" title="Identity, positioning and portrait" intro="This controls the hero, About page, contact details, footer and SEO person schema."><form className="admin-form" onSubmit={(event) => { event.preventDefault(); onSave(draft, portrait); }}><div className="admin-form-grid"><Field label="Full name"><TextInput value={draft.name} onChange={(value) => set('name', value)} /></Field><Field label="Location"><TextInput value={draft.location} onChange={(value) => set('location', value)} /></Field><Field label="Public email"><TextInput value={draft.email} type="email" onChange={(value) => set('email', value)} /></Field><Field label="LinkedIn URL"><TextInput value={draft.linkedIn} type="url" onChange={(value) => set('linkedIn', value)} /></Field><Field label="Professional headline" hint="Used for structured data and context."><TextInput value={draft.headline} onChange={(value) => set('headline', value)} /></Field><Field label="Hero title"><TextArea value={draft.homepageTitle} onChange={(value) => set('homepageTitle', value)} rows={2} /></Field><Field label="Tagline"><TextInput value={draft.tagline} onChange={(value) => set('tagline', value)} /></Field><Field label="Availability"><TextInput value={draft.availability} onChange={(value) => set('availability', value)} /></Field></div><Field label="Professional summary"><TextArea value={draft.summary} onChange={(value) => set('summary', value)} rows={5} /></Field><Field label="About page heading"><TextArea value={draft.aboutHeading} onChange={(value) => set('aboutHeading', value)} rows={2} /></Field><Field label="About page body"><TextArea value={draft.aboutBody} onChange={(value) => set('aboutBody', value)} rows={4} /></Field><Field label="Long-term objective"><TextArea value={draft.longTermObjective} onChange={(value) => set('longTermObjective', value)} rows={4} /></Field><Field label="Target countries" hint="One country per line."><TextArea value={arrayToLines(draft.targetCountries)} onChange={(value) => set('targetCountries', linesToArray(value))} rows={4} /></Field><div className="admin-upload-row"><div><span className="admin-upload-label">Official portrait</span><small>Upload a PNG, JPG or WebP. It will replace the portrait on Home and About after saving.</small></div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPortrait(event.target.files?.[0] || null)} />{portrait && <em>Selected: {portrait.name}</em>}</div><FormActions submitLabel="Save profile" busy={busy} /></form></AdminSection>;
}

function ProjectManager({ items, onSave, onDelete, busy }: { items: Project[]; onSave: (project: Project, cover?: File | null) => Promise<void>; onDelete: (id: string) => Promise<void>; busy: boolean }) {
  const [editing, setEditing] = useState<Project | null>(null);
  return <AdminSection eyebrow="Case studies" title="Projects" intro="Add, update or delete portfolio case studies. A custom cover is optional; the original data-inspired cover remains available."><div className="admin-toolbar"><button className="button button-primary" onClick={() => setEditing(emptyProject(items.length + 1))}>Add project</button></div>{editing && <ProjectForm project={editing} onSave={async (project, file) => { await onSave(project, file); setEditing(null); }} onCancel={() => setEditing(null)} busy={busy} />}<div className="admin-item-list">{items.map((item) => <article key={item.id || item.slug} className="admin-item"><div><p className="project-industry">{item.industry}</p><h3>{item.title}</h3><p>{item.impact}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditing(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete(item.id!)} disabled={busy}>Delete</button>}</div></article>)}</div></AdminSection>;
}

function ProjectForm({ project, onSave, onCancel, busy }: { project: Project; onSave: (project: Project, cover?: File | null) => Promise<void>; onCancel: () => void; busy: boolean }) {
  const [draft, setDraft] = useState(project);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  function set<K extends keyof Project>(key: K, value: Project[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft, coverFile); }}><div className="admin-form-grid"><Field label="Project title"><TextInput value={draft.title} onChange={(value) => { set('title', value); if (!draft.id) set('slug', slugify(value)); }} /></Field><Field label="URL slug" hint="Lowercase words separated with hyphens."><TextInput value={draft.slug} onChange={(value) => set('slug', slugify(value))} /></Field><Field label="Industry"><TextInput value={draft.industry} onChange={(value) => set('industry', value)} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field><Field label="Cover style"><select value={draft.cover} onChange={(event) => set('cover', event.target.value as Project['cover'])}><option value="automation">Automation</option><option value="journey">Customer journey</option><option value="architecture">Architecture</option></select></Field><Field label="Optional custom cover"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} /></Field></div><Field label="Business challenge"><TextArea value={draft.challenge} onChange={(value) => set('challenge', value)} rows={4} /></Field><Field label="Short impact statement"><TextArea value={draft.impact} onChange={(value) => set('impact', value)} rows={3} /></Field><Field label="My contributions" hint="One contribution per line."><TextArea value={arrayToLines(draft.contributions)} onChange={(value) => set('contributions', linesToArray(value))} rows={7} /></Field><Field label="Business value" hint="One point per line."><TextArea value={arrayToLines(draft.businessValue)} onChange={(value) => set('businessValue', linesToArray(value))} rows={6} /></Field><Field label="Workflow / architecture steps" hint="One step per line."><TextArea value={arrayToLines(draft.workflow)} onChange={(value) => set('workflow', linesToArray(value))} rows={6} /></Field><Field label="Tools" hint="One tool per line."><TextArea value={arrayToLines(draft.tools)} onChange={(value) => set('tools', linesToArray(value))} rows={6} /></Field><Field label="Confidentiality note (optional)"><TextArea value={draft.confidentiality || ''} onChange={(value) => set('confidentiality', value || undefined)} rows={3} /></Field>{draft.cover === 'journey' && <div className="admin-form-grid"><Field label="Before" hint="One point per line."><TextArea value={arrayToLines(draft.beforeAfter?.before)} onChange={(value) => set('beforeAfter', { before: linesToArray(value), after: draft.beforeAfter?.after || [] })} rows={5} /></Field><Field label="After" hint="One point per line."><TextArea value={arrayToLines(draft.beforeAfter?.after)} onChange={(value) => set('beforeAfter', { before: draft.beforeAfter?.before || [], after: linesToArray(value) })} rows={5} /></Field></div>}<FormActions onCancel={onCancel} submitLabel={draft.id ? 'Save project changes' : 'Add project'} busy={busy} /></form>;
}

function ExperienceManager({ items, onSave, onDelete, busy }: { items: Experience[]; onSave: (item: Experience) => Promise<void>; onDelete: (id: string) => Promise<void>; busy: boolean }) {
  const [editing, setEditing] = useState<Experience | null>(null);
  return <AdminSection eyebrow="Career history" title="Experience" intro="Manage employment, internship and consultancy entries. The displayed order follows the order number."><div className="admin-toolbar"><button className="button button-primary" onClick={() => setEditing(emptyExperience(items.length + 1))}>Add experience</button></div>{editing && <ExperienceForm item={editing} onSave={async (item) => { await onSave(item); setEditing(null); }} onCancel={() => setEditing(null)} busy={busy} />}<div className="admin-item-list">{items.map((item) => <article key={item.id || item.organisation} className="admin-item"><div><p className="project-industry">{item.dates}</p><h3>{item.role}</h3><p>{item.organisation} · {item.location}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditing(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete(item.id!)} disabled={busy}>Delete</button>}</div></article>)}</div></AdminSection>;
}

function ExperienceForm({ item, onSave, onCancel, busy }: { item: Experience; onSave: (item: Experience) => Promise<void>; onCancel: () => void; busy: boolean }) {
  const [draft, setDraft] = useState(item);
  function set<K extends keyof Experience>(key: K, value: Experience[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="admin-form-grid"><Field label="Organisation"><TextInput value={draft.organisation} onChange={(value) => set('organisation', value)} /></Field><Field label="Role"><TextInput value={draft.role} onChange={(value) => set('role', value)} /></Field><Field label="Date range"><TextInput value={draft.dates} onChange={(value) => set('dates', value)} /></Field><Field label="Location"><TextInput value={draft.location} onChange={(value) => set('location', value)} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field></div><Field label="Summary"><TextArea value={draft.summary} onChange={(value) => set('summary', value)} rows={4} /></Field><Field label="Responsibilities" hint="One responsibility per line."><TextArea value={arrayToLines(draft.responsibilities)} onChange={(value) => set('responsibilities', linesToArray(value))} rows={7} /></Field><Field label="Tools (optional)" hint="One tool per line."><TextArea value={arrayToLines(draft.tools)} onChange={(value) => set('tools', linesToArray(value))} rows={5} /></Field><FormActions onCancel={onCancel} submitLabel={draft.id ? 'Save experience' : 'Add experience'} busy={busy} /></form>;
}

function SkillsManager({ values, skills, onSaveValue, onSaveSkill, onDelete, busy }: { values: ValueCard[]; skills: SkillCluster[]; onSaveValue: (item: ValueCard) => Promise<void>; onSaveSkill: (item: SkillCluster) => Promise<void>; onDelete: (table: string, id: string, type: 'valueCards' | 'skillClusters') => Promise<void>; busy: boolean }) {
  const [editingValue, setEditingValue] = useState<ValueCard | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillCluster | null>(null);
  return <AdminSection eyebrow="Capabilities" title="Services and skill clusters" intro="Edit the four contribution cards and the skills shown on the home page."><div className="admin-split"><div><div className="admin-toolbar"><h2>Contribution cards</h2><button className="button button-primary" onClick={() => setEditingValue({ kicker: String(values.length + 1).padStart(2, '0'), title: '', body: '', detail: '', sortOrder: values.length + 1 })}>Add card</button></div>{editingValue && <ValueForm item={editingValue} onSave={async (item) => { await onSaveValue(item); setEditingValue(null); }} onCancel={() => setEditingValue(null)} busy={busy} />}{values.map((item) => <article key={item.id || item.title} className="admin-item compact"><div><p className="project-industry">{item.kicker}</p><h3>{item.title}</h3></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditingValue(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('value_cards', item.id!, 'valueCards')} disabled={busy}>Delete</button>}</div></article>)}</div><div><div className="admin-toolbar"><h2>Skill clusters</h2><button className="button button-primary" onClick={() => setEditingSkill({ title: '', items: [], sortOrder: skills.length + 1 })}>Add cluster</button></div>{editingSkill && <SkillForm item={editingSkill} onSave={async (item) => { await onSaveSkill(item); setEditingSkill(null); }} onCancel={() => setEditingSkill(null)} busy={busy} />}{skills.map((item) => <article key={item.id || item.title} className="admin-item compact"><div><h3>{item.title}</h3><p>{item.items.length} skills</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditingSkill(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('skill_clusters', item.id!, 'skillClusters')} disabled={busy}>Delete</button>}</div></article>)}</div></div></AdminSection>;
}

function ValueForm({ item, onSave, onCancel, busy }: { item: ValueCard; onSave: (item: ValueCard) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const set = <K extends keyof ValueCard>(key: K, value: ValueCard[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><Field label="Number"><TextInput value={draft.kicker} onChange={(value) => set('kicker', value)} /></Field><Field label="Title"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Short description"><TextArea value={draft.body} onChange={(value) => set('body', value)} rows={3} /></Field><Field label="Expanded description"><TextArea value={draft.detail} onChange={(value) => set('detail', value)} rows={4} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field><FormActions onCancel={onCancel} submitLabel="Save card" busy={busy} /></form>; }
function SkillForm({ item, onSave, onCancel, busy }: { item: SkillCluster; onSave: (item: SkillCluster) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const set = <K extends keyof SkillCluster>(key: K, value: SkillCluster[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><Field label="Cluster title"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Skills" hint="One skill per line."><TextArea value={arrayToLines(draft.items)} onChange={(value) => set('items', linesToArray(value))} rows={6} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field><FormActions onCancel={onCancel} submitLabel="Save skill cluster" busy={busy} /></form>; }

function EducationManager({ education, certifications, onSaveEducation, onSaveCertification, onDelete, busy }: { education: Education[]; certifications: Certification[]; onSaveEducation: (item: Education) => Promise<void>; onSaveCertification: (item: Certification) => Promise<void>; onDelete: (table: string, id: string, type: 'education' | 'certifications') => Promise<void>; busy: boolean }) {
  const [educationEdit, setEducationEdit] = useState<Education | null>(null);
  const [certEdit, setCertEdit] = useState<Certification | null>(null);
  return <AdminSection eyebrow="Background" title="Education and certifications" intro="Keep qualifications, expected graduation information and certifications current."><div className="admin-split"><div><div className="admin-toolbar"><h2>Education</h2><button className="button button-primary" onClick={() => setEducationEdit({ title: '', organisation: '', date: '', detail: '', sortOrder: education.length + 1 })}>Add education</button></div>{educationEdit && <EducationForm item={educationEdit} onSave={async (item) => { await onSaveEducation(item); setEducationEdit(null); }} onCancel={() => setEducationEdit(null)} busy={busy} />}{education.map((item) => <article key={item.id || item.title} className="admin-item compact"><div><h3>{item.title}</h3><p>{item.organisation}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEducationEdit(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('education', item.id!, 'education')} disabled={busy}>Delete</button>}</div></article>)}</div><div><div className="admin-toolbar"><h2>Certifications</h2><button className="button button-primary" onClick={() => setCertEdit({ title: '', issuer: '', detail: '', sortOrder: certifications.length + 1 })}>Add certification</button></div>{certEdit && <CertificationForm item={certEdit} onSave={async (item) => { await onSaveCertification(item); setCertEdit(null); }} onCancel={() => setCertEdit(null)} busy={busy} />}{certifications.map((item) => <article key={item.id || item.title} className="admin-item compact"><div><h3>{item.title}</h3><p>{item.issuer}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setCertEdit(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('certifications', item.id!, 'certifications')} disabled={busy}>Delete</button>}</div></article>)}</div></div></AdminSection>;
}
function EducationForm({ item, onSave, onCancel, busy }: { item: Education; onSave: (item: Education) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const set = <K extends keyof Education>(key: K, value: Education[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><Field label="Qualification"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Institution"><TextInput value={draft.organisation} onChange={(value) => set('organisation', value)} /></Field><Field label="Date range"><TextInput value={draft.date} onChange={(value) => set('date', value)} /></Field><Field label="Detail"><TextInput value={draft.detail} onChange={(value) => set('detail', value)} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field><FormActions onCancel={onCancel} submitLabel="Save education" busy={busy} /></form>; }
function CertificationForm({ item, onSave, onCancel, busy }: { item: Certification; onSave: (item: Certification) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const set = <K extends keyof Certification>(key: K, value: Certification[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><Field label="Certification"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Issuer"><TextInput value={draft.issuer} onChange={(value) => set('issuer', value)} /></Field><Field label="Detail (optional)"><TextArea value={draft.detail} onChange={(value) => set('detail', value)} rows={3} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field><FormActions onCancel={onCancel} submitLabel="Save certification" busy={busy} /></form>; }

function ResumeManager({ items, onSave, onDelete, busy }: { items: Resume[]; onSave: (item: Resume, pdf?: File | null, docx?: File | null) => Promise<void>; onDelete: (table: string, id: string, type: 'resumes') => Promise<void>; busy: boolean }) {
  const [editing, setEditing] = useState<Resume | null>(null);
  return <AdminSection eyebrow="Downloads" title="CV download centre" intro="Replace PDF and DOCX files, then save. Existing local links continue to work until you upload a replacement."><div className="admin-toolbar"><button className="button button-primary" onClick={() => setEditing({ title: '', language: '', use: '', description: '', pdf: '', docx: '', pdfSize: '', docxSize: '', sortOrder: items.length + 1 })}>Add CV</button></div>{editing && <ResumeForm item={editing} onSave={async (item, pdf, docx) => { await onSave(item, pdf, docx); setEditing(null); }} onCancel={() => setEditing(null)} busy={busy} />}{items.map((item) => <article key={item.id || item.title} className="admin-item"><div><p className="project-industry">{item.language} · {item.use}</p><h3>{item.title}</h3><p>{item.description}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditing(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('resumes', item.id!, 'resumes')} disabled={busy}>Delete</button>}</div></article>)}</AdminSection>;
}
function ResumeForm({ item, onSave, onCancel, busy }: { item: Resume; onSave: (item: Resume, pdf?: File | null, docx?: File | null) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const [pdf, setPdf] = useState<File | null>(null); const [docx, setDocx] = useState<File | null>(null); const set = <K extends keyof Resume>(key: K, value: Resume[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft, pdf, docx); }}><div className="admin-form-grid"><Field label="CV name"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Language"><TextInput value={draft.language} onChange={(value) => set('language', value)} /></Field><Field label="Intended use"><TextInput value={draft.use} onChange={(value) => set('use', value)} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field></div><Field label="Description"><TextArea value={draft.description} onChange={(value) => set('description', value)} rows={3} /></Field><div className="admin-form-grid"><Field label="PDF URL" hint="Filled automatically after an upload; can also be a direct public URL."><TextInput value={draft.pdf} onChange={(value) => set('pdf', value)} /></Field><Field label="PDF file (optional)"><input type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0] || null; setPdf(file); if (file) set('pdfSize', `${Math.ceil(file.size / 1024)} KB`); }} /></Field><Field label="DOCX URL" hint="Filled automatically after an upload; can also be a direct public URL."><TextInput value={draft.docx} onChange={(value) => set('docx', value)} /></Field><Field label="DOCX file (optional)"><input type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { const file = event.target.files?.[0] || null; setDocx(file); if (file) set('docxSize', `${Math.ceil(file.size / 1024)} KB`); }} /></Field><Field label="PDF size label"><TextInput value={draft.pdfSize} onChange={(value) => set('pdfSize', value)} /></Field><Field label="DOCX size label"><TextInput value={draft.docxSize} onChange={(value) => set('docxSize', value)} /></Field></div><FormActions onCancel={onCancel} submitLabel="Save CV" busy={busy} /></form>; }

function MessagesManager({ messages, onMark, onDelete, busy }: { messages: ContactMessage[]; onMark: (id: string, isRead: boolean) => Promise<void>; onDelete: (id: string) => Promise<void>; busy: boolean }) { return <AdminSection eyebrow="Inbox" title="Contact messages" intro="Messages sent through the public contact form appear here. They remain in Supabase until you delete them.">{messages.length === 0 ? <div className="admin-empty">No messages yet.</div> : <div className="admin-message-list">{messages.map((message) => <article key={message.id} className={message.is_read ? 'admin-message read' : 'admin-message'}><div className="admin-message-meta"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><time dateTime={message.created_at}>{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.created_at))}</time></div><p>{message.message}</p><div className="admin-item-actions"><button className="button button-secondary" onClick={() => onMark(message.id, !message.is_read)} disabled={busy}>{message.is_read ? 'Mark unread' : 'Mark read'}</button><button className="button button-danger" onClick={() => onDelete(message.id)} disabled={busy}>Delete</button></div></article>)}</div>}</AdminSection>; }

function emptyProject(order: number): Project { return { slug: '', title: '', industry: '', challenge: '', impact: '', contributions: [], businessValue: [], workflow: [], tools: [], cover: 'automation', sortOrder: order }; }
function emptyExperience(order: number): Experience { return { organisation: '', role: '', dates: '', location: '', summary: '', responsibilities: [], tools: [], sortOrder: order }; }
