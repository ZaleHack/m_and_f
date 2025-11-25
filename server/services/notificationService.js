let io;

export const notificationService = {
  attach: (socketServer) => {
    io = socketServer;
  },
  notifyUser: (userId, payload) => {
    if (!io) return;
    io.to(String(userId)).emit('notification', payload);
  },
  broadcast: (payload) => {
    if (!io) return;
    io.emit('notification', payload);
  },
};
