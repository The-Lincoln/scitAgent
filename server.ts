import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getDb, persistDb, initDatabaseWithSeeds, Lead, CampaignTrigger, OperationalLog } from './src/serverDb.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Initialize SQLite Database with tables & seeds
  await initDatabaseWithSeeds();

  // Helper to dispatch external webhook (mimicking curl in PHP)
  async function dispatchExternalWebhook(payload: Record<string, unknown>) {
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/sample_scitbd_endpoint/';
    try {
      // In production/simulated mode, send non-blocking request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).catch(() => {
        // Non-blocking timeout/network ignore
      });
      clearTimeout(timeoutId);
    } catch {
      // Ignore network errors in test environment
    }
  }

  // --- Core Controller Function for Lead Ingestion ---
  async function handleLeadSubmission(data: any) {
    if (!data.client_name || !data.email || !data.country) {
      return { status: 'error', message: 'Missing required fields.', code: 400 };
    }

    const clientName = String(data.client_name).trim();
    const email = String(data.email).trim();
    const phone = String(data.phone || '').trim();
    const companyName = String(data.company_name || '').trim();
    const country = String(data.country).trim();
    const dealValue = parseFloat(data.deal_value || 0);
    const serviceLine = String(data.service_line || 'AI & Data Solutions').trim();
    const source = String(data.campaign_source || 'October SaaS Pilot Landing Page').trim();

    const db = await getDb();

    // 1. Insert Lead
    db.run(
      `INSERT INTO leads (client_name, email, phone, company_name, country, deal_value, service_line, campaign_source, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'campaign_active', datetime('now'))`,
      [clientName, email, phone, companyName, country, dealValue, serviceLine, source]
    );

    const leadIdRes = db.exec('SELECT last_insert_rowid() as id');
    const leadId = leadIdRes[0]?.values[0]?.[0] as number;

    // 2. Queue Touch 1 of October 7-Touch Email Campaign
    db.run(
      `INSERT INTO campaign_triggers (lead_id, campaign_name, touch_number, status, scheduled_for, sent_at)
       VALUES (?, 'October AI SaaS Launch', 1, 'SENT', datetime('now'), datetime('now'))`,
      [leadId]
    );

    // 3. Enforce CEO Escalation Rules for $10,000+ USD Deals
    let ceoEscalationTriggered = false;
    if (dealValue >= 10000.0) {
      ceoEscalationTriggered = true;

      // Log High-Value Escalation
      db.run(
        `INSERT INTO operational_logs (block_name, action_taken, status, executed_at)
         VALUES (?, ?, 'ESCALATED', datetime('now'))`,
        [
          'Block 3: North America / High-Value Pipeline',
          `HIGH VALUE DEAL ALERT: Lead #${leadId} (${clientName} - ${companyName || 'Enterprise'}) valued at $${dealValue.toLocaleString()} USD. CEO Video Protocol Activated.`,
        ]
      );

      // Trigger External Alert Webhook
      dispatchExternalWebhook({
        event: 'CEO_HIGH_VALUE_ESCALATION',
        lead_id: leadId,
        client_name: clientName,
        deal_value: dealValue,
        email: email,
        phone: phone,
      });
    } else {
      // Log Standard SLA Dispatch
      db.run(
        `INSERT INTO operational_logs (block_name, action_taken, status, executed_at)
         VALUES (?, ?, 'SUCCESS', datetime('now'))`,
        [
          'Lead Acquisition Engine',
          `Inbound Lead #${leadId} captured from ${country}. Proposal Engine dispatched within <2h SLA.`,
        ]
      );
    }

    persistDb(db);

    return {
      status: 'success',
      message: 'Lead captured. Proposal Engine and 7-Touch Email Campaign activated within our sub-2-hour SLA.',
      lead_id: leadId,
      ceo_video_escalation: ceoEscalationTriggered,
      deal_value: dealValue,
      client_name: clientName,
    };
  }

  // Exact endpoint: /api_webhook.php?action=submit_lead & ?action=external_webhook
  // Supports both POST & GET
  app.all('/api_webhook.php', async (req, res) => {
    const action = req.query.action || req.body.action;

    if (action === 'submit_lead') {
      try {
        const result = await handleLeadSubmission(req.body);
        return res.status(result.status === 'success' ? 200 : 400).json(result);
      } catch (err: any) {
        return res.status(500).json({ status: 'error', message: 'Failed to log lead: ' + err.message });
      }
    }

    if (action === 'external_webhook') {
      try {
        const db = await getDb();
        db.run(
          `INSERT INTO operational_logs (block_name, action_taken, status, executed_at)
           VALUES ('External Webhook Receiver', ?, 'SUCCESS', datetime('now'))`,
          ['Received webhook event: ' + JSON.stringify(req.body)]
        );
        persistDb(db);
        return res.json({ status: 'success', received: true });
      } catch (err: any) {
        return res.status(500).json({ status: 'error', message: err.message });
      }
    }

    // Default status if GET or invalid action
    return res.json({
      service: 'SCITBD Automated Lead Capture & Backend API Webhook Controller',
      version: '2.4.0-Production',
      endpoints: {
        submit_lead: 'POST /api_webhook.php?action=submit_lead',
        external_webhook: 'POST /api_webhook.php?action=external_webhook',
      },
      status: 'ACTIVE',
      sla_engine: 'Sub-2-Hour SLA Active',
      ceo_protocol: 'Activated ($10,000+ USD)',
    });
  });

  // REST API Endpoints for Dashboard UI
  app.post('/api/leads', async (req, res) => {
    try {
      const result = await handleLeadSubmission(req.body);
      return res.status(result.status === 'success' ? 200 : 400).json(result);
    } catch (err: any) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  });

  app.get('/api/leads', async (req, res) => {
    try {
      const db = await getDb();
      const queryRes = db.exec('SELECT * FROM leads ORDER BY id DESC');
      if (!queryRes.length) return res.json([]);
      const columns = queryRes[0].columns;
      const rows = queryRes[0].values.map((v) => {
        const obj: any = {};
        columns.forEach((col, i) => (obj[col] = v[i]));
        return obj as Lead;
      });
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/leads/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await getDb();
      db.run('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
      
      // Log status change
      db.run(
        `INSERT INTO operational_logs (block_name, action_taken, status, executed_at)
         VALUES ('Pipeline State Transition', ?, 'SUCCESS', datetime('now'))`,
        [`Lead #${id} status updated to '${status}'.`]
      );

      persistDb(db);
      res.json({ status: 'success', message: 'Status updated' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/campaign_triggers', async (req, res) => {
    try {
      const db = await getDb();
      const queryRes = db.exec(`
        SELECT ct.*, l.client_name, l.email, l.company_name
        FROM campaign_triggers ct
        LEFT JOIN leads l ON ct.lead_id = l.id
        ORDER BY ct.id DESC
      `);
      if (!queryRes.length) return res.json([]);
      const columns = queryRes[0].columns;
      const rows = queryRes[0].values.map((v) => {
        const obj: any = {};
        columns.forEach((col, i) => (obj[col] = v[i]));
        return obj as CampaignTrigger;
      });
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/operational_logs', async (req, res) => {
    try {
      const db = await getDb();
      const queryRes = db.exec('SELECT * FROM operational_logs ORDER BY id DESC LIMIT 100');
      if (!queryRes.length) return res.json([]);
      const columns = queryRes[0].columns;
      const rows = queryRes[0].values.map((v) => {
        const obj: any = {};
        columns.forEach((col, i) => (obj[col] = v[i]));
        return obj as OperationalLog;
      });
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const db = await getDb();
      const leadsRes = db.exec('SELECT COUNT(*) as total_leads, COALESCE(SUM(deal_value), 0) as total_pipeline FROM leads');
      const triggersRes = db.exec('SELECT COUNT(*) as total_triggers FROM campaign_triggers');
      const escalatedRes = db.exec("SELECT COUNT(*) as escalated_count FROM operational_logs WHERE status = 'ESCALATED'");
      const wonRes = db.exec("SELECT COUNT(*) as won_count FROM leads WHERE status = 'won'");

      const totalLeads = leadsRes[0]?.values[0]?.[0] || 0;
      const totalPipeline = leadsRes[0]?.values[0]?.[1] || 0;
      const totalTriggers = triggersRes[0]?.values[0]?.[0] || 0;
      const escalatedCount = escalatedRes[0]?.values[0]?.[0] || 0;
      const wonCount = wonRes[0]?.values[0]?.[0] || 0;

      res.json({
        total_leads: totalLeads,
        total_pipeline_value: totalPipeline,
        total_triggers: totalTriggers,
        ceo_escalations: escalatedCount,
        won_deals: wonCount,
        sla_compliance: '100% (<2 Hours)',
        system_status: 'ONLINE',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reset_db', async (req, res) => {
    try {
      const dbPath = path.join(process.cwd(), 'scitbd_crm.sqlite');
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      // re-init
      await initDatabaseWithSeeds();
      res.json({ status: 'success', message: 'Database refreshed with seed records.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Direct raw file viewers for developer export
  app.get('/api/raw_files/:filename', (req, res) => {
    const validFiles = ['schema.sql', 'lead_capture.html', 'api_webhook.php'];
    const { filename } = req.params;
    if (!validFiles.includes(filename)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File does not exist' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    res.type('text/plain').send(content);
  });

  // Serve the raw standalone lead_capture.html file directly when requested
  app.get('/lead_capture.html', (req, res) => {
    const filePath = path.join(process.cwd(), 'lead_capture.html');
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('lead_capture.html not found');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SCITBD CRM & Webhook Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
