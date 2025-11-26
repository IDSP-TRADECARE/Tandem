/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  MemberJoinedData,
  ShareUpdatedData,
  MessageSentData,
  ShareId,
} from './types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export const initSocketHandlers = (io: TypedServer) => {
  io.on('connection', (socket: TypedSocket) => {
    console.log('✅ User connected:', socket.id);

    // Join a specific nanny share room
    socket.on('join-share', (shareId: ShareId) => {
      socket.join(`share-${shareId}`);
      console.log(`📌 Socket ${socket.id} joined share-${shareId}`);
    });

    // Leave a nanny share room
    socket.on('leave-share', (shareId: ShareId) => {
      socket.leave(`share-${shareId}`);
      console.log(`📤 Socket ${socket.id} left share-${shareId}`);
    });

    // Broadcast when a new member joins
    socket.on('member-joined', (data: MemberJoinedData) => {
      const { shareId, member } = data;
      socket.to(`share-${shareId}`).emit('member-joined', data);
      console.log(`👥 Member joined share-${shareId}:`, member.name);
    });

    // Broadcast share updates (emit full share when available, otherwise emit a lightweight id payload)
    socket.on('share-updated', (data: ShareUpdatedData) => {
      const { shareId, share } = data;

      // prepare a payload that matches ShareUpdatedPayload: either the full share or { id: ShareId }
      const payload = share ?? { id: shareId };

      // emit to room
      socket.to(`share-${shareId}`).emit('share-updated', payload);
      console.log(`🔄 Share updated: share-${shareId}`, payload);
    });

    // Handle chat messages - broadcast to everyone including sender
    socket.on('message-sent', (data: MessageSentData) => {
      const { shareId, message } = data;
      io.to(`share-${shareId}`).emit('message-received', message);
      console.log(`💬 Message sent to share-${shareId} by ${message.senderName}`);
    });

    // Notify share room when a user requests to join (host should be in the room)
    socket.on('nanny:request', (data: { shareId: ShareId; request: any }) => {
      try {
        const { shareId, request } = data;
        // broadcast to everyone in the share room (hosts will receive this)
        io.to(`share-${shareId}`).emit('nanny:request', { shareId, request });
        console.log(`📨 nanny:request for share-${shareId}:`, request?.name ?? request);
      } catch (err) {
        console.error('Error handling nanny:request', err);
      }
    });

    // Optional: notify room when a request is accepted (client already emits this)
    socket.on('nanny:request-accepted', (data: { shareId: ShareId; userId?: any; requestId?: string }) => {
      try {
        const { shareId, userId, requestId } = data;
        // In addition to emitting a 'nanny:request-accepted' event, also emit 'share-updated'
        io.to(`share-${shareId}`).emit('nanny:request-accepted', { shareId, userId, requestId });
        io.to(`share-${shareId}`).emit('share-updated', { id: shareId });
        console.log(`✅ nanny:request-accepted for share-${shareId}: user=${userId} request=${requestId}`);
      } catch (err) {
        console.error('Error handling nanny:request-accepted', err);
      }
    });

    // Optional: nanny:request-rejected for completeness
    socket.on('nanny:request-rejected', (data: { shareId: ShareId; requestId: string }) => {
      try {
        const { shareId, requestId } = data;
        io.to(`share-${shareId}`).emit('nanny:request-rejected', { shareId, requestId });
        console.log(`❌ nanny:request-rejected for share-${shareId}: request=${requestId}`);
      } catch (err) {
        console.error('Error handling nanny:request-rejected', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};