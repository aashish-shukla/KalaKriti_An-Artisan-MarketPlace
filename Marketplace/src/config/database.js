const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env');

const connectWithUri = async (uri, label) => {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info(`MongoDB connected via ${label}: ${conn.connection.host}`);
  return conn;
};

const connectDB = async () => {
  try {
    const connectionUris = config.mongodb.getConnectionUris();

    if (connectionUris.length === 0) {
      throw new Error('No MongoDB connection URI configured');
    }

    let lastError = null;

    for (const [index, uri] of connectionUris.entries()) {
      const label = index === 0 ? 'primary URI' : 'fallback URI';

      try {
        await connectWithUri(uri, label);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;

        if (index === 0 && connectionUris.length > 1) {
          logger.warn(`Primary MongoDB connection failed, trying fallback URI: ${error.message}`);
        }
      }
    }

    if (lastError) {
      if (config.nodeEnv === 'production') {
        throw lastError;
      }

      logger.warn(`MongoDB unavailable in ${config.nodeEnv} mode, starting without a database connection: ${lastError.message}`);
    }

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
