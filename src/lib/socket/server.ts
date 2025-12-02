/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initSocketIO(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join any room (share or DM)
    socket.on('join-share', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined ${roomId}`);
    });

    socket.on('leave-share', (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left ${roomId}`);
    });

    // Handle messages (works for both share and DM)
    socket.on('message-sent', (data: { shareId: string; message: any }) => {
      const { shareId, message } = data;
      const roomId = shareId.startsWith('dm-') ? shareId : `share-${shareId}`;
      console.log(`Message sent to ${roomId} by ${message.senderName}`);
      io!.to(roomId).emit('message-received', message);
    });

    // Nanny request events
    socket.on('nanny:request', (data: { shareId: string; request: any }) => {
      const { shareId, request } = data;
      console.log(`Received nanny:request for share-${shareId}:`, request.name);
      io!.to(`share-${shareId}`).emit('nanny:request', { shareId, request });
    });

    socket.on('nanny:request-accepted', (data: { shareId: string; userId?: string | null; requestId?: string }) => {
      const { shareId, userId, requestId } = data;
      console.log(`Request accepted for share-${shareId}, user: ${userId}`);
      io!.to(`share-${shareId}`).emit('nanny:request-accepted', { shareId, userId, requestId });
      io!.to(`share-${shareId}`).emit('share-updated', { id: shareId });
    });

    socket.on('nanny:request-rejected', (data: { shareId: string; requestId: string }) => {
      const { shareId, requestId } = data;
      console.log(`Request rejected for share-${shareId}, request: ${requestId}`);
      io!.to(`share-${shareId}`).emit('nanny:request-rejected', { shareId, requestId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}