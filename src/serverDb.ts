import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'scitbd_crm.sqlite');
const SCHEMA_FILE = path.join(process.cwd(), 'schema.sql');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs({
    locateFile: (file: string) => {
      const p = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file);
      if (fs.existsSync(p)) return p;
      return file;
    },
  });

  if (fs.existsSync(DB_FILE)) {
    const buffer = fs.readFileSync(DB_FILE);
    dbInstance = new SQL.Database(buffer);
  } else {
    dbInstance = new SQL.Database();
    // Run schema
    if (fs.existsSync(SCHEMA_FILE)) {
      const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
      dbInstance.run(schemaSql);
      persistDb(dbInstance);
    }
  }

  return dbInstance;
}

export function persistDb(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite DB:', err);
  }
}

export interface Lead {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  company_name: string;
  country: string;
  deal_value: number;
  service_line: string;
  campaign_source: string;
  status: string;
  created_at: string;
}

export interface CampaignTrigger {
  id: number;
  lead_id: number;
  campaign_name: string;
  touch_number: number;
  status: string;
  scheduled_for: string;
  sent_at: string | null;
  client_name?: string;
  email?: string;
  company_name?: string;
}

export interface OperationalLog {
  id: number;
  block_name: string;
  action_taken: string;
  status: string;
  executed_at: string;
}

export async function initDatabaseWithSeeds() {
  const db = await getDb();
  
  // Ensure tables exist
  if (fs.existsSync(SCHEMA_FILE)) {
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    db.run(schemaSql);
  }

  // Check if leads table is empty, seed with a couple of high-fidelity initial records
  const result = db.exec('SELECT COUNT(*) as count FROM leads');
  const count = result[0]?.values[0]?.[0] as number;

  if (count === 0) {
    // Seed initial records representing SCITBD's pipeline
    db.run(`
      INSERT INTO leads (client_name, email, phone, company_name, country, deal_value, service_line, campaign_source, status, created_at)
      VALUES 
      ('Marcus Vance', 'm.vance@techcorp.de', '+49 30 123456', 'TechCorp Germany', 'Germany', 15000.0, 'Custom Enterprise Software (ERP/HRM)', 'LinkedIn B2B Outreach', 'campaign_active', datetime('now', '-3 hours')),
      ('Sarah Jenkins', 's.jenkins@enterprise.com', '+1 (555) 019-2834', 'Apex Global Tech', 'USA', 8500.0, 'AI Product Suite (Chatbot / Analytics)', 'October SaaS Pilot Landing Page', 'campaign_active', datetime('now', '-1 hours')),
      ('Dr. Tariq Al-Mansoor', 'tariq@gulfdata.ae', '+971 4 888 1234', 'Gulf Data Systems', 'UAE', 35000.0, 'Cybersecurity & Compliance (ISO/GDPR)', 'Direct Founder Referral', 'proposal_sent', datetime('now', '-30 minutes'));
    `);

    // Campaign triggers
    db.run(`
      INSERT INTO campaign_triggers (lead_id, campaign_name, touch_number, status, scheduled_for, sent_at)
      VALUES
      (1, 'October AI SaaS Launch', 1, 'SENT', datetime('now', '-3 hours'), datetime('now', '-3 hours')),
      (2, 'October AI SaaS Launch', 1, 'SENT', datetime('now', '-1 hours'), datetime('now', '-1 hours')),
      (3, 'October AI SaaS Launch', 1, 'SENT', datetime('now', '-30 minutes'), datetime('now', '-30 minutes')),
      (1, 'October AI SaaS Launch', 2, 'PENDING', datetime('now', '+21 hours'), null);
    `);

    // Operational logs
    db.run(`
      INSERT INTO operational_logs (block_name, action_taken, status, executed_at)
      VALUES
      ('Block 3: North America / High-Value Pipeline', 'HIGH VALUE DEAL ALERT: Lead #1 (Marcus Vance - TechCorp Germany) valued at $15000 USD. CEO Video Protocol Activated.', 'ESCALATED', datetime('now', '-3 hours')),
      ('Lead Acquisition Engine', 'Inbound Lead #2 captured from USA. Proposal Engine dispatched within <2h SLA.', 'SUCCESS', datetime('now', '-1 hours')),
      ('Block 3: North America / High-Value Pipeline', 'HIGH VALUE DEAL ALERT: Lead #3 (Dr. Tariq Al-Mansoor - Gulf Data Systems) valued at $35000 USD. CEO Video Protocol Activated.', 'ESCALATED', datetime('now', '-30 minutes'));
    `);

    persistDb(db);
  }
}
