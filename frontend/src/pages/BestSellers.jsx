import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { sampleProducts } from '../data/storeData';

const tabs = [
  "Men's Health",
  'Skin Care',
  'Lifestyle diseases',
  'Sexual wellness',
  "Women's Health",
  'Gut Health',
];

const BestSellers = ({ onAddToCart, wishlistItems, onToggleWishlist }) => {
  const [active, setActive] = useState(tabs[0]);

  const filtered = sampleProducts.filter((p) => {
    if (active === "Men's Health") return p.category === "Men's Health";
    if (active === 'Skin Care') return p.category === 'Skin Care';
    if (active === "Women's Health") return p.category === "Women's Health";
    if (active === 'Gut Health') return p.category === 'Gut Health';
    // fallback show popular/best sellers
    return p.badge || p.rating >= 4.6;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-extrabold">All Time Best Sellers</h1>

      <div className="mt-6 flex items-center justify-center gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap text-sm font-semibold px-3 py-2 ${active === tab ? 'text-slate-900' : 'text-slate-400'}`}
          >
            <span className={active === tab ? 'border-b-2 border-slate-900 pb-3' : ''}>{tab}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 8).map((product) => (
          <div key={product._id}>
            <ProductCard
              product={product}
              onAddToCart={() => onAddToCart?.(product)}
              isWishlisted={wishlistItems.some((item) => item._id === product._id)}
              onToggleWishlist={onToggleWishlist}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/products" className="inline-flex items-center gap-3 border-t-2 border-slate-900 pt-4 text-sm font-black text-slate-900">
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default BestSellers;
