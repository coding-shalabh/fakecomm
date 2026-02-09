/**
 * FakeComm - Mock Communication Provider
 *
 * Simulates WhatsApp, SMS, Email, and Voice providers for testing Nexora.
 * Deploy on Render for a complete end-to-end testing environment.
 */

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Nexora webhook URL (configure in Render environment)
const NEXORA_WEBHOOK_URL = process.env.NEXORA_WEBHOOK_URL || 'https://api.nexoraos.pro/api/v1';
const NEXORA_PHONE = process.env.NEXORA_PHONE || '+919999999999';
const NEXORA_EMAIL = process.env.NEXORA_EMAIL || 'support@nexoraos.pro';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// =====================
// DASHBOARD UI
// =====================

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { name: 'asc' },
  });

  const recentMessages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FakeComm - Mock Provider Dashboard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
        .header h1 { font-size: 24px; }
        .header p { opacity: 0.8; margin-top: 5px; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .grid { display: grid; grid-template-columns: 350px 1fr; gap: 20px; }
        .card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .card-header { padding: 15px; border-bottom: 1px solid #eee; font-weight: 600; }
        .user-list { max-height: 600px; overflow-y: auto; }
        .user-item { padding: 12px 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .user-item:hover { background: #f8f9fa; }
        .user-item.selected { background: #e8f4ff; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        .user-info { flex: 1; }
        .user-name { font-weight: 500; }
        .user-phone { font-size: 12px; color: #666; }
        .channel-buttons { display: flex; gap: 5px; }
        .channel-btn { padding: 5px 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
        .channel-btn.wa { background: #25D366; color: white; }
        .channel-btn.sms { background: #2196F3; color: white; }
        .channel-btn.email { background: #EA4335; color: white; }
        .channel-btn.voice { background: #9C27B0; color: white; }
        .message-form { padding: 15px; }
        .message-form textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: vertical; min-height: 80px; }
        .message-form button { margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
        .message-form button:hover { background: #5a6fd6; }
        .messages { padding: 15px; max-height: 400px; overflow-y: auto; }
        .message { padding: 10px; margin-bottom: 10px; border-radius: 8px; }
        .message.inbound { background: #e8f4ff; margin-right: 50px; }
        .message.outbound { background: #f0f0f0; margin-left: 50px; }
        .message-meta { font-size: 11px; color: #666; margin-top: 5px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; }
        .stat-value { font-size: 32px; font-weight: 700; color: #667eea; }
        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
        .quick-actions { display: flex; gap: 10px; margin-bottom: 20px; }
        .quick-btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
        .quick-btn.primary { background: #667eea; color: white; }
        .quick-btn.secondary { background: #f0f0f0; color: #333; }
        .status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
        .status.sent { background: #e3f2fd; color: #1976d2; }
        .status.delivered { background: #e8f5e9; color: #388e3c; }
        .status.read { background: #f3e5f5; color: #7b1fa2; }
        .status.failed { background: #ffebee; color: #c62828; }
        #selectedUser { display: none; }
        #selectedUser.active { display: block; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📱 FakeComm Dashboard</h1>
        <p>Mock Communication Provider for Nexora Testing</p>
      </div>

      <div class="container">
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${users.length}</div>
            <div class="stat-label">Dummy Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${await prisma.message.count({ where: { channel: 'WHATSAPP' } })}</div>
            <div class="stat-label">WhatsApp Messages</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${await prisma.message.count({ where: { channel: 'SMS' } })}</div>
            <div class="stat-label">SMS Messages</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${await prisma.message.count({ where: { channel: 'EMAIL' } })}</div>
            <div class="stat-label">Emails</div>
          </div>
        </div>

        <div class="quick-actions">
          <button class="quick-btn primary" onclick="sendBulk('WHATSAPP', 10)">📱 Send 10 WhatsApp</button>
          <button class="quick-btn primary" onclick="sendBulk('SMS', 10)">💬 Send 10 SMS</button>
          <button class="quick-btn primary" onclick="sendBulk('EMAIL', 5)">📧 Send 5 Emails</button>
          <button class="quick-btn secondary" onclick="location.reload()">🔄 Refresh</button>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-header">👥 Dummy Users (${users.length})</div>
            <div class="user-list">
              ${users
                .map(
                  (u) => `
                <div class="user-item" onclick="selectUser('${u.id}', '${u.name}', '${u.phone}', '${u.email}')">
                  <div class="avatar">${u.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}</div>
                  <div class="user-info">
                    <div class="user-name">${u.name}</div>
                    <div class="user-phone">${u.phone} • ${u.company || 'No company'}</div>
                  </div>
                  <div class="channel-buttons">
                    <button class="channel-btn wa" onclick="event.stopPropagation(); sendMessage('${u.id}', 'WHATSAPP')">WA</button>
                    <button class="channel-btn sms" onclick="event.stopPropagation(); sendMessage('${u.id}', 'SMS')">SMS</button>
                    <button class="channel-btn email" onclick="event.stopPropagation(); sendMessage('${u.id}', 'EMAIL')">✉️</button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <div>
            <div class="card" id="selectedUser">
              <div class="card-header">💬 Send Message</div>
              <div class="message-form">
                <p id="selectedUserName" style="margin-bottom: 10px; font-weight: 500;"></p>
                <select id="channelSelect" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ddd;">
                  <option value="WHATSAPP">📱 WhatsApp</option>
                  <option value="SMS">💬 SMS</option>
                  <option value="EMAIL">📧 Email</option>
                </select>
                <input type="text" id="emailSubject" placeholder="Email Subject (for email only)" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ddd; display: none;">
                <textarea id="messageText" placeholder="Type your message...">Hi, I need help with my recent order. Can you check the status?</textarea>
                <button onclick="sendSelectedMessage()">📤 Send Message → Nexora</button>
              </div>
            </div>

            <div class="card" style="margin-top: 20px;">
              <div class="card-header">📜 Recent Messages</div>
              <div class="messages">
                ${
                  recentMessages
                    .map(
                      (m) => `
                  <div class="message ${m.direction.toLowerCase()}">
                    <strong>${m.user.name}</strong>
                    <span class="status ${m.status.toLowerCase()}">${m.status}</span>
                    <span style="float: right; font-size: 11px;">${m.channel}</span>
                    <p style="margin-top: 5px;">${m.text || m.subject || '(media)'}</p>
                    <div class="message-meta">
                      ${m.direction === 'INBOUND' ? '→ To Nexora' : '← From Nexora'} •
                      ${new Date(m.createdAt).toLocaleString()} •
                      Webhook: ${m.webhookSent ? '✅' : '⏳'}
                    </div>
                  </div>
                `
                    )
                    .join('') ||
                  '<p style="padding: 20px; text-align: center; color: #666;">No messages yet. Click a user to send!</p>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        let selectedUserId = null;
        let selectedUserData = {};

        function selectUser(id, name, phone, email) {
          selectedUserId = id;
          selectedUserData = { name, phone, email };
          document.getElementById('selectedUser').classList.add('active');
          document.getElementById('selectedUserName').textContent = name + ' (' + phone + ')';
          document.querySelectorAll('.user-item').forEach(el => el.classList.remove('selected'));
          event.target.closest('.user-item').classList.add('selected');
        }

        document.getElementById('channelSelect').addEventListener('change', function() {
          document.getElementById('emailSubject').style.display = this.value === 'EMAIL' ? 'block' : 'none';
        });

        async function sendSelectedMessage() {
          if (!selectedUserId) return alert('Select a user first');
          const channel = document.getElementById('channelSelect').value;
          const text = document.getElementById('messageText').value;
          const subject = document.getElementById('emailSubject').value;

          const res = await fetch('/api/simulate/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: selectedUserId, channel, text, subject })
          });
          const data = await res.json();
          alert(data.success ? 'Message sent! Check Nexora inbox.' : 'Error: ' + data.error);
          location.reload();
        }

        async function sendMessage(userId, channel) {
          const text = channel === 'EMAIL'
            ? 'Hello, I have a question about your services. Please respond at your earliest convenience.'
            : 'Hi, I need help with my order. Can you assist?';

          const res = await fetch('/api/simulate/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, channel, text, subject: 'Inquiry about services' })
          });
          const data = await res.json();
          if (data.success) location.reload();
          else alert('Error: ' + data.error);
        }

        async function sendBulk(channel, count) {
          const res = await fetch('/api/simulate/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channel, count })
          });
          const data = await res.json();
          alert(data.success ? \`Sent \${count} \${channel} messages!\` : 'Error: ' + data.error);
          location.reload();
        }
      </script>
    </body>
    </html>
  `);
});

// =====================
// SIMULATION API (Send to Nexora)
// =====================

// Random messages for variety
const sampleMessages = {
  WHATSAPP: [
    'Hi, I need help with my recent order',
    'Can you check the status of my delivery?',
    'I want to know about your pricing plans',
    'Is there a discount available?',
    "I'm having an issue with my account",
    'Can I speak to a support agent?',
    'What are your business hours?',
    "I'd like to schedule a demo",
    'How do I reset my password?',
    'I want to upgrade my subscription',
  ],
  SMS: [
    'Need help ASAP',
    'Call me back please',
    'Order status?',
    'Payment failed',
    'Delivery delayed?',
    'Refund pending',
    'Account locked',
    'Reset password',
    'Cancel order',
    'Upgrade plan',
  ],
  EMAIL: [
    'I am writing to inquire about your services. Could you please provide more details?',
    "I placed an order but haven't received any update. Please look into this urgently.",
    'We are interested in a partnership opportunity. Please let us know who to contact.',
    'I recently purchased your product and wanted to share some feedback.',
    'I would like to schedule a demo for our team. Please suggest available slots.',
  ],
};

// Send single message (triggers webhook to Nexora)
app.post('/api/simulate/send', async (req, res) => {
  try {
    const { userId, channel, text, subject } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Create message record
    const message = await prisma.message.create({
      data: {
        userId,
        channel,
        direction: 'INBOUND',
        contentType: 'TEXT',
        text:
          text ||
          sampleMessages[channel]?.[Math.floor(Math.random() * sampleMessages[channel].length)],
        subject: channel === 'EMAIL' ? subject || 'Inquiry about services' : null,
        status: 'PENDING',
      },
    });

    // Send webhook to Nexora
    const webhookResult = await sendWebhookToNexora(user, message, channel);

    // Update message status
    await prisma.message.update({
      where: { id: message.id },
      data: {
        webhookSent: webhookResult.success,
        webhookResponse: JSON.stringify(webhookResult),
        status: webhookResult.success ? 'SENT' : 'FAILED',
      },
    });

    res.json({ success: true, message, webhookResult });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send bulk messages
app.post('/api/simulate/bulk', async (req, res) => {
  try {
    const { channel, count = 10 } = req.body;

    const users = await prisma.user.findMany({ take: count });
    const results = [];

    for (const user of users) {
      const text =
        sampleMessages[channel]?.[Math.floor(Math.random() * sampleMessages[channel].length)];

      const message = await prisma.message.create({
        data: {
          userId: user.id,
          channel,
          direction: 'INBOUND',
          contentType: 'TEXT',
          text,
          subject: channel === 'EMAIL' ? 'Bulk inquiry' : null,
          status: 'PENDING',
        },
      });

      const webhookResult = await sendWebhookToNexora(user, message, channel);

      await prisma.message.update({
        where: { id: message.id },
        data: {
          webhookSent: webhookResult.success,
          status: webhookResult.success ? 'SENT' : 'FAILED',
        },
      });

      results.push({ user: user.name, success: webhookResult.success });

      // Small delay to prevent overwhelming Nexora
      await new Promise((r) => setTimeout(r, 100));
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Bulk send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================
// NEXORA INTEGRATION (Receive from Nexora)
// =====================

// Nexora calls this to send WhatsApp
app.post('/api/whatsapp/send', async (req, res) => {
  console.log('📱 WhatsApp send request from Nexora:', req.body);

  const { to, text, mediaUrl, templateId } = req.body;

  // Find user by phone
  const user = await prisma.user.findFirst({
    where: { phone: { contains: to?.replace(/^\+/, '').slice(-10) } },
  });

  if (user) {
    await prisma.message.create({
      data: {
        userId: user.id,
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        contentType: mediaUrl ? 'IMAGE' : 'TEXT',
        text,
        mediaUrl,
        status: 'DELIVERED',
        externalId: req.body.requestId,
      },
    });
  }

  // Simulate MSG91 response
  res.json({
    success: true,
    requestId: 'fakecomm_' + Date.now(),
    status: 'submitted',
  });

  // Send delivery status webhook after delay
  setTimeout(() => sendStatusWebhook(req.body.requestId, 'delivered'), 2000);
});

// Nexora calls this to send SMS
app.post('/api/sms/send', async (req, res) => {
  console.log('💬 SMS send request from Nexora:', req.body);

  const { to, text } = req.body;

  const user = await prisma.user.findFirst({
    where: { phone: { contains: to?.replace(/^\+/, '').slice(-10) } },
  });

  if (user) {
    await prisma.message.create({
      data: {
        userId: user.id,
        channel: 'SMS',
        direction: 'OUTBOUND',
        contentType: 'TEXT',
        text,
        status: 'DELIVERED',
        externalId: req.body.requestId,
      },
    });
  }

  res.json({
    success: true,
    requestId: 'fakecomm_sms_' + Date.now(),
    status: 'submitted',
  });
});

// Nexora calls this to send Email
app.post('/api/email/send', async (req, res) => {
  console.log('📧 Email send request from Nexora:', req.body);

  const { to, subject, text, html } = req.body;

  const user = await prisma.user.findFirst({
    where: { email: to },
  });

  if (user) {
    await prisma.message.create({
      data: {
        userId: user.id,
        channel: 'EMAIL',
        direction: 'OUTBOUND',
        contentType: 'TEXT',
        subject,
        text,
        htmlBody: html,
        status: 'DELIVERED',
        externalId: req.body.requestId,
      },
    });
  }

  res.json({
    success: true,
    id: 'fakecomm_email_' + Date.now(),
    status: 'sent',
  });
});

// Nexora calls this to make voice call
app.post('/api/voice/call', async (req, res) => {
  console.log('📞 Voice call request from Nexora:', req.body);

  const { to } = req.body;

  const user = await prisma.user.findFirst({
    where: { phone: { contains: to?.replace(/^\+/, '').slice(-10) } },
  });

  if (user) {
    await prisma.call.create({
      data: {
        userId: user.id,
        direction: 'OUTBOUND',
        status: 'COMPLETED',
        duration: Math.floor(Math.random() * 300) + 30,
        externalId: req.body.requestId,
      },
    });
  }

  res.json({
    success: true,
    callId: 'fakecomm_call_' + Date.now(),
    status: 'initiated',
  });
});

// =====================
// WEBHOOK HELPERS
// =====================

async function sendWebhookToNexora(user, message, channel) {
  const webhookUrl =
    channel === 'WHATSAPP'
      ? `${NEXORA_WEBHOOK_URL}/webhooks/msg91/whatsapp`
      : channel === 'SMS'
        ? `${NEXORA_WEBHOOK_URL}/webhooks/sms/default/inbound`
        : channel === 'EMAIL'
          ? `${NEXORA_WEBHOOK_URL}/resend/webhook`
          : `${NEXORA_WEBHOOK_URL}/webhooks/voice/default/incoming`;

  let payload;

  if (channel === 'WHATSAPP') {
    payload = {
      customerNumber: user.phone,
      customerName: user.name,
      contentType: 'text',
      text: message.text,
      uuid: message.id,
      ts: new Date().toISOString(),
      integratedNumber: NEXORA_PHONE,
      direction: 0,
    };
  } else if (channel === 'SMS') {
    payload = {
      customerNumber: user.phone,
      customerName: user.name,
      text: message.text,
      msgId: message.id,
      ts: new Date().toISOString(),
      integratedNumber: NEXORA_PHONE,
    };
  } else if (channel === 'EMAIL') {
    payload = {
      type: 'email.received',
      data: {
        email_id: message.id,
        from: user.email,
        from_name: user.name,
        to: NEXORA_EMAIL,
        subject: message.subject,
        body: message.text,
        timestamp: new Date().toISOString(),
      },
    };
  } else if (channel === 'VOICE') {
    payload = {
      From: user.phone,
      To: NEXORA_PHONE,
      CallSid: message.id,
      CallStatus: 'ringing',
      Direction: 'inbound',
      CallerName: user.name,
    };
  }

  console.log(`📤 Sending ${channel} webhook to: ${webhookUrl}`);
  console.log('   Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.text();
    console.log(`   Response: ${response.status} - ${data}`);

    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function sendStatusWebhook(requestId, status) {
  if (!requestId) return;

  const webhookUrl = `${NEXORA_WEBHOOK_URL}/webhooks/msg91/whatsapp`;

  const payload = {
    eventName: status,
    direction: 1,
    requestId,
    status: status.toUpperCase(),
    ts: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`📤 Sent ${status} status for ${requestId}`);
  } catch (error) {
    console.error(`Status webhook error: ${error.message}`);
  }
}

// =====================
// API ENDPOINTS
// =====================

// Get all users
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { _count: { select: { messages: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: users });
});

// Get user messages
app.get('/api/users/:id/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { userId: req.params.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: messages });
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  const { channel, limit = 50 } = req.query;
  const messages = await prisma.message.findMany({
    where: channel ? { channel } : {},
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
  });
  res.json({ success: true, data: messages });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FakeComm', timestamp: new Date().toISOString() });
});

// =====================
// SEED ENDPOINT (for remote seeding)
// =====================
app.post('/api/seed', async (req, res) => {
  try {
    const dummyUsers = [
      {
        name: 'Rahul Sharma',
        phone: '+919876543001',
        email: 'rahul.sharma@testmail.com',
        company: 'TechSoft Solutions',
        city: 'Mumbai',
      },
      {
        name: 'Priya Verma',
        phone: '+919876543002',
        email: 'priya.verma@testmail.com',
        company: 'Digital Dreams',
        city: 'Delhi',
      },
      {
        name: 'Amit Kumar',
        phone: '+919876543003',
        email: 'amit.kumar@testmail.com',
        company: 'CloudNine Tech',
        city: 'Bangalore',
      },
      {
        name: 'Sneha Gupta',
        phone: '+919876543004',
        email: 'sneha.gupta@testmail.com',
        company: 'StartUp Hub',
        city: 'Hyderabad',
      },
      {
        name: 'Vikram Singh',
        phone: '+919876543005',
        email: 'vikram.singh@testmail.com',
        company: 'Enterprise Corp',
        city: 'Chennai',
      },
      {
        name: 'Ananya Reddy',
        phone: '+919876543006',
        email: 'ananya.reddy@testmail.com',
        company: 'Innovate Labs',
        city: 'Pune',
      },
      {
        name: 'Rajesh Patel',
        phone: '+919876543007',
        email: 'rajesh.patel@testmail.com',
        company: 'Global Trade',
        city: 'Ahmedabad',
      },
      {
        name: 'Meera Iyer',
        phone: '+919876543008',
        email: 'meera.iyer@testmail.com',
        company: 'FinTech Pro',
        city: 'Kochi',
      },
      {
        name: 'Arjun Nair',
        phone: '+919876543009',
        email: 'arjun.nair@testmail.com',
        company: 'DataDriven Inc',
        city: 'Trivandrum',
      },
      {
        name: 'Kavita Menon',
        phone: '+919876543010',
        email: 'kavita.menon@testmail.com',
        company: 'EduTech Solutions',
        city: 'Coimbatore',
      },
      {
        name: 'Suresh Rao',
        phone: '+919876543011',
        email: 'suresh.rao@testmail.com',
        company: 'HealthFirst',
        city: 'Mangalore',
      },
      {
        name: 'Deepika Joshi',
        phone: '+919876543012',
        email: 'deepika.joshi@testmail.com',
        company: 'RetailMax',
        city: 'Jaipur',
      },
      {
        name: 'Karthik Subramanian',
        phone: '+919876543013',
        email: 'karthik.s@testmail.com',
        company: 'AutoMate Systems',
        city: 'Madurai',
      },
      {
        name: 'Neha Agarwal',
        phone: '+919876543014',
        email: 'neha.agarwal@testmail.com',
        company: 'FoodChain Pro',
        city: 'Lucknow',
      },
      {
        name: 'Sanjay Mehta',
        phone: '+919876543015',
        email: 'sanjay.mehta@testmail.com',
        company: 'BuildRight',
        city: 'Surat',
      },
      {
        name: 'Pooja Desai',
        phone: '+919876543016',
        email: 'pooja.desai@testmail.com',
        company: 'MediaWorks',
        city: 'Vadodara',
      },
      {
        name: 'Aakash Bhatia',
        phone: '+919876543017',
        email: 'aakash.bhatia@testmail.com',
        company: 'LogiTech Express',
        city: 'Nagpur',
      },
      {
        name: 'Ritu Kapoor',
        phone: '+919876543018',
        email: 'ritu.kapoor@testmail.com',
        company: 'FashionForward',
        city: 'Chandigarh',
      },
      {
        name: 'Manoj Pillai',
        phone: '+919876543019',
        email: 'manoj.pillai@testmail.com',
        company: 'GreenEnergy Co',
        city: 'Thiruvananthapuram',
      },
      {
        name: 'Swati Saxena',
        phone: '+919876543020',
        email: 'swati.saxena@testmail.com',
        company: 'TravelEase',
        city: 'Indore',
      },
      {
        name: 'Vivek Malhotra',
        phone: '+919876543021',
        email: 'vivek.malhotra@testmail.com',
        company: 'SecureNet',
        city: 'Gurgaon',
      },
      {
        name: 'Anjali Krishnan',
        phone: '+919876543022',
        email: 'anjali.krishnan@testmail.com',
        company: 'PharmaCare',
        city: 'Mysore',
      },
      {
        name: 'Rohit Choudhary',
        phone: '+919876543023',
        email: 'rohit.choudhary@testmail.com',
        company: 'AgriTech India',
        city: 'Bhopal',
      },
      {
        name: 'Divya Narayanan',
        phone: '+919876543024',
        email: 'divya.narayanan@testmail.com',
        company: 'LegalEase',
        city: 'Visakhapatnam',
      },
      {
        name: 'Prakash Hegde',
        phone: '+919876543025',
        email: 'prakash.hegde@testmail.com',
        company: 'RealEstate Pro',
        city: 'Hubli',
      },
      {
        name: 'Lakshmi Venkatesh',
        phone: '+919876543026',
        email: 'lakshmi.v@testmail.com',
        company: 'InsureSafe',
        city: 'Tirupati',
      },
      {
        name: 'Nikhil Banerjee',
        phone: '+919876543027',
        email: 'nikhil.banerjee@testmail.com',
        company: 'EventPro',
        city: 'Kolkata',
      },
      {
        name: 'Shruti Pandey',
        phone: '+919876543028',
        email: 'shruti.pandey@testmail.com',
        company: 'BeautyBiz',
        city: 'Varanasi',
      },
      {
        name: 'Gaurav Tiwari',
        phone: '+919876543029',
        email: 'gaurav.tiwari@testmail.com',
        company: 'SportsFit',
        city: 'Kanpur',
      },
      {
        name: 'Pallavi Kulkarni',
        phone: '+919876543030',
        email: 'pallavi.kulkarni@testmail.com',
        company: 'HomeDecor Plus',
        city: 'Nashik',
      },
      {
        name: 'Siddharth Jain',
        phone: '+919876543031',
        email: 'siddharth.jain@testmail.com',
        company: 'JewelCraft',
        city: 'Jodhpur',
      },
      {
        name: 'Nandini Rao',
        phone: '+919876543032',
        email: 'nandini.rao@testmail.com',
        company: 'PetCare India',
        city: 'Belgaum',
      },
      {
        name: 'Ashwin Murthy',
        phone: '+919876543033',
        email: 'ashwin.murthy@testmail.com',
        company: 'GameZone Studios',
        city: 'Udupi',
      },
      {
        name: 'Tanvi Sharma',
        phone: '+919876543034',
        email: 'tanvi.sharma@testmail.com',
        company: 'WellnessFirst',
        city: 'Dehradun',
      },
      {
        name: 'Harish Gopal',
        phone: '+919876543035',
        email: 'harish.gopal@testmail.com',
        company: 'PackagePro',
        city: 'Salem',
      },
      {
        name: 'Sonali Das',
        phone: '+919876543036',
        email: 'sonali.das@testmail.com',
        company: 'BookWorld',
        city: 'Bhubaneswar',
      },
      {
        name: 'Varun Khanna',
        phone: '+919876543037',
        email: 'varun.khanna@testmail.com',
        company: 'MusicMania',
        city: 'Amritsar',
      },
      {
        name: 'Ishita Sen',
        phone: '+919876543038',
        email: 'ishita.sen@testmail.com',
        company: 'ArtGallery Online',
        city: 'Guwahati',
      },
      {
        name: 'Pranav Kulkarni',
        phone: '+919876543039',
        email: 'pranav.kulkarni@testmail.com',
        company: 'PrintShop Express',
        city: 'Aurangabad',
      },
      {
        name: 'Aditi Mishra',
        phone: '+919876543040',
        email: 'aditi.mishra@testmail.com',
        company: 'CleanHome Services',
        city: 'Patna',
      },
      {
        name: 'Venkat Raman',
        phone: '+919876543041',
        email: 'venkat.raman@testmail.com',
        company: 'ElectroMart',
        city: 'Trichy',
      },
      {
        name: 'Jyoti Sharma',
        phone: '+919876543042',
        email: 'jyoti.sharma@testmail.com',
        company: 'KidZone',
        city: 'Ranchi',
      },
      {
        name: 'Abhishek Nair',
        phone: '+919876543043',
        email: 'abhishek.nair@testmail.com',
        company: 'CafeConnect',
        city: 'Calicut',
      },
      {
        name: 'Megha Pillai',
        phone: '+919876543044',
        email: 'megha.pillai@testmail.com',
        company: 'FloristNow',
        city: 'Thrissur',
      },
      {
        name: 'Ravi Shankar',
        phone: '+919876543045',
        email: 'ravi.shankar@testmail.com',
        company: 'AutoService Pro',
        city: 'Vellore',
      },
      {
        name: 'Kritika Bhatt',
        phone: '+919876543046',
        email: 'kritika.bhatt@testmail.com',
        company: 'YogaLife',
        city: 'Rishikesh',
      },
      {
        name: 'Mohan Prasad',
        phone: '+919876543047',
        email: 'mohan.prasad@testmail.com',
        company: 'FurniturePlus',
        city: 'Vijayawada',
      },
      {
        name: 'Shweta Reddy',
        phone: '+919876543048',
        email: 'shweta.reddy@testmail.com',
        company: 'CosmeticsCo',
        city: 'Warangal',
      },
      {
        name: 'Anand Kumar',
        phone: '+919876543049',
        email: 'anand.kumar@testmail.com',
        company: 'GroceryMart',
        city: 'Raipur',
      },
      {
        name: 'Preeti Agarwal',
        phone: '+919876543050',
        email: 'preeti.agarwal@testmail.com',
        company: 'StationeryWorld',
        city: 'Dehradun',
      },
    ];

    // Clear and seed
    await prisma.message.deleteMany();
    await prisma.call.deleteMany();
    await prisma.user.deleteMany();

    for (const user of dummyUsers) {
      await prisma.user.create({ data: user });
    }

    res.json({ success: true, message: `Seeded ${dummyUsers.length} users` });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get/Set provider config
app.get('/api/config', async (req, res) => {
  const config = await prisma.config.findMany();
  res.json({ success: true, data: Object.fromEntries(config.map((c) => [c.key, c.value])) });
});

app.post('/api/config', async (req, res) => {
  const { key, value } = req.body;
  await prisma.config.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.json({ success: true });
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   📱 FakeComm - Mock Communication Provider               ║
║                                                           ║
║   Dashboard: http://localhost:${PORT}                        ║
║   API Docs:  http://localhost:${PORT}/api                    ║
║                                                           ║
║   Nexora Webhook URL: ${NEXORA_WEBHOOK_URL}
║   Nexora Phone: ${NEXORA_PHONE}
║   Nexora Email: ${NEXORA_EMAIL}
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
