-- =====================================================
-- AGENT PROPERTI — DATABASE SCHEMA (MySQL Version)
-- Database: MySQL 8.0+
-- FIXED: Correct table order (no FK to uncreated tables)
-- =====================================================

-- =====================================================
-- 1. USERS & TEAMS
-- =====================================================

CREATE TABLE teams (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    leader_id       CHAR(36),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(30) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                ENUM('Admin', 'Leader Sales', 'Sales Agent') NOT NULL,
    status              ENUM('Active', 'Pending', 'Blocked', 'Inactive') NOT NULL DEFAULT 'Pending',
    team_id             CHAR(36),
    avatar_url          TEXT,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled  BOOLEAN DEFAULT FALSE,
    session_timeout_min INT DEFAULT 30,
    timezone            VARCHAR(50) DEFAULT 'Asia/Jakarta',
    language            VARCHAR(20) DEFAULT 'id',
    total_sales         INT DEFAULT 0,
    active_deals        INT DEFAULT 0,
    registration_date   DATE DEFAULT (CURRENT_DATE),
    last_login          TIMESTAMP NULL,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name                VARCHAR(200) NOT NULL,
    established_year    INT,
    location            VARCHAR(200),
    contact_name        VARCHAR(150),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(30),
    tax_id              VARCHAR(50),
    business_license    VARCHAR(50),
    license_expiry      DATE,
    insurance_cert      VARCHAR(50),
    insurance_expiry    DATE,
    legal_status        ENUM('Verified Institutional', 'Review Pending') DEFAULT 'Review Pending',
    total_units         INT DEFAULT 0,
    completed_projects  INT DEFAULT 0,
    on_time_delivery    DECIMAL(5,2) DEFAULT 0,
    quality_score       DECIMAL(5,2) DEFAULT 0,
    last_audit_date     DATE,
    audit_status        ENUM('Passed', 'Pending', 'Failed') DEFAULT 'Pending',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    developer_id        CHAR(36) NOT NULL,
    name                VARCHAR(200) NOT NULL,
    address             TEXT,
    city                VARCHAR(100),
    coordinates         VARCHAR(50),
    map_area            VARCHAR(100),
    description         TEXT,
    project_type        VARCHAR(50),
    rera_id             VARCHAR(50),
    status              ENUM('Active', 'Completed', 'Coming Soon') DEFAULT 'Active',
    start_date          DATE,
    estimated_completion  DATE,
    total_units         INT DEFAULT 0,
    sold_units          INT DEFAULT 0,
    booked_units        INT DEFAULT 0,
    available_units     INT DEFAULT 0,
    progress_pct        DECIMAL(5,2) DEFAULT 0,
    price_range_min     DECIMAL(15,2),
    price_range_max     DECIMAL(15,2),
    avg_price           DECIMAL(15,2),
    dp_percent_min      DECIMAL(5,2),
    dp_percent_max      DECIMAL(5,2),
    gps_status          ENUM('ONLINE', 'OFFLINE', 'MAINTENANCE') DEFAULT 'ONLINE',
    image_url           TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE projects ADD CONSTRAINT fk_projects_developer FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE;

CREATE TABLE project_facilities (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id  CHAR(36) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(50)
);
ALTER TABLE project_facilities ADD CONSTRAINT fk_facilities_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE TABLE project_certificates (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id  CHAR(36) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    expiry_date DATE
);
ALTER TABLE project_certificates ADD CONSTRAINT fk_certificates_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE TABLE project_images (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id  CHAR(36) NOT NULL,
    url         TEXT NOT NULL,
    caption     VARCHAR(200),
    sort_order  INT DEFAULT 0
);
ALTER TABLE project_images ADD CONSTRAINT fk_images_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE TABLE project_agents (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id  CHAR(36) NOT NULL,
    user_id     CHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
ALTER TABLE project_agents ADD CONSTRAINT fk_pa_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE project_agents ADD CONSTRAINT fk_pa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_projects_developer ON projects(developer_id);
CREATE INDEX idx_projects_status ON projects(status);


-- =====================================================
-- 3. CLIENTS / CRM (BEFORE UNITS)
-- =====================================================

CREATE TABLE clients (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(30) NOT NULL,
    ktp_nik         VARCHAR(16),
    address         TEXT,
    city            VARCHAR(100),
    occupation      VARCHAR(200),
    budget          VARCHAR(50),
    source          ENUM('Website', 'Referral', 'Walk-in', 'Social Media', 'Event'),
    potential       ENUM('Hot', 'Warm', 'Cold'),
    status          ENUM('New Lead', 'Follow-up', 'Site Visit', 'Negotiation', 'Booked', 'Closed', 'Lost') DEFAULT 'New Lead',
    assigned_agent_id CHAR(36),
    project_id      CHAR(36),
    last_contact    TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE clients ADD CONSTRAINT fk_clients_agent FOREIGN KEY (assigned_agent_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE clients ADD CONSTRAINT fk_clients_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

CREATE TABLE client_timeline (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id       CHAR(36) NOT NULL,
    action          VARCHAR(200) NOT NULL,
    action_type     VARCHAR(30),
    proof_type      VARCHAR(20),
    performed_by    CHAR(36),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE client_timeline ADD CONSTRAINT fk_timeline_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
ALTER TABLE client_timeline ADD CONSTRAINT fk_timeline_performed_by FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE follow_up_reminders (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    client_id       CHAR(36) NOT NULL,
    reminder_date   DATE NOT NULL,
    reminder_time   TIME,
    title           VARCHAR(200),
    is_completed    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE follow_up_reminders ADD CONSTRAINT fk_reminders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE follow_up_reminders ADD CONSTRAINT fk_reminders_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

CREATE INDEX idx_clients_agent ON clients(assigned_agent_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_potential ON clients(potential);
CREATE INDEX idx_reminders_date ON follow_up_reminders(reminder_date);


-- =====================================================
-- 4. UNITS / INVENTORY (CAN NOW REFERENCE CLIENTS)
-- =====================================================

CREATE TABLE unit_types (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id      CHAR(36) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    size_sqft       INT,
    base_price      DECIMAL(15,2),
    dp_amount       DECIMAL(15,2),
    dp_percent      DECIMAL(5,2),
    total_count     INT DEFAULT 0,
    available_count INT DEFAULT 0
);
ALTER TABLE unit_types ADD CONSTRAINT fk_unit_types_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE TABLE units (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id      CHAR(36) NOT NULL,
    unit_type_id    CHAR(36),
    block           VARCHAR(50),
    unit_number     VARCHAR(50) NOT NULL,
    house_type      VARCHAR(100),
    floor_area      INT,
    floor_level     INT,
    bedrooms        INT DEFAULT 1,
    bathrooms       INT DEFAULT 1,
    facing          VARCHAR(50),
    price           DECIMAL(15,2) NOT NULL,
    down_payment    DECIMAL(15,2),
    dp_percent      DECIMAL(5,2),
    status          ENUM('Available', 'Booked', 'Sold') DEFAULT 'Available',
    booked_by_client_id CHAR(36),
    booked_date     DATE,
    booked_by_agent CHAR(36),
    sold_date       DATE,
    booking_expires DATETIME,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE units ADD CONSTRAINT fk_units_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE units ADD CONSTRAINT fk_units_type FOREIGN KEY (unit_type_id) REFERENCES unit_types(id) ON DELETE SET NULL;
ALTER TABLE units ADD CONSTRAINT fk_units_client FOREIGN KEY (booked_by_client_id) REFERENCES clients(id) ON DELETE SET NULL;
ALTER TABLE units ADD CONSTRAINT fk_units_agent_booking FOREIGN KEY (booked_by_agent) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_price ON units(price);


-- =====================================================
-- 5. UPDATE CLIENTS TO ADD UNIT FK (OPTIONAL)
-- =====================================================

ALTER TABLE clients ADD CONSTRAINT fk_clients_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL;


-- =====================================================
-- 6. BOOKINGS & TRANSACTIONS
-- =====================================================

CREATE TABLE unit_bookings (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    unit_id         CHAR(36) NOT NULL,
    client_id       CHAR(36) NOT NULL,
    agent_id        CHAR(36) NOT NULL,
    booking_amount  DECIMAL(15,2) NOT NULL,
    ktp_upload_url  TEXT,
    npwp_upload_url TEXT,
    transfer_proof_url TEXT,
    status          ENUM('Pending Agent', 'Pending Leader', 'Pending Admin', 'Approved', 'Rejected', 'Expired') DEFAULT 'Pending Agent',
    leader_approved_by CHAR(36),
    leader_approved_at TIMESTAMP,
    admin_approved_by  CHAR(36),
    admin_approved_at  TIMESTAMP,
    rejection_reason   TEXT,
    expires_at      DATETIME,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE unit_bookings ADD CONSTRAINT fk_bookings_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE;
ALTER TABLE unit_bookings ADD CONSTRAINT fk_bookings_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
ALTER TABLE unit_bookings ADD CONSTRAINT fk_bookings_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE unit_bookings ADD CONSTRAINT fk_bookings_leader_approved FOREIGN KEY (leader_approved_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE unit_bookings ADD CONSTRAINT fk_bookings_admin_approved FOREIGN KEY (admin_approved_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE transactions (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    txn_id          VARCHAR(20) NOT NULL UNIQUE,
    booking_id      CHAR(36),
    client_name     VARCHAR(150) NOT NULL,
    project_name    VARCHAR(200),
    unit_info       VARCHAR(100),
    amount          DECIMAL(15,2) NOT NULL,
    payment_method  ENUM('Bank Transfer', 'Credit Card', 'Cash', 'Cheque'),
    status          ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    agent_id        CHAR(36),
    approved_by     CHAR(36),
    approved_at     TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_booking FOREIGN KEY (booking_id) REFERENCES unit_bookings(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_bookings_status ON unit_bookings(status);


-- =====================================================
-- 7. COMMISSIONS
-- =====================================================

CREATE TABLE commission_schemes (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    base_commission DECIMAL(5,2) NOT NULL,
    closing_bonus   VARCHAR(100),
    accelerator     VARCHAR(100),
    referral_split  VARCHAR(100),
    status          ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE scheme_projects (
    id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    scheme_id   CHAR(36) NOT NULL,
    project_id  CHAR(36) NOT NULL,
    UNIQUE(scheme_id, project_id)
);
ALTER TABLE scheme_projects ADD CONSTRAINT fk_sp_scheme FOREIGN KEY (scheme_id) REFERENCES commission_schemes(id) ON DELETE CASCADE;
ALTER TABLE scheme_projects ADD CONSTRAINT fk_sp_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE TABLE commissions (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agent_id        CHAR(36) NOT NULL,
    scheme_id       CHAR(36),
    booking_id      CHAR(36),
    project_name    VARCHAR(200),
    unit_info       VARCHAR(100),
    client_name     VARCHAR(150),
    amount          DECIMAL(15,2) NOT NULL,
    commission_type VARCHAR(30),
    status          ENUM('Pending', 'Approved', 'Paid', 'Rejected') DEFAULT 'Pending',
    claimed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leader_approved_by CHAR(36),
    leader_approved_at TIMESTAMP,
    admin_approved_by  CHAR(36),
    admin_paid_at      TIMESTAMP,
    period          VARCHAR(20),
    bonus_type      VARCHAR(30),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_scheme FOREIGN KEY (scheme_id) REFERENCES commission_schemes(id) ON DELETE SET NULL;
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_booking FOREIGN KEY (booking_id) REFERENCES unit_bookings(id) ON DELETE SET NULL;
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_leader_approved FOREIGN KEY (leader_approved_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_admin_approved FOREIGN KEY (admin_approved_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_commissions_agent ON commissions(agent_id);
CREATE INDEX idx_commissions_status ON commissions(status);


-- =====================================================
-- 8. ACTIVITY & PROOF OF WORK
-- =====================================================

CREATE TABLE activity_logs (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    client_id       CHAR(36),
    project_id      CHAR(36),
    activity_type   ENUM('Cold Calling', 'Chat Follow-up', 'Meeting', 'Site Visit', 'Negotiation', 'Booking', 'Document Upload', 'Commission Claim') NOT NULL,
    description     TEXT,
    target          VARCHAR(200),
    is_gps_verified BOOLEAN DEFAULT FALSE,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    gps_accuracy    DECIMAL(6,2),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

CREATE TABLE proof_of_work (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    activity_log_id CHAR(36) NOT NULL,
    proof_type      ENUM('photo', 'chat_screenshot', 'call_log', 'document', 'gps_checkin') NOT NULL,
    file_url        TEXT NOT NULL,
    file_name       VARCHAR(200),
    file_size       VARCHAR(20),
    caption         VARCHAR(200),
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    captured_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_from_camera  BOOLEAN DEFAULT FALSE,
    device_info     VARCHAR(200),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE proof_of_work ADD CONSTRAINT fk_proof_activity FOREIGN KEY (activity_log_id) REFERENCES activity_logs(id) ON DELETE CASCADE;

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_date ON activity_logs(created_at);
CREATE INDEX idx_proof_activity ON proof_of_work(activity_log_id);


-- =====================================================
-- 9. SITE VISITS & KPI
-- =====================================================

CREATE TABLE site_visits (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agent_id        CHAR(36) NOT NULL,
    client_id       CHAR(36) NOT NULL,
    project_id      CHAR(36) NOT NULL,
    unit_info       VARCHAR(100),
    visit_date      DATE NOT NULL,
    visit_time      TIME NOT NULL,
    status          ENUM('Scheduled', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
    feedback        TEXT,
    checkin_lat     DECIMAL(10,8),
    checkin_lng     DECIMAL(11,8),
    checkin_time    TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE site_visits ADD CONSTRAINT fk_visits_agent FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE site_visits ADD CONSTRAINT fk_visits_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
ALTER TABLE site_visits ADD CONSTRAINT fk_visits_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

CREATE INDEX idx_visits_agent ON site_visits(agent_id);
CREATE INDEX idx_visits_date ON site_visits(visit_date);
CREATE INDEX idx_visits_status ON site_visits(status);

CREATE TABLE kpi_targets (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36) NOT NULL,
    period_month    INT NOT NULL,
    period_year     INT NOT NULL,
    target_revenue  DECIMAL(15,2) DEFAULT 0,
    target_leads    INT DEFAULT 0,
    target_closings INT DEFAULT 0,
    actual_revenue  DECIMAL(15,2) DEFAULT 0,
    actual_leads    INT DEFAULT 0,
    actual_follow_ups INT DEFAULT 0,
    actual_site_visits INT DEFAULT 0,
    actual_closings INT DEFAULT 0,
    actual_lost     INT DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    avg_deal_size   DECIMAL(15,2) DEFAULT 0,
    avg_response_time VARCHAR(20),
    client_satisfaction DECIMAL(5,2) DEFAULT 0,
    commission_earned DECIMAL(15,2) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_id, period_month, period_year)
);
ALTER TABLE kpi_targets ADD CONSTRAINT fk_kpi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_kpi_user_period ON kpi_targets(user_id, period_year, period_month);


-- =====================================================
-- 10. DIGITAL ASSETS & AUDIT
-- =====================================================

CREATE TABLE digital_assets (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id      CHAR(36),
    name            VARCHAR(200) NOT NULL,
    file_type       ENUM('pdf', 'excel', 'image', 'video', 'other'),
    file_size       VARCHAR(20),
    file_url        TEXT,
    description     TEXT,
    uploaded_by     CHAR(36),
    upload_date     DATE DEFAULT (CURRENT_DATE),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE digital_assets ADD CONSTRAINT fk_assets_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE digital_assets ADD CONSTRAINT fk_assets_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE audit_logs (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         CHAR(36),
    user_name       VARCHAR(150),
    user_role       VARCHAR(50),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       CHAR(36),
    entity_name     VARCHAR(200),
    details         TEXT,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    severity        ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);


-- =====================================================
-- 11. SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key     VARCHAR(100) NOT NULL UNIQUE,
    setting_value   TEXT,
    setting_type    VARCHAR(20),
    description     TEXT,
    updated_by      CHAR(36),
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE system_settings ADD CONSTRAINT fk_settings_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;


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
    AND k.period_month = MONTH(NOW())
    AND k.period_year = YEAR(NOW())
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
    k.commission_earned
FROM users u
JOIN teams t ON u.team_id = t.id
LEFT JOIN kpi_targets k ON k.user_id = u.id
    AND k.period_month = MONTH(NOW())
    AND k.period_year = YEAR(NOW())
WHERE u.role = 'Sales Agent' AND u.status = 'Active';

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
    TIMESTAMPDIFF(HOUR, c.last_contact, NOW()) AS hours_since_contact
FROM clients c
LEFT JOIN users u ON c.assigned_agent_id = u.id
LEFT JOIN projects p ON c.project_id = p.id
WHERE c.potential = 'Hot'
  AND c.status NOT IN ('Closed', 'Lost')
  AND c.last_contact < DATE_SUB(NOW(), INTERVAL 48 HOUR)
ORDER BY c.last_contact ASC;


-- =====================================================
-- TRIGGERS (Auto-update project unit counts)
-- =====================================================

DELIMITER $$

CREATE TRIGGER trg_unit_status_change_insert
AFTER INSERT ON units
FOR EACH ROW
BEGIN
    UPDATE projects SET
        sold_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Sold'),
        booked_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Booked'),
        available_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Available'),
        updated_at = NOW()
    WHERE id = NEW.project_id;
END$$

CREATE TRIGGER trg_unit_status_change_update
AFTER UPDATE ON units
FOR EACH ROW
BEGIN
    UPDATE projects SET
        sold_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Sold'),
        booked_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Booked'),
        available_units = (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Available'),
        progress_pct = ROUND(
            (SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id AND status = 'Sold') /
            NULLIF((SELECT COUNT(*) FROM units WHERE project_id = NEW.project_id), 0) * 100, 1
        ),
        updated_at = NOW()
    WHERE id = NEW.project_id;
END$$

CREATE TRIGGER trg_unit_status_change_delete
AFTER DELETE ON units
FOR EACH ROW
BEGIN
    UPDATE projects SET
        sold_units = (SELECT COUNT(*) FROM units WHERE project_id = OLD.project_id AND status = 'Sold'),
        booked_units = (SELECT COUNT(*) FROM units WHERE project_id = OLD.project_id AND status = 'Booked'),
        available_units = (SELECT COUNT(*) FROM units WHERE project_id = OLD.project_id AND status = 'Available'),
        progress_pct = ROUND(
            (SELECT COUNT(*) FROM units WHERE project_id = OLD.project_id AND status = 'Sold') /
            NULLIF((SELECT COUNT(*) FROM units WHERE project_id = OLD.project_id), 0) * 100, 1
        ),
        updated_at = NOW()
    WHERE id = OLD.project_id;
END$$

DELIMITER ;


-- =====================================================
-- SYSTEM SETTINGS SEED DATA
-- =====================================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
    ('app_name', 'Agent Properti', 'string', 'Application name'),
    ('currency', 'USD', 'string', 'Default currency'),
    ('date_format', 'DD/MM/YYYY', 'string', 'Date display format'),
    ('booking_hold_hours', '24', 'number', 'Hours to hold a booked unit'),
    ('password_min_length', '8', 'number', 'Minimum password length'),
    ('session_timeout_default', '30', 'number', 'Default session timeout in minutes');