const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected successfully');
  } catch (error) {
    logger.error('PostgreSQL connection error:', error);
    throw error;
  }
};

const disconnectDatabases = async () => {
  await prisma.$disconnect();
  await mongoose.disconnect();
  logger.info('Databases disconnected');
};

const checkDatabaseHealth = async () => {
  const health = {
    postgres: false,
    mongodb: false,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.postgres = true;
  } catch (error) {
    logger.error('PostgreSQL health check failed:', error.message);
  }

  try {
    health.mongodb = mongoose.connection.readyState === 1;
  } catch (error) {
    logger.error('MongoDB health check failed:', error.message);
  }

  return health;
};

module.exports = {
  prisma,
  mongoose,
  connectMongoDB,
  connectPostgreSQL,
  disconnectDatabases,
  checkDatabaseHealth,
};
