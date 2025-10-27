import { Server as SocketIOServer, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  MemberJoinedData,
  ShareUpdatedData,
  MessageSentData,
} from './types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export const initSocketHandlers = (io: TypedServer) => {
  io.on('connection', (socket: TypedSocket) => {
    console.log('✅ User connected:', socket.id);

    // Join a specific nanny share room
    socket.on('join-share', (shareId: string) => {
      socket.join(`share-${shareId}`);
      console.log(`📌 Socket ${socket.id} joined share-${shareId}`);
    });

    // Leave a nanny share room
    socket.on('leave-share', (shareId: string) => {
      socket.leave(`share-${shareId}`);
      console.log(`📤 Socket ${socket.id} left share-${shareId}`);
    });

    // Broadcast when a new member joins
    socket.on('member-joined', (data: MemberJoinedData) => {
      const { shareId, member } = data;
      socket.to(`share-${shareId}`).emit('member-joined', data);
      console.log(`👥 Member joined share-${shareId}:`, member.name);
    });

    // Broadcast share updates
    socket.on('share-updated', (data: ShareUpdatedData) => {
      const { shareId, share } = data;
      socket.to(`share-${shareId}`).emit('share-updated', share);
      console.log(`🔄 Share updated: share-${shareId}`);
    });

    // Handle chat messages - broadcast to everyone including sender
    socket.on('message-sent', (data: MessageSentData) => {
      const { shareId, message } = data;
      io.to(`share-${shareId}`).emit('message-received', message);
      console.log(`💬 Message sent to share-${shareId} by ${message.senderName}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};