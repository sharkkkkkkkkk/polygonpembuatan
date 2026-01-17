-- Add new columns to users table
alter table users 
add column if not exists name text,
add column if not exists whatsapp text;

-- Update seed admin if needed (optional)
update users 
set name = 'Super Admin', whatsapp = '628123456789' 
where email = 'admin@landscaler.com';
