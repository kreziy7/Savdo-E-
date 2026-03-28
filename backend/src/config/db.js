const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Drop any legacy unique indexes that conflict with our schema.
 * The shared 'smart-user-db' may have pre-existing indexes from other projects.
 */
const cleanLegacyIndexes = async () => {
  const db = mongoose.connection.db;

  // Drop unique index on 'phone' — we allow multiple users with empty phone
  try {
    await db.collection('users').dropIndex('phone_1');
    logger.info('Dropped legacy unique index: users.phone_1');
  } catch (_) {
    // Index does not exist — that's fine
  }

  // Drop any other unexpected unique indexes on non-unique fields
  const indexesToDrop = ['avatar_1'];
  for (const idx of indexesToDrop) {
    try {
      await db.collection('users').dropIndex(idx);
      logger.info(`Dropped legacy index: users.${idx}`);
    } catch (_) {}
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    await cleanLegacyIndexes();

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
