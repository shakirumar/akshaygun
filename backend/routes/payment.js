import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import emailService from '../services/emailService.js';

const router = express.Router();

const allowDemoPayments = () =>
  process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_PAYMENTS === 'true';

const hasRazorpayConfig = () =>
  Boolean(
    process.env.RAZORPAY_KEY_ID?.trim() &&
    process.env.RAZORPAY_KEY_SECRET?.trim() &&
    !process.env.RAZORPAY_KEY_ID.includes('your_') &&
    !process.env.RAZORPAY_KEY_SECRET.includes('your_')
  );

const createRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const normalizeOrderItems = (items = []) =>
  items
    .map((item) => {
      const rawProductId = item.productId || item._id;

      return {
        productId: mongoose.Types.ObjectId.isValid(rawProductId)
          ? rawProductId
          : undefined,
        name: String(item.name || '').trim(),
        price: Math.max(Number(item.price || 0), 0),
        quantity: Math.max(Number(item.quantity || 1), 1),
        image: item.image,
      };
    })
    .filter((item) => item.name && item.price >= 0 && item.quantity > 0);

const reserveStock = async (items = []) => {
  await Promise.all(
    items
      .filter((item) => item.productId)
      .map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock = Math.max(product.stock - item.quantity, 0);
          product.inStock = product.stock > 0;
          await product.save();
        }
      })
  );
};

// Create Razorpay Order
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { amount, items, customerInfo } = req.body;
    const totalAmount = Number(amount);

    if (!totalAmount || totalAmount <= 0 || !items?.length || !customerInfo?.name) {
      return res.status(400).json({ message: 'Missing order information' });
    }

    const orderItems = normalizeOrderItems(items);

    if (!orderItems.length) {
      return res.status(400).json({ message: 'Order must contain valid items' });
    }

    if (!hasRazorpayConfig()) {
      if (!allowDemoPayments()) {
        return res.status(503).json({
          success: false,
          message:
            'Online payment is not configured. Add Razorpay keys in backend/.env and restart the server, or use Cash on Delivery.',
        });
      }

      const order = new Order({
        orderId: `DEMO-${Date.now()}`,
        items: orderItems,
        customerInfo,
        totalAmount,
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        orderStatus: 'processing',
        notes: 'Demo online payment completed because Razorpay keys are not configured.',
      });

      await order.save();
      await reserveStock(orderItems);

      const ownerEmail = process.env.OWNER_EMAIL || 'usdglobalweb@gmail.com';
      await emailService.sendOrderConfirmation(order.toObject(), ownerEmail);

      return res.json({
        success: true,
        demo: true,
        orderId: order._id,
        order,
        message: 'Demo payment completed. Add Razorpay keys in .env for live checkout.',
      });
    }

    const razorpay = createRazorpayClient();
    const amountPaise = Math.round(totalAmount * 100);
    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create local order record
    const order = new Order({
      orderId: razorpayOrder.id,
      items: orderItems,
      customerInfo,
      totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
    });

    await order.save();

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: totalAmount,
      amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Razorpay Payment
router.post('/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!hasRazorpayConfig()) {
      return res.status(400).json({ success: false, message: 'Razorpay is not configured' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(razorpay_signature);
    const isSignatureValid =
      expectedBuffer.length === actualBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, actualBuffer);

    if (isSignatureValid) {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (existingOrder.orderId !== razorpay_order_id) {
        return res.status(400).json({
          success: false,
          message: 'Payment does not match this order',
        });
      }

      // Update order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          orderStatus: 'processing',
          paymentId: razorpay_payment_id,
          razorpayPaymentId: razorpay_payment_id,
        },
        { new: true }
      );

      if (existingOrder.paymentStatus !== 'completed') {
        await reserveStock(order.items);
      }

      const ownerEmail = process.env.OWNER_EMAIL || 'usdglobalweb@gmail.com';
      await emailService.sendOrderConfirmation(order.toObject(), ownerEmail);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
