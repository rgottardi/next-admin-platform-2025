# Database Schema Documentation

## Overview

This document describes the database schema and Row Level Security (RLS) policies for the Next.js Admin Platform.

## Core Tables

### `profiles`
User profile information automatically created when a user signs up.

Fields:
- `id`: UUID (references auth.users)
- `email`: Text
- `full_name`: Text
- `avatar_url`: Text
- `updated_at`: Timestamp
- `created_at`: Timestamp

RLS Policies:
- SELECT: Viewable by all authenticated users
- UPDATE: Users can only update their own profile
- INSERT: Users can only insert their own profile

### `organizations`
Multi-tenant organization data.

Fields:
- `id`: UUID
- `name`: Text
- `slug`: Text (unique)
- `logo_url`: Text
- `created_by`: UUID (references auth.users)
- `updated_at`: Timestamp
- `created_at`: Timestamp

RLS Policies:
- SELECT: Only viewable by organization members
- INSERT: Any authenticated user can create an organization
- UPDATE: Only owners and admins can update organization details

### `organization_members`
Manages user membership and roles within organizations.

Fields:
- `organization_id`: UUID (references organizations)
- `user_id`: UUID (references auth.users)
- `role`: Text (enum: 'owner', 'admin', 'member')
- `created_at`: Timestamp

RLS Policies:
- SELECT: Viewable by all members of the same organization
- INSERT: Only owners and admins can add members
- UPDATE: Only owners and admins can update member roles
- DELETE: Only owners and admins can remove members

### `audit_logs`
Tracks important actions across the platform.

Fields:
- `id`: UUID
- `user_id`: UUID (references auth.users)
- `organization_id`: UUID (references organizations)
- `action`: Text
- `entity_type`: Text
- `entity_id`: Text
- `metadata`: JSONB
- `created_at`: Timestamp

RLS Policies:
- SELECT: Only viewable by organization owners and admins
- INSERT: Any authenticated user can create audit logs for their actions

## Automatic Functions

### `handle_updated_at()`
Trigger function to automatically update timestamps.
- Runs on: profiles, organizations

### `handle_new_user()`
Trigger function to automatically create user profiles.
- Runs when: New user is created in auth.users
- Creates: Matching profile record

## Security Design

1. All tables have RLS enabled by default
2. Policies follow least privilege principle
3. Organization access is role-based
4. Audit logs track all important changes
5. Timestamps are managed by triggers

## Usage Examples

### Creating an Organization
```sql
insert into organizations (name, slug, created_by)
values ('My Company', 'my-company', auth.uid())
returning id;
```

### Adding a Member
```sql
insert into organization_members (organization_id, user_id, role)
values ('org-id', 'user-id', 'member');
```

### Viewing Audit Logs
```sql
select * from audit_logs
where organization_id = 'org-id'
order by created_at desc;
``` 