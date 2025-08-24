-- Create storage bucket for visit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('visit-photos', 'visit-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'visit-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to view all photos
CREATE POLICY "Users can view all photos" ON storage.objects
FOR SELECT USING (bucket_id = 'visit-photos');

-- Create policy to allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'visit-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
