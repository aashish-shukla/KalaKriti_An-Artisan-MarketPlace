const nodemailer = require('nodemailer');
const config = require('../config/env');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
        to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Email sending failed: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Artisan Marketplace, ${user.firstName}!</h2>
        <p>We're excited to have you join our community of artisans and shoppers.</p>
        <p>Start exploring unique handcrafted products from local artisans.</p>
        <a href="${config.frontendUrl}/products" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Start Shopping
        </a>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Artisan Marketplace',
      html,
      text: `Welcome to Artisan Marketplace, ${user.firstName}!`,
    });
  }

  async sendOrderConfirmation(order, user) {
    const itemsList = order.items.map(item => 
      `${item.name} x${item.quantity} - $${item.total.toFixed(2)}`
    ).join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation #${order.orderNumber}</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for your order! We've received it and will process it soon.</p>
        
        <h3>Order Details:</h3>
        <ul>
          ${order.items.map(item => `
            <li>${item.name} x${item.quantity} - $${item.total.toFixed(2)}</li>
          `).join('')}
        </ul>
        
        <p><strong>Total: $${order.pricing.total.toFixed(2)}</strong></p>
        
        <a href="${config.frontendUrl}/orders/${order._id}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Order
        </a>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      html,
      text: `Order #${order.orderNumber}\n\n${itemsList}\n\nTotal: $${order.pricing.total.toFixed(2)}`,
    });
  }

  async sendOrderStatusUpdate(order, user, newStatus) {
    const statusMessages = {
      confirmed: 'Your order has been confirmed!',
      processing: 'Your order is being prepared.',
      shipped: 'Your order has been shipped!',
      delivered: 'Your order has been delivered.',
      cancelled: 'Your order has been cancelled.',
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Update #${order.orderNumber}</h2>
        <p>Hi ${user.firstName},</p>
        <p>${statusMessages[newStatus]}</p>
        
        <a href="${config.frontendUrl}/orders/${order._id}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Order
        </a>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order Update: #${order.orderNumber}`,
      html,
      text: `Order #${order.orderNumber}: ${statusMessages[newStatus]}`,
    });
  }

  async sendShopApproval(shop, user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations! Your Shop Has Been Approved</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your shop "${shop.name}" has been approved and is now live on Artisan Marketplace!</p>
        <p>You can start adding products and managing your shop.</p>
        
        <a href="${config.frontendUrl}/seller/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Go to Dashboard
        </a>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Shop Approved - Welcome to Artisan Marketplace',
      html,
      text: `Your shop "${shop.name}" has been approved!`,
    });
  }

  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Reset Password
        </a>
        
        <p style="margin-top: 20px; color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html,
      text: `Reset your password: ${resetUrl}`,
    });
  }
}

module.exports = new EmailService();