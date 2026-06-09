import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ImagePlus,
  Loader,
  Lock,
  LogOut,
  PackagePlus,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { API_BASE_URL, categories, formatPrice, getProductList, sampleProducts } from '../data/storeData';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: 'Daily Wellness',
  image: '',
  images: '',
  stock: 10,
  badge: '',
  benefits: '',
  usage: '',
  ingredients: '',
  weight: '',
  shelf_life: '',
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminProducts = () => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('akshaygun-admin-token') || '');
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [products, setProducts] = useState(sampleProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const authHeaders = {
    headers: { Authorization: `Bearer ${adminToken}` },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products?limit=200`);
      setProducts(getProductList(response.data));
    } catch {
      setProducts(sampleProducts);
      setMessage('Backend is not reachable. Showing sample products until the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) return;
    Promise.resolve().then(fetchProducts);
  }, [adminToken]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
        email: adminForm.email,
        password: adminForm.password,
      });
      localStorage.setItem('akshaygun-admin-token', response.data.token);
      setAdminToken(response.data.token);
      setMessage('Admin login successful.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin login failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('akshaygun-admin-token');
    setAdminToken('');
    setProducts(sampleProducts);
    resetForm();
  };

  const term = search.trim().toLowerCase();
  const filteredProducts = term
    ? products.filter((product) =>
        `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)
      )
    : products;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Please upload an image under 2MB.');
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setForm((current) => ({ ...current, image: dataUrl, images: dataUrl }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
    setMessage('');
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'Daily Wellness',
      image: product.image || '',
      images: product.images?.join('\n') || product.image || '',
      stock: product.stock ?? 0,
      badge: product.badge || '',
      benefits: product.benefits?.join('\n') || '',
      usage: product.usage || '',
      ingredients: product.ingredients || '',
      weight: product.weight || '',
      shelf_life: product.shelf_life || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
        stock: Number(form.stock),
        rating: 0,
        reviews: 0,
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, payload, authHeaders);
        setMessage('Product updated successfully.');
      } else {
        await axios.post(`${API_BASE_URL}/products`, payload, authHeaders);
        setMessage('Product uploaded successfully.');
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save product. Check backend connection and required fields.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    const confirmed = window.confirm('Delete this product from the catalog?');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`, authHeaders);
      setMessage('Product deleted.');
      await fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete product.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#10210f] p-6 text-white sm:p-8">
        <p className="font-black uppercase tracking-[0.18em] text-[#b9f45f]">Admin catalog</p>
        <h1 className="mt-2 text-4xl font-black">Upload and manage products</h1>
        <p className="mt-3 max-w-3xl text-white/75">
          Add products, upload product images, update stock, and keep the storefront catalog ready for checkout.
        </p>
      </div>

      {!adminToken && (
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10210f] text-[#b9f45f]">
              <Lock size={23} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Admin only</p>
              <h2 className="text-3xl font-black text-slate-950">Login to upload products</h2>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Admin email</span>
              <input
                type="email"
                value={adminForm.email}
                onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold"
                placeholder="admin@akshaygun.com"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Admin password</span>
              <input
                type="password"
                value={adminForm.password}
                onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold"
                placeholder="Enter admin password"
                required
              />
            </label>

            {message && <p className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10210f] px-5 font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? <Loader size={18} className="animate-spin" /> : <Lock size={18} />}
              Login as Admin
            </button>
          </form>
        </div>
      )}

      {adminToken && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-emerald-900">Admin mode is active. Product upload options are available below.</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/orders" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition hover:text-emerald-700">
              View Orders
            </Link>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition hover:text-rose-600"
            >
              <LogOut size={17} />
              Admin Logout
            </button>
          </div>
        </div>
      )}

      {adminToken && <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submitProduct} className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10210f] text-[#b9f45f]">
                <PackagePlus size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">{editingId ? 'Edit product' : 'New product'}</h2>
                <p className="text-sm text-slate-500">Required fields are marked by the browser.</p>
              </div>
            </div>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-slate-500 hover:text-rose-600" aria-label="Cancel edit">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Product name</span>
              <input name="name" value={form.name} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold" required />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Price</span>
                <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" required />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Original price</span>
                <input type="number" min="0" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Category</span>
                <select name="category" value={form.category} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold">
                  {categories.filter((category) => category !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Stock</span>
                <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" required />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Image URL or uploaded image</span>
              <input name="image" value={form.image} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" required />
            </label>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-black text-emerald-800">
              <ImagePlus size={19} />
              Upload product image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {form.image && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={form.image} alt="Product preview" className="h-44 w-full object-cover" />
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Gallery image URLs</span>
              <textarea name="images" value={form.images} onChange={handleChange} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold" placeholder="One image URL per line" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Badge</span>
                <input name="badge" value={form.badge} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" placeholder="Best Seller" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Weight</span>
                <input name="weight" value={form.weight} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" placeholder="20g" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Benefits</span>
              <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold" placeholder="One benefit per line" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Ingredients</span>
                <input name="ingredients" value={form.ingredients} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">Shelf life</span>
                <input name="shelf_life" value={form.shelf_life} onChange={handleChange} className="h-12 w-full rounded-xl border border-slate-300 px-4 font-semibold" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Usage</span>
              <textarea name="usage" value={form.usage} onChange={handleChange} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold" />
            </label>
          </div>

          {message && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10210f] px-5 font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            {editingId ? 'Update Product' : 'Upload Product'}
          </button>
        </form>

        <section>
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search uploaded products"
                className="h-11 w-full rounded-xl border border-slate-300 px-11 font-semibold"
              />
            </div>
            <button
              type="button"
              onClick={fetchProducts}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-800 hover:border-emerald-700 hover:text-emerald-800"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <article key={product._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex gap-4 p-4">
                    <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{product.category}</p>
                          <h3 className="mt-1 line-clamp-2 font-black leading-6 text-slate-950">{product.name}</h3>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {product.stock || 0} left
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="font-black text-slate-950">{formatPrice(product.price)}</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => editProduct(product)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-700 hover:text-emerald-800" aria-label="Edit product">
                            <Pencil size={17} />
                          </button>
                          <button type="button" onClick={() => deleteProduct(product._id)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600" aria-label="Delete product">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>}
    </div>
  );
};

export default AdminProducts;
