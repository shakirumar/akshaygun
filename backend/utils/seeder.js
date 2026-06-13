import Product from '../models/Product.js';
import { sampleProducts } from '../data/sampleProducts.js';

export const autoSeed = async () => {
  try {
    const forceSeed = process.env.FORCE_SEED === 'true';
    if (forceSeed) {
      console.log('FORCE_SEED is active. Clearing product catalog database...');
      await Product.deleteMany({});
    }
    const productCount = await Product.countDocuments();
    if (productCount === 0 || forceSeed) {
      console.log('Auto-seeding product catalog...');
      await Product.insertMany(sampleProducts);
      console.log('✅ Seeding completed successfully.');
    } else {
      console.log(`Product catalog database already has ${productCount} items. Skipping auto-seed.`);
    }
  } catch (error) {
    console.error('❌ Failed to run auto-seed on database startup:', error);
  }
};
