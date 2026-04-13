import { io, Socket } from 'socket.io-client';

// ─────────────────────────────────────────────────────────────
// Single source of truth for all socket event names
// (mirrors backend socket.server.ts SOCKET_EVENTS)
// ─────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Room
  JOIN_CONVERSATION: 'join:conversation',
  LEAVE_CONVERSATION: 'leave:conversation',

  // Messages
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',
  MESSAGE_READ_ACK: 'message:read_ack',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_UPDATE: 'typing:update',

  // Conversations
  CONVERSATION_NEW: 'conversation:new',
  CONVERSATION_ASSIGNED: 'conversation:assigned',
  CONVERSATION_RESOLVED: 'conversation:resolved',
  CONVERSATION_STATUS: 'conversation:status',
  CONVERSATION_TAGS: 'conversation:tags',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  USER_STATUS: 'user:status',

  // System Monitor
  MONITOR_JOIN: 'monitor:join',
  MONITOR_METRICS: 'monitor:metrics',
  MONITOR_ALERT: 'monitor:alert',
} as const;

// ─────────────────────────────────────────────────────────────
// Singleton Socket instance
// ─────────────────────────────────────────────────────────────

let socket: Socket | null = null;

export const getSocket = (): Socket | null => socket;

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('error', (err) => {
    console.error('[Socket] Error:', err);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connect error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ─────────────────────────────────────────────────────────────
// Convenience helpers
// ─────────────────────────────────────────────────────────────

export const joinConversation = (conversationId: string) => {
  socket?.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);
};

export const leaveConversation = (conversationId: string) => {
  socket?.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, conversationId);
};

export const sendMessageViaSocket = (conversationId: string, content: string, type = 'TEXT') => {
  socket?.emit(SOCKET_EVENTS.MESSAGE_SEND, { conversationId, content, type });
};

export const sendTypingStart = (conversationId: string, userName: string) => {
  socket?.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userName });
};

export const sendTypingStop = (conversationId: string) => {
  socket?.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
};

export const markConversationRead = (conversationId: string) => {
  socket?.emit(SOCKET_EVENTS.MESSAGE_READ, { conversationId });
};

export const setAgentStatus = (status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE') => {
  socket?.emit(SOCKET_EVENTS.USER_STATUS, { status });
};

export const joinMonitor = () => {
  socket?.emit(SOCKET_EVENTS.MONITOR_JOIN);
};
