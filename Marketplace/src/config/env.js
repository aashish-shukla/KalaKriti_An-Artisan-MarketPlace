require('dotenv').config();

const defaultLocalMongoUri = 'mongodb://127.0.0.1:27017/artisan-marketplace';
const primaryMongoUri = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI;
const fallbackMongoUri = process.env.MONGODB_URI_LOCAL || defaultLocalMongoUri;

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  mongodb: {
    uri: primaryMongoUri,
    fallbackUri: fallbackMongoUri,
    getConnectionUris() {
      return [primaryMongoUri, fallbackMongoUri].filter((uri, index, uris) => Boolean(uri) && uris.indexOf(uri) === index);
    },
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.FROM_EMAIL,
    fromName: process.env.FROM_NAME,
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  },
  
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
