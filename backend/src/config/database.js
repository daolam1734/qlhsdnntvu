// src/config/database.js
// PostgreSQL database connection configuration

const { Pool } = require('pg');
const env = require('./env');

// Create connection pool
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL,
  max: env.DB_MAX_CONNECTIONS,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT,
});

// Handle pool events
pool.on('connect', (client) => {
  if (env.isDevelopment()) {
    console.log('New client connected to the database');
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.isDevelopment()) {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

// Transaction helper function
const getTransaction = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    return client;
  } catch (err) {
    client.release();
    throw err;
  }
};

// Rollback helper
const rollback = async (client) => {
  try {
    await client.query('ROLLBACK');
  } catch (err) {
    console.error('Error rolling back transaction:', err);
  } finally {
    client.release();
  }
};

// Commit helper
const commit = async (client) => {
  try {
    await client.query('COMMIT');
  } catch (err) {
    console.error('Error committing transaction:', err);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  testConnection,
  getTransaction,
  rollback,
  commit
};