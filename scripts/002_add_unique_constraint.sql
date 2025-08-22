-- Add unique constraint for property_id and user_id combination
-- This allows the UPSERT operation to work properly
ALTER TABLE visits 
ADD CONSTRAINT visits_property_user_unique 
UNIQUE (property_id, user_id);
