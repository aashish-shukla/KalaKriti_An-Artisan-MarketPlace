// artisan/src/lib/i18n/locales/bn.ts — Bengali (compact)
import type { TranslationKeys } from './en';
import en from './en';

// Deep merge helper to fill missing keys with English
function deepMerge(target: any, source: any): any {
  const result = { ...source };
  for (const key in target) {
    if (typeof target[key] === 'object' && !Array.isArray(target[key])) {
      result[key] = deepMerge(target[key], source[key] || {});
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

const bnPartial = {
  common: { appName: 'কলাকৃতি', loading: 'লোড হচ্ছে...', save: 'সংরক্ষণ', cancel: 'বাতিল', delete: 'মুছুন', edit: 'সম্পাদনা', update: 'আপডেট', submit: 'জমা দিন', confirm: 'নিশ্চিত', back: 'পিছনে', next: 'পরবর্তী', close: 'বন্ধ', search: 'অনুসন্ধান', viewAll: 'সব দেখুন', noResults: 'কোনো ফলাফল পাওয়া যায়নি', error: 'কিছু ভুল হয়েছে', success: 'সফল', addToCart: 'কার্টে যোগ করুন', addedToCart: 'কার্টে যোগ হয়েছে!', outOfStock: 'স্টকে নেই', featured: 'বিশেষ', products: 'পণ্য' },
  nav: { home: 'হোম', products: 'পণ্য', explore: 'অন্বেষণ', cart: 'কার্ট', login: 'লগইন', signUp: 'সাইন আপ', logIn: 'লগ ইন', logOut: 'লগ আউট', logout: 'লগআউট', myAccount: 'আমার অ্যাকাউন্ট', orders: 'অর্ডার', myOrders: 'আমার অর্ডার', wishlist: 'পছন্দের তালিকা', sellerDashboard: 'বিক্রেতা ড্যাশবোর্ড', adminDashboard: 'অ্যাডমিন ড্যাশবোর্ড', accountSettings: 'অ্যাকাউন্ট সেটিংস', signInPrompt: 'সাইন ইন করুন' },
  home: { heroTag: 'আবেগ দিয়ে হস্তনির্মিত', heroTitle1: 'অনন্য আবিষ্কার করুন', heroTitle2: 'সম্পদ', heroSubtitle: 'স্থানীয় কারিগরদের সমর্থন করুন।', exploreProducts: 'পণ্য দেখুন', becomeASeller: 'বিক্রেতা হন', artisans: 'কারিগর', happyBuyers: 'সন্তুষ্ট ক্রেতা', shopByCategory: 'বিভাগ অনুসারে কিনুন', browseCurated: 'আমাদের সংগ্রহ দেখুন', handPicked: 'হাতে বাছাই', featuredProducts: 'বিশেষ পণ্য', noFeaturedProducts: 'এখনো কোনো বিশেষ পণ্য নেই', popular: 'জনপ্রিয়', trendingNow: 'ট্রেন্ডিং', noTrendingProducts: 'এখনো কোনো ট্রেন্ডিং পণ্য নেই', forArtisans: 'কারিগরদের জন্য', ctaTitle: 'আপনার কলাকৃতি যাত্রা শুরু করুন', ctaSubtitle: 'হাজার হাজার কারিগরের সাথে যোগ দিন।', ctaBenefit1: '৫ মিনিটে সহজ সেটআপ', ctaBenefit2: 'কম কমিশন ফি', ctaBenefit3: 'নিবেদিত বিক্রেতা সহায়তা', ctaBenefit4: 'বৈশ্বিক বাজার', openShop: 'আজই দোকান খুলুন', activeSellers: 'সক্রিয় বিক্রেতা', happyCustomers: 'সন্তুষ্ট গ্রাহক', totalSales: 'মোট বিক্রয়', averageRating: 'গড় রেটিং', featuredShops: 'বিশেষ দোকান', featuredShopsDesc: 'প্রতিভাবান কারিগর আবিষ্কার করুন', verifiedSeller: 'যাচাইকৃত', visitShop: 'দোকান দেখুন', productsCount: '{count}টি পণ্য', salesCount: '{count}টি বিক্রয়', testimonials: 'আমাদের সম্প্রদায় কি বলে', testimonialsDesc: 'কলাকৃতি ভালোবাসে এমন মানুষের গল্প', newsletterTitle: 'সংযুক্ত থাকুন', newsletterSubtitle: 'বিশেষ অফার ও নতুন আগমনের খবর পান।', newsletterPlaceholder: 'ইমেল ঠিকানা দিন', newsletterButton: 'সাবস্ক্রাইব', newsletterSuccess: 'সফলভাবে সাবস্ক্রাইব!', newsletterDisclaimer: 'সাবস্ক্রাইব করে আমাদের গোপনীয়তা নীতিতে সম্মত।' },
  search: { placeholder: 'হস্তশিল্প পণ্য খুঁজুন...', searching: 'খোঁজা হচ্ছে...', noProducts: 'কোনো পণ্য নেই', viewAllResults: '"{query}" এর সব ফলাফল দেখুন' },
  footer: { description: 'প্রতিভাবান কারিগরদের অনন্য হস্তশিল্প পণ্য আবিষ্কার করুন।', shop: 'কেনাকাটা', allProducts: 'সব পণ্য', featured: 'বিশেষ', newArrivals: 'নতুন আগমন', bestSellers: 'সেরা বিক্রেতা', support: 'সহায়তা', helpCenter: 'সহায়তা কেন্দ্র', shippingInfo: 'শিপিং তথ্য', returns: 'ফেরত', contactUs: 'যোগাযোগ', sell: 'বিক্রি', becomeASeller: 'বিক্রেতা হন', sellerDashboard: 'বিক্রেতা ড্যাশবোর্ড', sellerGuide: 'বিক্রেতা গাইড', successStories: 'সাফল্যের গল্প', legal: 'আইনি', privacyPolicy: 'গোপনীয়তা নীতি', termsOfService: 'সেবার শর্তাবলী', cookiePolicy: 'কুকি নীতি', refundPolicy: 'ফেরত নীতি', copyright: '© {year} কলাকৃতি। সর্বস্বত্ব সংরক্ষিত।', madeWith: 'তৈরি', forArtisans: 'কারিগরদের জন্য' },
};

const bn: TranslationKeys = deepMerge(bnPartial, en);
export default bn;
