const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter with Brevo or other SMTP
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(htmlContent, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: htmlContent,           // Direct HTML content
      text: convert(htmlContent)   // Auto-generate text version
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h1>Welcome to NatureQuest, ${this.firstName}!</h1>
        <p>We’re excited to have you on board.</p>
        <p>Click below to get started:</p>
        <a href="${this.url}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px;">
          Get Started
        </a>
      </div>
    `;
    await this.send(html, 'Welcome to NatureQuest!');
  }

  async sendPasswordReset() {
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h1>Password Reset Request</h1>
        <p>Hello ${this.firstName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${this.url}" 
           style="background-color: #FF5733; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link is valid for 10 minutes.</p>
      </div>
    `;
    await this.send(html, 'Your password reset token (valid for 10 minutes)');
  }
}

module.exports = Email;
