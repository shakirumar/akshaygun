# Akshaygun E-Commerce Platform - Complete Setup

## 🎯 What Has Been Created

### Backend (Node.js + Express + MongoDB)

✅ **Server Structure:**
- Express server with CORS and JSON support
- MongoDB connection ready
- RESTful API endpoints

✅ **Database Models:**
- Product Schema (with pricing, images, ratings)
- Order Schema (with payment tracking)

✅ **API Routes:**
- `/api/products` - Product management
- `/api/cart` - Cart calculations
- `/api/orders` - Order management
- `/api/payment` - Razorpay integration
- `/api/store` - Store information

✅ **Payment Integration:**
- Razorpay payment gateway
- Order verification
- Payment status tracking

### Frontend (React + Vite + Tailwind CSS)

✅ **Pages:**
- Home - Hero section, featured products, testimonials
- Products - Catalog with filtering & sorting
- Product Detail - Full information with images
- Cart - Shopping cart management
- Checkout - Address & payment method selection
- Order Success - Confirmation page
- About - Store information and contact

✅ **Components:**
- Navbar - Navigation with cart counter
- Footer - Company info and store address
- ProductCard - Product display component

✅ **Features:**
- Responsive design (Mobile, Tablet, Desktop)
- Real-time cart updates
- Payment gateway integration
- Product filtering & search
- Order tracking
- Store information display

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Backend
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akshaygun
JWT_SECRET=your_secret_key

# Get from https://dashboard.razorpay.com
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret

NODE_ENV=development
```

### Step 3: Seed Sample Data
```bash
npm run seed
```

### Step 4: Start Backend
```bash
npm run dev
```

### Step 5: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 6: Start Frontend
```bash
npm run dev
```

**Access at:** http://localhost:5173

## 📁 Project Structure

```
akshaygun/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   └── store.js
│   ├── server.js
│   ├── seedData.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   └── About.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md
├── SETUP_GUIDE.md
├── setup.sh
└── setup.bat
```

## 🎨 Features

### Product Management
- Display all Ayurvedic products
- Filter by category
- Product search
- Detailed product pages with images
- Rating and review system

### Shopping Cart
- Add/remove products
- Update quantities
- Real-time calculations
- Automatic tax calculation (10%)
- Shipping charges (Free over ₹500)

### Checkout
- Address collection
- Payment method selection
- Order summary
- Final confirmation

### Payment Methods
1. **Razorpay**
   - Debit/Credit Cards
   - UPI
   - Digital Wallets
   - Netbanking

2. **Cash on Delivery (COD)**

### Store Information
**Akshaygun**
- Address: 1712/19, Mangal Building - 2, Ground floor, Bhagirath Palace, Delhi - 110006
- Working Hours: 10 AM - 8 PM (Daily)
- Complete store info displayed across the site

## 📦 Sample Products Included

1. Premium Ashwagandha Powder - ₹299
2. Organic Turmeric Powder - ₹199
3. Ayurvedic Herbal Tea - ₹349
4. Brahmi Ghee - ₹599
5. Neem & Turmeric Soap - ₹99
6. Shilajit Extract - ₹1299
7. Triphala Powder - ₹249
8. Pure Sesame Oil - ₹349
9. Amla Juice - ₹299
10. Brahmi Oil - ₹199
11. Chyawanprash - ₹449
12. Neem Oil - ₹249

## 🔧 Configuration

### MongoDB Setup
- Local MongoDB: `mongodb://localhost:27017/akshaygun`
- Or use MongoDB Atlas (Cloud) connection string

### Razorpay Setup
1. Visit https://dashboard.razorpay.com
2. Sign up or login
3. Get API keys from Settings
4. Add to .env file

### Frontend Configuration
- API Base URL: `http://localhost:5000`
- Currently set in axios calls
- Change in each component if needed

## 🚨 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify port 5000 is available
- Check .env file exists

### Frontend shows blank page
- Ensure backend is running
- Check console for errors
- Clear browser cache

### Payment gateway not working
- Verify Razorpay keys in .env
- Check backend is running
- Verify internet connection

### Database won't seed
- Ensure MongoDB is running
- Check connection string in .env
- Run: `npm run seed`

## 📱 Responsive Design

The website is fully responsive:
- **Mobile** (320px+)
- **Tablet** (768px+)
- **Desktop** (1024px+)

## 🔐 Security Features

- CORS enabled for API
- Environment variables for sensitive data
- Input validation on checkout
- Secure payment gateway integration
- HTTPS ready

## 🎯 Next Steps

1. ✅ Install all dependencies
2. ✅ Configure environment variables
3. ✅ Seed sample data
4. ✅ Start backend server
5. ✅ Start frontend server
6. ✅ Test payment flow
7. ✅ Deploy to production

## 📞 Support

For assistance:
- Email: info@akshaygun.com
- Address: 1712/19, Mangal Building - 2, Delhi - 110006
- Phone: +91-XXXXX-XXXXX

## 📄 License

MIT License - Free for commercial and personal use

---

**Happy Selling! 🎉**
