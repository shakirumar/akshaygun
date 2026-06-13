import nodemailer from 'nodemailer';

let testTransporterPromise = null;

const emailService = {
  // Initialize transporter - defaults to Gmail or custom SMTP
  getTransporter: () => {
    const emailServiceName = process.env.EMAIL_SERVICE || 'gmail';
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;

    if (smtpHost && smtpPort) {
      return nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });
    }

    if (emailUser && emailPassword) {
      return nodemailer.createTransport({
        service: emailServiceName,
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });
    }

    return null;
  },

  createTestTransporter: async () => {
    if (testTransporterPromise) return testTransporterPromise;

    testTransporterPromise = (async () => {
      const testAccount = await nodemailer.createTestAccount();
      console.warn(
        'Email service not configured. Using Ethereal test SMTP for development. Preview URLs will appear in the server console.'
      );
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    })();

    return testTransporterPromise;
  },

  getOwnerEmail: () => process.env.OWNER_EMAIL?.trim() || 'usdglobalweb@gmail.com',

  // Format order details for email
  formatOrderForEmail: (order) => {
    const itemsList = (order.items || [])
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} @ ₹${Number(item.price || 0).toFixed(2)} = ₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}`
      )
      .join('\n');

    return itemsList;
  },

  // Send order confirmation email
  sendOrderConfirmation: async (order, ownerEmailAddress) => {
    let transporter = emailService.getTransporter();
    const isTestFallback = !transporter;

    if (!transporter) {
      transporter = await emailService.createTestTransporter();
    }

    const ownerEmail = ownerEmailAddress || emailService.getOwnerEmail();
    const customerEmail = order.customerInfo?.email;
    const itemsList = emailService.formatOrderForEmail(order);
    const subtotal = (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const tax = subtotal * 0.1;

    const customerEmailHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #10210f 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for your purchase</p>
            </div>
            
            <div style="padding: 30px;">
              <p>Hi ${order.customerInfo?.name || 'Valued Customer'},</p>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> <code style="background: white; padding: 5px 10px; border-radius: 4px;">${order.orderId}</code></p>
                <p style="margin: 10px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                <p style="margin: 10px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                <p style="margin: 10px 0;"><strong>Order Status:</strong> ${order.orderStatus || 'pending'}</p>
              </div>

              <div style="margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">Order Items:</h3>
                <pre style="background: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto;">${itemsList}</pre>
              </div>

              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Tax (10%):</strong> ₹${tax.toFixed(2)}</p>
                <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount:</strong> ₹${(Number(order.totalAmount) || 0).toFixed(2)}</p>
              </div>

              <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                <p style="margin: 0;"><strong>Delivery Address:</strong></p>
                <p style="margin: 10px 0 0 0;">
                  ${order.customerInfo?.address || 'N/A'}<br/>
                  ${order.customerInfo?.city || ''} ${order.customerInfo?.postalCode || ''}<br/>
                  Phone: ${order.customerInfo?.phone || 'N/A'}
                </p>
              </div>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                We will keep you updated about your order status. Thank you for shopping with us!
              </p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>For support, contact us at: ${ownerEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const ownerEmailHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #10210f 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">New Order Received!</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Order ID: ${order.orderId}</p>
            </div>
            
            <div style="padding: 30px;">
              <p><strong>New Order Details:</strong></p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Customer Name:</strong> ${order.customerInfo?.name || 'N/A'}</p>
                <p style="margin: 10px 0;"><strong>Customer Email:</strong> ${order.customerInfo?.email || 'N/A'}</p>
                <p style="margin: 10px 0;"><strong>Phone:</strong> ${order.customerInfo?.phone || 'N/A'}</p>
                <p style="margin: 10px 0;"><strong>Delivery Address:</strong> ${order.customerInfo?.address || 'N/A'}</p>
              </div>

              <div style="margin: 20px 0;">
                <h3 style="margin-bottom: 15px;">Order Items:</h3>
                <pre style="background: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto;">${itemsList}</pre>
              </div>

              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Tax:</strong> ₹${tax.toFixed(2)}</p>
                <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount:</strong> ₹${(Number(order.totalAmount) || 0).toFixed(2)}</p>
              </div>

              <div style="background: #fef3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                <p style="margin: 10px 0 0 0;"><strong>Payment Status:</strong> ${order.paymentStatus || 'pending'}</p>
              </div>
            </div>

            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>This is an automated notification from your order system.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Send to customer if email exists
      if (customerEmail) {
        const infoCustomer = await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@example.com',
          to: customerEmail,
          subject: `Order Confirmation - ${order.orderId}`,
          html: customerEmailHTML,
        });

        if (isTestFallback) {
          console.log('Customer email preview URL:', nodemailer.getTestMessageUrl(infoCustomer));
        }
      } else {
        console.warn('No customer email provided for order:', order.orderId);
      }

      // Send to owner/merchant for every order
      if (ownerEmail) {
        const infoOwner = await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@example.com',
          to: ownerEmail,
          subject: `New Order - ${order.orderId}`,
          html: ownerEmailHTML,
        });

        if (isTestFallback) {
          console.log('Owner email preview URL:', nodemailer.getTestMessageUrl(infoOwner));
        }
      }

      console.log(`Order confirmation emails sent for order ${order.orderId}`);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error.message);
      return false;
    }
  },

  // Send order cancellation email
  sendCancellationEmail: async (order, ownerEmail) => {
    let transporter = emailService.getTransporter();
    const isTestFallback = !transporter;

    if (!transporter) {
      transporter = await emailService.createTestTransporter();
    }

    const customerEmail = order.customerInfo?.email;
    if (!customerEmail) return false;

    const emailHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">Order Cancelled</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Order ID: ${order.orderId}</p>
            </div>
            
            <div style="padding: 30px;">
              <p>Hi ${order.customerInfo?.name || 'Valued Customer'},</p>
              <p>Your order has been cancelled as requested.</p>
              
              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <p style="margin: 0;"><strong>Cancellation Details:</strong></p>
                <p style="margin: 10px 0 0 0;">Order Number: ${order.orderId}</p>
                <p style="margin: 5px 0;">Cancellation Date: ${new Date().toLocaleDateString('en-IN')}</p>
                <p style="margin: 5px 0;">Refund Amount: ₹${(Number(order.totalAmount) || 0).toFixed(2)}</p>
              </div>

              <p style="color: #666; font-size: 14px;">
                The refund will be processed within 5-7 business days.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const infoCustomer = await transporter.sendMail({
        from: process.env.EMAIL_USER || 'no-reply@example.com',
        to: customerEmail,
        subject: `Order Cancellation - ${order.orderId}`,
        html: emailHTML,
      });

      if (isTestFallback) {
        console.log('Customer cancellation preview URL:', nodemailer.getTestMessageUrl(infoCustomer));
      }

      if (ownerEmail && ownerEmail !== customerEmail) {
        const infoOwner = await transporter.sendMail({
          from: process.env.EMAIL_USER || 'no-reply@example.com',
          to: ownerEmail,
          subject: `Order Cancelled - ${order.orderId}`,
          html: emailHTML,
        });

        if (isTestFallback) {
          console.log('Owner cancellation preview URL:', nodemailer.getTestMessageUrl(infoOwner));
        }
      }

      console.log(`Cancellation email sent for order ${order.orderId}`);
      return true;
    } catch (error) {
      console.error('Error sending cancellation email:', error.message);
      return false;
    }
  },
};

export default emailService;
