import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, MessageCircle } from 'lucide-react';
import { API_BASE_URL, formatPrice, getSampleProduct } from '../data/storeData';
import { openWhatsApp } from '../utils/whatsapp';
import { getProductImagePath } from '../utils/images';

const ProductDetail = ({ addToCart, wishlistItems, onToggleWishlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const isWishlisted = wishlistItems?.some((item) => item._id === product?._id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch {
        setProduct(getSampleProduct(id));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    Array.from({ length: quantity }).forEach(() => addToCart(product));
    setQuantity(1);
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-lg font-black text-slate-600">Loading product...</div>;
  }

  if (!product) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-lg font-black text-slate-600">Product not found</div>;
  }

  const images = product.images?.length ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-700 hover:text-emerald-800">
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-sm flex items-center justify-center aspect-square">
            <img src={getProductImagePath(images[activeImage])} alt={product.name} className="max-h-full max-w-full rounded-2xl object-contain" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${activeImage === index ? 'border-emerald-700' : 'border-slate-200'}`}
                >
                  <img src={getProductImagePath(image)} alt={`${product.name} preview ${index + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-800">
              {product.category}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-rose-700">
                Save {discount}%
              </span>
            )}
          </div>

          <h1 className="text-5xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">{product.name}</h1>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} className={star <= Math.round(product.rating || 0) ? 'fill-current' : ''} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-600">{product.rating || 0} rating from {product.reviews || 0} reviews</span>
          </div>

          <p className="mt-7 text-xl leading-8 text-slate-800 font-medium">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <span className="text-5xl font-black text-slate-950">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-2xl font-bold text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>}
          </div>

          <div className="mt-6 rounded-2xl bg-[#f6f8f4] p-4">
            <p className={`text-lg font-black ${product.inStock ? 'text-emerald-800' : 'text-rose-700'}`}>
              {product.inStock ? `In stock (${product.stock ?? 'ready'} available)` : 'Out of stock'}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Free delivery on orders above Rs. 500.</p>
          </div>

          {product.inStock && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center rounded-xl border border-slate-300 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-slate-700 hover:text-emerald-800" aria-label="Decrease quantity">
                  <Minus size={18} />
                </button>
                <span className="min-w-12 text-center font-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-slate-700 hover:text-emerald-800" aria-label="Increase quantity">
                  <Plus size={18} />
                </button>
              </div>
              <button onClick={handleAddToCart} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10210f] px-6 py-4 font-black text-white transition hover:bg-emerald-800">
                <ShoppingCart size={19} />
                Add To Cart
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist?.(product)}
                className={`inline-flex items-center justify-center rounded-xl border px-5 py-4 transition ${isWishlisted ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'}`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </button>
            </div>
          )}

          <button
            onClick={() => openWhatsApp(product)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-black text-white transition hover:bg-[#1fa851]"
          >
            <MessageCircle size={19} />
            Order on WhatsApp
          </button>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: 'Secure payment' },
              { icon: Truck, text: 'Fast dispatch' },
              { icon: CheckCircle2, text: 'Quality checked' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="rounded-xl border border-slate-200 p-3 text-center">
                <Icon className="mx-auto text-emerald-700" size={22} />
                <p className="mt-2 text-sm font-black text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:col-span-2">
          <h2 className="text-2xl font-black text-slate-950">Benefits</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(product.benefits || ['Trusted sourcing', 'Easy daily use', 'Packed for freshness']).map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-xl bg-[#f6f8f4] p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={20} />
                <p className="font-semibold text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-950">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-black text-slate-500">Ingredients</dt>
              <dd className="mt-1 font-semibold text-slate-800">{product.ingredients || 'Listed on product label'}</dd>
            </div>
            <div>
              <dt className="font-black text-slate-500">Weight</dt>
              <dd className="mt-1 font-semibold text-slate-800">{product.weight || 'Standard pack'}</dd>
            </div>
            <div>
              <dt className="font-black text-slate-500">Shelf Life</dt>
              <dd className="mt-1 font-semibold text-slate-800">{product.shelf_life || 'Check package date'}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-8 rounded-2xl bg-[#10210f] p-6 text-white">
        <h2 className="text-2xl font-black">How to use</h2>
        <p className="mt-2 max-w-4xl text-white/75">{product.usage || 'Use as directed on the label or as recommended by your healthcare professional.'}</p>
        <Link to="/cart" className="mt-5 inline-block rounded-full bg-[#b9f45f] px-6 py-3 text-sm font-black text-[#10210f]">
          Go To Cart
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
