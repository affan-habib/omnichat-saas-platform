import { Queue, Worker, Job } from 'bullmq';
import { redis } from './redis';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

// ── QUEUE NAMES ─────────────────────────────────────────────
export const QUEUES = {
  NOTIFICATIONS: 'notifications',
  AUTOMATIONS: 'automations',
  SYSTEM_TASKS: 'system-tasks',
};

// ── INITIALIZE QUEUES ───────────────────────────────────────
export const notificationQueue = new Queue(QUEUES.NOTIFICATIONS, { connection });
export const automationQueue = new Queue(QUEUES.AUTOMATIONS, { connection });
export const systemTaskQueue = new Queue(QUEUES.SYSTEM_TASKS, { connection });

console.log('👷 Queues Initialized');
