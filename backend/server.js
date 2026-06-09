import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns/promises';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import storeRoutes from './routes/store.js';
import pharmaRoutes from './routes/pharmaceuticals.js';
import authRoutes from './routes/auth.js';
import { autoSeed } from './utils/seeder.js';

dotenv.config();

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
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/akshaygun';

const connectWithRetry = async (retries = 5, delay = 2000) => {
  try {
    if (mongoUri.startsWith('mongodb+srv://')) {
      try {
        const host = mongoUri.split('@')[1].split('/')[0];
        await dns.resolveSrv(host);
      } catch (dnsErr) {
        console.warn('SRV DNS lookup warning:', dnsErr && dnsErr.message ? dnsErr.message : dnsErr);
        console.warn('If SRV lookups fail, check your network/DNS or use a standard (mongodb://) connection string.');
      }
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    });
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (retries > 0) {
      console.log(`Retrying MongoDB connection in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry(retries - 1, Math.min(delay * 2, 30000));
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts. Check:');
      console.error('- Network access / Atlas IP whitelist (add your IP or 0.0.0.0/0 for development)');
      console.error('- DNS resolution for your cluster host (try `nslookup <cluster-host>` or `dig`)');
      console.error('- That the connection string contains the database name (e.g. /akshaygun)');
      process.exit(1);
    }
  }
};

// Wait for MongoDB to connect before starting the server
await connectWithRetry();
await autoSeed();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/pharma', pharmaRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve the production React build from the same Hostinger Node app.
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../frontend/dist');

  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
    });
  } else {
    throw err;
  }
});
