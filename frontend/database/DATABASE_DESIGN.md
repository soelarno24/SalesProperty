# Agent Properti — Database Design Document

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATIONS                     │
├──────────────┬──────────────────┬───────────────────────────┤
│  Admin Web   │  Leader Web      │  Sales Mobile App         │
│  (Desktop)   │  (Desktop/Web)   │  (Android/iOS/PWA)        │
├──────────────┴──────────────────┴───────────────────────────┤
│                      REST API / GraphQL                      │
├─────────────────────────────────────────────────────────────┤
│                   PostgreSQL DATABASE                         │
└─────────────────────────────────────────────────────────────┘
```

## Entity Relationship Diagram (ERD)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  developers  │────<│   projects   │────<│      units        │
└──────────────┘     └──────┬───────┘     └────────┬─────────┘
                            │                      │
                     ┌──────┴───────┐       ┌──────┴─────────┐
                     │project_certs │       │  unit_bookings  │
                     │project_facil │       └────────┬────────┘
                     │project_images│                │
                     └──────────────┘                │
                                                     │
┌──────────────┐     ┌──────────────┐         ┌──────┴────────┐
│    users     │────<│    teams     │         │  transactions  │
└──────┬───────┘     └──────────────┘         └───────────────┘
       │                                             │
       ├────<┌──────────────────┐              ┌─────┴────────┐
       │     │  activity_logs   │              │  commissions  │
       │     └──────┬───────────┘              └──────────────┘
       │            │
       │     ┌──────┴───────────┐     ┌──────────────────┐
       │     │   proof_of_work  │     │  digital_assets   │
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │     clients      │────<│  client_timeline  │
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │   site_visits    │     │ commission_schemes│
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │  follow_up_reminders│  │   audit_logs     │
       │     └──────────────────┘     └──────────────────┘
       │
       └────<┌──────────────────┐
             │   kpi_targets    │
             └──────────────────┘
```

## Alur Kerja Data (Data Workflow)

### 1. Alur Registrasi & Login
```
User Baru → Admin/Leader mendaftarkan → Status "Pending"
         → Admin/Leader approve → Status "Active"
         → User login dengan email + password
         → Sistem catat session + audit log
```

### 2. Alur Penjualan Properti
```
Developer terdaftar → Project dibuat → Unit-unit didaftarkan
  → Sales browse katalog → Temukan client (Lead)
  → Sales catat aktivitas (Cold Call / Follow-up / Site Visit)
  → Sales upload bukti kerja (foto + GPS + chat)
  → Client tertarik → Sales ajukan booking unit
  → Leader validasi booking → Admin verifikasi pembayaran
  → Unit status berubah: Available → Booked → Sold
  → Komisi dihitung → Leader approve → Admin disburse
```

### 3. Alur Komisi
```
Unit Sold → Sistem hitung komisi berdasarkan Commission Scheme
  → Sales klaim komisi → Leader approve/reject
  → Admin verifikasi → Status: Pending → Approved → Paid
  → Masuk ke Commission Wallet sales
```

### 4. Alur Monitoring & Audit
```
Setiap aksi user → Otomatis tercatat di audit_logs
Sales ambil foto → GPS + Timestamp otomatis → proof_of_work
Leader pantau → Activity Feed + Hot Lead alerts
Admin pantau → Reporting + Audit Trail
```

## Tabel & Relasi

| Tabel | Deskripsi | Relasi Utama |
|-------|-----------|-------------|
| `users` | Semua pengguna (Admin, Leader, Sales) | → teams, activity_logs, clients |
| `teams` | Grup tim sales | → users |
| `developers` | Mitra developer perumahan | → projects |
| `projects` | Proyek perumahan | → developers, units |
| `units` | Unit properti individual | → projects, unit_bookings |
| `clients` | Calon pembeli / prospek | → users (agent), client_timeline |
| `unit_bookings` | Booking unit oleh client | → units, clients, users |
| `transactions` | Transaksi pembayaran | → unit_bookings, users |
| `commissions` | Komisi penjualan | → users, commission_schemes |
| `commission_schemes` | Skema struktur komisi | → projects |
| `activity_logs` | Log aktivitas harian sales | → users, clients, proof_of_work |
| `proof_of_work` | Bukti kerja (foto, chat, GPS) | → activity_logs |
| `site_visits` | Jadwal kunjungan lokasi | → users, clients, projects |
| `follow_up_reminders` | Pengingat follow-up | → users, clients |
| `digital_assets` | File brochure, pricelist, dll | → projects |
| `audit_logs` | Log audit sistem | → users |
| `kpi_targets` | Target KPI per agent per bulan | → users |
| `project_facilities` | Fasilitas project | → projects |
| `project_certificates` | Sertifikasi project | → projects |
| `project_images` | Galeri foto project | → projects |
