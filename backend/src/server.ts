import { createServer } from 'http';
import app from './app';
import { initSocket } from './socket/socket.server';

const PORT = process.env.PORT || 4000;

// Create HTTP server wrapping the Express app
const httpServer = createServer(app);

// Attach Socket.io to the same HTTP server
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 HTTP + WebSocket server ready at: http://localhost:${PORT}`);
  console.log(`📡 Socket.io listening on ws://localhost:${PORT}`);
});
