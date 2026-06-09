import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  ArrowRight,
  Copy,
  PackageSearch,
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Package,
  Sparkles
} from 'lucide-react';

import { API_BASE_URL, formatPrice } from '../data/storeData';

const OrderLookup = () => {
  const navigate = useNavigate();

  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const localOrders = useMemo(() => {
    const seen = new Set();

    return Object.keys(localStorage)
      .filter((key) => key.startsWith('akshaygun-order-'))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter((item) => {
        const id = item._id || item.orderId;

        if (!id || seen.has(id)) return false;

        seen.add(id);

        return true;
      })
      .sort((a, b) =>
        String(b.createdAt || b._id || '').localeCompare(
          String(a.createdAt || a._id || '')
        )
      );
  }, []);

  const findOrder = async (event) => {
    event.preventDefault();

    const id = orderQuery.trim();

    if (!id) return;

    setLoading(true);
    setMessage('');
    setOrder(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${id}`);

      setOrder(response.data);

      localStorage.setItem(
        `akshaygun-order-${response.data._id}`,
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        `akshaygun-order-${response.data.orderId}`,
        JSON.stringify(response.data)
      );
    } catch {
      const savedOrder = localStorage.getItem(`akshaygun-order-${id}`);

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      } else {
        setMessage(
          'Order not found. Please check your order number or backend server.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const displayOrderId = order?.orderId || order?._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950 to-cyan-900">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-md">
              <Sparkles size={15} className="text-yellow-300" />

              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                Order Tracking
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
              Track Your
              <span className="block bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                Pharmaceutical Orders
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Instantly check order status, payment details, shipment progress,
              and medicine delivery information.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={findOrder}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                value={orderQuery}
                onChange={(event) => setOrderQuery(event.target.value)}
                placeholder="Enter order ID or tracking number"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-14 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              disabled={loading}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-cyan-700 px-8 font-black text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-70"
            >
              <PackageSearch size={20} />

              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">
            {message}
          </div>
        )}
      </section>

      {/* ORDER DETAILS */}
      {order && (
        <section className="mx-auto mt-10 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* LEFT */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              {/* TOP */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-emerald-900 p-6 text-white">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                      Order Number
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <h2 className="break-all text-2xl font-black">
                        {displayOrderId}
                      </h2>

                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard?.writeText(displayOrderId || '')
                        }
                        className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/order-success/${order._id || order.orderId}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-900 transition hover:bg-slate-100"
                  >
                    Full Details
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-5 p-6">
                {(order.items || []).map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-700">
                        {formatPrice(
                          Number(item.price || 0) *
                            Number(item.quantity || 1)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <aside className="space-y-6">
              {/* SUMMARY */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-2xl font-black text-slate-950">
                  Order Summary
                </h3>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-emerald-700" size={20} />

                      <span className="font-bold text-slate-600">
                        Payment
                      </span>
                    </div>

                    <span className="font-black capitalize text-slate-950">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-700" size={20} />

                      <span className="font-bold text-slate-600">
                        Method
                      </span>
                    </div>

                    <span className="font-black capitalize text-slate-950">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="text-emerald-700" size={20} />

                      <span className="font-bold text-slate-600">
                        Status
                      </span>
                    </div>

                    <span className="font-black capitalize text-emerald-700">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-cyan-700 p-5 text-white">
                    <p className="text-sm font-bold uppercase tracking-wide text-white/80">
                      Total Amount
                    </p>

                    <h4 className="mt-2 text-3xl font-black">
                      {formatPrice(order.totalAmount || 0)}
                    </h4>
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Package className="text-emerald-700" size={22} />

                  <h3 className="text-2xl font-black text-slate-950">
                    Delivery Info
                  </h3>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  <p className="text-lg font-black text-slate-950">
                    {order.customerInfo?.name}
                  </p>

                  <p className="mt-2">
                    {order.customerInfo?.address}
                  </p>

                  <p>
                    {[
                      order.customerInfo?.city,
                      order.customerInfo?.state,
                      order.customerInfo?.zipCode
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* RECENT ORDERS */}
      {!order && localOrders.length > 0 && (
        <section className="mx-auto mt-12 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-950">
              Recent Orders
            </h2>

            <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
              Local Storage
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {localOrders.slice(0, 4).map((item) => (
              <button
                key={item._id || item.orderId}
                type="button"
                onClick={() =>
                  navigate(`/order-success/${item._id || item.orderId}`)
                }
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="font-black text-slate-950">
                    {item.orderId || item._id}
                  </p>

                  <ArrowRight className="transition group-hover:translate-x-1" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-600">
                  {formatPrice(item.totalAmount || 0)} ·{' '}
                  {item.items?.length || 0} item(s)
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="pb-20 text-center">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-cyan-700 px-8 py-4 text-sm font-black text-white shadow-lg transition hover:scale-105"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderLookup;