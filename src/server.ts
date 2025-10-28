import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketHandlers } from './lib/socket/socketHandler';

const port = 3001; // Different port from Next.js (which uses 3000)

const httpServer = createServer();

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Next.js runs on 3000
    methods: ['GET', 'POST'],
  },
});

// Initialize socket handlers
initSocketHandlers(io);

httpServer
  .once('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Socket.IO server running on http://localhost:${port}`);
  });