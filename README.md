# Akshaygun E-Commerce Platform

A modern, full-featured e-commerce platform for Ayurvedic and organic health products built with React, Node.js, and MongoDB.

## Features

### Frontend
- **Modern UI/UX** with Tailwind CSS and Lucide Icons
- **Product Catalog** with filtering, search, and sorting
- **Product Details** with images, reviews, and benefits
- **Shopping Cart** with real-time calculation
- **Checkout Process** with address validation
- **Payment Integration** with Razorpay and COD options
- **Order Tracking** and confirmation
- **Responsive Design** for all devices

### Backend
- **Express.js API** with MongoDB
- **Product Management** endpoints
- **Payment Gateway** (Razorpay integration)
- **Order Management** system
- **Cart Calculation** with tax and shipping

### Payment Methods
- **Razorpay** (Debit/Credit Card, UPI, Wallets)
- **Cash on Delivery (COD)**

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akshaygun
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Store Information

**Akshaygun - Premium Ayurvedic Products**
- Address: 1712/19, Mangal Building - 2, Ground floor, Bhagirath Palace, Delhi - 110006
- Working Hours: 10 AM - 8 PM (Daily)
- Category: Ayurvedic & Organic Health Products

## Key Pages

1. **Home** - Hero section, featured products, testimonials
2. **Products** - Browse all products with filters and search
3. **Product Detail** - Full product information, benefits, usage
4. **Cart** - Manage items, view totals
5. **Checkout** - Address entry, payment method selection
6. **Order Success** - Confirmation and tracking info
7. **About** - Company information and store details

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories/list` - Get all categories

### Cart
- `POST /api/cart/calculate` - Calculate totals

### Payment
- `POST /api/payment/razorpay/create-order` - Create payment order
- `POST /api/payment/razorpay/verify` - Verify payment

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order

### Store
- `GET /api/store/info` - Get store information

## Technologies Used

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Razorpay SDK

## Features Included

✅ Product Listing & Filtering
✅ Shopping Cart Management
✅ Checkout Process
✅ Razorpay Payment Gateway
✅ Order Management
✅ Responsive Design
✅ Modern UI/UX
✅ Customer Support Info
✅ Store Location
✅ Product Reviews
✅ Discount Calculations
✅ Tax & Shipping Calculation

## Future Enhancements

- User Authentication & Profiles
- Wishlist Functionality
- Product Reviews & Ratings
- Email Notifications
- Admin Dashboard
- Inventory Management
- Analytics Dashboard
- Multiple Languages Support
- Advanced Search with AI

## License

MIT License
