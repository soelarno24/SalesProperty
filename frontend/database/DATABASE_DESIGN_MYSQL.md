# Agent Properti — Database MySQL Design Document

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│              APLIKASI FRONTEND (React/Vite)                 │
├──────────────┬──────────────────┬───────────────────────────┤
│  Admin Web   │  Leader Web      │  Sales Mobile App         │
│  (Desktop)   │  (Desktop/Web)   │  (Android/iOS/PWA)        │
├──────────────┴──────────────────┴───────────────────────────┤
│                      REST API / GraphQL                      │
├─────────────────────────────────────────────────────────────┤
│                   MySQL DATABASE 8.0+                      │
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
                     │project_agents│                │
                     └──────────────┘                │
                                                    │
┌──────────────┐     ┌──────────────┐         ┌──────┴────────┐
│    users     │────<│    teams     │         │  transactions  │
└──────┬───────┘     └──────────────┘         └───────────────┘
       │                                            │
       ├────<┌──────────────────┐              ┌───┴──────────┐
       │     │  activity_logs   │              │  commissions  │
       │     └──────┬───────────┘              └──────────────┘
       │            │
       │     ┌──────┴───────────┐     ┌──────────────────┐
       │     │   proof_of_work  │     │   commission_schemes│
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │     clients      │────<│  client_timeline  │
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │   site_visits    │     │ commission_schemes │
       │     └──────────────────┘     └──────────────────┘
       │
       ├────<┌──────────────────┐     ┌──────────────────┐
       │     │  follow_up_reminders│  │    kpi_targets    │
       │     └──────────────────┘     └──────────────────┘
       │
       └────<┌──────────────────┐
             │   audit_logs     │
             └──────────────────┘
```

## Relasi Tabel (Table Relationships)

### 1. Users & Teams
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `users` | `team_id` | `teams.id` | Sales Agent terhubung ke satu tim |
| `teams` | `leader_id` | `users.id` | Setiap tim memiliki satu leader |

### 2. Developers & Projects
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `projects` | `developer_id` | `developers.id` | Project milik satu developer |
| `project_agents` | `project_id` | `projects.id` | Many-to-many: agen terassign ke project |
| `project_agents` | `user_id` | `users.id` | Many-to-many: agen terassign ke project |
| `project_facilities` | `project_id` | `projects.id` | Fasilitas project |
| `project_certificates` | `project_id` | `projects.id` | Sertifikat project |
| `project_images` | `project_id` | `projects.id` | Galeri foto project |

### 3. Units & Projects
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `units` | `project_id` | `projects.id` | Unit milik satu project |
| `units` | `unit_type_id` | `unit_types.id` | Unit memiliki tipe |
| `units` | `booked_by_client_id` | `clients.id` | Unit dipesan oleh client |
| `units` | `booked_by_agent` | `users.id` | Unit dipesan oleh agen |
| `unit_types` | `project_id` | `projects.id` | Tipe unit milik project |

### 4. Clients & Users
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `clients` | `assigned_agent_id` | `users.id` | Client ditugaskan ke agen |
| `clients` | `project_id` | `projects.id` | Client tertarik pada project |
| `clients` | `unit_id` | `units.id` | Client membeli unit |
| `client_timeline` | `client_id` | `clients.id` | Timeline client |
| `client_timeline` | `performed_by` | `users.id` | Aksi oleh agen |

### 5. Bookings & Transactions
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `unit_bookings` | `unit_id` | `units.id` | Booking untuk unit |
| `unit_bookings` | `client_id` | `clients.id` | Booking oleh client |
| `unit_bookings` | `agent_id` | `users.id` | Booking oleh agen |
| `unit_bookings` | `leader_approved_by` | `users.id` | Disetujui leader |
| `unit_bookings` | `admin_approved_by` | `users.id` | Disetujui admin |
| `transactions` | `booking_id` | `unit_bookings.id` | Transaksi pembayaran |
| `transactions` | `agent_id` | `users.id` | Transaksi agen |
| `transactions` | `approved_by` | `users.id` | Disetujui oleh |

### 6. Commissions
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `commissions` | `agent_id` | `users.id` | Komisi untuk agen |
| `commissions` | `scheme_id` | `commission_schemes.id` | Menggunakan skema |
| `commissions` | `booking_id` | `unit_bookings.id` | Komisi dari booking |
| `scheme_projects` | `scheme_id` | `commission_schemes.id` | Skema untuk project |
| `scheme_projects` | `project_id` | `projects.id` | Skema untuk project |

### 7. Activity & Proof of Work
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `activity_logs` | `user_id` | `users.id` | Aktivitas oleh agen |
| `activity_logs` | `client_id` | `clients.id` | Aktivitas terkait client |
| `activity_logs` | `project_id` | `projects.id` | Aktivitas terkait project |
| `proof_of_work` | `activity_log_id` | `activity_logs.id` | Bukti untuk aktivitas |

### 8. Site Visits & KPI
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `site_visits` | `agent_id` | `users.id` | Kunjungan oleh agen |
| `site_visits` | `client_id` | `clients.id` | Kunjungan untuk client |
| `site_visits` | `project_id` | `projects.id` | Kunjungan ke project |
| `kpi_targets` | `user_id` | `users.id` | KPI untuk agen |
| `follow_up_reminders` | `user_id` | `users.id` | Reminder oleh agen |
| `follow_up_reminders` | `client_id` | `clients.id` | Reminder untuk client |

### 9. Audit & Settings
| Tabel | Kolom FK | Referensi | Keterangan |
|-------|----------|-----------|------------|
| `audit_logs` | `user_id` | `users.id` | Audit oleh user |
| `digital_assets` | `project_id` | `projects.id` | File untuk project |
| `digital_assets` | `uploaded_by` | `users.id` | Diupload oleh user |
| `system_settings` | `updated_by` | `users.id` | Diubah oleh user |

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

### 5. Alur Site Visit
```
Sales jadwalkan kunjungan → Client konfirmasi
  → Sales check-in di lokasi (GPS capture)
  → Sales isi feedback → Status: Completed
  → Atau: No Show / Cancelled
```

## Views untuk Dashboard

| View | Keterangan |
|------|-----------|
| `v_team_performance` | Ringkasan performa tim (revenue, closings, achievement %) |
| `v_agent_leaderboard` | Peringkat agen berdasarkan penjualan |
| `v_sales_funnel` | Sales funnel per team (lead → closed) |
| `v_inventory_summary` | Ringkasan stok unit per project |
| `v_hot_leads` | Client potensial yang belum dikontak 48 jam |

## Triggers Otomatis

| Trigger | Fungsi |
|---------|--------|
| `trg_unit_status_change_*` | Update otomatis jumlah unit (sold/booked/available) di tabel projects saat unit berubah status |

## Seed Data

- Team "System Admin" dengan leader otomatis
- User Admin default dengan kredensial
- System settings default (currency, date format, booking hold, dll)

## File Schema

- `schema.sql` - PostgreSQL version (original)
- `schema_mysql.sql` - MySQL version (this file)