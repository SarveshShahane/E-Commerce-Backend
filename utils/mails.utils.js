import transporter from "../config/nodemailer.config.js";

const verificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const verificationMail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is ${code}`,
      html: `<p>Your verification code is <strong>${code}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error creating mail options:", error);
    throw error;
  }
};

const orderConfirmation = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Order Confirmed!</h2>
                    <p>Thank you for your order. Here are the details:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
                        <h3>Order #${orderDetails.id}</h3>
                        <p><strong>Total Amount:</strong> $${
                          orderDetails.totalAmount
                        }</p>
                        <p><strong>Status:</strong> ${orderDetails.status}</p>
                        <p><strong>Order Date:</strong> ${new Date(
                          orderDetails.createdAt
                        ).toLocaleDateString()}</p>
                    </div>
                    
                    <h4>Items Ordered:</h4>
                    <ul>
                        ${orderDetails.products
                          .map(
                            (item) => `
                            <li>${item.product.name} - Quantity: ${item.quantity}</li>
                        `
                          )
                          .join("")}
                    </ul>
                    
                    <p>We'll send you another email when your order ships.</p>
                    <p>Thank you for shopping with us!</p>
                </div>`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const paymentStatus = async (email, amount, success) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Regarding Payment Status`,
    html: `
        <div>
          <h2>Payment Status Update</h2>
          <p>Your payment of $${amount} has been ${
      success ? "successful" : "failed"
    }.</p>
        </div>
        `,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const orderShipped = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Status Update",
    html: `
        <div>
          <h2>Your Order Has Shipped!</h2>
          <p>Order ID: ${orderDetails.id}</p>
        </div>
        `,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const orderDelivered = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Status Update",
    html: `
         <div>
          <h2>Your Order Has Been Delivered!</h2>
          <p>Order ID: ${orderDetails.id}</p>
        </div>
        `,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const orderCancel = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Cancelled!",
    html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc3545;">Order Cancelled</h2>
                    <p>Your order has been successfully cancelled.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
                        <h3>Order #${orderDetails.id}</h3>
                        <p><strong>Refund Amount:</strong> $${
                          orderDetails.totalAmount
                        }</p>
                        <p><strong>Cancelled Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p>Your refund will be processed within 3-5 business days.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
        `,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export {
  verificationCode,
  verificationMail,
  orderConfirmation,
  orderCancel,
  orderDelivered,
  orderShipped,
  paymentStatus,
};
