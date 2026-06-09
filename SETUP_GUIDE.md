## Quick Start Guide

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)

### Installation

#### Option 1: Automated Setup (Windows)
```bash
setup.bat
```

#### Option 2: Automated Setup (Linux/Mac)
```bash
bash setup.sh
```

#### Option 3: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Configuration

**Backend .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akshaygun
JWT_SECRET=your_secret_key_here

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

NODE_ENV=development
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Project Structure

```
akshaygun/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── README.md
└── setup files

```

## Features Overview

### 1. Product Catalog
- Browse all Ayurvedic products
- Filter by category
- Search functionality
- Product ratings and reviews

### 2. Product Details
- Full product information
- Multiple images
- Health benefits
- Usage instructions
- Stock availability
- Discount information

### 3. Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Tax & shipping calculation

### 4. Checkout
- Address collection
- Payment method selection
- Order summary
- Final confirmation

### 5. Payment Processing
- **Razorpay Integration**:
  - Debit/Credit Cards
  - UPI
  - Digital Wallets
- **Cash on Delivery**

### 6. Store Information
- Address: 1712/19, Mangal Building - 2, Ground floor, Bhagirath palace Delhi - 110006
- Working Hours: 10 AM - 8 PM (Daily)
- Contact information
- Location map

## Sample Products

The system comes with sample products for testing:
- Premium Ashwagandha Powder
- Organic Turmeric
- Ayurvedic Herbal Tea
- Brahmi Ghee
- Neem & Turmeric Soap
- Shilajit Extract
- Triphala Powder
- Sesame Oil

## API Documentation

### Products
```
GET /api/products              - Get all products
GET /api/products?category=X   - Filter by category
GET /api/products/:id          - Get product details
POST /api/products             - Create product (admin)
```

### Cart
```
POST /api/cart/calculate       - Calculate totals
```

### Payment
```
POST /api/payment/razorpay/create-order    - Create order
POST /api/payment/razorpay/verify          - Verify payment
```

### Orders
```
GET /api/orders                - Get all orders
GET /api/orders/:id            - Get order details
POST /api/orders               - Create order
```

### Store
```
GET /api/store/info            - Get store information
```

## Payment Testing (Razorpay)

Use these test credentials:
- **Card**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or update MONGODB_URI

### Razorpay Integration Issue
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct
- Visit https://dashboard.razorpay.com to get credentials

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

### CORS Issues
- Backend already has CORS enabled
- Ensure frontend is on http://localhost:5173

## Support

For issues or questions:
- Email: info@akshaygun.com
- Address: 1712/19, Mangal Building - 2, Delhi - 110006
- Phone: +91-XXXXX-XXXXX

## License

MIT License - Feel free to use for personal or commercial projects
