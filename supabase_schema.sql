-- ============================================================================
-- SAGARINFO - Supabase PostgreSQL Database Schema & Security Policies
-- ============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  tagline TEXT DEFAULT 'Everything about me. One place.',
  bio TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  education TEXT,
  current_status TEXT,
  career_goal TEXT,
  interests TEXT[],
  avatar_url TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  website TEXT,
  is_public_profile BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Documents Table (Private Document Vault)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('identity', 'education', 'career', 'financial', 'other')),
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  preview_url TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  verification_url TEXT,
  file_url TEXT,
  image_url TEXT,
  skills TEXT[],
  description TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  category TEXT NOT NULL,
  technologies TEXT[],
  github_url TEXT,
  live_url TEXT,
  demo_video_url TEXT,
  presentation_url TEXT,
  documentation_url TEXT,
  screenshots TEXT[],
  status TEXT DEFAULT 'Completed',
  start_date DATE,
  end_date DATE,
  team_members TEXT[],
  hackathon_name TEXT,
  achievement TEXT,
  problem_statement TEXT,
  solution TEXT,
  features TEXT[],
  architecture_overview TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Presentations Table
CREATE TABLE IF NOT EXISTS public.presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  related_project_name TEXT,
  event_or_hackathon TEXT,
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  file_format TEXT DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  file_size TEXT,
  slide_count INT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  date DATE,
  description TEXT,
  event TEXT,
  rank_or_result TEXT,
  certificate_url TEXT,
  proof_document_url TEXT,
  related_project_name TEXT,
  link TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  degree TEXT NOT NULL,
  level TEXT CHECK (level IN ('School', 'Intermediate', 'B.Tech', 'Other')),
  institution TEXT NOT NULL,
  board_or_university TEXT,
  start_year TEXT,
  end_year TEXT,
  score TEXT,
  status TEXT DEFAULT 'Completed',
  field_of_study TEXT,
  location TEXT,
  highlights TEXT[],
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Applied Hackathons Table
CREATE TABLE IF NOT EXISTS public.applied_hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  application_date DATE,
  project_submitted TEXT,
  status TEXT DEFAULT 'Under Review',
  prize_pool TEXT,
  submission_url TEXT,
  proof_url TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Applied Scholarships Table
CREATE TABLE IF NOT EXISTS public.applied_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  application_date DATE,
  amount TEXT,
  status TEXT DEFAULT 'Under Review',
  eligibility TEXT,
  submitted_document TEXT,
  proof_url TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INT CHECK (proficiency BETWEEN 1 AND 100),
  years_of_experience TEXT,
  related_projects_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Important Links Table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Professional',
  description TEXT,
  icon_name TEXT DEFAULT 'Link',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  target_name TEXT NOT NULL,
  target_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Owner Full Control Policy
CREATE POLICY "Owner access all profile data" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Owner access all documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all certificates" ON public.certificates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all presentations" ON public.presentations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all education" ON public.education FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all skills" ON public.skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all links" ON public.links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access all activity logs" ON public.activity_logs FOR ALL USING (auth.uid() = user_id);

-- Public Selective Read Access Policies (For Public Developer Portfolio /public)
CREATE POLICY "Public profile read" ON public.profiles FOR SELECT USING (is_public_profile = TRUE);
CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Public certificates read" ON public.certificates FOR SELECT USING (TRUE);
CREATE POLICY "Public achievements read" ON public.achievements FOR SELECT USING (TRUE);
CREATE POLICY "Public education read" ON public.education FOR SELECT USING (TRUE);
CREATE POLICY "Public skills read" ON public.skills FOR SELECT USING (TRUE);
