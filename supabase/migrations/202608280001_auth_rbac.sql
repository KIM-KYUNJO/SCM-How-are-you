create schema if not exists core;

create table if not exists core.app_user (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  department text,
  role text not null default 'USER' check (role in ('ADMIN', 'USER')),
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists core.audit_log (
  id bigint generated always as identity primary key,
  actor uuid not null references auth.users(id),
  action text not null,
  target_type text not null,
  target_id text not null,
  before jsonb,
  after jsonb,
  at timestamptz not null default now()
);

create or replace function core.is_admin()
returns boolean language sql stable security definer set search_path = core, public
as $$ select exists (select 1 from core.app_user where user_id = auth.uid() and role = 'ADMIN' and active); $$;

create or replace function core.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = core, public
as $$ begin insert into core.app_user(user_id, email, name) values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'name', '')); return new; end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure core.handle_new_auth_user();

create or replace function core.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists app_user_set_updated_at on core.app_user;
create trigger app_user_set_updated_at before update on core.app_user for each row execute procedure core.set_updated_at();

create or replace function core.audit_app_user_change() returns trigger language plpgsql security definer set search_path = core, public
as $$ begin if old.role is distinct from new.role then insert into core.audit_log(actor, action, target_type, target_id, before, after) values (auth.uid(), 'USER_ROLE_CHANGED', 'app_user', new.user_id::text, jsonb_build_object('role', old.role), jsonb_build_object('role', new.role)); elsif old.active is distinct from new.active then insert into core.audit_log(actor, action, target_type, target_id, before, after) values (auth.uid(), case when new.active then 'USER_ACTIVATED' else 'USER_DEACTIVATED' end, 'app_user', new.user_id::text, jsonb_build_object('active', old.active), jsonb_build_object('active', new.active)); end if; return new; end; $$;
drop trigger if exists audit_app_user_change on core.app_user;
create trigger audit_app_user_change after update on core.app_user for each row when (old.role is distinct from new.role or old.active is distinct from new.active) execute procedure core.audit_app_user_change();

alter table core.app_user enable row level security;
alter table core.audit_log enable row level security;
drop policy if exists app_user_self_or_admin_select on core.app_user;
create policy app_user_self_or_admin_select on core.app_user for select to authenticated using (user_id = auth.uid() or core.is_admin());
drop policy if exists app_user_admin_update_others on core.app_user;
create policy app_user_admin_update_others on core.app_user for update to authenticated using (core.is_admin() and user_id <> auth.uid()) with check (core.is_admin() and user_id <> auth.uid());
drop policy if exists audit_log_admin_select on core.audit_log;
create policy audit_log_admin_select on core.audit_log for select to authenticated using (core.is_admin());
revoke all on core.app_user from anon;
revoke all on core.audit_log from anon;
revoke all on core.app_user from public;
revoke all on core.audit_log from public;
grant select on core.app_user to authenticated;
grant update on core.app_user to authenticated;
grant select on core.audit_log to authenticated;
