import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dnsPromises from 'dns/promises';
import { setDefaultResultOrder, setServers } from 'dns';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import storeRoutes from './routes/store.js';
import pharmaRoutes from './routes/pharmaceuticals.js';
import authRoutes from './routes/auth.js';
import { autoSeed } from './utils/seeder.js';

dotenv.config();
setDefaultResultOrder('ipv4first');

const configuredDnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
  .split(',').map((s) => s.trim()).filter(Boolean);

if (configuredDnsServers.length) {
  try { setServers(configuredDnsServers); }
  catch (error) { console.warn('Unable to apply custom DNS servers:', error.message); }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',').map((o) => o.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: '8mb' }));

const DEFAULT_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || 'akshaygun';

const ensureMongoDatabaseName = (uri) => {
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) return uri;
  const withoutProtocol = uri.split('://')[1] || '';
  const withoutQuery = withoutProtocol.split('?')[0];
  const slashIndex = withoutQuery.indexOf('/');
  if (slashIndex !== -1 && withoutQuery.slice(slashIndex + 1).length > 0) return uri;
  const [beforeQuery, query = ''] = uri.split('?');
  const separator = beforeQuery.endsWith('/') ? '' : '/';
  const suffix = query ? `?${query}` : '';
  console.warn(`MONGODB_URI missing database name — using /${DEFAULT_DB_NAME}`);
  return `${beforeQuery}${separator}${DEFAULT_DB_NAME}${suffix}`;
};

const getSrvHost = (uri) => {
  const withoutProtocol = uri.split('://')[1] || '';
  const afterAuth = withoutProtocol.includes('@') ? withoutProtocol.split('@').pop() : withoutProtocol;
  return afterAuth.split('/')[0].split('?')[0];
};

const rawMongoUri = (process.env.MONGODB_URI || '').trim();
const mongoUri = ensureMongoDatabaseName(
  rawMongoUri || `mongodb://localhost:27017/${DEFAULT_DB_NAME}`
);

const mongoConnectOptions = {
  serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 15000,
  socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS) || 45000,
  connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 10000,
};

const mongoConnectRetries = Number(process.env.MONGODB_CONNECT_RETRIES ?? 3);
const mongoConnectRetryDelay = Number(process.env.MONGODB_CONNECT_RETRY_DELAY_MS) || 2000;

const connectWithRetry = async (retries = mongoConnectRetries, delay = mongoConnectRetryDelay) => {
  try {
    if (mongoUri.startsWith('mongodb+srv://')) {
      try {
        const host = getSrvHost(mongoUri);
        await dnsPromises.resolveSrv(`_mongodb._tcp.${host}`);
      } catch (dnsErr) {
        console.warn('SRV DNS lookup failed:', dnsErr?.message);
      }
    }
    await mongoose.connect(mongoUri, mongoConnectOptions);
    console.log(`MongoDB connected: db="${mongoose.connection.name}"`);
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    if (retries > 0) {
      console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectWithRetry(retries - 1, Math.min(delay * 2, 30000));
    }
    console.error('MongoDB connection failed after all retries. Server will continue without DB.');
    return false;
  }
};

mongoose.connection.on('error', (err) => console.error('MongoDB runtime error:', err.message));
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/pharma', pharmaRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    status: 'Server is running',
    database: states[mongoose.connection.readyState] || 'unknown',
    env: process.env.NODE_ENV,
  });
});

// ── Serve React frontend in production ──────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../frontend/dist');
  console.log('Serving frontend from:', clientDistPath);
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ── Start server FIRST, connect MongoDB in background ───────
// This prevents 503 errors on Hostinger — server is immediately ready
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`);

  connectWithRetry()
    .then(async (connected) => {
      if (connected) {
        try {
          await autoSeed();
          console.log('✅ Seeder completed');
        } catch (e) {
          console.error('⚠️ Seeder failed:', e.message);
        }
      }
    })
    .catch((e) => console.error('MongoDB startup error:', e?.message));
});
