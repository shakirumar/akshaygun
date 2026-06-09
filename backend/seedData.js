import Product from './models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { sampleProducts } from './data/sampleProducts.js';

dotenv.config();


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/akshaygun');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ ${result.length} products seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
