import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL, getProductList, sampleProducts } from '../data/storeData';
import { getProductImagePath } from '../utils/images';

import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Headphones,
  Leaf,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';

const promiseItems = [
  { icon: BadgeCheck, title: 'WHO-GMP Certified', sub: 'Licensed pharmaceutical distributor' },
  { icon: Truck, title: 'Pan-India Delivery', sub: 'Emergency orders 24/7 available' },
  { icon: CreditCard, title: 'Secure Payment', sub: 'UPI, COD & Razorpay accepted' },
  { icon: Headphones, title: '24/7 Support', sub: 'Emergency medicine requests' },
];

const categories = [
  { title: 'Pain Relief', text: 'Fast-acting pain relievers and anti-inflammatories.', image: getProductImagePath('WhatsApp Image 2026-05-24 at 17.01.28.jpeg') },
  { title: 'Antibiotics', text: 'FDA-approved bacterial infection treatments.', image: getProductImagePath('WhatsApp Image 2026-05-24 at 17.01.30.jpeg') },
  { title: 'Cardiac Care', text: 'Heart health and blood pressure management.', image: getProductImagePath('WhatsApp Image 2026-05-24 at 17.01.40.jpeg') },
  { title: 'Respiratory Support', text: 'Asthma and respiratory disease medications.', image: getProductImagePath('WhatsApp Image 2026-05-24 at 17.01.45.jpeg') },
];

const featureTiles = [
  { icon: Leaf, title: 'FDA Approved Drugs', copy: 'Licensed medicines with quality certifications.' },
  { icon: ShieldCheck, title: 'Trusted Checkout', copy: 'Encrypted and secure payment experience.' },
  { icon: PackageCheck, title: 'Real-time Tracking', copy: 'Monitor your medicine delivery in real-time.' },
];

const SectionLabel = ({ children }) => (
  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
    {children}
  </p>
);

const SectionHeading = ({ children, className = '' }) => (
  <h2 className={`mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl ${className}`}>
    {children}
  </h2>
);

const ViewAllButton = ({ onClick, label = 'View All' }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-600 hover:text-emerald-700"
  >
    {label}
    <ArrowRight size={15} />
  </button>
);

const Home = ({ addToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products?limit=8`);
        setProducts(getProductList(response.data));
      } catch (error) {
        console.log(error);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const productList = Array.isArray(products) ? products : sampleProducts;
  const heroProduct = productList[0] || sampleProducts[0];
  const topProducts = useMemo(() => productList.slice(0, 4), [productList]);
  const saleProducts = useMemo(() => productList.filter(p => p.originalPrice && p.inStock).slice(0, 3), [productList]);
  const newArrivals = useMemo(() => productList.slice(4, 8), [productList]);

  return (
    <div className="w-full overflow-hidden bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1a0b] via-[#0f2a0e] to-[#064e3b]">
        {/* Subtle bg texture */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        {/* Radial glow */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="flex flex-col justify-center"
          >
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#c8f075] backdrop-blur">
              <Sparkles size={13} />
              Licensed Pharmaceutical Distributor
            </div>

            <h1 className="text-4xl font-black leading-[1.1] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Trusted Medicines
              <span className="mt-1 block text-[#b9f45f]">
                Delivered Reliably
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
              WHO-GMP certified medicines, anti-cancer drugs, and life-saving
              pharmaceutical solutions with fast delivery and secure checkout.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#b9f45f] px-6 text-sm font-black text-[#0b1a0b] transition hover:bg-white hover:scale-[1.03]"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                to="/best-sellers"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Best Sellers <Star size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-8 grid max-w-sm grid-cols-3 gap-3 sm:max-w-md">
              {[['4.9★', 'Customer Rating'], ['5,000+', 'Orders Delivered'], ['COD', 'Available']].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/8 p-4 text-center backdrop-blur"
                >
                  <p className="text-xl font-black text-white sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Featured product card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/12 bg-white/8 p-4 shadow-2xl backdrop-blur-xl sm:max-w-md">
              <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-xl">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700 border border-emerald-100">
                    Featured Product
                  </span>

                  <h2 className="mt-3 text-xl font-black leading-snug text-slate-900">
                    {heroProduct.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {heroProduct.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-2xl font-black text-slate-900">
                      ₹{Number(heroProduct.price).toFixed(0)}
                    </p>
                    <button
                      type="button"
                      onClick={() => addToCart(heroProduct)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0b1a0b] px-4 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      <ShoppingBag size={15} /> Add to Cart
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/product/${heroProduct._id}`)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-700"
                  >
                    View Details <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROMISE STRIP ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-4 lg:-mt-8">
          {promiseItems.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b1a0b] text-[#b9f45f]">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{title}</h3>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <SectionLabel>Explore</SectionLabel>
            <SectionHeading>Shop by Category</SectionHeading>
          </div>
          <ViewAllButton onClick={() => navigate('/products')} label="View All" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={`/products?category=${encodeURIComponent(cat.title)}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-50 to-lime-50 p-3">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-black text-slate-900">{cat.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{cat.text}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-black text-emerald-700">
                  Shop Now <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SALE PRODUCTS ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Special Offers</SectionLabel>
              <SectionHeading>On Sale Right Now</SectionHeading>
            </div>
            <ViewAllButton onClick={() => navigate('/products')} label="Shop Sale" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                onViewDetails={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Fresh Picks</SectionLabel>
              <SectionHeading>New Arrivals</SectionHeading>
            </div>
            <ViewAllButton onClick={() => navigate('/products')} label="Explore New" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                onViewDetails={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING / BEST SELLERS ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <SectionLabel>Best Sellers</SectionLabel>
              <SectionHeading>Trending Products</SectionHeading>
            </div>
            <ViewAllButton onClick={() => navigate('/products')} label="View All" />
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {topProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURE TILES ── */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {featureTiles.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1a0b] to-emerald-800 p-8 text-white shadow-2xl sm:p-12">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#c8f075]">
                Natural Wellness
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Start your wellness journey today.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                Trusted products, premium quality and a smooth shopping experience
                designed for everyday wellness.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                to="/products"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#b9f45f] px-6 text-sm font-black text-[#0b1a0b] transition hover:bg-white hover:scale-[1.03]"
              >
                Explore Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
