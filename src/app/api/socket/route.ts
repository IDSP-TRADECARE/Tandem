import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export async function GET(req: NextRequest) {
  if (!io) {
    // @ts-expect-error - Socket.IO types
    const httpServer: HTTPServer = req.socket.server;
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-share', (shareId: string) => {
        socket.join(`share-${shareId}`);
        console.log(`Client joined share room: share-${shareId}`);
      });

      socket.on('leave-share', (shareId: string) => {
        socket.leave(`share-${shareId}`);
        console.log(`Client left share room: share-${shareId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return new Response('Socket.IO server running', { status: 200 });
}

export { io };