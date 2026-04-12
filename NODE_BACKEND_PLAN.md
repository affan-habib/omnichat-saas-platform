# OmniChat Backend — CRUD First Plan
**Strategy: Build everything possible using REST APIs + Seeded data. No Meta. No WebSockets yet.**

---

## Tech Stack (Final Decisions)

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | Shared types with frontend |
| Framework | Express.js | Simple, flexible, battle-tested |
| ORM | Prisma | Best DX, auto-migration, type-safe queries |
| Database | PostgreSQL | Robust for relational messaging data |
| Auth | JWT (jsonwebtoken) | Stateless, easy to integrate with Next.js |
| Validation | Zod | Share schemas with frontend later |
| Seeding | Prisma Seed | Fake contacts, conversations, messages |
| Testing | REST Client / Postman | Manual test each route as you build |

> ⏳ Deferred to later: Redis, BullMQ, Socket.io, Meta API, S3

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.ts            # JWT protect middleware
│   │   └── errorHandler.ts    # Global error handler
│   ├── modules/               # Feature-based folders
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── users/
│   │   ├── teams/
│   │   ├── contacts/
│   │   ├── conversations/
│   │   ├── messages/
│   │   ├── canned-responses/
│   │   ├── routing-rules/
│   │   └── analytics/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                # Seed script
├── .env
├── package.json
└── tsconfig.json
```

---

## Phase 1 — Project Bootstrap (Day 1)

### Step 1.1: Initialize
```bash
cd backend
npm init -y
npm install express cors dotenv jsonwebtoken bcryptjs zod
npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcryptjs
npx tsc --init
npx prisma init
```

### Step 1.2: Configure TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Step 1.3: `package.json` Scripts
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "seed": "ts-node prisma/seed.ts",
    "db:migrate": "prisma migrate dev"
  }
}
```

---

## Phase 2 — Database Schema (Day 1-2)

All models must have `tenantId`. This is the core of multi-tenancy.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── TENANT ────────────────────────────────────────────────────────────────────

model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())

  users           User[]
  teams           Team[]
  contacts        Contact[]
  conversations   Conversation[]
  cannedResponses CannedResponse[]
  routingRules    RoutingRule[]
  tags            Tag[]
}

// ─── USERS & ROLES ─────────────────────────────────────────────────────────────

enum Role {
  OWNER
  ADMIN
  SUPERVISOR
  AGENT
}

enum AgentStatus {
  ONLINE
  AWAY
  BUSY
  OFFLINE
}

model User {
  id                 String      @id @default(uuid())
  tenantId           String
  email              String      @unique
  name               String
  password           String
  role               Role        @default(AGENT)
  status             AgentStatus @default(OFFLINE)
  avatarUrl          String?
  maxConcurrentChats Int         @default(5)
  isActive           Boolean     @default(true)
  createdAt          DateTime    @default(now())

  tenant           Tenant           @relation(fields: [tenantId], references: [id])
  teamMemberships  TeamMember[]
  assignedConversations Conversation[] @relation("AssignedAgent")
}

// ─── TEAMS ─────────────────────────────────────────────────────────────────────

model Team {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  description String?
  color       String   @default("#6366f1")
  createdAt   DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  members       TeamMember[]
  conversations Conversation[] @relation("AssignedTeam")
}

model TeamMember {
  userId   String
  teamId   String
  isLead   Boolean  @default(false)
  joinedAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])

  @@id([userId, teamId])
}

// ─── CONTACTS (CRM) ────────────────────────────────────────────────────────────

model Contact {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  phone       String?
  email       String?
  avatarUrl   String?
  customData  Json?    // Flexible: store any extra CRM fields
  createdAt   DateTime @default(now())

  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  conversations Conversation[]

  @@index([tenantId, phone])
  @@index([tenantId, email])
}

// ─── CONVERSATIONS ────────────────────────────────────────────────────────────

enum ConversationStatus {
  OPEN
  PENDING
  SNOOZED
  RESOLVED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Channel {
  WHATSAPP
  MESSENGER
  INSTAGRAM
  EMAIL
  WIDGET
}

model Conversation {
  id           String             @id @default(uuid())
  tenantId     String
  contactId    String
  assigneeId   String?
  teamId       String?
  channel      Channel
  status       ConversationStatus @default(OPEN)
  priority     Priority           @default(MEDIUM)
  subject      String?
  disposition  String?            // e.g. "General Inquiry", "Billing"
  firstReplyAt DateTime?
  resolvedAt   DateTime?
  snoozedUntil DateTime?
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  contact  Contact  @relation(fields: [contactId], references: [id])
  assignee User?    @relation("AssignedAgent", fields: [assigneeId], references: [id])
  team     Team?    @relation("AssignedTeam", fields: [teamId], references: [id])
  messages Message[]
  tags     ConversationTag[]

  @@index([tenantId, status])
  @@index([tenantId, assigneeId])
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

enum MessageType {
  TEXT
  IMAGE
  FILE
  AUDIO
  VIDEO
  INTERNAL_NOTE  // Whisper — only agents see this
  ACTIVITY       // System log: "Chat assigned to Agent Smith"
}

enum SenderType {
  CONTACT        // Customer
  AGENT          // Human agent
  BOT            // AI Agent
  SYSTEM         // Auto-generated activity
}

model Message {
  id             String      @id @default(uuid())
  conversationId String
  senderType     SenderType
  senderId       String?     // userId or null if Contact/Bot
  content        String
  type           MessageType @default(TEXT)
  mediaUrl       String?
  isRead         Boolean     @default(false)
  createdAt      DateTime    @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id])

  @@index([conversationId])
}

// ─── TAGS ────────────────────────────────────────────────────────────────────

model Tag {
  id       String @id @default(uuid())
  tenantId String
  name     String
  color    String @default("#6366f1")

  tenant        Tenant          @relation(fields: [tenantId], references: [id])
  conversations ConversationTag[]
}

model ConversationTag {
  conversationId String
  tagId          String

  conversation Conversation @relation(fields: [conversationId], references: [id])
  tag          Tag          @relation(fields: [tagId], references: [id])

  @@id([conversationId, tagId])
}

// ─── CANNED RESPONSES ────────────────────────────────────────────────────────

model CannedResponse {
  id        String   @id @default(uuid())
  tenantId  String
  shortCode String   // e.g. "/shipping"
  title     String
  content   String
  createdAt DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])
}

// ─── ROUTING RULES ───────────────────────────────────────────────────────────

model RoutingRule {
  id         String   @id @default(uuid())
  tenantId   String
  name       String
  priority   Int      @default(0)
  conditions Json     // [{ field: "channel", operator: "eq", value: "WHATSAPP" }]
  action     Json     // { assignToTeam: "uuid" } or { assignToAgent: "uuid" }
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id])
}
```

---

## Phase 3 — Seeder (Day 2)

```typescript
// prisma/seed.ts
// Run with: npm run seed

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create tenant
  const tenant = await prisma.tenant.create({
    data: { name: 'Acme Corp', slug: 'acme' },
  })

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@acme.com',
      name: 'Admin User',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      status: 'ONLINE',
    },
  })

  // Create agents
  const agent1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'agent1@acme.com',
      name: 'Sarah Miller',
      password: await bcrypt.hash('password123', 10),
      role: 'AGENT',
      status: 'ONLINE',
    },
  })

  // Create team
  const team = await prisma.team.create({
    data: { tenantId: tenant.id, name: 'Support', color: '#6366f1' },
  })

  await prisma.teamMember.create({
    data: { userId: agent1.id, teamId: team.id },
  })

  // Create contact & conversation with seeded messages
  const contact = await prisma.contact.create({
    data: { tenantId: tenant.id, name: 'John Doe', phone: '+12025550100' },
  })

  const convo = await prisma.conversation.create({
    data: {
      tenantId: tenant.id,
      contactId: contact.id,
      assigneeId: agent1.id,
      teamId: team.id,
      channel: 'WHATSAPP',
      status: 'OPEN',
    },
  })

  await prisma.message.createMany({
    data: [
      { conversationId: convo.id, senderType: 'CONTACT', content: 'Hi, I need help with my order.' },
      { conversationId: convo.id, senderType: 'AGENT', senderId: agent1.id, content: 'Sure! Can you share your order number?' },
      { conversationId: convo.id, senderType: 'CONTACT', content: '#ORD-4521' },
    ],
  })

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

---

## Phase 4 — CRUD API Routes (Priority Order)

Build in this exact order — each depends on the one before.

### Priority 1: Auth (Gating everything)
```
POST   /api/auth/register         # Create tenant + owner user
POST   /api/auth/login            # Returns JWT
GET    /api/auth/me               # Get current user from token
POST   /api/auth/logout           # (Client-side token clear)
```

### Priority 2: Users (Invite teammates)
```
GET    /api/users                 # List agents in tenant [ADMIN]
POST   /api/users/invite          # Create user in same tenant [ADMIN]
GET    /api/users/:id             # Get user profile
PUT    /api/users/:id             # Update name, avatar, role
PUT    /api/users/:id/status      # Change ONLINE/AWAY/BUSY/OFFLINE
DELETE /api/users/:id             # Soft-deactivate (isActive=false)
```

### Priority 3: Teams
```
GET    /api/teams                 # List teams in tenant
POST   /api/teams                 # Create team
PUT    /api/teams/:id             # Edit team
DELETE /api/teams/:id             # Delete team
POST   /api/teams/:id/members     # Add member
DELETE /api/teams/:id/members/:userId  # Remove member
```

### Priority 4: Contacts (CRM)
```
GET    /api/contacts              # List with search (?q=, pagination)
POST   /api/contacts              # Create contact
GET    /api/contacts/:id          # Contact detail + conversation history
PUT    /api/contacts/:id          # Update contact
DELETE /api/contacts/:id          # Delete contact
```

### Priority 5: Conversations
```
GET    /api/conversations         # List (?status=, ?assigneeId=, ?teamId=, ?channel=)
POST   /api/conversations         # Manually create (for seeding/testing)
GET    /api/conversations/:id     # Single conversation with messages
PUT    /api/conversations/:id/assign     # Assign to agent
PUT    /api/conversations/:id/transfer   # Transfer to different team/agent
PUT    /api/conversations/:id/resolve    # Resolve with disposition
PUT    /api/conversations/:id/reopen     # Reopen
PUT    /api/conversations/:id/snooze     # Snooze with timestamp
```

### Priority 6: Messages
```
GET    /api/conversations/:id/messages   # Message history (paginated)
POST   /api/conversations/:id/messages   # Send reply (agent or internal note)
PUT    /api/messages/:id/read            # Mark as read
```

### Priority 7: Canned Responses
```
GET    /api/canned-responses      # List (?q=shortCode)
POST   /api/canned-responses      # Create
PUT    /api/canned-responses/:id  # Edit
DELETE /api/canned-responses/:id  # Delete
```

### Priority 8: Tags
```
GET    /api/tags                          # List tenant tags
POST   /api/tags                          # Create
PUT    /api/conversations/:id/tags        # Add/remove tags on conversation
```

### Priority 9: Analytics (Pure DB aggregation — no external deps)
```
GET    /api/analytics/overview        # Total convos, avg response time, resolution rate
GET    /api/analytics/agents          # Per-agent stats (resolved count, avg rating)
GET    /api/analytics/channels        # Breakdown by channel
GET    /api/analytics/dispositions    # Breakdown by disposition
```

### Priority 10: Settings (Routing Rules)
```
GET    /api/routing-rules         # List rules
POST   /api/routing-rules         # Create rule
PUT    /api/routing-rules/:id     # Update rule
DELETE /api/routing-rules/:id     # Delete
```

---

## Auth Middleware Pattern (Apply to every route)

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; tenantId: string; role: string }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = decoded           // { id, tenantId, role }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

> **The Key Rule:** Every service function receives `tenantId` from `req.user.tenantId`.
> Never trust `tenantId` from the request body — always take it from the verified JWT.

---

## What is NOT in this plan (Deferred)

| Feature | Why Deferred |
|---|---|
| Meta/WhatsApp Webhook | No external APIs — seeded data only |
| Socket.io / WebSockets | REST polling works fine for CRUD testing |
| Redis / BullMQ | No background jobs needed yet |
| S3 / File Upload | Placeholder `mediaUrl` field in schema is enough |
| Email Notifications | Not needed until invites are needed |
| AI Agent / Bot | Future milestone |
| SLA Background Jobs | Schema supports it, logic deferred |

---

## Order of Attack — This Week

```
Day 1 → Project setup, tsconfig, Prisma connect, schema migrate, seed
Day 2 → Auth module (register, login, /me, JWT middleware)
Day 3 → Users + Teams CRUD
Day 4 → Contacts CRUD
Day 5 → Conversations CRUD (list, assign, resolve, transfer)
Day 6 → Messages CRUD (history, send reply, internal note)
Day 7 → Canned Responses + Tags + wire frontend to backend
```

---

*Next milestone after all CRUD is done:*
`Socket.io` for real-time → then `Meta Webhook` handler → then `BullMQ` for background jobs.
