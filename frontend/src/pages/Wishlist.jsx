import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight, X, Star } from 'lucide-react';
import { formatPrice } from '../data/storeData';

const Wishlist = ({ items = [], onRemove, onAddToCart }) => {
  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-xl">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <Heart size={42} fill="currentColor" />
            </div>

            <h1 className="mt-8 text-4xl font-black text-slate-950 text-center">Your Wishlist is empty</h1>
            <p className="mt-4 text-center text-slate-600 text-lg">Save items you love so you can checkout faster later.</p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10210f] px-8 py-4 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                Browse products
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-8 py-4 text-sm font-black text-slate-800 transition hover:border-emerald-700"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 mb-3">
                <Heart size={16} className="text-rose-700" fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-[0.1em] text-rose-700">Wishlist</span>
              </div>
              <h1 className="text-4xl font-black text-slate-950">Saved Items</h1>
              <p className="mt-2 text-slate-600">Manage your favorite products and add them to cart when ready.</p>
            </div>
            <div className="rounded-full bg-rose-100 px-6 py-3 text-lg font-black text-rose-900">{items.length} saved item(s)</div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg hover:border-slate-300">
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 h-56">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition group-hover:scale-110" 
                />
                {item.inStock === false && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white font-black text-lg">Out of Stock</p>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="mt-4">
                <h2 className="text-xl font-black text-slate-950 line-clamp-2">{item.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>

                {/* META */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.category && (
                    <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                  {item.rating && (
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {item.rating}
                    </span>
                  )}
                </div>

                {/* PRICE */}
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-2xl font-black text-slate-950">{formatPrice(item.price)}</p>
                  {item.originalPrice && (
                    <p className="text-sm font-bold text-slate-400 line-through">{formatPrice(item.originalPrice)}</p>
                  )}
                </div>

                {/* STOCK */}
                {item.stock !== undefined && (
                  <p className="mt-2 text-xs font-bold text-slate-600">
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(item)}
                  disabled={item.inStock === false}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#10210f] px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  <ShoppingCart size={18} /> Add to cart
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/product/${item._id}`}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 text-sm font-black text-slate-800 transition hover:border-emerald-700 hover:text-emerald-700"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemove(item._id)}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-sm font-black text-rose-700 transition hover:bg-rose-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-slate-200 p-8 text-center">
          <h3 className="text-2xl font-black text-slate-950">Ready to checkout?</h3>
          <p className="mt-2 text-slate-600">Add items to your cart and proceed to secure checkout.</p>
          <Link
            to="/cart"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-cyan-700 px-8 py-4 font-black text-white transition hover:scale-[1.02]"
          >
            View Cart
            <ShoppingCart size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
