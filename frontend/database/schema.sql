-- =====================================================
-- AGENT PROPERTI — DATABASE SCHEMA
-- Database: PostgreSQL 15+
-- Generated from frontend design analysis
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For GPS coordinates

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    leader_id       UUID, -- FK set after users table
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(30) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Leader Sales', 'Sales Agent')),
    status              VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active', 'Pending', 'Blocked', 'Inactive')),
    team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
    avatar_url          TEXT,
    
    -- Profile details
    last_password_change TIMESTAMP DEFAULT NOW(),
    two_factor_enabled  BOOLEAN DEFAULT FALSE,
    session_timeout_min INTEGER DEFAULT 30,
    timezone            VARCHAR(50) DEFAULT 'Asia/Jakarta',
    language            VARCHAR(20) DEFAULT 'id',
    
    -- Performance (denormalized for quick access)
    total_sales         INTEGER DEFAULT 0,
    active_deals        INTEGER DEFAULT 0,
    
    registration_date   DATE DEFAULT CURRENT_DATE,
    last_login          TIMESTAMP,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- Set leader FK after users exists
ALTER TABLE teams ADD CONSTRAINT fk_teams_leader
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_team ON users(team_id);


-- =====================================================
-- 2. DEVELOPERS & PROJECTS
-- =====================================================

CREATE TABLE developers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    established_year    INTEGER,
    location            VARCHAR(200),
    contact_name        VARCHAR(150),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(30),
    
    -- Legal & Compliance
    tax_id              VARCHAR(50),         -- NPWP
    business_license    VARCHAR(50),         -- No. Izin Usaha
    license_expiry      DATE,
    insurance_cert      VARCHAR(50),
    insurance_expiry    DATE,
    legal_status        VARCHAR(30) DEFAULT 'Review Pending' 
                        CHECK (legal_status IN ('Verified Institutional', 'Review Pending')),
    
    -- Performance metrics
    total_units         INTEGER DEFAULT 0,
    completed_projects  INTEGER DEFAULT 0,
    on_time_delivery    DECIMAL(5,2) DEFAULT 0,  -- percentage
    quality_score       DECIMAL(5,2) DEFAULT 0,  -- percentage
    
    -- Audit
    last_audit_date     DATE,
    audit_status        VARCHAR(20) DEFAULT 'Pending' 
                        CHECK (audit_status IN ('Passed', 'Pending', 'Failed')),
    
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id        UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    name                VARCHAR(200) NOT NULL,
    
    -- Location
    address             TEXT,
    city                VARCHAR(100),
    coordinates         VARCHAR(50),         -- "6.26°S, 106.81°E"
    map_area            VARCHAR(100),
    
    -- Project Details
    description         TEXT,
    project_type        VARCHAR(50),         -- Premium High-Rise, Luxury Residential, etc.
    rera_id             VARCHAR(50),
    status              VARCHAR(20) DEFAULT 'Active' 
                        CHECK (status IN ('Active', 'Completed', 'Coming Soon')),
    start_date          DATE,
    estimated_completion DATE,
    
    -- Unit Summary (denormalized)
    total_units         INTEGER DEFAULT 0,
    sold_units          INTEGER DEFAULT 0,
    booked_units        INTEGER DEFAULT 0,
    available_units     INTEGER DEFAULT 0,
    progress_pct        DECIMAL(5,2) DEFAULT 0,
    
    -- Pricing
    price_range_min     DECIMAL(15,2),
    price_range_max     DECIMAL(15,2),
    avg_price           DECIMAL(15,2),
    dp_percent_min      DECIMAL(5,2),
    dp_percent_max      DECIMAL(5,2),
    
    -- GPS tracking
    gps_status          VARCHAR(20) DEFAULT 'ONLINE' 
                        CHECK (gps_status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE')),
    
    image_url           TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_facilities (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(50)
);

CREATE TABLE project_certificates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    expiry_date DATE
);

CREATE TABLE project_images (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    caption     VARCHAR(200),
    sort_order  INTEGER DEFAULT 0
);

-- Many-to-many: which agents are assigned to which projects
CREATE TABLE project_agents (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_projects_developer ON projects(developer_id);
CREATE INDEX idx_projects_status ON projects(status);


-- =====================================================
-- 3. UNITS / INVENTORY
-- =====================================================

CREATE TABLE unit_types (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,  -- "Studio Compact", "Penthouse Sky Suite"
    size_sqft       INTEGER,
    base_price      DECIMAL(15,2),
    dp_amount       DECIMAL(15,2),
    dp_percent      DECIMAL(5,2),
    total_count     INTEGER DEFAULT 0,
    available_count INTEGER DEFAULT 0
);

CREATE TABLE units (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_type_id    UUID REFERENCES unit_types(id) ON DELETE SET NULL,
    
    block           VARCHAR(50),
    unit_number     VARCHAR(50) NOT NULL,
    house_type      VARCHAR(100),          -- "Penthouse Sky Suite"
    floor_area      INTEGER,               -- sqft
    floor_level     INTEGER,
    bedrooms        INTEGER DEFAULT 1,
    bathrooms       INTEGER DEFAULT 1,
    facing          VARCHAR(50),
    
    -- Pricing
    price           DECIMAL(15,2) NOT NULL,
    down_payment    DECIMAL(15,2),
    dp_percent      DECIMAL(5,2),
    
    status          VARCHAR(20) DEFAULT 'Available' 
                    CHECK (status IN ('Available', 'Booked', 'Sold')),
    
    -- Booking info
    booked_by_client_id UUID,              -- FK set below
    booked_date     DATE,
    booked_by_agent UUID REFERENCES users(id),
    sold_date       DATE,
    
    -- Booking timer
    booking_expires TIMESTAMP,             -- 24-hour countdown
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_price ON units(price);


-- =====================================================
-- 4. CLIENTS / CRM
-- =====================================================

CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(30) NOT NULL,
    ktp_nik         VARCHAR(16),           -- Indonesian ID number
    address         TEXT,
    city            VARCHAR(100),
    occupation      VARCHAR(200),
    
    -- Sales Pipeline
    budget          VARCHAR(50),
    source          VARCHAR(30) CHECK (source IN ('Website', 'Referral', 'Walk-in', 'Social Media', 'Event')),
    potential        VARCHAR(10) CHECK (potential IN ('Hot', 'Warm', 'Cold')),
    status          VARCHAR(20) DEFAULT 'New Lead' 
                    CHECK (status IN ('New Lead', 'Follow-up', 'Site Visit', 'Negotiation', 'Booked', 'Closed', 'Lost')),
    
    -- Assignment
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    unit_id         UUID REFERENCES units(id) ON DELETE SET NULL,
    
    last_contact    TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Set FK from units to clients
ALTER TABLE units ADD CONSTRAINT fk_units_booked_client
    FOREIGN KEY (booked_by_client_id) REFERENCES clients(id) ON DELETE SET NULL;

CREATE TABLE client_timeline (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    action          VARCHAR(200) NOT NULL,  -- "Site Visit — Unit 402"
    action_type     VARCHAR(30),           -- "site_visit", "call", "chat", "meeting"
    proof_type      VARCHAR(20),           -- "photo", "chat_screenshot", null
    performed_by    UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follow_up_reminders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    reminder_date   DATE NOT NULL,
    reminder_time   TIME,
    title           VARCHAR(200),
    is_completed    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_agent ON clients(assigned_agent_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_potential ON clients(potential);
CREATE INDEX idx_reminders_date ON follow_up_reminders(reminder_date);


-- =====================================================
-- 5. BOOKINGS & TRANSACTIONS
-- =====================================================

CREATE TABLE unit_bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id         UUID NOT NULL REFERENCES units(id),
    client_id       UUID NOT NULL REFERENCES clients(id),
    agent_id        UUID NOT NULL REFERENCES users(id),
    
    booking_amount  DECIMAL(15,2) NOT NULL, -- Booking fee / DP
    
    -- Documents
    ktp_upload_url  TEXT,
    npwp_upload_url TEXT,
    transfer_proof_url TEXT,
    
    -- Approval workflow: Sales → Leader → Admin
    status          VARCHAR(20) DEFAULT 'Pending Agent' 
                    CHECK (status IN ('Pending Agent', 'Pending Leader', 'Pending Admin', 'Approved', 'Rejected', 'Expired')),
    
    leader_approved_by UUID REFERENCES users(id),
    leader_approved_at TIMESTAMP,
    admin_approved_by  UUID REFERENCES users(id),
    admin_approved_at  TIMESTAMP,
    rejection_reason   TEXT,
    
    expires_at      TIMESTAMP,             -- 24-hour hold
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    txn_id          VARCHAR(20) NOT NULL UNIQUE, -- "TXN-88219"
    booking_id      UUID REFERENCES unit_bookings(id),
    
    client_name     VARCHAR(150) NOT NULL,
    project_name    VARCHAR(200),
    unit_info       VARCHAR(100),
    amount          DECIMAL(15,2) NOT NULL,
    
    payment_method  VARCHAR(20) CHECK (payment_method IN ('Bank Transfer', 'Credit Card', 'Cash', 'Cheque')),
    status          VARCHAR(20) DEFAULT 'Pending' 
                    CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    
    agent_id        UUID REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMP,
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_bookings_status ON unit_bookings(status);


-- =====================================================
-- 6. COMMISSIONS & FINANCE
-- =====================================================

CREATE TABLE commission_schemes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    base_commission DECIMAL(5,2) NOT NULL,  -- percentage
    closing_bonus   VARCHAR(100),           -- "+$5,000 Flat"
    accelerator     VARCHAR(100),           -- "3% over $2M"
    referral_split  VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Link schemes to projects
CREATE TABLE scheme_projects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id   UUID NOT NULL REFERENCES commission_schemes(id) ON DELETE CASCADE,
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(scheme_id, project_id)
);

CREATE TABLE commissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id        UUID NOT NULL REFERENCES users(id),
    scheme_id       UUID REFERENCES commission_schemes(id),
    booking_id      UUID REFERENCES unit_bookings(id),
    
    project_name    VARCHAR(200),
    unit_info       VARCHAR(100),
    client_name     VARCHAR(150),
    
    amount          DECIMAL(15,2) NOT NULL,
    commission_type VARCHAR(30),           -- "Base Commission", "Closing Bonus", "Volume Tier"
    
    -- Approval: Sales claim → Leader approve → Admin pay
    status          VARCHAR(20) DEFAULT 'Pending' 
                    CHECK (status IN ('Pending', 'Approved', 'Paid', 'Rejected')),
    
    claimed_at      TIMESTAMP DEFAULT NOW(),
    leader_approved_by UUID REFERENCES users(id),
    leader_approved_at TIMESTAMP,
    admin_approved_by  UUID REFERENCES users(id),
    admin_paid_at      TIMESTAMP,
    
    period          VARCHAR(20),           -- "May 2024"
    bonus_type      VARCHAR(30),           -- "Q2 PREMIER", "VOLUME TIER"
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_agent ON commissions(agent_id);
CREATE INDEX idx_commissions_status ON commissions(status);


-- =====================================================
-- 7. ACTIVITY LOGS & PROOF OF WORK
-- =====================================================

CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    client_id       UUID REFERENCES clients(id),
    project_id      UUID REFERENCES projects(id),
    
    activity_type   VARCHAR(30) NOT NULL 
                    CHECK (activity_type IN ('Cold Calling', 'Chat Follow-up', 'Meeting', 'Site Visit', 'Negotiation', 'Booking', 'Document Upload', 'Commission Claim')),
    
    description     TEXT,
    target          VARCHAR(200),          -- "Lead #8841", "Unit 402"
    
    -- GPS Verification
    is_gps_verified BOOLEAN DEFAULT FALSE,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    gps_accuracy    DECIMAL(6,2),          -- meters
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proof_of_work (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
    
    proof_type      VARCHAR(20) NOT NULL 
                    CHECK (proof_type IN ('photo', 'chat_screenshot', 'call_log', 'document', 'gps_checkin')),
    
    file_url        TEXT NOT NULL,
    file_name       VARCHAR(200),
    file_size       VARCHAR(20),
    caption         VARCHAR(200),
    
    -- Geotagging (auto-captured from device)
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    captured_at     TIMESTAMP NOT NULL DEFAULT NOW(),  -- Locked timestamp
    
    -- Validation
    is_from_camera  BOOLEAN DEFAULT FALSE, -- TRUE = taken live, not from gallery
    device_info     VARCHAR(200),
    
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_date ON activity_logs(created_at);
CREATE INDEX idx_proof_activity ON proof_of_work(activity_log_id);


-- =====================================================
-- 8. SITE VISITS
-- =====================================================

CREATE TABLE site_visits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id        UUID NOT NULL REFERENCES users(id),
    client_id       UUID NOT NULL REFERENCES clients(id),
    project_id      UUID NOT NULL REFERENCES projects(id),
    unit_info       VARCHAR(100),
    
    visit_date      DATE NOT NULL,
    visit_time      TIME NOT NULL,
    
    status          VARCHAR(20) DEFAULT 'Scheduled' 
                    CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No Show')),
    
    -- Agent feedback after visit
    feedback        TEXT,
    
    -- GPS check-in
    checkin_lat     DECIMAL(10,8),
    checkin_lng     DECIMAL(11,8),
    checkin_time    TIMESTAMP,
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visits_agent ON site_visits(agent_id);
CREATE INDEX idx_visits_date ON site_visits(visit_date);
CREATE INDEX idx_visits_status ON site_visits(status);


-- =====================================================
-- 9. KPI & PERFORMANCE TRACKING
-- =====================================================

CREATE TABLE kpi_targets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    period_month    INTEGER NOT NULL,      -- 1-12
    period_year     INTEGER NOT NULL,
    
    -- Targets
    target_revenue  DECIMAL(15,2) DEFAULT 0,
    target_leads    INTEGER DEFAULT 0,
    target_closings INTEGER DEFAULT 0,
    
    -- Actuals (updated periodically)
    actual_revenue  DECIMAL(15,2) DEFAULT 0,
    actual_leads    INTEGER DEFAULT 0,
    actual_follow_ups INTEGER DEFAULT 0,
    actual_site_visits INTEGER DEFAULT 0,
    actual_closings INTEGER DEFAULT 0,
    actual_lost     INTEGER DEFAULT 0,
    
    -- Calculated metrics
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_deal_size   DECIMAL(15,2) DEFAULT 0,
    avg_response_time VARCHAR(20),         -- "1.2 jam"
    client_satisfaction DECIMAL(5,2) DEFAULT 0,
    
    commission_earned DECIMAL(15,2) DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, period_month, period_year)
);

CREATE INDEX idx_kpi_user_period ON kpi_targets(user_id, period_year, period_month);


-- =====================================================
-- 10. DIGITAL ASSETS
-- =====================================================

CREATE TABLE digital_assets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    name            VARCHAR(200) NOT NULL,
    file_type       VARCHAR(20) CHECK (file_type IN ('pdf', 'excel', 'image', 'video', 'other')),
    file_size       VARCHAR(20),
    file_url        TEXT,
    description     TEXT,
    
    uploaded_by     UUID REFERENCES users(id),
    upload_date     DATE DEFAULT CURRENT_DATE,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);


-- =====================================================
-- 11. SYSTEM AUDIT LOG
-- =====================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    user_name       VARCHAR(150),
    user_role       VARCHAR(50),
    
    action          VARCHAR(100) NOT NULL,  -- "Updated Price", "Booked Unit", "Failed Login"
    entity_type     VARCHAR(50),           -- "unit", "project", "user", "transaction"
    entity_id       UUID,
    entity_name     VARCHAR(200),
    
    details         TEXT,                  -- "+$12,500 adjustment"
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    
    severity        VARCHAR(10) DEFAULT 'info' 
                    CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);


-- =====================================================
-- 12. SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key     VARCHAR(100) NOT NULL UNIQUE,
    setting_value   TEXT,
    setting_type    VARCHAR(20),           -- "string", "boolean", "number", "json"
    description     TEXT,
    updated_by      UUID REFERENCES users(id),
    updated_at      TIMESTAMP DEFAULT NOW()
);


-- =====================================================
-- VIEWS (Denormalized for Dashboard Queries)
-- =====================================================

-- Team performance summary
CREATE VIEW v_team_performance AS
SELECT
    t.id AS team_id,
    t.name AS team_name,
    COUNT(DISTINCT u.id) AS agent_count,
    SUM(k.actual_revenue) AS total_revenue,
    SUM(k.target_revenue) AS total_target,
    SUM(k.actual_closings) AS total_closings,
    SUM(k.actual_leads) AS total_leads,
    CASE WHEN SUM(k.target_revenue) > 0 
         THEN ROUND(SUM(k.actual_revenue) / SUM(k.target_revenue) * 100, 1)
         ELSE 0 END AS achievement_pct
FROM teams t
JOIN users u ON u.team_id = t.id AND u.status = 'Active'
LEFT JOIN kpi_targets k ON k.user_id = u.id
    AND k.period_month = EXTRACT(MONTH FROM NOW())
    AND k.period_year = EXTRACT(YEAR FROM NOW())
GROUP BY t.id, t.name;

-- Agent leaderboard
CREATE VIEW v_agent_leaderboard AS
SELECT
    u.id,
    u.name,
    u.role,
    t.name AS team_name,
    k.actual_revenue,
    k.target_revenue,
    k.actual_closings,
    k.actual_leads,
    k.conversion_rate,
    k.commission_earned,
    RANK() OVER (ORDER BY k.actual_revenue DESC) AS rank_position
FROM users u
JOIN teams t ON u.team_id = t.id
LEFT JOIN kpi_targets k ON k.user_id = u.id
    AND k.period_month = EXTRACT(MONTH FROM NOW())
    AND k.period_year = EXTRACT(YEAR FROM NOW())
WHERE u.role = 'Sales Agent' AND u.status = 'Active'
ORDER BY k.actual_revenue DESC NULLS LAST;

-- Sales funnel per team
CREATE VIEW v_sales_funnel AS
SELECT
    t.id AS team_id,
    t.name AS team_name,
    COUNT(CASE WHEN c.status = 'New Lead' THEN 1 END) AS new_leads,
    COUNT(CASE WHEN c.status = 'Follow-up' THEN 1 END) AS follow_ups,
    COUNT(CASE WHEN c.status = 'Site Visit' THEN 1 END) AS site_visits,
    COUNT(CASE WHEN c.status = 'Negotiation' THEN 1 END) AS negotiations,
    COUNT(CASE WHEN c.status = 'Booked' THEN 1 END) AS booked,
    COUNT(CASE WHEN c.status = 'Closed' THEN 1 END) AS closed,
    COUNT(CASE WHEN c.status = 'Lost' THEN 1 END) AS lost
FROM teams t
JOIN users u ON u.team_id = t.id
JOIN clients c ON c.assigned_agent_id = u.id
GROUP BY t.id, t.name;

-- Inventory summary per project
CREATE VIEW v_inventory_summary AS
SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.developer_id,
    d.name AS developer_name,
    COUNT(*) AS total_units,
    COUNT(CASE WHEN u.status = 'Available' THEN 1 END) AS available,
    COUNT(CASE WHEN u.status = 'Booked' THEN 1 END) AS booked,
    COUNT(CASE WHEN u.status = 'Sold' THEN 1 END) AS sold,
    SUM(u.price) AS total_value,
    AVG(u.price) AS avg_price
FROM projects p
JOIN developers d ON p.developer_id = d.id
LEFT JOIN units u ON u.project_id = p.id
GROUP BY p.id, p.name, p.developer_id, d.name;

-- Hot leads (no contact > 48 hours)
CREATE VIEW v_hot_leads AS
SELECT
    c.id,
    c.name,
    c.potential,
    c.status,
    c.budget,
    c.last_contact,
    u.name AS agent_name,
    p.name AS project_name,
    EXTRACT(DAY FROM NOW() - c.last_contact) AS days_since_contact
FROM clients c
LEFT JOIN users u ON c.assigned_agent_id = u.id
LEFT JOIN projects p ON c.project_id = p.id
WHERE c.potential = 'Hot'
  AND c.status NOT IN ('Closed', 'Lost')
  AND c.last_contact < NOW() - INTERVAL '48 hours'
ORDER BY c.last_contact ASC;


-- =====================================================
-- SEED DATA (Initial Admin User)
-- =====================================================

INSERT INTO teams (id, name, description) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'System Admin', 'Administrators');

INSERT INTO users (id, name, email, phone, password_hash, role, status, team_id) VALUES
    ('b0000001-0000-0000-0000-000000000001', 
     'Agent Properti Admin', 
     'admin@agentproperti.id', 
     '+62 812 0000 1111',
     '$2b$12$placeholder_hash_replace_with_real_bcrypt',  -- Use bcrypt in production
     'Admin', 
     'Active',
     'a0000001-0000-0000-0000-000000000001');

-- Default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
    ('app_name', 'Agent Properti', 'string', 'Application name'),
    ('currency', 'USD', 'string', 'Default currency'),
    ('date_format', 'DD/MM/YYYY', 'string', 'Date display format'),
    ('booking_hold_hours', '24', 'number', 'Hours to hold a booked unit'),
    ('password_min_length', '8', 'number', 'Minimum password length'),
    ('session_timeout_default', '30', 'number', 'Default session timeout in minutes'),
    ('enable_2fa', 'false', 'boolean', 'Enable two-factor auth by default'),
    ('gps_required_for_site_visit', 'true', 'boolean', 'Require GPS for site visit proof'),
    ('camera_only_photos', 'true', 'boolean', 'Only allow camera photos, not gallery');


-- =====================================================
-- TRIGGERS (Auto-update timestamps)
-- =====================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_developers_updated BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_units_updated BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON unit_bookings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_transactions_updated BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_commissions_updated BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_visits_updated BEFORE UPDATE ON site_visits FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_kpi_updated BEFORE UPDATE ON kpi_targets FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Auto-update project unit counts when unit status changes
CREATE OR REPLACE FUNCTION update_project_unit_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects SET
        sold_units = (SELECT COUNT(*) FROM units WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND status = 'Sold'),
        booked_units = (SELECT COUNT(*) FROM units WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND status = 'Booked'),
        available_units = (SELECT COUNT(*) FROM units WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND status = 'Available'),
        progress_pct = ROUND(
            (SELECT COUNT(*) FROM units WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) AND status = 'Sold')::DECIMAL /
            NULLIF((SELECT COUNT(*) FROM units WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)), 0) * 100, 1
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unit_status_change
AFTER INSERT OR UPDATE OF status OR DELETE ON units
FOR EACH ROW EXECUTE FUNCTION update_project_unit_counts();


-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE users IS 'All system users: Admin, Leader Sales, Sales Agent';
COMMENT ON TABLE teams IS 'Sales teams managed by Leaders';
COMMENT ON TABLE developers IS 'Real estate developer partners';
COMMENT ON TABLE projects IS 'Housing/property development projects';
COMMENT ON TABLE units IS 'Individual property units within projects';
COMMENT ON TABLE unit_types IS 'Unit type templates with default pricing';
COMMENT ON TABLE clients IS 'Prospective buyers / leads / customers';
COMMENT ON TABLE client_timeline IS 'Chronological record of all client interactions';
COMMENT ON TABLE unit_bookings IS 'Unit booking requests with approval workflow';
COMMENT ON TABLE transactions IS 'Financial transactions (payments, fees)';
COMMENT ON TABLE commission_schemes IS 'Commission calculation rules per project type';
COMMENT ON TABLE commissions IS 'Individual commission records for agents';
COMMENT ON TABLE activity_logs IS 'Daily activity logs from sales agents';
COMMENT ON TABLE proof_of_work IS 'Evidence files: photos, screenshots, GPS check-ins';
COMMENT ON TABLE site_visits IS 'Scheduled and completed property site visits';
COMMENT ON TABLE kpi_targets IS 'Monthly KPI targets and actuals per agent';
COMMENT ON TABLE digital_assets IS 'Brochures, price lists, renderings';
COMMENT ON TABLE audit_logs IS 'System-wide audit trail for all admin actions';
COMMENT ON TABLE follow_up_reminders IS 'Calendar reminders for client follow-ups';
COMMENT ON TABLE system_settings IS 'Application configuration key-value store';

COMMENT ON COLUMN proof_of_work.is_from_camera IS 'TRUE means photo taken live from camera app, not selected from gallery. Enforced by mobile app.';
COMMENT ON COLUMN proof_of_work.latitude IS 'Auto-captured GPS latitude at time of photo. Cannot be manually edited.';
COMMENT ON COLUMN proof_of_work.captured_at IS 'Server-side timestamp locked at upload time. Cannot be backdated.';
COMMENT ON COLUMN units.booking_expires IS '24-hour countdown. Unit auto-releases if payment not received.';
COMMENT ON COLUMN unit_bookings.status IS 'Approval chain: Sales submits → Leader validates → Admin finalizes';
