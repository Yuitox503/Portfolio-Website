# Tracker setup

The private weekly tracker lives at `/tracker`. The public portfolio is still the
hand-written `public/index.html`, served unchanged at `/`.

These are the one-time manual steps. Do them in order.

## 1. Create the Supabase project

1. Go to <https://supabase.com/dashboard> → **New project**.
2. Pick a region close to you (e.g. Singapore), set a database password, create.

## 2. Disable public sign-ups

**Authentication → Sign In / Providers**:

- Turn **off** "Allow new users to sign up".
- Keep the **Email** provider enabled (it's needed for password login).

With sign-ups off, nobody can create an account, even by calling the API directly.

## 3. Create your user

**Authentication → Users → Add user → Create new user**:

- Enter your email and a strong password.
- Tick **Auto Confirm User** (no confirmation email needed).

## 4. Set the Site URL

**Authentication → URL Configuration**:

- **Site URL:** `https://ferdinandtaslim.tech`
- **Redirect URLs:** add `http://localhost:3000/**`
  (optional: also `https://*.vercel.app/**` for preview deployments)

Password login doesn't use redirects, but this keeps any auth emails pointing
at the right place.

## 5. Run the migration and seed

**SQL Editor → New query**:

1. Paste all of `supabase/migrations/20261117000000_tracker.sql` → **Run**.
2. Paste all of `supabase/migrations/20261118000000_weekly_reviews.sql` → **Run**
   (adds the weekly reviews table; run it even if you already ran step 1 earlier).
3. Open `supabase/seed.sql` and change `you@example.com` to the email from step 3.
   Paste it into a new query → **Run**. It's safe to run twice (it skips if categories exist).

Check **Table Editor**: you should see 5 tables (each marked "RLS enabled") and 6 rows in `categories`.

If you use the Supabase CLI instead: `supabase link` then `supabase db push`.

## 6. Environment variables

Get the values from **Project Settings → API Keys** (publishable key) and **Data API** (project URL).

### Local (`.env.local`)

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then:

```bash
npm install
npm run dev
```

Open <http://localhost:3000/tracker>.

### Vercel

**Vercel → your project → Settings → Environment Variables**. Add both variables
and tick **Production** and **Preview** (Development too if you use `vercel dev`).
Redeploy after adding them.

## 7. Vercel and GitHub settings after the switch

- **Vercel → Settings → Build and Deployment → Framework Preset:** set it to **Next.js**.
  The project was probably detected as "Other" while it was a static site. Leave the
  Build/Output/Install commands on their defaults.
- **GitHub → repo Settings → Pages:** set Source to **None** (or unpublish). The
  Pages workflow was deleted in this branch, so Pages would only serve a stale copy.

## 8. Check it works

- Visit `/tracker` in a private window → you should land on `/tracker/login`.
- A wrong password shows "Wrong email or password."
- Check that RLS blocks the anon key:

  ```bash
  curl "https://YOUR-REF.supabase.co/rest/v1/time_entries?select=*" -H "apikey: YOUR_PUBLISHABLE_KEY"
  ```

  This returns a permission error (the anon role has no access) or `[]`, never rows.

## Config notes

- **Timezone:** `TIMEZONE` in `lib/config.ts` (currently `Asia/Bangkok`). Weeks run
  Monday 00:00 → Sunday 23:59 in that zone. Change it in that one place.
- **Daily checks:** `DAILY_CHECKS` in `lib/config.ts`. If you add a key, also add it
  to the `check_key` check constraint in the database.
- **Categories:** add, rename, re-target, reorder or archive them in the tracker's
  **Settings** tab. Archiving hides a category but keeps its history.
- **Fixing mistakes:** the **Log** tab lets you edit, add or delete any time entry or
  count log for any week; daily rituals can be ticked for any past day on the Week tab;
  reviews can be edited or deleted any time.
- **Weekly score:** targets hit out of total. **Overall %** is the average of each
  category's progress, capped at 100% per category (so overshooting one target can't
  hide a missed one).
