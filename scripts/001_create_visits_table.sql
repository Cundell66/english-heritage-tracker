-- Create visits table to track English Heritage property visits
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  county TEXT NOT NULL,
  property_type TEXT NOT NULL,
  visited_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "visits_select_own" ON public.visits 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "visits_insert_own" ON public.visits 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "visits_update_own" ON public.visits 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "visits_delete_own" ON public.visits 
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS visits_user_id_idx ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS visits_property_id_idx ON public.visits(property_id);
