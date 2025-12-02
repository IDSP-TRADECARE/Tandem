/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  MemberJoinedData,
  MessageSentData,
  ShareId,
  RoomId,
} from './types';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export const initSocketHandlers = (io: TypedServer) => {
  io.on('connection', (socket: TypedSocket) => {
    console.log('✅ User connected:', socket.id);

    // Join a nanny share room
    socket.on('join-share', (shareId: ShareId) => {
      const roomName = `share-${shareId}`;
      socket.join(roomName);
      console.log(`📌 Socket ${socket.id} joined ${roomName}`);
    });

    // Leave a nanny share room
    socket.on('leave-share', (shareId: ShareId) => {
      const roomName = `share-${shareId}`;
      socket.leave(roomName);
      console.log(`📤 Socket ${socket.id} left ${roomName}`);
    });

    // Join a direct message room
    socket.on('join-dm', (roomId: RoomId) => {
      const roomName = `dm-${roomId}`;
      socket.join(roomName);
      console.log(`📌 Socket ${socket.id} joined ${roomName}`);
    });

    // Leave a direct message room
    socket.on('leave-dm', (roomId: RoomId) => {
      const roomName = `dm-${roomId}`;
      socket.leave(roomName);
      console.log(`📤 Socket ${socket.id} left ${roomName}`);
    });

    // Handle member joining a share
    socket.on('member-joined', (data: MemberJoinedData) => {
      try {
        const { shareId, member } = data;
        const roomName = `share-${shareId}`;
        io.to(roomName).emit('member-joined', { shareId, member });
        io.to(roomName).emit('share-updated', { id: shareId });
        console.log(`✅ member-joined for ${roomName}: ${member.name}`);
      } catch (err) {
        console.error('Error handling member-joined', err);
      }
    });

    // Handle messages (both group and direct)
    socket.on('message-sent', (data: MessageSentData) => {
      try {
        const { roomId, message } = data;
        // roomId is already formatted: "share-37" or "dm-user_XXX_user_YYY"
        console.log(`💬 Broadcasting message to room: ${roomId} from ${message.senderName}`);
        io.to(roomId).emit('message-received', message);
      } catch (err) {
        console.error('Error handling message-sent', err);
      }
    });

    // Nanny request events
    socket.on('nanny:request', (data: { shareId: ShareId; request: any }) => {
      try {
        const { shareId, request } = data;
        const roomName = `share-${shareId}`;
        io.to(roomName).emit('nanny:request', { shareId, request });
        console.log(`✅ nanny:request for ${roomName}: ${request.name}`);
      } catch (err) {
        console.error('Error handling nanny:request', err);
      }
    });

    socket.on('nanny:request-accepted', (data: { shareId: ShareId; userId?: any; requestId?: string }) => {
      try {
        const { shareId, userId, requestId } = data;
        const roomName = `share-${shareId}`;
        io.to(roomName).emit('nanny:request-accepted', { shareId, userId, requestId });
        io.to(roomName).emit('share-updated', { id: shareId });
        console.log(`✅ nanny:request-accepted for ${roomName}: user=${userId} request=${requestId}`);
      } catch (err) {
        console.error('Error handling nanny:request-accepted', err);
      }
    });

    socket.on('nanny:request-rejected', (data: { shareId: ShareId; requestId: string }) => {
      try {
        const { shareId, requestId } = data;
        const roomName = `share-${shareId}`;
        io.to(roomName).emit('nanny:request-rejected', { shareId, requestId });
        console.log(`❌ nanny:request-rejected for ${roomName}: request=${requestId}`);
      } catch (err) {
        console.error('Error handling nanny:request-rejected', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};