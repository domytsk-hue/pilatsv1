-- Pilates en Casa · esquema de Supabase
-- Pegar todo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
--
-- Las tablas no se leen ni se escriben directo desde el navegador: el sitio solo
-- llama a las funciones de abajo, que reciben el teléfono de la alumna.

create table if not exists alumnas (
  phone       text primary key check (phone ~ '^[0-9]{8,15}$'),
  name        text,
  created_at  timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);

create table if not exists progreso (
  phone        text not null references alumnas(phone) on delete cascade,
  lesson_id    text not null check (length(lesson_id) <= 60),
  completed    boolean not null default false,
  rating       smallint check (rating between 1 and 5),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (phone, lesson_id)
);

create table if not exists vistas (
  id         bigint generated always as identity primary key,
  phone      text not null references alumnas(phone) on delete cascade,
  lesson_id  text not null,
  viewed_at  timestamptz not null default now()
);
create index if not exists vistas_phone_idx on vistas (phone, viewed_at desc);

alter table alumnas  enable row level security;
alter table progreso enable row level security;
alter table vistas   enable row level security;
-- Sin políticas: anon no accede a las tablas directamente.

create or replace function registrar_alumna(p_phone text, p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into alumnas (phone, name) values (p_phone, nullif(trim(p_name), ''))
  on conflict (phone) do update
    set last_seen = now(),
        name = coalesce(nullif(trim(excluded.name), ''), alumnas.name);
end $$;

create or replace function mi_progreso(p_phone text)
returns table (lesson_id text, completed boolean, rating smallint)
language sql security definer set search_path = public as $$
  select lesson_id, completed, rating from progreso where phone = p_phone;
$$;

create or replace function guardar_clase(p_phone text, p_lesson text, p_completed boolean, p_rating int)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into progreso (phone, lesson_id, completed, rating, completed_at)
  values (p_phone, p_lesson, coalesce(p_completed, false), p_rating,
          case when p_completed then now() end)
  on conflict (phone, lesson_id) do update set
    completed    = coalesce(p_completed, progreso.completed),
    rating       = coalesce(p_rating, progreso.rating),
    completed_at = case when p_completed is true and not progreso.completed then now()
                        when p_completed is false then null
                        else progreso.completed_at end,
    updated_at   = now();
end $$;

create or replace function registrar_vista(p_phone text, p_lesson text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into vistas (phone, lesson_id) values (p_phone, p_lesson);
  update alumnas set last_seen = now() where phone = p_phone;
end $$;

revoke all on function registrar_alumna(text, text), mi_progreso(text),
  guardar_clase(text, text, boolean, int), registrar_vista(text, text) from public;
grant execute on function registrar_alumna(text, text), mi_progreso(text),
  guardar_clase(text, text, boolean, int), registrar_vista(text, text) to anon, authenticated;

-- Vista útil para vos en el panel de Supabase (Table editor → resumen_alumnas)
create or replace view resumen_alumnas with (security_invoker = true) as
  select a.phone, a.name, a.created_at, a.last_seen,
         count(p.*) filter (where p.completed) as clases_completadas,
         round(avg(p.rating), 1) as calificacion_promedio
  from alumnas a left join progreso p on p.phone = a.phone
  group by a.phone;
revoke all on resumen_alumnas from anon, authenticated;
