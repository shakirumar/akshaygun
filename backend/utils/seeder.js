import Product from '../models/Product.js';
import { sampleProducts } from '../data/sampleProducts.js';

export const autoSeed = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Product catalog database is empty. Auto-seeding default products...');
      await Product.insertMany(sampleProducts);
      console.log('✅ Auto-seeded products successfully.');
    } else {
      console.log(`Product catalog database already has ${productCount} items. Skipping auto-seed.`);
    }
  } catch (error) {
    console.error('❌ Failed to run auto-seed on database startup:', error);
  }
};
