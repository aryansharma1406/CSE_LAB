-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create circuits table for saving user circuit designs
CREATE TABLE IF NOT EXISTS public.circuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  circuit_data JSONB NOT NULL,
  experiment_id TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiment progress table
CREATE TABLE IF NOT EXISTS public.experiment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  completed_steps JSONB DEFAULT '[]'::JSONB,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, experiment_id)
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for circuits
CREATE POLICY "circuits_select_own_or_public" ON public.circuits FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "circuits_insert_own" ON public.circuits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "circuits_update_own" ON public.circuits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "circuits_delete_own" ON public.circuits FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for experiment progress
CREATE POLICY "progress_select_own" ON public.experiment_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_insert_own" ON public.experiment_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_update_own" ON public.experiment_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "progress_delete_own" ON public.experiment_progress FOR DELETE USING (auth.uid() = user_id);

-- Contact submissions are insert-only for anonymous users
CREATE POLICY "contact_insert_all" ON public.contact_submissions FOR INSERT WITH CHECK (TRUE);
