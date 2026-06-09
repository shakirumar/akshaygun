import express from 'express';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';

const router = express.Router();

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .flatMap((line) => line.split(','))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildProductPayload = (body) => {
  const stock = Number(body.stock || 0);
  const images = toArray(body.images);
  const image = String(body.image || images[0] || '').trim();

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price: Number(body.price || 0),
    originalPrice: body.originalPrice === '' || body.originalPrice == null ? undefined : Number(body.originalPrice),
    category: String(body.category || '').trim(),
    image,
    images: images.length ? images : image ? [image] : [],
    stock,
    rating: body.rating === '' || body.rating == null ? 0 : Number(body.rating),
    reviews: body.reviews === '' || body.reviews == null ? 0 : Number(body.reviews),
    badge: String(body.badge || '').trim(),
    benefits: toArray(body.benefits),
    usage: String(body.usage || '').trim(),
    ingredients: String(body.ingredients || '').trim(),
    weight: String(body.weight || '').trim(),
    shelf_life: String(body.shelf_life || '').trim(),
    inStock: stock > 0,
  };
};

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Admin login required' });
  }

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secretkey');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin login' });
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (for admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = new Product(buildProductPayload(req.body));
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (for admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      buildProductPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (for admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
