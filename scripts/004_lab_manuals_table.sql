-- Create lab_manuals table to store PDF metadata
CREATE TABLE IF NOT EXISTS public.lab_manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id TEXT NOT NULL UNIQUE,
  experiment_name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lab manual downloads tracking
CREATE TABLE IF NOT EXISTS public.lab_manual_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  manual_id UUID NOT NULL REFERENCES public.lab_manuals(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lab_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_manual_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to lab manuals
CREATE POLICY "lab_manuals_select_all" ON public.lab_manuals FOR SELECT USING (TRUE);

-- Allow authenticated users to insert download records
CREATE POLICY "downloads_insert_authenticated" ON public.lab_manual_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "downloads_select_own" ON public.lab_manual_downloads FOR SELECT USING (auth.uid() = user_id);
