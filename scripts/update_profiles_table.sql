-- Add avatar_type column to profiles table for historical avatar selection
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_type TEXT DEFAULT 'king';

-- Update existing profiles to have default avatar
UPDATE profiles SET avatar_type = 'king' WHERE avatar_type IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN profiles.avatar_type IS 'Historical themed avatar selection: king, queen, knight, lady, neanderthal, roman, viking';
