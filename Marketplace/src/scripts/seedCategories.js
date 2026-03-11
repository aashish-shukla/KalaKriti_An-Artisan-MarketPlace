// Marketplace/src/scripts/seedCategories.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Category = require('../models/Category');

const categories = [
  {
    name: 'Pottery',
    description: 'Handcrafted pottery including bowls, vases, mugs, and decorative ceramics',
    isActive: true,
    order: 1,
  },
  {
    name: 'Jewelry',
    description: 'Unique handmade jewelry including rings, necklaces, earrings, and bracelets',
    isActive: true,
    order: 2,
  },
  {
    name: 'Textiles',
    description: 'Hand-woven fabrics, quilts, tapestries, and textile art',
    isActive: true,
    order: 3,
  },
  {
    name: 'Woodwork',
    description: 'Handcrafted wooden furniture, décor, cutting boards, and sculptures',
    isActive: true,
    order: 4,
  },
  {
    name: 'Paintings & Art',
    description: 'Original paintings, prints, illustrations, and mixed-media artwork',
    isActive: true,
    order: 5,
  },
  {
    name: 'Gifts & Accessories',
    description: 'Unique handcrafted gifts, keychains, bookmarks, and personal accessories',
    isActive: true,
    order: 6,
  },
  {
    name: 'Home Décor',
    description: 'Handmade candles, wall hangings, decorative items, and home furnishings',
    isActive: true,
    order: 7,
  },
  {
    name: 'Leather Goods',
    description: 'Handcrafted leather bags, wallets, belts, and accessories',
    isActive: true,
    order: 8,
  },
  {
    name: 'Metal Craft',
    description: 'Handcrafted metalwork including sculptures, utensils, and decorative pieces',
    isActive: true,
    order: 9,
  },
  {
    name: 'Stationery',
    description: 'Handmade paper products, journals, notebooks, and stationery sets',
    isActive: true,
    order: 10,
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check existing categories
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing categories. Skipping seed.`);
      console.log('To re-seed, delete existing categories first.');
      process.exit(0);
    }

    // Insert categories
    const created = await Category.create(categories);
    console.log(`✅ Successfully seeded ${created.length} categories:`);
    created.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedCategories();
