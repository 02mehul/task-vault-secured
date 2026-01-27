-- Check if table exists
SELECT to_regclass('public.tasks');

-- Check permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'tasks';
