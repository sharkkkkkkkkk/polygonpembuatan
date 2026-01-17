-- Hapus user jika sudah ada sebelumnya agar tidak error duplicate key
DELETE FROM public.users WHERE email = 'sharfak42@gmail.com';

-- Insert Super Admin Baru
-- Password: Rokoksurya321.
INSERT INTO public.users (
    email, 
    password_hash, 
    role, 
    name, 
    whatsapp, 
    token_balance, 
    created_at
) 
VALUES (
    'sharfak42@gmail.com', 
    '$2b$10$h.XHxQ/crgtB8UAi9ub0D.TFt0hPoagJpuYJCcuxN/jONcAf4GEh6', 
    'admin', 
    'Super Admin', 
    '-', 
    999999, 
    NOW()
);
