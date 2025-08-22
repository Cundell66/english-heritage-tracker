-- Reset all user accounts and visit data
-- WARNING: This will permanently delete ALL user accounts and visit data

-- First, delete all visit records (due to foreign key constraints)
DELETE FROM visits;

-- Then delete all user accounts from Supabase auth
-- Note: This requires admin privileges and may need to be run in Supabase SQL editor
DELETE FROM auth.users;

-- Reset any sequences if needed
-- ALTER SEQUENCE IF EXISTS visits_id_seq RESTART WITH 1;

-- Verify cleanup
SELECT COUNT(*) as remaining_visits FROM visits;
SELECT COUNT(*) as remaining_users FROM auth.users;
