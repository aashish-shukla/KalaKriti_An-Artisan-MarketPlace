# Local Artisan Marketplace - Backend API

A production-ready, scalable backend for a Local Artisan Marketplace built with Node.js, Express.js, MongoDB, and Mongoose.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control (Buyer, Seller, Admin)
- **User Management**: Complete profile management, shopping cart, wishlist functionality
- **Shop Management**: Seller shops with analytics, verification, and ratings
- **Product Management**: Full CRUD operations, inventory tracking, categories, search, and filtering
- **Order Management**: Complete order lifecycle with status tracking and cancellation
- **Review System**: Product reviews with ratings, verified purchases, and helpful marking
- **Admin Dashboard**: Platform management with analytics and user/shop moderation
- **Search & Filtering**: Advanced product search with multiple filter options

### Technical Features
- **Security**: Rate limiting, input sanitization, helmet protection, JWT tokens
- **Error Handling**: Comprehensive error handling with detailed logging
- **Validation**: Robust input validation using express-validator
- **Logging**: Winston-based logging system
- **Scalable Architecture**: Modular design with separation of concerns
- **API Documentation**: RESTful API with consistent responses
- **Database Optimization**: MongoDB indexes for improved query performance

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm or yarn

## 🛠️ Installation

### 1. Clone and Navigate
```bash
cd "/Users/aashishshukla/Music/mydata/New Folder With Items/Marketplace"
```

### 2. Environment Configuration
The `.env` file has been created. Update it with your actual values:

```bash
# Open and edit .env file
nano .env
```

**Required Environment Variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT (use a long random string)
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens

Optional variables for full functionality:
- Email configuration (SMTP)
- Cloudinary credentials (for image uploads)
- Stripe keys (for payments)

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod
```

### 4. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
Marketplace/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── env.js        # Environment variables
│   │   └── constants.js  # Application constants
│   ├── models/           # Mongoose models
│   │   ├── User.js       # User model with auth
│   │   ├── Shop.js       # Shop/Store model
│   │   ├── Product.js    # Product model
│   │   ├── Order.js      # Order model
│   │   ├── Review.js     # Review model
│   │   └── Category.js   # Category model
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── shopController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── routes/          # Express routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── shopRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── upload.js
│   │   └── validator.js
│   ├── utils/           # Utility functions
│   │   ├── logger.js    # Winston logger
│   │   ├── responses.js # API response helpers
│   │   ├── validation.js
│   │   └── helpers.js
│   └── app.js           # Express app setup
├── logs/                # Application logs
├── .env                 # Environment variables
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js            # Server entry point
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```http
GET /health
```

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Products

#### Get All Products
```http
GET /api/v1/products?page=1&limit=20&category=<id>&minPrice=10&maxPrice=100
```

#### Get Single Product
```http
GET /api/v1/products/:id
```

#### Create Product (Seller)
```http
POST /api/v1/products
Authorization: Bearer <seller-token>
Content-Type: application/json

{
  "name": "Handmade Pottery",
  "description": "Beautiful handcrafted pottery",
  "price": 45.99,
  "category": "<category-id>",
  "inventory": {
    "stock": 10,
    "sku": "POT-001"
  },
  "images": [
    { "url": "https://example.com/image.jpg", "isPrimary": true }
  ]
}
```

### Orders

#### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "<product-id>",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "country": "USA",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "payment": {
    "method": "card"
  }
}
```

#### Get Orders
```http
GET /api/v1/orders
Authorization: Bearer <token>
```

### Cart

#### Add to Cart
```http
POST /api/v1/users/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "<product-id>",
  "quantity": 1
}
```

#### Get Cart
```http
GET /api/v1/users/cart
Authorization: Bearer <token>
```

### Shops

#### Get All Shops
```http
GET /api/v1/shops
```

#### Create Shop (Seller)
```http
POST /api/v1/shops
Authorization: Bearer <seller-token>
Content-Type: application/json

{
  "name": "Artisan Crafts Co",
  "description": "Quality handmade crafts",
  "contactInfo": {
    "email": "shop@example.com",
    "phone": "+1234567890"
  }
}
```

### Reviews

#### Get Product Reviews
```http
GET /api/v1/products/:productId/reviews
```

#### Create Review
```http
POST /api/v1/products/:productId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Great product!",
  "comment": "Really love this item."
}
```

### Admin

#### Get Dashboard Stats
```http
GET /api/v1/admin/dashboard
Authorization: Bearer <admin-token>
```

#### Update Shop Status
```http
PUT /api/v1/admin/shops/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "active"
}
```

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 🔐 User Roles

- **Buyer**: Can browse, purchase, review products, manage cart/wishlist
- **Seller**: Can create shops, manage products, view orders, respond to reviews
- **Admin**: Full platform access, user/shop moderation, analytics

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes |
| `SMTP_*` | Email configuration | No |
| `CLOUDINARY_*` | Image upload configuration | No |
| `STRIPE_*` | Payment processing | No |

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name artisan-marketplace
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t artisan-marketplace .
docker run -p 5000:5000 artisan-marketplace
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Sanitization**: Protection against NoSQL injection
- **Helmet**: Security headers
- **CORS**: Configured cross-origin resource sharing
- **Validation**: Comprehensive input validation

## 📈 Performance Optimizations

- **Database Indexes**: Optimized MongoDB queries
- **Compression**: Gzip compression for responses
- **Pagination**: Efficient data loading
- **Caching**: Ready for Redis integration
- **Connection Pooling**: MongoDB connection pooling

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### npm Vulnerabilities
```bash
# Audit and fix
npm audit
npm audit fix
```

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Email: support@artisanmarketplace.com

## 📄 License

MIT

## 👥 Contributors

- Senior Backend Engineer & System Designer

---

**Built with ❤️ for the Artisan Community**
