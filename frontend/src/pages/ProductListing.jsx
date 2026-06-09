import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL, categories, getProductList, mergeWithLocalProducts, sampleProducts } from '../data/storeData';
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react';

const priceRanges = [
  { label: 'All prices', value: 'all', min: 0, max: Infinity },
  { label: 'Under Rs. 300', value: '0-300', min: 0, max: 300 },
  { label: 'Rs. 300 - Rs. 700', value: '300-700', min: 300, max: 700 },
  { label: 'Above Rs. 700', value: '700+', min: 700, max: Infinity },
];

const ProductListing = ({ addToCart, wishlistItems, onToggleWishlist }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const selectedCategory = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(mergeWithLocalProducts(getProductList(response.data, [])));
      } catch {
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateCatalogParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const range = priceRanges.find((item) => item.value === priceRange) || priceRanges[0];
    const term = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => selectedCategory === 'All' || product.category === selectedCategory)
      .filter((product) => !term || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term))
      .filter((product) => product.price >= range.min && product.price <= range.max)
      .filter((product) => (product.rating || 0) >= minRating)
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return String(b._id).localeCompare(String(a._id));
        return (b.reviews || 0) - (a.reviews || 0);
      });
  }, [products, selectedCategory, searchTerm, priceRange, minRating, sortBy]);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setPriceRange('all');
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-2xl bg-[#10210f] text-white">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:p-10">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-[#b9f45f]">Product Catalog</p>
            <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">Pharmaceutical Products</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              Browse all Akshaygun product photos with clear names, prices, secure checkout, and quick WhatsApp ordering.
            </p>
          </div>
          <div className="flex items-end">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={searchTerm}
                onChange={(event) => updateCatalogParams({ search: event.target.value })}
                placeholder="Search products"
                className="h-14 w-full rounded-2xl border border-white/20 bg-white px-12 font-semibold text-slate-950 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => updateCatalogParams({ search: '' })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={20} />
              <h2 className="text-xl font-black text-slate-950">Filters</h2>
            </div>
            <button onClick={clearFilters} className="text-sm font-black text-emerald-800">
              Reset
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => updateCatalogParams({ category })}
                      className="h-4 w-4 accent-emerald-700"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Price</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === range.value}
                      onChange={() => setPriceRange(range.value)}
                      className="h-4 w-4 accent-emerald-700"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Minimum Rating</h3>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={(event) => setMinRating(Number(event.target.value))}
                className="w-full accent-emerald-700"
              />
              <p className="mt-2 text-sm font-bold text-slate-700">{minRating === 0 ? 'Any rating' : `${minRating}+ stars`}</p>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <SlidersHorizontal size={18} />
              <p className="font-black">{filteredProducts.length} products available</p>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm font-bold text-slate-700 sm:w-56"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : filteredProducts.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={(productId) => navigate(`/product/${productId}`)}
                  isWishlisted={wishlistItems.some((item) => item._id === product._id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-xl font-black text-slate-950">No products found</p>
              <p className="mt-2 text-slate-600">Try another search or clear your filters.</p>
              <button onClick={clearFilters} className="mt-5 rounded-full bg-[#10210f] px-6 py-3 text-sm font-black text-white">
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductListing;
