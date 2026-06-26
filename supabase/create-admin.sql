-- 1. Create the user first in Supabase Authentication > Users.
-- 2. Replace the email below with that exact user email.
-- 3. Run in Supabase SQL Editor.

insert into public.admins (user_id)
select id
from auth.users
where email = 'mhiriaziz13@gmail.com'
on conflict (user_id) do nothing;
