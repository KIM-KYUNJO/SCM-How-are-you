-- STEP 3: additive raw ingestion provenance, policy configuration, and forecast boundaries.
create schema if not exists raw;
create schema if not exists analytics;

create table if not exists raw.usage_history (
  id bigint generated always as identity primary key,
  item_id text not null,
  usage_date date not null,
  actual_quantity numeric,
  batch_id uuid,
  source_type text not null default 'UNKNOWN',
  loaded_at timestamptz not null default now(),
  source_record_id text
);

alter table raw.usage_history add column if not exists batch_id uuid;
alter table raw.usage_history add column if not exists source_type text not null default 'UNKNOWN';
alter table raw.usage_history add column if not exists loaded_at timestamptz not null default now();
alter table raw.usage_history add column if not exists source_record_id text;

create table if not exists raw.business_event (
  id bigint generated always as identity primary key,
  event_type text not null,
  event_date date not null,
  item_id text,
  quantity numeric,
  metadata jsonb,
  batch_id uuid,
  source_type text not null default 'UNKNOWN',
  loaded_at timestamptz not null default now(),
  source_record_id text
);

create table if not exists raw.sales_order (
  id bigint generated always as identity primary key,
  order_number text not null,
  order_date date not null,
  item_id text not null,
  quantity numeric,
  customer_id text,
  status text,
  batch_id uuid,
  source_type text not null default 'UNKNOWN',
  loaded_at timestamptz not null default now(),
  source_record_id text
);

create table if not exists raw.item_substitute (
  id bigint generated always as identity primary key,
  item_id text not null,
  substitute_item_id text not null,
  priority integer,
  valid_from date,
  valid_to date,
  batch_id uuid,
  source_type text not null default 'UNKNOWN',
  loaded_at timestamptz not null default now(),
  source_record_id text
);

create table if not exists core.policy_config (
  policy_key text primary key,
  service_level numeric,
  review_period_days integer,
  safety_buffer_days integer,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists core.outlier_rule (
  rule_id bigint generated always as identity primary key,
  rule_name text not null unique,
  rule_type text not null check (rule_type in ('PROJECT_DEMAND', 'RETURN', 'DUPLICATE', 'EXCLUDE_FROM_TRAINING')),
  enabled boolean not null default true,
  criteria jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists core.item_policy (
  item_id text primary key,
  moq numeric,
  pack_size numeric,
  item_grade text,
  service_level numeric,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists core.forecast_setting (
  setting_id integer primary key default 1 check (setting_id = 1),
  train_start date,
  train_end date,
  test_start date,
  test_end date,
  granularity text not null default 'MONTH' check (granularity in ('DAY', 'WEEK', 'MONTH')),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  constraint forecast_windows_ordered check (
    (train_start is null or train_end is null or train_start <= train_end)
    and (test_start is null or test_end is null or test_start <= test_end)
    and (train_end is null or test_start is null or train_end < test_start)
  )
);

insert into core.forecast_setting(setting_id) values (1) on conflict (setting_id) do nothing;

create or replace view core.v_train_demand as
select u.id, u.item_id, u.usage_date, u.actual_quantity, u.batch_id, u.source_type, u.loaded_at, u.source_record_id
from raw.usage_history u
cross join core.forecast_setting s
where s.setting_id = 1
  and s.train_start is not null and s.train_end is not null
  and u.usage_date between s.train_start and s.train_end;

create or replace view core.v_test_actual as
select u.id, u.item_id, u.usage_date, u.actual_quantity, u.batch_id, u.source_type, u.loaded_at, u.source_record_id
from raw.usage_history u
cross join core.forecast_setting s
where s.setting_id = 1
  and s.test_start is not null and s.test_end is not null
  and u.usage_date between s.test_start and s.test_end;

create or replace view analytics.v_data_coverage as
with bounds as (select min(usage_date) as data_start, max(usage_date) as data_end from raw.usage_history),
settings as (select * from core.forecast_setting where setting_id = 1)
select b.data_start, b.data_end, s.train_start, s.train_end, s.test_start, s.test_end,
  (select count(*) from core.v_train_demand) as train_row_count,
  (select count(*) from core.v_test_actual) as test_row_count,
  (b.data_start is not null and s.train_start is not null and s.train_end is not null and b.data_start <= s.train_start and b.data_end >= s.train_end) as train_window_ok,
  (b.data_start is not null and s.test_start is not null and s.test_end is not null and b.data_start <= s.test_start and b.data_end >= s.test_end) as test_window_ok
from bounds b cross join settings s;

create or replace view analytics.v_forecast_settings as
select s.setting_id, s.train_start, s.train_end, s.test_start, s.test_end, s.granularity,
  c.data_start, c.data_end, c.train_row_count, c.test_row_count, c.train_window_ok, c.test_window_ok,
  (s.train_start is not null and s.train_end is not null and s.test_start is not null and s.test_end is not null) as isolation_configured
from core.forecast_setting s cross join analytics.v_data_coverage c;

alter table core.policy_config enable row level security;
alter table core.outlier_rule enable row level security;
alter table core.item_policy enable row level security;
alter table core.forecast_setting enable row level security;
drop policy if exists policy_config_authenticated_select on core.policy_config;
create policy policy_config_authenticated_select on core.policy_config for select to authenticated using (auth.uid() is not null);
drop policy if exists policy_config_admin_write on core.policy_config;
create policy policy_config_admin_write on core.policy_config for all to authenticated using (core.is_admin()) with check (core.is_admin());
drop policy if exists outlier_rule_authenticated_select on core.outlier_rule;
create policy outlier_rule_authenticated_select on core.outlier_rule for select to authenticated using (auth.uid() is not null);
drop policy if exists outlier_rule_admin_write on core.outlier_rule;
create policy outlier_rule_admin_write on core.outlier_rule for all to authenticated using (core.is_admin()) with check (core.is_admin());
drop policy if exists item_policy_authenticated_select on core.item_policy;
create policy item_policy_authenticated_select on core.item_policy for select to authenticated using (auth.uid() is not null);
drop policy if exists item_policy_admin_write on core.item_policy;
create policy item_policy_admin_write on core.item_policy for all to authenticated using (core.is_admin()) with check (core.is_admin());
drop policy if exists forecast_setting_authenticated_select on core.forecast_setting;
create policy forecast_setting_authenticated_select on core.forecast_setting for select to authenticated using (auth.uid() is not null);
drop policy if exists forecast_setting_admin_write on core.forecast_setting;
create policy forecast_setting_admin_write on core.forecast_setting for all to authenticated using (core.is_admin()) with check (core.is_admin());

do $$ declare t text; begin foreach t in array array['usage_history', 'business_event', 'sales_order', 'item_substitute'] loop execute format('alter table raw.%I enable row level security', t); execute format('revoke all on raw.%I from anon, public', t); execute format('grant select on raw.%I to authenticated', t); execute format('drop policy if exists raw_%I_authenticated_select on raw.%I', t, t); execute format('create policy raw_%I_authenticated_select on raw.%I for select to authenticated using (auth.uid() is not null)', t, t); end loop; end $$;

revoke all on core.policy_config, core.outlier_rule, core.item_policy, core.forecast_setting from anon, public;
grant select, insert, update, delete on core.policy_config, core.outlier_rule, core.item_policy, core.forecast_setting to authenticated;
grant select on core.v_train_demand, core.v_test_actual to authenticated;
revoke all on analytics.v_data_coverage, analytics.v_forecast_settings from anon, public;
grant select on analytics.v_data_coverage, analytics.v_forecast_settings to authenticated;
