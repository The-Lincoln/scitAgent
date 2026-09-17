-- Leads & Pipeline Table
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    country TEXT NOT NULL,
    deal_value REAL DEFAULT 0.0,
    service_line TEXT NOT NULL,
    campaign_source TEXT DEFAULT 'Organic / Lead Capture',
    status TEXT CHECK(status IN ('new', 'proposal_sent', 'campaign_active', 'won', 'lost')) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email Campaign Triggers Table
CREATE TABLE IF NOT EXISTS campaign_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    campaign_name TEXT NOT NULL,
    touch_number INTEGER DEFAULT 1,
    status TEXT CHECK(status IN ('PENDING', 'SENT', 'FAILED')) DEFAULT 'PENDING',
    scheduled_for DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Operational & SLA Escalation Logs
CREATE TABLE IF NOT EXISTS operational_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    block_name TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    status TEXT CHECK(status IN ('SUCCESS', 'ESCALATED', 'FAILED')) DEFAULT 'SUCCESS',
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
