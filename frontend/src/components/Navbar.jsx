import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Orders', to: '/orders' },
  { label: 'Services', to: '/services' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'About', to: '/about' },
];

const quickCategories = [
  'Antibiotics',
  'Pain Relief',
  'Cardiology',
  'Respiratory',
  'Vitamins',
  'Anti-Allergic',
];

const Navbar = ({ cartCount, wishlistCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    requestAnimationFrame(() => {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });
  }, [location.pathname, location.hash]);

  const navClass = ({ isActive }) =>
    `relative whitespace-nowrap rounded-full px-3 py-2 text-[0.86rem] font-bold leading-none tracking-normal transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-700 to-lime-500 text-white shadow-md'
        : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-slate-200 bg-white/80 shadow-lg backdrop-blur-xl'
            : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        {/* MAIN NAVBAR */}
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{
                type: 'spring',
                stiffness: 300,
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 opacity-40 blur-md" />

              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-md">
                <img
                  src={logo}
                  alt="Akshaygun"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <div className="leading-none">
              <span className="block bg-gradient-to-r from-[#10210f] to-emerald-600 bg-clip-text text-[1.55rem] font-extrabold leading-none tracking-normal text-transparent">
                Akshaygun
              </span>

              <div className="mt-1 flex items-center gap-1">
                <Sparkles
                  size={10}
                  className="text-emerald-600"
                />

                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-emerald-600">
                  Akshaygun Pharma
                </p>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-0.5 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-sm lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* SEARCH */}
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/products"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50"
              >
                <Search
                  size={18}
                  className="text-slate-700 transition-all group-hover:scale-110 group-hover:text-emerald-700"
                />
              </Link>
            </motion.div>

            {/* WISHLIST */}
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/wishlist"
                className="relative group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50"
              >
                <Heart
                  size={18}
                  className="text-slate-700 transition-all group-hover:scale-110 group-hover:text-pink-600"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-black text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* ACCOUNT */}
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/account"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-sky-300 hover:bg-sky-50"
              >
                <User
                  size={18}
                  className="text-slate-700 transition-all group-hover:scale-110 group-hover:text-sky-600"
                />
              </Link>
            </motion.div>

            {/* CART */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cart"
                className="relative flex h-9 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 text-emerald-900 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50"
              >
                <ShoppingBag size={18} className="text-emerald-700" />

                <span className="text-[0.82rem] font-semibold leading-none">
                  Cart
                </span>

                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-black text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* CART */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-900 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <ShoppingBag size={18} className="text-emerald-700" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MENU */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {isOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* CATEGORY BAR */}
        <div className="hidden border-t border-slate-200 bg-white/60 backdrop-blur-sm lg:block">
          <div className="mx-auto flex h-11 max-w-7xl items-center gap-2 overflow-x-auto px-6 scrollbar-hide">
            {quickCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(
                    category
                  )}`}
                  className="group flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200/60 bg-white/25 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-slate-900 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:text-emerald-900"
                >
                  {category}

                  <ChevronRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-14 z-40 border-b border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                  }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-700 to-lime-500 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    {item.label}

                    <ChevronRight size={16} />
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* MOBILE CATEGORIES */}
            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Trending Categories
              </p>

              <div className="grid grid-cols-2 gap-2">
                {quickCategories.map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(
                      category
                    )}`}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
