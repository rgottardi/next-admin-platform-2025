-- Migration: Initial Schema Setup
-- Description: Creates core tables for the admin platform with RLS policies
-- Timestamp: 2025-02-16 21:39:00 UTC

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Profiles are viewable by authenticated users"
on profiles
for select
to authenticated
using (true);

create policy "Users can update their own profile"
on profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert their own profile"
on profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Create organizations table
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  created_by uuid references auth.users not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on organizations
alter table public.organizations enable row level security;

-- Create organization_members table
create table public.organization_members (
  organization_id uuid references organizations on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (organization_id, user_id)
);

-- Enable RLS on organization_members
alter table public.organization_members enable row level security;

-- Organization policies
create policy "Organizations are viewable by their members"
on organizations
for select
to authenticated
using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organizations.id
    and organization_members.user_id = auth.uid()
  )
);

create policy "Organizations can be created by authenticated users"
on organizations
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Organizations can be updated by owners and admins"
on organizations
for update
to authenticated
using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organizations.id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organizations.id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
);

-- Organization members policies
create policy "Organization members are viewable by organization members"
on organization_members
for select
to authenticated
using (
  exists (
    select 1 from organization_members members
    where members.organization_id = organization_members.organization_id
    and members.user_id = auth.uid()
  )
);

create policy "Organization members can be added by owners and admins"
on organization_members
for insert
to authenticated
with check (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organization_id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
);

create policy "Organization members can be updated by owners and admins"
on organization_members
for update
to authenticated
using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organization_id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organization_id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
);

create policy "Organization members can be deleted by owners and admins"
on organization_members
for delete
to authenticated
using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = organization_id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
);

-- Create audit_logs table
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  organization_id uuid references organizations,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on audit_logs
alter table public.audit_logs enable row level security;

-- Audit logs policies
create policy "Audit logs are viewable by organization owners and admins"
on audit_logs
for select
to authenticated
using (
  exists (
    select 1 from organization_members
    where organization_members.organization_id = audit_logs.organization_id
    and organization_members.user_id = auth.uid()
    and organization_members.role in ('owner', 'admin')
  )
);

create policy "Audit logs can be inserted by authenticated users"
on audit_logs
for insert
to authenticated
with check (auth.uid() = user_id);

-- Create functions for automatic timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updated_at
create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at_organizations
  before update on public.organizations
  for each row
  execute function public.handle_updated_at();

-- Create function to automatically create a profile on user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 