-- Add role column to profiles table for admin access control
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add status column to contact_submissions table for tracking responses
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS response_notes TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Update RLS policy for contact submissions to allow admins to read all
CREATE POLICY "contact_admin_select_all" ON public.contact_submissions FOR SELECT 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
