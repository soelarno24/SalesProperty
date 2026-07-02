-- =====================================================
-- AGENT PROPERTI — SUPABASE DATABASE SCHEMA
-- PostgreSQL (Supabase)
-- =====================================================

-- =====================================================
-- 1. USERS & TEAMS
-- =====================================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Leader Sales', 'Sales Agent')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active', 'Pending', 'Blocked', 'Inactive')),
    team_id UUID,
    avatar_url TEXT,
    last_password_change TIMESTAMP DEFAULT NOW(),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    session_timeout_min INTEGER DEFAULT 30,
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    language VARCHAR(20) DEFAULT 'id',
    total_sales INTEGER DEFAULT 0,
    active_deals INTEGER DEFAULT 0,
    registration_date DATE DEFAULT CURRENT_DATE,
    last_login TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE teams ADD CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_team ON users(team_id);


-- =====================================================
-- 2. DEVELOPERS & PROJECTS
-- =====================================================

CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    established_year INTEGER,
    location VARCHAR(200),
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    tax_id VARCHAR(50),
    business_license VARCHAR(50),
    license_expiry DATE,
    insurance_cert VARCHAR(50),
    insurance_expiry DATE,
    legal_status VARCHAR(30) DEFAULT 'Review Pending' CHECK (legal_status IN ('Verified Institutional', 'Review Pending')),
    total_units INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    on_time_delivery DECIMAL(5,2) DEFAULT 0,
    quality_score DECIMAL(5,2) DEFAULT 0,
    last_audit_date DATE,
    audit_status VARCHAR(20) DEFAULT 'Pending' CHECK (audit_status IN ('Passed', 'Pending', 'Failed')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    coordinates VARCHAR(50),
    map_area VARCHAR(100),
    description TEXT,
    project_type VARCHAR(50),
    rera_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Coming Soon')),
    start_date DATE,
    estimated_completion DATE,
    total_units INTEGER DEFAULT 0,
    sold_units INTEGER DEFAULT 0,
    booked_units INTEGER DEFAULT 0,
    available_units INTEGER DEFAULT 0,
    progress_pct DECIMAL(5,2) DEFAULT 0,
    price_range_min DECIMAL(15,2),
    price_range_max DECIMAL(15,2),
    avg_price DECIMAL(15,2),
    dp_percent_min DECIMAL(5,2),
    dp_percent_max DECIMAL(5,2),
    gps_status VARCHAR(20) DEFAULT 'ONLINE' CHECK (gps_status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50)
);

CREATE TABLE project_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    expiry_date DATE
);

CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption VARCHAR(200),
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE project_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_projects_developer ON projects(developer_id);
CREATE INDEX idx_projects_status ON projects(status);


-- =====================================================
-- 3. UNITS / INVENTORY
-- =====================================================

CREATE TABLE unit_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    size_sqft INTEGER,
    base_price DECIMAL(15,2),
    dp_amount DECIMAL(15,2),
    dp_percent DECIMAL(5,2),
    total_count INTEGER DEFAULT 0,
    available_count INTEGER DEFAULT 0
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    unit_type_id UUID REFERENCES unit_types(id) ON DELETE SET NULL,
    block VARCHAR(50),
    unit_number VARCHAR(50) NOT NULL,
    house_type VARCHAR(100),
    floor_area INTEGER,
    floor_level INTEGER,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    facing VARCHAR(50),
    price DECIMAL(15,2) NOT NULL,
    down_payment DECIMAL(15,2),
    dp_percent DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Sold')),
    booked_by_client_id UUID,
    booked_date DATE,
    booked_by_agent UUID REFERENCES users(id),
    sold_date DATE,
    booking_expires TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE units ADD CONSTRAINT fk_units_client FOREIGN KEY (booked_by_client_id) REFERENCES clients(id) ON DELETE SET NULL;

CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_price ON units(price);


-- =====================================================
-- 4. CLIENTS / CRM
-- =====================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30) NOT NULL,
    ktp_nik VARCHAR(16),
    address TEXT,
    city VARCHAR(100),
    occupation VARCHAR(200),
    budget VARCHAR(50),
    source VARCHAR(30) CHECK (source IN ('Website', 'Referral', 'Walk-in', 'Social Media', 'Event')),
    potential VARCHAR(10) CHECK (potential IN ('Hot', 'Warm', 'Cold')),
    status VARCHAR(20) DEFAULT 'New Lead' CHECK (status IN ('New Lead', 'Follow-up', 'Site Visit', 'Negotiation', 'Booked', 'Closed', 'Lost')),
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    last_contact TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    action VARCHAR(200) NOT NULL,
    action_type VARCHAR(30),
    proof_type VARCHAR(20),
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE follow_up_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    reminder_date DATE NOT NULL,
    reminder_time TIME,
    title VARCHAR(200),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_agent ON clients(assigned_agent_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_potential ON clients(potential);
CREATE INDEX idx_reminders_date ON follow_up_reminders(reminder_date);


-- =====================================================
-- 5. BOOKINGS & TRANSACTIONS
-- =====================================================

CREATE TABLE unit_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    agent_id UUID NOT NULL REFERENCES users(id),
    booking_amount DECIMAL(15,2) NOT NULL,
    ktp_upload_url TEXT,
    npwp_upload_url TEXT,
    transfer_proof_url TEXT,
    status VARCHAR(20) DEFAULT 'Pending Agent' CHECK (status IN ('Pending Agent', 'Pending Leader', 'Pending Admin', 'Approved', 'Rejected', 'Expired')),
    leader_approved_by UUID REFERENCES users(id),
    leader_approved_at TIMESTAMP,
    admin_approved_by UUID REFERENCES users(id),
    admin_approved_at TIMESTAMP,
    rejection_reason TEXT,
    expires_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_id VARCHAR(20) NOT NULL UNIQUE,
    booking_id UUID REFERENCES unit_bookings(id),
    client_name VARCHAR(150) NOT NULL,
    project_name VARCHAR(200),
    unit_info VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('Bank Transfer', 'Credit Card', 'Cash', 'Cheque')),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    agent_id UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_bookings_status ON unit_bookings(status);


-- =====================================================
-- 6. COMMISSIONS & FINANCE
-- =====================================================

CREATE TABLE commission_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_commission DECIMAL(5,2) NOT NULL,
    closing_bonus VARCHAR(100),
    accelerator VARCHAR(100),
    referral_split VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scheme_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES commission_schemes(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(scheme_id, project_id)
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id),
    scheme_id UUID REFERENCES commission_schemes(id),
    booking_id UUID REFERENCES unit_bookings(id),
    project_name VARCHAR(200),
    unit_info VARCHAR(100),
    client_name VARCHAR(150),
    amount DECIMAL(15,2) NOT NULL,
    commission_type VARCHAR(30),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Paid', 'Rejected')),
    claimed_at TIMESTAMP DEFAULT NOW(),
    leader_approved_by UUID REFERENCES users(id),
    leader_approved_at TIMESTAMP,
    admin_approved_by UUID REFERENCES users(id),
    admin_paid_at TIMESTAMP,
    period VARCHAR(20),
    bonus_type VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_agent ON commissions(agent_id);
CREATE INDEX idx_commissions_status ON commissions(status);


-- =====================================================
-- 7. ACTIVITY & PROOF OF WORK
-- =====================================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    client_id UUID REFERENCES clients(id),
    project_id UUID REFERENCES projects(id),
    activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('Cold Calling', 'Chat Follow-up', 'Meeting', 'Site Visit', 'Negotiation', 'Booking', 'Document Upload', 'Commission Claim')),
    description TEXT,
    target VARCHAR(200),
    is_gps_verified BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    gps_accuracy DECIMAL(6,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proof_of_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
    proof_type VARCHAR(20) NOT NULL CHECK (proof_type IN ('photo', 'chat_screenshot', 'call_log', 'document', 'gps_checkin')),
    file_url TEXT NOT NULL,
    file_name VARCHAR(200),
    file_size VARCHAR(20),
    caption VARCHAR(200),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    captured_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_from_camera BOOLEAN DEFAULT FALSE,
    device_info VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_date ON activity_logs(created_at);
CREATE INDEX idx_proof_activity ON proof_of_work(activity_log_id);


-- =====================================================
-- 8. SITE VISITS & KPI
-- =====================================================

CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    unit_info VARCHAR(100),
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No Show')),
    feedback TEXT,
    checkin_lat DECIMAL(10,8),
    checkin_lng DECIMAL(11,8),
    checkin_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visits_agent ON site_visits(agent_id);
CREATE INDEX idx_visits_date ON site_visits(visit_date);
CREATE INDEX idx_visits_status ON site_visits(status);

CREATE TABLE kpi_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    target_revenue DECIMAL(15,2) DEFAULT 0,
    target_leads INTEGER DEFAULT 0,
    target_closings INTEGER DEFAULT 0,
    actual_revenue DECIMAL(15,2) DEFAULT 0,
    actual_leads INTEGER DEFAULT 0,
    actual_follow_ups INTEGER DEFAULT 0,
    actual_site_visits INTEGER DEFAULT 0,
    actual_closings INTEGER DEFAULT 0,
    actual_lost INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_deal_size DECIMAL(15,2) DEFAULT 0,
    avg_response_time VARCHAR(20),
    client_satisfaction DECIMAL(5,2) DEFAULT 0,
    commission_earned DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, period_month, period_year)
);

CREATE INDEX idx_kpi_user_period ON kpi_targets(user_id, period_year, period_month);


-- =====================================================
-- 9. DIGITAL ASSETS & AUDIT
-- =====================================================

CREATE TABLE digital_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    file_type VARCHAR(20) CHECK (file_type IN ('pdf', 'excel', 'image', 'video', 'other')),
    file_size VARCHAR(20),
    file_url TEXT,
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(150),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    entity_name VARCHAR(200),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    severity VARCHAR(10) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);


-- =====================================================
-- 10. SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(20),
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- =====================================================
-- 11. SEED DATA
-- =====================================================

-- Note: Run seed after creating tables via SQL editor in Supabase Dashboard

-- =====================================================
-- VIEWS FOR DASHBOARD
-- =====================================================

CREATE VIEW v_team_performance AS
SELECT
    t.id AS team_id,
    t.name AS team_name,
    (SELECT COUNT(*) FROM users u WHERE u.team_id = t.id AND u.status = 'Active') AS agent_count,
    COALESCE(SUM(k.actual_revenue), 0) AS total_revenue,
    COALESCE(SUM(k.target_revenue), 0) AS total_target,
    COALESCE(SUM(k.actual_closings), 0) AS total_closings,
    COALESCE(SUM(k.actual_leads), 0) AS total_leads,
    CASE WHEN SUM(k.target_revenue) > 0 
         THEN ROUND(SUM(k.actual_revenue) / SUM(k.target_revenue) * 100, 1)
         ELSE 0 END AS achievement_pct
FROM teams t
LEFT JOIN kpi_targets k ON k.user_id IN (SELECT id FROM users WHERE team_id = t.id)
    AND k.period_month = EXTRACT(MONTH FROM NOW())
    AND k.period_year = EXTRACT(YEAR FROM NOW())
GROUP BY t.id, t.name;

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
WHERE u.role = 'Sales Agent' AND u.status = 'Active';

CREATE VIEW v_inventory_summary AS
SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.developer_id,
    d.name AS developer_name,
    COUNT(u.id) AS total_units,
    COUNT(CASE WHEN u.status = 'Available' THEN 1 END) AS available,
    COUNT(CASE WHEN u.status = 'Booked' THEN 1 END) AS booked,
    COUNT(CASE WHEN u.status = 'Sold' THEN 1 END) AS sold,
    SUM(u.price) AS total_value,
    AVG(u.price) AS avg_price
FROM projects p
JOIN developers d ON p.developer_id = d.id
LEFT JOIN units u ON u.project_id = p.id
GROUP BY p.id, p.name, p.developer_id, d.name;

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