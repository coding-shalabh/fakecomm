# FakeComm - Mock Communication Provider

A mock WhatsApp/SMS/Email/Voice provider for testing Nexora integrations without real provider accounts.

## Features

- 📱 **50 Dummy Users** - Pre-seeded test users with Indian names, phones, emails
- 💬 **WhatsApp Simulation** - Send/receive WhatsApp messages
- 📲 **SMS Simulation** - Send/receive SMS
- 📧 **Email Simulation** - Send/receive emails
- 📞 **Voice Simulation** - Simulate incoming/outgoing calls
- 🎛️ **Dashboard UI** - Visual interface to manage test users and messages
- 🔗 **Real Webhooks** - Triggers actual webhooks to Nexora
- 📊 **Message History** - Track all simulated messages

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FakeComm (Render)                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Dashboard UI (localhost:3000)                          │    │
│  │  - List 50 dummy users                                  │    │
│  │  - Click to send message → Nexora                       │    │
│  │  - View message history                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                    Webhook   │   API                             │
│                              ▼                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nexora (Production)                           │
│  - Receives webhook → Creates contact → Shows in inbox          │
│  - User replies → Calls FakeComm API → Stored in FakeComm       │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Push schema to database
npx prisma db push

# Seed dummy users
npm run db:seed

# Start server
npm run dev
```

### Deploy to Render

1. Push this folder to a Git repository
2. Create new Web Service on Render
3. Connect your repository
4. Add environment variables:
   - `DATABASE_URL` (Render provides if you add a PostgreSQL database)
   - `NEXORA_WEBHOOK_URL` = `https://api.nexoraos.pro/api/v1`
   - `NEXORA_PHONE` = Your Nexora WhatsApp number
   - `NEXORA_EMAIL` = Your Nexora support email

Or use the render.yaml blueprint:

```bash
render blueprint apply
```

## API Endpoints

### Simulation (Send to Nexora)

| Endpoint             | Method | Description                         |
| -------------------- | ------ | ----------------------------------- |
| `/api/simulate/send` | POST   | Send single message from dummy user |
| `/api/simulate/bulk` | POST   | Send multiple messages at once      |

### Nexora Integration (Receive from Nexora)

| Endpoint             | Method | Description                        |
| -------------------- | ------ | ---------------------------------- |
| `/api/whatsapp/send` | POST   | Nexora calls this to send WhatsApp |
| `/api/sms/send`      | POST   | Nexora calls this to send SMS      |
| `/api/email/send`    | POST   | Nexora calls this to send email    |
| `/api/voice/call`    | POST   | Nexora calls this to make call     |

### Data

| Endpoint                  | Method | Description                |
| ------------------------- | ------ | -------------------------- |
| `/api/users`              | GET    | List all dummy users       |
| `/api/users/:id/messages` | GET    | Get user's message history |
| `/api/messages`           | GET    | List all messages          |
| `/health`                 | GET    | Health check               |

## Usage Examples

### Send WhatsApp from Dummy User

```bash
curl -X POST http://localhost:3000/api/simulate/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "channel": "WHATSAPP",
    "text": "Hi, I need help with my order"
  }'
```

### Send Bulk Messages

```bash
curl -X POST http://localhost:3000/api/simulate/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "WHATSAPP",
    "count": 10
  }'
```

## Nexora Configuration

For FakeComm to work with Nexora, you need to:

1. **Create Channel Account in Nexora** with phone number matching `NEXORA_PHONE`
2. **Configure Nexora to use FakeComm API** for outbound messages:
   - WhatsApp: Point to `https://your-fakecomm.onrender.com/api/whatsapp/send`
   - SMS: Point to `https://your-fakecomm.onrender.com/api/sms/send`
   - Email: Point to `https://your-fakecomm.onrender.com/api/email/send`

## License

MIT
