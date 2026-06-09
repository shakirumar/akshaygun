# Email & Order Management Setup Guide

## Overview
This guide explains the new email notification and order cancellation features added to your Akshaygun pharmacy e-commerce system.

## Features Added

### 1. **Order Confirmation Emails**
- Automatic emails sent to customers when they place an order
- Automatic emails sent to business owner with order details
- Email includes:
  - Order number and date
  - All items ordered with quantities and prices
  - Customer delivery address
  - Total amount breakdown (subtotal, tax, shipping)
  - Payment method and status

### 2. **Order Cancellation**
- Customers can cancel orders from the OrderSuccess page
- Automatic refund email sent to customer
- Order status updated to "cancelled"
- Payment status updated to "refunded"

### 3. **Email Notifications**
- Customers can opt-in for email notifications on the OrderSuccess page
- Business owner can send custom order updates via the API
- Endpoint: `POST /api/orders/:orderId/send-notification`

### 4. **Enhanced Wishlist**
- Improved wishlist UI with better product cards
- Product ratings and stock information displayed
- Better responsive design (3-column grid on large screens)
- Quick action buttons for cart and removal
- Empty state with clear call-to-action

---

## Email Configuration

### Option 1: Gmail (Easiest)

**Requirements:**
- Google Account
- App Password (not your regular Gmail password)

**Steps:**
1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Google will generate a 16-character password
6. Update your `.env` file in the backend:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
OWNER_EMAIL=your-business-email@gmail.com
```

### Option 2: Custom SMTP (For Other Email Providers)

Update `.env` with:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
OWNER_EMAIL=your-business-email@example.com
```

**Common Providers:**
- **Hostinger**: `smtp.hostinger.com` (Port 587)
- **SendGrid**: `smtp.sendgrid.net` (Port 587)
- **AWS SES**: `email-smtp.region.amazonaws.com` (Port 587)

### Option 3: Test Mode (Current)

By default, the system runs in test mode where emails are logged to the console instead of being sent. This is perfect for development.

Logs will appear in your terminal like:
```
[EMAIL SERVICE - TEST MODE] Order confirmation would be sent:
To Customer: customer@example.com
To Owner: owner@example.com
Order ID: ORD-1234567890
```

---

## Backend Setup

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Environment Variables**
Create/update `.env` file:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
OWNER_EMAIL=admin@akshaygun.com

# Email Configuration (choose one method above)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. **Start Backend**
```bash
npm start
```

---

## Frontend Setup

### 1. **Install Dependencies**
```bash
cd frontend
npm install
```

### 2. **Build**
```bash
npm run build
```

### 3. **Run Development Server**
```bash
npm run dev
```

---

## API Endpoints

### Create Order with Email
```
POST /api/orders/
Body: {
  "items": [...],
  "customerInfo": {...},
  "totalAmount": 1000,
  "paymentMethod": "cod"
}
Response: Order object + confirmation email sent
```

### Cancel Order
```
PATCH /api/orders/:orderId/cancel
Response: {
  "message": "Order cancelled successfully",
  "order": {...}
}
```

### Send Order Notification
```
POST /api/orders/:orderId/send-notification
Body: {
  "email": "customer@example.com",
  "message": "Your order is being prepared"
}
Response: {
  "message": "Notification email sent successfully"
}
```

### Get Order
```
GET /api/orders/:orderId
Response: Order object
```

---

## File Changes

### Backend
- **`backend/services/emailService.js`** (NEW)
  - Email service with nodemailer integration
  - Supports Gmail, SMTP, and test mode
  - Formats professional HTML emails
  
- **`backend/routes/orders.js`** (UPDATED)
  - Added import for emailService
  - POST `/` now sends confirmation emails
  - PATCH `/:id/cancel` - order cancellation with refund email
  - POST `/:id/send-notification` - send custom updates

- **`backend/.env`** (UPDATED)
  - Added email configuration options

- **`backend/.env.example`** (UPDATED)
  - Documentation for email setup

### Frontend
- **`frontend/src/pages/OrderSuccess.jsx`** (UPDATED)
  - Cancel order now calls backend API
  - Email notification form submits to backend
  - Better error handling and user feedback
  - Confirmation messages and alerts

- **`frontend/src/pages/Wishlist.jsx`** (UPDATED)
  - Improved responsive grid layout (3 columns)
  - Better product cards with stock info
  - Rating badges
  - Better empty state
  - Enhanced CTA sections

---

## Testing Workflow

### 1. **Test Email in Development**
```bash
# Backend will log emails to console in test mode
cd backend
npm start

# In another terminal, create an order:
# Frontend will show order created
# Backend console will show email simulation
```

### 2. **Configure Real Email**
```bash
# Update .env with your email credentials
# Restart backend
npm start

# Create test order
# Check email inbox for confirmation
```

### 3. **Test Order Cancellation**
- Go to order success page
- Click "Cancel Order" button
- Confirm cancellation
- Check email for cancellation confirmation

### 4. **Test Wishlist**
- Add products to wishlist from product pages
- Visit `/wishlist`
- Verify product cards display correctly
- Test "Add to cart" functionality

---

## Troubleshooting

### Emails Not Sending

**Check 1: Email Service Configuration**
```bash
# Verify environment variables
echo $EMAIL_USER  # Should not be empty
echo $OWNER_EMAIL # Should not be empty
```

**Check 2: Gmail App Password**
- Ensure you're using App Password, not regular password
- Don't use special characters without URL encoding

**Check 3: SMTP Settings**
- Verify SMTP host and port are correct
- Check if provider requires SSL/TLS
- Ensure firewall isn't blocking port 587

**Check 4: Backend Logs**
```bash
# Look for error messages in backend console
# Should see either success or specific error
```

### Test Mode Verification
If email service isn't configured, backend logs to console:
```
[EMAIL SERVICE - TEST MODE] Order confirmation would be sent:
```

This confirms emails are being processed correctly in test mode.

---

## Email Template Features

### Customer Order Confirmation
- Order number with copy button
- Item-by-item breakdown
- Delivery address
- Contact information
- Payment status
- Professional branding

### Cancellation Email
- Clear cancellation notice
- Refund amount
- Processing timeline (5-7 business days)
- Customer details

### Custom Order Update
- Order number and status
- Custom message from business
- Professional layout

---

## Next Steps

1. **Configure Email Service**
   - Choose Gmail or SMTP option
   - Update `.env` file
   - Test with sample order

2. **Deploy**
   - Use production email credentials
   - Enable 2FA on email account
   - Test before going live

3. **Monitor**
   - Check email logs regularly
   - Monitor delivery rates
   - Update customer info on issues

---

## Support

For issues or questions about email configuration:
1. Check the troubleshooting section
2. Review backend logs
3. Verify environment variables
4. Test with development email first

---

**Last Updated:** May 2026
**Version:** 1.0.0
