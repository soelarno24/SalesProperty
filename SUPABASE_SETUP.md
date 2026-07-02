# Supabase Database Setup Guide

## Overview
Schema database untuk Agent Properti yang siap pakai di Supabase (PostgreSQL).

## Struktur File

```
backend/
├── .env.local                    # Environment variables (VITE_ prefix)
├── database/
│   ├── schema_supabase.sql        # Full SQL schema untuk Supabase
│   └── migrations/               # Folder untuk migration files
│       ├── 01_users_teams.sql
│       ├── 02_developers_projects.sql
│       ├── 03_units_inventory.sql
│       ├── 04_clients_crm.sql
│       ├── 05_bookings_transactions.sql
│       ├── 06_commissions.sql
│       ├── 07_activity_proof.sql
│       ├── 08_site_visits_kpi.sql
│       └── 09_audit_settings.sql
├── src/
│   └── lib/
│       ├── supabase.ts           # Supabase client & types
│       └── api.ts                # API service layer

frontend/
├── .env                          # VITE_ environment variables
├── src/
│   └── lib/
│       └── supabase.ts           # Supabase client & types
```

## Setup Instructions

### 1. Buat Project di Supabase
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Create New Project
3. Pilih region terdekat (Singapore/Jakarta)
4. Tunggu hingga project ready (~2 menit)

### 2. Jalankan Migration
1. Buka SQL Editor di Supabase Dashboard
2. Copy & paste isi `schema_supabase.sql` ke editor
3. Klik "Run" untuk mengeksekusi schema

### 3. Environment Variables
Update file `.env` di frontend dan `.env.local` di backend dengan credentials Supabase Anda:

```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

### 4. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 5. Build untuk cPanel
```bash
# Frontend - build single file HTML
cd frontend && npm run build

# Hasil: dist/index.html (upload ke public_html)
```

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ developers  │────<│  projects   │────<│    units    │
└─────────────┘     └──────┬──────┘     └──────┬────┘
                           │                   │
                    ┌──────┴──────┐      ┌─────┴──────┐
                    │unit_bookings│      │project_imgs│
                    └──────┬──────┘      └───────────┘
                           │
                    ┌──────┴──────┐
                    │transactions │
                    └──────┬──────┘
                           │
┌─────────────┐     ┌──────┴──────┐
│    users    │────<│   clients   │
└─────────────┘     └─────────────┘
       │                   │
       ├────<┌──────────────┴─────────────┐
       │     │  activity_logs           │
       │     └──────────────┬─────────────┘
       │                    │
       │     ┌──────────────┴─────────────┐
       │     │    proof_of_work         │
       │     └───────────────────────────┘
       │
       ├────<┌─────────────unit_bookings────────────┐
       │     │  commissions  │  transactions        │
       │     └───────────────┴──────────────────────┘
       │
       └────<┌──────────────────────────┐
             │    audit_logs            │
             └──────────────────────────┘
```

## Alur Data (Data Flow)

### Sales Flow
```
Sales App (Frontend)
  → API Call (supabase-js)
    → Supabase Auth (JWT)
      → RLS Policy Check
        → Query Database
          → Return Data
```

### Leader/Admin Flow
```
Backend Dashboard
  → API Service Layer
    → Supabase Client
      → Views (v_team_performance, v_agent_leaderboard)
        → Aggregated Data
```

## Views untuk Dashboard

| View | Deskripsi |
|------|-----------|
| `v_team_performance` | Performa tim bulanan |
| `v_agent_leaderboard` | Peringkat agen |
| `v_inventory_summary` | Ringkasan stok unit |
| `v_hot_leads` | Lead panas >48 jam |

## Row Level Security (RLS)

Schema sudah menyertakan kebijakan RLS dasar. Untuk production, aktifkan dan customize:

```sql
-- Aktifkan RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
-- dll...
```

## Build Output untuk cPanel

Setelah `npm run build`:
- File `frontend/dist/index.html` berisi aplikasi lengkap
- Semua assets inline (single file)
- Upload langsung ke `public_html` di cPanel
- Pastikan `.htaccess` untuk SPA routing sudah ada

## API Endpoints (via Supabase)

Semua operasi menggunakan Supabase client:
- `supabase.from('users').select('*')` - Read
- `supabase.from('units').insert(data)` - Create
- `supabase.from('clients').update(data)` - Update
- `supabase.from('projects').delete()` - Delete
- `supabase.rpc('function_name')` - RPC calls
- `supabase.storage.from('bucket').upload()` - File storage