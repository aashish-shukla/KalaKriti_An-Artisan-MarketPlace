const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const { Server } = require('socket.io');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  logger.info(`API Version: ${config.apiVersion}`);
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    // TODO: Verify JWT token if needed for authenticated connections
    socket.userId = socket.handshake.auth.userId;
  }
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join user-specific room for targeted notifications
  if (socket.userId) {
    socket.join(`user:${socket.userId}`);
  }

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available globally for services
global.io = io;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});
