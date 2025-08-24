-- Adding proper RLS policies for user_achievements table
-- Enable RLS on user_achievements table
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON user_achievements;

-- Allow users to view their own achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own achievements
CREATE POLICY "Users can insert their own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own achievements (for progress tracking)
CREATE POLICY "Users can update their own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

-- Also ensure user_profiles table has proper RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Allow users to manage their own profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
