-- Add missing columns to the visits table for enhanced visit logging
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS visit_duration INTEGER DEFAULT 60, -- Default 1 hour in minutes
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS weather VARCHAR(50),
ADD COLUMN IF NOT EXISTS companions TEXT,
ADD COLUMN IF NOT EXISTS highlights TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT,
ADD COLUMN IF NOT EXISTS photos TEXT[]; -- Array of photo URLs

-- Add comment to document the new columns
COMMENT ON COLUMN visits.visit_duration IS 'Visit duration in minutes, defaults to 60 (1 hour)';
COMMENT ON COLUMN visits.rating IS 'User rating from 1-5 stars';
COMMENT ON COLUMN visits.weather IS 'Weather conditions during visit';
COMMENT ON COLUMN visits.companions IS 'Who the user visited with';
COMMENT ON COLUMN visits.highlights IS 'Best parts of the visit';
COMMENT ON COLUMN visits.recommendations IS 'User recommendations for future visitors';
COMMENT ON COLUMN visits.photos IS 'Array of photo URLs from the visit';
