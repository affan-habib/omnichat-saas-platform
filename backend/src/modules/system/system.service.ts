import os from 'os';
import prisma from '../../config/prisma';

export const getSystemMetrics = async () => {
  const cpuLoad = os.loadavg()[0]; // 1 min load avg
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((totalMem - freeMem) / totalMem) * 100;

  // Process memory
  const processMem = process.memoryUsage();
  
  // Database connections (approximate or via raw query if supported, but let's stick to basics)
  // For Prisma, we can check active requests or just general DB health
  const dbHealth = await prisma.$queryRaw`SELECT 1`.then(() => 'HEALTHY').catch(() => 'UNHEALTHY');

  return {
    cpuLoad,
    memUsage,
    heapUsed: processMem.heapUsed / 1024 / 1024, // MB
    heapTotal: processMem.heapTotal / 1024 / 1024, // MB
    uptime: process.uptime(),
    dbStatus: dbHealth,
    timestamp: new Date()
  };
};

export const checkThresholds = async (metrics: any) => {
  const alerts = [];
  
  if (metrics.cpuLoad > (os.cpus().length * 0.8)) {
     alerts.push({ type: 'CRITICAL', message: 'CPU Load exceeding 80% threshold' });
  }
  
  if (metrics.memUsage > 90) {
     alerts.push({ type: 'WARNING', message: 'Server Memory usage above 90%' });
  }

  return alerts;
};
