import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';
import { initializeCache } from './services/cacheService.js';
import { notificationService } from './services/notificationService.js';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: env.socketOrigin, methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(String(userId));
  }
});

notificationService.attach(io);
initializeCache(env.redisUrl);

httpServer.listen(env.port, () => {
  console.log(`API M&F Eats démarrée sur http://localhost:${env.port}`);
});
