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

const configuredDnsServers = (
  process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1'
)
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (configuredDnsServers.length) {
  try {
    setServers(configuredDnsServers);
  } catch (error) {
    console.warn('Unable to apply custom MongoDB DNS servers:', error.message);
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));
app.use(express.json({ limit: '8mb' }));

// MongoDB Connection with retries and clearer diagnostics



const DEFAULT_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || 'akshaygun';

const hasMongoProtocol = (uri) =>
  uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');

const getMongoPath = (uri) => {
  const withoutProtocol = uri.split('://')[1] || '';
  const withoutQuery = withoutProtocol.split('?')[0];
  const slashIndex = withoutQuery.indexOf('/');

  if (slashIndex === -1) return '';

  return withoutQuery.slice(slashIndex + 1);
};

const ensureMongoDatabaseName = (uri) => {
  if (!uri || !hasMongoProtocol(uri)) return uri;

  if (getMongoPath(uri)) return uri;

  const [beforeQuery, query = ''] = uri.split('?');
  const separator = beforeQuery.endsWith('/') ? '' : '/';
  const suffix = query ? `?${query}` : '';

  console.warn(
    `MONGODB_URI has no database name. Using "/${DEFAULT_DB_NAME}" for this connection.`
  );

  return `${beforeQuery}${separator}${DEFAULT_DB_NAME}${suffix}`;
};

const getSrvHost = (uri) => {
  const withoutProtocol = uri.split('://')[1] || '';
  const afterAuth = withoutProtocol.includes('@')
    ? withoutProtocol.split('@').pop()
    : withoutProtocol;

  return afterAuth.split('/')[0].split('?')[0];
};

const rawMongoUri = (process.env.MONGODB_URI || '').trim();
const mongoUri = ensureMongoDatabaseName(
  rawMongoUri || `mongodb://localhost:27017/${DEFAULT_DB_NAME}`
);
const mongoConnectOptions = {
  serverSelectionTimeoutMS:
    Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 15000,
  socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS) || 45000,
  connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 10000,
};
const mongoConnectRetries = Number(process.env.MONGODB_CONNECT_RETRIES ?? 5);
const mongoConnectRetryDelay =
  Number(process.env.MONGODB_CONNECT_RETRY_DELAY_MS) || 2000;

// Warn early if the URI is missing a database name (Mongoose would default to "test")
function hasDatabaseName(uri) {
  try {
    const afterAuth = uri.includes('@') ? uri.split('@')[1] : uri.split('://')[1];
    const pathPart = afterAuth.split('/')[1]; // segment after host, before '?'
    return Boolean(pathPart && pathPart.split('?')[0].length > 0);
  } catch {
    return false;
  }
}

if (!hasDatabaseName(mongoUri)) {
  console.warn('Warning: MONGODB_URI has no database name — Mongoose will default to "test".');
}

const connectWithRetry = async (
  retries = mongoConnectRetries,
  delay = mongoConnectRetryDelay
) => {
  try {
    if (mongoUri.startsWith('mongodb+srv://')) {
      try {
        const host = getSrvHost(mongoUri);
        // SRV records for mongodb+srv live under _mongodb._tcp.<host>, not <host> itself
        await dnsPromises.resolveSrv(`_mongodb._tcp.${host}`);
      } catch (dnsErr) {
        console.warn('SRV DNS lookup failed:', dnsErr?.message || dnsErr);
        console.warn(
          'If this keeps failing, set MONGODB_DNS_SERVERS or use a standard mongodb:// connection string.'
        );
      }
    }

    await mongoose.connect(mongoUri, mongoConnectOptions);

    console.log(`MongoDB connected: db="${mongoose.connection.name}"`);
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);

    if (retries > 0) {
      console.log(`Retrying MongoDB connection in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectWithRetry(retries - 1, Math.min(delay * 2, 30000));
    }

    console.error('Failed to connect to MongoDB after multiple attempts. Check:');
    console.error('- Network access / Atlas IP whitelist (add your IP or 0.0.0.0/0 for development)');
    console.error('- DNS resolution for your cluster host (try `nslookup -type=SRV _mongodb._tcp.<cluster-host>`)');
    console.error('- That the connection string contains the database name (e.g. /akshaygun)');
    process.exit(1);
  }
};

// Monitor connection health after the initial connect succeeds
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message || err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Close the connection cleanly on shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));


await connectWithRetry();

// Seed data safely
try {
  await autoSeed();
  console.log('✅ Seeder completed');
} catch (error) {
  console.error('⚠️ Seeder failed:', error.message);
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/pharma', pharmaRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Akshaygun Backend Running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Server is running'
  });
});

// React build (only if frontend exists)
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(
    __dirname,
    '../frontend/dist'
  );

  try {
    app.use(express.static(clientDistPath));

    app.get('*', (req, res) => {
      res.sendFile(
        path.join(clientDistPath, 'index.html')
      );
    });
  } catch (err) {
    console.warn(
      'Frontend build not found. Skipping static hosting.'
    );
  }
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
