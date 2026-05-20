-- BeeMate: Supabase Storage bucket setup
-- Jalankan di Supabase Dashboard → SQL Editor

-- 1. Buat bucket public untuk avatar & banner
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'beemate',
  'beemate',
  true,
  8388608, -- 8MB max
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Public read (siapa saja bisa lihat gambar)
create policy "Public read beemate files"
on storage.objects for select
to public
using (bucket_id = 'beemate');

-- Upload dilakukan via API route dengan service role (bypass RLS).
-- Jika ingin upload langsung dari client nanti, tambahkan policy INSERT terpisah.
