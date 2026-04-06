# NBSAP Monitoring System v2.0
## Rwanda National Biodiversity Strategy & Action Plan 2025–2030
### Full-Stack React + Supabase Production System

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    NBSAP Frontend (React + Vite)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Auth    │  │Dashboard │  │Reporting │  │  Admin   │    │
│  │  Layer   │  │  Pages   │  │ Toolkit  │  │  Panel   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └──────────────┴──────────────┴──────────────┘         │
│                    Service Layer                              │
│  reports · indicators · districts · audit · notifications    │
└───────────────────────────┬─────────────────────────────────┘
                             │ Supabase JS Client
┌───────────────────────────▼─────────────────────────────────┐
│                      Supabase Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Auth        │  │  PostgreSQL  │  │  Storage         │   │
│  │  (PKCE)      │  │  + RLS       │  │  (attachments)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────┐  ┌──────────────────────────────────────┐  │
│  │  Realtime    │  │  Row-Level Security (22 policies)    │  │
│  │ Subscriptions│  │  4 roles · 10 tables · PKCE auth     │  │
│  └──────────────┘  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
nbsap-supabase/
├── src/
│   ├── lib/
│   │   └── supabase.ts              # Supabase client (type-safe)
│   ├── types/
│   │   └── database.ts              # All TS types + RBAC permissions
│   ├── hooks/
│   │   ├── useAuth.tsx              # Auth context + hook
│   │   └── useData.ts               # useReports, useIndicators, etc.
│   ├── services/
│   │   ├── reports.service.ts       # CRUD + file upload + realtime
│   │   └── index.ts                 # indicators, districts, audit, etc.
│   ├── components/
│   │   ├── auth/
│   │   │   └── index.tsx            # LoginPage, ProtectedRoute, RoleGuard
│   │   └── layout/
│   │       └── DashboardShell.tsx   # Sidebar + topbar + notifications
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Indicators.tsx           # 22 indicators table
│   │   ├── ReportingToolkit.tsx     # T01-T07 forms
│   │   ├── VerifQueue.tsx           # Approve/reject submissions
│   │   ├── AdminPanel.tsx           # User management + audit
│   │   └── ...                      # All other pages
│   └── App.tsx                      # Root + routing
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Full DB schema
├── .env.example                     # Environment variables template
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## Role-Based Access Control

| Feature               | Admin | Sector Officer | District Officer | Viewer |
|-----------------------|-------|---------------|-----------------|--------|
| View dashboard        | ✅    | ✅            | ✅              | ✅     |
| Submit reports (T01–T07) | ✅ | ✅            | ✅              | ❌     |
| Approve/reject submissions | ✅ | ✅          | ❌              | ❌     |
| View all reports      | ✅    | ✅            | Own only        | Approved only |
| Export raw data       | ✅    | ✅            | ✅              | ❌     |
| Manage users          | ✅    | ❌            | ❌              | ❌     |
| View audit log        | ✅    | ❌            | ❌              | ❌     |
| Modify indicators     | ✅    | ❌            | ❌              | ❌     |
| Admin panel           | ✅    | ❌            | ❌              | ❌     |

---

## Database Schema

### Tables
- **profiles** — extends `auth.users`, stores role, org, district
- **provinces** — 5 provinces (Kigali, North, South, East, West)
- **districts** — 30 districts with compliance scores
- **indicators** — 22 NBSAP indicators with progress data
- **reports** — T01–T07 toolkit submissions (all fields in one table)
- **risks** — 12-item risk register
- **audit_logs** — every action tracked
- **notifications** — per-user notification feed
- **user_preferences** — settings stored per user (replaces localStorage)
- **report_attachments** — file metadata linking to Supabase Storage

### RLS Policies (22 total)
- Row-level security enforced on all 10 tables
- `get_my_role()` helper function for clean policy expressions
- Admins bypass most restrictions
- District officers see only their district's data
- Viewers see only approved reports

---

## Setup & Deployment

### 1. Create Supabase Project
```bash
# Go to https://app.supabase.com
# Create new project, note the URL and anon key
```

### 2. Run Database Migration
```bash
# In Supabase dashboard → SQL Editor → paste contents of:
supabase/migrations/001_initial_schema.sql
# OR using Supabase CLI:
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 3. Configure Storage Buckets
```bash
# In Supabase dashboard → Storage → New bucket:
# Name: report-attachments  |  Public: NO
# Name: avatars             |  Public: YES
```

### 4. Create First Admin User
```bash
# In Supabase dashboard → Authentication → Users → Add user
# Email: admin@rema.gov.rw  Password: (strong password)
# Then in SQL Editor:
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@rema.gov.rw';
```

### 5. Local Development
```bash
git clone https://github.com/your-org/nbsap-dashboard
cd nbsap-dashboard
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

### 6. Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod

# In Vercel dashboard → Settings → Environment Variables:
# VITE_SUPABASE_URL = https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY = eyJ...
# VITE_ANTHROPIC_API_KEY = sk-ant-...
```

### 7. Configure Supabase Auth Settings
```
Supabase Dashboard → Authentication → URL Configuration:
Site URL: https://your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/auth/callback
```

--

## Key Architecture Decisions

### 1. Single Reports Table (Flat Schema)
Instead of 7 separate tables (one per tool), all T01-T07 submissions
live in one `reports` table with nullable columns per tool.
**Pros:** Simple queries, unified verification queue, easy CSV export.
**Cons:** Many nullable columns (acceptable trade-off for this use case).

### 2. Preferences in Database (Not localStorage)
All user settings (language, notifications, security) are stored in
`user_preferences` table instead of localStorage. This means:
- Settings persist across devices/browsers
- Admin can inspect/reset user settings
- No data loss when user clears browser storage

### 3. PKCE Auth Flow
Uses Proof Key for Code Exchange for enhanced security against
authorization code interception attacks. Configured via `flowType: 'pkce'`
in the Supabase client.

### 4. Real-time Subscriptions
Reports and notifications use Supabase Realtime channels for live updates.
The verification queue auto-updates when new submissions arrive.

### 5. Service Role Key Never in Client
The `SUPABASE_SERVICE_ROLE_KEY` is only used in Supabase Edge Functions
(server-side). The client only ever uses the anon key + RLS policies.

---

## Migrating from localStorage

The original dashboard stored all data in `localStorage`. The migration path:

```typescript
// OLD (localStorage):
const tkData = JSON.parse(localStorage.getItem('nbsap_toolkit_v2') || '[]')

// NEW (Supabase):
const reports = await reportsService.getAll({ status: 'approved' })

// Migrate existing data:
const oldData = JSON.parse(localStorage.getItem('nbsap_toolkit_v2') || '[]')
for (const record of oldData) {
  await reportsService.submit(mapOldRecord(record), false, userId)
}
localStorage.removeItem('nbsap_toolkit_v2')
```

---

## Security Notes

1. **Never commit `.env.local`** — it's in `.gitignore`
2. **RLS is always active** — even if a bug exposes a query, wrong-role users get empty results
3. **Species fuzzing** is now per-user in DB, not just in-memory
4. **All exports are audit-logged** — who exported what and when
5. **Session timeout** — Supabase auto-refreshes tokens; configure max session length in Auth settings

---

## Support & Maintenance

- Supabase docs: https://supabase.com/docs
- RLS guide: https://supabase.com/docs/guides/auth/row-level-security
- Vercel docs: https://vercel.com/docs
- This project: Rwanda Environment Management Authority (REMA)
