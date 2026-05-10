# Mega Drive Fitness Quest

A single-page React fitness tracker with a 16-bit Sega Mega Drive inspired CRT interface, Supabase Auth, Supabase persistence, and Vercel deployment instructions.

The live app is locked to `jrbrimble@aol.com`. The password should be created in Supabase Auth only and must not be committed to GitHub.

## What You Are Building

- React single-page app using Vite.
- Tailwind CSS for the neon pixel interface.
- Supabase Auth for login.
- Supabase table named `daily_activity` for saved daily entries.
- Vercel deployment connected to a GitHub repository.
- Daily goals: `20,000` steps and fewer than `2,000` calories.
- Distance formula: `(steps * 0.78 metres) / 1000`.
- Deadline countdown to `20 June 2026`.

## 1. Install And Run Locally

Open PowerShell in this folder:

```powershell
cd "C:\Users\jrbri\Desktop\Fitness Tracker"
```

Install the project dependencies. On this Windows machine, use `npm.cmd` because PowerShell may block the `npm.ps1` shim.

```powershell
npm.cmd install
```

If npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, run the install once with Node's system certificate store enabled:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm.cmd install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env
```

Keep `.env` private. It is already ignored by Git.

Start the dev server:

```powershell
npm.cmd run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173/
```

Open that URL in your browser.

## 2. Create The Supabase Project

1. Go to [Supabase](https://supabase.com/).
2. Create a new project.
3. Wait for the project to finish provisioning.
4. In Supabase, open `Project Settings`.
5. Open `API`.
6. Copy the `Project URL`.
7. Copy the `anon public` key.
8. Paste them into your local `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
VITE_ALLOWED_EMAIL=jrbrimble@aol.com
```

Restart the dev server after editing `.env`.

## 3. Configure Supabase Auth

1. In Supabase, open `Authentication`.
2. Open `Users`.
3. Click `Add user`.
4. Enter `jrbrimble@aol.com`.
5. Set the password you want to use for the tracker.
6. Confirm the user.

The app also checks the email on the client, but the real lock is in Supabase Row Level Security.

## 4. Create The `daily_activity` Table

1. In Supabase, open `SQL Editor`.
2. Create a new query.
3. Open [supabase/schema.sql](./supabase/schema.sql).
4. Copy the full SQL into Supabase.
5. Click `Run`.

That SQL creates:

- `daily_activity`
- date, steps, calories, user id, created time, updated time
- one row per user per date
- RLS policies locked to `jrbrimble@aol.com`

## 5. Test The App Locally

1. Run the dev server:

```powershell
npm.cmd run dev
```

2. Open the local Vite URL.
3. Log in with `jrbrimble@aol.com`.
4. Add a test day with steps and calories.
5. Check Supabase `Table Editor` to confirm the row appeared in `daily_activity`.

## 6. Set Up GitHub

Create a new Git repository from this folder:

```powershell
git init
git add .
git commit -m "Build Mega Drive fitness tracker"
```

Create an empty repository on [GitHub](https://github.com/new), then connect and push it. Replace `YOUR_USERNAME` and `YOUR_REPO_NAME`:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Before pushing, check that `.env` is not staged:

```powershell
git status
```

You should see `.env` ignored or absent from the staged files.

## 7. Deploy To Vercel

1. Go to [Vercel](https://vercel.com/).
2. Click `Add New`.
3. Click `Project`.
4. Import your GitHub repository.
5. Vercel should detect Vite automatically.
6. Build command should be:

```text
npm run build
```

7. Output directory should be:

```text
dist
```

## 8. Add Environment Variables In Vercel

In the Vercel project setup screen:

1. Open `Environment Variables`.
2. Add:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
VITE_ALLOWED_EMAIL=jrbrimble@aol.com
```

3. Click `Deploy`.

If you add or change environment variables after deployment:

1. Open the Vercel project.
2. Go to `Settings`.
3. Go to `Environment Variables`.
4. Save the variables.
5. Go to `Deployments`.
6. Redeploy the latest deployment.

## 9. Production Check

After Vercel finishes:

1. Open the Vercel URL.
2. Log in with the allowed email.
3. Save a daily activity entry.
4. Confirm the row appears in Supabase.
5. Try any other email. It should be denied.

## Beginner Checklist

- [ ] Run `npm.cmd install`.
- [ ] Copy `.env.example` to `.env`.
- [ ] Create a Supabase project.
- [ ] Paste Supabase URL and anon key into `.env`.
- [ ] Add `jrbrimble@aol.com` as the Supabase Auth user.
- [ ] Run `supabase/schema.sql` in Supabase SQL Editor.
- [ ] Start locally with `npm.cmd run dev`.
- [ ] Test login and daily tracking.
- [ ] Create a GitHub repository.
- [ ] Push this folder to GitHub.
- [ ] Import the GitHub repository into Vercel.
- [ ] Add the same three environment variables in Vercel.
- [ ] Deploy and test the Vercel URL.
