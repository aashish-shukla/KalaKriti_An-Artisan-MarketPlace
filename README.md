# 🛍️ Artisan Marketplace

A complete, production-ready e-commerce platform connecting local artisans with customers. Built with modern web technologies and best practices.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-blue)
![Backend](https://img.shields.io/badge/Backend-Express%204-green)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### For Buyers
- 🔍 **Product Discovery** - Browse products with advanced search and filters
- 🛒 **Shopping Cart** - Persistent cart with real-time updates
- 💳 **Secure Checkout** - Multiple payment methods with Stripe integration
- 📦 **Order Tracking** - Real-time order status updates
- ⭐ **Reviews & Ratings** - Rate and review purchased products
- ❤️ **Wishlist** - Save favorite products for later
- 🔔 **Real-time Notifications** - Get instant updates via WebSocket

### For Sellers
- 📊 **Analytics Dashboard** - Revenue charts and sales statistics
- 📦 **Inventory Management** - Add, edit, and track products
- 🏪 **Shop Management** - Customize shop profile and settings
- 📈 **Sales Reports** - Track performance metrics
- 🔔 **Order Alerts** - Instant notifications for new orders
- 📉 **Low Stock Alerts** - Get notified when inventory runs low

### For Admins
- 👥 **User Management** - Manage platform users
- 🏪 **Shop Approval** - Review and approve new shops
- 📊 **Platform Analytics** - Monitor overall platform health
- ✅ **Shop Verification** - Verify legitimate businesses
- 📈 **Growth Metrics** - Track platform growth

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

```bash
# Run the automated setup script
./start.sh

# OR manually:

# 1. Install backend dependencies
cd Marketplace
npm install

# 2. Setup backend environment
cp .env.example .env
# Edit .env with your configuration

# 3. Install frontend dependencies
cd ../artisan
npm install

# Frontend .env.local is already configured
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd Marketplace
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd artisan
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📁 Project Structure

```
Artisan-MarketPlace/
├── artisan/                 # Frontend (Next.js + TypeScript)
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (main)/          # Public pages
│   │   ├── (account)/       # User account pages
│   │   ├── (seller)/        # Seller dashboard
│   │   └── (admin)/         # Admin dashboard
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API, stores
│   │   └── types/           # TypeScript definitions
│   └── .env.local           # Frontend config
│
├── Marketplace/             # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   ├── server.js            # Entry point
│   └── .env                 # Backend config
│
├── PROJECT_STATUS.md        # Complete feature audit
└── start.sh                 # Quick start script
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Real-time:** Socket.io Client
- **UI Components:** Custom component library
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT
- **Real-time:** Socket.io
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Payment:** Stripe
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Winston

## 📚 Documentation

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Complete feature audit and checklist
- **[artisan/SETUP.md](./artisan/SETUP.md)** - Frontend setup guide
- **[Marketplace/README.md](./Marketplace/README.md)** - Backend API documentation

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ MongoDB injection prevention
- ✅ Security headers with Helmet
- ✅ Environment-based configuration

## 🧪 Testing

```bash
# Backend tests
cd Marketplace
npm test

# Frontend tests (setup required)
cd artisan
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/forgot-password` - Password reset

### Products
- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/:slug` - Get product details
- `POST /api/v1/products` - Create product (seller)
- `PATCH /api/v1/products/:id` - Update product (seller)
- `DELETE /api/v1/products/:id` - Delete product (seller)

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order
- `PATCH /api/v1/orders/:id/status` - Update status

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/:slug` - Get category

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `POST /api/v1/notifications/read-all` - Mark all read

### Shops
- `GET /api/v1/shops` - List shops
- `POST /api/v1/shops` - Create shop
- `PATCH /api/v1/shops/:id` - Update shop

### Admin
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/shops/pending` - Pending approvals
- `PATCH /api/v1/admin/shops/:id/approve` - Approve shop

## 🌐 WebSocket Events

### Client → Server
- `connection` - Establish connection with auth token

### Server → Client
- `notification` - Receive real-time notification
- `order:status` - Order status changed
- `message` - Direct message

## 🔧 Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000
NEXT_PUBLIC_IMAGE_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Artisan Marketplace
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/artisan-marketplace
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
API_VERSION=v1

# Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

STRIPE_SECRET_KEY=your-stripe-secret-key
```

## 📈 Performance

- ✅ Server-side rendering for SEO
- ✅ Image optimization with Next.js Image
- ✅ API response caching with React Query
- ✅ Client-side state persistence
- ✅ Lazy loading components
- ✅ Database indexing
- ✅ Response compression

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
cd artisan
vercel deploy
```

### Backend (Railway/Heroku)
```bash
cd Marketplace
git push railway main
# or
git push heroku main
```

### Database (MongoDB Atlas)
1. Create cluster at https://cloud.mongodb.com
2. Update MONGODB_URI in backend .env
3. Whitelist deployment IP addresses

## 🤝 Contributing

This is a complete production-ready application. For contributions:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For issues or questions:
- Create an issue in the repository
- Check documentation in PROJECT_STATUS.md

## ✅ Project Status

**Current Status:** ✅ **100% Complete - Production Ready**

All features implemented:
- ✅ User authentication & authorization
- ✅ Product management (CRUD)
- ✅ Shopping cart & checkout
- ✅ Order processing & tracking
- ✅ Real-time notifications
- ✅ Seller dashboard with analytics
- ✅ Admin dashboard
- ✅ Search & filters
- ✅ Reviews & ratings
- ✅ Wishlist functionality
- ✅ WebSocket real-time updates
- ✅ Email notifications
- ✅ Payment integration
- ✅ Security measures

---

**Built with ❤️ for local artisans and their customers**
