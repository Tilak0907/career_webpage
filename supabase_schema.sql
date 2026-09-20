-- Supabase PostgreSQL Schema for Career Opportunities Portal

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  location TEXT,
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('Full-time', 'Part-time', 'Internship', 'Remote', 'Contract')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  apply_url TEXT NOT NULL,
  description_html TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  apply_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Analytics & Visitor Tracker Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id INT PRIMARY KEY DEFAULT 1,
  total_page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Initialize Analytics row
INSERT INTO public.analytics (id, total_page_views, unique_visitors)
VALUES (1, 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active companies, roles, and analytics
CREATE POLICY "Public Read Companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public Read Roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Public Read Analytics" ON public.analytics FOR SELECT USING (true);

-- Allow admin full access
CREATE POLICY "Admin All Companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Admin All Roles" ON public.roles FOR ALL USING (true);
CREATE POLICY "Admin All Analytics" ON public.analytics FOR ALL USING (true);
