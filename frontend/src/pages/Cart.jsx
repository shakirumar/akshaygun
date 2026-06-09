import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Tag,
  Gift,
  ArrowRight,
  CheckCircle2,
  BadgePercent,
  HeartHandshake,
} from 'lucide-react';

import { API_BASE_URL, formatPrice } from '../data/storeData';

const Cart = ({ items, onUpdateQuantity, onRemove }) => {
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const itemCount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [items]);

  useEffect(() => {
    const calculateTotal = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/cart/calculate`,
          { items }
        );

        setCartSummary(response.data);
      } catch {
        const subtotal = items.reduce(
          (sum, item) =>
            sum + item.price * item.quantity,
          0
        );

        const tax = subtotal * 0.1;

        const shipping =
          subtotal > 999 || subtotal === 0
            ? 0
            : 60;

        const discount = couponApplied
          ? subtotal * 0.1
          : 0;

        setCartSummary({
          subtotal,
          tax,
          shipping,
          discount,
          total:
            subtotal +
            tax +
            shipping -
            discount,
        });
      }
    };

    calculateTotal();
  }, [items, couponApplied]);

  const applyCoupon = () => {
    if (
      coupon.trim().toUpperCase() === 'SAVE10'
    ) {
      setCouponApplied(true);
    } else {
      alert('Invalid Coupon Code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#10210f] text-[#b9f45f] shadow-lg">
            <ShoppingBag size={42} />
          </div>

          <h1 className="mt-8 text-5xl font-black text-slate-950">
            Your Cart Is Empty
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Looks like you haven't added
            anything yet. Discover premium
            wellness products.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#28d81f] px-8 py-4 text-sm font-black text-white transition hover:bg-emerald-500"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      {/* HEADER */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6 lg:px-8">

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Shopping Cart
            </p>

            <h1 className="mt-3 text-5xl font-black text-slate-950">
              Review Your Order
            </h1>
          </div>

          <div className="rounded-full bg-[#10210f] px-6 py-3 text-sm font-black text-white shadow-lg">
            {itemCount} Items
          </div>
        </div>
      </section>

      {/* MAIN */}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">

        {/* CART ITEMS */}

        <section className="space-y-5">

          {items.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="grid gap-5 md:grid-cols-[150px_1fr_auto]">

                {/* IMAGE */}

                <div className="overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                      {item.category}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                      In Stock
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-slate-950">
                    {item.name}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">

                    <p className="text-3xl font-black text-slate-950">
                      {formatPrice(item.price)}
                    </p>

                    {item.originalPrice && (
                      <p className="text-lg font-bold text-slate-400 line-through">
                        {formatPrice(
                          item.originalPrice
                        )}
                      </p>
                    )}

                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">
                      Sale
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-row items-center justify-between gap-5 md:flex-col md:items-end">

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(item._id)
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* QUANTITY */}

                  <div className="flex items-center overflow-hidden rounded-2xl border border-slate-300">

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(
                          item._id,
                          item.quantity - 1
                        )
                      }
                      className="p-4 text-slate-700 transition hover:bg-slate-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-[55px] text-center text-lg font-black">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(
                          item._id,
                          item.quantity + 1
                        )
                      }
                      className="p-4 text-slate-700 transition hover:bg-slate-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {formatPrice(
                        item.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* FEATURES */}

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <Truck
                size={30}
                className="text-emerald-700"
              />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                Fast Delivery
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Safe & quick dispatch across
                India.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <ShieldCheck
                size={30}
                className="text-emerald-700"
              />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                Secure Payments
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Encrypted payment protection.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <HeartHandshake
                size={30}
                className="text-emerald-700"
              />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                Customer Support
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                We’re here to help anytime.
              </p>
            </div>
          </div>
        </section>

        {/* ORDER SUMMARY */}

        <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl lg:sticky lg:top-28">

          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-slate-950 sm:text-5xl">
              Order Summary
            </h2>

            <Gift
              size={28}
              className="text-emerald-700"
            />
          </div>

          {/* COUPON */}

          <div className="mt-7">

            <label className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-slate-700">
              Coupon Code
            </label>

            <div className="flex gap-3">

              <div className="relative flex-1">

                <Tag
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={coupon}
                  onChange={(e) =>
                    setCoupon(e.target.value)
                  }
                  placeholder="Enter SAVE10"
                  className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-700"
                />
              </div>

              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-2xl bg-[#10210f] px-5 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                Apply
              </button>
            </div>

            {couponApplied && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={18} />
                Coupon Applied Successfully
              </div>
            )}
          </div>

          {/* SUMMARY */}

          <div className="mt-8 space-y-5 border-b border-slate-200 pb-7">

            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold">
                Subtotal
              </span>

              <span className="font-black">
                {formatPrice(
                  cartSummary.subtotal
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold">
                Tax (10%)
              </span>

              <span className="font-black">
                {formatPrice(cartSummary.tax)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold">
                Shipping
              </span>

              <span
                className={`font-black ${
                  cartSummary.shipping === 0
                    ? 'text-emerald-700'
                    : ''
                }`}
              >
                {cartSummary.shipping === 0
                  ? 'FREE'
                  : formatPrice(
                      cartSummary.shipping
                    )}
              </span>
            </div>

            {couponApplied && (
              <div className="flex items-center justify-between text-emerald-700">
                <span className="flex items-center gap-2 font-black">
                  <BadgePercent size={18} />
                  Discount
                </span>

                <span className="font-black">
                  -
                  {formatPrice(
                    cartSummary.discount
                  )}
                </span>
              </div>
            )}
          </div>

          {/* TOTAL */}

          <div className="mt-8 flex items-center justify-between">
            <span className="text-3xl font-black text-slate-950">
              Total
            </span>

            <span className="text-4xl font-black text-slate-950 sm:text-5xl">
              {formatPrice(cartSummary.total)}
            </span>
          </div>

          {/* FREE SHIPPING */}

          {cartSummary.shipping > 0 && (
            <div className="mt-6 rounded-2xl bg-[#f5f9f3] p-4 text-sm font-bold text-slate-700">
              Add{' '}
              <span className="text-emerald-700">
                {formatPrice(
                  999 -
                    cartSummary.subtotal
                )}
              </span>{' '}
              more for FREE delivery.
            </div>
          )}

          {/* BUTTONS */}

          <Link
            to="/checkout"
            className="mt-7 flex h-14 items-center justify-center rounded-2xl text-sm bg-green-600 font-black text-white transition hover:bg-emerald-500"
          >
            Proceed To Checkout
          </Link>

          <Link
            to="/products"
            className="mt-4 flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white text-sm font-black text-slate-800 transition hover:border-emerald-700 hover:text-emerald-500"
          >
            Continue Shopping
          </Link>

          {/* TRUST BADGES */}

          <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">

            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <ShieldCheck
                size={18}
                className="text-emerald-700"
              />
              Secure payment gateway
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <Truck
                size={18}
                className="text-emerald-700"
              />
              Carefully packed delivery
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <CheckCircle2
                size={18}
                className="text-emerald-700"
              />
              100% genuine wellness products
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
