import { Worker, Job } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const initNotificationWorker = () => {
  const worker = new Worker('notifications', async (job: Job) => {
    const { type, payload } = job.data;

    console.log(`[Worker] Processing ${type} for tenant ${payload.tenantId}`);

    switch (type) {
      case 'WELCOME_EMAIL':
        console.log(`📧 Sending welcome email to ${payload.email}...`);
        // Simulate email sending delay
        await new Promise(res => setTimeout(res, 2000));
        break;
      
      case 'CRM_EXPORT':
        console.log(`📊 Generating CRM export for ${payload.userId}...`);
        await new Promise(res => setTimeout(res, 5000));
        break;

      default:
        console.warn(`[Worker] Unknown job type: ${type}`);
    }
  }, { connection });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};
