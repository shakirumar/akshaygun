import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  Copy,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Clock3,
  XCircle,
  Sparkles,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';

import { API_BASE_URL, formatPrice } from '../data/storeData';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  processing: 'bg-sky-100 text-sky-700 border border-sky-200',
  shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border border-rose-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  failed: 'bg-rose-100 text-rose-700 border border-rose-200',
  paid: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const OrderSuccess = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/${orderId}`
        );

        setOrder(response.data);
        setNotificationEmail(response.data.customerInfo?.email || '');

        localStorage.setItem(
          `akshaygun-order-${response.data._id}`,
          JSON.stringify(response.data)
        );

        localStorage.setItem(
          `akshaygun-order-${response.data.orderId}`,
          JSON.stringify(response.data)
        );
      } catch {
        const localOrder =
          localStorage.getItem(`akshaygun-order-${orderId}`) ||
          localStorage.getItem(
            `akshaygun-order-${String(orderId).replace(/^ORD-/, '')}`
          );

        if (localOrder) {
          const parsedOrder = JSON.parse(localOrder);
          setOrder(parsedOrder);
          setNotificationEmail(parsedOrder.customerInfo?.email || '');
        } else {
          setOrder(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const subtotal = useMemo(
    () =>
      (order?.items || []).reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      ),
    [order]
  );

  const shipping =
    order?.totalAmount && subtotal
      ? Math.max(
          Number(order.totalAmount) -
            subtotal,
          0
        )
      : 0;

  const displayOrderId =
    order?.orderId || order?._id || orderId;

  const copyOrderId = async () => {
    await navigator.clipboard?.writeText(
      displayOrderId
    );

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  // CANCEL ORDER
  const cancelOrder = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setCancelLoading(true);

      const cancelUrl = `${API_BASE_URL}/orders/${displayOrderId}/cancel`;
      console.log('Cancelling order at:', cancelUrl);

      const response = await axios.patch(cancelUrl);

      if (response.data?.order) {
        const updatedOrder = response.data.order;
        setOrder(updatedOrder);

        localStorage.setItem(
          `akshaygun-order-${displayOrderId}`,
          JSON.stringify(updatedOrder)
        );

        alert('Order cancelled successfully! A refund confirmation has been sent to your email.');
      }
    } catch (error) {
      console.error('Cancel order error:', error.response || error.message);

      const isLocalOrder =
        order?._id?.startsWith('LOCAL-') ||
        order?.orderId?.startsWith('LOCAL-');

      if (isLocalOrder) {
        const updatedOrder = {
          ...order,
          orderStatus: 'cancelled',
          paymentStatus: 'refunded',
        };

        setOrder(updatedOrder);
        localStorage.setItem(
          `akshaygun-order-${displayOrderId}`,
          JSON.stringify(updatedOrder)
        );

        alert('Local order cancelled successfully. Your cart order has been updated locally.');
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to cancel order. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleNotificationSubmit = async (event) => {
    event.preventDefault();
    setNotificationStatus('');

    const email = notificationEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotificationStatus('Please enter a valid email address to receive order notifications.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/orders/${displayOrderId}/send-notification`, {
        email,
        message: notificationMessage.trim(),
      });

      setNotificationStatus(
        `Thank you! Order updates will be sent to ${email}. We have saved your request.`
      );

      // Reset message field after successful submission
      setNotificationMessage('');
    } catch (error) {
      console.error(error);
      setNotificationStatus(
        error.response?.data?.message ||
          'Failed to subscribe for notifications. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />

          <p className="mt-5 text-lg font-black text-slate-700">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <AlertTriangle
            size={60}
            className="mx-auto text-amber-500"
          />

          <h1 className="mt-6 text-4xl font-black text-slate-950">
            Order Not Found
          </h1>

          <p className="mt-4 text-slate-600">
            The order may not exist or the backend
            server is currently unavailable.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 to-cyan-700 px-6 py-4 font-black text-white"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-6 py-4 font-black text-slate-800"
            >
              <Home size={18} />
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950 to-cyan-900">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-md">
                <Sparkles
                  size={15}
                  className="text-yellow-300"
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  Order Confirmation
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
                Thank You For
                <span className="block bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  Your Purchase
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-slate-300">
                Your pharmaceutical order has been
                successfully placed and is being
                processed securely.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-200">
                Order Number
              </p>

              <div className="mt-3 flex items-center gap-3">
                <h2 className="max-w-xs break-all text-2xl font-black text-white">
                  {displayOrderId}
                </h2>

                <button
                  onClick={copyOrderId}
                  className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                >
                  <Copy size={16} />
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-sm font-bold text-emerald-300">
                  Copied Successfully
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* STATUS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <CreditCard
                      className="text-emerald-700"
                      size={22}
                    />

                    <span className="font-black text-slate-600">
                      Payment
                    </span>
                  </div>

                  <div
                    className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black capitalize ${
                      statusStyles[
                        order.paymentStatus
                      ] ||
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {order.paymentStatus || 'pending'}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Truck
                      className="text-emerald-700"
                      size={22}
                    />

                    <span className="font-black text-slate-600">
                      Delivery
                    </span>
                  </div>

                  <div
                    className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black capitalize ${
                      statusStyles[
                        order.orderStatus
                      ] ||
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {order.orderStatus || 'processing'}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Clock3
                      className="text-emerald-700"
                      size={22}
                    />

                    <span className="font-black text-slate-600">
                      Estimated
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-black text-slate-950">
                    2-5 Days
                  </p>
                </div>
              </div>
            </div>

            {/* ITEMS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <PackageCheck
                  size={26}
                  className="text-emerald-700"
                />

                <h2 className="text-3xl font-black text-slate-950">
                  Ordered Items
                </h2>
              </div>

              <div className="space-y-5">
                {(order.items || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-28 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-black text-slate-950">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          Quantity: {item.quantity || 1}
                        </p>

                        <p className="mt-3 text-sm font-bold text-slate-700">
                          {formatPrice(item.price || 0)} each
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-black text-emerald-700">
                          {formatPrice(
                            Number(item.price || 0) *
                              Number(
                                item.quantity || 1
                              )
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <MapPin
                  size={26}
                  className="text-emerald-700"
                />

                <h2 className="text-3xl font-black text-slate-950">
                  Delivery Details
                </h2>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-xl font-black text-slate-950">
                  {order.customerInfo?.name ||
                    'Customer'}
                </p>

                <div className="mt-5 space-y-3 text-slate-600">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>
                      {
                        order.customerInfo?.address
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>
                      {order.customerInfo?.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    <span>
                      {order.customerInfo?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <Mail size={26} className="text-emerald-700" />
                <h2 className="text-3xl font-black text-slate-950">
                  Email Notifications
                </h2>
              </div>

              <p className="text-sm font-semibold text-slate-600">
                Enter your email below to receive order status updates and delivery notifications.
              </p>

              <form onSubmit={handleNotificationSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Email address</span>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(event) => setNotificationEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-slate-900 outline-none focus:border-emerald-700"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-700">Message (optional)</span>
                  <textarea
                    value={notificationMessage}
                    onChange={(event) => setNotificationMessage(event.target.value)}
                    rows={4}
                    placeholder="Let us know if you want any special delivery instructions or updates."
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-700"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#10210f] px-6 text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  Subscribe for updates
                </button>

                {notificationStatus && (
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                    {notificationStatus}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-8">
            {/* SUMMARY */}
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-3xl font-black text-slate-950">
                Order Summary
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>Subtotal</span>

                  <span>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-slate-600">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? 'Free'
                      : formatPrice(shipping)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <div className="flex justify-between text-3xl font-black text-slate-950">
                    <span>Total</span>

                    <span>
                      {formatPrice(
                        order.totalAmount ||
                          subtotal +
                            shipping
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* CANCEL BUTTON */}
              {order.orderStatus !== 'cancelled' && (
                <button
                  onClick={cancelOrder}
                  disabled={cancelLoading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 font-black text-rose-700 transition hover:bg-rose-100"
                >
                  <XCircle size={20} />

                  {cancelLoading
                    ? 'Cancelling...'
                    : 'Cancel Order'}
                </button>
              )}

              <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-5 text-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck
                    size={18}
                    className="text-emerald-700"
                  />

                  Secure Payment Protected
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <Truck
                    size={18}
                    className="text-emerald-700"
                  />

                  Tracking shared after dispatch
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-4 font-black text-slate-800 transition hover:border-emerald-700 hover:text-emerald-800"
                >
                  <Home size={18} />
                  Back Home
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 from-slate-900 to-emerald-900 px-5 py-4 font-black text-white"
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
