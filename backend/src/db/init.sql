-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  fullname text not null,
  role text not null check (role in ('Super Admin', 'Administrator', 'Editor', 'Moderator', 'Viewer')),
  status text not null default 'Active' check (status in ('Active', 'Suspended')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone
);

-- 2. Blog Table
create table if not exists blog (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('Shipping', 'Logistics', 'Freight', 'Industry News')),
  excerpt text not null,
  content text not null,
  featured_image text,
  author text not null,
  author_avatar text,
  status text not null default 'Draft' check (status in ('Draft', 'Published', 'Scheduled')),
  published_at timestamp with time zone,
  reading_time text not null,
  featured boolean default false,
  seo_title text,
  seo_description text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Review Table (Modify/Ensure existing table)
-- We will add a 'status' column to the existing table if it doesn't exist
alter table review add column if not exists id uuid primary key default uuid_generate_v4();
alter table review add column if not exists status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Spam'));
alter table review alter column image_url drop not null;
alter table review add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- 4. Contact Inquiries Table
create table if not exists contact_inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved', 'Archived')),
  reply_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Website Content Table (CMS Key-Value)
create table if not exists website_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Audit Logs Table
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  username text not null,
  action text not null,
  details text,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index if not exists idx_users_username on users(username);
create index if not exists idx_blog_slug on blog(slug);
create index if not exists idx_blog_status on blog(status);
create index if not exists idx_review_status on review(status);
create index if not exists idx_contact_inquiries_status on contact_inquiries(status);
create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at desc);


CREATE TABLE public.website_content (
  key text NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT website_content_pkey PRIMARY KEY (key)
) TABLESPACE pg_default;