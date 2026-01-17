-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can do ALL operations
CREATE POLICY "Admins can do everything" 
ON users 
FOR ALL 
USING (
  (SELECT role FROM users WHERE id = auth.uid() OR id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claim.email', true) LIMIT 1)) = 'admin'
) 
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid() OR id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claim.email', true) LIMIT 1)) = 'admin'
);

-- Policy: Public can insert (for registration)
-- We need to allow insert if checks pass, specifically for registration
-- But usually registration happens with a service role (if using Supabase Auth) OR anon role.
-- Since we are handling auth manually in a custom Users table:
CREATE POLICY "Anon can register" 
ON users 
FOR INSERT 
WITH CHECK (true);

-- Policy: Users can view their own data
CREATE POLICY "Users can view own data" 
ON users 
FOR SELECT 
USING (
  id = auth.uid() OR id::text = current_setting('request.jwt.claim.sub', true)
);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" 
ON users 
FOR UPDATE 
USING (
  id = auth.uid() OR id::text = current_setting('request.jwt.claim.sub', true)
);

-- Grant access to anon and authenticated roles
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
