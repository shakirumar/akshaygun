import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import emailService from '../services/emailService.js';

const router = express.Router();

const normalizeOrderItems = (items = []) =>
  items.map((item) => ({
    productId: mongoose.Types.ObjectId.isValid(item.productId || item._id) ? item.productId || item._id : undefined,
    name: item.name,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    image: item.image,
  }));

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

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Admin login required' });
  }

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secretkey');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired admin login' });
  }
};

// Get all orders
router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order (COD)
router.post('/', async (req, res) => {
  const items = normalizeOrderItems(req.body.items);
  const order = new Order({
    orderId: `ORD-${Date.now()}`,
    items,
    customerInfo: req.body.customerInfo,
    totalAmount: req.body.totalAmount,
    paymentMethod: req.body.paymentMethod || 'cod',
    paymentStatus: req.body.paymentStatus || 'pending',
    orderStatus: req.body.orderStatus || 'pending',
  });

  try {
    const newOrder = await order.save();
    if (newOrder.paymentMethod === 'cod') {
      await reserveStock(items);
    }

    // Send order confirmation email
    const ownerEmail = process.env.OWNER_EMAIL || 'usdglobalweb@gmail.com';
    await emailService.sendOrderConfirmation(newOrder.toObject(), ownerEmail);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    // First fetch the order to check its current status
    const orderToCancel = await Order.findOne(query);

    if (!orderToCancel) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(orderToCancel.orderStatus)) {
      return res.status(400).json({ 
        message: `Cannot cancel order with status "${orderToCancel.orderStatus}". Only pending or processing orders can be cancelled.` 
      });
    }

    // Now update the order
    const updatedOrder = await Order.findOneAndUpdate(
      query,
      {
        orderStatus: 'cancelled',
        paymentStatus: 'refunded',
      },
      { new: true }
    );

    // Send cancellation email
    const ownerEmail = process.env.OWNER_EMAIL || 'usdglobalweb@gmail.com';
    await emailService.sendCancellationEmail(updatedOrder.toObject(), ownerEmail);

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send email notification for order updates
router.post('/:id/send-notification', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Valid email address is required' });
  }

  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send notification email
    const notificationHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #10210f 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">Order Update</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Order ID: ${order.orderId}</p>
            </div>
            
            <div style="padding: 30px;">
              <p>Hi there,</p>
              <p>Here is the latest update on your order:</p>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderId}</p>
                <p style="margin: 5px 0;"><strong>Current Status:</strong> ${order.orderStatus}</p>
                <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${(Number(order.totalAmount) || 0).toFixed(2)}</p>
              </div>

              ${message ? `<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 10px 0 0 0;">${message}</p>
              </div>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = emailService.getTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Order Update - ${order.orderId}`,
        html: notificationHTML,
      });
    } else {
      console.log('[TEST MODE] Notification email would be sent to:', email);
    }

    res.json({ message: 'Notification email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status & payment status (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();

    // Try to send email notification to customer about status change
    try {
      const email = updatedOrder.customerInfo?.email;
      if (email) {
        const notificationHTML = `
          <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #1f2937 0%, #10210f 100%); color: white; padding: 30px; text-align: center;">
                  <h1 style="margin: 0;">Order Status Update</h1>
                  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Order ID: ${updatedOrder.orderId}</p>
                </div>
                
                <div style="padding: 30px;">
                  <p>Hi ${updatedOrder.customerInfo?.name || 'there'},</p>
                  <p>Your order status has been updated. Here are the details:</p>
                  
                  <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Order Number:</strong> ${updatedOrder.orderId}</p>
                    <p style="margin: 5px 0;"><strong>New Order Status:</strong> <span style="text-transform: capitalize; font-weight: bold; color: #047857;">${updatedOrder.orderStatus}</span></p>
                    <p style="margin: 5px 0;"><strong>New Payment Status:</strong> <span style="text-transform: capitalize; font-weight: bold; color: #047857;">${updatedOrder.paymentStatus}</span></p>
                    <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${(Number(updatedOrder.totalAmount) || 0).toFixed(2)}</p>
                  </div>

                  <p style="color: #666; font-size: 14px; margin-top: 25px;">
                    Thank you for shopping with us! If you have any questions, please contact our support team.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;
        const transporter = emailService.getTransporter();
        if (transporter) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Update - ${updatedOrder.orderId}`,
            html: notificationHTML,
          });
        }
      }
    } catch (emailErr) {
      console.warn('Failed to send status update notification email:', emailErr.message);
    }

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    const order = await Order.findOneAndDelete(query);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

