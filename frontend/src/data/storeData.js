import { publicImageNames } from './assetImages';

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL;

const defaultLocalApi =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';

export const API_BASE_URL = configuredApiUrl || defaultLocalApi;

export const categories = [
  'All',
  'Sexual Health',
  'Anti-Parasitic',
  'Hormone Therapy',
  'Oral Jelly',
  'Tablets',
  'Cream',
  'Women Health',
];

// Real pharma products from Akshaygun / Shree Bhairav International
// Each product is mapped to its real WhatsApp image from the public folder
const catalogProducts = [
  {
    name: 'Poxet-60 (Dapoxetine 60mg)',
    description: 'Dapoxetine Tablets IP 60mg – Sunrise Remedies | 10×10 Tablets | For premature ejaculation treatment',
    price: 3760,
    originalPrice: 4500,
    category: 'Sexual Health',
    rating: 4.9,
    reviews: 312,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.28.jpeg',
    badge: 'Best Seller',
  },
  {
    name: 'Kamagra Oral Jelly 100mg',
    description: 'Sildenafil Oral Jelly 100mg – Ajanta Pharma | 7×5gm Sachets, 7 assorted flavours | 1 week pack',
    price: 385,
    originalPrice: 500,
    category: 'Oral Jelly',
    rating: 4.8,
    reviews: 524,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.30.jpeg',
    badge: 'Popular',
  },
  {
    name: 'Super Kamagra Oral Jelly',
    description: 'Sildenafil 100mg + Dapoxetine 60mg Oral Jelly – Ajanta Pharma | 7×5gm Sachets | Orange flavour',
    price: 490,
    originalPrice: 650,
    category: 'Oral Jelly',
    rating: 4.8,
    reviews: 289,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.37.jpeg',
    badge: 'New',
  },
  {
    name: 'Tadarise-2.5 (Tadalafil 2.5mg)',
    description: 'Tadalafil Tablets IP 2.5mg – Sunrise Remedies | 10×10 Tablets | Daily use for erectile dysfunction',
    price: 1000,
    originalPrice: 1300,
    category: 'Sexual Health',
    rating: 4.7,
    reviews: 198,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.29.jpeg',
    badge: '',
  },
  {
    name: 'Lovegra Oral Jelly 100mg',
    description: 'Sildenafil Oral Jelly 100mg for women – Ajanta Pharma | Rose Flavour | 7×5gm Sachets',
    price: 490,
    originalPrice: 600,
    category: 'Women Health',
    rating: 4.6,
    reviews: 156,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.31.jpeg',
    badge: '',
  },
  {
    name: 'Iverheal-3 (Ivermectin 3mg)',
    description: 'Ivermectin Tablets USP 3mg – Healing Pharma | 10×10 Tablets | Anti-parasitic treatment',
    price: 1500,
    originalPrice: 2000,
    category: 'Anti-Parasitic',
    rating: 4.8,
    reviews: 401,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.32.jpeg',
    badge: '',
  },
  {
    name: 'Iversun-12 (Ivermectin 12mg)',
    description: 'Ivermectin Dispersible Tablets 12mg – Sunrise Remedies | 10×10 Tablets | MRP Rs.2500',
    price: 2500,
    originalPrice: 3200,
    category: 'Anti-Parasitic',
    rating: 4.9,
    reviews: 445,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.39.jpeg',
    badge: 'Best Seller',
  },
  {
    name: 'Poxet-30 (Dapoxetine 30mg)',
    description: 'Dapoxetine Tablets IP 30mg – Sunrise Remedies | 10×10 Tablets | MRP Rs.2570 | For premature ejaculation',
    price: 2570,
    originalPrice: 3200,
    category: 'Sexual Health',
    rating: 4.7,
    reviews: 234,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.43.jpeg',
    badge: '',
  },
  {
    name: 'Poxet-90 (Dapoxetine 90mg)',
    description: 'Dapoxetine HCl Tablets 90mg – Sunrise Remedies | 10×10 Tablets | Maximum strength formula',
    price: 4500,
    originalPrice: 5500,
    category: 'Sexual Health',
    rating: 4.8,
    reviews: 178,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.41.jpeg',
    badge: '',
  },
  {
    name: 'Malegra 100 (Sildenafil 100mg)',
    description: 'Sildenafil Tablets IP 100mg – Sunrise Remedies | 10×10 Tablets | MRP Rs.250/strip of 10',
    price: 2500,
    originalPrice: 3000,
    category: 'Sexual Health',
    rating: 4.7,
    reviews: 312,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.44.jpeg',
    badge: 'Popular',
  },
  {
    name: 'Cenforce-100 (Sildenafil 100mg)',
    description: 'Sildenafil Citrate Tablets IP 100mg – Centurion Remedies | 10×10 Tablets | MRP Rs.250/strip',
    price: 2500,
    originalPrice: 3200,
    category: 'Tablets',
    rating: 4.8,
    reviews: 567,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.48.jpeg',
    badge: 'New',
  },
  {
    name: 'Testoheal (Testosterone 40mg)',
    description: 'Testosterone Undecanoate Capsules 40mg – Healing Pharma | 3×10 Capsules | Hormone therapy',
    price: 1800,
    originalPrice: 2400,
    category: 'Hormone Therapy',
    rating: 4.6,
    reviews: 143,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.38.jpeg',
    badge: '',
  },
  {
    name: 'Iverheal-12 (Ivermectin 12mg)',
    description: 'Ivermectin Tablets USP 12mg – Healing Pharma | 10×10 Tablets | MRP Rs.388/strip of 10',
    price: 3880,
    originalPrice: 4800,
    category: 'Anti-Parasitic',
    rating: 4.9,
    reviews: 289,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.45.jpeg',
    badge: '',
  },
  {
    name: 'Iversun 1% Cream (Ivermectin)',
    description: 'Ivermectin Cream 1% W/W – Sunrise Remedies | 30gm | For external use only – skin conditions',
    price: 650,
    originalPrice: 900,
    category: 'Cream',
    rating: 4.5,
    reviews: 98,
    imageKey: 'WhatsApp Image 2026-05-24 at 17.01.47.jpeg',
    badge: '',
  },
];

export const sampleProducts = catalogProducts.map((product, index) => {
  const serial = String(index + 1).padStart(3, '0');
  const imageName = product.imageKey || publicImageNames[index % publicImageNames.length];

  return {
    _id: `ag-public-${serial}`,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    category: product.category,
    image: `/${imageName}`,
    images: [`/${imageName}`],
    stock: 50 + (index * 5),
    rating: product.rating,
    reviews: product.reviews,
    inStock: true,
    badge: product.badge || '',
    benefits: ['Quality checked', 'Secure ordering', 'Fast dispatch'],
    usage: 'Use as directed on the product label or as advised by a registered medical practitioner.',
    ingredients: 'See product packaging for full composition.',
    weight: 'Standard pack',
    shelf_life: 'Check package date',
    whatsappButton: true,
  };
});

export const getProductList = (value, fallback = sampleProducts) => {
  if (Array.isArray(value) && value.length) {
    return value;
  }

  return fallback;
};

export const mergeWithLocalProducts = (products = []) => {
  const validProducts = Array.isArray(products) ? products : [];
  const seen = new Set(validProducts.map((product) => product.image || product._id));
  const missingLocalProducts = sampleProducts.filter((product) => !seen.has(product.image));

  return [...validProducts, ...missingLocalProducts];
};

export const formatPrice = (value = 0) => `₹${Number(value).toLocaleString('en-IN')}`;

export const getSampleProduct = (id) =>
  sampleProducts.find((product) => product._id === id) || sampleProducts[0];
