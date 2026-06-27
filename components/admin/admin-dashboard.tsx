'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import type { Certification, ContactMessage, Education, Experience, PortfolioContent, Profile, Project, Resume, SkillCluster, ValueCard } from '@/lib/cms-types';

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

async function readAdminResponse<T>(response: Response) {
  const result = await response.json().catch(() => ({})) as { message?: string } & T;
  if (!response.ok) throw new Error(result.message || 'Unable to complete the admin request.');
  return result;
}

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

  function reloadAdmin() {
    window.location.reload();
  }

  async function adminRequest(payload: Record<string, unknown>) {
    const response = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return readAdminResponse<{ id?: string | null }>(response);
  }

  async function uploadFile(file: File, kind: 'portrait' | 'project-cover' | 'cv-pdf' | 'cv-docx') {
    const form = new FormData();
    form.set('kind', kind);
    form.set('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
    return readAdminResponse<{ publicUrl: string; sizeLabel: string }>(response);
  }

  async function saveProfile(next: Profile, portraitFile?: File | null) {
    setBusy(true);
    try {
      const portrait = portraitFile ? await uploadFile(portraitFile, 'portrait') : null;
      await adminRequest({ action: 'save-profile', data: { ...next, portraitUrl: portrait?.publicUrl || next.portraitUrl } });
      reloadAdmin();
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Unable to save the profile.');
    } finally { setBusy(false); }
  }

  async function saveProject(next: Project, coverFile?: File | null) {
    setBusy(true);
    try {
      const cover = coverFile ? await uploadFile(coverFile, 'project-cover') : null;
      await adminRequest({ action: 'save-project', data: { ...next, coverImageUrl: cover?.publicUrl || next.coverImageUrl || null } });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the project.'); } finally { setBusy(false); }
  }

  async function deleteProject(id: string) {
    if (!window.confirm('Delete this project from the portfolio? This cannot be undone.')) return;
    setBusy(true);
    try {
      await adminRequest({ action: 'delete', entity: 'projects', id });
      setContent((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id) }));
      notify('success', 'Project deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the project.'); } finally { setBusy(false); }
  }

  async function saveExperience(next: Experience) {
    setBusy(true);
    try {
      await adminRequest({ action: 'save-experience', data: next });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the experience.'); } finally { setBusy(false); }
  }

  async function deleteExperience(id: string) {
    if (!window.confirm('Delete this experience entry?')) return;
    setBusy(true);
    try {
      await adminRequest({ action: 'delete', entity: 'experiences', id });
      setContent((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== id) }));
      notify('success', 'Experience deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the experience.'); } finally { setBusy(false); }
  }

  async function saveValueCard(next: ValueCard) {
    setBusy(true);
    try {
      await adminRequest({ action: 'save-value-card', data: next });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the service card.'); } finally { setBusy(false); }
  }

  async function saveSkill(next: SkillCluster) {
    setBusy(true);
    try {
      await adminRequest({ action: 'save-skill', data: next });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save the skill cluster.'); } finally { setBusy(false); }
  }

  async function saveEducation(next: Education) {
    setBusy(true);
    try {
      await adminRequest({ action: 'save-education', data: next });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save education.'); } finally { setBusy(false); }
  }

  async function saveCertification(next: Certification) {
    setBusy(true);
    try {
      await adminRequest({ action: 'save-certification', data: next });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save certification.'); } finally { setBusy(false); }
  }

  async function saveResume(next: Resume, pdfFile?: File | null, docxFile?: File | null) {
    setBusy(true);
    try {
      const pdfUpload = pdfFile ? await uploadFile(pdfFile, 'cv-pdf') : null;
      const docxUpload = docxFile ? await uploadFile(docxFile, 'cv-docx') : null;
      await adminRequest({ action: 'save-resume', data: { ...next, pdf: pdfUpload?.publicUrl || next.pdf, docx: docxUpload?.publicUrl || next.docx, pdfSize: pdfUpload?.sizeLabel || next.pdfSize, docxSize: docxUpload?.sizeLabel || next.docxSize } });
      reloadAdmin();
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to save CV details.'); } finally { setBusy(false); }
  }

  async function deleteItem(table: string, id: string, type: 'valueCards' | 'skillClusters' | 'education' | 'certifications' | 'resumes') {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    try {
      await adminRequest({ action: 'delete', entity: table, id });
      setContent((current) => ({ ...current, [type]: current[type].filter((item) => item.id !== id) }));
      notify('success', 'Item deleted.');
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete the item.'); } finally { setBusy(false); }
  }

  async function markMessage(id: string, isRead: boolean) {
    setBusy(true);
    try {
      await adminRequest({ action: 'mark-message', id, isRead });
      setMessages((current) => current.map((item) => item.id === id ? { ...item, is_read: isRead } : item));
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to update message.'); } finally { setBusy(false); }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm('Delete this message?')) return;
    setBusy(true);
    try {
      await adminRequest({ action: 'delete', entity: 'contact_messages', id });
      setMessages((current) => current.filter((item) => item.id !== id));
    } catch (error) { notify('error', error instanceof Error ? error.message : 'Unable to delete message.'); } finally { setBusy(false); }
  }

  async function signOut() {
    const response = await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ redirectTo: '/admin/login' }) });
    const result = await readAdminResponse<{ redirectTo: string }>(response);
    window.location.assign(result.redirectTo || '/admin/login');
  }

  const unreadCount = useMemo(() => messages.filter((message) => !message.is_read).length, [messages]);

  return <div className="admin-shell">
    <header className="admin-header"><div><Link className="admin-brand" href="/">AAM <span>Portfolio Manager</span></Link><p>Private administration for the portfolio</p></div><div className="admin-header-actions"><span className="admin-user">{userEmail}</span><Link className="button button-secondary" href="/admin/security">Security</Link><Link className="button button-secondary" href="/" target="_blank">View site</Link><button className="button button-primary" onClick={signOut}>Sign out</button></div></header>
    <div className="admin-layout"><aside className="admin-nav" aria-label="Content sections">{tabs.map((tab) => <button key={tab.id} type="button" className={activeTab === tab.id ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab(tab.id)}>{tab.label}{tab.id === 'messages' && unreadCount > 0 && <span>{unreadCount}</span>}</button>)}</aside><main className="admin-main">{notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}{busy && <div className="admin-busy" aria-live="polite">Saving...</div>}
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
function FormActions({ onCancel, submitLabel, busy }: { onCancel?: () => void; submitLabel: string; busy: boolean }) { return <div className="admin-form-actions">{onCancel && <button type="button" className="button button-secondary" onClick={onCancel} disabled={busy}>Cancel</button>}<button type="submit" className="button button-primary" disabled={busy}>{busy ? 'Saving...' : submitLabel}</button></div>; }

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
  return <AdminSection eyebrow="Career history" title="Experience" intro="Manage employment, internship and consultancy entries. The displayed order follows the order number."><div className="admin-toolbar"><button className="button button-primary" onClick={() => setEditing(emptyExperience(items.length + 1))}>Add experience</button></div>{editing && <ExperienceForm item={editing} onSave={async (item) => { await onSave(item); setEditing(null); }} onCancel={() => setEditing(null)} busy={busy} />}<div className="admin-item-list">{items.map((item) => <article key={item.id || item.organisation} className="admin-item"><div><p className="project-industry">{item.dates}</p><h3>{item.role}</h3><p>{item.organisation} - {item.location}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditing(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete(item.id!)} disabled={busy}>Delete</button>}</div></article>)}</div></AdminSection>;
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
  return <AdminSection eyebrow="Downloads" title="CV download center" intro="Upload replacement PDF or DOCX files and keep the visitor download cards current."><div className="admin-toolbar"><button className="button button-primary" onClick={() => setEditing({ title: '', language: '', use: '', description: '', pdf: '', docx: '', pdfSize: '', docxSize: '', sortOrder: items.length + 1 })}>Add CV</button></div>{editing && <ResumeForm item={editing} onSave={async (item, pdf, docx) => { await onSave(item, pdf, docx); setEditing(null); }} onCancel={() => setEditing(null)} busy={busy} />}{items.map((item) => <article key={item.id || item.title} className="admin-item"><div><p className="project-industry">{item.language} - {item.use}</p><h3>{item.title}</h3><p>{item.description}</p></div><div className="admin-item-actions"><button className="button button-secondary" onClick={() => setEditing(item)}>Edit</button>{item.id && <button className="button button-danger" onClick={() => onDelete('resumes', item.id!, 'resumes')} disabled={busy}>Delete</button>}</div></article>)}</AdminSection>;
}
function ResumeForm({ item, onSave, onCancel, busy }: { item: Resume; onSave: (item: Resume, pdf?: File | null, docx?: File | null) => Promise<void>; onCancel: () => void; busy: boolean }) { const [draft, setDraft] = useState(item); const [pdf, setPdf] = useState<File | null>(null); const [docx, setDocx] = useState<File | null>(null); const set = <K extends keyof Resume>(key: K, value: Resume[K]) => setDraft((current) => ({ ...current, [key]: value })); return <form className="admin-form admin-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft, pdf, docx); }}><div className="admin-form-grid"><Field label="CV name"><TextInput value={draft.title} onChange={(value) => set('title', value)} /></Field><Field label="Language"><TextInput value={draft.language} onChange={(value) => set('language', value)} /></Field><Field label="Intended use"><TextInput value={draft.use} onChange={(value) => set('use', value)} /></Field><Field label="Display order"><TextInput type="number" value={String(draft.sortOrder || 100)} onChange={(value) => set('sortOrder', Number(value) || 100)} /></Field></div><Field label="Description"><TextArea value={draft.description} onChange={(value) => set('description', value)} rows={3} /></Field><div className="admin-form-grid"><Field label="PDF link" hint="Filled after an upload; direct file links are also accepted."><TextInput value={draft.pdf} onChange={(value) => set('pdf', value)} /></Field><Field label="PDF file (optional)"><input type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0] || null; setPdf(file); if (file) set('pdfSize', `${Math.ceil(file.size / 1024)} KB`); }} /></Field><Field label="DOCX link" hint="Filled after an upload; direct file links are also accepted."><TextInput value={draft.docx} onChange={(value) => set('docx', value)} /></Field><Field label="DOCX file (optional)"><input type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { const file = event.target.files?.[0] || null; setDocx(file); if (file) set('docxSize', `${Math.ceil(file.size / 1024)} KB`); }} /></Field><Field label="PDF size label"><TextInput value={draft.pdfSize} onChange={(value) => set('pdfSize', value)} /></Field><Field label="DOCX size label"><TextInput value={draft.docxSize} onChange={(value) => set('docxSize', value)} /></Field></div><FormActions onCancel={onCancel} submitLabel="Save CV" busy={busy} /></form>; }

function MessagesManager({ messages, onMark, onDelete, busy }: { messages: ContactMessage[]; onMark: (id: string, isRead: boolean) => Promise<void>; onDelete: (id: string) => Promise<void>; busy: boolean }) { return <AdminSection eyebrow="Inbox" title="Contact messages" intro="Messages sent through the public contact form appear here until you delete them.">{messages.length === 0 ? <div className="admin-empty">No messages yet.</div> : <div className="admin-message-list">{messages.map((message) => <article key={message.id} className={message.is_read ? 'admin-message read' : 'admin-message'}><div className="admin-message-meta"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><time dateTime={message.created_at}>{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.created_at))}</time></div><p>{message.message}</p><div className="admin-item-actions"><button className="button button-secondary" onClick={() => onMark(message.id, !message.is_read)} disabled={busy}>{message.is_read ? 'Mark unread' : 'Mark read'}</button><button className="button button-danger" onClick={() => onDelete(message.id)} disabled={busy}>Delete</button></div></article>)}</div>}</AdminSection>; }

function emptyProject(order: number): Project { return { slug: '', title: '', industry: '', challenge: '', impact: '', contributions: [], businessValue: [], workflow: [], tools: [], cover: 'automation', sortOrder: order }; }
function emptyExperience(order: number): Experience { return { organisation: '', role: '', dates: '', location: '', summary: '', responsibilities: [], tools: [], sortOrder: order }; }
