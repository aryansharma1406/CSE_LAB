-- This script creates the storage bucket for lab manuals
-- Note: This is a reference script. Storage buckets are created via Supabase dashboard
-- but documenting it here for completeness

-- Create storage bucket for lab manuals (requires Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('lab-manuals', 'lab-manuals', true, 52428800, ARRAY['application/pdf']);

-- Set up public read access to lab manuals
-- CREATE POLICY "lab-manuals-public-read" ON storage.objects
-- FOR SELECT USING (bucket_id = 'lab-manuals');
