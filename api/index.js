require('dotenv').config();
const app = require('../src/app');
const { connectMongoDB, connectPostgreSQL } = require('../src/config/database');

let dbConnected = false;

// Initialize databases on cold start
const initDatabases = async () => {
  if (!dbConnected) {
    await connectPostgreSQL();
    await connectMongoDB();
    dbConnected = true;
  }
};

// Serverless handler for Vercel
module.exports = async (req, res) => {
  try {
    await initDatabases();
    return app(req, res);
  } catch (error) {
    console.error('Serverless error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
