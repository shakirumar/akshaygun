import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  Loader,
  Lock,
  LogOut,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { API_BASE_URL } from '../data/storeData';

const MyAccount = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [hasAdminToken, setHasAdminToken] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('akshaygun-admin-token');
    if (adminToken) {
      setHasAdminToken(true);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setMode('profile');
    } catch {
      localStorage.removeItem('akshaygun-token');
      setUser(null);
      setMode('login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('akshaygun-token');
    if (!token) return;
    Promise.resolve().then(() => fetchProfile(token));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
      });
      localStorage.setItem('akshaygun-token', res.data.token);
      await fetchProfile(res.data.token);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!registerForm.name.trim()) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!registerForm.email.includes('@')) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
      });
      localStorage.setItem('akshaygun-token', res.data.token);
      await fetchProfile(res.data.token);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
        email: adminLoginForm.email.trim().toLowerCase(),
        password: adminLoginForm.password,
      });
      localStorage.setItem('akshaygun-admin-token', res.data.token);
      setHasAdminToken(true);
      setError('');
      navigate('/admin/products');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('akshaygun-token');
    localStorage.removeItem('akshaygun-admin-token');
    setUser(null);
    setHasAdminToken(false);
    setMode('login');
    navigate('/');
  };

  const fieldClass = 'h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-700';

  return (
    <div>
      <section className="bg-[#10210f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="font-black uppercase tracking-[0.18em] text-[#b9f45f]">My account</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">My customer account</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Manage your customer access, continue shopping, and checkout securely.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {mode === 'profile' && user ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <UserRound size={30} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Welcome back</p>
                  <h2 className="mt-1 break-words text-3xl font-black text-slate-950">{user.name}</h2>
                  <p className="mt-1 break-words font-semibold text-slate-600">{user.email}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <Link to="/products" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-black text-slate-900 transition hover:border-emerald-700 hover:text-emerald-800">
                  <span className="flex items-center gap-3"><ShoppingBag size={19} /> Continue shopping</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/cart" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-black text-slate-950 transition hover:border-emerald-700 hover:text-emerald-800">
                  <span className="flex items-center gap-3"><PackageCheck size={19} /> View cart and checkout</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/orders" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-black text-slate-950 transition hover:border-emerald-700 hover:text-emerald-800">
                  <span className="flex items-center gap-3"><PackageCheck size={19} /> Track order details</span>
                  <ArrowRight size={18} />
                </Link>
                {hasAdminToken && (
                  <>
                    <Link to="/admin/products" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 font-black text-slate-900 transition hover:border-emerald-700 hover:text-emerald-800">
                      <span className="flex items-center gap-3"><ShieldCheck size={19} className="text-emerald-700" /> Admin Products Panel</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/admin/orders" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 font-black text-slate-900 transition hover:border-emerald-700 hover:text-emerald-800">
                      <span className="flex items-center gap-3"><ShieldCheck size={19} className="text-emerald-700" /> Admin Orders Panel</span>
                      <ArrowRight size={18} />
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-rose-700"
              >
                <LogOut size={18} />
                Log out
              </button>
            </section>

            <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: ShieldCheck, title: 'Secure account', copy: 'Your login session is stored locally with token-based access.' },
                { icon: ShoppingBag, title: 'Easy shopping', copy: 'Browse wellness products, add items to cart, and place orders quickly.' },
                { icon: Lock, title: 'Payment ready', copy: 'Checkout supports Razorpay demo/live flow and cash on delivery.' },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Icon size={26} className="text-emerald-700" />
                  <h3 className="mt-4 text-xl font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-wrap gap-2 items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode('login');
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      mode === 'login'
                        ? 'bg-[#10210f] text-[#b9f45f]'
                        : 'border border-slate-300 text-slate-800 hover:border-emerald-700 hover:text-emerald-800 bg-white'
                    }`}
                  >
                    Customer Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode('admin-login');
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      mode === 'admin-login'
                        ? 'bg-[#10210f] text-[#b9f45f]'
                        : 'border border-slate-300 text-slate-800 hover:border-emerald-700 hover:text-emerald-800 bg-white'
                    }`}
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode('register');
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                      mode === 'register'
                        ? 'bg-[#10210f] text-[#b9f45f]'
                        : 'border border-slate-300 text-slate-800 hover:border-emerald-700 hover:text-emerald-800 bg-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">
                  {mode === 'login' ? 'Customer login' : mode === 'admin-login' ? 'Admin portal' : 'New customer'}
                </p>
                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  {mode === 'login' ? 'Log in to your account' : mode === 'admin-login' ? 'Log in as Administrator' : 'Create your account'}
                </h2>
              </div>

              {error && <div className="mb-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    name="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email address"
                    className={fieldClass}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password"
                    className={fieldClass}
                    required
                  />
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      name="remember"
                      type="checkbox"
                      checked={loginForm.remember}
                      onChange={(event) => setLoginForm((current) => ({ ...current, remember: event.target.checked }))}
                      className="h-4 w-4 accent-emerald-700"
                    />
                    Remember me
                  </label>
                  <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#10210f] px-6 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70">
                    {loading && <Loader className="animate-spin" size={18} />}
                    Log In
                  </button>
                </form>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    name="name"
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Full name"
                    className={fieldClass}
                    required
                  />
                  <input
                    name="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email address"
                    className={fieldClass}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password, minimum 6 characters"
                    className={fieldClass}
                    required
                  />
                  <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70">
                    {loading && <Loader className="animate-spin" size={18} />}
                    Create Account
                  </button>
                </form>
              )}

              {mode === 'admin-login' && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    name="email"
                    value={adminLoginForm.email}
                    onChange={(event) => setAdminLoginForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Admin email"
                    className={fieldClass}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    value={adminLoginForm.password}
                    onChange={(event) => setAdminLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Admin password"
                    className={fieldClass}
                    required
                  />
                  <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#10210f] px-6 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70">
                    {loading && <Loader className="animate-spin" size={18} />}
                    Log In as Admin
                  </button>
                </form>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {mode === 'admin-login' ? (
                <>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Admin portal</p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950">Catalog and Order Management</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                    Authenticate as an administrator to access systems to upload new products, update prices, change inventory levels, review shipping details, and modify or cancel customer orders.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-emerald-800"
                    >
                      Customer Login <ArrowRight size={17} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">New customer</p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950">Create an account for faster checkout</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                    Save your session, access customer tools, and continue shopping with a cleaner checkout experience.
                  </p>
                  <div className="mt-6 grid gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-emerald-800"
                    >
                      Register <ArrowRight size={17} />
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
