import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import teamRoutes from './modules/teams/team.routes';
import contactRoutes from './modules/contacts/contact.routes';
import conversationRoutes from './modules/conversations/conversation.routes';
import messageRoutes from './modules/messages/message.routes';
import cannedResponseRoutes from './modules/canned-responses/canned-response.routes';
import tagRoutes from './modules/tags/tag.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import routingRuleRoutes from './modules/routing-rules/routing-rule.routes';
import auditLogRoutes from './modules/audit-logs/audit-log.routes';
import tenantRoutes from './modules/tenants/tenant.routes';
import connectorRoutes from './modules/connectors/connector.routes';
import metaWebhookRoutes from './webhooks/meta.webhook.routes';

dotenv.config();

const app = express();

app.use(cors());

// ── Raw body capture (scoped to /webhooks — required for Meta signature verification) ─
app.use('/webhooks', (req: any, res, next) => {
  let data: Buffer[] = [];
  req.on('data', (chunk: Buffer) => data.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    // Parse JSON manually for webhook routes
    try { req.body = JSON.parse(req.rawBody.toString()); } catch { req.body = {}; }
    next();
  });
});

app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base status routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'OmniChat API is running', docs: '/api-docs' });
});

// ── Public webhook routes (no JWT) ───────────────────────────────────────────
app.use('/webhooks', metaWebhookRoutes);

// ── Authenticated API routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/canned-responses', cannedResponseRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/routing-rules', routingRuleRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/connectors', connectorRoutes);

// Error Handler
app.use(errorHandler);

export default app;
