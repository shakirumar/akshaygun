import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import BestSellers from './pages/BestSellers';
import MyAccount from './pages/MyAccount';
import Services from './pages/Services';
import Wishlist from './pages/Wishlist';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import OrderLookup from './pages/OrderLookup';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('akshaygun-cart')) || [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('akshaygun-wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('akshaygun-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('akshaygun-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const wishlistCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(item => item._id === product._id);
      if (!existingItem) {
        return [...currentItems, { ...product, quantity: 1 }];
      }

      return currentItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some((item) => item._id === product._id);
      if (exists) {
        return currentItems.filter((item) => item._id !== product._id);
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) => currentItems.filter((item) => item._id !== productId));
  };

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#f6f8f4]">
        <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/products" element={<ProductListing addToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/best-sellers" element={<BestSellers addToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/orders" element={<OrderLookup />} />
            <Route path="/cart" element={
              <Cart 
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            } />
            <Route path="/wishlist" element={<Wishlist items={wishlistItems} onRemove={removeFromWishlist} onAddToCart={addToCart} />} />
            <Route path="/checkout" element={
              <Checkout 
                items={cartItems}
                onClearCart={clearCart}
              />
            } />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
