import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Cafe Crown" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Cafe Crown Verification Code",
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Cafe Crown</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #E8A040; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendReceipt = async (to: string, orderData: any) => {
  const itemsHtml = orderData.items
    .map((item: any) => `<tr><td>${item.qty}x ${item.name}</td><td style="text-align: right;">₹${item.price * item.qty}</td></tr>`)
    .join("");

  const mailOptions = {
    from: `"Cafe Crown" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order Confirmation - #${orderData.id}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #2D5A3D;">Cafe Crown</h2>
        <h3 style="text-align: center;">Order Confirmed! 🎉</h3>
        <p>Hi ${orderData.customerName},</p>
        <p>Your order <strong>#${orderData.id}</strong> has been successfully placed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #ddd; text-align: left;">
              <th style="padding-bottom: 10px;">Item</th>
              <th style="padding-bottom: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid #ddd;">
              <td style="padding-top: 10px;"><strong>Total</strong></td>
              <td style="padding-top: 10px; text-align: right;"><strong>₹${orderData.total}</strong></td>
            </tr>
          </tfoot>
        </table>
        <br/>
        <p>We are preparing your food! You will receive WhatsApp updates as the status changes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
