# E-Commerce Backend API

A comprehensive RESTful API for an e-commerce platform built with Node.js, Express.js, MongoDB, and Stripe integration. This backend provides complete functionality for user management, product catalog, shopping cart, order processing, and secure payments.

## 🚀 Features

### Authentication & Authorization
- User registration with email OTP verification
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Buyer, Seller, Admin)
- Secure password hashing with bcrypt
- Email verification system

### Product Management
- CRUD operations for products
- Image upload with Cloudinary integration
- Product search and filtering
- Category-based organization
- Inventory management
- Seller-specific product management

### Payment Processing
- Stripe integration for secure payments
- Payment Intent creation and confirmation
- Webhook handling for payment status
- Automatic order creation on successful payment
- Refund processing for order cancellations

### Order Management
- Order creation and tracking
- Order status updates (Pending, Paid, Shipped, Delivered, Cancelled)
- Order cancellation with automatic refunds
- Stock management and inventory updates
- Order history for users

### Email Notifications
- OTP verification emails
- Order confirmation emails
- Payment status notifications
- Order status updates
- Cancellation confirmations

### Shopping Cart
- Add/remove products from cart
- Quantity management
- Cart persistence per user
- Auto-clear cart after successful payment

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Payment**: Stripe API
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Security**: bcrypt, express-async-handler
- **Environment**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SarveshShahane/E-Commerce-Backend
   cd E-Commerce-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Configuration
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   
   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User
```http
POST /api/auth/logout
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=electronics&search=phone&minPrice=100&maxPrice=1000
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Seller only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "images": [file1, file2]
}
```

#### Update Product (Seller only)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Product (Seller only)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Stripe Customer
```http
POST /api/payment/create-customer
Authorization: Bearer <token>
```

#### Attach Payment Method
```http
POST /api/payment/attach-payment-method
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": "cus_stripe_customer_id",
  "payment_method_id": "pm_stripe_payment_method_id"
}
```

#### Create Payment Intent
```http
POST /api/payment/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "id": "product_id",
      "quantity": 2
    }
  ],
  "customer_id": "cus_stripe_customer_id",
  "currency": "inr"
}
```

#### Stripe Webhook
```http
POST /api/payment/webhook
Content-Type: application/json
Stripe-Signature: webhook_signature
```

### Order Endpoints

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Cancel Order
```http
PATCH /api/orders/:id/cancel
Authorization: Bearer <token>
```

#### Update Order Status (Admin only)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Shipped"
}
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

#### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <token>
```

## 🔒 Security Features

- **Authentication**: JWT tokens with HTTP-only cookies
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing with salt rounds
- **Email Verification**: OTP-based email verification
- **Payment Security**: Stripe webhook signature verification
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling middleware

## 📧 Email Templates

The system includes email templates for:
- Email verification with OTP
- Order confirmation
- Payment status updates
- Order cancellation notifications
- Shipping notifications

## 🗄️ Database Schema

### User Model
- Name, email, password
- Role (buyer/seller/admin)
- Email verification status
- OTP fields for verification

### Product Model
- Name, description, price
- Category, stock quantity
- Images (Cloudinary URLs)
- Seller reference

### Order Model
- User reference, products array
- Total amount, payment status
- Stripe Payment Intent ID
- Shipping address
- Order status and timestamps

### Cart Model
- User reference
- Items array with product and quantity

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are set in production:
- Database connection string
- JWT secret key
- Stripe API keys and webhook secret
- Cloudinary credentials
- Email service credentials

### Webhook Setup
For production, configure Stripe webhooks:
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to environment variables

## 🧪 Testing

Use tools like Postman or Insomnia to test the API endpoints. Import the provided collection for quick testing.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please create an issue in the repository.

---

**Note**: This is a backend API only. Frontend implementation is not included in this project.