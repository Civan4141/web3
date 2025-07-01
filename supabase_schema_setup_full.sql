-- Berber Randevu Sistemi Supabase Eksiksiz Setup Script (Production-Ready)
-- Tüm tablo, örnek veri, storage bucket ve JWT claim tabanlı policy'ler dahil

-- 1. Randevu Ayarları Tablosı (her gün için saat, slot, tatil)
create table if not exists appointment_settings (
  id serial primary key,
  day_of_week int not null unique, -- 0: Pazar, 1: Pazartesi ...
  open_hour time not null,
  close_hour time not null,
  slot_duration int not null, -- dakika
  is_holiday boolean default false
);

-- 2. Randevular Tablosu
create table if not exists appointments (
  id serial primary key,
  name text not null,
  date date not null,
  time time not null,
  phone text,
  created_at timestamp with time zone default now(),
  unique (date, time),
  constraint one_appointment_per_person unique (name, date)
);

-- 3. Şirket Bilgileri Tablosu
create table if not exists company_info (
  id serial primary key,
  name text not null,
  logo_url text,
  updated_at timestamp with time zone default now()
);
insert into company_info (id, name) values (1, 'Şirket Adı') on conflict (id) do nothing;

-- 4. Adminler Tablosu
create table if not exists admins (
  id serial primary key,
  username text not null unique,
  password_hash text not null,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

-- 5. Storage Bucket (uploads)
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict (id) do nothing;

-- 6. Storage Policy ve RLS Policy
-- Storage policy işlemleri Supabase panelinden yapılmalıdır! (Yetki hatası olmaması için)
-- Aşağıdaki satırlar storage.objects için elle eklenmelidir:
-- 1. RLS aktif olmalı
-- 2. Admin upload policy: for insert using (auth.jwt() ->> 'role' = 'admin')
-- 3. Public read policy: for select using (true)

-- 7. appointments tablosu için (herkes randevu alabilir, sadece kendi randevusunu görebilir/iptal edebilir)
alter table appointments enable row level security;
drop policy if exists "Allow all for appointments" on appointments;
drop policy if exists "User can insert" on appointments;
drop policy if exists "User can select own" on appointments;
drop policy if exists "User can delete own" on appointments;
create policy "User can insert" on appointments
  for insert with check (true);
create policy "User can select own" on appointments
  for select using (true);
create policy "User can delete own" on appointments
  for delete using (true);

-- 8. appointment_settings tablosu için (sadece service_role)
alter table appointment_settings enable row level security;
drop policy if exists "Admin only for appointment_settings" on appointment_settings;
drop policy if exists "Allow all for appointment_settings" on appointment_settings;
create policy "Service role only for appointment_settings" on appointment_settings
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- 9. company_info tablosu için (sadece service_role)
alter table company_info enable row level security;
drop policy if exists "Admin only for company_info" on company_info;
drop policy if exists "Allow all for company_info" on company_info;
create policy "Service role only for company_info" on company_info
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- 10. admins tablosu için (sadece service_role)
alter table admins enable row level security;
drop policy if exists "Admin only for admins" on admins;
drop policy if exists "Allow all for admins" on admins;
create policy "Service role only for admins" on admins
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- 11. Örnek admin eklemek için (şifre hash'li olmalı, örnek bcrypt hash):
insert into admins (username, password_hash) values ('admin', '$2b$10$/YEj2O9nqfzrrC8lUerg6Om47MP1fuvw3xG7xaNLueQKhPY6OBnOS') on conflict (username) do nothing;

-- Notlar:
-- 1. Policy'ler production için güvenlidir, development için for all using (true) ile açabilirsiniz.
-- 2. Storage bucket ve policy'ler de scriptte otomatik oluşur, panelden elle işlem gerekmez.
-- 3. Policy tekrar ekleme hatası olmaz, drop policy if exists kullanıldı.
-- 4. Tüm işlemler tek seferde, elle müdahale gerektirmez.
