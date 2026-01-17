-- Enable Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Table: Users
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  role text default 'user' check (role in ('admin', 'user')),
  token_balance int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Clean up: Drop payment_proofs if it exists (since we don't use it anymore)
drop table if exists payment_proofs;

-- Seed Admin User
-- Email: admin@landscaler.com
-- Password: admin
insert into users (email, password_hash, role, token_balance)
values (
    'admin@landscaler.com',
    crypt('admin', gen_salt('bf')), -- Uses pgcrypto to generate bcrypt hash
    'admin',
    9999
) on conflict (email) do nothing;
