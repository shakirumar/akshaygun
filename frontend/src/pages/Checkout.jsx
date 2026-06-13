import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, Lock, MapPin, MessageCircle, PackageCheck, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { API_BASE_URL, formatPrice } from '../data/storeData';

const WHATSAPP_NUMBER = '919560686060'; // Saandeep Khanna – Akshaygun

const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Unable to load Razorpay checkout.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'));
    document.body.appendChild(script);
  });

const Checkout = ({ items, onClearCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const orderSummary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 100;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const requiredFieldsFilled = Object.values(formData).every((value) => value.trim());

  const createOrder = async (method, status = 'pending') => {
    const response = await axios.post(`${API_BASE_URL}/orders`, {
      items,
      customerInfo: formData,
      totalAmount: orderSummary.total,
      paymentMethod: method,
      paymentStatus: status,
    });
    return response.data;
  };

  const completeOfflineOrder = () => {
    const localId = `LOCAL-${Date.now()}`;
    const offlineOrder = {
      _id: localId,
      orderId: localId,
      items,
      customerInfo: formData,
      totalAmount: orderSummary.total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'processing',
    };
    localStorage.setItem(`akshaygun-order-${offlineOrder._id}`, JSON.stringify(offlineOrder));
    onClearCart();
    navigate(`/order-success/${offlineOrder._id}`);
  };

  const saveOrderBackup = (order) => {
    localStorage.setItem(`akshaygun-order-${order._id}`, JSON.stringify(order));
    localStorage.setItem(`akshaygun-order-${order.orderId}`, JSON.stringify(order));
  };

  const handleCODPayment = async () => {
    try {
      const order = await createOrder('cod');
      saveOrderBackup(order);
      onClearCart();
      navigate(`/order-success/${order._id}`);
    } catch {
      completeOfflineOrder();
    }
  };

  const handleWhatsAppOrder = () => {
    const itemLines = items
      .map((item) => `• ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');
    const message = [
      '🛒 *New Order – Akshaygun Pharma*',
      '',
      '*Items:*',
      itemLines,
      '',
      `*Total: ₹${orderSummary.total.toLocaleString('en-IN')}*`,
      '',
      '*Delivery Details:*',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `Address: ${formData.address}, ${formData.city}, ${formData.state} – ${formData.zipCode}`,
      '',
      'Payment: Cash on Delivery (COD)',
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleOnlinePayment = async () => {
    try {
      await loadRazorpayCheckout();

      const response = await axios.post(`${API_BASE_URL}/payment/razorpay/create-order`, {
        amount: orderSummary.total,
        items,
        customerInfo: formData,
      });

      if (response.data.demo) {
        saveOrderBackup(response.data.order);
        onClearCart();
        alert('Demo online payment completed successfully!');
        navigate(`/order-success/${response.data.orderId}`);
        return;
      }

      const options = {
        key: response.data.keyId,
        amount: response.data.amountPaise || Math.round(response.data.amount * 100),
        currency: response.data.currency || 'INR',
        name: 'Akshaygun Pharma',
        description: 'Payment for your pharmaceutical order',
        order_id: response.data.razorpayOrderId,
        handler: async function (rzpResponse) {
          setLoading(true);
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/payment/razorpay/verify`, {
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              orderId: response.data.orderId,
            });
            if (verifyRes.data.success) {
              saveOrderBackup(verifyRes.data.order);
              onClearCart();
              navigate(`/order-success/${verifyRes.data.order._id || response.data.orderId}`);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            alert('Payment verification error: ' + (err.response?.data?.message || err.message));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#10210f',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failure) => {
        alert(failure.error?.description || 'Payment failed. Please try again or choose Cash on Delivery.');
      });
      rzp.open();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          'Unable to initiate online payment. Please choose Cash on Delivery.'
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!requiredFieldsFilled) {
      alert('Please fill all delivery details before placing the order.');
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === 'cod') {
        await handleCODPayment();
      } else {
        await handleOnlinePayment();
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Unable to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">Your cart is empty</h1>
          <p className="mt-2 text-slate-600">Add items before checkout.</p>
          <Link to="/products" className="mt-6 inline-block rounded-full bg-[#10210f] px-7 py-3 font-black text-white">
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-black uppercase tracking-[0.25em] text-emerald-700">Secure Checkout</p>
        <h1 className="mt-4 text-5xl font-black text-slate-950 sm:text-6xl">Delivery & Payment</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          {/* Delivery Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10210f] text-[#b9f45f]">
                <MapPin size={21} />
              </div>
              <h2 className="text-2xl font-black text-slate-950">Delivery details</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['name', 'Full name', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone number', 'tel'],
                ['city', 'City', 'text'],
                ['state', 'State', 'text'],
                ['zipCode', 'PIN / ZIP code', 'text'],
              ].map(([name, label, type]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold text-slate-900 focus:border-emerald-700 focus:outline-none"
                    required
                  />
                </label>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black text-slate-700">Full address</span>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-900 focus:border-emerald-700 focus:outline-none"
                placeholder="House number, street, landmark"
                required
              />
            </label>
          </section>

          {/* Payment Method */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10210f] text-[#b9f45f]">
                <Wallet size={21} />
              </div>
              <h2 className="text-2xl font-black text-slate-950">Payment method</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <PackageCheck
                  size={23}
                  className={`mt-0.5 shrink-0 ${
                    paymentMethod === 'cod' ? 'text-emerald-800' : 'text-slate-500'
                  }`}
                />
                <span>
                  <span className="block font-black text-slate-950">Cash on Delivery (COD)</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-600">
                    Pay with cash or card upon delivery.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                  paymentMethod === 'razorpay'
                    ? 'border-emerald-700 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 text-xl font-bold ${
                    paymentMethod === 'razorpay' ? 'text-emerald-800' : 'text-slate-500'
                  }`}
                >
                  💳
                </div>
                <span>
                  <span className="block font-black text-slate-950">Online Payment</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-600">
                    Pay securely using UPI, Card, or Netbanking.
                  </span>
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h2 className="text-2xl font-black text-slate-950">Order summary</h2>

          <div className="mt-5 max-h-64 space-y-3 overflow-auto border-b border-slate-200 pb-5">
            {items.map((item) => (
              <div key={item._id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-slate-900">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="font-black text-slate-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-b border-slate-200 pb-5">
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(orderSummary.subtotal)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Shipping</span>
              <span>{orderSummary.shipping === 0 ? 'Free' : formatPrice(orderSummary.shipping)}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between text-2xl font-black text-slate-950">
            <span>Total</span>
            <span>{formatPrice(orderSummary.total)}</span>
          </div>

          {/* Place Order */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10210f] px-6 py-4 font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
          >
            {loading && <Loader className="animate-spin" size={19} />}
            {paymentMethod === 'cod' ? 'Place COD Order' : 'Pay & Place Order'}
          </button>

          {/* WhatsApp Order Button */}
          <button
            type="button"
            onClick={() => {
              if (!requiredFieldsFilled) {
                alert('Please fill your delivery details first.');
                return;
              }
              handleWhatsAppOrder();
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 px-6 py-4 font-black text-[#128C7E] transition hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle size={20} />
            Order via WhatsApp
          </button>

          <div className="mt-5 space-y-3 text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <Lock size={17} className="text-emerald-700" />
              Your information is encrypted and secure.
            </div>
            <div className="flex items-center gap-2">
              <Truck size={17} className="text-emerald-700" />
              Free shipping above ₹1,000.
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-700" />
              COD available pan-India.
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
