# Complete Akshaygun Platform - Ayurvedic & Pharmaceutical Distribution

## ✅ What's New - Pharmaceutical Services Added!

### New Features Added:

#### 1. **Pharmaceutical Services Page** (`/services`)
- Complete information about pharmaceutical distribution
- Anti-cancer drugs & life-saving medications
- WHO-GMP certification details
- Emergency support information
- Pan-India distribution network
- Service categories:
  - Oncology (Anti-Cancer Drugs)
  - Cardiovascular & Respiratory
  - Infectious Diseases
  - Critical Care

#### 2. **Backend Pharmaceutical API** 
- `/api/pharma/list` - All pharmaceutical services
- `/api/pharma/:category` - Specific service details
- `/api/pharma/emergency-request` - Emergency orders
- `/api/pharma/certifications/all` - Quality certifications

#### 3. **Updated Navigation**
- New "Pharma Services" link in navbar
- Responsive mobile menu with all options
- Direct access to pharmaceutical information

#### 4. **Enhanced Home Page**
- Dual brand positioning (Ayurvedic + Pharma)
- Pharmaceutical services banner
- Emergency services highlight
- Updated features section with pharma badge

## 🚀 How to Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install --legacy-peer-deps
```

### Step 2: Configure Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akshaygun
JWT_SECRET=your_secret_key
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
Backend runs on: `http://localhost:5000`

### Step 5: Install Frontend Dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### Step 6: Start Frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📁 Complete Project Structure

```
akshaygun/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js          (Product catalog)
│   │   ├── cart.js              (Cart calculations)
│   │   ├── orders.js            (Order management)
│   │   ├── payment.js           (Razorpay integration)
│   │   ├── store.js             (Store info)
│   │   └── pharmaceuticals.js   (NEW - Pharma services)
│   ├── server.js
│   ├── seedData.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              (Updated with pharma)
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── About.jsx
│   │   │   └── Services.jsx          (NEW - Pharma services)
│   │   ├── components/
│   │   │   ├── Navbar.jsx            (Updated with pharma link)
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── App.jsx                  (Updated with routes)
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
├── INSTALLATION.md
└── setup files
```

## 🌐 Website Navigation

### Main Pages:
1. **Home** (`/`) - Welcome page with both services
2. **Products** (`/products`) - Ayurvedic product catalog
3. **Product Detail** (`/product/:id`) - Full product info
4. **Pharma Services** (`/services`) - Pharmaceutical distribution
5. **Shopping Cart** (`/cart`) - Manage items
6. **Checkout** (`/checkout`) - Payment processing
7. **Order Success** (`/order-success/:orderId`) - Confirmation
8. **About** (`/about`) - Company information

## 🛍️ E-Commerce Features

### Product Management
- Browse 12+ Ayurvedic products
- Filter by category
- Search functionality
- Product ratings & reviews
- Stock availability

### Shopping Cart
- Add/remove products
- Update quantities
- Real-time calculations
- Tax calculation (10%)
- Shipping (₹50 or FREE over ₹500)

### Payment Methods
- **Razorpay** (Cards, UPI, Wallets)
- **Cash on Delivery (COD)**

### Order Management
- Order confirmation
- Order tracking
- Customer support
- Returns management

## 🏥 Pharmaceutical Services

### Available Services
1. **Anti-Cancer Drugs**
   - Chemotherapy agents
   - Targeted therapies
   - Immunotherapy medications
   - Supportive care drugs

2. **Life-Saving Medications**
   - Cardiovascular drugs
   - Respiratory medications
   - Emergency medicines
   - Critical care drugs

3. **Distribution Network**
   - 28+ states covered
   - 200+ cities
   - 500+ hospital partners
   - 1000+ daily deliveries

### Quality Assurance
- WHO-GMP Certified
- Licensed Distributor
- ISO 13485:2016 Compliant
- Cold Chain Management
- 24/7 Support
- Emergency orders

## 🏪 Store Information

**Akshaygun Pharmaceuticals & Ayurveda**
- Address: 1712/19, Mangal Building - 2, Ground floor, Bhagirath Palace, Delhi - 110006
- Phone: +91-XXXXX-XXXXX
- Email: info@akshaygun.com
- Working Hours: 10 AM - 8 PM (Daily)
- Services: Pharmaceutical Distribution & Ayurvedic Products

## 📦 API Endpoints

### Products (`/api/products`)
```
GET /api/products              - Get all products
GET /api/products?category=X   - Filter by category
GET /api/products/:id          - Get product details
POST /api/products             - Create product
```

### Cart (`/api/cart`)
```
POST /api/cart/calculate       - Calculate totals
```

### Orders (`/api/orders`)
```
GET /api/orders                - Get all orders
GET /api/orders/:id            - Get order details
POST /api/orders               - Create order
```

### Payment (`/api/payment`)
```
POST /api/payment/razorpay/create-order   - Create payment
POST /api/payment/razorpay/verify         - Verify payment
```

### Store (`/api/store`)
```
GET /api/store/info            - Store information
```

### Pharmaceuticals (`/api/pharma`) - NEW!
```
GET /api/pharma/list                      - All pharma services
GET /api/pharma/:category                 - Category details
POST /api/pharma/emergency-request        - Emergency orders
GET /api/pharma/certifications/all        - Certifications
```

## 🔧 Configuration

### MongoDB
- Local: `mongodb://localhost:27017/akshaygun`
- Or MongoDB Atlas (Cloud)

### Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

## 🎨 Design Features

- Modern Tailwind CSS styling
- Responsive mobile design
- Smooth animations
- Professional color scheme (Green, Blue, White)
- Lucide React icons
- Fast loading with Vite

## 🔒 Security

- CORS enabled
- Environment variables for sensitive data
- Input validation
- Secure payment gateway
- HTTPS ready

## ✨ Sample Data

### Ayurvedic Products (12+)
- Premium Ashwagandha
- Organic Turmeric
- Herbal Tea
- Brahmi Ghee
- Neem Soap
- Shilajit Extract
- Triphala Powder
- Sesame Oil
- Amla Juice
- Brahmi Oil
- Chyawanprash
- Neem Oil

## 🚨 Troubleshooting

### Dependency Error
```bash
npm install --legacy-peer-deps
```

### MongoDB Connection
- Ensure MongoDB is running
- Check connection string in .env

### Port Already in Use
- Change PORT in .env (backend)
- Change port in vite.config.js (frontend)

### Payment Gateway Issues
- Verify Razorpay keys
- Ensure internet connection
- Check backend is running

## 📱 Responsive Design

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## 🌟 Key Highlights

✅ Dual business model (Ayurvedic + Pharma)
✅ Professional pharmaceutical distribution
✅ Emergency order support
✅ WHO-GMP certifications
✅ 24/7 customer support
✅ Pan-India delivery network
✅ Modern e-commerce platform
✅ Secure payment integration
✅ Real-time inventory management
✅ Complete order tracking

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Seed database
4. ✅ Start backend server
5. ✅ Start frontend server
6. ✅ Test all features
7. ✅ Deploy to production

## 📞 Support

**Akshaygun**
- Email: info@akshaygun.com
- Phone: +91-XXXXX-XXXXX
- Address: 1712/19, Mangal Building - 2, Delhi - 110006
- Hours: 10 AM - 8 PM (Daily)

---

**Your complete healthcare and wellness platform is ready! 🎉**
