module.exports = {
  USER_ROLES: {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  },
  
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },
  
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  
  PAYMENT_METHOD: {
    CARD: 'card',
    CASH_ON_DELIVERY: 'cash_on_delivery',
    WALLET: 'wallet',
  },
  
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
    DRAFT: 'draft',
  },
  
  SHOP_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING_APPROVAL: 'pending_approval',
  },
  
  IMAGE_CATEGORIES: {
    PRODUCT: 'product',
    PROFILE: 'profile',
    SHOP: 'shop',
    BANNER: 'banner',
  },
  
  MAX_IMAGES_PER_PRODUCT: 5,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};
