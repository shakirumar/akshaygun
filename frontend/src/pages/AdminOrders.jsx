import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Lock, LogOut, PackageCheck, RefreshCw, Search, Trash2 } from 'lucide-react';
import { API_BASE_URL, formatPrice } from '../data/storeData';

const AdminOrders = () => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('akshaygun-admin-token') || '');
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [orderStatusInput, setOrderStatusInput] = useState('pending');
  const [paymentStatusInput, setPaymentStatusInput] = useState('pending');

  useEffect(() => {
    if (selectedOrder) {
      setOrderStatusInput(selectedOrder.orderStatus || 'pending');
      setPaymentStatusInput(selectedOrder.paymentStatus || 'pending');
    }
  }, [selectedOrder]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setMessage('');
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/orders/${selectedOrder._id || selectedOrder.orderId}/status`,
        {
          orderStatus: orderStatusInput,
          paymentStatus: paymentStatusInput,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      const updatedOrder = response.data.order;
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setSelectedOrder(updatedOrder);
      setMessage(response.data.message || 'Order status updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to update order status.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    const confirmed = window.confirm(
      'Delete this order permanently from the database? This action cannot be undone.'
    );
    if (!confirmed) return;

    setActionLoading(true);
    setMessage('');
    try {
      await axios.delete(
        `${API_BASE_URL}/orders/${selectedOrder._id || selectedOrder.orderId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order._id !== selectedOrder._id)
      );
      setSelectedOrder(null);
      setMessage('Order deleted successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to delete the order.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setOrders(response.data);
      setSelectedOrder(response.data[0] || null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load admin orders.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('akshaygun-admin-token');
        setAdminToken('');
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    Promise.resolve().then(fetchOrders);
  }, [fetchOrders]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, adminForm);
      localStorage.setItem('akshaygun-admin-token', response.data.token);
      setAdminToken(response.data.token);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('akshaygun-admin-token');
    setAdminToken('');
    setOrders([]);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    const confirmed = window.confirm(
      'Cancel this order? This action cannot be undone.'
    );
    if (!confirmed) return;

    setActionLoading(true);
    setMessage('');

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/orders/${selectedOrder._id || selectedOrder.orderId}/cancel`
      );

      const updatedOrder = response.data.order;
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setSelectedOrder(updatedOrder);
      setMessage(response.data.message || 'Order cancelled successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to cancel the order. Please try again.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const term = search.trim().toLowerCase();
  const filteredOrders = term
    ? orders.filter((order) =>
        `${order.orderId} ${order.customerInfo?.name} ${order.customerInfo?.email} ${order.customerInfo?.phone}`
          .toLowerCase()
          .includes(term)
      )
    : orders;

  if (!adminToken) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10210f] text-[#b9f45f]">
              <Lock size={23} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Admin orders</p>
              <h1 className="text-3xl font-black text-slate-950">Login to view orders</h1>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="email"
              value={adminForm.email}
              onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold"
              placeholder="Admin email"
              required
            />
            <input
              type="password"
              value={adminForm.password}
              onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold"
              placeholder="Admin password"
              required
            />
            {message && <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{message}</p>}
            <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10210f] px-5 font-black text-white disabled:opacity-70">
              <Lock size={18} />
              {loading ? 'Checking...' : 'Login as Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-2xl bg-[#10210f] p-6 text-white shadow-sm sm:p-8">
        <p className="font-black uppercase tracking-[0.18em] text-[#b9f45f]">Admin orders</p>
        <h1 className="mt-2 text-4xl font-black">Order details dashboard</h1>
        <p className="mt-3 max-w-2xl text-white/75">View customer orders, item details, payment status, delivery address, and order totals.</p>
      </section>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-emerald-900">{orders.length} order(s) available for admin review.</p>
        <div className="flex gap-2">
          <button onClick={fetchOrders} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-800 shadow-sm">
            <RefreshCw size={17} />
            Refresh
          </button>
          <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-800 shadow-sm hover:text-rose-600">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      {message && <p className="mb-5 rounded-xl bg-rose-50 p-4 font-bold text-rose-700">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders" className="h-12 w-full rounded-xl border border-slate-300 bg-white px-11 font-semibold" />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl bg-white p-6 font-bold text-slate-600">Loading orders...</div>
            ) : filteredOrders.length ? (
              filteredOrders.map((order) => (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                    selectedOrder?._id === order._id ? 'border-emerald-700' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <p className="font-black text-slate-950">{order.orderId}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{order.customerInfo?.name || 'Customer'}</p>
                  <div className="mt-3 flex items-center justify-between text-sm font-bold">
                    <span className="capitalize text-emerald-700">{order.paymentStatus}</span>
                    <span className="text-slate-950">{formatPrice(order.totalAmount || 0)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-6 font-bold text-slate-600">No orders found.</div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedOrder ? (
            <>
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">Selected order</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">{selectedOrder.orderId}</h2>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-600">{selectedOrder.orderStatus} · {selectedOrder.paymentMethod}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-right">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Total</p>
                  <p className="text-xl font-black text-slate-950">{formatPrice(selectedOrder.totalAmount || 0)}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Order Number</p>
                  <p className="font-mono text-base font-bold text-slate-950 mt-1">{selectedOrder.orderId}</p>
                </div>
                {['pending', 'processing'].includes(selectedOrder.orderStatus) && (
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      disabled={actionLoading}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100 disabled:opacity-70"
                    >
                      {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <h3 className="font-black text-slate-950 text-lg">Manage Order Status</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-end">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Order Status</span>
                    <select
                      value={orderStatusInput}
                      onChange={(e) => setOrderStatusInput(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-semibold text-slate-800 focus:border-emerald-700 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Payment Status</span>
                    <select
                      value={paymentStatusInput}
                      onChange={(e) => setPaymentStatusInput(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-semibold text-slate-800 focus:border-emerald-700 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateStatus}
                      disabled={actionLoading}
                      className="grow inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-black text-white hover:bg-emerald-800 transition disabled:opacity-70"
                    >
                      Update Status
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteOrder}
                      disabled={actionLoading}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition disabled:opacity-70"
                      title="Delete Order"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="font-black text-slate-950">Customer</h3>
                  <div className="mt-3 rounded-xl bg-[#f6f8f4] p-4 text-sm leading-6 text-slate-600">
                    <p className="font-black text-slate-950">{selectedOrder.customerInfo?.name}</p>
                    <p>{selectedOrder.customerInfo?.email}</p>
                    <p>{selectedOrder.customerInfo?.phone}</p>
                    <p className="mt-2">{selectedOrder.customerInfo?.address}</p>
                    <p>{[selectedOrder.customerInfo?.city, selectedOrder.customerInfo?.state, selectedOrder.customerInfo?.zipCode].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-950">Status</h3>
                  <div className="mt-3 rounded-xl bg-[#f6f8f4] p-4 text-sm font-bold text-slate-600">
                    <p>Payment: <span className="capitalize text-slate-950">{selectedOrder.paymentStatus}</span></p>
                    <p className="mt-2">Order: <span className="capitalize text-slate-950">{selectedOrder.orderStatus}</span></p>
                    <p className="mt-2">Payment ID: <span className="text-slate-950">{selectedOrder.razorpayPaymentId || selectedOrder.paymentId || 'Not available'}</span></p>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 font-black text-slate-950">Items</h3>
              <div className="mt-3 space-y-3">
                {(selectedOrder.items || []).map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">Qty {item.quantity || 1} · {formatPrice(item.price || 0)} each</p>
                    </div>
                    <p className="font-black text-slate-950">{formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center text-center text-slate-600">
              <PackageCheck size={36} className="text-emerald-700" />
              <p className="mt-3 font-black">Select an order to view details.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminOrders;
