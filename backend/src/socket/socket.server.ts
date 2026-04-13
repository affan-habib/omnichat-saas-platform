import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface AuthenticatedSocket extends Socket {
  userId?: string;
  tenantId?: string;
  role?: string;
}

// ─────────────────────────────────────────────────────────────
// SOCKET EVENT NAMES (single source of truth)
// ─────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Room management
  JOIN_CONVERSATION: 'join:conversation',
  LEAVE_CONVERSATION: 'leave:conversation',

  // Messages
  MESSAGE_SEND: 'message:send',          // client → server
  MESSAGE_NEW: 'message:new',            // server → room (new message arrived)
  MESSAGE_READ: 'message:read',          // client → server (mark as read)
  MESSAGE_READ_ACK: 'message:read_ack',  // server → room (someone read messages)
  TYPING_START: 'typing:start',          // client → server
  TYPING_STOP: 'typing:stop',            // client → server
  TYPING_UPDATE: 'typing:update',        // server → room (who is typing)

  // Conversations
  CONVERSATION_NEW: 'conversation:new',          // server → tenant room
  CONVERSATION_ASSIGNED: 'conversation:assigned', // server → tenant room
  CONVERSATION_RESOLVED: 'conversation:resolved', // server → tenant room
  CONVERSATION_STATUS: 'conversation:status',     // server → tenant room (any status change)
  CONVERSATION_TAGS: 'conversation:tags',         // server → room (tag change)

  // Presence
  PRESENCE_UPDATE: 'presence:update',    // server → tenant room (agent online/offline)
  USER_STATUS: 'user:status',            // client → server (agent sets own status)

  // System Monitor
  MONITOR_JOIN: 'monitor:join',          // client → server
  MONITOR_METRICS: 'monitor:metrics',    // server → room
  MONITOR_ALERT: 'monitor:alert',        // server → room
} as const;

export const monitorRoom = () => 'room:monitor';

// Tenant-scoped broadcast room key
export const tenantRoom = (tenantId: string) => `tenant:${tenantId}`;
export const conversationRoom = (convoId: string) => `conv:${convoId}`;

// ─────────────────────────────────────────────────────────────
// INITIALIZE SOCKET SERVER
// ─────────────────────────────────────────────────────────────

let io: SocketIOServer;
let monitorInterval: NodeJS.Timeout | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Start background monitoring loop
  if (!monitorInterval) {
    const { getSystemMetrics, checkThresholds } = require('../modules/system/system.service');
    monitorInterval = setInterval(async () => {
      try {
        const metrics = await getSystemMetrics();
        io.to(monitorRoom()).emit(SOCKET_EVENTS.MONITOR_METRICS, metrics);
        
        const alerts = await checkThresholds(metrics);
        alerts.forEach((alert: any) => {
          io.to(monitorRoom()).emit(SOCKET_EVENTS.MONITOR_ALERT, alert);
        });
      } catch (err) {
        console.error('[Monitor] Failed to broadcast metrics', err);
      }
    }, 5000);
  }

  // ── JWT Auth Middleware ──────────────────────────────────────
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token ||
                  socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = payload.id;
      socket.tenantId = payload.tenantId;
      socket.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection Handler ───────────────────────────────────────
  io.on('connection', (socket: AuthenticatedSocket) => {
    const { userId, tenantId, role } = socket;
    if (!userId || !tenantId) return socket.disconnect();

    console.log(`[Socket] Connected: user=${userId} tenant=${tenantId} role=${role}`);

    // Every authenticated user joins their tenant's broadcast room
    socket.join(tenantRoom(tenantId));

    // Broadcast this agent's online status to tenant
    socket.to(tenantRoom(tenantId)).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      userId,
      status: 'ONLINE',
      timestamp: new Date()
    });

    // ── Join Conversation Room ─────────────────────────────────
    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async (convoId: string) => {
      try {
        // Validate the conversation belongs to this tenant
        const conv = await prisma.conversation.findUnique({
          where: { id: convoId, tenantId: tenantId! }
        });
        if (!conv) return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Conversation not found' });

        socket.join(conversationRoom(convoId));
        console.log(`[Socket] ${userId} joined conversation ${convoId}`);
      } catch (err) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join conversation' });
      }
    });

    // ── Leave Conversation Room ────────────────────────────────
    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (convoId: string) => {
      socket.leave(conversationRoom(convoId));
    });

    // ── Send Message ───────────────────────────────────────────
    socket.on(SOCKET_EVENTS.MESSAGE_SEND, async (data: {
      conversationId: string;
      content: string;
      type?: string;
    }) => {
      try {
        const { conversationId, content, type = 'TEXT' } = data;

        // Validate conversation access
        const conv = await prisma.conversation.findUnique({
          where: { id: conversationId, tenantId: tenantId! }
        });
        if (!conv) return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Unauthorized' });

        // Persist message to DB
        const message = await prisma.message.create({
          data: {
            conversationId,
            content,
            type: type as any,
            senderType: 'AGENT',
            senderId: userId!,
          },
          include: {
            conversation: { select: { tenantId: true } }
          }
        });

        // Update conversation last-activity
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

        // Broadcast to everyone in the conversation room
        io.to(conversationRoom(conversationId)).emit(SOCKET_EVENTS.MESSAGE_NEW, message);

        // Also notify the tenant room (for sidebar unread counters)
        socket.to(tenantRoom(tenantId!)).emit(SOCKET_EVENTS.CONVERSATION_STATUS, {
          conversationId,
          lastMessage: { content, type, createdAt: message.createdAt },
          updatedAt: new Date()
        });

      } catch (err) {
        console.error('[Socket] message:send error', err);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to send message' });
      }
    });

    // ── Mark Messages as Read ──────────────────────────────────
    socket.on(SOCKET_EVENTS.MESSAGE_READ, async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        await prisma.message.updateMany({
          where: { conversationId, isRead: false, senderId: { not: userId } },
          data: { isRead: true }
        });

        // Notify others in the room that messages were read
        socket.to(conversationRoom(conversationId)).emit(SOCKET_EVENTS.MESSAGE_READ_ACK, {
          conversationId,
          userId,
          timestamp: new Date()
        });
      } catch (err) {
        console.error('[Socket] message:read error', err);
      }
    });

    // ── Typing Indicators ──────────────────────────────────────
    const typingUsers = new Map<string, Set<string>>(); // convoId → Set<userId>

    socket.on(SOCKET_EVENTS.TYPING_START, (data: { conversationId: string; userName: string }) => {
      const { conversationId, userName } = data;
      if (!typingUsers.has(conversationId)) typingUsers.set(conversationId, new Set());
      typingUsers.get(conversationId)!.add(userId!);

      socket.to(conversationRoom(conversationId)).emit(SOCKET_EVENTS.TYPING_UPDATE, {
        conversationId,
        userId,
        userName,
        isTyping: true
      });
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, (data: { conversationId: string }) => {
      const { conversationId } = data;
      typingUsers.get(conversationId)?.delete(userId!);

      socket.to(conversationRoom(conversationId)).emit(SOCKET_EVENTS.TYPING_UPDATE, {
        conversationId,
        userId,
        isTyping: false
      });
    });

    // ── Agent Status / Presence ────────────────────────────────
    socket.on(SOCKET_EVENTS.USER_STATUS, async (data: { status: string }) => {
      try {
        const validStatuses = ['ONLINE', 'AWAY', 'BUSY', 'OFFLINE'];
        const status = validStatuses.includes(data.status) ? data.status : 'ONLINE';

        await prisma.user.update({
          where: { id: userId },
          data: { status: status as any }
        });

        // Broadcast to all tenant members
        io.to(tenantRoom(tenantId!)).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
          userId,
          status,
          timestamp: new Date()
        });
      } catch (err) {
        console.error('[Socket] user:status error', err);
      }
    });

    // ── System Monitor ─────────────────────────────────────────
    socket.on(SOCKET_EVENTS.MONITOR_JOIN, () => {
      const { role } = socket;
      if (role === 'SUPERADMIN' || role === 'ADMIN') {
        socket.join(monitorRoom());
        console.log(`[Monitor] Account ${userId} subscribed to live system metrics`);
      } else {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Unauthorized for monitoring' });
      }
    });

    // ── Disconnect ─────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] Disconnected: user=${userId} reason=${reason}`);

      try {
        // Mark user as offline in DB
        await prisma.user.update({
          where: { id: userId },
          data: { status: 'OFFLINE' }
        });

        // Notify tenant
        socket.to(tenantRoom(tenantId!)).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
          userId,
          status: 'OFFLINE',
          timestamp: new Date()
        });
      } catch { /* ignore disconnect cleanup errors */ }
    });
  });

  return io;
};

// ─────────────────────────────────────────────────────────────
// SERVER-SIDE EMITTERS (used by REST controllers)
// ─────────────────────────────────────────────────────────────

export const emitToTenant = (tenantId: string, event: string, data: any) => {
  if (!io) return;
  io.to(tenantRoom(tenantId)).emit(event, data);
};

export const emitToConversation = (convoId: string, event: string, data: any) => {
  if (!io) return;
  io.to(conversationRoom(convoId)).emit(event, data);
};

export const getIO = () => io;
