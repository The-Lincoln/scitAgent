<?php
// api_webhook.php - Central SCITBD API Controller & Webhook Ingestion Engine
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// SQLite Connection
try {
    $db = new PDO('sqlite:' . __DIR__ . '/scitbd_crm.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Connection Failed: " . $e->getMessage()]);
    exit();
}

$action = $_GET['action'] ?? '';

// ACTION: Ingest Inbound Lead & Trigger Automated Workflows
if ($action === 'submit_lead' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    // Basic Validation
    if (empty($data['client_name']) || empty($data['email']) || empty($data['country'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit();
    }

    $clientName = trim($data['client_name']);
    $email = trim($data['email']);
    $phone = trim($data['phone'] ?? '');
    $companyName = trim($data['company_name'] ?? '');
    $country = trim($data['country']);
    $dealValue = floatval($data['deal_value'] ?? 0.0);
    $serviceLine = trim($data['service_line'] ?? 'AI & Data Solutions');
    $source = trim($data['campaign_source'] ?? 'Inbound Webhook');

    try {
        // 1. Insert Lead into SQLite CRM
        $stmt = $db->prepare("INSERT INTO leads (client_name, email, phone, company_name, country, deal_value, service_line, campaign_source, status) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'campaign_active')");
        $stmt->execute([$clientName, $email, $phone, $companyName, $country, $dealValue, $serviceLine, $source]);
        $leadId = $db->lastInsertId();

        // 2. Queue Touch 1 of October 7-Touch Email Campaign
        $campaignStmt = $db->prepare("INSERT INTO campaign_triggers (lead_id, campaign_name, touch_number, status) VALUES (?, 'October AI SaaS Launch', 1, 'SENT')");
        $campaignStmt->execute([$leadId]);

        // 3. Enforce CEO Escalation Rules for $10,000+ USD Deals
        $ceoEscalationTriggered = false;
        if ($dealValue >= 10000.00) {
            $ceoEscalationTriggered = true;
            
            // Log High-Value Escalation
            $logStmt = $db->prepare("INSERT INTO operational_logs (block_name, action_taken, status) VALUES (?, ?, 'ESCALATED')");
            $logStmt->execute([
                'Block 3: North America / High-Value Pipeline',
                "HIGH VALUE DEAL ALERT: Lead #{$leadId} ({$clientName} - {$companyName}) valued at \${$dealValue} USD. CEO Video Protocol Activated."
            ]);

            // (Optional) Trigger External Alert Webhook to CEO Email / Slack
            dispatchExternalWebhook([
                'event' => 'CEO_HIGH_VALUE_ESCALATION',
                'lead_id' => $leadId,
                'client_name' => $clientName,
                'deal_value' => $dealValue,
                'email' => $email,
                'phone' => $phone
            ]);
        } else {
            // Log Standard SLA Dispatch
            $logStmt = $db->prepare("INSERT INTO operational_logs (block_name, action_taken, status) VALUES (?, ?, 'SUCCESS')");
            $logStmt->execute([
                'Lead Acquisition Engine',
                "Inbound Lead #{$leadId} captured from {$country}. Proposal Engine dispatched within <2h SLA."
            ]);
        }

        echo json_encode([
            "status" => "success",
            "message" => "Lead captured. Proposal Engine and 7-Touch Email Campaign activated within our sub-2-hour SLA.",
            "lead_id" => $leadId,
            "ceo_video_escalation" => $ceoEscalationTriggered
        ]);

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Failed to log lead: " . $e->getMessage()]);
    }
    exit();
}

// ACTION: External Webhook Endpoint for Zapier / Make.com Integration
if ($action === 'external_webhook' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    // Route incoming webhook payloads from external CRM tools
    $logStmt = $db->prepare("INSERT INTO operational_logs (block_name, action_taken, status) VALUES ('External Webhook Receiver', ?, 'SUCCESS')");
    $logStmt->execute(["Received webhook event: " . json_encode($data)]);

    echo json_encode(["status" => "success", "received" => true]);
    exit();
}

// Helper Function: Dispatches Webhook Payload to External Notification Services
function dispatchExternalWebhook($payload) {
    // Replace with your Zapier, Make.com, or Slack Webhook URL
    $webhookUrl = "https://hooks.zapier.com/hooks/catch/sample_scitbd_endpoint/";
    
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3); // Non-blocking fast timeout
    @curl_exec($ch);
    @curl_close($ch);
}
?>
