import { createClient } from '@supabase/supabase-js';
import { Company, Role, SiteAnalytics } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('YOUR_SUPABASE_PROJECT_ID')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fetch Companies from Supabase
export async function fetchCompaniesFromSupabase(): Promise<Company[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      logoUrl: c.logo_url || '',
      industry: c.industry || '',
      location: c.location || '',
      description: c.description || '',
      websiteUrl: c.website_url || '',
      createdAt: c.created_at,
    }));
  } catch {
    return null;
  }
}

// Fetch Roles from Supabase
export async function fetchRolesFromSupabase(): Promise<Role[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map((r: any) => ({
      id: r.id,
      companyId: r.company_id,
      title: r.title,
      department: r.department || '',
      location: r.location || '',
      type: r.type,
      startDate: r.start_date,
      endDate: r.end_date,
      isActive: r.is_active,
      applyUrl: r.apply_url,
      descriptionHtml: r.description_html || '',
      attachments: r.attachments || [],
      applyCount: r.apply_count || 0,
      viewCount: r.view_count || 0,
      createdAt: r.created_at,
    }));
  } catch {
    return null;
  }
}
