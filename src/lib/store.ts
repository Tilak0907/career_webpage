import { Company, Role, SiteAnalytics, Attachment } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// Pre-seeded Initial Data for Fallback & Seed Setup
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'TechNova Solutions',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    industry: 'Software & Cloud Services',
    location: 'San Francisco, CA (Hybrid)',
    description: 'Empowering enterprise digital transformation through cutting-edge cloud architecture, scalable microservices, and AI-driven automation tools.',
    websiteUrl: 'https://technovasolutions.example.com',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'comp-2',
    name: 'Apex AI Labs',
    logoUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=150&auto=format&fit=crop&q=80',
    industry: 'Artificial Intelligence & ML',
    location: 'New York, NY / Remote',
    description: 'Pioneering next-generation foundation models, agentic intelligence frameworks, and computer vision systems for healthcare and finance.',
    websiteUrl: 'https://apexailabs.example.com',
    createdAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: 'comp-3',
    name: 'GreenPulse Innovations',
    logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=150&auto=format&fit=crop&q=80',
    industry: 'CleanTech & Renewable Energy',
    location: 'Austin, TX',
    description: 'Building smart grid management software, battery analytics platforms, and sustainable energy tracking solutions for a zero-carbon future.',
    websiteUrl: 'https://greenpulse.example.com',
    createdAt: new Date('2026-02-10').toISOString(),
  },
];

const SAMPLE_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-1',
    name: 'Senior_Frontend_Developer_Role_Overview.pdf',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sizeBytes: 1024 * 450,
    uploadedAt: new Date('2026-02-15').toISOString(),
  },
  {
    id: 'att-2',
    name: 'Team_Culture_and_Benefits_Guide.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    sizeBytes: 1024 * 820,
    uploadedAt: new Date('2026-02-16').toISOString(),
  },
];

const INITIAL_ROLES: Role[] = [
  {
    id: 'role-1',
    companyId: 'comp-1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isActive: true,
    applyUrl: 'https://careers.technovasolutions.example.com/apply/fullstack-eng',
    descriptionHtml: `
      <h3>🚀 Role Overview</h3>
      <p>We are searching for a high-impact <strong>Senior Full Stack Engineer</strong> to spearhead our core platform expansion.</p>
    `,
    attachments: [SAMPLE_ATTACHMENTS[0], SAMPLE_ATTACHMENTS[1]],
    applyCount: 42,
    viewCount: 310,
    createdAt: new Date('2026-02-15').toISOString(),
  },
];

const STORAGE_KEYS = {
  COMPANIES: 'career_portal_companies_v1',
  ROLES: 'career_portal_roles_v1',
  ANALYTICS: 'career_portal_analytics_v1',
  ADMIN_AUTH: 'career_portal_admin_auth_v1',
};

// --- COMPANY OPERATIONS WITH SUPABASE SYNC ---

export function getCompanies(): Company[] {
  if (typeof window === 'undefined') return INITIAL_COMPANIES;
  const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    return INITIAL_COMPANIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMPANIES;
  }
}

export async function saveCompanyToSupabase(company: Company) {
  if (!supabase) return;
  try {
    await supabase.from('companies').upsert({
      id: company.id.includes('-') && !company.id.startsWith('comp-') ? company.id : undefined,
      name: company.name,
      logo_url: company.logoUrl,
      industry: company.industry,
      location: company.location,
      description: company.description,
      website_url: company.websiteUrl,
      created_at: company.createdAt,
    });
  } catch (e) {
    console.error('Supabase Company Sync Error:', e);
  }
}

export function saveCompanies(companies: Company[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  window.dispatchEvent(new Event('career_portal_store_updated'));

  // Sync latest company to Supabase if configured
  if (supabase && companies.length > 0) {
    saveCompanyToSupabase(companies[0]);
  }
}

export function deleteCompanyById(companyId: string): void {
  const companies = getCompanies().filter((c) => c.id !== companyId);
  saveCompanies(companies);
  const roles = getRoles().filter((r) => r.companyId !== companyId);
  saveRoles(roles);

  if (supabase) {
    supabase.from('companies').delete().eq('id', companyId).then();
  }
}

// --- ROLE OPERATIONS WITH SUPABASE SYNC ---

export function getRoles(): Role[] {
  if (typeof window === 'undefined') return INITIAL_ROLES;
  const data = localStorage.getItem(STORAGE_KEYS.ROLES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(INITIAL_ROLES));
    return INITIAL_ROLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ROLES;
  }
}

export async function saveRoleToSupabase(role: Role) {
  if (!supabase) return;
  try {
    await supabase.from('roles').upsert({
      company_id: role.companyId,
      title: role.title,
      department: role.department,
      location: role.location,
      type: role.type,
      start_date: role.startDate,
      end_date: role.endDate,
      is_active: role.isActive,
      apply_url: role.applyUrl,
      description_html: role.descriptionHtml,
      attachments: role.attachments,
      apply_count: role.applyCount,
      view_count: role.viewCount,
    });
  } catch (e) {
    console.error('Supabase Role Sync Error:', e);
  }
}

export function saveRoles(roles: Role[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  window.dispatchEvent(new Event('career_portal_store_updated'));

  // Sync latest role to Supabase if configured
  if (supabase && roles.length > 0) {
    saveRoleToSupabase(roles[0]);
  }
}

export function deleteRoleById(roleId: string): void {
  const roles = getRoles().filter((r) => r.id !== roleId);
  saveRoles(roles);

  if (supabase) {
    supabase.from('roles').delete().eq('id', roleId).then();
  }
}

export function toggleRoleActiveStatus(roleId: string): void {
  const roles = getRoles();
  const updated = roles.map((r) => {
    if (r.id === roleId) {
      const newStatus = !r.isActive;
      if (supabase) {
        supabase.from('roles').update({ is_active: newStatus }).eq('id', roleId).then();
      }
      return { ...r, isActive: newStatus };
    }
    return r;
  });
  saveRoles(updated);
}

// --- ANALYTICS & VISITOR COUNTS ---

export function getSiteAnalytics(): SiteAnalytics {
  if (typeof window === 'undefined') {
    return { totalPageViews: 1, uniqueVisitors: 1, lastUpdated: new Date().toISOString() };
  }
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  if (!data) {
    const initial: SiteAnalytics = { totalPageViews: 1, uniqueVisitors: 1, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed: SiteAnalytics = JSON.parse(data);
    return {
      totalPageViews: parsed.totalPageViews || 1,
      uniqueVisitors: parsed.uniqueVisitors || 1,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return { totalPageViews: 1, uniqueVisitors: 1, lastUpdated: new Date().toISOString() };
  }
}

export function getPageViewCount(): number {
  return getSiteAnalytics().totalPageViews;
}

export function incrementPageViewCount(): SiteAnalytics {
  if (typeof window === 'undefined') {
    return { totalPageViews: 1, uniqueVisitors: 1, lastUpdated: new Date().toISOString() };
  }
  const current = getSiteAnalytics();
  const newTotalViews = current.totalPageViews + 1;
  let newUniqueVisitors = current.uniqueVisitors;
  if (!sessionStorage.getItem('career_portal_visited_session')) {
    sessionStorage.setItem('career_portal_visited_session', 'true');
    newUniqueVisitors += 1;
  }

  const updated: SiteAnalytics = {
    totalPageViews: newTotalViews,
    uniqueVisitors: newUniqueVisitors,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updated));
  window.dispatchEvent(new Event('career_portal_store_updated'));

  if (supabase) {
    supabase.from('analytics').upsert({ id: 1, total_page_views: newTotalViews, unique_visitors: newUniqueVisitors }).then();
  }

  return updated;
}

export function incrementRoleApplyCount(roleId: string): void {
  const roles = getRoles();
  const updated = roles.map((r) => {
    if (r.id === roleId) {
      const newCount = r.applyCount + 1;
      if (supabase) {
        supabase.from('roles').update({ apply_count: newCount }).eq('id', roleId).then();
      }
      return { ...r, applyCount: newCount };
    }
    return r;
  });
  saveRoles(updated);
}

// --- ADMIN AUTH SESSION STORAGE ---

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  if (typeof window === 'undefined') return;
  if (auth) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
  window.dispatchEvent(new Event('career_portal_store_updated'));
}
