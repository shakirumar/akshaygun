import { useState } from 'react';
import { Eye, Heart, ShoppingCart, Star, MessageCircle } from 'lucide-react';
import { formatPrice } from '../data/storeData';
import { openWhatsApp } from '../utils/whatsapp';
import { getProductImagePath } from '../utils/images';

const ProductCard = ({ product, onAddToCart, onViewDetails, isWishlisted = false, onToggleWishlist }) => {
  const [imageError, setImageError] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-4 flex items-center justify-center">
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-500">
            <Eye size={26} />
            <p className="mt-2 text-sm font-bold">Image unavailable</p>
          </div>
        ) : (
          <img
            src={getProductImagePath(product.image)}
            alt={product.name}
            className="max-h-full max-w-full rounded-xl object-contain transition duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.badge && (
            <span className="rounded-full bg-[#b9f45f] px-3 py-1 text-xs font-black text-[#10210f]">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white">
              {discount}% off
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onToggleWishlist?.(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-rose-600"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={isWishlisted ? 'fill-rose-600 text-rose-600' : ''} />
          </button>
          <button
            onClick={() => onViewDetails(product._id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-emerald-700"
            aria-label="View details"
          >
            <Eye size={18} />
          </button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[0.75rem] font-black uppercase tracking-[0.18em] text-emerald-800">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-current" />
            <span className="text-sm font-bold text-slate-700">{product.rating || 0}</span>
          </div>
        </div>

        <h3 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950">{product.name}</h3>
        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-700">{product.description}</p>

        <div className="mt-6 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-2xl font-black text-slate-950">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="mt-1 text-sm font-semibold text-slate-400 line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <p className="text-xs font-bold text-slate-500">{product.reviews || 0} reviews</p>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10210f] text-base font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          <ShoppingCart size={18} />
          {product.inStock ? 'Add To Cart' : 'Sold Out'}
        </button>

        <button
          onClick={() => openWhatsApp(product)}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-black text-white transition hover:bg-[#1fa851]"
        >
          <MessageCircle size={17} />
          Order on WhatsApp
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
