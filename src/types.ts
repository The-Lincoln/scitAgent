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
  status: 'new' | 'proposal_sent' | 'campaign_active' | 'won' | 'lost';
  created_at: string;
}

export interface CampaignTrigger {
  id: number;
  lead_id: number;
  campaign_name: string;
  touch_number: number;
  status: 'PENDING' | 'SENT' | 'FAILED';
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
  status: 'SUCCESS' | 'ESCALATED' | 'FAILED';
  executed_at: string;
}

export interface SystemStats {
  total_leads: number;
  total_pipeline_value: number;
  total_triggers: number;
  ceo_escalations: number;
  won_deals: number;
  sla_compliance: string;
  system_status: string;
}
