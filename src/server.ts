import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketHandlers } from './lib/socket/socketHandler';

const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

const httpServer = createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Socket.IO server is running' }));
    return;
  }
  
  res.writeHead(404);
  res.end();
});

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: clientUrl,
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
    console.log(`> Socket.IO server running on port ${port}`);
    console.log(`> Accepting connections from ${clientUrl}`);
  });